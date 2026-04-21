import { ForMutate, type ITransactionManager, type Mutable } from "@applications/interfaces/itransaction-manager";
import { CourseID } from "@domain/contexts/content/course";
import type { AnswerID, QuestionID } from "@domain/contexts/content/question";
import type { TopicID } from "@domain/contexts/content/topic";
import type { UserID } from "@domain/contexts/identity/user";
import { Enrollment, EnrollmentProgress } from "@domain/contexts/learning/enrollment/aggregate";
import { TopicEnrollmentAttempt } from "@domain/contexts/learning/enrollment/topic-enrollment";
import { DomainError, ErrNotFound } from "@shared/error";


// #region Commands
export type EnrollCourseCMD = {
    userID: UserID,
    courseID: CourseID
}

export type StartTopicCMD = {
    userID: UserID,
    topicID: TopicID,
}

export type CompleteTopicCMD = {
    topicID: TopicID,
    userID: UserID,
    questionAnswers: Map<QuestionID, Array<AnswerID>>
}
// #endregion


// #region Errors
const ErrAlreadyEnroll = new DomainError("ALREADY_ENROLLED")
const ErrNotEnrolled = new DomainError("NOT_ENROLLED_AT_COURSE")
const ErrCanNotAnswer = new DomainError("CANNOT_ANSWER")
const ErrQuestionCountMismatch = new DomainError("QUESTION_COUNT_MISMATCH")
// #endregion


// #region Service
export default class LearningService {
    constructor (
        private txmanager: ITransactionManager,
    ) {}


    enrollCourse(cmd: EnrollCourseCMD) {
        return this.txmanager.begin(async uow => {
            if (await uow.enrolls.isUserEnrolled(cmd.userID, cmd.courseID)) throw ErrAlreadyEnroll

            const topicCount = await uow.topics.countByCourse(cmd.courseID)

            const enroll = Enrollment.create(
                cmd.userID,
                cmd.courseID,
                EnrollmentProgress.createNullish(topicCount)
            ) as Mutable<Enrollment>

            await uow.enrolls.save(enroll)

            return enroll.id
        })
    }


    startTopic(cmd: StartTopicCMD) {
        return this.txmanager.begin(async uow => {
            const topic =  await uow.topics.getByID(cmd.topicID)
            if (!topic) throw ErrNotFound

            const enroll = await uow.enrolls.getByUserAndCourse(cmd.userID, topic.courseID)
            if(!enroll) throw ErrNotEnrolled

            const previousTopic = await uow.topics.getPrevious(topic.id)

            if (!enroll.canStartNextTopic(previousTopic?.id)) throw ErrCanNotAnswer

            return topic.id
        })
    }


    completeTopic(cmd: CompleteTopicCMD) {
        return this.txmanager.begin(async uow => {
            const topic = await uow.topics.getByID(cmd.topicID)
            if (!topic) throw ErrNotFound

            const enroll = await uow.enrolls.getByUserAndCourse(cmd.userID, topic.courseID, ForMutate)
            if(!enroll) throw ErrNotEnrolled

            const previousTopic = await uow.topics.getPrevious(topic.id)

            if (!enroll.canStartNextTopic(previousTopic?.id)) throw ErrCanNotAnswer

            const questions = await uow.questions.listByTopic(topic.id)

            if (cmd.questionAnswers.size !== questions.length) throw ErrQuestionCountMismatch

            const completedQuestionCount = questions.filter(question => 
                    question.checkAnswers(
                        cmd.questionAnswers.get(question.id) || []
                    )
                ).length

            const attempt = TopicEnrollmentAttempt.create(
                completedQuestionCount,
                questions.length
            ) 

            enroll.registerAttempt(attempt, topic.id)

            await uow.enrolls.save(enroll)

            return enroll.id
        })
    }
}
// #endregion
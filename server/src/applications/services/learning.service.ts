import type { ITransactionManager } from "@applications/interfaces/itransaction-manager";
import type { ID } from "@domain/common/abstractions";
import type { HashMap } from "@domain/common/value-objects/hash-map";
import type { Course } from "@domain/content/course";
import type { Answer, Question } from "@domain/content/question";
import type { Topic } from "@domain/content/topic";
import type { User } from "@domain/identity/user";
import { Enrollment } from "@domain/learning/course-enrollment";
import { TopicEnrollmentAttempt } from "@domain/learning/topic-enrollment";
import { DomainError, ErrNotFound } from "@shared/error";


export type EnrollCourseCMD = {
    uid: ID<User>,
    courseID: ID<Course>
}

export type StartTopicCMD = {
    uid: ID<User>,
    topicID: ID<Topic>,
}

export type CompleteTopicCMD = {
    topicID: ID<Topic>,
    uid: ID<User>,
    questionAnswers: HashMap<ID<Question>, ID<Answer>[]>
}


const ErrAlreadyEnroll = new DomainError("ALREADY_ENROLLED")
const ErrNotEnrolled = new DomainError("NOT_ENROLLED_AT_COURSE")
const ErrCanNotStart = new DomainError("CANNOT_START_TOPIC")
const ErrQuestionCountMismatch = new DomainError("QUESTION_COUNT_MISMATCH")
const ErrTopicAreEmpty = new DomainError("TOPIC_ARE_EMPTY")


export default class LearningService {
    constructor (
        private txmanager: ITransactionManager,
    ) {}


    enrollCourse(cmd: EnrollCourseCMD) {
        return this.txmanager.begin(async uow => {
            if (await uow.enrolls.isUserEnrolled(cmd.uid, cmd.courseID)) throw ErrAlreadyEnroll

            const enroll = Enrollment.create(
                cmd.uid,
                cmd.courseID,
            )

            await uow.enrolls.save(enroll)

            return {
                enrollmentID: enroll.id
            }
        })
    }


    startTopic(cmd: StartTopicCMD) {
        return this.txmanager.begin(async uow => {
            const topic = await uow.topics.getByID(cmd.topicID)
            if (!topic) throw ErrNotFound

            if (await uow.questions.countByTopic(topic.id) === 0) throw ErrTopicAreEmpty

            const enroll = await uow.enrolls.getByUserAndCourseForUpdate(cmd.uid, topic.courseID)
            if(!enroll) throw ErrNotEnrolled

            if (!enroll.canStartTopic(topic.number, topic.prerequisites)) throw ErrCanNotStart

            return {
                topicID: topic.id,
                enrollmentID: enroll.id
            }
        })
    }


    completeTopic(cmd: CompleteTopicCMD) {
        return this.txmanager.begin(async uow => {
            const topic = await uow.topics.getByID(cmd.topicID)
            if (!topic) throw ErrNotFound

            const enroll = await uow.enrolls.getByUserAndCourseForUpdate(cmd.uid, topic.courseID)
            if(!enroll) throw ErrNotEnrolled

            const questions = await uow.questions.listByTopic(topic.id)
        
            if (cmd.questionAnswers.size !== questions.length) throw ErrQuestionCountMismatch

            const completedQuestionCount = questions
                .filter(question => 
                    question.checkAnswers(
                        cmd.questionAnswers.get(question.id) || []
                    )
                )
                .length

            const attempt = TopicEnrollmentAttempt.create(
                completedQuestionCount,
                questions.length,
                topic.id, topic.number
            ) 

            enroll.registerAttempt(attempt)

            await uow.enrolls.save(enroll)

            return {
                enrollmentID: enroll.id
            }
        })
    }
}
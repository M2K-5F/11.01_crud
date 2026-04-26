import { ForMutate, type ITransactionManager, type Mutable } from "@applications/interfaces/itransaction-manager";
import Course, { CourseDescription, CourseID, CourseTitle } from "@domain/contexts/content/course";
import Question, { AnswerCorrectStatus, AnswerText, ChoiceAnswer, QuestionText } from "@domain/contexts/content/question";
import type { TopicID } from "@domain/contexts/content/topic";
import Topic, { TopicDescription, TopicNumber, TopicTitle } from "@domain/contexts/content/topic";
import type { UserID } from "@domain/contexts/identity/user";
import { DomainError, ErrNotFound } from "@shared/error";


// #region Commands
type CreateCourseCMD = {
    userID: UserID,
    title: string,
    description: string,
}

type CourseArchiveCMD = {
    userID: UserID,
    courseID: CourseID
}

type CreateTopicCMD = {
    userID: UserID,
    courseID: CourseID,
    title: string,
    description: string
}

type TopicArchiveCMD = {
    userID: UserID,
    topicID: TopicID
}

type CreateQuestionCMD = {
    userID: UserID,
    topicID: TopicID,
    text: string,
    answers: Array<{
        text: string,
        is_correct: boolean
    }>
}
// #endregion


// #region Errors
const ErrCourseTitleExist = new DomainError("COURSE_TITLE_EXISTS")
const ErrCourseNotCreatedBy = new DomainError("COURSE_NOT_CREATED_BY")
const ErrTopicNotCreatedBy = new DomainError("TOPIC_NOT_CREATED_BY")
// #endregion


// #region Service
export class CourseManagementService {
    constructor (
        readonly txmanager: ITransactionManager
    ) {}

    async createCourse(cmd: CreateCourseCMD) {
        return await this.txmanager.begin(async uow => {
            if (await uow.courses.checkCourseNameExists(cmd.userID, cmd.title)) throw ErrCourseTitleExist

            const course = Course.create(
                CourseTitle.create(cmd.title),
                CourseDescription.create(cmd.description),
                cmd.userID
            ) as Mutable<Course>

            await uow.courses.save(course)

            return course.id
        })
    }

    async archiveCourse(cmd: CourseArchiveCMD) {
        return await this.txmanager.begin(async uow => {
            const course = await uow.courses.getByID(cmd.courseID, ForMutate)
            if (!course) throw ErrNotFound

            if (!course.createdBy.equal(cmd.userID)) throw ErrCourseNotCreatedBy

            course.archive()

            await uow.courses.save(course)

            return course.id
        })
    }

    async activateCourse(cmd: CourseArchiveCMD) {
        return await this.txmanager.begin(async uow => {
            const course = await uow.courses.getByID(cmd.courseID, ForMutate)
            if (!course) throw ErrNotFound

            if (!course.createdBy.equal(cmd.userID)) throw ErrCourseNotCreatedBy

            course.activate()

            await uow.courses.save(course)

            return course.id
        })
    }

    async createTopic(cmd: CreateTopicCMD) {
        return await this.txmanager.begin(async uow => {
            const course = await uow.courses.getByID(cmd.courseID)
            if (!course) throw ErrNotFound

            if (!course.createdBy.equal(cmd.userID)) throw ErrCourseNotCreatedBy

            const count = await uow.topics.countByCourse(course.id)

            const topic = Topic.create(
                cmd.courseID, 
                TopicTitle.create(cmd.title),
                TopicDescription.create(cmd.description),
                cmd.userID,
                TopicNumber.create(count + 1)
            ) as Mutable<Topic>

            await uow.topics.save(topic)

            return topic.id
        })
    }

    async archiveTopic(cmd: TopicArchiveCMD) {
        return await this.txmanager.begin(async uow => {
            const topic = await uow.topics.getByID(cmd.topicID, ForMutate)
            if (!topic) throw ErrNotFound

            if (!topic.createdBy.equal(cmd.userID)) throw ErrTopicNotCreatedBy

            topic.archive()

            await uow.topics.save(topic)

            return topic.id
        })
    }

    async activateTopic(cmd: TopicArchiveCMD) {
        return await this.txmanager.begin(async uow => {
            const topic = await uow.topics.getByID(cmd.topicID, ForMutate)
            if (!topic) throw ErrNotFound

            if (!topic.createdBy.equal(cmd.userID)) throw ErrTopicNotCreatedBy

            topic.activate()

            await uow.topics.save(topic)

            return topic.id
        })
    }

    async createQuestion(cmd: CreateQuestionCMD) {
        return await this.txmanager.begin(async uow => {
            const topic = await uow.topics.getByID(cmd.topicID)
            if (!topic) throw ErrNotFound

            if (!topic.createdBy.equal(cmd.userID)) throw ErrTopicNotCreatedBy

            const question = Question.create(
                QuestionText.create(cmd.text),
                cmd.userID,
                cmd.topicID,
                cmd.answers.map(a => 
                    ChoiceAnswer.create(
                        AnswerText.create(a.text),
                        a.is_correct ? AnswerCorrectStatus.correct : AnswerCorrectStatus.uncorrect
                    )
                )
            ) as Mutable<Question>

            await uow.questions.save(question)

            return question.id
        })
    }
}
// #endregion

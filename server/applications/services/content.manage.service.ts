import type { ITransactionManager } from "@applications/interfaces/itransaction-manager";
import { ErrCourseNotCreatedBy, ErrCourseTitleExist, ErrTopicNotCreatedBy } from "@domain/contexts/content";
import Course, { CourseDescription, CourseID, CourseTitle } from "@domain/contexts/content/course";
import Question, { AnswerCorrectStatus, AnswerText, ChoiceAnswer, QuestionText } from "@domain/contexts/content/question";
import type { TopicID } from "@domain/contexts/content/topic";
import Topic, { TopicDescription, TopicTitle } from "@domain/contexts/content/topic";
import type { UserID } from "@domain/contexts/identity/value_objects/user-id";
import { ErrNotFound } from "@shared/error";


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
    answers: {
        text: string,
        is_correct: boolean
    }[]
}

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
            )

            await uow.courses.save(course)

            return course.id
        })
    }

    async archiveCourse(cmd: CourseArchiveCMD) {
        return await this.txmanager.begin(async uow => {
            await uow.courses.lock(cmd.courseID)

            const course = await uow.courses.getByID(cmd.courseID)
            if (!course) throw ErrNotFound

            if (!course.createdBy.equal(cmd.userID)) throw ErrCourseNotCreatedBy

            course.archive()

            await uow.courses.save(course)

            return course.id
        })
    }

    async activateCourse(cmd: CourseArchiveCMD) {
        return await this.txmanager.begin(async uow => {
            await uow.courses.lock(cmd.courseID)

            const course = await uow.courses.getByID(cmd.courseID)
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

            const topic = Topic.create(
                cmd.courseID, 
                TopicTitle.create(cmd.title),
                TopicDescription.create(cmd.description),
                cmd.userID
            )

            await uow.topics.save(topic)

            return topic.id
        })
    }

    async archiveTopic(cmd: TopicArchiveCMD) {
        return await this.txmanager.begin(async uow => {
            await uow.topics.lock(cmd.topicID)

            const topic = await uow.topics.getByID(cmd.topicID)
            if (!topic) throw ErrNotFound

            if (!topic.createdBy.equal(cmd.userID)) throw ErrTopicNotCreatedBy

            topic.archive()

            await uow.topics.save(topic)

            return topic.id
        })
    }

    async activateTopic(cmd: TopicArchiveCMD) {
        return await this.txmanager.begin(async uow => {
            await uow.topics.lock(cmd.topicID)

            const topic = await uow.topics.getByID(cmd.topicID)
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
            )

            await uow.questions.save(question)

            return question.id
        })
    }
}
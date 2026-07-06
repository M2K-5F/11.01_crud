import type { ITransactionManager } from "@applications/interfaces/itransaction-manager";
import type { ID } from "@domain/common/abstractions";
import { Course, CourseDescription, CourseTitle } from "@domain/content/course";
import Question, { Answer, AnswerText, CorrectStatus, QuestionText } from "@domain/content/question";
import { Topic, TopicDescription, TopicNumber, TopicTitle } from "@domain/content/topic";
import type { User } from "@domain/identity/user";
import { DomainError, ErrNotFound } from "@shared/error";
import type { Updatable } from "@shared/lib";


type CreateCourseCMD = {
    uid: ID<User>,
    title: string,
    description: string,
}

type CourseArchiveCMD = {
    uid: ID<User>,
    courseID: ID<Course>
}

type CreateTopicCMD = {
    uid: ID<User>,
    courseID: ID<Course>,
    title: string,
    description: string,
    accessType: "afterPrevious" | "free"
}

type TopicArchiveCMD = {
    uid: ID<User>,
    topicID: ID<Topic>
}

type CreateQuestionCMD = {
    uid: ID<User>,
    topicID: ID<Topic>,
    text: string,
    answers: Array<{
        text: string,
        is_correct: boolean
    }>
}


const ErrCourseTitleExist = new DomainError("COURSE_TITLE_EXISTS")
const ErrCourseNotCreatedBy = new DomainError("COURSE_NOT_CREATED_BY")
const ErrTopicNotCreatedBy = new DomainError("TOPIC_NOT_CREATED_BY")


export class CourseManagementService {
    constructor (
        readonly txmanager: ITransactionManager
    ) {}

    async createCourse(cmd: CreateCourseCMD) {
        return await this.txmanager.begin(async uow => {
            
            if (await uow.courses.checkCourseExistsOnUser(
                cmd.uid, CourseTitle.from(cmd.title)
            )) throw ErrCourseTitleExist

            const course = Course.create(
                CourseTitle.from(cmd.title),
                CourseDescription.from(cmd.description),
                cmd.uid
            )

            await uow.courses.save(course)

            return course.id
        })
    }

    async archiveCourse(cmd: CourseArchiveCMD) {
        return await this.txmanager.begin(async uow => {
            const course = await uow.courses.getByIDForUpdate(cmd.courseID)
            if (!course) throw ErrNotFound

            if (!course.createdBy.equals(cmd.uid)) throw ErrCourseNotCreatedBy

            course.archive()

            await uow.courses.save(course)

            return course.id
        })
    }

    async activateCourse(cmd: CourseArchiveCMD) {
        return await this.txmanager.begin(async uow => {
            const course = await uow.courses.getByIDForUpdate(cmd.courseID)
            if (!course) throw ErrNotFound

            if (!course.createdBy.equals(cmd.uid)) throw ErrCourseNotCreatedBy

            course.activate()

            await uow.courses.save(course)

            return course.id
        })
    }

    async createTopic(cmd: CreateTopicCMD) {
        return await this.txmanager.begin(async uow => {
            const course = await uow.courses.getByID(cmd.courseID)
            if (!course) throw ErrNotFound

            if (!course.createdBy.equals(cmd.uid)) throw ErrCourseNotCreatedBy
            const topicNumber = TopicNumber.from(await uow.topics.countByCourse(cmd.courseID))

            let topic: Updatable<Topic>

            switch (cmd.accessType) {
                case 'afterPrevious': 
                    topic = Topic.createWithAccessAfterPrevious(        
                        cmd.courseID, 
                        TopicTitle.from(cmd.title),
                        TopicDescription.from(cmd.description),
                        cmd.uid,
                        topicNumber
                    ); break
                case "free":
                    topic = Topic.createWithFreeAccess(
                        cmd.courseID, 
                        TopicTitle.from(cmd.title),
                        TopicDescription.from(cmd.description),
                        cmd.uid,
                        topicNumber
                    ); break
            }

            await uow.topics.save(topic)

            return {
                topicID: topic.id,
                courseID: course.id,
            }
        })
    }

    async archiveTopic(cmd: TopicArchiveCMD) {
        return await this.txmanager.begin(async uow => {
            const topic = await uow.topics.getByIDForUpdate(cmd.topicID)
            if (!topic) throw ErrNotFound

            if (!topic.createdBy.equals(cmd.uid)) throw ErrTopicNotCreatedBy

            topic.archive()

            await uow.topics.save(topic)

            return topic.id
        })
    }

    async activateTopic(cmd: TopicArchiveCMD) {
        return await this.txmanager.begin(async uow => {
            const topic = await uow.topics.getByIDForUpdate(cmd.topicID)
            if (!topic) throw ErrNotFound

            if (!topic.createdBy.equals(cmd.uid)) throw ErrTopicNotCreatedBy

            topic.activate()

            await uow.topics.save(topic)

            return topic.id
        })
    }

    async createQuestion(cmd: CreateQuestionCMD) {
        return await this.txmanager.begin(async uow => {
            const topic = await uow.topics.getByID(cmd.topicID)
            if (!topic) throw ErrNotFound

            if (!topic.createdBy.equals(cmd.uid)) throw ErrTopicNotCreatedBy

            const question = Question.create(
                QuestionText.from(cmd.text),
                cmd.uid,
                cmd.topicID,
                cmd.answers.map(a => 
                    Answer.create(
                        AnswerText.from(a.text),
                        a.is_correct ? CorrectStatus.Correct : CorrectStatus.Wrong
                    )
                )
            )

            await uow.questions.save(question)

            return {
                questionID: question.id,
                topicID: topic.id
            } 

        })
    }
}

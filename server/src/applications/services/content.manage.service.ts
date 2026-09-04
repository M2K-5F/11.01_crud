import type { ITransactionManager } from "@applications/interfaces/itransaction-manager";
import { ID } from "@domain/common/abstractions";
import { Course, CourseDescription, CourseTitle } from "@domain/content/course";
import { Question, Answer, AnswerText, CorrectStatus, QuestionText } from "@domain/content/question";
import { Topic, TopicDescription, TopicNumber, TopicTitle } from "@domain/content/topic";
import { DomainError, ErrNotFound } from "@shared/error";
import type { Updatable } from "@shared/lib";


type CreateCourseCMD = {
    uid: string,
    title: string,
    description: string,
}

type CourseArchiveCMD = {
    uid: string,
    courseID: string
}

type CreateTopicCMD = {
    uid: string,
    courseID: string,
    title: string,
    description: string,
    accessType: "afterPrevious" | "free"
}

type TopicArchiveCMD = {
    uid: string,
    topicID: string
}

type CreateQuestionCMD = {
    uid: string,
    topicID: string,
    text: string,
    answers: Array<{
        text: string,
        isCorrect: boolean
    }>
}


const ErrCourseTitleExist = new DomainError("COURSE_TITLE_EXISTS", "COURSE_TITLE_EXISTS")
const ErrCourseNotCreatedBy = new DomainError("COURSE_NOT_CREATED_BY", "COURSE_NOT_CREATED_BY")
const ErrTopicNotCreatedBy = new DomainError("TOPIC_NOT_CREATED_BY", "TOPIC_NOT_CREATED_BY")


export class CourseManagementService {
    constructor (
        readonly txmanager: ITransactionManager
    ) {}

    createCourse(cmd: CreateCourseCMD) {
        return this.txmanager.begin(async uow => {
            if (await uow.courses.checkCourseExistsOnUser(
                ID.from(cmd.uid), 
                CourseTitle.from(cmd.title)
            )) throw ErrCourseTitleExist


            const course = Course.create(
                CourseTitle.from(cmd.title),
                CourseDescription.from(cmd.description),
                ID.from(cmd.uid)
            )

            await uow.courses.save(course)

            return {
                courseID: course.id.asString(),
                uid: cmd.uid
            }
        })
    }

    archiveCourse(cmd: CourseArchiveCMD) {
        return this.txmanager.begin(async uow => {
            const course = await uow.courses.getByIDForUpdate(
                ID.from(cmd.courseID)
            )

            if (!course) 
                throw ErrNotFound

            if (!course.createdBy.equals(ID.from(cmd.uid))) 
                throw ErrCourseNotCreatedBy

            course.archive()

            await uow.courses.save(course)

            return {
                courseID: cmd.courseID,
                uid: cmd.uid
            }
        })
    }

    activateCourse(cmd: CourseArchiveCMD) {
        return this.txmanager.begin(async uow => {
            const course = await uow.courses.getByIDForUpdate(
                ID.from(cmd.courseID)
            )

            if (!course) 
                throw ErrNotFound

            if (!course.createdBy.equals(ID.from(cmd.uid))) 
                throw ErrCourseNotCreatedBy

            course.activate()

            await uow.courses.save(course)

            return {
                courseID: cmd.courseID,
                uid: cmd.uid
            }
        })
    }

    createTopic(cmd: CreateTopicCMD) {
        return this.txmanager.begin(async uow => {
            const course = await uow.courses.getByIDForUpdate(
                ID.from(cmd.courseID)
            )
            
            if (!course) throw ErrNotFound

            if (!course.createdBy.equals(ID.from(cmd.uid))) {
                throw ErrCourseNotCreatedBy
            }

            const topicNumber = TopicNumber.from(
                await uow.topics.countByCourse(ID.from(cmd.courseID))
            )

            let topic: Updatable<Topic>

            switch (cmd.accessType) {
                case 'afterPrevious': {
                    topic = Topic.createWithAccessAfterPrevious(        
                        ID.from(cmd.courseID), 
                        TopicTitle.from(cmd.title),
                        TopicDescription.from(cmd.description),
                        ID.from(cmd.uid),
                        topicNumber
                    )
                } break

                case "free": {
                    topic = Topic.createWithFreeAccess(
                        ID.from(cmd.courseID),
                        TopicTitle.from(cmd.title),
                        TopicDescription.from(cmd.description),
                        ID.from(cmd.uid),
                        topicNumber
                    )
                } break
            }

            await uow.topics.save(topic)

            return {
                topicID: topic.id.asString(),
                courseID: cmd.courseID,
            }
        })
    }

    archiveTopic(cmd: TopicArchiveCMD) {
        return this.txmanager.begin(async uow => {
            const topic = await uow.topics.getByIDForUpdate(
                ID.from(cmd.topicID)
            )

            if (!topic) throw ErrNotFound

            if (!topic.createdBy.equals(ID.from(cmd.uid))) {
                throw ErrTopicNotCreatedBy
            }

            topic.archive()

            await uow.topics.save(topic)

            return {
                topicID: cmd.topicID,
                uid: cmd.uid
            }
        })
    }

    activateTopic(cmd: TopicArchiveCMD) {
        return this.txmanager.begin(async uow => {
            const topic = await uow.topics.getByIDForUpdate(
                ID.from(cmd.topicID)
            )

            if (!topic) throw ErrNotFound

            if (!topic.createdBy.equals(ID.from(cmd.uid))) {
                throw ErrTopicNotCreatedBy
            }

            topic.activate()

            await uow.topics.save(topic)

            return {
                topicID: cmd.topicID,
                uid: cmd.uid
            }
        })
    }

    createQuestion(cmd: CreateQuestionCMD) {
        return this.txmanager.begin(async uow => {
            const topic = await uow.topics.getByID(
                ID.from(cmd.topicID)
            )

            if (!topic) throw ErrNotFound

            if (!topic.createdBy.equals(ID.from(cmd.uid))) {
                throw ErrTopicNotCreatedBy
            }

            const question = Question.create(
                QuestionText.from(cmd.text),
                ID.from(cmd.uid),
                ID.from(cmd.topicID),
                cmd.answers.map(a => 
                    Answer.create(
                        AnswerText.from(a.text),
                        a.isCorrect ? CorrectStatus.Correct : CorrectStatus.Wrong
                    )
                )
            )
            
            await uow.questions.save(question)

            return {
                questionID: question.id.asString(),
                topicID: cmd.topicID,
                uid: cmd.uid
            } 
        })
    }
}

import type { ITransactionManager } from "@applications/interfaces/itransaction-manager";
import { CourseID } from "@domain/contexts/content/course";
import type { QuestionID } from "@domain/contexts/content/question";
import type Topic from "@domain/contexts/content/topic";
import type { TopicID } from "@domain/contexts/content/topic";
import { ErrNotFound } from "@shared/error";


// #region Commands
export type OnTopicCreateCMD = {
    courseID: CourseID,
    topicID: TopicID
}


type OnQuestionCreateCMD = {
    topicID: TopicID,
    questionID: QuestionID
}
// #endregion


export class ContentEventHandler {
    constructor(private txmanager: ITransactionManager) {}

    onTopicCreate(cmd: OnTopicCreateCMD) {
        return this.txmanager.begin(async uow => {
            const enrollmentsToUpdate = await uow.enrolls.listByCourseForMutate(cmd.courseID)
            const totalTopicCount = await uow.topics.countByCourse(cmd.courseID)

            enrollmentsToUpdate.forEach(enroll => enroll.updateOnTopicCreate(cmd.topicID, totalTopicCount))

            await uow.enrolls.save(...enrollmentsToUpdate)
        })
    }

    onQuestionCreate(cmd: OnQuestionCreateCMD) {
        return this.txmanager.begin(async uow => {
            const topic = await uow.topics.getByID(cmd.topicID)
            if (!topic) throw ErrNotFound

            const totalQuestions = await uow.questions.countByTopic(topic.id)

            const enrollmentsToUpdate = await uow.enrolls.listByCourseForMutate(topic.courseID)

            enrollmentsToUpdate.forEach(enroll => enroll.updateOnQuestionCreate(topic.id, totalQuestions))

            await uow.enrolls.save(...enrollmentsToUpdate)
        })
    }
}
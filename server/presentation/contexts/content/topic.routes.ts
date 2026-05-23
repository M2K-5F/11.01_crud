import Elysia, { t } from "elysia";
import { dependencies } from "@index/injection";
import { authFilter } from "../../auth/middlewares/auth.middleware";
import { UserRole } from "@domain/contexts/identity/user";
import { TopicID } from "@domain/contexts/content/topic";
import { CourseID } from "@domain/contexts/content/course";
import { ErrNotFound } from "@shared/error";

export const topicRoutes = new Elysia()
.use(dependencies)
.use(authFilter())


.post("/courses/:course_id/topics", 
    async ({
        courseManagementService,
        learningService,
        currentUser: { id },
        readService,
        params: {course_id},
        body,
        contentEventHandler
    }) => {
        const {topicID, courseID} = await courseManagementService.createTopic({
            userID: id,
            ...body,
            courseID: CourseID.fromString(course_id),
        })

        void contentEventHandler.onTopicCreate({courseID, topicID})
            .catch(err => console.error("Error in $onTopicCreate:", err));

        return await readService.topics.firstBy({id: topicID.id})
    }, {
        body: t.Object({
            title: t.String(),
            description: t.String(),
        })
    }
)


.post("/topics/:topic_id/activate", 
    async ({
        params: {topic_id},
        courseManagementService,
        currentUser: {id},
        readService
    }) => {
        const topicID = await courseManagementService.activateTopic({
            userID: id,
            topicID: TopicID.fromString(topic_id)
        })

        return await readService.topics.firstBy({id: topicID.id})
    }
)


.post("/topics/:topic_id/archive",
    async ({
        params: {topic_id},
        courseManagementService,
        currentUser: {id},
        readService
    }) => {
        const topicID = await courseManagementService.archiveTopic({
            userID: id,
            topicID: TopicID.fromString(topic_id)
        })

        return await readService.topics.firstBy({id: topicID.id})
    }
)


.get("/courses/:course_id/topics/me", 
    async ({
        readService,
        params: {course_id}
    }) => {
        return await readService.topics.allBy({by_course_id: course_id})
    }
)


.get('/topics/:topicID',
    async ({
        params: {topicID},
        readService
    }) => {
        const topic = await readService.topics.firstBy({
            id: TopicID.fromString(topicID).id
        })

        if (!topic) throw ErrNotFound

        return topic
    }
)
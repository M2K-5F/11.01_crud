import Elysia, { t } from "elysia";
import { dependencies } from "@index/injection";
import { authFilter } from "../../auth/middlewares/auth.middleware";
import { CourseID } from "@domain/contexts/content/value-objects/course-id";
import { TopicID } from "@domain/contexts/content/value-objects/topic-id";

export const topicRoutes = new Elysia()
.use(dependencies)
.use(authFilter('admin'))


.post("/courses/:course_id/topics", 
    async ({
        courseManagementService,
        currentUser: { id },
        qs,
        params: {course_id},
        body
    }) => {
        const topicID = await courseManagementService.createTopic({
            userID: id,
            ...body,
            courseID: CourseID.fromString(course_id),
        })

        return await qs.topics.firstBy({id: topicID.id})
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
        qs
    }) => {
        const topicID = await courseManagementService.activateTopic({
            userID: id,
            topicID: TopicID.fromString(topic_id)
        })

        return await qs.topics.firstBy({id: topicID.id})
    }
)


.post("/topics/:topic_id/archive",
    async ({
        params: {topic_id},
        courseManagementService,
        currentUser: {id},
        qs
    }) => {
        const topicID = await courseManagementService.archiveTopic({
            userID: id,
            topicID: TopicID.fromString(topic_id)
        })

        return await qs.topics.firstBy({id: topicID.id})
    }
)


.get("/courses/:course_id/topics/me", 
    async ({
        qs,
        params: {course_id}
    }) => {
        return await qs.topics.allBy({by_course: course_id})
    }
)
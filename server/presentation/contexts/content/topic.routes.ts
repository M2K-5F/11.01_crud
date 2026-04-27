import Elysia, { t } from "elysia";
import { dependencies } from "@index/injection";
import { authFilter } from "../../auth/middlewares/auth.middleware";
import { UserRole } from "@domain/contexts/identity/user";
import { TopicID } from "@domain/contexts/content/topic";
import { CourseID } from "@domain/contexts/content/course";

export const topicRoutes = new Elysia()
.use(dependencies)
.use(authFilter(UserRole.Teacher))


.post("/courses/:course_id/topics", 
    async ({
        courseManagementService,
        learningService,
        currentUser: { id },
        qs,
        params: {course_id},
        body
    }) => {
        const {topicID, courseID} = await courseManagementService.createTopic({
            userID: id,
            ...body,
            courseID: CourseID.fromString(course_id),
        })

        void learningService.$onTopicCreate({courseID})
            .catch(err => console.error("Error in $onTopicCreate:", err));

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
        return await qs.topics.allBy({by_course_id: course_id})
    }
)
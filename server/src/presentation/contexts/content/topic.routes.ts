import Elysia, { t } from "elysia";
import { authFilter } from "../../common/auth.middleware";
import { ErrNotFound } from "@shared/error";
import { ID } from "@domain/common/abstractions";
import { courseManagementService, reader } from "@composition";

export const topicRoutes = new Elysia()
.use(authFilter())


.post("/courses/:courseID/topics", 
    async ({
        currentUser: {uid},
        params: {courseID},
        body,
    }) => {
        const {topicID} = await courseManagementService.createTopic({
            uid,
            ...body,
            courseID
        })

        return reader.topics.firstBy({id: topicID})
    }, {
        body: t.Object({
            title: t.String(),
            description: t.String(),
            accessType: t.Union([
                t.Literal('free'), 
                t.Literal('afterPrevious')
            ] as const)
        })
    }
)


.post("/topics/:topicID/activate", 
    async ({
        params: {topicID},
        currentUser: {uid},
    }) => {
        await courseManagementService.activateTopic({
            uid,
            topicID
        })

        return reader.topics.firstBy({id: topicID})
    }
)


.post("/topics/:topicID/archive",
    async ({
        params: {topicID},
        currentUser: {uid},
    }) => {
        await courseManagementService.archiveTopic({
            uid,
            topicID
        })

        return reader.topics.firstBy({id: topicID})
    }
)


.get("/topics", 
    async ({
        query
    }) => {
        return reader.topics.allBy(query)
    }, 
    {
        query: t.Object({
            courseID: t.Optional(t.String()),
            createdBy: t.Optional(t.String())
        })
    }
)


.get('/topics/:topicID',
    async ({
        params: {topicID},
    }) => {
        const topic = await reader.topics.firstBy({
            id: topicID
        })

        if (!topic) throw ErrNotFound

        return topic
    }
)
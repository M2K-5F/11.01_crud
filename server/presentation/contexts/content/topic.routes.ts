import Elysia, { t } from "elysia";
import { dependencies } from "@index/injection";
import { authFilter } from "../../auth/middlewares/auth.middleware";
import { UserRole } from "@domain/identity/user";
import { ErrNotFound } from "@shared/error";
import { ID } from "@domain/common/abstractions";

export const topicRoutes = new Elysia()
.use(dependencies)
.use(authFilter())


.post("/courses/:plainCourseID/topics", 
    async ({
        courseManagementService,
        currentUser: {uid},
        readService,
        params: {plainCourseID},
        body,
    }) => {
        const {topicID, courseID} = await courseManagementService.createTopic({
            uid,
            ...body,
            courseID: ID.from(plainCourseID),
        })

        const topic = await readService.topics.firstBy({id: topicID.asString()})
        if( !topic) throw ErrNotFound

        return topic
    }, {
        body: t.Object({
            title: t.String(),
            description: t.String(),
            accessType: t.Union([t.Literal('free'), t.Literal('afterPrevious')] as const)
        })
    }
)


.post("/topics/:topicPlainID/activate", 
    async ({
        params: {topicPlainID},
        courseManagementService,
        currentUser: {uid},
        readService
    }) => {
        const {topicID} = await courseManagementService.activateTopic({
            uid,
            topicID: ID.from(topicPlainID)
        })

        const topic = await readService.topics.firstBy({id: topicID.asString()})
        if( !topic) throw ErrNotFound

        return topic
    }
)


.post("/topics/:topicPlainID/archive",
    async ({
        params: {topicPlainID},
        courseManagementService,
        currentUser: {uid},
        readService
    }) => {
        const {topicID} = await courseManagementService.archiveTopic({
            uid,
            topicID: ID.from(topicPlainID)
        })

        const topic = await readService.topics.firstBy({id: topicID.asString()})
        if( !topic) throw ErrNotFound

        return topic
    }
)


.get("/courses/:courseID/topics/me", 
    async ({
        readService,
        params: {courseID}
    }) => {
        return await readService.topics.allBy({courseID: ID.from(courseID).asString()})
    }
)


.get('/topics/:topicID',
    async ({
        params: {topicID},
        readService
    }) => {
        const topic = await readService.topics.firstBy({
            id: ID.from(topicID).asString()
        })

        if (!topic) throw ErrNotFound

        return topic
    }
)
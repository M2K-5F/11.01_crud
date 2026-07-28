import Elysia, { t } from "elysia";
import { dependencies } from "@index/../injection";
import { authFilter } from "../../common/auth.middleware";
import { UserRole } from "@domain/identity/user";
import { ErrNotFound } from "@shared/error";
import { ID } from "@domain/common/abstractions";
import { Obj, Opt, Str } from "@shared/typebox";

export const topicRoutes = new Elysia()
.use(dependencies)
.use(authFilter())


.post("/courses/:coursePlainID/topics", 
    async ({
        courseManagementService,
        currentUser: {uid},
        readService,
        params: {coursePlainID},
        body,
    }) => {
        const {topicID, courseID} = await courseManagementService.createTopic({
            uid,
            ...body,
            courseID: ID.from(coursePlainID),
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


.get("/topics", 
    async ({
        readService,
        query
    }) => {
        return readService.topics.allBy(query)
    }, 
    {
        query: Obj({
            courseID: Opt(Str),
            createdBy: Opt(Str)
        })
    }
)


.get('/topics/:topicPlainID',
    async ({
        params: {topicPlainID},
        readService
    }) => {
        const topic = await readService.topics.firstBy({
            id: topicPlainID
        })

        if (!topic) throw ErrNotFound

        return topic
    }
)
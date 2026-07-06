import Elysia, { t } from "elysia";
import { authFilter } from "../../auth/middlewares/auth.middleware";
import { dependencies } from "@index/injection";
import { UserRole } from "@domain/identity/user";
import { ID } from "@domain/common/abstractions";
import { ErrNotFound } from "@shared/error";

export const questionRoutes = new Elysia()
.use(dependencies)
.use(authFilter(UserRole.Teacher))


.post('/topics/:topicPlainID/questions',
    async ({
        currentUser: { uid },
        params: { topicPlainID },
        readService,
        body,
        courseManagementService,
    }) => {
        const {questionID} = await courseManagementService.createQuestion({
            topicID: ID.from(topicPlainID),
            uid,
            ...body
        })

        const question = await readService.question.firstBy({id: questionID.asString()})
        if (!question) throw ErrNotFound

        return question
    }, {
        body: t.Object({
            text: t.String(),
            answers: t.Array(t.Object({
                text: t.String(),
                isCorrect: t.Boolean()
            }))
        })
    }
)


.get('/topics/:topicID/questions', 
    async ({
        params: {topicID},
        currentUser: {uid},
        readService
    }) => {
        return readService.question.allBy({
            createdBy: uid.asString(),
            topicID: ID.from(topicID).asString()
        })
    }
)






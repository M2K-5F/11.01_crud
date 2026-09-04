import Elysia, { t } from "elysia";
import { authFilter } from "../../common/auth.middleware";
import { UserRole } from "@domain/identity/user";
import { ErrNotFound } from "@shared/error";
import { courseManagementService, reader } from "@composition";

export const questionRoutes = new Elysia()
.use(authFilter(UserRole.Teacher))


.post('/topics/:topicID/questions',
    async ({
        currentUser: { uid },
        params: { topicID },
        body
    }) => {
        const {questionID} = await courseManagementService.createQuestion({
            topicID,
            uid,
            ...body
        })

        return reader.question.firstBy({id: questionID})
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


.get('/questions', 
    async ({
        query
    }) => {
        return reader.question.allBy(query)
    }, {
        query: t.Object({
            topicID: t.Optional(t.String()),
            createdBy: t.Optional(t.String())
        })
    }
)






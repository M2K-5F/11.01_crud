import Elysia, { t } from "elysia";
import { authFilter } from "../../auth/middlewares/auth.middleware";
import { dependencies } from "@index/injection";
import { UserRole } from "@domain/contexts/identity/user";
import { TopicID } from "@domain/contexts/content/topic";

export const questionRoutes = new Elysia()
.use(dependencies)
.use(authFilter(UserRole.Teacher))


.post('/topics/:topic_id/questions',
    async ({
        currentUser: { id },
        params: { topic_id },
        qs,
        body,
        courseManagementService
    }) => {
        const questionID = await courseManagementService.createQuestion({
            topicID: TopicID.fromString(topic_id),
            userID: id,
            ...body
        })

        return await qs.question.firstBy({id: questionID.id})
    }, {
        body: t.Object({
            text: t.String(),
            answers: t.Array(t.Object({
                text: t.String(),
                is_correct: t.Boolean()
            }))
        })
    }
)
import Elysia, { t } from "elysia";
import { authFilter } from "../../auth/middlewares/auth.middleware";
import { TopicID } from "@domain/contexts/content/value-objects/topic-id";
import { sql } from "@m2k-5f/pgtx";
import type { AnswerRow, QuestionRow } from "@persistense/shemas/content/shema";
import { dependencies } from "@index/injection";

export const questionRoutes = new Elysia()
.use(dependencies)
.use(authFilter("admin"))


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
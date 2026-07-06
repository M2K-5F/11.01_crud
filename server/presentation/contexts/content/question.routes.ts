import Elysia, { t } from "elysia";
import { authFilter } from "../../auth/middlewares/auth.middleware";
import { dependencies } from "@index/injection";
import { UserRole } from "@domain/identity/user";
import Topic, { TopicID } from "@domain/contexts/content/topic";

export const questionRoutes = new Elysia()
.use(dependencies)
.group('', app => app
    .use(authFilter(UserRole.Teacher))


    .post('/topics/:topic_id/questions',
        async ({
            currentUser: { id },
            params: { topic_id },
            readService,
            body,
            courseManagementService,
            contentEventHandler
        }) => {
            const {questionID, topicID} = await courseManagementService.createQuestion({
                topicID: TopicID.fromString(topic_id),
                userID: id,
                ...body
            })

            void contentEventHandler.onQuestionCreate({questionID, topicID})

            return await readService.question.firstBy({id: questionID.id})
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


    .get('/topics/:topicID/questions', 
        async ({
            params: {topicID},
            currentUser: {id: userID},
            readService
        }) => {
            return readService.question.allBy({
                created_by_id: userID.id,
                by_topic_id: TopicID.fromString(topicID).id
            })
        }
    )
)






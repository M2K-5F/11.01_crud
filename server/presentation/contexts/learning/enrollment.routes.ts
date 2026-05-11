import { ID } from "@domain/common/abstractions/abstract-identificator";
import { CourseID } from "@domain/contexts/content/course";
import { AnswerID, QuestionID } from "@domain/contexts/content/question";
import Topic, { TopicID } from "@domain/contexts/content/topic";
import { UserRole } from "@domain/contexts/identity/user";
import { dependencies } from "@index/injection";
import { authFilter } from "@presentation/auth/middlewares/auth.middleware";
import Elysia, { t } from "elysia";

export const enrollmentRoutes = new Elysia()
.use(dependencies)
.use(authFilter(UserRole.Student))


.post('/enrollments' , 
    async ({
        body: {course_id},
        currentUser: {id: userId},
        learningService,
        readService
    }) => {
        const enrID = await learningService.enrollCourse({
            courseID: CourseID.fromString(course_id),
            userID: userId
        })

        return readService.enroll.firstBy({id: enrID.id})!
    }, 
    {
        body: t.Object({
            course_id: t.String(),
        })
    }
)


.post('/start/:topic_id', 
    async ({
        learningService,
        currentUser: {id: userID},
        params: {topic_id},
        readService
    }) => {
        const topicID  = await learningService.startTopic({
            userID: userID,
            topicID: TopicID.fromString(topic_id)
        })

        return readService.question.allBy({by_topic_id: topicID.id})
    }
)


.post('/complete/:topic_id', 
    async ({
        learningService,
        readService,
        body,
        currentUser: {id: userID},
        params: {topic_id}
    }) => {
        const enrollmentID = await learningService.completeTopic({
            topicID: TopicID.fromString(topic_id),
            userID: userID,
            questionAnswers: new Map(body.questions.map(q => [
                q.id,
                q.selected_answers.map(a => AnswerID.fromString(a))
            ]))
        })

        return readService.enroll.firstBy({id: enrollmentID.id})
    }, 
    {
        body: t.Object({
            questions: t.Array(t.Object({
                id: t.String(),
                selected_answers: t.Array(t.String())
            }))
        })
    }
)


.get('/enrollments/me', 
    async ({
        currentUser: {id},
        readService,
    }) => {
        return readService.enroll.allBy({user_id: id.id})
    }
)
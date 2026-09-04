import { learningService, reader } from "@composition";
import { UserRole } from "@domain/identity/user";
import { authFilter } from "@presentation/common/auth.middleware";
import { ErrNotFound } from "@shared/error";
import Elysia, { t } from "elysia";

export const enrollmentRoutes = new Elysia()
.use(authFilter(UserRole.Student))


.post('/courses/:courseID/enrollments' , 
    async ({
        currentUser: {uid},
        params: {courseID}
    }) => {
        const {enrollmentID} = await learningService.enrollCourse({
            courseID,
            uid
        })

        return reader.enroll.firstBy({id: enrollmentID})
    }
)


.post('/topics/:topicID/start', 
    async ({
        currentUser: {uid},
        params: {topicID}
    }) => {
        await learningService.startTopic({
            uid,
            topicID
        })

        return reader.question.allBy({topicID: topicID})
    }
)


.post('/topics/:topicID/complete', 
    async ({
        body,
        currentUser: {uid},
        params: {topicID}
    }) => {
        const { enrollmentID } = await learningService.completeTopic({
            topicID,
            uid,
            questionAnswers: body
        })

        return reader.enroll.firstBy({id: enrollmentID})
    }, {
        body: t.Array(
            t.Object({
                id: t.String(),
                selectedAnswers: t.Array(t.String())
            })
        )
    }
)


.get('/enrollments', 
    async ({
        query,
    }) => {
        return reader.enroll.allBy(query)
    }, {
        query: t.Object({
            courseID: t.Optional(t.String()),
            userID: t.Optional(t.String())
        })
    }
)


.get("/enrollments/:enrollmentID",
    async ({
        params: {enrollmentID},
    }) => {
        const enrollment = await reader.enroll.firstBy({
            id: enrollmentID,
        })
        if (!enrollment) throw ErrNotFound

        return enrollment
    }
)
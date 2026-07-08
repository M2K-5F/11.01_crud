import { ID } from "@domain/common/abstractions";
import { HashMap } from "@domain/common/value-objects/hash-map";
import type { Answer, Question } from "@domain/content/question";
import { UserRole } from "@domain/identity/user";
import { dependencies } from "@index/../injection";
import { authFilter } from "@presentation/auth/middlewares/auth.middleware";
import { ErrNotFound } from "@shared/error";
import Elysia, { t } from "elysia";

export const enrollmentRoutes = new Elysia()
.use(dependencies)
.use(authFilter(UserRole.Student))


.post('/enroll/:coursePlainID' , 
    async ({
        currentUser: {uid},
        learningService,
        readService,
        params: {coursePlainID}
    }) => {
        const {enrollmentID} = await learningService.enrollCourse({
            courseID: ID.from(coursePlainID),
            uid
        })


        const enrollment = await readService.enroll.firstBy({id: enrollmentID.asString()})

        if (!enrollment) throw ErrNotFound

        return enrollment
    }
)


.post('/start-topic/:topicPlainID', 
    async ({
        learningService,
        currentUser: {uid},
        params: {topicPlainID},
        readService
    }) => {
        const { topicID } = await learningService.startTopic({
            uid,
            topicID: ID.from(topicPlainID)
        })

        return await readService.question.allBy({topicID: topicID.asString()})
    }
)


.post('/complete-topic/:topicPlainID', 
    async ({
        learningService,
        readService,
        body,
        currentUser: {uid},
        params: {topicPlainID}
    }) => {
        const { enrollmentID } = await learningService.completeTopic({
            topicID: ID.from(topicPlainID),
            uid,
        questionAnswers: HashMap.fromEntries(body.map(({id, selectedAnswers}) => [
                ID.from<Question>(id),
                selectedAnswers.map(ID.from<Answer>)
            ]))
        })

        const enrollment = await readService.enroll.firstBy({id: enrollmentID.asString()})

        if (!enrollment) throw ErrNotFound

        return enrollment
    }, 
    {
        body: t.Array(
            t.Object({
                id: t.String(),
                selectedAnswers: t.Array(t.String())
            })
        )
    }
)


.get('/enrollments/me', 
    async ({
        currentUser: {uid},
        readService,
    }) => {
        return readService.enroll.allBy({
            userID: uid.asString(),
        })
    }
)


.get("/enrollments/:enrollmentID",
    async ({
        params: {enrollmentID},
        currentUser: {uid},
        readService
    }) => {
        const enrollment = await readService.enroll.firstBy({
            id: ID.from(enrollmentID).asString(),
            userID: uid.asString()
        })

        if (!enrollment) throw ErrNotFound

        return enrollment
    }
)


.get('/enrollment-by-course/:courseID',
    async ({
        params: {courseID},
        currentUser: {uid},
        readService
    }) => {
        const enrollment = await readService.enroll.firstBy({
            courseID: ID.from(courseID).asString(),
            userID: uid.asString()
        })

        if (!enrollment) throw ErrNotFound

        return enrollment
    }
)
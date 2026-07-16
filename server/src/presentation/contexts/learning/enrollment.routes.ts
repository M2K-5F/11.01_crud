import { ID } from "@domain/common/abstractions";
import { HashMap } from "@domain/common/value-objects/hash-map";
import type { Answer, Question } from "@domain/content/question";
import { UserRole } from "@domain/identity/user";
import { dependencies } from "@index/../injection";
import { authFilter } from "@presentation/common/auth.middleware";
import { ErrNotFound } from "@shared/error";
import { Opt, Str } from "@shared/typebox";
import Elysia, { t } from "elysia";

export const enrollmentRoutes = new Elysia()
.use(dependencies)
.use(authFilter(UserRole.Student))


.post('/courses/:coursePlainID/enrollments' , 
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


.post('/topics/:topicPlainID/start', 
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


.post('/topics/:topicPlainID/complete', 
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


.get('/enrollments', 
    async ({
        query,
        readService,
    }) => {
        return readService.enroll.allBy(query)
    }, {
        query: t.Object({
            courseID: Opt(Str),
            userID: Opt(Str)
        })
    }
)


.get("/enrollments/:enrollmentPlainID",
    async ({
        params: {enrollmentPlainID},
        readService
    }) => {
        const enrollment = await readService.enroll.firstBy({
            id: enrollmentPlainID,
        })
        if (!enrollment) throw ErrNotFound

        return enrollment
    }
)
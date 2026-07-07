import { ID } from "@domain/common/abstractions/abstract-identificator";
import Course, { CourseID } from "@domain/contexts/content/course";
import { AnswerID, QuestionID } from "@domain/contexts/content/question";
import Topic, { TopicID } from "@domain/contexts/content/topic";
import { UserRole } from "@domain/identity/user";
import { EnrollmentID } from "@domain/contexts/learning/enrollment/aggregate";
import { dependencies } from "@index/injection";
import { authFilter } from "@presentation/auth/middlewares/auth.middleware";
import { ErrNotFound } from "@index/src/shared/error";
import Elysia, { t } from "elysia";

export const enrollmentRoutes = new Elysia()
.use(dependencies)
.use(authFilter(UserRole.Student))


.post('/enroll/:course_id' , 
    async ({
        currentUser: {id: userId},
        learningService,
        readService,
        params: {course_id}
    }) => {
        const enrID = await learningService.enrollCourse({
            courseID: CourseID.fromString(course_id),
            userID: userId
        })


        const enrollment = await readService.enroll.firstBy({id: enrID.id})

        if (!enrollment) throw ErrNotFound

        return enrollment
    }
)


.post('/start-topic/:topic_id', 
    async ({
        learningService,
        currentUser: {id: userID},
        params: {topic_id},
        readService
    }) => {
        const topicID = await learningService.canStartTopic({
            userID: userID,
            topicID: TopicID.fromString(topic_id)
        })

        return await readService.question.allBy({by_topic_id: topicID.id})

    }
)


.post('/complete-topic/:topic_id', 
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
            questionAnswers: new Map(body.map(q => [
                q.id,
                q.selected_answers.map(a => AnswerID.fromString(a))
            ]))
        })

        const enrollment = await readService.enroll.firstBy({id: enrollmentID.id})

        if (!enrollment) throw ErrNotFound

        return enrollment
    }, 
    {
        body: t.Array(
            t.Object({
                id: t.String(),
                selected_answers: t.Array(t.String())
            })
        )
    }
)


.get('/enrollments/me', 
    async ({
        currentUser: {id},
        readService,
    }) => {
        return readService.enroll.allBy({
            user_id: id.id,
        })
    }
)


.get("/enrollments/:enrollmentID",
    async ({
        params: {enrollmentID},
        currentUser: {id: userID},
        readService
    }) => {
        const enrollment = await readService.enroll.firstBy({
            id: EnrollmentID.fromString(enrollmentID).id,
            user_id: userID.id
        })

        if (!enrollment) throw ErrNotFound

        return enrollment
    }
)


.get('/enrollments/:enrollmentID/topics/me',
    async ({
        currentUser: {id: userID},
        params: {enrollmentID},
        readService,

    }) => {
        const enrollment = await readService.enroll.firstBy({
            id: EnrollmentID.fromString(enrollmentID).id,
            user_id: userID.id
        })

        if (!enrollment) throw ErrNotFound

        return await readService.enroll.getEnrollmentTopics(
            EnrollmentID.fromString(enrollment.id)
        )
    }
)


.get('/enrollment-by-course/:courseID',
    async ({
        params: {courseID},
        currentUser: {id: userID},
        readService
    }) => {
        const enrollment = await readService.enroll.firstBy({
            course_id: CourseID.fromString(courseID).id,
            user_id: userID.id
        })

        if (!enrollment) throw ErrNotFound

        return enrollment
    }
)
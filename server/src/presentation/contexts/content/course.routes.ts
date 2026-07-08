import Elysia, { t } from "elysia";
import { authFilter } from "../../auth/middlewares/auth.middleware";
import { dependencies } from "@index/../injection";
import { ErrNotFound } from "@shared/error";
import { ID } from "@domain/common/abstractions";

export const courseRoutes = new Elysia()
.use(dependencies)
.use(authFilter())

.post('/courses', 
    async ({
        courseManagementService,
        currentUser: {uid},
        body,
        readService
    }) => {
        const {courseID} = await courseManagementService.createCourse({
            uid,
            title: body.title,
            description: body.description,
        })


        const course = await readService.course.firstBy({id: courseID.asString()})
        if (!course) throw ErrNotFound

        return course
    }, 
    {
        body: t.Object({
            title: t.String(),
            description: t.String()
        })
    }
)

.post('/courses/:plainCourseID/activate', 
    async ({
        params: {plainCourseID},
        currentUser: {uid},
        courseManagementService,
        readService
    }) => {
        const {courseID} = await courseManagementService.activateCourse({
            uid,
            courseID: ID.from(plainCourseID)
        })

        const course = await readService.course.firstBy({id: courseID.asString()})
        if (!course) throw ErrNotFound

        return course
    }
)

.post('/courses/:plainCourseID/archive', 
    async ({
        params: {plainCourseID},
        currentUser: {uid},
        courseManagementService,
        readService
    }) => {
        const {courseID} = await courseManagementService.archiveCourse({
            uid,
            courseID: ID.from(plainCourseID)
        })

        const course = await readService.course.firstBy({id: courseID.asString()})
        if (!course) throw ErrNotFound

        return course
    }
)


.get('/courses/me/:courseID',
    async ({
        params: {courseID},
        readService
    }) => {
        const course = await readService.course.firstBy({id: courseID})

        if (!course) throw ErrNotFound

        return course
    }
)


.get('/courses/me', 
    async ({
        currentUser: {uid},
        readService,
        query: {limit}
    }) => {
        return await readService.course.allBy({createdBy: uid.asString()}, {limit})
    },
    {
        query: t.Object({
            limit: t.Optional(t.Integer())
        })
    }
)


.get("/courses/search",
    async ({
        query: {q},
        readService
    }) => { 
        return await readService.course.searchCourses(q)
    },
    {
        query: t.Object({q: t.String()})
    }
)
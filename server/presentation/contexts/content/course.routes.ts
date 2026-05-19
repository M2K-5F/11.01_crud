import Elysia, { t } from "elysia";
import { authFilter } from "../../auth/middlewares/auth.middleware";
import { dependencies } from "@index/injection";
import { UserRole } from "@domain/contexts/identity/user";
import { CourseID } from "@domain/contexts/content/course";
import { ErrForbidden, ErrNotFound } from "@shared/error";

export const courseRoutes = new Elysia()
.use(dependencies)
.use(authFilter(UserRole.Teacher))

.post('/courses', 
    async ({
        courseManagementService,
        currentUser: {id},
        body,
        readService
    }) => {
        const courseID = await courseManagementService.createCourse({
            userID: id,
            title: body.title,
            description: body.description,
        })


        return readService.course.firstBy({id: courseID.id})
    }, 
    {
        body: t.Object({
            title: t.String(),
            description: t.String()
        })
    }
)

.post('/courses/:course_id/activate', 
    async ({
        params: {course_id},
        currentUser: { id },
        courseManagementService,
        readService
    }) => {
        const courseID = await courseManagementService.activateCourse({
            userID: id,
            courseID: CourseID.fromString(course_id)
        })

        return await readService.course.firstBy({id: courseID.id})
    }
)

.post('/courses/:course_id/archive', 
    async ({
        params: {course_id},
        currentUser: {id},
        courseManagementService,
        readService
    }) => {
        const courseID = await courseManagementService.archiveCourse({
            userID: id,
            courseID: CourseID.fromString(course_id)
        })

        return await readService.course.firstBy({id: courseID.id})
    }
)


.get('/courses/me/:courseID',
    async ({
        params: {courseID},
        currentUser: {id: userID},
        readService
    }) => {
        const course = await readService.course.firstBy({id: courseID, created_by_id: userID.id})
        if (!course) throw ErrForbidden
        return course
    }
)


.get('/courses/me', 
    async ({
        currentUser: {id},
        readService,
        query: {limit}
    }) => {
        return await readService.course.allBy({created_by_id: id.id}, {limit})
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
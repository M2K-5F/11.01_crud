import Elysia, { t } from "elysia";
import { authFilter } from "../../auth/middlewares/auth.middleware";
import { dependencies } from "@index/injection";
import { UserRole } from "@domain/contexts/identity/user";
import { CourseID } from "@domain/contexts/content/course";

export const courseRoutes = new Elysia()
.use(dependencies)
.use(authFilter(UserRole.Teacher))

.post('/courses', 
    async ({
        courseManagementService,
        currentUser: {id},
        body,
        qs
    }) => {
        const courseID = await courseManagementService.createCourse({
            userID: id,
            title: body.title,
            description: body.description,
        })


        return qs.course.firstBy({id: courseID.id})
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
        qs
    }) => {
        const courseID = await courseManagementService.activateCourse({
            userID: id,
            courseID: CourseID.fromString(course_id)
        })

        return await qs.course.firstBy({id: courseID.id})
    }
)

.post('/courses/:course_id/archive', 
    async ({
        params: {course_id},
        currentUser: {id},
        courseManagementService,
        qs
    }) => {
        const courseID = await courseManagementService.archiveCourse({
            userID: id,
            courseID: CourseID.fromString(course_id)
        })

        return await qs.course.firstBy({id: courseID.id})
    }
)

.get('courses/me', 
    async ({
        currentUser: {id},
        qs
    }) => {
        return await qs.course.allBy({created_by_id: id.id})
    }
)
import Elysia, { t } from "elysia";
import { authFilter } from "../../common/auth.middleware";
import { ErrNotFound } from "@shared/error";
import { ID } from "@domain/common/abstractions";
import { courseManagementService, reader } from "@composition";

export const courseRoutes = new Elysia()
.use(authFilter())

.post('/courses', 
    async ({
        currentUser: {uid},
        body,
    }) => {
        const {courseID} = await courseManagementService.createCourse({
            uid,
            title: body.title,
            description: body.description,
        })

        return reader.course.firstBy({id: courseID})
    }, 
    {
        body: t.Object({
            title: t.String(),
            description: t.String()
        })
    }
)

.post('/courses/:courseID/activate', 
    async ({
        params: {courseID},
        currentUser: {uid}
    }) => {
        await courseManagementService.activateCourse({
            uid,
            courseID
        })

        return reader.course.firstBy({id: courseID})
    }
)

.post('/courses/:courseID/archive', 
    async ({
        params: {courseID},
        currentUser: {uid}
    }) => {
        await courseManagementService.archiveCourse({
            uid,
            courseID
        })

        return reader.course.firstBy({id: courseID})
    }
)


.get('/courses/:courseID',
    async ({
        params: {courseID}
    }) => {
        const course = await reader.course.firstBy({id: courseID})

        if (!course) throw ErrNotFound

        return course
    }
)


.get('/courses', 
    async ({
        query
    }) => {
        return reader.course.allBy(query)
    },
    {
        query: t.Object({
            createdBy: t.Optional(t.String()),
            title: t.Optional(t.String())
        })
    }
)


.get("/courses/search",
    async ({
        query,
    }) => { 
        return reader.course.searchCourses(query.q)
    },
    {
        query: t.Object({
            q: t.String()
        })
    }
)
import Elysia, { t } from "elysia";
import { authFilter } from "../../common/auth.middleware";
import { dependencies } from "@index/../injection";
import { ErrNotFound } from "@shared/error";
import { ID } from "@domain/common/abstractions";
import { Obj, Opt, Str } from "@shared/typebox";

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

.post('/courses/:coursePlainID/activate', 
    async ({
        params: {coursePlainID},
        currentUser: {uid},
        courseManagementService,
        readService
    }) => {
        const {courseID} = await courseManagementService.activateCourse({
            uid,
            courseID: ID.from(coursePlainID)
        })

        const course = await readService.course.firstBy({id: courseID.asString()})
        if (!course) throw ErrNotFound

        return course
    }
)

.post('/courses/:coursePlainID/archive', 
    async ({
        params: {coursePlainID},
        currentUser: {uid},
        courseManagementService,
        readService
    }) => {
        const {courseID} = await courseManagementService.archiveCourse({
            uid,
            courseID: ID.from(coursePlainID)
        })

        const course = await readService.course.firstBy({id: courseID.asString()})
        if (!course) throw ErrNotFound

        return course
    }
)


.get('/courses/:coursePlainID',
    async ({
        params: {coursePlainID},
        readService
    }) => {
        const course = await readService.course.firstBy({id: coursePlainID})

        if (!course) throw ErrNotFound

        return course
    }
)


.get('/courses', 
    async ({
        readService,
        query
    }) => {
        return readService.course.allBy(query)
    },
    {
        query: Obj({
            createdBy: Opt(Str),
            title: Opt(Str)
        })
    }
)


.get("/courses/search",
    async ({
        query: {q},
        readService
    }) => { 
        return readService.course.searchCourses(q)
    },
    {
        query: Obj({
            q: Str
        })
    }
)
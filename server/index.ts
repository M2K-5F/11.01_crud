// import Elysia from "elysia";
// import swagger from '@elysiajs/swagger'
// import { contentRoutes } from "./presentation/contexts/content";
// import { identityRoutes } from "./presentation/contexts/identity";
// import { AppError, DomainError, ForbiddenError, NotFoundError, UnauthorizedError, ValidationError } from "./shared/error";
// import { errorHandle } from "./error-handler";
// import {cors} from "@elysiajs/cors"
// import { learningRoutes } from "@presentation/contexts/learning";
// import { CourseID } from "@domain/contexts/content/course";
// import { UserID } from "@domain/identity/user";

import { ID } from "@domain/common/abstractions";
import { Course, CourseDescription, CourseTitle } from "@domain/content/course";
import type { User } from "@domain/identity/user";
import { Pool } from "@m2k-5f/pgtx";
import { Json } from "nucleus-mold";
import { getDependencies } from "./injection";

// const app = new Elysia({})
// .use(cors({}))
// .use(errorHandle)
// .use(swagger({
//     provider: 'swagger-ui',
//     documentation: {
//         components: {
//             securitySchemes: {
//                 BearerAuth: {
//                     type: 'http',
//                     scheme: 'bearer',
//                     bearerFormat: 'JWT',
//                     description: 'Enter JWT token'
//                 }
//             }
//         },
//     }
// }))
// .get('/ping', () => 'pong')
// .use(identityRoutes)
// .use(contentRoutes)
// .use(learningRoutes)
// .listen({port: 8000, reusePort: true})

// console.log("Bun served")

async function main () {
    const deps = await getDependencies()
    const uid = await deps.userService.authorize({
        name: 'ffffdffsds',
        password: '123123123',
    })
    console.log(uid);
}
main()

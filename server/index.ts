import Elysia from "elysia";
import swagger from '@elysiajs/swagger'
import { contentRoutes } from "@presentation/contexts/content";
import { identityRoutes } from "@presentation/contexts/identity";
import { errorHandle } from "@index/error-handler";
import {cors} from "@elysiajs/cors"
import { dependencies, getDependencies } from "./injection";
import { ID } from "@domain/common/abstractions";
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
// // .use(learningRoutes)
// .listen({port: 8000, reusePort: true})

console.log("Bun served")

getDependencies().then(({learningService})=> {
    learningService.completeTopic({
        uid: ID.from('747434a1-3ac4-4f5e-854e-9fa904c5a256'),
        topicID: ID.from('05ae65b2-810b-43ca-97a1-760bbaa93c11'),
        questionAnswers: {
            "3fda09a9-c713-4f27-a2ad-cdcb507a922b": [ID.from('625f918a-8168-4f2a-8be1-d3adeac5b2b3')],
            '1f533bb2-222f-48d8-a254-d2ef0433f70a': [ID.from('85c98c21-af1f-4406-a666-93144ccd5ecc')]
        }
    }).catch(console.log).then(console.log)
})


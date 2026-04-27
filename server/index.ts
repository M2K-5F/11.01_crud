import Elysia from "elysia";
import swagger from '@elysiajs/swagger'
import { contentRoutes } from "./presentation/contexts/content";
import { identityRoutes } from "./presentation/contexts/identity";
import { AppError, DomainError, ForbiddenError, NotFoundError, UnauthorizedError, ValidationError } from "./shared/error";
import { errorHandle } from "./error-handler";
import {cors} from "@elysiajs/cors"
import { learningRoutes } from "@presentation/contexts/learning";

const app = new Elysia({})
.use(cors({}))
.use(errorHandle)
.use(swagger({
    provider: 'swagger-ui',
    documentation: {
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter JWT token'
                }
            }
        },
    }
}))
.get('/ping', () => 'pong')
.use(identityRoutes)
.use(contentRoutes)
.use(learningRoutes)
.listen({port: 8000, reusePort: true})

console.log("Bun served");

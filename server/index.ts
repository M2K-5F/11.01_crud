import Elysia from "elysia";
import swagger from '@elysiajs/swagger'
import { contentRoutes } from "@presentation/contexts/content";
import { identityRoutes } from "@presentation/contexts/identity";
import {cors} from "@elysiajs/cors"
import { learningRoutes } from "@presentation/contexts/learning";
import { AppError } from "@shared/error";

const app = new Elysia({})
.use(cors({}))

.onError(({code, error, set }) => {
    console.log(error)

    if (code === 'VALIDATION') {
        set.status = 422

        return {code: "ERR_VALIDATION", message: error.all.map(err => {return `${err.path}:  ${err.message}`})}
    }

    if (!(error instanceof AppError)) {
        set.status = 500

        return { code: "INTERNAL", message: "internal error" }
    }

    set.status = error.status

    return { 
        code: error.code, 
        message: error.message 
    }  
})

.use(
    swagger({
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
    })
)
.get('/ping', () => 'pong')
.use(identityRoutes)
.use(contentRoutes)
.use(learningRoutes)
.listen({port: 8000, reusePort: true})

console.log("Bun served")

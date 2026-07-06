import yoga from "@elysiajs/graphql-yoga"
import { dependencies } from "@index/injection"
import { authFilter } from "@presentation/auth/middlewares/auth.middleware"
import Elysia from "elysia"


const typeDefs = `
type Course {
    id: String!
    title: String!
    description: String!
    status: String!
    createdBy: String!
}

type Query {
    course(id: String!): Course!
}
`

const app = new Elysia()
.use(dependencies)
.use(authFilter())
.use(yoga({
    typeDefs: `
        type Course {
            id: String!
        }

        type Query {
            get(id: String!): Course!
        }
    `,
    resolvers: {
        Query: {
            get: async (_, {id}) => {
                
            }
        }
    }
}))
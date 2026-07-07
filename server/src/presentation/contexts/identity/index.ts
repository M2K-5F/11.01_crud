import Elysia from "elysia";
import { userRoutes } from "./user.routes";
import { authRoutes } from "./auth.routes";

export const identityRoutes = new Elysia({prefix: "/identity", tags: ['identity']})
.use(userRoutes)
.use(authRoutes)
import Elysia from "elysia";
import { enrollmentRoutes } from "./enrollment.routes";

export const learningRoutes = new Elysia({prefix: '/learning', tags: ['learning']})
.use(enrollmentRoutes)
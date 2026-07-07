import Elysia from "elysia";
import { courseRoutes } from "./course.routes";
import { topicRoutes } from "./topic.routes";
import { questionRoutes } from "./question.routes";

export const contentRoutes = new Elysia({prefix: "/content", tags: ["content"]})
.use(courseRoutes)
.use(topicRoutes)
.use(questionRoutes)
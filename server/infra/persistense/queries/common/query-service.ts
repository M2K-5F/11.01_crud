import type { Pool } from "@m2k-5f/pgtx";
import { UserQuerier } from "../contexts/identity/user.querier";
import { CourseQuerier } from "../contexts/content/course.querier";
import { TopicQuerier } from "../contexts/content/topic.querier";
import { QuestionQuerier } from "../contexts/content/question.querier";

export class QueryService {
    constructor(
        public pool: Pool,
        readonly user = new UserQuerier(pool),
        readonly course = new CourseQuerier(pool),
        readonly topics = new TopicQuerier(pool),
        readonly question = new QuestionQuerier(pool),
    ) {}
}

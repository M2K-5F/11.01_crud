import type { Pool } from "@m2k-5f/pgtx"
import type { CourseRead, QuestionRead, TopicRead } from "../views"
import { AbstractReader } from "../common/abstract.reader"

export class CourseReader extends AbstractReader<CourseRead>  {
    constructor(pool: Pool) {super(pool, "v_courses_r")}

    async searchCourses(query: string) {
        return await this.pool.query<CourseRead>`
        select * from v_courses_r
        where title like concat('%', ${query}::text, '%') 
            or 
        description like concat('%', ${query}::text, '%')`
    }
}

export class TopicReader extends AbstractReader<TopicRead> {
    constructor(pool: Pool) {super(pool, "v_topics_r")}
}

export class QuestionReader extends AbstractReader<QuestionRead> {
    constructor(pool: Pool) {super(pool, "v_questions_r")}
}
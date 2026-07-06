import { sql, type Pool } from "@m2k-5f/pgtx"
import type { CourseRead, QuestionRead, TopicRead } from "../views"
import { AbstractReader } from "../common/abstract.reader"

export class CourseReader extends AbstractReader<CourseRead>  {
    protected override tablename: string = 'courses_r'

    async searchCourses(query: string) {
        return await this.pool.query<CourseRead>`
        select * from ${sql.ident(this.tablename)}
        where title like concat('%', ${query}::text, '%') 
            or 
        description like concat('%', ${query}::text, '%')`
    }
}

export class TopicReader extends AbstractReader<TopicRead> {
    protected override tablename: string = 'topics_r'
}

export class QuestionReader extends AbstractReader<QuestionRead> {
    protected override tablename: string = 'questions_r'
}
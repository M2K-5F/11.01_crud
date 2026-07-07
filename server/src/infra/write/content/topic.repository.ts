import type { ITopicRepository } from "@applications/interfaces/itransaction-manager"
import type { Topic } from "@domain/content/topic"
import { AbstractRepository, type Row, type RowData } from "../common/abstract_repository"
import type { Course } from "@domain/content/course"
import type { ID } from "@domain/common/abstractions"
import { sql } from "@m2k-5f/pgtx"

export class TopicRepository extends AbstractRepository<Topic> implements ITopicRepository {
    protected override tablename: string = 'topics'


    async countByCourse(courseID: ID<Course>): Promise<number> {
        const [res] = await this.tx.query<{count: number}>`
        select count(*) as count from topics 
        where data->'_byCourse' = ${courseID}`
        
        return res!.count
    }

    async listByCourse(courseID: ID<Course>): Promise<Array<Topic>> {
        const topics = await this.tx.query<RowData>`
        select data::text from ${sql.ident(this.tablename)}
        where data->'_byCourse' = ${courseID}`

        return topics.map(this.fromRow)
    }
}
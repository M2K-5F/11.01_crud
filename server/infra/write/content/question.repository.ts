import type { IQuestionRepository } from "@applications/interfaces/itransaction-manager"
import type Question from "@domain/content/question"
import { AbstractRepository, type Row, type RowData } from "../common/abstract_repository"
import type { Topic } from "@domain/content/topic"
import type { ID } from "@domain/common/abstractions"
import { sql } from "@m2k-5f/pgtx"

export class QuestionRepository extends AbstractRepository<Question> implements IQuestionRepository {
    protected override tablename: string = 'questions'


    async listByTopic(topicID: ID<Topic>): Promise<Array<Question>> {
        const res = await this.tx.query<RowData>`
        select data::text from ${sql.ident(this.tablename)}
        where data->'_byTopic' = ${topicID};`

        return res.map(this.fromRow)
    }


    async countByTopic(topicID: ID<Topic>): Promise<number> {
        const [count] = await this.tx.query<{count: number}>`
        select count(*) from ${sql.ident(this.tablename)}
        where data->'_byTopic' = ${topicID}
        `   

        return count!.count
    }
}
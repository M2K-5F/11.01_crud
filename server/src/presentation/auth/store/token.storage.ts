import { sql, type Pool } from "@m2k-5f/pgtx"
import type { Session } from "../entities"
import { Json } from "nucleus-mold"
import type { Row } from "@index/infra/write/common/abstract_repository"
import type { ID } from "@domain/common/abstractions"

export class TokenStorage {
    constructor(
        private pool: Pool,
    ) {}

    async save(session: Session) {
        const row = {id: session.id.asString(), data: Json.marshall(session)}

        await this.pool.query`
        insert into sessions 
        ${sql.insert<Row>(row)}
        on conflict (id) do update set 
        ${sql.excluded(['data'])};`
    }

    async getByID(id: ID<Session>) {
        const [row] = await this.pool.query<Row>`
        select data::text from sessions 
        where data->'_id' = ${id} 
        limit 1;`
        if (!row) return null

        return Json.unmarshall<Session>(row.data)
    }
}
import type { IRepository } from "@applications/interfaces/itransaction-manager"
import type { Entity, ID } from "@domain/common/abstractions"
import { sql, type Transaction } from "@m2k-5f/pgtx"
import type { Updatable } from "@shared/lib"
import { Json } from "nucleus-mold"

export type Row = {id: string, data: string}

export type RowData = {data: string}

export abstract class AbstractRepository<TEnt extends Entity> implements IRepository<TEnt>  {
    protected abstract tablename: string
    constructor(
        readonly tx: Transaction,
    ) {}

    protected toRow(agg: Updatable<TEnt>): Row {
        return {
            id: agg.id.asString(),
            data: Json.marshall(agg)
        }
    }

    protected fromRow(row: RowData): TEnt {
        
        return Json.unmarshall<TEnt>(row.data)
    }
    
    async save(...aggs: Array<Updatable<TEnt>>) {
        const rows = aggs.map(a => this.toRow(a))

        rows.length && await this.tx.query
        `insert into ${sql.ident(this.tablename)} 
        ${sql.insert<Row>(...rows)}
        on conflict (id) do update set 
        ${sql.excluded(['data'])}
        `
    }

    async getByID(id: ID<TEnt>) {
        const [row] = await this.tx.query<RowData>
        `select data::text from ${sql.ident(this.tablename)} 
        where id = ${id.asString()};`

        return row ? this.fromRow(row) : null
    }

    async getByIDForUpdate(id: ID<TEnt>): Promise<Updatable<TEnt> | null> {
        const [row] = await this.tx.query<RowData>
        `select data::text from ${sql.ident(this.tablename)} 
        where id = ${id.asString()} for update;` 

        return row ? this.fromRow(row) as Updatable<TEnt> : null
    }
}

import type { IRepository, ForMutate, ForMutateParam, Mutable } from "@applications/interfaces/itransaction-manager"
import type { AggregateRoot } from "@domain/common/abstractions/abstract-aggregate"
import type { ID } from "@domain/common/abstractions/abstract-identificator"
import { Pool, sql, Transaction } from "@m2k-5f/pgtx" 
import type { Identifier } from "typescript"


type GetID<T> = T extends AggregateRoot<infer Tid> ? Tid : never

export abstract class AbstractRepository<TAgg extends AggregateRoot<any>, TRow extends {id: string}> implements IRepository<TAgg, GetID<TAgg>>  {
    abstract table: any 
    constructor(
        readonly tx: Transaction,
    ) {}

    abstract toRow(agg: TAgg): TRow
    abstract fromRow(row: TRow): TAgg
    
    async save(...aggs: Array<Mutable<TAgg>>) {
        const rows = aggs.map(agg => this.toRow(agg))
        const ids = rows.map(r => r.id)

        rows.length && await this.tx.query
        `insert into ${this.table} 
        ${sql.insert<TRow>(...rows)}
        on conflict (id) do update set 
        ${sql.excluded(Object.keys(rows[0]!))}
        `
    }

    async getByID(id: GetID<TAgg>) {
        const [row] = await this.tx.query<TRow>
        `select * from ${this.table} 
        where id = ${id.id} limit 1;`

        return row ? this.fromRow(row) : null
    }

    async getByIDForMutate(id: GetID<TAgg>): Promise<Mutable<TAgg> | null> {
        const [row] = await this.tx.query<TRow>
        `select * from ${this.table} 
        where id = ${id.id} for update limit 1;` 

        return row ? this.fromRow(row) as Mutable<TAgg> : null
    }
}

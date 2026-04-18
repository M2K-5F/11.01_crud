import type { IRepository } from "@applications/interfaces/itransaction-manager"
import type { AggregateRoot } from "@domain/common/abstractions/abstract-aggregate"
import type { ID } from "@domain/common/abstractions/abstract-identificator"
import { Pool, sql, Transaction } from "@m2k-5f/pgtx" 
import type { Identifier } from "typescript"


type GetID<T> = T extends AggregateRoot<infer Tid> ? Tid : never

export abstract class AbstractRepository<TAgg extends AggregateRoot<any>, TRow extends Record<string, any>> implements IRepository<TAgg, GetID<TAgg>>  {
    abstract table: any 
    constructor(
        readonly tx: Transaction,
    ) {}

    abstract toRow(agg: TAgg): TRow
    abstract fromRow(row: TRow): TAgg
    
    async save(agg: TAgg) {
        const row = this.toRow(agg)

        const {id, ...updateRow} = row

        await this.tx.query`
        insert into ${this.table} ${sql.insert(row)}
        on conflict (id) do update set ${sql.update(updateRow)}
        `
    }

    async getByID(id: GetID<TAgg>) {
        const [row] = await this.tx.query<TRow>`select * from ${this.table} where id = ${id.id} limit 1;`
        if (!row) return null
        return this.fromRow(row)
    }

    async lock(id: GetID<TAgg>, ...others: GetID<TAgg>[]): Promise<void> {
        const ids = [id.id, ...others.map(id => id.id)]

        await this.tx.query`select id from ${this.table} where id in (${sql.array(ids.sort())}) for update;`
    }
}

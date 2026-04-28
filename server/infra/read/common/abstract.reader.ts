import { Pool, sql } from "@m2k-5f/pgtx"


export abstract class AbstractReader<View extends Record<string, any>, Params extends Record<string, any> = View> {
    constructor(
        protected pool: Pool,
        protected tablename: string
    ) {}

    async firstBy(params: Partial<Params>, offset: number = 0) {
        const [row] = await this.pool.query<View>`
        select * from ${sql.ident(this.tablename)}
        where ${sql.where(params)} offset ${offset} limit 1;` 
    
        return row
    }
    
    async allBy(params: Partial<Params>, {limit, offset} = {limit: 0, offset: 0}) {
        return await this.pool.query<View>`
        select * from ${sql.ident(this.tablename)}
        where ${sql.where(params)}
        ${limit 
            ? sql.fragment`limit ${limit}` 
            : sql.empty
        }
        ${offset 
            ?   sql.fragment`offset ${offset}`
            :   sql.empty
        };`
    }
}
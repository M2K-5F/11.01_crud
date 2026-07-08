import { Pool, sql } from "@m2k-5f/pgtx"

type Params<Struct extends {id: string}> = Partial<{[K in keyof Struct as Struct[K] extends object ? never : K]: Struct[K]}>


export abstract class AbstractReader<View extends {id: string}> {
    protected abstract tablename: string
    constructor(
        protected pool: Pool,
    ) {}

    async firstBy(params: Params<View>, offset: number = 0) {
        const hasFilters = params && Object.keys(params).length > 0;

        const [row] = await this.pool.query<View>`
        select * from ${sql.ident(this.tablename)}
        ${hasFilters
            ?   sql.fragment`where ${sql.where(params)}`
            :   sql.empty
        }
        offset ${offset} limit 1;` 
    
        return row
    }
    
    async allBy(params: Params<View>, {limit, offset}: Partial<{limit: number, offset: number}> = {limit: 0, offset: 0}) {
        const hasFilters = params && Object.keys(params).length > 0;

        return await this.pool.query<View>`
        select * from ${sql.ident(this.tablename)}
        ${hasFilters
            ?   sql.fragment`where ${sql.where(params)}`
            :   sql.empty
        }
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
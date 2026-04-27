import { AbstractRepository } from "@persistense/commands/common/abstract_repository";
import type { ForMutateParam, IUserRepository, Mutable } from "@applications/interfaces/itransaction-manager";
import hydrate from "@persistense/commands/common/hydrator";
import { sql } from "@m2k-5f/pgtx";
import User, { UserHashedPassword, UserID, UserRole, UserUsername } from "@domain/contexts/identity/user";
import TelegramLink from "@domain/common/value-objects/telegram-link";
import type { Database } from "@persistense/shemas";
import type { UserW } from "@persistense/shemas/identity/view";
import type { UserRoleRow, UserRow } from "@persistense/shemas/identity/shema";
import { t } from "elysia";

export class UserRepository extends AbstractRepository<User, UserW> implements IUserRepository {
    override table = sql.ident('v_users_w')

    fromRow(row: UserW): User {
        return hydrate(User, {
            "_id": hydrate(UserID, row.id),
            "_username": hydrate(UserUsername, row.name),
            "_telegramLink": hydrate(TelegramLink, row.telegram_link),
            "_hashedPassword": hydrate(UserHashedPassword, row.password_hash),
            "_roles": row.roles.map(role => hydrate(UserRole, role))
        })
    }

    toRow(agg: User): UserW {
        return {
            id: agg['_id']['_value'],
            name: agg["_username"]["_value"],
            password_hash: agg["_hashedPassword"]["_value"],
            telegram_link: agg["_telegramLink"]["_value"],
            roles: agg["_roles"].map(role => role['_value'])
        }
    }

    override async save(...aggs: Mutable<User>[]): Promise<void> {
        const rows = aggs.map(this.toRow)
        const ids = rows.map(r => r.id)

        const users = rows.map(({roles, ...user}) => user)
        
        const roles = rows.flatMap(r => 
            r.roles.map(role => ({
                name: role, 
                user_id: r.id
            }))
        )
            
        users.length && await this.tx.query
        `insert into users
        ${sql.insert<UserRow>(...users)}
        on conflict (id) do update set
        ${sql.excluded(Object.keys(users[0]!))}`


        await this.tx.query
        `delete from user_roles
        where user_id in (${sql.array(ids)})`

        roles.length && await this.tx.query
        `insert into user_roles
        ${sql.insert<UserRoleRow>(...roles)}`
    }


    async getByName(name: string, forMutate?: ForMutateParam) {
        const [row] = await this.tx.query<Database['v_users_w']>`select * from ${this.table} where name = ${name} limit 1 ${forMutate ? sql.fragment`for update` : sql.empty};`
        return row ? this.fromRow(row) as Mutable<User> : null
    }


    async checkNameExists(name: string): Promise<boolean> {
        const [res] = await this.tx.query<{res: 1}>`select 1 as res from users where name = ${name} limit 1;`
        return !!res
    }
}
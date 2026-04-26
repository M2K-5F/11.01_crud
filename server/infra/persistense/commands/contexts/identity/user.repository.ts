import { AbstractRepository } from "@persistense/commands/common/abstract_repository";
import type { ForMutateParam, IUserRepository, Mutable } from "@applications/interfaces/itransaction-manager";
import hydrate from "@persistense/commands/common/hydrator";
import { sql } from "@m2k-5f/pgtx";
import User, { UserHashedPassword, UserID, UserRole, UserUsername } from "@domain/contexts/identity/user";
import TelegramLink from "@domain/common/value-objects/telegram-link";
import type { Database } from "@persistense/shemas";

export class UserRepository extends AbstractRepository<User, Database['v_users_w']> implements IUserRepository {
    override table = sql.ident('v_users_w')

    fromRow(row: Database['v_users_w']): User {
        return hydrate(User, {
            "_id": hydrate(UserID, row.id),
            "_username": hydrate(UserUsername, row.name),
            "_telegramLink": hydrate(TelegramLink, row.telegram_link),
            "_hashedPassword": hydrate(UserHashedPassword, row.password_hash),
            "_roles": row.roles.map(role => hydrate(UserRole, role))
        })
    }

    toRow(agg: User): Database['v_users_w'] {
        return {
            id: agg['_id']['_value'],
            name: agg["_username"]["_value"],
            password_hash: agg["_hashedPassword"]["_value"],
            telegram_link: agg["_telegramLink"]["_value"],
            roles: agg["_roles"].map(role => role['_value'])
        }
    }

    override async save(agg: User): Promise<void> {
        const {roles, id: user_id, ...user} = this.toRow(agg)

        await this.tx.query`
        insert into users ${sql.insert({...user, id: user_id})}
        on conflict (id) do update set ${sql.excluded(Object.keys(user))};
        `


        await this.tx.query`
        delete from user_roles
        where user_id = ${user_id}`

        if (roles.length) {
            await this.tx.query`
            insert into user_roles ${sql.insert(...roles.map(name => ({user_id, name})))}`
        }
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
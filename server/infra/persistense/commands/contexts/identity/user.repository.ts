import { User } from "@domain/contexts/identity/aggregates/user";
import { AbstractRepository } from "@persistense/commands/common/abstract_repository";
import type { IUserRepository } from "@applications/interfaces/itransaction-manager";
import { UserID } from "@domain/contexts/identity/value_objects/user-id";
import hydrate from "@persistense/commands/common/hydrator";
import { Username } from "@domain/contexts/identity/value_objects/user-username";
import { TelegramLink } from "@domain/contexts/identity/value_objects/user-telegram-link";
import { HashedPassword } from "@domain/contexts/identity/value_objects/user-hashed-password";
import { UserRole } from "@domain/contexts/identity/value_objects/user-role";
import { sql } from "@m2k-5f/pgtx";
import type { UserW } from "@persistense/shemas/identity/shema";

export class UserRepository extends AbstractRepository<User, UserW> implements IUserRepository {
    override table = sql.ident('v_users_w')

    fromRow(row: UserW): User {
        return hydrate(User, {
            "_id": hydrate(UserID, row.id),
            "_username": hydrate(Username, row.name),
            "_telegramLink": hydrate(TelegramLink, row.telegram_link),
            "_hashedPassword": hydrate(HashedPassword, row.password_hash),
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

    async getByName(name: string): Promise<User | null> {
        const [row] = await this.tx.query<UserW>`select * from ${this.table} where name = ${name} limit 1;`
        return row ? this.fromRow(row) : null
    }

    async checkNameExists(name: string): Promise<boolean> {
        const [res] = await this.tx.query<{res: 1}>`select 1 as res from users where name = ${name} limit 1;`
        return !!res
    }
}
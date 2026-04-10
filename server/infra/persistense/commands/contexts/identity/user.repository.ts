import { User } from "@domain/contexts/identity/aggregates/user";
import { AbstractRepository } from "@persistense/commands/common/abstract_repository";
import type { IUserRepository } from "@applications/interfaces/itransaction-manager";
import { UserID } from "@domain/contexts/identity/value_objects/user-id";
import hydrate from "@persistense/commands/common/hydrator";
import { Username } from "@domain/contexts/identity/value_objects/user-username";
import { TelegramLink } from "@domain/contexts/identity/value_objects/user-telegram-link";
import { HashedPassword } from "@domain/contexts/identity/value_objects/user-hashed-password";
import type { UserRow } from "@persistense/shemas/identity/shema";

export class UserRepository extends AbstractRepository<User, UserRow> implements IUserRepository {
    override fromRow(row: UserRow): User {
        return hydrate(User, {
            "_id": hydrate(UserID, row.id),
            "_username": hydrate(Username, row.name),
            "_telegramLink": hydrate(TelegramLink, row.telegram_link),
            "_hashedPassword": hydrate(HashedPassword, row.password_hash)
        })
    }

    override toRow(agg: User): UserRow {
        return {
            id: agg['_id']['_value'],
            name: agg["_username"]["_value"],
            password_hash: agg["_hashedPassword"]["_value"],
            telegram_link: agg["_telegramLink"]["_value"]
        }
    }

    async getByName(name: string): Promise<User | null> {
        const [row] = await this.tx.query<UserRow>`select * from users where name = ${name} limit 1;`
        return row ? this.fromRow(row) : null
    }

    async checkNameExists(name: string): Promise<boolean> {
        const [res] = await this.tx.query<{res: 1}>`select 1 as res from users where name = ${name} limit 1;`
        return !!res
    }
}
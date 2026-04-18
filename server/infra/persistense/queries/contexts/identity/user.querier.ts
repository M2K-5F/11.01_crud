import type { UserID } from "@domain/contexts/identity/value_objects/user-id";
import { UserRole, type UserRoleValue } from "@domain/contexts/identity/value_objects/user-role";
import type { Pool } from "@m2k-5f/pgtx";
import hydrate from "@persistense/commands/common/hydrator";
import { Querier } from "@persistense/queries/common/abstract.querier";
import type { UserR } from "@persistense/shemas/identity/shema";

export class UserQuerier extends Querier<UserR> {
    constructor(pool: Pool) {super(pool, "v_users_r")}

    public async getRolesByID(id: UserID) {
        const roles = await this.pool.query<{name: UserRoleValue}>`
        select name from user_roles
        where user_id = ${id.id}`

        return roles.map(r => hydrate(UserRole, r.name))
    }
}


import { UserRole, type UserID, type UserRoleValue } from "@domain/contexts/identity/user";
import type { Pool } from "@m2k-5f/pgtx";
import hydrate from "@persistense/commands/common/hydrator";
import { Querier } from "@persistense/queries/common/abstract.querier";
import type { Database } from "@persistense/shemas";

export class UserQuerier extends Querier<Database['v_users_r']> {
    constructor(pool: Pool) {super(pool, "v_users_r")}

    public async getRolesByID(id: UserID) {
        const roles = await this.pool.query<{name: UserRoleValue}>`
        select name from user_roles
        where user_id = ${id.id}`

        return roles.map(r => hydrate(UserRole, r.name))
    }
}


import { UserID, UserRole, type UserRoleValue } from "@domain/identity/user"
import { AbstractReader } from "../common/abstract.reader"
import type { UserRead } from "../views"
import type { Pool } from "@m2k-5f/pgtx"
import hydrate from "@index/infra/write/common/hydrator"

export class UserReader extends AbstractReader<UserRead> {
    constructor(pool: Pool) {super(pool, "v_users_r")}

    public async getRolesByID(id: UserID) {
        const roles = await this.pool.query<{name: UserRoleValue}>`
        select name from user_roles
        where user_id = ${id.id}`

        return roles.map(r => hydrate(UserRole, r.name))
    }
}
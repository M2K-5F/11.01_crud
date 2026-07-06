import type { ID } from "@domain/common/abstractions"
import { AbstractReader } from "../common/abstract.reader"
import type { UserRead } from "../views"
import type { User, UserRoleType } from "@domain/identity/user"

export class UserReader extends AbstractReader<UserRead> {
    protected override tablename: string = 'users_r'

    public async getRolesByID(id: ID<User>) {
        const roles = await this.pool.query<{name: UserRoleType}>`
        select name from user_roles
        where user_id = ${id.asString()}`

        return roles.map(r=>r.name)
    }
}
import type { ID } from "@domain/common/abstractions"
import { AbstractReader } from "../common/abstract.reader"
import type { UserRead } from "@contracts"
import type { User, UserRoleType } from "@domain/identity/user"

export class UserReader extends AbstractReader<UserRead> {
    protected override tablename: string = 'users_r'
}
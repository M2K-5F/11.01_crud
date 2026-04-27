import type { UserRoleValue } from "@domain/contexts/identity/user"

// #region User
export interface UserRow {
    id: string,
    name: string,
    password_hash: string,
    telegram_link: string,
}

export interface UserRoleRow {
    name: UserRoleValue,
    user_id: string,
}
// #endregion

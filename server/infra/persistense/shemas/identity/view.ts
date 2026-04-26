import type { UserRoleRow, UserRow } from "./shema";

// #region User
export interface UserW extends UserRow {
    roles: Array<UserRoleRow['name']>
}

export interface UserR extends Pick<UserRow, 'id' | "name" | "telegram_link"> {
    roles: Array<UserRoleRow['name']>
}
// #endregion
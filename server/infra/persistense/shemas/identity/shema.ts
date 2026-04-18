export type UserW = {
    id: string,
    name: string,
    telegram_link: string,
    password_hash: string,
    roles: Array<"Student" | "Teacher">
}

export type UserR = {
    id: string,
    name: string,
    telegram_link: string,
    roles: Array<"Student" | "Teacher">
}
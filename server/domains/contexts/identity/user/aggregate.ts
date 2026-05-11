import { AggregateRoot } from "@domain/common/abstractions/abstract-aggregate";
import { ID } from "@domain/common/abstractions/abstract-identificator";
import { ValueObject } from "@domain/common/abstractions/abstract-value-object";
import type TelegramLink from "@domain/common/value-objects/telegram-link";
import { DomainError } from "@shared/error";


// #region Errors
export const ErrUsernameLength = new DomainError("USERNAME_LENGTH", "длина имени должна быть от 8 до 32 символов")
export const ErrPasswordLength = new DomainError("PASSWORD_LENGTH", "Пароль должен быть длиннее 8 символов")
// #endregion


// #region ID
export class UserID extends ID<User> {}
// #endregion


// #region Username
export class UserUsername extends ValueObject<string> {
    static create(username: string) {
        if (username.length < 8 || username.length > 32) throw ErrUsernameLength

        return new UserUsername(username)
    }
}
// #endregion


// #region Password
export interface PasswordHashStrategy {
    hash: (raw: string) => Promise<string>
    compare: (raw: string, hash: string) => Promise<boolean>
}

export class UserRawPassword extends ValueObject<string> {
    static create(password: string) {
        if (password.length < 8) throw ErrPasswordLength

        return new this(password)
    }

    async hash(strategy: PasswordHashStrategy) {
        const hash = await strategy.hash(this._value)

        return new UserHashedPassword(hash)
    }
}

export class UserHashedPassword extends ValueObject<string> {
    async verify(rawPassword: string, strategy: PasswordHashStrategy) {
        return await strategy.compare(rawPassword, this._value)
    }
}
// #endregion


// #region Role
export type UserRoleValue = 
    | "Student"
    | "Teacher"

export class UserRole extends ValueObject<UserRoleValue> {
    static get Teacher() { return new this("Teacher") }

    static get Student() { return new this("Student") }
}
// #endregion


// #region User
export default class User extends AggregateRoot<UserID> {
    private constructor(
        id: UserID,
        private _username: UserUsername,
        private _telegramLink: TelegramLink,
        private _hashedPassword: UserHashedPassword,
        private _roles: UserRole[]
    ) {super(id)}

    static register(username: UserUsername, telegramLink: TelegramLink, hashedPassword: UserHashedPassword) {
        return new User(
            UserID.generate(),
            username,
            telegramLink,
            hashedPassword,
            [UserRole.Student]
        )
    }
    
    async authenticate(password: string, strategy: PasswordHashStrategy) {
        return await this._hashedPassword.verify(password, strategy)
    }

    public get roles(): UserRole[] {
        return this._roles;
    }
}
// #endregion
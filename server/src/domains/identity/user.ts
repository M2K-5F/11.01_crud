import { Entity, ValueObject } from "@domain/common/abstractions";
import TelegramLink from "@domain/common/value-objects/telegram-link";
import { DomainError } from "@shared/error";
import type { Branded, Updatable } from "@shared/lib";
import { Serializable } from "nucleus-mold";


export const ErrUsernameLength = new DomainError("USERNAME_LENGTH", "длина имени должна быть от 8 до 32 символов")
export const ErrPasswordLength = new DomainError("PASSWORD_LENGTH", "Пароль должен быть длиннее 8 символов")
export const ErrAuthorizationFailed = new DomainError("AUTHORIZATION_FAILED")


@Serializable()
export class UserUsername extends ValueObject<string> {
    static from(username: string) {
        if (username.length < 8 || username.length > 32) throw ErrUsernameLength

        return new UserUsername(username)
    }
}


type PasswordHashType = Branded<string, 'passwordHash'>

export interface PasswordHashStrategy {
    hash: (raw: string) => Promise<string>
    compare: (raw: string, hash: string) => Promise<boolean>
}


@Serializable()
export class UserRawPassword extends ValueObject<string> {
    static from(password: string) {
        if (password.length < 8) throw ErrPasswordLength

        return new this(password)
    }

    async hash(strategy: PasswordHashStrategy) {
        const hash = await strategy.hash(this._value) as PasswordHashType

        return hash
    }

    get value() {return this._value}
}


@Serializable()
export class UserHashedPassword extends ValueObject<PasswordHashType> {
    static from(hash: PasswordHashType) {
        return new UserHashedPassword(hash)
    }

    async verify(rawPassword: UserRawPassword, strategy: PasswordHashStrategy) {
        const result = await strategy.compare(rawPassword.value, this._value)
        if (!result) throw ErrAuthorizationFailed
    }
}


export type UserRoleType = 
    | "Student"
    | "Teacher"


@Serializable()
export class UserRole extends ValueObject<UserRoleType> {
    static get Teacher() { return new UserRole("Teacher") }

    static get Student() { return new UserRole("Student") }

    asString() {return this._value}
}

@Serializable()
export class User extends Entity {
    private constructor(
        private _username: UserUsername,
        private _telegramLink: TelegramLink,
        private _hashedPassword: UserHashedPassword,
        private _roles: UserRole[]
    ) {super()}

    static register(username: UserUsername, telegramLink: TelegramLink, hashedPassword: UserHashedPassword) {
        return new User(
            username,
            telegramLink,
            hashedPassword,
            [UserRole.Student]
        ) as Updatable<User>
    }

    addRole(role: UserRole) {
        if (this._roles.some(r=>r.equals(role))) return
        
        this._roles.push(role)
    }
    
    async authenticate(password: UserRawPassword, strategy: PasswordHashStrategy) {
        await this._hashedPassword.verify(password, strategy)
    }

    public get roles(): UserRole[] {
        return this._roles;
    }
}
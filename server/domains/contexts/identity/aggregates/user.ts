import { UserID } from "../value_objects/user-id";
import { TelegramLink } from "../value_objects/user-telegram-link";
import { HashedPassword } from "../value_objects/user-hashed-password";
import { Username } from "../value_objects/user-username";
import type { PasswordHashStrategy } from "../abstractions";
import { AggregateRoot } from "@domain/common/abstractions/abstract-aggregate";

export class User extends AggregateRoot<UserID> {
    private constructor(
        id: UserID,
        private _username: Username,
        private _telegramLink: TelegramLink,
        private _hashedPassword: HashedPassword,
    ) {super(id)}

    static register(username: Username, telegramLink: TelegramLink, hashedPassword: HashedPassword) {
        return new User(
            UserID.generate(),
            username,
            telegramLink,
            hashedPassword
        )
    }
    
    async authenticate(password: string, strategy: PasswordHashStrategy) {
        return await this._hashedPassword.verify(password, strategy)
    }
}
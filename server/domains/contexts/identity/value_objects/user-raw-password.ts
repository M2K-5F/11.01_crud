import { ValueObject } from "@domain/common/abstractions/abstract-value-object";
import type { PasswordHashStrategy } from "../abstractions";
import { HashedPassword } from "./user-hashed-password";
import { ErrPasswordLength } from "../errors";

export class RawUserPassword extends ValueObject<string> {
    static create(password: string) {
        if (password.length < 8) throw ErrPasswordLength

        return new this(password)
    }

    async hash(strategy: PasswordHashStrategy) {
        const hash = await strategy.hash(this._value)

        return new HashedPassword(hash)
    }
}
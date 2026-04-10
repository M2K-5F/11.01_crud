import { ValueObject } from "@domain/common/abstractions/abstract-value-object";
import type { PasswordHashStrategy } from "../abstractions";

export class HashedPassword extends ValueObject<string> {
    async verify(rawPassword: string, strategy: PasswordHashStrategy) {
        return await strategy.compare(rawPassword, this._value)
    }
}
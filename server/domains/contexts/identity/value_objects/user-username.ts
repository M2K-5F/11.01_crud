import { ValueObject } from "@domain/common/abstractions/abstract-value-object";
import { ErrUsernameLength } from "../errors";

export class Username extends ValueObject<string> {
    static create(username: string) {
        if (username.length < 8 || username.length > 32) throw ErrUsernameLength

        return new Username(username)
    }
}
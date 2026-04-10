import { ValueObject } from "@domain/common/abstractions/abstract-value-object";
import { ErrTelegramLinkInvalid } from "../errors";

export class TelegramLink extends ValueObject<string> {
    static create(telegramLink: string) {
        if (!telegramLink.includes("https://t.me/")) throw ErrTelegramLinkInvalid

        return new this(telegramLink)
    }
}
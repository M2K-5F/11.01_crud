import { DomainError } from "@shared/error"
import { ValueObject } from "../abstractions/abstract-value-object"


export const ErrTelegramLinkInvalid = new DomainError("TELEGRAM_LINK_INVALID", "Невалидная ссылка на telegram")


export default class TelegramLink extends ValueObject<string> {
    static create(telegramLink: string) {
        if (!telegramLink.includes("https://t.me/")) throw ErrTelegramLinkInvalid

        return new this(telegramLink)
    }
}
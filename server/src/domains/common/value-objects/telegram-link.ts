import { DomainError } from "@index/src/shared/error"
import { ValueObject } from "../abstractions"
import { Serializable } from "nucleus-mold"


export const ErrTelegramLinkInvalid = new DomainError("TELEGRAM_LINK_INVALID", "Невалидная ссылка на telegram")

@Serializable()
export default class TelegramLink extends ValueObject<string> {
    static from(telegramLink: string) {
        if (!telegramLink.includes("https://t.me/")) throw ErrTelegramLinkInvalid

        return new this(telegramLink)
    }
}
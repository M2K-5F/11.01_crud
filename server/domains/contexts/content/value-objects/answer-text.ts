import { ValueObject } from "@domain/common/abstractions/abstract-value-object";
import { ErrAnswerLength } from "../errors";

export class Text extends ValueObject<string> {
    static create(text: string) {
        if (text.length < 8 || text.length > 64) throw ErrAnswerLength

        return new this(text)
    }
}
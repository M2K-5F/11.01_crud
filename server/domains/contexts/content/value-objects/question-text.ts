import { ValueObject } from "@domain/common/abstractions/abstract-value-object";
import { ErrQuestionTextLength } from "../errors";

export class Text extends ValueObject<string> {
    static create(text: string) {
        if (text.length < 8 || text.length > 128) throw ErrQuestionTextLength

        return new this(text)
    }
}
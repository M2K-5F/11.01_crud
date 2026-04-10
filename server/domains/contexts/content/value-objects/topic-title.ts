import { ValueObject } from "@domain/common/abstractions/abstract-value-object";
import { ErrTopicTitleLength } from "../errors";

export class Title extends ValueObject<string> {
    static create(title: string) {
        if (title.length < 8 || title.length > 64) throw ErrTopicTitleLength

        return new this(title)
    }
}


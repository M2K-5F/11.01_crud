import { ValueObject } from "@domain/common/abstractions/abstract-value-object";
import { ErrTopicDescriptionLength } from "../errors";

export class Description extends ValueObject<string> {
    static create(description: string) {
        if (description.length < 8 || description.length > 128) throw ErrTopicDescriptionLength

        return new this(description)
    }
}
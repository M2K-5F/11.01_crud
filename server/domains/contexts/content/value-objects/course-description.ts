import { ValueObject } from "@domain/common/abstractions/abstract-value-object";
import { ErrCourseDescriptionLength } from "../errors";

export class Description extends ValueObject<string> {
    static create(description: string) {
        if (description.length < 8 || description.length > 128) throw ErrCourseDescriptionLength

        return new this(description)
    }
}
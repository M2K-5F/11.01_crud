import { ValueObject } from "@domain/common/abstractions/abstract-value-object";

export class CorrectStatus extends ValueObject<boolean> {    
    static get correct() {return new this(true)}

    static get uncorrect() {return new this(false)}
}
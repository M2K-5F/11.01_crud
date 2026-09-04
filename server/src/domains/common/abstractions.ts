import { Serializable } from "nucleus-mold";
import { randomBytes } from "crypto";

export abstract class ValueObject<T> {
    protected _value: T
    protected constructor(value: T) {
        this._value = value
    }

    equals(other: this) {
        return Bun.deepEquals(this, other, true)
    }
}


@Serializable()
export class ID<T extends Entity> extends ValueObject<string> {
    declare protected __brand: T

    static generate<T extends Entity>(): ID<T> {
        return new ID(randomBytes(16).toString('base64url'))
    }

    static from<T extends Entity>(plain: string): ID<T> {
        return new ID<T>(plain)
    }

    asString() { return this._value }
}


export abstract class Entity {
    protected _id: ID<this>

    protected constructor() {
        this._id = ID.generate()
    }

    get id() {return this._id}

    equals(other: this) {
        return this._id.equals(other._id)
    }
}

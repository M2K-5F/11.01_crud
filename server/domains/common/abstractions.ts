import { ValidationError } from "@shared/error";
import { Serializable } from "nucleus-mold";


export abstract class ValueObject<T> {
    protected _value: T
    protected constructor(value: T) {
        this._value = value
    }

    equals(other: this) {
        return Bun.deepEquals(this, other, true)
    }
}


export const ErrInvalidIdFormat = new ValidationError("Invalid identificator format")


const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i


@Serializable()
export class ID<T extends Entity> extends ValueObject<string> {
    declare protected __brand: T

    static generate<T extends Entity>(): ID<T> {
        return new ID(crypto.randomUUID())
    }

    static from<T extends Entity>(plain: string): ID<T> {
        if (!UUID_REGEX.test(plain)) {
            throw ErrInvalidIdFormat
        }
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

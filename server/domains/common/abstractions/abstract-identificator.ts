import { ValidationError } from "../../../shared/error";
import { ValueObject } from "./abstract-value-object";


export abstract class ID<T> extends ValueObject<string>{

    declare protected __brand: T; 
    protected static readonly UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    static generate<T extends ID<any>>(this: Function & { prototype: T }): T {
        return new (this as any)(crypto.randomUUID())
    }

    static fromString<T extends ID<any>>(this: Function & { prototype: T }, id: string): T {
        if (!ID.UUID_REGEX.test(id)) {
            throw new ValidationError("Unvalid identificator format")
        }
        return new (this as any)(id)
    }

    get id() {
        return this._value
    }
}

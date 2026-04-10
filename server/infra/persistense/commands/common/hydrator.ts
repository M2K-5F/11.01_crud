import type { AggregateRoot } from "@domain/common/abstractions/abstract-aggregate"
import { ValueObject } from "@domain/common/abstractions/abstract-value-object"

function hydrate<T extends ValueObject<any>>(
    ClassRef: {prototype: T},
    value: T extends ValueObject<infer U> ? U : never
): T

function hydrate<T extends AggregateRoot<any>>(
    ClassRef: {prototype: T},
    data: Partial<Record<string, any>>
): T 

function hydrate(ClassRef: {prototype: any}, data: any) {
    if (ClassRef.prototype instanceof ValueObject) {
        const instance = Object.create(ClassRef.prototype)
        return Object.assign(instance, {"_value": data})
    }
    const instance = Object.create(ClassRef.prototype)
    return Object.assign(instance, data)
}

export default hydrate
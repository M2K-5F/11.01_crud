import { ValueObject } from "@domain/common/abstractions/abstract-value-object";

export type StatusValue = "active" | "archived"

export class Status extends ValueObject<StatusValue> {
    static get archived() {return new Status("archived")}

    static get active() {return new Status("active")}

    static $hydrate(value: StatusValue) {
        return new this(value)
    }
}
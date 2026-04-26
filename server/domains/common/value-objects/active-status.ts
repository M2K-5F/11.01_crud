import { ValueObject } from "@domain/common/abstractions/abstract-value-object";

export type StatusValue = "active" | "archived"

export class Status extends ValueObject<StatusValue> {
    static get Archived() {return new Status("archived")}

    static get Active() {return new Status("active")}
}
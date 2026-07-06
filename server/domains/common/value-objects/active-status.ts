import { Serializable } from "nucleus-mold"
import { ValueObject } from "../abstractions"

export type StatusType = "active" | "archived"


@Serializable()
export class Status extends ValueObject<StatusType> {
    static get Archived() {return new Status("archived")}

    static get Active() {return new Status("active")}
}
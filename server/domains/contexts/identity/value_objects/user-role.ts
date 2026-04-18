import { ValueObject } from "@domain/common/abstractions/abstract-value-object";

export type UserRoleValue = 
    | "Student"
    | "Teacher"

export class UserRole extends ValueObject<UserRoleValue> {
    static teacher() { return new this("Teacher") }

    static student() { return new this("Student") }
}
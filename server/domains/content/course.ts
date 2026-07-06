import { Entity, ID, ValueObject } from "@domain/common/abstractions"
import { Status } from "@domain/common/value-objects/active-status"
import type { User } from "@domain/identity/user"
import { DomainError } from "@shared/error"
import type { Updatable } from "@shared/lib"

const ErrCourseTitleLength = new DomainError("COURSE_TITLE_LENGTH", "Название курса должно быть от 8 до 64 символов в длину")
const ErrCourseDescriptionLength = new DomainError("COURSE_DESCRIPTION_LENGTH", "Описание курса должно быть от 8 до 128 символов в длину")
const ErrCourseArchived = new DomainError("COURSE_ARCHIVED")
const ErrCourseActive = new DomainError("COURSE_ACTIVE")


export class CourseTitle extends ValueObject<string> {
    static from(title: string) {
        if (title.length < 8 || title.length > 64) throw ErrCourseTitleLength

        return new this(title)
    }
}


export class CourseDescription extends ValueObject<string> {
    static from(description: string) {
        if (description.length < 8 || description.length > 128) throw ErrCourseDescriptionLength

        return new this(description)
    }
}


export class Course extends Entity {
    private constructor(
        private _title: CourseTitle,
        private _description: CourseDescription,
        private _status: Status,
        private _createdBy: ID<User>
    ) {super()}

    static create(title: CourseTitle, description: CourseDescription, createdBy: ID<User>) {
        return new Course(
            title,
            description,
            Status.Active,
            createdBy
        ) as Updatable<Course>
    }

    archive() {
        if (this._status.equals(Status.Archived)) throw ErrCourseArchived

        this._status = Status.Archived
    }

    activate() {
        if (this._status.equals(Status.Active)) throw ErrCourseActive

        this._status = Status.Active
    }

    get createdBy() {return this._createdBy}
}
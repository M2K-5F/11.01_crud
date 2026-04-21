import { AggregateRoot } from "@domain/common/abstractions/abstract-aggregate";
import { Status } from "@domain/common/value-objects/active-status";
import { ID } from "@domain/common/abstractions/abstract-identificator";
import { ValueObject } from "@domain/common/abstractions/abstract-value-object";
import { DomainError } from "@shared/error";
import type { UserID } from "@domain/contexts/identity/user";


// #region Errors
const ErrCourseTitleLength = new DomainError("COURSE_TITLE_LENGTH", "Название курса должно быть от 8 до 64 символов в длину")
const ErrCourseDescriptionLength = new DomainError("COURSE_DESCRIPTION_LENGTH", "Описание курса должно быть от 8 до 128 символов в длину")
const ErrCourseArchived = new DomainError("COURSE_ARCHIVED")
const ErrCourseActive = new DomainError("COURSE_ACTIVE")
// #endregion


// #region ID
export class CourseID extends ID {}
// #endregion


// #region Title
export class CourseTitle extends ValueObject<string> {
    static create(title: string) {
        if (title.length < 8 || title.length > 64) throw ErrCourseTitleLength

        return new this(title)
    }
}
// #endregion


// #region Description
export class CourseDescription extends ValueObject<string> {
    static create(description: string) {
        if (description.length < 8 || description.length > 128) throw ErrCourseDescriptionLength

        return new this(description)
    }
}
// #endregion


// #region Course
export default class Course extends AggregateRoot<CourseID> {
    private constructor(
        id: CourseID,
        private _title: CourseTitle,
        private _description: CourseDescription,
        private _status: Status,
        private _createdBy: UserID
    ) {super(id)}

    static create(title: CourseTitle, description: CourseDescription, createdBy: UserID) {
        return new Course(
            CourseID.generate(),
            title,
            description,
            Status.active,
            createdBy
        )
    }

    archive() {
        if (this._status.equal(Status.archived)) throw ErrCourseArchived

        this._status = Status.archived
    }

    activate() {
        if (this._status.equal(Status.active)) throw ErrCourseActive

        this._status = Status.active
    }

    get createdBy() {return this._createdBy}
}
// #endregion
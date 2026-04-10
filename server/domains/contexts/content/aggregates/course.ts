import { CourseID } from "../value-objects/course-id";
import { UserID } from "@domain/contexts/identity/value_objects/user-id";
import { ErrCourseActive, ErrCourseArchived } from "../errors";
import type { Title } from "../value-objects/course-title";
import type { Description } from "../value-objects/course-description";
import { AggregateRoot } from "@domain/common/abstractions/abstract-aggregate";
import { Status } from "@domain/common/value-objects/active-status";


export class Course extends AggregateRoot<CourseID> {
    private constructor(
        id: CourseID,
        private _title: Title,
        private _description: Description,
        private _status: Status,
        private _createdBy: UserID
    ) {super(id)}

    static create(title: Title, description: Description, createdBy: UserID) {
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
import { TopicID } from "../value-objects/topic-id"
import { CourseID } from "../value-objects/course-id"
import { Title } from "../value-objects/topic-title"
import { Description } from "../value-objects/topic-description"
import type { UserID } from "@domain/contexts/identity/value_objects/user-id"
import { Status } from "@domain/common/value-objects/active-status"
import { AggregateRoot } from "@domain/common/abstractions/abstract-aggregate"
import { ErrTopicActive, ErrTopicArchived } from "../errors"

export class Topic extends AggregateRoot<TopicID> {
    private constructor(
        id: TopicID,
        private _title: Title,
        private _description: Description ,
        private _byCourse: CourseID,
        private _createdBy: UserID,
        private _status: Status
    ) {super(id)}

    static create(byCourse: CourseID, title: Title, description: Description, createdBy: UserID) {
        return new Topic(
            TopicID.generate(),
            title,
            description,
            byCourse,
            createdBy,
            Status.active
        )
    }

    archive() {
        if (this._status.equal(Status.archived)) throw ErrTopicArchived
        
        this._status = Status.archived
    }

    activate() {
        if (this._status.equal(Status.active)) throw ErrTopicActive

        this._status = Status.active
    }

    get createdBy() { return this._createdBy }
}
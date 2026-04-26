import { AggregateRoot } from "@domain/common/abstractions/abstract-aggregate"
import { ID } from "@domain/common/abstractions/abstract-identificator"
import { ValueObject } from "@domain/common/abstractions/abstract-value-object"
import { DomainError } from "@shared/error"
import type { CourseID } from "../course"
import { Status } from "@domain/common/value-objects/active-status"
import type { UserID } from "@domain/contexts/identity/user"


// #region Errors
export const ErrTopicArchived = new DomainError("TOPIC_ARCHIVED")
export const ErrTopicActive = new DomainError("TOPIC_ACTIVE")
export const ErrTopicTitleLength = new DomainError("TOPIC_TITLE_LENGTH")
export const ErrTopicDescriptionLength = new DomainError("TOPIC_DESCRIPTION_LENGTH")
// #endregion


// #region ID
export class TopicID extends ID {}
// #endregion


// #region Title
export class TopicTitle extends ValueObject<string> {
    static create(title: string) {
        if (title.length < 8 || title.length > 64) throw ErrTopicTitleLength

        return new this(title)
    }
}
// #endregion


// #region Description
export class TopicDescription extends ValueObject<string> {
    static create(description: string) {
        if (description.length < 8 || description.length > 128) throw ErrTopicDescriptionLength

        return new this(description)
    }
}
// #endregion


// #region Number
export class TopicNumber extends ValueObject<number> {
    static create(number: number) {
        return new TopicNumber(number)
    }
}
// #endregion


// #region Topic
export default class Topic extends AggregateRoot<TopicID> {
    private constructor(
        id: TopicID,
        private _title: TopicTitle,
        private _description: TopicDescription ,
        private _byCourse: CourseID,
        private _createdBy: UserID,
        private _status: Status,
        private _number: TopicNumber
    ) {super(id)}


    static create(byCourse: CourseID, title: TopicTitle, description: TopicDescription, createdBy: UserID, number: TopicNumber) {
        return new Topic(
            TopicID.generate(),
            title,
            description,
            byCourse,
            createdBy,
            Status.Active,
            number
        )
    }


    archive() {
        if (this._status.equal(Status.Archived)) throw ErrTopicArchived
        
        this._status = Status.Archived
    }


    activate() {
        if (this._status.equal(Status.Active)) throw ErrTopicActive

        this._status = Status.Active
    }


    get courseID() {return this._byCourse}
    get createdBy() { return this._createdBy }
}
// #endregion
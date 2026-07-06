import { Entity, ID, ValueObject } from "@domain/common/abstractions"
import { DomainError } from "@shared/error"
import type { Course } from "./course"
import type { User } from "@domain/identity/user"
import { Status } from "@domain/common/value-objects/active-status"
import type { Updatable } from "@shared/lib"

export const ErrTopicArchived = new DomainError("TOPIC_ARCHIVED")
export const ErrTopicActive = new DomainError("TOPIC_ACTIVE")
export const ErrTopicTitleLength = new DomainError("TOPIC_TITLE_LENGTH")
export const ErrTopicDescriptionLength = new DomainError("TOPIC_DESCRIPTION_LENGTH")


export class TopicTitle extends ValueObject<string> {
    static from(title: string) {
        if (title.length < 8 || title.length > 64) throw ErrTopicTitleLength

        return new TopicTitle(title)
    }
}


export class TopicDescription extends ValueObject<string> {
    static from(description: string) {
        if (description.length < 8 || description.length > 128) throw ErrTopicDescriptionLength

        return new TopicDescription(description)
    }
}


export class TopicNumber extends ValueObject<number> {
    static from(number: number) {
        return new TopicNumber(number)
    }

    next() {return new TopicNumber(this._value + 1)}
    previous() {return new TopicNumber(this._value - 1)}

    isFirst() {return this._value === 0}

    get asNumber() {return this._value}
}

export class Topic extends Entity {
    private constructor(
        private _title: TopicTitle,
        private _description: TopicDescription ,
        private _byCourse: ID<Course>,
        private _createdBy: ID<User>,
        private _status: Status,
        private _prerequisites: TopicNumber[],
        private _number: TopicNumber
    ) {super()}


    static createWithFreeAccess(byCourse: ID<Course>, title: TopicTitle, description: TopicDescription, createdBy: ID<User>, number: TopicNumber) {
        return new Topic(
            title,
            description,
            byCourse,
            createdBy,
            Status.Active,
            [],
            number
        ) as Updatable<Topic>
    }


    static createWithAccessAfterPrevious(byCourse: ID<Course>, title: TopicTitle, description: TopicDescription, createdBy: ID<User>, number: TopicNumber) {
        return new Topic(
            title,
            description,
            byCourse,
            createdBy,
            Status.Active,
            number.isFirst() ? [] : [number.previous()],
            number
        ) as Updatable<Topic>
    }


    archive() {
        if (this._status.equals(Status.Archived)) throw ErrTopicArchived
        
        this._status = Status.Archived
    }


    activate() {
        if (this._status.equals(Status.Active)) throw ErrTopicActive

        this._status = Status.Active
    }


    get courseID() {return this._byCourse}
    get createdBy() { return this._createdBy }
    get prerequisites() {return this._prerequisites }

}


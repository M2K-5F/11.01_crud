import { Entity, ID, ValueObject } from "@domain/common/abstractions"
import type { Course } from "@domain/content/course"
import type { User } from "@domain/identity/user"
import { DomainError } from "@shared/error"
import { TopicEnrollment, type TopicEnrollmentAttempt } from "./topic-enrollment"
import type { TopicNumber } from "@domain/content/topic"
import type { Updatable } from "@shared/lib"
import { Serializable } from "nucleus-mold"
import { HashMap } from "@domain/common/value-objects/hash-map"

export const ErrTopicEnrollmentNotDefined = new DomainError('TOPIC_ENROLLMENT_NOT_DEFINED', 'TOPIC_ENROLLMENT_NOT_DEFINED')


@Serializable()
export class EnrollmentProgress extends ValueObject<number> {
    static createNullish() {
        return new EnrollmentProgress(0)
    }

    incremented() { return new EnrollmentProgress(this._value + 1) }

    get completedCount() { return this._value }
}


@Serializable()
export class Enrollment extends Entity {
    private constructor(
        private _userID: ID<User>,
        private _courseID: ID<Course>,
        private _progress: EnrollmentProgress,
        private _topicEnrollments: HashMap<TopicNumber, TopicEnrollment>
    ) { super() }


    static create(userID: ID<User>, courseID: ID<Course>) {
        return new Enrollment(
            userID,
            courseID,
            EnrollmentProgress.createNullish(),
            HashMap.new()
        ) as Updatable<Enrollment>
    }


    registerAttempt(attempt: TopicEnrollmentAttempt) {
        const number = attempt.number
        if (!this._topicEnrollments.has(number)) {
            this._topicEnrollments.set(number, TopicEnrollment.create(attempt.topicID))
        }

        const topicEnrollment = this._topicEnrollments.get(number)!
        const wasCompleted = topicEnrollment.isCompleted()

        topicEnrollment.registerAttempt(attempt)

        if (!wasCompleted && topicEnrollment.isCompleted()) {
            this._progress = this._progress.incremented()
        }
    }


    canStartTopic(number: TopicNumber, prerequisites: TopicNumber[]) {
        if (number.isFirst()) return true

        const passed = prerequisites.every(req => {
            const enroll = this._topicEnrollments.get(req)

            return enroll ? enroll.isCompleted() : false
        })
        
        return passed
    }
}
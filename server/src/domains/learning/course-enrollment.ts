import { Entity, ID, ValueObject } from "@domain/common/abstractions"
import type { Course } from "@domain/content/course"
import type { User } from "@domain/identity/user"
import { DomainError } from "@index/src/shared/error"
import { TopicEnrollment, type TopicEnrollmentAttempt } from "./topic-enrollment"
import type { TopicNumber } from "@domain/content/topic"
import type { Updatable } from "@index/src/shared/lib"

export const ErrTopicEnrollmentNotDefined = new DomainError('TOPIC_ENROLLMENT_NOT_DEFINED')


export class EnrollmentProgress extends ValueObject<number> {
    static createNullish() {
        return new EnrollmentProgress(0)
    }

    incremented() { return new EnrollmentProgress(this._value + 1) }

    get completedTopics() { return this._value }
}

type TopicNumberType = number

export class Enrollment extends Entity {
    private constructor(
        private _userID: ID<User>,
        private _courseID: ID<Course>,
        private _progress: EnrollmentProgress,
        private _topicEnrollments: Record<TopicNumberType, TopicEnrollment>
    ) { super() }


    static create(userID: ID<User>, courseID: ID<Course>, progress: EnrollmentProgress) {
        return new Enrollment(
            userID,
            courseID,
            progress,
            {}
        ) as Updatable<Enrollment>
    }


    public registerAttempt(attempt: TopicEnrollmentAttempt) {
        if (!this._topicEnrollments[attempt.number.asNumber]) {
            this._topicEnrollments[attempt.number.asNumber] = TopicEnrollment.create(attempt.topicID)
        }

        const topicEnrollment = this._topicEnrollments[attempt.number.asNumber]!

        if (topicEnrollment.isCompleted) {
            return
        }

        topicEnrollment.registerAttempt(attempt)

        if (topicEnrollment.isCompleted) {
            this._progress = this._progress.incremented()
        }
    }


    canStartTopic(number: TopicNumber) {
        if (number.asNumber === 0) return true
        
        const topic = this._topicEnrollments[number.asNumber]

        if (topic) return true

        const previous = this._topicEnrollments[number.asNumber - 1]

        return previous?.isCompleted || false
    }
}
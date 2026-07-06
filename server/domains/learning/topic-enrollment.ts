import { Entity, ID, ValueObject } from "@domain/common/abstractions"
import type { TopicNumber } from "@domain/content/topic"
import type Topic from "@domain/content/topic"
import type { Updatable } from "@shared/lib"

export class TopicEnrollmentProgress extends ValueObject<{completed: number, total: number,}> {
    static createNullish() {
        return new TopicEnrollmentProgress({
            completed: 0,
            total: 0,
        })
    }

    updateOnAttempt(completed: number, total: number) {
        return new TopicEnrollmentProgress({
            total, completed
        })
    }
    
    get total() {return this._value.total}
    get ratio() {return this._value.completed / this._value.total || 0}
}


export class TopicEnrollmentAttempt extends ValueObject<{
    attemptedAt: Date, 
    completed: number,
    total: number, 
    topicID: ID<Topic>,
    topicNumber: TopicNumber
}> {
    static create(completed: number, total: number, topicID: ID<Topic>, topicNumber: TopicNumber) {
        return new TopicEnrollmentAttempt({
            attemptedAt: new Date(),
            completed, total, topicID, topicNumber
        })
    }

    get completed() {return this._value.completed}
    get total() {return this._value.total}
    get ratio() {return this._value.completed / this._value.total || 0}
    get topicID() {return this._value.topicID}
    get number() {return this._value.topicNumber}
}


export class TopicEnrollment extends Entity {
    private static readonly COMPLETION_THRESHOLD = 0.8

    private constructor(
        private _topicID: ID<Topic>,
        private _progress: TopicEnrollmentProgress
    ) { super() }

    static create(topicID: ID<Topic>) {
        return new TopicEnrollment(
            topicID,
            TopicEnrollmentProgress.createNullish(),
        ) as Updatable<TopicEnrollment>
    }

    registerAttempt(attempt: TopicEnrollmentAttempt) {
        if (attempt.ratio >= this._progress.ratio) {
            this._progress = this._progress.updateOnAttempt(attempt.completed, attempt.total)
        }
    }


    get isCompleted() { return this._progress.ratio >= TopicEnrollment.COMPLETION_THRESHOLD }
    get topicID() { return this._topicID }
}
// #endregion
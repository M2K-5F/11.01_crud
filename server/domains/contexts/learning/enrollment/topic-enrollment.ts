import { AggregateRoot } from "@domain/common/abstractions/abstract-aggregate"
import { Entity } from "@domain/common/abstractions/abstract-entity"
import { ID } from "@domain/common/abstractions/abstract-identificator"
import { ValueObject } from "@domain/common/abstractions/abstract-value-object"
import type { TopicID } from "@domain/contexts/content/topic"


// #region ID
export class TopicEnrollmentID extends ID {}
// #endregion


// #region Progress
export class TopicEnrollmentProgress extends ValueObject<{
    completedQuestions: number,
    questionCount: number,
}> {
    static create(collected: number, questionCount: number) {
        return new TopicEnrollmentProgress({
            completedQuestions: collected,
            questionCount: questionCount,
        })
    }
    
    get questionCount() {return this._value.questionCount}
    get ratio() {return this._value.completedQuestions / this._value.questionCount || 0}
    get isCompleted() { return this.ratio >= 0.8 }
}
// #endregion


// #region Attempt
export class TopicEnrollmentAttempt extends ValueObject<{
    attemptedAt: Date, 
    completedQuestions: number,
    questionCount: number
}> {
    static create(completed: number, total: number) {
        return new TopicEnrollmentAttempt({
            attemptedAt: new Date(),
            completedQuestions: completed,
            questionCount: total
        })
    }

    get questionCount() {return this._value.questionCount}
    get completedQuestions() {return this._value.completedQuestions}
    get ratio() {return this._value.completedQuestions / this._value.questionCount || 0}
    get isSuccess() {return this.ratio >= 0.8}
}
// #endregion


// #region TopicEnrollment
export class TopicEnrollment extends Entity<TopicEnrollmentID> {
    private constructor(
        id: TopicEnrollmentID,
        private _topicID: TopicID,
        private _progress: TopicEnrollmentProgress,
        private _attempts: Array<TopicEnrollmentAttempt>
    ) { super(id) }

    static create(firstAttempt: TopicEnrollmentAttempt, topicID: TopicID) {
        const enroll = new TopicEnrollment(
            TopicEnrollmentID.generate(),
            topicID,
            TopicEnrollmentProgress.create(0, 0),
            []
        )

        enroll.registerAttempt(firstAttempt)

        return enroll
    }

    registerAttempt(attempt: TopicEnrollmentAttempt) {
        this._attempts.push(attempt)

        console.log(attempt, attempt.ratio, attempt.isSuccess, this._progress.ratio, attempt.isSuccess && attempt.ratio >= this._progress.ratio);
        
        if (attempt.isSuccess && attempt.ratio >= this._progress.ratio) {
            this._progress = TopicEnrollmentProgress.create(attempt.completedQuestions, attempt.questionCount)
        }
    }

    get isCompleted() {return this._progress.isCompleted}
}
// #endregion
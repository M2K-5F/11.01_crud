import { AggregateRoot } from "@domain/common/abstractions/abstract-aggregate";
import { ID } from "@domain/common/abstractions/abstract-identificator";
import { ValueObject } from "@domain/common/abstractions/abstract-value-object";
import { TopicEnrollment, TopicEnrollmentAttempt } from "./topic-enrollment";
import type { UserID } from "@domain/contexts/identity/user";
import type { CourseID } from "@domain/contexts/content/course";
import type { TopicID } from "@domain/contexts/content/topic";
import type { Branded } from "@shared/lib";
import { DomainError } from "@shared/error";
import { isThisTypeNode } from "typescript";


// #region Errors
export const ErrTopicEnrollmentNotDefined = new DomainError('TOPIC_ENROLLMENT_NOT_DEFINED')
// #endregion


// #region ID
export class EnrollmentID extends ID<Enrollment> {}
// #endregion


// #region Progress
export class EnrollmentProgress extends ValueObject<{
    completedTopics: number,
    topicsCount: number
}> {
    static createNullish(topicsCount: number) {
        return new EnrollmentProgress({completedTopics: 0, topicsCount})
    }

    updateOnTopicComplete(totalConpletedTopics: number) {
        return new EnrollmentProgress({
            completedTopics: totalConpletedTopics,
            topicsCount: this._value.topicsCount
        })
    }

    updateOnTopicCreate(totalTopics: number) {
        return new EnrollmentProgress({
            completedTopics: this._value.completedTopics,
            topicsCount: totalTopics
        })
    }

    get topicCount() {return this._value.topicsCount}
    get ratio() {return this._value.completedTopics / this._value.topicsCount || 0}
    get isCompleted() {return this._value.completedTopics === this._value.topicsCount}
}
// #endregion


// #region Enrollment
export class Enrollment extends AggregateRoot<EnrollmentID> {
    private constructor(
        id: EnrollmentID,
        private _userID: UserID,
        private _courseID: CourseID,
        private _progress: EnrollmentProgress,
        private _topicEnrollments: Map<string, TopicEnrollment>
    ) { super(id) }


    static create(userID: UserID, courseID: CourseID, progress: EnrollmentProgress, topicEnrollments: TopicEnrollment[]) {
        return new Enrollment(
            EnrollmentID.generate(),
            userID,
            courseID,
            progress,
            new Map(topicEnrollments.map(te => [te.topicID.id, te] as const))
        )
    }


    public registerAttempt(attempt: TopicEnrollmentAttempt, topicID: TopicID) {
        const topicEnrollment = this._topicEnrollments.get(topicID.id)

        if (!topicEnrollment) throw ErrTopicEnrollmentNotDefined

        if (topicEnrollment.isCompleted) {
            topicEnrollment.registerAttempt(attempt)
            return
        }

        topicEnrollment.registerAttempt(attempt)

        if (topicEnrollment.isCompleted) this._updateProgress()
    }


    public canStartNextTopic(previousTopicID: TopicID) {
        const topicEnrollment = this._topicEnrollments.get(previousTopicID.id)

        return topicEnrollment?.isCompleted ?? false
    }


    public updateOnTopicCreate(topicID: TopicID, totalTopics: number) {
        this._progress = this._progress.updateOnTopicCreate(totalTopics)

        this._topicEnrollments.set(topicID.id, TopicEnrollment.create(topicID, 0))
    }


    public updateOnQuestionCreate(topicID: TopicID, totalQuestions: number) {
        const topicEnrollment = this._topicEnrollments.get(topicID.id)

        if (!topicEnrollment) throw ErrTopicEnrollmentNotDefined

        topicEnrollment.updateOnQuestionCreate(totalQuestions)
    }


    private _updateProgress() {
        this._progress = this._progress.updateOnTopicComplete(
            this._topicEnrollments.values().toArray()
                .filter(te => te.isCompleted)
                .length
        )
    }


    get isCompleted() {return this._progress.isCompleted}
}
// #endregion
import { AggregateRoot } from "@domain/common/abstractions/abstract-aggregate";
import { ID } from "@domain/common/abstractions/abstract-identificator";
import { ValueObject } from "@domain/common/abstractions/abstract-value-object";
import { TopicEnrollment, TopicEnrollmentAttempt } from "./topic-enrollment";
import type { UserID } from "@domain/contexts/identity/user";
import type { CourseID } from "@domain/contexts/content/course";
import type { TopicID } from "@domain/contexts/content/topic";
import type { Branded } from "@shared/lib";


// #region ID
export class EnrollmentID extends ID {}
// #endregion


// #region Progress
export class EnrollmentProgress extends ValueObject<{
    completedTopics: number,
    topicsCount: number
}> {
    static createNullish(topicsCount: number) {
        return new EnrollmentProgress({completedTopics: 0, topicsCount})
    }

    updateCompletedTopics(completedCount: number) {
        return new EnrollmentProgress({
            completedTopics: completedCount,
            topicsCount: this._value.topicsCount
        })
    }

    onTopicAdd() {
        return new EnrollmentProgress({
            completedTopics: this._value.completedTopics,
            topicsCount: this._value.topicsCount + 1
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


    static create(userID: UserID, courseID: CourseID, progress: EnrollmentProgress) {
        return new Enrollment(
            EnrollmentID.generate(),
            userID,
            courseID,
            progress,
            new Map()
        )
    }


    public registerAttempt(attempt: TopicEnrollmentAttempt, topicID: TopicID) {
        if (!this._topicEnrollments.has(topicID.id)) {
            const enroll = TopicEnrollment.create(attempt, topicID)

            this._topicEnrollments.set(topicID.id, enroll)
        }
        else {
            const enroll = this._topicEnrollments.get(topicID.id)!

            enroll.registerAttempt(attempt)

            this._topicEnrollments.set(topicID.id, enroll)
        }

        this._progress = this._progress.updateCompletedTopics(
            this._topicEnrollments
                .values()
                .toArray()
                .filter(enroll => enroll.isCompleted)
                .length
        )
    }

    public canStartNextTopic(previousTopicID?: TopicID) {
        if (!previousTopicID) return true

        const topicEnrollment = this._topicEnrollments.get(previousTopicID.id)

        return topicEnrollment?.isCompleted ?? false
    }

    public onTopicAdd() {
        this._progress = this._progress.onTopicAdd()
    }

    get isCompleted() {return this._progress.isCompleted}
}
// #endregion
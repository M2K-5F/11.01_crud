import { AggregateRoot } from "@domain/common/abstractions/abstract-aggregate";
import { ID } from "@domain/common/abstractions/abstract-identificator";
import { ValueObject } from "@domain/common/abstractions/abstract-value-object";
import { TopicEnrollment, type TopicEnrollmentAttempt } from "./topic-enrollment";
import type { UserID } from "@domain/contexts/identity/user";
import type { CourseID } from "@domain/contexts/content/course";
import type { TopicID } from "@domain/contexts/content/topic";


// #region ID
class EnrollmentID extends ID {}
// #endregion


// #region Progress
export class EnrollmentProgress extends ValueObject<{
    completedTopics: number,
    topicsCount: number
}> {
    static create(completed: number, count: number) {
        return new EnrollmentProgress({completedTopics: completed, topicsCount: count})
    }

    updateCompletedTopics(completedCount: number) {
        return EnrollmentProgress.create(
            completedCount,
            this._value.topicsCount
        )
    }

    onTopicAdd() {
        return EnrollmentProgress.create(
            this._value.completedTopics,
            this._value.topicsCount + 1
        )
    }

    get topicCount() {return this._value.topicsCount}
    get ratio() {return this._value.completedTopics / this._value.topicsCount}
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
        private _topicEnrollments: Map<TopicID, TopicEnrollment>
    ) { super(id) }

    public registerAttempt(attempt: TopicEnrollmentAttempt, topicID: TopicID) {
        if (!this._topicEnrollments.has(topicID)) {
            const enroll = TopicEnrollment.create(attempt, topicID)

            this._topicEnrollments.set(topicID, enroll)
        }
        else {
            const enroll = this._topicEnrollments.get(topicID)!

            enroll.registerAttempt(attempt)

            this._topicEnrollments.set(topicID, enroll)
        }

        this._progress = this._progress.updateCompletedTopics(
            this._topicEnrollments
                .values()
                .toArray()
                .filter(enroll => enroll.isCompleted)
                .length
        )
    }

    onTopicAdd() {
        this._progress = this._progress.onTopicAdd()
    }

    get isCompleted() {return this._progress.isCompleted}
}
// #endregion
import type Topic from "@domain/contexts/content/topic";
import type { CourseEnrollmentRow, TopicAttemptRow, TopicEnrollmentRow } from "./shema";

// #region Enrollment
export interface EnrollmentW extends CourseEnrollmentRow {
    topics: Array<{
        topic: TopicEnrollmentRow,
        attempts: Array<TopicAttemptRow>
    }>
}

export interface EnrollmentR extends CourseEnrollmentRow {}
// #endregion

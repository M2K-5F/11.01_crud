import type { AnswerRow, CourseRow, QuestionRow, TopicRow } from "../write/contexts/content/shema"
import type { UserRoleRow, UserRow } from "../write/contexts/identity/shema"
import type { CourseEnrollmentRow } from "../write/contexts/learning/shema"

// #region User
export interface UserRead extends Pick<UserRow, 'id' | "name" | "telegram_link"> {
    roles: Array<UserRoleRow['name']>
}
// #endregion


// #region Course
export interface CourseRead extends CourseRow {
    created_by: string,
    topics_count: number,
    students_count: number
}
// #endregion


// #region Topic

export interface TopicRead extends TopicRow {
    questions_count: number
}
// #endregion


// #region Question

export interface QuestionRead extends QuestionRow {
    answers: Array<AnswerRow>
}
// #endregion

// #region Enrollment

export interface EnrollmentRead extends CourseEnrollmentRow {}
// #endregion

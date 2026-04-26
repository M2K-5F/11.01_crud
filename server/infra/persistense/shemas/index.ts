import type Question from "@domain/contexts/content/question"
import type { AnswerRow, CourseRow, QuestionRow, TopicRow } from "./content/shema"
import type { CourseR, CourseW, QuestionR, QuestionW, TopicR, TopicW } from "./content/view"
import type { UserRoleRow, UserRow } from "./identity/shema"
import type { UserR, UserW } from "./identity/view"
import type { CourseEnrollmentRow, TopicAttemptRow, TopicEnrollmentRow } from "./learning/shema"
import type { EnrollmentR, EnrollmentW } from "./learning/view"

export type Database = {
    users: UserRow,
    user_roles: UserRoleRow
    v_users_w: UserW,
    v_users_r: UserR,

    courses: CourseRow,
    v_courses_w: CourseW,
    v_courses_r: CourseR,

    topics: TopicRow,
    v_topics_w: TopicW,
    v_topics_r: TopicR,

    questions: QuestionRow,
    answers: AnswerRow,
    v_questions_w: QuestionW,
    v_questions_r: QuestionR,

    course_enrollments: CourseEnrollmentRow,
    topic_enrollments: TopicEnrollmentRow,
    topic_attempts: TopicAttemptRow,
    v_enrollments_w: EnrollmentW,
    v_enrollments_r: EnrollmentR,
}
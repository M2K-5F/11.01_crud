export interface CourseEnrollmentRow {
    id: string,
    user_id: string,
    course_id: string,
    completed_topics: number,
    topics_count: number
}

export interface TopicEnrollmentRow {
    id: string,
    enrollment_id: string,
    topic_id: string,
    completed_questions: number,
    question_count: number,
}

export interface TopicAttemptRow {
    topic_enrollment_id: string,
    attempted_at: Date,
    completed_questions: number,
    question_count: number,
}
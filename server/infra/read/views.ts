// #region User
export interface UserRead {
    id: string
    name: string
    telegramLink: string
    roles: string[]
}
// #endregion


// #region Course
export interface CourseRead extends CourseRow {
    id: string
    title: string
    description: string
    status: string
    createdBy: string,
    topicsCount: number,
    studentsCount: number
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

export interface EnrollmentRead extends CourseEnrollmentRow {
    progress: number,
    course_title: string,
    course_description: string
}

export type EnrollmentTopicWithStatus = 
    Pick<
        TopicEnrollmentRow, 
        | 'id' 
        | 'completed_questions' 
        | "question_count" 
    > &
    Pick<
        TopicRow,
        | 'title'
        | 'description'
        | 'number'
        | 'status'
    > &
    {
        topic_id: TopicRow['id']
        is_available: boolean
        is_completed: boolean
        is_attempted: boolean
    }
// #endregion



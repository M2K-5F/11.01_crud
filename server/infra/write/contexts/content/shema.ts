import type { StatusValue } from "../../../../domains/common/value-objects/active-status"


// #region Course
export interface CourseRow  {
    id: string,
    title: string,
    description: string,
    status: StatusValue,
    created_by_id: string,
}

export interface CourseWrite extends CourseRow {}
// #endregion


// #region Topic
export interface TopicRow  {
    id: string,
    title: string,
    description: string,
    status: StatusValue,
    number: number,
    created_by_id: string,
    by_course_id: string
}

export interface TopicWrite extends TopicRow {}
// #endregion


// #region Question
export interface QuestionRow  {
    id: string,
    text: string,
    by_topic_id: string,
    created_by_id: string
}

export interface AnswerRow  {
    id: string,
    text: string,
    is_correct: boolean,
    question_id: string
}

export interface QuestionWrite extends QuestionRow {
    answers: Array<AnswerRow>
}
// #endregion

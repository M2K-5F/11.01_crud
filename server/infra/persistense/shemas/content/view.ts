import type { AnswerRow, CourseRow, QuestionRow, TopicRow } from "./shema";

// #region Course
export interface CourseW extends CourseRow {}

export interface CourseR extends CourseRow {}
// #endregion


// #region Topic
export interface TopicW extends TopicRow {}

export interface TopicR extends TopicRow {}
// #endregion


// #region Question
export interface QuestionW extends QuestionRow {
    answers: Array<AnswerRow>
}

export interface QuestionR extends QuestionRow {
    answers: Array<AnswerRow>
}
// #endregion
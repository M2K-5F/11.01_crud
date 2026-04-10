import type { StatusValue } from "@domain/common/value-objects/active-status"

export type QuestionRow = {
    id: string,
    text: string,
    by_topic: string,
    created_by: string,
}

export type AnswerRow = {
    id: string,
    text: string,
    is_correct: boolean,
    question_id: string
}   

export type CourseRow = {
    id: string,
    title: string,
    description: string,
    status: "archived" | "active",
    created_by: string,
}

export type TopicRow = {
    id: string,
    title: string,
    description: string,
    status: StatusValue,
    created_by: string,
    by_course: string,
}

export type QuestionWithAnswersView = QuestionRow & {answers: AnswerRow[]}
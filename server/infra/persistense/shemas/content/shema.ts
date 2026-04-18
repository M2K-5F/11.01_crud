import type { StatusValue } from "@domain/common/value-objects/active-status"

export type QuestionW = {
    id: string,
    text: string,
    by_topic: string,
    created_by: string,
    answers: Array<{
        id: string,
        text: string,
        is_correct: boolean,
    }>
}

export type QuestionR = {
    id: string,
    text: string,
    by_topic: string,
    created_by: string,
    answers: Array<{
        id: string,
        text: string,
        is_correct: boolean,
    }>
}

export type CourseW = {
    id: string,
    title: string,
    description: string,
    status: "archived" | "active",
    created_by: string,
}

export type CourseR = {
    id: string,
    title: string,
    description: string,
    status: "archived" | "active",
    created_by: string,
}

export type TopicW = {
    id: string,
    title: string,
    description: string,
    status: StatusValue,
    created_by: string,
    by_course: string,
}

export type TopicR = {
    id: string,
    title: string,
    description: string,
    status: StatusValue,
    created_by: string,
    by_course: string,
}

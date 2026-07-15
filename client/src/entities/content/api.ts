import { api } from "@/shared/api/query-client";
import type { CourseRead, QuestionRead, TopicRead } from "@contracts";

export type CreateQuestionDTO = {
    topicID: string,
    text: string,
    answers: Array<{
        text: string,
        isCorrect: boolean
    }>
}

type CreateCourseDTO = {
    title: string,
    description: string,
}

type CreateTopicDTO = {
    title: string,
    description: string,
    courseID: string,
    accessType: "free" | "afterPrevious"
}

export const contentApi = {
    createCourse: (data: CreateCourseDTO) => api.post('/content/courses', data),
    getCoursesCreatedBy:  (createdBy: string) => api.get<CourseRead[]>('/content/courses', {createdBy}),
    getCourseByID: (courseID: string) => api.get<CourseRead>(`/content/courses/${courseID}`),
    archiveCourse: (courseID: string) => api.post(`/content/courses/${courseID}/archive`),
    activateCourse: (courseID: string) => api.post(`/content/courses/${courseID}/activate`),
    searchCourses: (query: string) => 
        api.get<CourseRead[]>(`/content/courses/search?q=${encodeURIComponent(query)}`),


    createTopic: ({courseID, ...data}: CreateTopicDTO) => api.post(`/content/courses/${courseID}/topics`, data),
    getTopicsByCourse: (courseID: string) => api.get<TopicRead[]>(`/content/topics`, {courseID}),
    archiveTopic: (topicID: string) => api.post(`/content/topics/${topicID}/archive`),
    activateTopic: (topicID: string) => api.post(`/content/topics/${topicID}/activate`),


    createQuestion: ({topicID, ...question}: CreateQuestionDTO) => api.post(`/content/topics/${topicID}/questions`, question),
    getQuestionsByTopic: (topicID: string) => api.get<QuestionRead[]>(`/content/questions`, {topicID}),
    getTopicByID: (topicID: string) => api.get<TopicRead>(`/content/topics/${topicID}`),
}
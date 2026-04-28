import { api } from "@/shared/api/QueryClient";
import type { CourseRead, TopicRead } from "@contracts";

export type CreateQuestionDTO = {
    topicID: string,
    text: string,
    answers: Array<{
        text: string,
        is_correct: boolean
    }>
}

export const contentApi = {
    getCreatedCourses:  () => api.get<CourseRead[]>('/content/courses/me'),
    getCreatedTopicsByCourse: (courseID: string) => api.get<TopicRead[]>(`content/courses/${courseID}/topics/me`),

    createCourse: (title: string, description: string) => api.post('/content/courses', {title, description}),
    createTopic: (courseID: string, title: string, description: string) => api.post(`/content/courses/${courseID}/topics`, {title, description}),
    createQuestion: ({topicID, ...question}: CreateQuestionDTO) => api.post(`/content/topics/${topicID}/questions`, question),

    archiveCourse: (courseID: string) => api.post(`/content/courses/${courseID}/archive`),
    activateCourse: (courseID: string) => api.post(`content/courses/${courseID}/activate`),

    archiveTopic: (topicID: string) => api.post(`/content/topics/${topicID}/archive`),
    activateTopic: (topicID: string) => api.post(`/content/topics/${topicID}/activate`)
}
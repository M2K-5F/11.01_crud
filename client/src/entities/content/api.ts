import { api } from "@/shared/api/QueryClient";
import type { CourseRead, EnrollmentRead, QuestionRead, TopicRead } from "@contracts";

export type CreateQuestionDTO = {
    topicID: string,
    text: string,
    answers: Array<{
        text: string,
        is_correct: boolean
    }>
}

type CreateCourseDTO = {
    title: string,
    description: string,
}

type CreateTopicDTO = {
    title: string,
    description: string,
    courseID: string
}

export const contentApi = {
    getCreatedCourses:  () => api.get<CourseRead[]>('/content/courses/me'),
    getCreatedTopicsByCourse: (courseID: string) => api.get<TopicRead[]>(`/content/courses/${courseID}/topics/me`),
    getCourseByID: (courseID: string) => api.get<CourseRead>(`/content/courses/me/${courseID}`),
    getCreatedCoursesWithLimit: () => api.get<CourseRead[]>(`/content/courses/me?limit=5`),
    getQuestionsByTopic: (topicID: string) => api.get<QuestionRead[]>(`/content/topics/${topicID}/questions`),
    getTopicByID: (topicID: string) => api.get<TopicRead>(`/content/topics/${topicID}`),

    createCourse: (data: CreateCourseDTO) => api.post('/content/courses', data),
    createTopic: ({courseID, ...data}: CreateTopicDTO) => api.post(`/content/courses/${courseID}/topics`, data),

    createQuestion: ({topicID, ...question}: CreateQuestionDTO) => api.post(`/content/topics/${topicID}/questions`, question),


    archiveCourse: (courseID: string) => api.post(`/content/courses/${courseID}/archive`),
    activateCourse: (courseID: string) => api.post(`/content/courses/${courseID}/activate`),

    archiveTopic: (topicID: string) => api.post(`/content/topics/${topicID}/archive`),
    activateTopic: (topicID: string) => api.post(`/content/topics/${topicID}/activate`),
    
    searchCourses: (query: string) => 
        api.get<CourseRead[]>(`/content/courses/search?q=${encodeURIComponent(query)}`),
}
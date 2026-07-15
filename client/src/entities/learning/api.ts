import { api } from "@/shared/api/query-client";
import type { EnrollmentRead, QuestionRead } from "@contracts";

type compteteTopicDTO = {
    topicID: string,
    questions: Array<{
        id: string,
        selectedAnswers: Array<string>
    }>
}


export const learningApi = {
    enrollCourse: (courseID: string) => api.post<EnrollmentRead>(`/learning/courses/${courseID}/enrollments`),
    startTopic: (topicID: string) => api.post<QuestionRead[]>(`/learning/topics/${topicID}/start`),
    completeTopic: ({topicID, questions}: compteteTopicDTO) => api.post<EnrollmentRead>(`/learning/topics/${topicID}/complete`, questions),
    getEnrollmentsByUser: (userID: string) => api.get<EnrollmentRead[]>('/learning/enrollments', {userID}),
    getEnrollmentByID: (enrollmentID: string) => api.get<EnrollmentRead>(`/learning/enrollments/${enrollmentID}`),
    getEnrollmentsByCourse: (courseID: string) => api.get<EnrollmentRead>(`/learning/enrollments`, {courseID}),
    getUserEnrollmentByCourse: (courseID: string, userID: string) => api.get<EnrollmentRead[]>('/learning/enrollments', {userID, courseID})
        .map(arr=>arr[0])
        .recoverIf(err=>err.status===404, null)
}
import { api } from "@/shared/api/QueryClient";
import type { EnrollmentRead, EnrollmentTopicWithStatus, QuestionRead } from "@contracts";

type compteteTopicDTO = {
    topicID: string,
    questions: Array<{
        id: string,
        selected_answers: Array<string>
    }>
}


export const learningApi = {
    enrollCourse: (courseID: string) => api.post<EnrollmentRead>(`/learning/enroll/${courseID}`),
    startTopic: (topicID: string) => api.post<QuestionRead[]>(`/learning/start-topic/${topicID}`),
    completeTopic: (data: compteteTopicDTO) => api.post<EnrollmentRead>(`/learning/complete-topic/${data.topicID}`, data.questions),
    getMyEnrollments: () => api.get<EnrollmentRead[]>('/learning/enrollments/me'),
    getEnrollByID: (enrollmentID: string) => api.get<EnrollmentRead>(`/learning/enrollments/${enrollmentID}`),
    getEnrollmentTopics: (enrollmentID: string) => api.get<EnrollmentTopicWithStatus[]>(`/learning/enrollments/${enrollmentID}/topics/me`),
    getMyEnrollmentByCourseID: (courseID: string) => api.get<EnrollmentRead>(`/learning/enrollment`, {courseID}),
    isEnrolled: (courseID: string) => api.get<boolean>('/learning/enrollments/is-enrolled', {courseID})
}
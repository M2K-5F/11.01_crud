import { api } from "@/shared/api/QueryClient";
import type { EnrollmentRead } from "@contracts";

type compteteTopicDTO = {
    topicID: string,
    questions: Array<{
        id: string,
        selected_answers: Array<string>
    }>
}


export const learningApi = {
    enrollCourse: (courseID: string) => api.post(`/learning/enroll/${courseID}`),
    startTopic: (topicID: string) => api.post(`/learning/start-topic/${topicID}`),
    completeTopic: (data: compteteTopicDTO) => api.post(`/learning/complete-topic/${data.topicID}`, data.questions),
    getMyEnrollments: () => api.get<EnrollmentRead[]>('/learning/enrollments/me')
}
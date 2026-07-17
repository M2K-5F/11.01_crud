import { contentApi } from "@/entities/content/api"
import { learningApi } from "@/entities/learning/api"
import { composeKeys } from "@/shared/lib/composed-key"
import { QueryKeys } from "@/shared/lib/query-keys"
import type { TopicEnrollmentRead } from "@contracts"
import { useQuery } from "@tanstack/react-query"
import { Bind } from "fluent-future"

type CourseStatsPageVMProps = {
    courseID: string
}


export type StudentStatsType = {
    userID: string
    username: string
    progress: number
    completedTopics: number
    totalTopics: number
    percentage: number
    topicEnrollments: TopicEnrollmentRead[]
}

export const useCourseStatsPageVM = ({ courseID }: CourseStatsPageVMProps) => {
    const { data, error } = useQuery({
        queryKey: composeKeys(
            QueryKeys.course(courseID)
        ),
        queryFn: () =>
            Bind({
                course: contentApi.getCourseByID(courseID),
                enrollments: learningApi.getEnrollmentsByCourse(courseID)
            })
            .map(({ enrollments, course }) => {
                
                const students = enrollments.map(e => ({
                    userID: e.userID,
                    username: e.username,
                    progress: e.progress,
                    completedTopics: e.progress,
                    totalTopics: e.topicEnrollments.length,
                    percentage: e.topicEnrollments.length > 0 
                        ? Math.round((e.progress / e.topicEnrollments.length) * 100) 
                        : 0,
                    topicEnrollments: e.topicEnrollments
                }))

                const avgProgress = students.length > 0
                    ? Math.round(students.reduce((s, st) => s + st.percentage, 0) / students.length)
                    : 0

                const completedCount = students.filter(s => s.percentage === 100).length

                return {
                    course,
                    students,
                    meta: {
                        totalStudents: students.length,
                        avgProgress,
                        completedCount
                    }
                }
            })
    })

    return { data, error }
}
import { useGuardedCurrentUser } from "@/entities/identity/user/current-user-provider"
import { learningApi } from "@/entities/learning/api"
import { useQuery } from "@tanstack/react-query"

export const useEnrolledCoursesSectionVM = () => {
    const {user} = useGuardedCurrentUser()

    const {data, error} = useQuery({
        queryKey: ['enrolledCourses'],
        queryFn: learningApi.getMyEnrollments,
    })

    return {
        enrollments: data,
        error,
        isStudent: user.roles.includes('Student')
    }
}
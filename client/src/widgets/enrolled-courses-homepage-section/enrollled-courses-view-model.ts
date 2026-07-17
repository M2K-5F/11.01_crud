import { useGuardedCurrentUser } from "@/entities/identity/providers/current-user-provider"
import { learningApi } from "@/entities/learning/api"
import { composeKeys } from "@/shared/lib/composed-key"
import { QueryKeys } from "@/shared/lib/query-keys"
import { Routes } from "@/shared/lib/routes-constants"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

export const useEnrolledCoursesSectionVM = () => {
    const navigate = useNavigate()
    const {user} = useGuardedCurrentUser()

    const {data, error} = useQuery({
        queryKey: composeKeys(QueryKeys.enrollmentsMe),
        queryFn: () => learningApi.getEnrollmentsByUser(user.id),
    })

    const onEnrollmentSelect = (enrollmentID: string) => () => navigate(Routes.enrollmentPage(enrollmentID))

    return {
        enrollments: data,
        error,
        onEnrollmentSelect
    }
}
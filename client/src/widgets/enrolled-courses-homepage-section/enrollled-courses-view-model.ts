import { learningApi } from "@/entities/learning/api"
import { composeKeys } from "@/shared/lib/composed-key"
import { QueryKeys } from "@/shared/lib/query-keys"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

export const useEnrolledCoursesSectionVM = () => {
    const navigate = useNavigate()

    const {data, error} = useQuery({
        queryKey: composeKeys(QueryKeys.enrollmentsMe),
        queryFn: learningApi.getMyEnrollments,
    })

    const onEnrollmentSelect = (enrollmentID: string) => () => navigate(`/enrollment/${enrollmentID}`)

    return {
        enrollments: data,
        error,
        onEnrollmentSelect
    }
}
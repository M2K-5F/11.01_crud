import { contentApi } from "@/entities/content/api"
import { learningApi } from "@/entities/learning/api"
import { composeKeys } from "@/shared/lib/composed-key"
import { QueryKeys } from "@/shared/lib/query-keys"
import { Routes } from "@/shared/lib/routes-constants"
import { useQuery } from "@tanstack/react-query"
import { Bind } from "fluent-future"
import { useNavigate } from "react-router-dom"

type EnrollmentPageVMProps = {
    enrollmentID: string
}


export const useEnrollmentPageVM = ({enrollmentID}: EnrollmentPageVMProps) => {
    const navigate = useNavigate()


    const {data, error} = useQuery({
        queryKey: composeKeys(
            QueryKeys.coursesMe,
            QueryKeys.enrollmentTopics(enrollmentID),
            QueryKeys.enrollment(enrollmentID)
        ),
        queryFn: () => 
            Bind({
                enrollment: learningApi.getEnrollmentByID(enrollmentID)
            })
            .bind({
                course: ({enrollment}) => 
                    contentApi.getCourseByID(enrollment.courseID),
                topics: ({enrollment}) => 
                    contentApi.getTopicsByCourse(enrollment.courseID)
            })
    })


    const onTopicSelect = (topicID: string) => () => navigate(Routes.topicPassingPage(topicID))


    return {
        error,
        data,
        onTopicSelect
    }
}

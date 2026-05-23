import { contentApi } from "@/entities/content/api"
import { learningApi } from "@/entities/learning/api"
import { composeKeys } from "@/shared/lib/composed-key"
import { QueryKeys } from "@/shared/lib/query-keys"
import type { EnrollmentTopicWithStatus } from "@contracts"
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
                enrollment: learningApi.getEnrollByID(enrollmentID),
                topics: learningApi.getEnrollmentTopics(enrollmentID),
            })
            .bind({
                course: ({enrollment}) => 
                    contentApi.getCourseByID(enrollment.course_id)
            })
    })


    const onTopicSelect = (topic: EnrollmentTopicWithStatus) => () => navigate(`/topic-pass/${topic.topic_id}`)


    return {
        error,
        data,
        onTopicSelect
    }
}

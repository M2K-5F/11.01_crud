import { contentApi } from "@/entities/content/api"
import { QueryKeys } from "@/shared/lib/query-keys"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"


export const useCourseTopicsPageVM = () => {
    const {courseID} = useParams<{courseID: string}>()
    const client = useQueryClient()
    const navigate = useNavigate()


    const {data: topics, isLoading: isTopicsLoading} = useQuery({
        queryFn: () => contentApi.getCreatedTopicsByCourse(courseID!),
        queryKey: QueryKeys.createdTopics(courseID!),
        enabled: !!courseID
    })


    const {data: course, isLoading: isCourseLoading} = useQuery({
        queryFn: () => contentApi.getCourseByID(courseID!),
        queryKey: QueryKeys.createdCourse(courseID!),
        enabled: !!courseID
    })


    const {mutate: onTopicActivate} = useMutation({
        mutationFn: contentApi.activateTopic,
        onSuccess() {
            client.invalidateQueries({queryKey: QueryKeys.createdTopics(courseID!)})
            toast("Успешно активировано")
        }
    })


    const {mutate: onTopicArchive} = useMutation({
        mutationFn: contentApi.archiveTopic,
        onSuccess() {
            client.invalidateQueries({queryKey: QueryKeys.createdTopics(courseID!)})
            toast('Усешно архивировано')
        }
    })

    const onTopicSelect = (topicID: string) => () => navigate(`/topic/${topicID}`)

    return {
        topics, 
        course,
        isLoading: isCourseLoading || isTopicsLoading,
        onTopicActivate, 
        onTopicArchive,
        onTopicSelect
    }
}
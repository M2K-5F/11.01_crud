import { contentApi } from "@/entities/content/api"
import { composeKeys } from "@/shared/lib/composed-key"
import { QueryKeys } from "@/shared/lib/query-keys"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Bind } from "fluent-future"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"


type CourseTopicsPageVM = {
    courseID: string
}


export const useCourseTopicsPageVM = ({courseID}: CourseTopicsPageVM) => {
    const client = useQueryClient()
    const navigate = useNavigate()

    
    const { data, error } = useQuery({
        queryFn: () => Bind({
            topics: contentApi.getTopicsByCourse(courseID),
            course: contentApi.getCourseByID(courseID)
        }),
        queryKey: composeKeys(
            QueryKeys.courseTopics(courseID),
            QueryKeys.course(courseID)
        ),
    })


    const {mutate: topicActivateMutate} = useMutation({
        mutationFn: contentApi.activateTopic,
        onSuccess() {
            client.invalidatePartial(QueryKeys.courseTopics(courseID))
            toast("Успешно активировано")
        }
    })


    const {mutate: topicArchiveMutate} = useMutation({
        mutationFn: contentApi.archiveTopic,
        onSuccess() {
            client.invalidatePartial(QueryKeys.courseTopics(courseID))
            toast('Усешно архивировано')
        }
    })

    const onTopicActivate = (topicID: string) => () => topicActivateMutate(topicID)

    const onTopicArchive = (topicID: string) => () => topicArchiveMutate(topicID)

    const onTopicSelect = (topicID: string) => () => navigate(`/topic/${topicID}`)

    return {
        data, 
        error,
        onTopicActivate, 
        onTopicArchive,
        onTopicSelect
    }
}
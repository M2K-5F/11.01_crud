import { contentApi } from "@/entities/content/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { toast } from "sonner"


export const useCourseTopicsPageVM = () => {
    const {courseID} = useParams<{courseID: string}>()
    const client = useQueryClient()


    const {data: topics, isLoading: isTopicsLoading} = useQuery({
        queryFn: () => contentApi.getCreatedTopicsByCourse(courseID!),
        queryKey: ['createdTopics', courseID],
        enabled: !!courseID
    })


    const {data: course, isLoading: isCourseLoading} = useQuery({
        queryFn: () => contentApi.getCourseByID(courseID!),
        queryKey: ['createdCourse', courseID],
        enabled: !!courseID
    })


    const {mutate: onTopicActivate} = useMutation({
        mutationFn: contentApi.activateTopic,
        onSuccess() {
            client.invalidateQueries({queryKey: ['createdTopics', courseID]})
            toast("Успешно активировано")
        }
    })


    const {mutate: onTopicArchive} = useMutation({
        mutationFn: contentApi.archiveTopic,
        onSuccess() {
            client.invalidateQueries({queryKey: ['createdTopics', courseID]})
            toast('Усешно архивировано')
        }
    })

    
    return {
        topics, 
        course,
        isLoading: isCourseLoading || isTopicsLoading,
        onTopicActivate, 
        onTopicArchive
    }
}
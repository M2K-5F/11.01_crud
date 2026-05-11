import { contentApi } from "@/entities/content/api"
import { CacheKeys } from "@/shared/lib/cache-keys"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

export const useCreatedTopicVW = () => {
    const {courseID} = useParams()
    const navigate = useNavigate()
    const client = useQueryClient()

    useEffect(() => {
        !courseID && navigate('/')
    }, [courseID])

    const {data, isLoading, isError} = useQuery({
        queryKey: [CacheKeys.createdTopics, courseID],
        queryFn: () => contentApi.getCreatedTopicsByCourse(courseID!),
        enabled: !!courseID
    })

    const {mutate: activateMutate} = useMutation({
        mutationFn: contentApi.activateTopic,
        onSuccess() {
            client.invalidateQueries({queryKey: [CacheKeys.createdTopics]})
        }
    })

    const {mutate: arciveMutate} = useMutation({
        mutationFn: contentApi.archiveTopic,
        onSuccess() {
            client.invalidateQueries({queryKey: [CacheKeys.createdTopics]})
        }
    })

    return {
        activateMutate, 
        arciveMutate,
        data,
        isLoading,
        isError
    }
}
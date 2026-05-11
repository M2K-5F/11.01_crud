import { contentApi } from "@/entities/content/api"
import { CacheKeys } from "@/shared/lib/cache-keys"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export const useCreatedCoursesVM = () => {
    const client = useQueryClient()
    const navigate = useNavigate()

    const {isLoading, data, isError} = useQuery({
        queryFn: contentApi.getCreatedCourses,
        queryKey: [CacheKeys.createdCourses],
    })

    const activateMUT = useMutation({
        mutationFn: contentApi.activateCourse,
        onSuccess() {
            client.invalidateQueries({queryKey: [CacheKeys.createdCourses]})
            toast('Успешно активировано')
        },
    })


    const archiveMUT = useMutation({
        mutationFn: contentApi.archiveCourse,
        onSuccess() {
            client.invalidateQueries({queryKey: [CacheKeys.createdCourses]})
            toast("Успешно архивировано")
        },
    })

    const onCourseSelect = (courseID: string) => navigate(`/edit-course/${courseID}`)


    return {
        isLoading,
        data,
        isError,
        onCourseSelect,
        onCourseActivate: activateMUT.mutate,
        onCourseArchive: archiveMUT.mutate
    }
}
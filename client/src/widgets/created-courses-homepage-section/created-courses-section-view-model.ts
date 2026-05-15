import { contentApi } from "@/entities/content/api"
import { useGuardedCurrentUser } from "@/entities/identity/user/current-user-provider"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export const useCreatedCoursesSectionVM = () => {
    const {user} = useGuardedCurrentUser()
    const client = useQueryClient()
    const navigate = useNavigate()


    const {data: courses, error} = useQuery({
        queryFn: contentApi.getCreatedCourses,
        queryKey: ['createdCourses']
    })


    const {mutate: activate} = useMutation({
        mutationFn: contentApi.activateCourse,
        onSuccess() {
            client.invalidateQueries({queryKey: ['createdCourses']})
            toast('Успешно активировано')
        },
    })


    const {mutate: archive} = useMutation({
        mutationFn: contentApi.archiveCourse,
        onSuccess() {
            client.invalidateQueries({queryKey: ['createdCourses']})
            toast("Успешно архивировано")
        },
    })

    const onCourseSelect = (courseID: string) => navigate(`/edit-course/${courseID}`)

    return {
        courses, 
        error, 
        archive,
        activate,
        isTeacher: user.roles.includes('Teacher'),
        onCourseSelect
    }
}
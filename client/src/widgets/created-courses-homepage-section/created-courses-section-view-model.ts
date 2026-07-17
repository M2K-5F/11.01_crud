import { contentApi } from "@/entities/content/api"
import { useGuardedCurrentUser } from "@/entities/identity/providers/current-user-provider"
import { composeKeys } from "@/shared/lib/composed-key"
import { QueryKeys } from "@/shared/lib/query-keys"
import { Routes } from "@/shared/lib/routes-constants"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export const useCreatedCoursesSectionVM = () => {
    const {user} = useGuardedCurrentUser()
    const client = useQueryClient()
    const navigate = useNavigate()


    const {data: courses, error} = useQuery({
        queryFn: ()=> contentApi.getCoursesCreatedBy(user.id),
        queryKey: composeKeys(QueryKeys.coursesMe)
    })


    const {mutate: activate} = useMutation({
        mutationFn: contentApi.activateCourse,
        onSuccess() {
            client.invalidatePartial(QueryKeys.coursesMe)
            toast('Успешно активировано')
        },
    })


    const {mutate: archive} = useMutation({
        mutationFn: contentApi.archiveCourse,
        onSuccess() {
            client.invalidatePartial(QueryKeys.coursesMe)
            toast("Успешно архивировано")
        },
    })

    const onCourseSelect = (courseID: string)=> ()=> navigate(Routes.courseEditPage(courseID))
    const onCourseArchive = (courseID: string)=> ()=> archive(courseID)
    const onCourseActivate = (courseID: string)=> ()=> activate(courseID)

    return {
        courses, 
        error, 
        onCourseActivate,
        onCourseArchive,
        isTeacher: user.roles.includes('Teacher'),
        onCourseSelect
    }
}
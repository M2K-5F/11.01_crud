import { contentApi } from "@/entities/content/api";
import type { ApiError } from "@/shared/errors";
import { QueryKeys } from "@/shared/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type CreateTopicFormType = {
    title: string
    description: string
}

type CreateTopicDialogVMProps = {
    onSuccess?: () => void,
    courseID: string
}

export const useCreateTopicDialogVM = ({courseID, onSuccess}: CreateTopicDialogVMProps) => {
    const queryClient = useQueryClient()
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<CreateTopicFormType>()


    const { mutate, isPending } = useMutation({
        mutationFn: contentApi.createTopic,

        onSuccess: () => {
            toast.success('Тема успешно создана')
            queryClient.invalidatePartial(
                QueryKeys.courseTopics(courseID),
                QueryKeys.course(courseID)
            )
            onSuccess?.()
        },
        onError: (error: ApiError) => {
            toast.error('Ошибка при создании темы', { description: error.message })
            setError('root', { message: error.message })
        },
    })


    const onSubmit = handleSubmit((data) => mutate({...data, courseID}))

    return {
        errors,
        fields: {
            title: register('title'),
            description: register('description')
        },
        onSubmit,
        isPending
    }
}
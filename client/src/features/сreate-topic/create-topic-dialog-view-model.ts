import { contentApi } from "@/entities/content/api";
import type { ApiError } from "@/shared/errors";
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
        mutationFn: (data: CreateTopicFormType) =>
            contentApi.createTopic({...data, courseID}),
        onSuccess: () => {
            toast.success('Тема успешно создана')
            queryClient.invalidateQueries({ queryKey: ['createdTopics', courseID] })
            onSuccess?.()
        },
        onError: (error: ApiError) => {
            toast.error('Ошибка при создании темы', { description: error.message })
            setError('root', { message: error.message })
        },
    })


    const onSubmit = handleSubmit((data) => mutate(data))

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
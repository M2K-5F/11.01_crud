import { contentApi } from "@/entities/content/api";
import type { ApiError } from "@/shared/errors";
import { QueryKeys } from "@/shared/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'


type CreateTopicDialogVMProps = {
    onOpenChange: (open: boolean) => void
    courseID: string
}


const formShema = z.object({
    title: z.string()
        .min(8, 'Минимум 8 символов')
        .max(64, 'Маскимум 64 символа'),
    description: z.string()
        .min(8, 'Минимум 8 символов')
        .max(64, 'Маскимум 64 символа'),
    accessType: z.enum(['free', 'afterPrevious'], 'Неверный тип доступа')
})


export const useCreateTopicDialogVM = ({courseID, onOpenChange}: CreateTopicDialogVMProps) => {
    const queryClient = useQueryClient()
    
    const {
        control,
        formState: {errors},
        reset
    } = useForm({resolver: zodResolver(formShema)})


    const { mutate, isPending } = useMutation({
        mutationFn: contentApi.createTopic,

        onSuccess: ()=> {
            toast.success('Тема успешно создана')
            queryClient.invalidatePartial(
                QueryKeys.courseTopics(courseID),
                QueryKeys.course(courseID)
            )
            onOpenChange(false)
            reset()
        },
        onError: (error: ApiError) => {
            toast.error('Ошибка при создании темы', { description: error.message })
            control.setError('root', { message: error.message })
        },
    })


    const onSubmit = control.handleSubmit(data=> mutate({...data, courseID}))

    
    return {
        errors,
        onSubmit,
        isPending,
        control
    }
}
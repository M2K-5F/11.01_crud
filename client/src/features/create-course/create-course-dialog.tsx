import { useMutation, useQueryClient } from '@tanstack/react-query';
import { contentApi } from '@/entities/content/api';
import { Button } from '@/shared/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { toast } from 'sonner';
import { Textarea } from '@/shared/ui/textarea';
import { useForm } from 'react-hook-form';
import type { ApiError } from '@/shared/errors';
import { ErrorMessage } from '@/shared/ui/form-error-message';
import { QueryKeys } from '@/shared/lib/query-keys';

type CreateCourseDialogProps = {
    open: boolean,
    onDialogClose: () => void,
    onSuccess?: () => void,
}


type CreateCourseFormType = {
    title: string,
    description: string,
}


export const useCreateCoursesDialogVM = ({onSuccess}: {onSuccess: () => void}) => {
    const client = useQueryClient()


    const {register, handleSubmit, formState: {errors}, setError} = useForm<CreateCourseFormType>()


    const {mutate, isPending} = useMutation({
        mutationFn: contentApi.createCourse,
        onSuccess: () => {
            onSuccess()
            toast('Курс успешно создан')
            client.invalidatePartial(QueryKeys.coursesMe)
        },
        onError: (error: ApiError) => {
            toast.error("Ошибка при создании курса", {description: error.message})
            setError('root', {message: error.message})
        }
    })


    const onCourseCreate = handleSubmit(data => mutate(data))


    return {
        onCourseCreate, 
        isPending, 
        fields: {
            title: register('title'),
            description: register('description'),
        },
        errors
    }
}



export const CreateCourseDialog = ({ open, onDialogClose, onSuccess }: CreateCourseDialogProps) => {
    const {onCourseCreate, fields, errors, isPending} = useCreateCoursesDialogVM({
        onSuccess: () => {
            onSuccess?.()
            onDialogClose()
        }
    })


    return (
        <Dialog open={open} onOpenChange={() => onDialogClose()}>
            <DialogContent className="sm:max-w-106.25">
                <form onSubmit={onCourseCreate}>
                    <DialogHeader>
                        <DialogTitle>Создать курс</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Название</Label>
                            <Input {...fields.title} />
                            <ErrorMessage error={errors.title} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Описание</Label>
                            <Textarea {...fields.description} rows={4} />
                            <ErrorMessage error={errors.description} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onDialogClose}>
                            Отмена
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Создание...' : 'Создать'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
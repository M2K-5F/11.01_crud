import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { contentApi, type CreateQuestionDTO } from '@/entities/content/api';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Checkbox } from '@/shared/ui/checkbox';
import { Plus, Trash2, CheckCircle } from 'lucide-react';
import { QueryKeys } from '@/shared/lib/query-keys';
import { ErrorMessage } from '@/shared/ui/form-error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import type { ApiError } from '@/shared/errors';


const formShema = z.object({
    text: z.string()
        .min(8, 'Минимум 8 символов')
        .max(128, 'максимум 128 символов'),
    answers: z.array(z.object({
        text: z.string()
            .min(8, 'Минимум 8 символов')
            .max(128, "максимум 128 символов"),
        isCorrect: z.boolean()
    }))
})


type CreateQuestionDialogVMProps = {
    topicID: string
    onOpenChange: (open: boolean)=> void
}


type CreateQuestionDialogProps = {
    topicID: string
    open: boolean
    onOpenChange: (open: boolean) => void
}


const useCreateQuestionDialogVM = ({topicID, onOpenChange}: CreateQuestionDialogVMProps) => {
    const client = useQueryClient()

    const { control, formState: { errors } } = useForm({
        resolver: zodResolver(formShema),
        defaultValues: {
            text: '',
            answers: [{ text: '', isCorrect: true }],
        },
    })


    const { fields: answers, append, remove } = useFieldArray({
        control,
        name: 'answers',
    })


    const { mutate, isPending } = useMutation<void, ApiError, CreateQuestionDTO>({
        mutationFn: contentApi.createQuestion,
        onSuccess: () => {
            toast.success('Вопрос создан')
            client.invalidatePartial(
                QueryKeys.topicQuestions(topicID),
                QueryKeys.topic(topicID)
            )

            control._reset()
            onOpenChange(false)
        },
        onError: error => {
            toast.error('Ошибка', { description: error.message })
        },
    })


    const onSubmit = control.handleSubmit(data => {
        const hasCorrect = data.answers.some(a => a.isCorrect)
        
        if (!hasCorrect) {
            toast('выберите хотя бы один правильный ответ')
            return
        }
        mutate({topicID, text: data.text, answers: data.answers})
    })

    const onAnswerAdd = () => append({text: '', isCorrect: false})

    const onAnswerRemove = (answerIndex: number) => () => remove(answerIndex)


    return {
        onAnswerAdd,
        onAnswerRemove,
        onSubmit,
        isPending,
        errors,
        answers,
        getAnswerError: (index: number) => errors.answers?.[index]?.text,
        control
    }
}



export const CreateQuestionDialog = ({ topicID, open, onOpenChange }: CreateQuestionDialogProps) => {
    const {
        answers, 
        errors, 
        isPending, 
        onAnswerAdd, 
        onAnswerRemove, 
        onSubmit, 
        control, 
        getAnswerError
    } = useCreateQuestionDialogVM({topicID, onOpenChange})


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={onSubmit} className="space-y-4">
                    <DialogTitle className="flex items-center gap-2" asChild>
                        <div className='flex'>
                            <div className="h-5 w-1 bg-primary rounded-full" />
                            <h2 className="text-lg font-semibold">Создание вопроса</h2>
                        </div>
                    </DialogTitle>

                    <div className="space-y-2">
                        <Label htmlFor="text">Текст вопроса</Label>
                        <Input
                            id="text"
                            placeholder="Введите текст вопроса"
                            {...control.register('text')}
                        />
                        <ErrorMessage error={errors.text} />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label>Варианты ответов</Label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={onAnswerAdd}
                                className="gap-1"
                            >
                                <Plus className="h-3 w-3" />
                                Добавить вариант
                            </Button>
                        </div>

                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            {answers.map((answer, index) => (
                                <div
                                key={answer.id}
                                className="relative border rounded-lg p-4 bg-muted/20"
                                >
                                    <div className="flex flex-col gap-3">
                                        <Input
                                            placeholder="Текст ответа"
                                            {...control.register(`answers.${index}.text`)}
                                        />
                                        <ErrorMessage error={getAnswerError(index)} />

                                        <div className="flex items-center gap-3">
                                            <Controller
                                            control={control}
                                            name={`answers.${index}.isCorrect`}
                                            render={({field}) => (
                                                <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                />
                                            )}
                                            />
                                            <Label className="text-sm">
                                                Правильный ответ
                                            </Label>
                                            {answers.length > 1 && 
                                                <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={onAnswerRemove(index)}
                                                className="ml-auto right-2 top-2 h-7 w-7 p-0"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {answers.length === 0 && 
                            <p className="text-sm text-muted-foreground text-center py-4">
                                Добавьте хотя бы один вариант ответа
                            </p>
                        }
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Отмена
                        </Button>
                        <Button type="submit" disabled={isPending || !answers.length} className="gap-2">
                            {isPending 
                                ?   <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                                :   <CheckCircle className="h-4 w-4" />
                            }
                            Создать
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
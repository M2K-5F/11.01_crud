import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import { ErrorMessage } from '@/shared/ui/form-error-message';
import { useCreateTopicDialogVM } from '../create-topic-dialog-view-model';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Controller } from 'react-hook-form';


type CreateTopicDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    courseID: string
}


export const CreateTopicDialog = ({ open, onOpenChange, courseID }: CreateTopicDialogProps) => {
    const {
        onSubmit, 
        errors,
        isPending,
        control
    } = useCreateTopicDialogVM({courseID, onOpenChange})


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-125">
                <form onSubmit={onSubmit}>
                    <DialogHeader>
                        <DialogTitle>Создать тему</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Название *</Label>
                            <Input
                                id="title"
                                placeholder="Введите название темы"
                                {...control.register('title')}
                            />
                            <ErrorMessage error={errors.title} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Описание</Label>
                            <Textarea
                                id="description"
                                placeholder="Введите описание темы"
                                rows={4}
                                {...control.register('description')}
                            />
                            <ErrorMessage error={errors.description} />
                        </div>

                        <div className='grid gap-2'>
                            <Label htmlFor='accessType'>Тип доступа</Label>
                            <Controller
                                name='accessType'
                                control={control}
                                render={({field}) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Выберите тип доступа"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='free'>
                                                Свободный
                                            </SelectItem>
                                            
                                            <SelectItem value='afterPrevious'>
                                                После предыдущей
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <ErrorMessage error={errors.accessType}/>
                        </div>
                        <ErrorMessage error={errors.root} />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Отмена
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Создание...' : 'Создать'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
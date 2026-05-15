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


type CreateTopicDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    courseID: string
    onSuccess?: () => void
}


export const CreateTopicDialog = ({ open, onOpenChange, courseID, onSuccess }: CreateTopicDialogProps) => {
    const {onSubmit, fields, errors, isPending} = useCreateTopicDialogVM({
        courseID, 
        onSuccess: () => {
            onOpenChange(false)
            onSuccess?.()
        }
    })


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
                                {...fields.title}
                            />
                            <ErrorMessage error={errors.title} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Описание</Label>
                            <Textarea
                                id="description"
                                placeholder="Введите описание темы"
                                rows={4}
                                {...fields.description}
                            />
                            <ErrorMessage error={errors.description} />
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
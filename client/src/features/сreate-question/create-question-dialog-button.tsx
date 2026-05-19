import { Button } from "@/shared/ui/button"
import { Plus } from "lucide-react"

export const CreateQuestionDialogButton = ({onClick}: {onClick: () => void}) => {
    return (
        <Button onClick={onClick} variant="default" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Создать вопрос
        </Button>
    )
}
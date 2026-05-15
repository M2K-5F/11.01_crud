import { Card, CardContent } from "@/shared/ui/card"
import { Plus } from "lucide-react"
import type { FC } from "react"

export const CreateCourseCard: FC<{onClick: () => void}> = ({ onClick }) => {
    return (
        <Card
        onClick={onClick}
        className="border-dashed border-primary/40 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all cursor-pointer group"
        >
            <CardContent className="flex flex-col items-center justify-center gap-3 py-12">
                <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                    <Plus className="h-8 w-8 text-primary" />
                </div>
                <span className="text-sm font-medium text-primary">Создать курс</span>
            </CardContent>
        </Card>
    )
}
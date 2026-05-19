import type { CourseRead } from '@contracts';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { BookOpen } from 'lucide-react';

type CourseSearchResultProps = {
    course: CourseRead
    onSelect: () => void
}

export const CourseSearchResult = ({ course, onSelect }: CourseSearchResultProps) => {
    return (
        <div
            onClick={onSelect}
            className="flex items-center gap-3 px-4 py-2 hover:bg-muted cursor-pointer transition-colors"
        >
            <Avatar className="h-8 w-8 bg-primary/10">
                <AvatarFallback className="text-primary">
                    <BookOpen className="h-4 w-4" />
                </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{course.title}</div>
                <div className="text-xs text-muted-foreground truncate">
                    {course.description || 'Нет описания'}
                </div>
            </div>
        </div>
    )
}
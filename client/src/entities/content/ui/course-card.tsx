import clsx from "clsx"
import type { FC } from "react"
import { Button } from "@/shared/ui/button"
import { Archive, ArchiveRestore, BarChart3, BookOpen, ChevronRight, Edit3, User, Users } from 'lucide-react'
import { Badge } from "@/shared/ui/badge"
import type { CourseRead } from "@contracts"



type CourseCardProps = {
    course: CourseRead,
    onArchive: () => void
    onActivate: () => void
    onOpen: () => void
}

export const CourseCard: FC<CourseCardProps> = ({course, onActivate, onArchive, onOpen}) => {
    const isActive = course.status === 'active'
    
    return (
        <div 
        className={clsx(
            `border border-foreground/20 overflow-hidden`,
            'rounded-xl shadow-sm p-5 bg-card h-fit transition-all',
            'hover:shadow-md hover:border-foreground/30',
            !isActive && 'opacity-70 bg-muted/50'
        )}
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg mt-1">
                        <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold cursor-pointer line-clamp-2">
                            {course.title}
                        </h3>
                        <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                            <User className="h-3.5 w-3.5" />
                            <span>Автор: {course.createdByName}</span>
                        </div>
                    </div>
                </div>

                {isActive
                ?   <Button
                    variant='outline'
                    size="sm"
                    onClick={onArchive}
                    title='Архивировать'
                    className="h-8 w-8 p-0"
                    >
                        <Archive className="h-4 w-4" />
                    </Button>

                :   <Button
                    variant='outline'
                    size="sm"
                    onClick={onActivate}
                    title='Разархивировать'
                    className="h-8 w-8 p-0"
                    >
                        <ArchiveRestore className="h-4 w-4" />
                    </Button>
                }

            </div>
            
            <p className="text-sm text-wrap text-muted-foreground mb-3 line-clamp-3">
                {course.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
                <div className="flex items-center gap-1 text-xs bg-secondary/20 px-2 py-1 rounded-full">
                    <BarChart3 className="h-3 w-3" />
                    <span>Тем: {course.topicsCount}</span>
                </div>
                
                <div className="flex items-center gap-1 text-xs bg-secondary/20 px-2 py-1 rounded-full">
                    <Users className="h-3 w-3" />
                    <span>Студентов: {course.studentsCount}</span>
                </div>
            </div>
            
            <div className="flex items-center justify-between mt-4">
                {isActive
                ?   <Badge 
                    className="cursor-pointer flex items-center gap-1" 
                    variant='default'
                    >
                        <div className="h-2 w-2 rounded-full bg-background animate-pulse"></div>
                        Активный
                    </Badge>

                :   <Badge 
                    className="cursor-pointer flex items-center gap-1" 
                    variant='outline'
                    >
                        <Archive className="h-3 w-3" />
                        В архиве
                    </Badge>
                }
                
                
                <Button 
                    onClick={onOpen}
                    className="flex items-center gap-1"
                >
                    <Edit3 className="h-4 w-4" />
                    Редактировать
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}


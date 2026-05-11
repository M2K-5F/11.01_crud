import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import type { TopicRead } from "@contracts"
import clsx from "clsx"
import { Archive, ArchiveRestore, BookOpen, FileText } from "lucide-react"
import type { FC } from "react"


type TopicCardProps = {
    topic: TopicRead,
    onArchive: () => void,
    onActivate: () => void,

}


export const TopicCard: FC<TopicCardProps> = ({topic, onActivate, onArchive}) => {
    const isActive = topic.status === "active"

    return (
        <article className={clsx(
            `border border-foreground overflow-hidden transition-all duration-300`,
            'rounded-md shadow-sm mb-4 min-h-42 h-fit',
            !isActive && 'opacity-70'
        )}>
            <section className="p-5 bg-card">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-primary/10 rounded-lg mt-1">
                            <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h3 
                                className="text-lg font-semibold cursor-pointer hover:text-primary transition-colors line-clamp-2" 
                            >
                                {topic.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {topic.description}
                            </p>
                        </div>
                    </div>

                    <Button
                        variant='outline'
                        size="sm"
                        onClick={isActive ? onArchive : onActivate}
                        title={isActive ? 'Архивировать' : 'Разархивировать'}
                        className="h-8 w-8 p-0"
                    >
                        {isActive 
                            ?   <Archive className="h-4 w-4" /> 
                            :   <ArchiveRestore className="h-4 w-4" />
                        }
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-3">
                    <div className="flex items-center gap-1 text-sm bg-secondary/20 px-2 py-1 rounded-full">
                        <FileText className="h-3.5 w-3.5" />
                        <span>Вопросов: {topic.questions_count}</span>
                    </div>
                    
                    <Badge 
                        className="cursor-pointer flex items-center gap-1" 
                        variant={isActive ? 'default' : 'secondary'}
                    >
                        {isActive
                            ?   <>
                                    <div className="h-2 w-2 rounded-full bg-background animate-pulse"></div>
                                    Активный
                                </>
                            :   <>
                                    <Archive className="h-3 w-3" />
                                    В архиве
                                </>
                        }
                    </Badge>
                </div>

                <div className={clsx('mt-4 flex items-center gap-2 w-full sm:w-auto')} >
                    <Button>Подробнее</Button>
                </div>
            </section>
        </article>
    )
}
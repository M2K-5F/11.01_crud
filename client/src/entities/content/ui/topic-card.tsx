import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import type { TopicRead } from "@contracts";
import clsx from "clsx";
import { Archive, ArchiveRestore, BookOpen, FileText } from "lucide-react";
import type { FC } from "react";

type TopicCardProps = {
    topic: TopicRead
    onArchive: () => void
    onActivate: () => void
    onOpen: () => void
}

export const TopicCard: FC<TopicCardProps> = ({ topic, onActivate, onArchive, onOpen }) => {
    const isActive = topic.status === "active"

    return (
        <Card 
        className={clsx(
            "overflow-hidden transition-all duration-300 border border-foreground/30",
            "hover:shadow-md hover:border-foreground/50",
            !isActive && "opacity-70"
        )}
        >
            <CardContent className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-primary/10 rounded-lg mt-1">
                            <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h3 
                                className="text-lg font-semibold cursor-pointer hover:text-primary transition-colors line-clamp-2"
                                onClick={onOpen}
                            >
                                {topic.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {topic.description}
                            </p>
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

                <div className="flex flex-wrap items-center gap-3 mt-3">
                    {isActive 
                    ?   <Badge variant='default'>
                            <div className="h-2 w-2 rounded-full bg-background animate-pulse mr-1" />
                            Активная
                        </Badge>
                    :   <Badge variant='secondary'>
                            <Archive className="h-3 w-3 mr-1" />
                            В архиве
                        </Badge>
                    }

                    <div className="flex items-center gap-1 text-sm bg-secondary/20 px-2 py-1 rounded-full">
                        <FileText className="h-3.5 w-3.5" />
                        <span>Вопросов: {topic.questionsCount}</span>
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                    <Button onClick={onOpen}>Подробнее</Button>
                </div>
            </CardContent>
        </Card>
    )
}
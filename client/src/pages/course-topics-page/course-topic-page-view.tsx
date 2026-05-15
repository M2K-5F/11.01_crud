import { TopicCard } from "@/entities/content/ui/topic-card";
import { CreateTopicCard } from "@/features/сreate-topic/ui/create-topic-card";
import { CreateTopicDialog } from "@/features/сreate-topic/ui/create-topic-dialog";
import { Button } from "@/shared/ui/button";
import { ErrorFallback } from "@/shared/ui/error-fallback";
import { Spinner } from "@/shared/ui/spinner";
import { BarChart3 } from "lucide-react";
import { useState } from "react";
import { useCourseTopicsPageVM } from "./course-topis-page-view-model";





export const CourseTopicsPage = () => {
    const [isTopicCreateDialogOpen, setTopicCreateDialogOpen] = useState<boolean>(false)

    const {course, topics, isLoading, onTopicActivate, onTopicArchive} = useCourseTopicsPageVM()


    if (isLoading) return <Spinner />
    if (!course) return <ErrorFallback message="Курс не найден" />
    if (!topics) return <ErrorFallback message='Ошибка загрузки тем' />


    return (
        <div className="container mx-auto px-4 py-6 space-y-6">
            <CreateTopicDialog 
                open={isTopicCreateDialogOpen} 
                onOpenChange={setTopicCreateDialogOpen}
                courseID={course.id}
            />

            <div className="text-center">
                <h1 className="text-2xl font-bold">{course.title}</h1>
                <p className="text-muted-foreground mt-1">{course.description}</p>
            </div>

            <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => console.log('nav to stats')}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Статистика курса
                </Button>
            </div>

            
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Темы курса</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <CreateTopicCard onClick={() => setTopicCreateDialogOpen(true)} />
                        
                    {topics.map((topic) => (
                        <TopicCard
                            key={topic.id}
                            topic={topic}
                            onActivate={() => onTopicActivate(topic.id)}
                            onArchive={() => onTopicArchive(topic.id)}
                            onOpen={() => console.log('navtoedit')}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
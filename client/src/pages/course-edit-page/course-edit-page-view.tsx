import { TopicCard } from "@/entities/content/ui/topic-card";
import { CreateTopicCard } from "@/features/сreate-topic/ui/create-topic-card";
import { CreateTopicDialog } from "@/features/сreate-topic/ui/create-topic-dialog";
import { ErrorFallback } from "@/shared/ui/error-fallback";
import { Spinner } from "@/shared/ui/spinner";
import { BarChart3 } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { useCourseEditPageVM } from "./course-edit-page-view-model";


export const CourseEditPage = () => {
    const {courseID} = useParams()

    const [isTopicCreateDialogOpen, setTopicCreateDialogOpen] = useState<boolean>(false)

    const {data, error, onTopicActivate, onTopicArchive, onCourseStatsSelect, onTopicSelect} = useCourseEditPageVM({courseID: courseID!})


    if (!data) return error
        ?   <ErrorFallback message={error.message} />
        :   <Spinner />


    return (
        <div className="container mx-auto px-4 py-6 space-y-6">
            <CreateTopicDialog 
                open={isTopicCreateDialogOpen} 
                onOpenChange={setTopicCreateDialogOpen}
                courseID={data.course.id}
            />

            <div className="text-center">
                <h1 className="text-2xl font-bold">{data.course.title}</h1>
                <p className="text-muted-foreground mt-1">{data.course.description}</p>
            </div>

            <div className="flex justify-center gap-4">
                <Button size='xs' variant="outline" color='secondary' onClick={onCourseStatsSelect}>
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
                        
                    {data.topics.sort((a, b) => a.number - b.number).map((topic) => (
                        <TopicCard
                            key={topic.id}
                            topic={topic}
                            onActivate={onTopicActivate(topic.id)}
                            onArchive={onTopicArchive(topic.id)}
                            onOpen={onTopicSelect(topic.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
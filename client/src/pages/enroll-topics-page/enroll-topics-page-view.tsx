import { Fragment } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Progress } from "@/shared/ui/progress";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/shared/ui/accordion";
import {
    BookOpen,
    List,
    User,
    Check,
    Share2,
    LogOut,
    BarChart2,
    GitCommitVerticalIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/shared/lib/query-keys";
import { learningApi } from "@/entities/learning/api";
import { contentApi } from "@/entities/content/api";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "@/shared/ui/spinner";
import { ErrorFallback } from "@/shared/ui/error-fallback";
import { EnrollmentTopicCard } from "@/entities/learning/ui/enrollment-topic-card";
import type { EnrollmentTopicWithStatus } from "@contracts";


type EnrollmentPageVMProps = {
    enrollmentID: string
}


export const useEnrollmentPageVM = ({enrollmentID}: EnrollmentPageVMProps) => {
    const navigate = useNavigate()

    const {data: enrollment, error: enrollmentError} = useQuery({
        queryKey: QueryKeys.enrollment(enrollmentID),
        queryFn: () => learningApi.getEnrollByID(enrollmentID),
    })


    const {data: course, error: courseError} = useQuery({
        queryKey: QueryKeys.createdCourse(enrollment?.course_id as string),
        queryFn: () => contentApi.getCourseByID(enrollment!.course_id),
        enabled: !!enrollment
    })


    const {data: topics, error: topicsError} = useQuery({
        queryKey: QueryKeys.enrollmentTopics(enrollmentID),
        queryFn: () => learningApi.getEnrollmentTopics(enrollmentID),
    })


    const onTopicSelect = (topic: EnrollmentTopicWithStatus) => () => navigate(`/topic-pass/${topic.topic_id}`)


    return {
        error: enrollmentError || courseError || topicsError,
        topics,
        course,
        enrollment,
        onTopicSelect
    }
}


export const EnrollmentPage = () => {
    const { enrollmentID } = useParams<{enrollmentID: string}>()

    const {enrollment, error, topics, course, onTopicSelect} = useEnrollmentPageVM({enrollmentID: enrollmentID!})

    if (!course || !topics || !enrollment) {
        return error
            ?   <ErrorFallback message={error.message} />
            :   <Spinner />
    }

    const enrollmentProgress = (enrollment.completed_topics / enrollment.topics_count || 0) * 100

    return (
        <div className="p-6 h-full">
            <div className="max-w-3xl mx-auto">
                <Card className="mb-6 border-foreground">
                    <CardHeader className="flex justify-between items-start space-y-0">
                        <section className="w-full flex-col flex gap-2">
                            <div className="flex flex-col w-full gap-2 max-w-full">
                                <CardTitle className="max-w-full flex flex-wrap gap-2 items-center mb-1">
                                    <div className="p-2 max-sm:hidden bg-primary/10 rounded-lg">
                                        <BookOpen className="h-5 w-5 text-primary" />
                                    </div>
                                    {course.title}
                                </CardTitle>

                                <div className="flex items-baseline justify-between">
                                    <div className="flex items-center gap-2 flex-wrap max-w-62.5">
                                        <Badge variant="outline" className="flex items-center gap-1">
                                            <List className="h-3 w-3" />
                                            {topics.length} тем.
                                        </Badge>
                                        <Badge>
                                            <User className="h-3 w-3 mr-1" />
                                            Автор: {course.created_by}
                                        </Badge>
                                        <Badge className="bg-green-400" variant="default">
                                            <Check className="h-3 w-3 mr-1" />
                                            Подписан
                                        </Badge>
                                    </div>

                                    <div className="w-fit flex flex-col max-md:hidden gap-2">
                                        <Button variant="outline" className="flex items-center gap-2">
                                            <Share2 className="h-4 w-4" />
                                            <span className="max-md:hidden">Поделиться курсом</span>
                                        </Button>
                                        <Button variant="outline" className="flex items-center gap-2 text-red-600">
                                            <LogOut className="h-4 w-4" />
                                            Отписаться
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 md:hidden">
                                    <Badge
                                        variant="secondary"
                                        className="flex items-center gap-2 border border-foreground cursor-pointer"
                                    >
                                        <Share2 className="h-4 w-4" />
                                        <span>Поделиться курсом</span>
                                    </Badge>
                                    <Badge
                                        variant="destructive"
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Отписаться
                                    </Badge>
                                </div>
                            </div>
                        </section>
                    </CardHeader>

                    <CardContent>
                        <div className="flex items-center gap-4">
                            <Progress value={enrollmentProgress} />
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <BarChart2 className="h-4 w-4" />
                                {Math.round(enrollmentProgress)}% завершено
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Accordion defaultValue="topics" type="single" collapsible className="w-full">
                    <AccordionItem value="topics">
                        <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-semibold">Темы курса</h2>
                                <Badge variant="outline" className="px-2 py-0.5">
                                    {topics.length}
                                </Badge>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-3 mt-2">
                                {topics
                                    .sort((a,b) => a.number-b.number)
                                    .map((topic, index) => 
                                        <Fragment key={topic.id}>
                                            {index && <div className="p-0 m-0 ml-3.5 flex justify-center items-center w-fit h-7.5 overflow-hidden">
                                                        <GitCommitVerticalIcon size={40} />
                                                    </div>
                                            }
                                            <EnrollmentTopicCard
                                                topic={topic}
                                                onSelect={onTopicSelect(topic)}
                                            />
                                        </Fragment>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    )
}
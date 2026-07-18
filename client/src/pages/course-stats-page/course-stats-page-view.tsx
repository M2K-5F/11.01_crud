import { useParams } from "react-router-dom"
import { useCourseStatsPageVM, type StudentStatsType } from "./course-stats-page-view-model"
import { ErrorFallback } from "@/shared/ui/error-fallback"
import { Spinner } from "@/shared/ui/spinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { BarChart2, User } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui/accordion"
import { Badge } from "@/shared/ui/badge"
import { Progress } from "@/shared/ui/progress"
import type { FC } from "react"
import type { TopicEnrollmentRead } from "@contracts"
import { sorted } from "@/shared/lib/utils"

export const CourseStatsPage = () => {
    const { courseID } = useParams()
    const { data, error } = useCourseStatsPageVM({ courseID: courseID! })

    if (!data) return error
        ? <ErrorFallback message={error.message} />
        : <Spinner />

        
    return (
        <div className="p-6 h-full">
            <div className="max-w-3xl mx-auto">
                <Card className="mb-6 border-foreground">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <BarChart2 className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle>{data.course.title}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {data.course.createdByName}
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                                <span className="text-2xl font-bold">{data.meta.totalStudents}</span>
                                <span className="text-sm text-muted-foreground">Студентов</span>
                            </div>
                            <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                                <span className="text-2xl font-bold">{data.meta.avgProgress}%</span>
                                <span className="text-sm text-muted-foreground">Средний прогресс</span>
                            </div>
                            <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                                <span className="text-2xl font-bold">{data.meta.completedCount}</span>
                                <span className="text-sm text-muted-foreground">Завершили</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold">Студенты</h2>
                    <Badge variant="outline">{data.students.length}</Badge>
                </div>
                <div className="space-y-3 mt-2">
                    {data.students
                        .sort((a, b) => b.percentage - a.percentage)
                        .map(student => 
                            <StudentStatsCard key={student.userID} student={student}/>
                        )}
                </div>
            </div>
        </div>
    )
}


const StudentStatsCard: FC<{ student: StudentStatsType }> = ({ student }) => (
    <Card>
        <CardContent className="p-4">
            <Accordion type='single' collapsible>
                <AccordionItem value={student.userID} >
                    <AccordionTrigger className="py-0">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{student.username}</span>
                            </div>
                            <Badge className="mr-2" variant={student.percentage === 100 ? "default" : "secondary"}>
                                {student.percentage}%
                            </Badge>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 z-10 pt-3">
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Курс</p>
                            <Progress value={student.percentage} />
                            <p className="text-xs text-muted-foreground mt-2">
                                {student.completedTopics} / {student.totalTopics} тем
                            </p>
                        </div>

                        <div className="border-t pt-3">
                            <p className="text-xs font-medium mb-2">По темам</p>
                            <div className="space-y-2">
                                {sorted(student.topicEnrollments, 'number')
                                    .map(t => 
                                        <StudentTopicStatsCard topicEnrollment={t}/>
                                    )}
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>    
        </CardContent>
    </Card>
)


const StudentTopicStatsCard: FC<{topicEnrollment: TopicEnrollmentRead}> = ({topicEnrollment}) => {
    const percent = (topicEnrollment.completedQuestions / topicEnrollment.questionCount * 100) || 0

    return (
            <div key={topicEnrollment.id}>
                <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs">
                        Тема {topicEnrollment.number}
                        {topicEnrollment.isCompleted && " ✓"}
                    </p>
                    <span className="text-xs text-muted-foreground">
                        {topicEnrollment.completedQuestions}/{topicEnrollment.questionCount} Вопросов
                    </span>
                </div>
                <Progress value={percent} className="h-1.5" />
            </div>
        )
}

import { useNavigate, useParams } from 'react-router-dom';
import { useCoursePageVM } from './course-page-view-model';
import { Spinner } from '@/shared/ui/spinner';
import { ErrorFallback } from '@/shared/ui/error-fallback';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { List, LogIn } from 'lucide-react';

export const CoursePage = () => {
    const { courseID } = useParams<{ courseID: string }>()
    const navigate = useNavigate()

    const {data,  error, onCourseEnroll, isPending} = useCoursePageVM({courseID: courseID!})

    if (!data) {
        return error
            ?   <ErrorFallback message={error.message} />
            :   <Spinner />
    }

    const {course, topics, enrollment} = data


    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Card className="mb-8">
                <CardHeader>
                    <div className="flex justify-between items-start flex-wrap gap-4">
                        <div className="flex-1">
                            <CardTitle className="text-3xl mb-2">{course.title}</CardTitle>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">
                                    {topics.length} тем
                                </Badge>
                                <Badge variant="outline">
                                    Автор: {course.created_by}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground">{course.description}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {enrollment
                        ?   <Button onClick={() => navigate(`/enrollment/${enrollment.id}`)}>Перейти к прохождению</Button>
                        :   <Button
                                onClick={onCourseEnroll}
                                disabled={isPending}
                                className="w-full md:w-auto"
                            >
                                <LogIn className="h-4 w-4 mr-2" />
                                {isPending ? 'Подписка...' : 'Записаться на курс'}
                            </Button>
                    }
                </CardContent>
            </Card>

            <div className="space-y-4">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <List className="h-5 w-5" />
                    Темы курса
                </h2>
                <div className="grid gap-3">
                    {topics
                        .sort((a, b) => a.number-b.number)
                        .map((topic) => (
                            <Card key={topic.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="secondary" className="text-xs">
                                                    Тема {topic.number}
                                                </Badge>
                                            </div>
                                            <h3 className="font-semibold text-lg mb-1">{topic.title}</h3>
                                            <p className="text-sm text-muted-foreground">{topic.description}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline">
                                                {topic.questions_count} вопросов
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                </div>
            </div>
        </div>
    )
}
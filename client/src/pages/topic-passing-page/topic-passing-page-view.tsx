import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import { Checkbox } from '@/shared/ui/checkbox';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useTopicPassingPageVM } from './topic-passing-page-view-model';
import { Spinner } from '@/shared/ui/spinner';
import { ErrorFallback } from '@/shared/ui/error-fallback';

export const TopicPassingPage = () => {
    const { topicID } = useParams<{ topicID: string }>()
    
    const { 
        questionsToAnswer,
        error,
        isSubmitting, 
        answeredQuestions, 
        handleAnswerChange, 
        isAllAnswered, 
        handleSubmit 
    } = useTopicPassingPageVM({ topicID: topicID! })


    if (!questionsToAnswer) {
        return error 
            ?   <ErrorFallback message={error.message} />
            :   <Spinner />
    }


    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Прохождение темы</h1>
                <p className="text-muted-foreground">
                    Выберите один или несколько вариантов ответа в каждом вопросе
                </p>
            </div>

            <div className="space-y-6">
                {questionsToAnswer.map((question, index) => (
                    <Card key={question.id}>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-start gap-2">
                                <span className="text-primary font-bold">{index + 1}.</span>
                                {question.text}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {question.answers.map((option) => {
                                    const isChecked = answeredQuestions[question.id]?.includes(option.id) ?? false;

                                    return (
                                        <div key={option.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/40 transition-colors">
                                            <Checkbox 
                                                id={`q${question.id}-${option.id}`} 
                                                checked={isChecked}
                                                onCheckedChange={() => handleAnswerChange(question.id, option.id)}
                                            />
                                            <Label 
                                                htmlFor={`q${question.id}-${option.id}`} 
                                                className="cursor-pointer flex-1 py-1 text-sm font-normal"
                                            >
                                                {option.text}
                                            </Label>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="mt-8 flex justify-end">
                <Button
                    onClick={handleSubmit}
                    disabled={!isAllAnswered || isSubmitting}
                    className="gap-2"
                >
                    {isSubmitting 
                        ?   <Loader2 className="h-4 w-4 animate-spin" />
                        :   <CheckCircle className="h-4 w-4" />
                    }
                    Завершить тему
                </Button>
            </div>
        </div>
    )
}

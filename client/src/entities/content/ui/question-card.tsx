import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { CheckCircle, Circle } from 'lucide-react';
import type { QuestionRead } from '@contracts';

type QuestionCardProps = {
    question: QuestionRead
}

export const QuestionCard = ({ question }: QuestionCardProps) => {
    const correctAnswersCount = question
        .answers
        .filter(a => a.is_correct)
        .length

    return (
        <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
        >
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 ">
                        <CardTitle className="text-base">
                            {question.text}
                        </CardTitle>
                        <div className="flex mt-4 items-center gap-2 mb-1 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                                {question.answers.length} вариантов
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                                <span className={'text-green-600'}>
                                    {correctAnswersCount} правильных
                                </span>
                            </Badge>
                        </div>
                    </div>
                </div>
            </CardHeader>
            
            <CardContent className="pt-0">
                <div className="flex flex-wrap flex-col gap-2">
                    {question.answers.slice(0, 3).map((answer) => (
                        <div
                            key={answer.id}
                            className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full w-fit"
                        >
                            {answer.is_correct 
                                ?   <CheckCircle className="h-3 w-3 text-green-600" />
                                :   <Circle className="h-3 w-3" />
                            }
                            <span className="truncate max-w-32">{answer.text}</span>
                        </div>
                    ))}
                    {question.answers.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                            +{question.answers.length - 3}
                        </Badge>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
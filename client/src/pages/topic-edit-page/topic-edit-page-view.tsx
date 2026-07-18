import {  useParams } from 'react-router-dom';
import { Spinner } from '@/shared/ui/spinner';
import { ErrorFallback } from '@/shared/ui/error-fallback';
import { Card, CardContent, } from '@/shared/ui/card';
import { HelpCircle } from 'lucide-react';
import { QuestionCard } from '@/entities/content/ui/question-card';
import { CreateQuestionDialogButton } from '@/features/сreate-question/create-question-dialog-button';
import { useState } from 'react';
import { CreateQuestionDialog } from '@/features/сreate-question/create-question-dialog';
import { useTopicEditPageVM } from './topic-edit-page-view-model';

export const TopicEditPage = () => {
    const { topicID } = useParams()
    const [isDialogOpen, setDialogOpen] = useState<boolean>(false)

    const { data, error } = useTopicEditPageVM({topicID: topicID!})

    if (!data) return error
        ?   <ErrorFallback message={error.message} />
        :   <Spinner />


    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <CreateQuestionDialog
            topicID={data.topic.id}
            onOpenChange={setDialogOpen}
            open={isDialogOpen}
            />
            <div className="mb-6">
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">{data.topic.title}</h1>
                        <p className="text-muted-foreground">{data.topic.description}</p>
                    </div>
                    <CreateQuestionDialogButton onClick={() => setDialogOpen(true)} />
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Вопросы ({data.questions.length})
                </h2>

                {data.questions.length
                ?   <div className="grid gap-3">
                        {data.questions.map((question) => 
                            <QuestionCard 
                                key={question.id} question={question}
                            />    
                        )}
                    </div>
                :   <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            В этой теме пока нет вопросов
                        </CardContent>
                    </Card> 
                }
            </div>
        </div>
    )
}
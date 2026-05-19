// pages/topic-questions-page/ui/topic-questions-page.tsx
import {  useParams } from 'react-router-dom';
import { Spinner } from '@/shared/ui/spinner';
import { ErrorFallback } from '@/shared/ui/error-fallback';
import { Card, CardContent, } from '@/shared/ui/card';
import { HelpCircle } from 'lucide-react';
import { useTopicQuestionsPageVM } from './topic-questions-page-view-model';
import { QuestionCard } from '@/entities/content/ui/question-card';
import { CreateQuestionDialogButton } from '@/features/сreate-question/create-question-dialog-button';
import { useState } from 'react';
import { CreateQuestionDialog } from '@/features/сreate-question/create-question-dialog';

export const TopicQuestionsPage = () => {
    const {topicID} = useParams<{topicID: string}>()
    const [isDialogOpen, setDialogOpen] = useState<boolean>(false)

    const { topic, questions, error } = useTopicQuestionsPageVM({topicID: topicID!})

    if (!topic || !questions) {
        return error
            ?   <ErrorFallback message={error.message} />
            :   <Spinner />
    }


    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <CreateQuestionDialog
                topicID={topicID!}
                onOpenChange={setDialogOpen}
                open={isDialogOpen}
            />
            <div className="mb-6">
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">{topic.title}</h1>
                        <p className="text-muted-foreground">{topic.description}</p>
                    </div>
                    <CreateQuestionDialogButton onClick={() => setDialogOpen(true)} />
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Вопросы ({questions.length})
                </h2>

                {questions.length
                    ?   <div className="grid gap-3">
                            {questions.map((question) => 
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
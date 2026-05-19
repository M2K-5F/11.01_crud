import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Card, CardTitle } from "@/shared/ui/card"
import type { EnrollmentTopicWithStatus } from "@contracts"
import clsx from "clsx"
import { Check, CirclePlay, ClipboardPlus, Lock } from "lucide-react"
import type { FC } from "react"

type EnrollmentTopicCardPropsType = {
    topic: EnrollmentTopicWithStatus,
    onSelect: () => void
}

export const EnrollmentTopicCard: FC<EnrollmentTopicCardPropsType> = ({topic, onSelect}) => {
    return (
        <Card className="flex flex-row p-0 overflow-hidden gap-0 m-0">
            <div className="w-1.5 bg-primary shrink-0" />

            <div className="flex flex-col justify-center p-2 w-full">
                <div className="flex items-center justify-between">
                    {
                        topic.is_available
                        ?   topic.is_attempted
                            ?   topic.is_completed
                                ?   <Check className="shrink-0 m-2" />
                                :   <CirclePlay className="shrink-0 m-2" />
                            :   <ClipboardPlus className="shrink-0 m-2" />
                        :   <Lock className="shrink-0 m-2" />
                    }

                    <div className="mt-2 flex-1">
                        <CardTitle>
                            <Badge variant="outline" className="px-2 py-0.5 mr-2">
                                {topic.number}
                            </Badge>
                            {topic.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{topic.description}</p>
                    </div>

                    <Badge variant="outline">{topic.question_count} вопр.</Badge>
                </div>

                <div className="flex-1 p-4">
                    <div className="mt-3 flex max-md:flex-col justify-center max-md:items-baseline gap-4 items-center">
                        <div className="flex flex-col justify-center gap-1">
                            {topic.is_attempted
                                ?   <>
                                        <Badge variant="default" className="border-green-500 border p-0 pr-2">
                                            <Badge
                                                variant="outline"
                                                className={clsx(
                                                    "scale-105 gap-1 h-full border-none mr-1",
                                                    topic.is_completed ? "bg-green-500 " : "bg-red-500"
                                                )}
                                            >
                                                <Check className="h-3 w-3" />
                                                {topic.is_completed ? "Пройдено" : "Не пройдено"}
                                            </Badge>
                                            Баллы: {topic.completed_questions}/{topic.question_count}
                                        </Badge>
                                        {!topic.is_completed && 
                                            <div className="text-xs text-red-600">
                                                "Минимум: 80 % для зачета"
                                            </div>
                                        }
                                    </>
                                :   topic.is_available
                                    ?   topic.question_count
                                        ?   <span className="text-green-500">Доступно для прохождения</span>
                                        :   <span className="text-red-500">
                                                В данной теме нет вопросов
                                                <br />
                                                Заблокировано для прохождения
                                            </span>
                                    :   <span className="text-red-500">Заблокировано для прохождения</span>
                            }
                        </div>

                        <div className="shrink grow"></div>
                        {topic.is_completed 
                            ?   <Button onClick={onSelect} size="sm" variant="default">Перепройти</Button>
                            :   topic.is_attempted
                                ?   <Button onClick={onSelect} size="sm" variant="default">Повторить</Button>
                                :   <Button onClick={onSelect} size="sm" disabled={!topic.is_available} variant="default">Начать</Button>
                        }
                    </div>
                </div>
            </div>
        </Card>
    )
}
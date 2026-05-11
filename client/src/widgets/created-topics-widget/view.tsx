import clsx from "clsx"
import { useCreatedTopicVW } from "./view-model"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui/accordion"
import { Button } from "@/shared/ui/button"
import { BarChart3 } from "lucide-react"
import { Spinner } from "@/shared/ui/spinner"
import { TopicCard } from "@/entities/content/ui/topic-card"

export const CreatedTopicsWidget = () => {
    const {data, isError, isLoading, activateMutate, arciveMutate} = useCreatedTopicVW()

    if (isLoading || !data) { return <Spinner /> }

    if (isError) {
        return (
            <div>Произошла ошибка</div>
        )
    }

    return (
        <div className='p-4'>
            <header className='w-full h-full grid justify-center mb-1  grid-rows-2'>

                <div
                    className={clsx(
                        'text-lg  px-10 text-center cursor-pointer',
                        'border border-background rounded-md col-start-2',
                        'hover:border-border h-fit hover:bg-gray-700'
                    )}
                >{'TITLE TODO'}
                </div>
            </header>

            <Accordion className="border-b border-t mb-4" type='multiple' defaultValue={['actions']}>
                <AccordionItem value="actions">
                    <AccordionTrigger>
                        <h2>Действия с курсом:</h2>
                    </AccordionTrigger>
                    <AccordionContent className="flex gap-2">
                        {/* <ViewGroupDialog courseId={courseId} /> */}
                        <Button 
                            // onClick={() => {
                            //     navigate('/stats/course?stats_course_id=' + createdCourses.find(c => c.id === courseId)?.id)
                            // }}
                            className="" 
                        >
                            <BarChart3></BarChart3>
                            Статистика
                        </Button>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {data.length
                    ?   data.map((topic) => 
                            <TopicCard
                                key={topic.id}
                                topic={topic}
                                onActivate={() => activateMutate(topic.id)}
                                onArchive={() => arciveMutate(topic.id)}
                            />
                        )
                    :   <span>Нету тем</span>
                }
                {/* <CreateTopicDialog 
                    className={clsx(
                        'h-45.5 flex items-center text-md',
                        'justify-center border-2 border-dashed border-gray-300',
                        'rounded-lg hover:border-gray-400'
                    )}  
                    text="+ Создать тему" 
                    variant='outline' 
                /> */}
            </div>
        </div>
    )
}

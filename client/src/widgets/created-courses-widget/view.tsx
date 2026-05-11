import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui/accordion"
import { useCreatedCoursesVM } from "./view-model"
import { Spinner } from "@/shared/ui/spinner"
import { CourseCard } from "@/entities/content/ui/course-card"

export const CreatedCoursesWidget = () => {
    const {isError, isLoading, data, onCourseActivate, onCourseArchive, onCourseSelect} = useCreatedCoursesVM()

    if (!data || isLoading) return <Spinner />

    if (isError) return <span>Ошибка запроса</span>

    return(
        <Accordion type='single'>
            <AccordionItem value="created">
                <AccordionTrigger className="mb-8">
                    <h1 className="text-2xl font-bold">Курсы созданные мной</h1>
                </AccordionTrigger>
                <AccordionContent>
                    {data.length
                        ?   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                                {data.map(course =>
                                    <CourseCard 
                                        key={course.id}
                                        course={course} 
                                        onActivate={() => onCourseActivate(course.id)} 
                                        onArchive={() => onCourseArchive(course.id)}
                                        onOpen={() => onCourseSelect(course.id)}
                                    />
                                )}
                                {/* <CreateCourseDialog
                                    className={clsx(
                                        'h-53 flex items-center text-md font-bold',
                                        'justify-center border-2 border-dashed border-gray-300',
                                        'rounded-lg hover:border-gray-400 transition-colors'
                                    )}
                                    text="+ Создать курс" 
                                    variant='outline'
                                /> */}
                            </div>
                        :   <div className="flex flex-col items-center justify-center py-12  rounded-lg shadow-sm">
                                <p className=" mb-4">Нет созданных курсов</p>
                                {/* <CreateCourseDialog
                                    text="Создать первый курс"
                                    variant='default'
                                /> */}
                            </div>
                    }
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
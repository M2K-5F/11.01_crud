import { Button } from "@/shared/ui/button"
import { BookOpen } from "lucide-react"
import { useEnrolledCoursesSectionVM } from "./enrollled-courses-view-model"
import { Spinner } from "@/shared/ui/spinner"
import { ErrorFallback } from "@/shared/ui/error-fallback"
import { EnrollmentCard } from "@/entities/learning/ui/enrollment-card"

export const EnrolledCoursesSection = () => {
    const {enrollments, error, onEnrollmentSelect} = useEnrolledCoursesSectionVM()

    if (!enrollments) {
        return error 
            ? <ErrorFallback message={error.message} /> 
            : <Spinner />
    }


    return (
        <section className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Мои курсы</h2>
                </div>
                <Button variant="ghost" size="sm">Посмотреть все →</Button>
            </div>
            {enrollments.length
                ?   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enrollments.map(enrollment => 
                            <EnrollmentCard 
                                key={enrollment.id} 
                                enrollment={enrollment} 
                                onSelect={onEnrollmentSelect(enrollment.id)}
                            />
                        )}
                    </div>
                :   <ErrorFallback message='Нет подписок' />
            }
            
        </section>
    )
}
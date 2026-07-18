import { useGuardedCurrentUser } from "@/entities/identity/providers/current-user-provider"
import { useState } from "react"
import { useCreatedCoursesSectionVM, useEnrolledCoursesSectionVM } from "./homepage-view-model"
import { ErrorFallback } from "@/shared/ui/error-fallback"
import { Spinner } from "@/shared/ui/spinner"
import { CreateCourseDialog } from "@/features/create-course/create-course-dialog"
import { BookOpen, Users } from "lucide-react"
import { CreateCourseCard } from "@/features/create-course/create-course-card"
import { CourseCard } from "@/entities/content/ui/course-card"
import { EnrollmentCard } from "@/entities/learning/ui/enrollment-card"
import { Button } from "@/shared/ui/button"

export const Homepage = () => {
    const { user } = useGuardedCurrentUser()
    return (
        <>
            {user.roles.includes('Student') && <EnrolledCoursesSection />}

            {user.roles.includes('Teacher') && <CreatedCoursesSection />}
        </>
    )
}


export const CreatedCoursesSection = () => {
    const {courses, error, onCourseArchive, onCourseActivate, onCourseSelect} = useCreatedCoursesSectionVM()
    const [isCreateCourseDialogOpen, setDialogOpen] = useState<boolean>(false)

    
    if (!courses) return error
        ?   <ErrorFallback message={error.message} />
        :   <Spinner />


    return (
        <section className="space-y-4">
            <CreateCourseDialog open={isCreateCourseDialogOpen} onOpenChange={setDialogOpen} />
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Управление курсами</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <CreateCourseCard onClick={() => setDialogOpen(true)} />
                
                {courses.map(course =>
                    <CourseCard
                        key={course.id}
                        course={course}
                        onArchive={onCourseArchive(course.id)}
                        onActivate={onCourseActivate(course.id)}
                        onOpen={onCourseSelect(course.id)}
                    />
                )}
            </div>
        </section>
    )
}


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
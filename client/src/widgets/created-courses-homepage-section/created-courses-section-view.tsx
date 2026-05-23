import { Users } from "lucide-react"
import { useCreatedCoursesSectionVM } from "./created-courses-section-view-model"
import { ErrorFallback } from "@/shared/ui/error-fallback"
import { Spinner } from "@/shared/ui/spinner"
import { CourseCard } from "@/entities/content/ui/course-card"
import { CreateCourseCard } from "@/features/create-course/create-course-card"
import { useState } from "react"
import { CreateCourseDialog } from "@/features/create-course/create-course-dialog"

export const CreatedCoursesSection = () => {
    const {courses, error, isTeacher, activate, archive, onCourseSelect} = useCreatedCoursesSectionVM()
    const [isCreateCourseDialogOpen, setDialogOpen] = useState<boolean>(false)

    if (!isTeacher) return null

    if (!courses) return error
        ?   <ErrorFallback message={error.message} /> 
        :   <Spinner />


    return (
        <section className="space-y-4">
            <CreateCourseDialog open={isCreateCourseDialogOpen} onDialogClose={() => setDialogOpen(false)} />
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Управление курсами</h2>
                </div>

            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <CreateCourseCard onClick={() => setDialogOpen(true)} />
                
                {courses.map((course) => (
                    <CourseCard
                        key={course.id}
                        course={course}
                        onArchive={() => archive(course.id)}
                        onActivate={() => activate(course.id)}
                        onOpen={() => onCourseSelect(course.id)}
                    />
                ))}
            </div>
        </section>
    )
}
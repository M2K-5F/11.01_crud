import { StudentGuard } from "@/app/guards/student-guard"
import { TeacherGuard } from "@/app/guards/teacher-guard"
import { CreatedCoursesSection } from "@/widgets/created-courses-homepage-section/created-courses-section-view"
import { EnrolledCoursesSection } from "@/widgets/enrolled-courses-homepage-section/enrolled-courses-view"

export const Homepage = () => {
    return (
        <>
            <StudentGuard>
                <EnrolledCoursesSection />
            </StudentGuard>

            <TeacherGuard>
                <CreatedCoursesSection /> 
            </TeacherGuard>
        </>
    )
}
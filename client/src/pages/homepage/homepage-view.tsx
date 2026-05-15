import { useGuardedCurrentUser } from "@/entities/identity/user/current-user-provider"
import { CreatedCoursesSection } from "@/widgets/created-courses-homepage-section/created-courses-section-view"
import { EnrolledCoursesSection } from "@/widgets/enrolled-courses-homepage-section/enrolled-courses-view"

export const Homepage = () => {
    const {user} = useGuardedCurrentUser()

    const isTeacher = user.roles.includes('Teacher')
    const isStudent = user.roles.includes('Student')

    return (
        <>
            {isStudent && <EnrolledCoursesSection />}
            {isTeacher && <CreatedCoursesSection />}
        </>

    )
}
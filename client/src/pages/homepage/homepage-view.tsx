import { useGuardedCurrentUser } from "@/entities/identity/user/current-user-provider"
import { CreatedCoursesSection } from "@/widgets/created-courses-homepage-section/created-courses-section-view"
import { EnrolledCoursesSection } from "@/widgets/enrolled-courses-homepage-section/enrolled-courses-view"

export const Homepage = () => {
    const {user} = useGuardedCurrentUser()
    return (
        <>
            {user.roles.includes('Student') && <EnrolledCoursesSection />}

            
            {user.roles.includes('Teacher') && <CreatedCoursesSection />}
        </>
    )
}
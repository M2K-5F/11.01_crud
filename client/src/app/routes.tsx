import LoginForm from "@/features/authorize/login-form-view";
import { RegisterForm } from "@/features/register/register-form-view";
import { Homepage } from "@/pages/homepage/homepage-view";
import { AuthWidget } from "@/widgets/auth-layout/view";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layouts/app-layout";
import { GuestGuard } from "./guards/guest-guard";
import { AuthGuard } from "./guards/auth-guard";
import { CourseTopicsPage } from "@/pages/course-topics-page/course-topic-page-view";
import { TeacherGuard } from "./guards/teacher-guard";
import { StudentGuard } from "./guards/student-guard";
import { EnrollmentPage } from "@/pages/enroll-topics-page/enroll-topics-page-view";
import { CoursePage } from "@/pages/course-page/course-page-view";
import { TopicQuestionsPage } from "@/pages/topic-questions-page/topic-questions-page-view";
import { TopicPassingPage } from "@/pages/topic-passing-page/topic-passing-page-view"
import { CourseStatsPage } from "@/pages/course-stats-page/course-stats-page-view";

export const RegisteredRoutes = () => 
<Routes>
    <Route path="/identity" element={
        <GuestGuard>
            <AuthWidget />
        </GuestGuard>
    }>
        <Route path="login" element={<LoginForm />}/>
        <Route path="register" element={<RegisterForm />} />
        <Route index element={<Navigate to='login' replace />} />
    </Route>


    <Route element={
        <AuthGuard>
            <AppLayout />
        </AuthGuard>
    }>
        <Route path="/" element={<Homepage />} />


        <Route path="/courses/:courseID/edit" element={
            <TeacherGuard>
                <CourseTopicsPage/>
            </TeacherGuard>
        } />

        <Route path="/courses/:courseID/stats" element={
            <TeacherGuard>
                <CourseStatsPage />
            </TeacherGuard>
        }/>

        <Route path="/courses/:courseID"  element={<CoursePage />} />


        <Route path="/topics/:topicID/edit" element={
            <TeacherGuard>
                <TopicQuestionsPage />
            </TeacherGuard>
        } />
        
        <Route path="/topics/:topicID/passing" element={
            <StudentGuard>
                <TopicPassingPage />
            </StudentGuard>
        } />


        <Route path="/enrollments/:enrollmentID" element={
            <StudentGuard>
                <EnrollmentPage />
            </StudentGuard>
        } />
    </Route>
    
    <Route path="*" element={<Navigate to={'/'} replace />} />
</Routes>   
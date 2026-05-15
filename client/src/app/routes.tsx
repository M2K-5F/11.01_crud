import LoginForm from "@/features/authorize/login-form-view";
import { RegisterForm } from "@/features/register/register-form-view";
import { Homepage } from "@/pages/homepage/homepage-view";
import { AuthWidget } from "@/widgets/auth-layout/view";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layouts/app-layout";
import { GuestGuard } from "./guards/guest-guard";
import { AuthGuard } from "./guards/auth-guard";
import { CourseTopicsPage } from "@/pages/course-topics-page/course-topic-page-view";
import { RoleGuard } from "./guards/role-guard";

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
        <Route path="/edit-course/:courseID" element={<RoleGuard roles={['Teacher']}><CourseTopicsPage/></RoleGuard>} />
    </Route>
</Routes>   
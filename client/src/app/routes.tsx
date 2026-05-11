import LoginForm from "@/features/authorize";
import { RegisterForm } from "@/features/register/view";
import { CourseEditPage } from "@/pages/course-edit-page/view";
import { Homepage } from "@/pages/homepage/view";
import { AuthWidget } from "@/widgets/auth-layout/view";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layouts/app-layout";

export const RegisteredRoutes = () => 
<Routes>
    <Route path="/identity" element={<AuthWidget />}>
        <Route path="login" element={<LoginForm />}/>
        <Route path="register" element={<RegisterForm />} />
        <Route index element={<Navigate to='login' />}></Route>
    </Route>
    
    <Route element={<AppLayout />}>
        <Route path="/" element={<Homepage />} />
        <Route path="/edit-course/:courseID" element={<CourseEditPage />} />
    </Route>
</Routes>   
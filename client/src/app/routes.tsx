import LoginForm from "@/features/authorize";
import { RegisterForm } from "@/features/register/view";
import { AuthWidget } from "@/widgets/auth-layout/view";
import { Navigate, Route, Routes } from "react-router-dom";

export const RegisteredRoutes = () => 
<Routes>
    <Route path="/auth" element={<AuthWidget />}>
        <Route path="login" element={<LoginForm />}/>
        <Route path="register" element={<RegisterForm />} />
        <Route index element={<Navigate to='login' />}></Route>
    </Route>
</Routes>   
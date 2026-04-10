import LoginForm from "@/features/authorize";
import { Navigate, Route, Routes } from "react-router-dom";

export const RegisteredRoutes = () => 
<Routes>
    <Route path="/auth">
        <Route path="login" element={<LoginForm />}/>
        <Route path="register" />
        <Route index element={<Navigate to='login' />}></Route>
    </Route>
</Routes>   
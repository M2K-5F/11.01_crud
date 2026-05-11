import { Header } from "@/widgets/header/view";
import { Outlet } from "react-router-dom";

export const AppLayout = () => 
<>
    <Header />
    <Outlet />
</>
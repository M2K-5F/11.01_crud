import { Header } from "@/widgets/header/view";
import { Outlet } from "react-router-dom";

export const AppLayout = () => 
<>
    <Header />
    <main className="container mx-auto px-4 py-8 space-y-12">
        <Outlet />
    </main>
</>
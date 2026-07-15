import { useCurrentUser } from "@/entities/identity/providers/current-user-provider";
import type { FC, PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

export const GuestGuard: FC<PropsWithChildren> = ({children}) => {
    const {user} = useCurrentUser()

    if (user) return <Navigate to='/' replace />

    return children
}
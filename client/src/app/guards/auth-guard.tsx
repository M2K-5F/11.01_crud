import { useCurrentUser } from "@/entities/identity/providers/current-user-provider";
import type { FC, PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

export const AuthGuard: FC<PropsWithChildren> = ({children}) => {
    const {user} = useCurrentUser()

    if (!user) return <Navigate to='/identity/login' replace />

    return children
}

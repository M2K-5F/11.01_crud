import { useCurrentUser } from "@/entities/identity/user/current-user-provider";
import { Spinner } from "@/shared/ui/spinner";
import type { FC, PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

export const GuestGuard: FC<PropsWithChildren> = ({children}) => {
    const {user, isLoading} = useCurrentUser()

    if (isLoading) return <Spinner />

    if (user) return <Navigate to='/' replace />

    return children
}
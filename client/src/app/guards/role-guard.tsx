import { useCurrentUser } from "@/entities/identity/user/current-user-provider";
import { Spinner } from "@/shared/ui/spinner";
import type { UserRead } from "@contracts";
import type { FC, PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

export const RoleGuard: FC<PropsWithChildren & {roles: UserRead['roles']}> = ({children, roles}) => {
    const {user, isLoading} = useCurrentUser()
    
    if (isLoading) return <Spinner />

    if (!user) return <Navigate to='/identity/login' replace />

    if (!user.roles.some(role => roles.includes(role))) return <Navigate to='/forbidden' replace/>

    return children
}
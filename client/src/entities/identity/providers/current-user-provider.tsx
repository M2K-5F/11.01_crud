import type { UserRead } from "@contracts";
import { createContext, useContext, useEffect, useMemo, useState, type FC, type PropsWithChildren } from "react";
import { userApi } from "../api";
import { ApiError } from "@/shared/errors";
import { Begin, Future } from 'fluent-future';
import { api } from "@/shared/api/query-client";
import { useLoading } from "@/shared/providers/loading-provider";


type CurrentUserContextType = {
    user: UserRead | null,
    updateCurrentUser: () => Future<UserRead, ApiError>,
    logout: () => Future<void>
}


const CurrentUserContext = createContext<CurrentUserContextType | null>(null)


export const CurrentUserProvider: FC<PropsWithChildren> = ({children}) => {
    const [user, setUser] = useState<UserRead | null>(null)
    const {toggleLoadingOff, toggleLoadingOn} = useLoading()
    

    const fetchCurrentUser = ()=> Begin<ApiError>()
        .tap(toggleLoadingOn)
        .andThen(userApi.getCurrent)
        .tap(setUser)
        .tapErr(console.log)
        .finally(toggleLoadingOff)


    const logout = ()=> Begin<ApiError>()
        .tap(toggleLoadingOn)
        .andThen(userApi.logout)
        .tap(api.removeBearer)
        .tap(()=> setUser(null))
        .finally(toggleLoadingOff)


    useEffect(()=> {
        fetchCurrentUser()
    }, [])


    const currentUserValue = useMemo(()=> ({
        user,
        updateCurrentUser: fetchCurrentUser,
        logout,
    }), [user])

    return (
        <CurrentUserContext.Provider value={currentUserValue}>
            {children}
        </CurrentUserContext.Provider>
    )
}


export const useCurrentUser = () => {
    const ctx = useContext(CurrentUserContext)
    if (!ctx) throw new Error('useCurrentUser must be used within UserProvider')
    return ctx
}


export const useGuardedCurrentUser = () => {
    const {user, logout, updateCurrentUser} = useCurrentUser()

    if (!user) throw new Error('useGuardedCurrentUser must be used within AuthGuard')

    return {logout, updateCurrentUser, user}
}
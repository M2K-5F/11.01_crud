import type { UserRead } from "@contracts";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type FC, type PropsWithChildren } from "react";
import { userApi } from "./api";
import { ApiError } from "@/shared/errors";
import { Begin, Future } from 'fluent-future';
import { api } from "@/shared/api/QueryClient";


type CurrentUserContextType = {
    user: UserRead | null,
    isLoading: boolean,
    fetchCurrentUser: () => Future<UserRead, ApiError>,
    logout: () => Future<void>
}

const CurrentUserContext = createContext<CurrentUserContextType | null>(null)

export const CurrentUserProvider: FC<PropsWithChildren> = ({children}) => {
    const [user, setUser] = useState<UserRead | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    

    const fetchCurrentUser = useCallback(() => 
        Begin<ApiError>()
            .tap (() => setIsLoading(true))

            .andThen (() => userApi.getCurrent())

            .tap (user => setUser(user))
            .tapErr (err => console.log(err))
            .finally (() => setIsLoading(false))
    , [])

    const logout = useCallback(() => 
        Begin<ApiError>()
            .tap (() => setIsLoading(true))

            .andThen (() => userApi.logout())

            .tap (() => {
                setUser(null)
                api.removeBearer()
            })
            .finally (() => setIsLoading(false))
    , [])


    useEffect(() => {
        fetchCurrentUser()
    }, [fetchCurrentUser])


    const value = useMemo(() => ({
        user,
        isLoading,
        fetchCurrentUser,
        logout,
        isUserCurrent: (userID: string) => user && user.id === userID
    }), [user, isLoading, fetchCurrentUser, logout])

    return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>
}


export const useCurrentUser = () => {
    const ctx = useContext(CurrentUserContext)
    if (!ctx) throw new Error('useCurrentUser must be used within UserProvider')
    return ctx
}


export const useGuardedCurrentUser = () => {
    const {user, logout, fetchCurrentUser} = useCurrentUser()

    if (!user) throw new Error('useGuardedCurrentUser must be used within AuthGuard')

    return {logout, fetchCurrentUser, user}
}
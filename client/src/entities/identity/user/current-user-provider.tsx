import type { UserRead } from "@contracts";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type FC, type PropsWithChildren } from "react";
import { userApi } from "./api";
import { Ok, Result } from "@/shared/lib/result";
import type { ApiError } from "@/shared/errors";

type CurrentUserContextType = {
    user: UserRead | null,
    isLoading: boolean,
    fetchCurrentUser: () => Result<UserRead, ApiError>,
    logout: () => Result<void>
}

const CurrentUserContext = createContext<CurrentUserContextType | null>(null)

export const CurrentUserProvider: FC<PropsWithChildren> = ({children}) => {
    const [user, setUser] = useState<UserRead | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    console.log(user)
    

    const fetchCurrentUser = useCallback(() => {
        setIsLoading(true)

        return userApi.getCurrent()
            .tap(user => setUser(user))
            .tapErr(err => console.log(err))
            .finally(() => setIsLoading(false))
    }, [])

    const logout = useCallback(() => {
        setIsLoading(true)

        // await userApi.logout()

        setUser(null)
        setIsLoading(false)

        return Ok()
    }, [])


    useEffect(() => {
        fetchCurrentUser()
    }, [fetchCurrentUser])


    const value = useMemo(() => ({
        user,
        isLoading,
        fetchCurrentUser,
        logout
    }), [user, isLoading, fetchCurrentUser, logout])

    return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>
}


export const useCurrentUser = () => {
    const ctx = useContext(CurrentUserContext)
    if (!ctx) throw new Error('useCurrentUser must be used within UserProvider')
    return ctx
}
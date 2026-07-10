import { createContext, useCallback, useContext, useEffect, useMemo, useState, type FC, type PropsWithChildren } from "react";

type ThemeType = "light" | "dark"

type ThemeContextType = {
    theme: ThemeType,
    toggleDarkTheme: () => void,
    toggleLightTheme: () => void,
}


const ThemeContext = createContext<ThemeContextType | null>(null)


export const ThemeProvider: FC<PropsWithChildren> = ({children}) => {
    const [theme, setTheme] = useState<ThemeType>(localStorage.getItem("theme") as ThemeType || 'dark')


    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark')
        localStorage.setItem('theme', theme)
    }, [theme])


    const toggleDarkTheme = useCallback(() => {
        setTheme('dark')
    }, [setTheme])


    const toggleLightTheme = useCallback(() => {
        setTheme('light')
    }, [setTheme])

    const value = useMemo(() => ({theme, toggleDarkTheme, toggleLightTheme}), [theme, toggleDarkTheme, toggleLightTheme])

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
    const ctx = useContext(ThemeContext)

    if (!ctx) throw new Error('ThemeProvider required')

    return ctx
}

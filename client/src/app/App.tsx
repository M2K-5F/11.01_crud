import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter } from "react-router-dom"
import { RegisteredRoutes } from "./routes"
import { Toaster } from "sonner"
import { CurrentUserProvider } from "@/entities/identity/providers/current-user-provider"
import { ThemeProvider } from "@/shared/providers/theme-provider"
import { extendQueryClient } from "@/shared/lib/composed-key"
import { LoadingProvider, useLoading } from "@/shared/providers/loading-provider"
import type { FC, PropsWithChildren } from "react"
import { Spinner } from "@/shared/ui/spinner"

const queryClient = new QueryClient()
extendQueryClient(queryClient)

export function App() {
    return (
        <Composition>
            <View/>
        </Composition>
    )
}

const Composition: FC<PropsWithChildren> = ({children})=>
<ThemeProvider>
    <LoadingProvider>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <CurrentUserProvider>
                    {children}
                    <Toaster position='top-right' />
                </CurrentUserProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </LoadingProvider>
</ThemeProvider>


const View = ()=> {
    const {isLoading} = useLoading()

    if (isLoading) return <Spinner/>

    return <RegisteredRoutes/>
}

export default App
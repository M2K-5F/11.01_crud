import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter } from "react-router-dom"
import { RegisteredRoutes } from "./routes"
import { Toaster } from "sonner"
import { CurrentUserProvider } from "@/entities/identity/user/current-user-provider"
import { ThemeProvider } from "@/shared/providers/theme-provider"
import { extendQueryClient } from "@/shared/lib/composed-key"

const queryClient = new QueryClient()
extendQueryClient(queryClient)

export function App() {
  return (
    
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CurrentUserProvider>
            <RegisteredRoutes/>
            <Toaster position='top-right' />
          </CurrentUserProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
    // <HomePage />
  )
}

export default App
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter } from "react-router-dom"
import { RegisteredRoutes } from "./routes"
import { Toaster } from "sonner"
import { CurrentUserProvider } from "@/entities/identity/user/current-user-provider"

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CurrentUserProvider>
          <RegisteredRoutes/>
          <Toaster />
        </CurrentUserProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App

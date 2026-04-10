import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter } from "react-router-dom"
import { RegisteredRoutes } from "./routes"
import { Toaster } from "sonner"

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RegisteredRoutes/>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App

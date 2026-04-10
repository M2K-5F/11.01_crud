import { api } from "@/shared/api/QueryClient";
import type { LoginForm } from "./view-model";

export const loginFormApi = {
    login: (data: LoginForm) => api.post<{access: string, id: string}>('/identity/login', data)
}
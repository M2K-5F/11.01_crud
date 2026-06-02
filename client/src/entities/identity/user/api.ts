import { api } from "@/shared/api/query-client";
import type { UserRead } from "@contracts";


type LoginDTO = NoInfer<{
    password: string
    name: string
}>

type RegisterDTO = NoInfer<{
    name: string
    telegram_link: string
    password: string
}>


export const userApi = {
    getCurrent: () => api.get<UserRead>('/identity/me'),
    logout: () => api.post('/identity/logout'),
    login: (data: LoginDTO) => api.post<{access: string, id: string}>('/identity/login', data),
    register: (data: RegisterDTO) => api.post<UserRead>('/identity/register', data)
}
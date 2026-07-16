import { api } from "@/shared/api/query-client";
import type { UserRead } from "@contracts";


type LoginDTO = {
    password: string
    username: string
}

type RegisterDTO = {
    name: string
    telegramLink: string
    password: string
}


export const userApi = {
    getCurrent: () => api.get<UserRead>('/identity/users/me'),
    logout: () => api.post('/identity/auth/logout'),
    login: (data: NoInfer<LoginDTO>) => api.post<{accessToken: string, uid: string}>('/identity/auth/login', data),
    register: (data: NoInfer<RegisterDTO>) => api.post<UserRead>('/identity/users', data)
}
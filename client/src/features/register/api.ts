import type { User } from "@/entities/identity/user/model"
import { api } from "@/shared/api/QueryClient"

export type RegisterData = {
    name: string,
    talegramLink: string,
    password: string
}

export const registerApi = {
    register: (data: RegisterData) => api.post<User>('/identity/register', {name: data.name, password: data.password, telegram_link: data.talegramLink})
}
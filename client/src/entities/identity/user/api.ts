import { api } from "@/shared/api/QueryClient";
import type { User } from "./model";

export const userApi = {
    getCurrent: () => api.get<User>('/identity/me')
}
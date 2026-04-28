import { api } from "@/shared/api/QueryClient";
import type { UserRead } from "@contracts";

export const userApi = {
    getCurrent: () => api.get<UserRead>('/identity/me')
}
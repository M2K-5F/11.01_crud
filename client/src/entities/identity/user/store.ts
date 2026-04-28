import {create} from 'zustand'
import type { UserRead } from "@contracts"


export type CurrentUserStoreShema = {
    currentUser: UserRead | null

    setCurrentUser: (user: UserRead) => void

}

export const useCurrentUserStore = create<CurrentUserStoreShema>((set) => ({
    currentUser: null,

    setCurrentUser(user) {
        set({currentUser: user})
    },
}))
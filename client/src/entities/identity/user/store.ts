import {create} from 'zustand'
import type { User } from './model'


export type CurrentUserStoreShema = {
    currentUser: User | null

    setCurrentUser: (user: User) => void

}

export const useCurrentUserStore = create<CurrentUserStoreShema>((set) => ({
    currentUser: null,

    setCurrentUser(user) {
        set({currentUser: user})
    },
}))
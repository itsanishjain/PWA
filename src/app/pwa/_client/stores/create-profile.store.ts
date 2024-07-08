import { create } from 'zustand'
// import { devtools, persist } from 'zustand/middleware'

export interface ProfileDraft {
    avatar: string | File | undefined
    displayName: string | undefined
}

type CreateProfileStoreState = {
    profileDraft: ProfileDraft
    error: Error | null
    isHydrated: boolean
}

type CreateProfileStoreActions = {
    setProfileDraft: <K extends keyof ProfileDraft>(key: K, value: ProfileDraft[K]) => void
    setError: (error: Error | null) => void
    resetProfileDraft: () => void
    setHydrated: (state: boolean) => void
}

const initialProfileDraft: ProfileDraft = {
    avatar: undefined,
    displayName: '',
}

export const useCreateProfileStore = (userId: string) =>
    create<CreateProfileStoreState & CreateProfileStoreActions>()(
        // TODO: fix circular dependency issues
        // devtools(
        // persist(
        set => ({
            profileDraft: initialProfileDraft,
            error: null,
            isHydrated: false,
            setProfileDraft: (field, value) =>
                set(state => ({
                    profileDraft: {
                        ...state.profileDraft,
                        [field]: value,
                    },
                })),
            setError: (error: Error | null) => set({ error }),
            resetProfileDraft: () => set(() => ({ profileDraft: initialProfileDraft })),
            setHydrated: (state: boolean) => set({ isHydrated: state }),
        }),
        // { name: `create-profile-store-${userId}` },
        // ),
        // ),
    )

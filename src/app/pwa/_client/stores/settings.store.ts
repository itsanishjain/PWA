import { devtools, persist } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'
import type { MyPoolsTab } from '../../(pages)/my-pools/_components/my-pools.tabs.config'

export type SettingsState = {
    topBarTitle: string | null
    bottomBarContent: React.ReactNode | null
    myPoolsTab: MyPoolsTab['id']
}

export type SettingsActions = {
    setTopBarTitle: (title: string | null) => void
    setBottomBarContent: (content: React.ReactNode | null) => void
    setMyPoolsTab: (tab: MyPoolsTab['id']) => void
}

export type SettingsStore = SettingsState & SettingsActions

export const initSettingsStore = (): SettingsState => {
    return { topBarTitle: null, bottomBarContent: null, myPoolsTab: 'upcoming' }
}

export const defaultInitState: SettingsState = {
    topBarTitle: null,
    bottomBarContent: null,
    myPoolsTab: 'upcoming',
}

export const createSettingsStore = (initState: SettingsState = defaultInitState) => {
    return createStore<SettingsStore>()(
        devtools(
            persist(
                set => ({
                    ...initState,
                    setTopBarTitle: (title: string | null) => set({ topBarTitle: title }),
                    setBottomBarContent: (content: React.ReactNode | null) => set({ bottomBarContent: content }),
                    setMyPoolsTab: (tab: MyPoolsTab['id']) => set({ myPoolsTab: tab }),
                }),

                { name: 'pool-app-settings' },
            ),
        ),
    )
}

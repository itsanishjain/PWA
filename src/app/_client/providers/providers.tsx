/**
 * @file src/providers/providers.tsx
 * @description the main providers for the application
 */
'use client'

import { PrivyProvider } from '@privy-io/react-auth'
import { WagmiProvider } from '@privy-io/wagmi'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { Toaster } from 'sonner'
import { queryClient as getQueryConfig, privy } from './configs'
import { AppStoreProvider } from './app-store.provider'
import { useState } from 'react'
import { getConfig } from './configs/wagmi.config'
import { cookieToInitialState } from 'wagmi'

type Props = {
    children: React.ReactNode
    cookie: string | null
}

export default function Providers({ children, cookie }: Props) {
    const [config] = useState(() => getConfig())
    const queryConfig = getQueryConfig()
    const initialState = cookieToInitialState(config, cookie)

    return (
        <PrivyProvider {...privy}>
            <PersistQueryClientProvider {...queryConfig}>
                <HydrationBoundary state={dehydrate(queryConfig.client)}>
                    <WagmiProvider config={config} initialState={initialState}>
                        <AppStoreProvider>{children}</AppStoreProvider>
                        <Toaster position='top-center' visibleToasts={1} />
                        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
                    </WagmiProvider>
                </HydrationBoundary>
            </PersistQueryClientProvider>
        </PrivyProvider>
    )
}

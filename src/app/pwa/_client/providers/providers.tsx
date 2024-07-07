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
import { queryClient as getQueryClient, privy, wagmi } from './configs'
import { SettingsStoreProvider } from './settings.provider'

export default function Providers({ children }: React.PropsWithChildren) {
    const queryClient = getQueryClient()

    return (
        <PrivyProvider {...privy}>
            <PersistQueryClientProvider {...queryClient}>
                <HydrationBoundary state={dehydrate(queryClient.client)}>
                    <WagmiProvider {...wagmi}>
                        <SettingsStoreProvider>{children}</SettingsStoreProvider>
                        <Toaster position='top-center' />
                        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
                    </WagmiProvider>
                </HydrationBoundary>
            </PersistQueryClientProvider>
        </PrivyProvider>
    )
}

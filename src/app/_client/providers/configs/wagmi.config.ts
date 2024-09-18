import { cookieStorage, createStorage, http } from 'wagmi'
import { baseSepolia } from 'viem/chains'
import { createConfig } from '@privy-io/wagmi'

export function getConfig() {
    return createConfig({
        chains: [baseSepolia],
        multiInjectedProviderDiscovery: false,
        syncConnectedChain: true,
        transports: {
            [baseSepolia.id]: http(process.env.RPC_ENDPOINT),
        },
        ssr: true,
        storage: createStorage({
            storage: cookieStorage,
        }),
    })
}

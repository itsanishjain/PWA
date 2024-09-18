import { http } from 'wagmi'
import type { Config, WagmiProviderProps } from 'wagmi'
import { baseSepolia, base } from 'viem/chains'
import { createConfig } from '@privy-io/wagmi'
import { inProduction } from '@/app/pwa/_lib/utils/environment.mjs'

const chain = inProduction ? base : baseSepolia

const privyWagmiConfig: Config = createConfig({
    chains: [chain],
    multiInjectedProviderDiscovery: false,
    syncConnectedChain: true,
    transports: {
        [baseSepolia.id]: http(process.env.RPC_ENDPOINT),
        [base.id]: http(process.env.RPC_ENDPOINT),
    },
    ssr: true,
})

export default { config: privyWagmiConfig } satisfies WagmiProviderProps

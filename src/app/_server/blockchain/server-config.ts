import { tokenAddress, poolAddress } from '@/types/contracts'
import { createConfig, getPublicClient, http } from '@wagmi/core'
import type { Address, Chain, Transport } from 'viem'
import { base, baseSepolia } from 'viem/chains'

const network = process.env.NEXT_PUBLIC_NETWORK || 'development'

const chainConfig = {
    mainnet: base,
    testnet: baseSepolia,
    development: baseSepolia,
}

const chain = chainConfig[network as keyof typeof chainConfig] as Chain
const transport = { [chain.id]: http(process.env.RPC_ENDPOINT) } as Record<number, Transport>

export const serverConfig = createConfig({
    chains: [chain],
    multiInjectedProviderDiscovery: true,
    syncConnectedChain: true,
    transports: transport,
    ssr: true,
})

export const currentPoolAddress: Address = poolAddress[chain.id as keyof typeof poolAddress] as Address
export const currentTokenAddress: Address = tokenAddress[chain.id as keyof typeof tokenAddress] as Address

export const serverClient = getPublicClient(serverConfig)

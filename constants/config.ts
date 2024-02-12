import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, foundry } from 'wagmi/chains'

export const config = createConfig({
	chains: [foundry],
	transports: {
		// [mainnet.id]: http(),
		// [sepolia.id]: http(),
		[foundry.id]: http(),
	},
})

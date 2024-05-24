import { createConfig, http } from 'wagmi'
import { foundry } from 'wagmi/chains'

export const config = createConfig({
	chains: [foundry],
	transports: {
		// [mainnet.id]: http(),
		// [sepolia.id]: http(),
		[foundry.id]: http(),
	},
})

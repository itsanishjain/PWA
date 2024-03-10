import { defineChain } from 'viem'

export const localChain = defineChain({
	id: 31337, // Replace this with your chain's ID
	name: 'My Avil Chain',
	network: 'my-anvil-chain',
	nativeCurrency: {
		decimals: 18, // Replace this with the number of decimals for your chain's native token
		name: 'Ethereum',
		symbol: 'Eth',
	},
	rpcUrls: {
		default: {
			http: ['http://localhost:8545'],
			webSocket: ['wss://my-custom-chain-websocket-rpc'],
		},
	},
	blockExplorers: {
		default: { name: 'Explorer', url: 'my-custom-chain-block-explorer' },
	},
})

export const localnetTokenAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
export const localnetContractAddress =
	'0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'

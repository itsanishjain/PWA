import { Network } from '@/models/types'
import { defineChain } from 'viem'
import { mainnet, baseSepolia, base } from 'viem/chains'
import { ethers } from 'ethers'

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

export const testChain = baseSepolia
export const mainChain = base
// export const testChain = defineChain({
// 	id: 84532, // Replace this with your chain's ID
// 	name: 'Base Sepolia',
// 	network: 'base-sepolia',
// 	nativeCurrency: {
// 		decimals: 18, // Replace this with the number of decimals for your chain's native token
// 		name: 'Ethereum',
// 		symbol: 'ETH',
// 	},
// 	rpcUrls: {
// 		default: {
// 			http: ['https://sepolia.base.org'],
// 			// webSocket: ['wss://my-custom-chain-websocket-rpc'],
// 		},
// 	},
// 	blockExplorers: {
// 		default: { name: 'Explorer', url: 'https://sepolia-explorer.base.org/' },
// 	},
// })

// export const mainChain = defineChain({
// 	id: 8453, // Replace this with your chain's ID
// 	name: 'Base Mainnet',
// 	network: 'base-mainnet',
// 	nativeCurrency: {
// 		decimals: 18, // Replace this with the number of decimals for your chain's native token
// 		name: 'Ethereum',
// 		symbol: 'ETH',
// 	},
// 	rpcUrls: {
// 		default: {
// 			http: ['https://mainnet.base.org'],
// 			webSocket: ['wss://my-custom-chain-websocket-rpc'],
// 		},
// 	},
// 	blockExplorers: {
// 		default: { name: 'Explorer', url: 'https://basescan.org' },
// 	},
// })
export const network: Network = Network.Testnet

export const localnetTokenAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
export const localnetContractAddress =
	'0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'

export const testnetTokenAddress = '0x4FFB3dE4C805D10B60cAaF225EC3667507a9061f'
export const testnetContractAddress =
	'0x9C2eFC1BdCAaC75c7f77F924fD573be4a2F6c024'
export const testnetDropletClaimContractAddress =
	'0x7f0668B813a960AAd9E56C4870131dB6314819eB'

export const mainnetTokenAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
export const mainnetContractAddress =
	'0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'

export const tokenAddress =
	network.toString() === Network.Localnet
		? localnetTokenAddress
		: network.toString() === Network.Testnet
		? testnetTokenAddress
		: mainnetTokenAddress
export const contractAddress =
	network.toString() === Network.Localnet
		? localnetContractAddress
		: network.toString() === Network.Testnet
		? testnetContractAddress
		: mainnetContractAddress

export const chain =
	network.toString() === Network.Localnet
		? localChain
		: network.toString() === Network.Testnet
		? testChain
		: mainChain

const networkish: ethers.Networkish = {
	name: chain.name,
	chainId: chain.id,
	//layerOneConnection?: Provider,
	// ensAddress?: string,
	// ensNetwork?: number
}

export const provider = new ethers.JsonRpcProvider(
	chain.rpcUrls.default.http.toString(),
	networkish,
)

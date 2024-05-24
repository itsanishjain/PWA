import dropletContract from '@/SC-Output/out/Droplet.sol/Droplet.json'
import poolContract from '@/SC-Output/out/Pool.sol/Pool.json'
import { Interface, ethers } from 'ethers'
import { defineChain } from 'viem'
import { base, baseSepolia } from 'viem/chains'

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

export const localnetTokenAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
export const localnetContractAddress =
	'0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'

export const testnetTokenAddress = '0xfD2Ec58cE4c87b253567Ff98ce2778de6AF0101b'
export const testnetContractAddress =
	'0xDe54beB534EfB7Da0bA8116DD44926CfB3E1d1F4'

export const testnetDropletClaimContractAddress =
	'0x7f0668B813a960AAd9E56C4870131dB6314819eB'

export const mainnetTokenAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
export const mainnetContractAddress =
	'0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'

export enum Network {
	Mainnet = 'Mainnet',
	Testnet = 'Testnet',
	Localnet = 'Localnet',
}

export const network: Network =
	process.env.NEXT_PUBLIC_ENV === 'production'
		? Network.Mainnet
		: Network.Testnet

const config = {
	[Network.Localnet]: {
		tokenAddress: localnetTokenAddress,
		contractAddress: localnetContractAddress,
		chain: localChain,
	},
	[Network.Testnet]: {
		tokenAddress: testnetTokenAddress,
		contractAddress: testnetContractAddress,
		chain: testChain,
	},
	[Network.Mainnet]: {
		tokenAddress: mainnetTokenAddress,
		contractAddress: mainnetContractAddress,
		chain: mainChain,
	},
}

export const tokenAddress = config[network].tokenAddress
export const contractAddress = config[network].contractAddress
export const chain = config[network].chain
const networkish: ethers.Networkish = {
	name: chain.name,
	chainId: chain.id,
}

export const provider = new ethers.JsonRpcProvider(
	chain.rpcUrls.default.http.toString(),
	networkish,
)

export const jwtExpiryDurationInDays = 7
export const jwtDuration = 60 * 60 * 24 * jwtExpiryDurationInDays // Given in seconds

export const dropletIFace = new Interface(dropletContract.abi)
export const poolIFace = new Interface(poolContract.abi)

import { Abi, Address } from 'viem'

export type ContractCall = {
    address: Address
    abi: Abi
    functionName: string
    args: unknown[] // ContractFunctionArgs[]
}

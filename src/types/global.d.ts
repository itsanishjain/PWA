import { poolAbi, poolAddress } from './contracts'

declare global {
    type LayoutWithSlots<T extends string> = {
        [K in T]: React.ReactNode
    }

    type ChainId = keyof typeof poolAddress
}

export {}

import 'server-only'
import { cache } from 'react'

import { getAddressBalance } from '../../persistence/users/blockchain/get-address-balance'

export const getAddressBalanceUseCase = cache(
    async (address: string): Promise<{ balance: bigint; symbol: string; decimals: number } | null> => {
        return getAddressBalance(address)
    },
)

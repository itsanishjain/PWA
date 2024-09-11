import 'server-only'

import { getAddressBalance } from '../../persistence/users/blockchain/get-address-balance'
import type { Address } from 'viem'
import { TokenBalance } from '@/app/pwa/_lib/entities/models/token-balance'

export const getAddressBalanceUseCase = async (address: Address): Promise<TokenBalance | undefined> => {
    return getAddressBalance(address)
}

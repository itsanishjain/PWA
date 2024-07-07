import 'server-only'

import { getAddressBalance } from '../../persistence/users/blockchain/get-address-balance'

export async function getAddressBalanceUseCase(
    address: string,
): Promise<{ balance: bigint; symbol: string; decimals: number } | null> {
    return getAddressBalance(address)
}

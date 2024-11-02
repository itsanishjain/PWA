import { useFundWallet } from '@privy-io/react-auth'
import { useUserInfo } from '@/hooks/use-user-info'
import { base } from 'viem/chains'

const MINIMUM_ONRAMP_AMOUNT = 35 // minimum for moonpay is $32.26

export function useOnRamp() {
    const { fundWallet } = useFundWallet()
    const { data: userInfo } = useUserInfo()

    const handleOnRamp = async (amount?: number) => {
        const address = userInfo?.address
        const onrampAmount = amount ? Math.max(amount, MINIMUM_ONRAMP_AMOUNT) : MINIMUM_ONRAMP_AMOUNT

        if (!address) {
            console.error('Cannot initiate onramp, user address not found')
            return
        }

        try {
            await fundWallet(address, {
                chain: base,
                amount: onrampAmount.toString(),
                config: {
                    currencyCode: 'USDC_BASE',
                    quoteCurrencyAmount: onrampAmount,
                    paymentMethod: 'credit_debit_card',
                    uiConfig: { accentColor: '#5472E9' },
                },
            })
            return true
        } catch (error) {
            console.error('Error initiating onramp:', error)
            return false
        }
    }

    return {
        handleOnRamp,
    }
}

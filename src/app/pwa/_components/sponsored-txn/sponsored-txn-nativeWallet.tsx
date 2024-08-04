import { useEffect, useState } from 'react'

import { useWallets } from '@privy-io/react-auth'
import { useSetActiveWallet } from '@privy-io/wagmi'

import { ENTRYPOINT_ADDRESS_V06, createSmartAccountClient, walletClientToSmartAccountSigner } from 'permissionless'
import { signerToSimpleSmartAccount } from 'permissionless/accounts'
import { createPimlicoPaymasterClient } from 'permissionless/clients/pimlico'

import { http } from 'viem'
import { baseSepolia } from 'viem/chains'
import { usePublicClient, useWalletClient } from 'wagmi'

import { toast } from 'sonner'
import { Button } from '../ui/button'

export default function SponsoredTxn() {
    const { wallets } = useWallets()
    const embeddedWallet = wallets.find(wallet => wallet.walletClientType === 'privy')
    const { setActiveWallet } = useSetActiveWallet()
    const publicClient = usePublicClient()
    const { data: walletClient } = useWalletClient()
    const paymasterClient = createPimlicoPaymasterClient({
        transport: http(process.env.NEXT_PUBLIC_COINBASE_PAYMASTER_URL),
        entryPoint: ENTRYPOINT_ADDRESS_V06,
    })
    const [txHash, setTxHash] = useState<string | null>(null)

    useEffect(() => {
        if (embeddedWallet) {
            void setActiveWallet(embeddedWallet)
            console.log(process.env.NEXT_PUBLIC_COINBASE_PAYMASTER_URL)
        }
    }, [embeddedWallet, setActiveWallet])

    const onSendTransaction = async () => {
        if (!walletClient || !publicClient) {
            toast('No wallet client or public client found!')
            return
        }

        const signer = walletClientToSmartAccountSigner(walletClient)

        const simpleSmartAccountClient = await signerToSimpleSmartAccount(publicClient, {
            entryPoint: ENTRYPOINT_ADDRESS_V06,
            signer: signer,
            factoryAddress: '0x9406Cc6185a346906296840746125a0E44976454',
        })

        const smartAccountClient = createSmartAccountClient({
            account: simpleSmartAccountClient,
            chain: baseSepolia,
            bundlerTransport: http(process.env.NEXT_PUBLIC_COINBASE_PAYMASTER_URL),
            middleware: {
                sponsorUserOperation: paymasterClient.sponsorUserOperation, // optional
            },
        })

        const txHash = await smartAccountClient.sendTransaction({
            account: smartAccountClient.account.address,
            to: '0xbE92f2692f42580300fD8d0Ee198b5bBbe303e78',
            data: '0x1234567890',
            value: 0n,
        })
        console.log('✅ Transaction successfully sponsored!')
        console.log(`🔍 View on BaseScan: https://sepolia.basescan.org/tx/${txHash}`)
        setTxHash(txHash)
    }

    return (
        <>
            <Button onClick={() => void onSendTransaction()}>Sponsor Transaction</Button>
            {txHash && (
                <div>
                    <p>✅ Transaction successfully sponsored!</p>
                    <p>
                        🔍 View on Etherscan:{' '}
                        <a
                            href={`https://sepolia.basescan.org/tx/${txHash}`}
                            target='_blank'
                            rel='external noopener noreferrer nofollow'>
                            Transaction Link
                        </a>
                    </p>
                </div>
            )}
        </>
    )
}

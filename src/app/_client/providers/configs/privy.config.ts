'use client'

import logo from '@/public/app/images/pool-logo-horizontal.png'
import type { PrivyProviderProps } from '@privy-io/react-auth'
import { base, baseSepolia } from 'viem/chains'

if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID) {
    throw new Error('Missing NEXT_PUBLIC_PRIVY_APP_ID')
}

export default {
    appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
    config: {
        appearance: {
            theme: 'light',
            accentColor: '#1364DA',
            logo: logo.src,
            landingHeader: 'Log in or sign up to continue',
            loginMessage: 'Pooling funds made simple.',
            showWalletLoginFirst: true,
            walletList: ['coinbase_wallet', 'detected_wallets', 'metamask', 'rainbow', 'wallet_connect'],
        },
        externalWallets: {
            coinbaseWallet: {
                // Valid connection options include 'eoaOnly' (default), 'smartWalletOnly', or 'all'
                connectionOptions: 'all',
            },
        },
        supportedChains: [base],
        defaultChain: base,
        legal: {
            privacyPolicyUrl: '/privacy-policy',
            termsAndConditionsUrl: '/terms',
        },
        // walletConnectCloudProjectId: '',
        // captchaEnabled: false,
        // customAuth: {
        //     getCustomAccessToken: async () => '',
        //     isLoading: false
        // },
        // embeddedWallets: {
        //     createOnLogin: 'users-without-wallets',
        //     noPromptOnSignature: true,
        //     priceDisplay: {
        //         primary: 'native-token',
        //         secondary: '',
        //     },
        // },
        loginMethodsAndOrder: {
            primary: ['coinbase_wallet', 'detected_wallets', 'metamask'],
            overflow: ['rainbow', 'wallet_connect'],
        },
        // fiatOnRamp: { useSandbox: true },
        // loginMethods: []
    },
} satisfies Omit<PrivyProviderProps, 'children'>

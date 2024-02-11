import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import '@/styles/globals.css'
import { PrivyProvider } from '@privy-io/react-auth'
import { base, baseGoerli, mainnet, goerli } from 'viem/chains'
import { localChain } from 'constants/constant'

export default function App({ Component, pageProps }: AppProps) {
	return (
		<PrivyProvider
			appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
			// onSuccess={handleLogin}
			config={{
				loginMethods: ['google', 'wallet', 'farcaster'],
				appearance: {
					theme: 'light',
					accentColor: '#676FFF',
					logo: '/images/pool.png',
					showWalletLoginFirst: false,
				},
				embeddedWallets: {
					createOnLogin: 'users-without-wallets',
				},
				defaultChain: localChain,
				supportedChains: [base, baseGoerli, mainnet, goerli, localChain],
			}}
		>
			<ThemeProvider
				attribute='class'
				defaultTheme='system'
				disableTransitionOnChange
			>
				<Component {...pageProps} />
			</ThemeProvider>
		</PrivyProvider>
	)
}

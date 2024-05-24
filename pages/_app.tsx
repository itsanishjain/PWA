import { Toaster } from '@/components/ui/toaster'
import { config } from '@/constants/config'
import { chain } from '@/constants/constant'
import '@/styles/globals.css'
import { PrivyProvider } from '@privy-io/react-auth'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useState } from 'react'
import { base, baseGoerli, baseSepolia, goerli, mainnet } from 'viem/chains'
import { WagmiProvider } from 'wagmi'

export default function App({ Component, pageProps }: AppProps) {
	const [queryClient] = useState(() => new QueryClient())

	return (
		<>
			<Head>
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1, user-scalable=0, viewport-fit=cover'
				/>
			</Head>

			<PrivyProvider
				appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
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
						priceDisplay: {
							primary: 'native-token',
							secondary: null,
						},
					},
					defaultChain: chain,
					supportedChains: [
						base,
						baseSepolia,
						baseGoerli,
						mainnet,
						goerli,
						chain,
					],
					fiatOnRamp: { useSandbox: true },
				}}
			>
				<WagmiProvider config={config}>
					<QueryClientProvider client={queryClient}>
						<ThemeProvider
							attribute='class'
							defaultTheme='system'
							disableTransitionOnChange
						>
							<Component {...pageProps} />
							<Toaster />
						</ThemeProvider>
					</QueryClientProvider>
				</WagmiProvider>
			</PrivyProvider>
		</>
	)
}

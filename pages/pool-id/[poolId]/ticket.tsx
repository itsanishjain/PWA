import Appbar from '@/components/appbar'
import Page from '@/components/page'
import Section from '@/components/section'
import { fetchAllPoolDataFromDB } from '@/lib/api/clientAPI'
import { Database } from '@/types/supabase'
import { useWallets } from '@privy-io/react-auth'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import QRCode from 'react-qr-code'
export type PoolRow = Database['public']['Tables']['pool']['Row']
export type UserDisplayRow = Database['public']['Tables']['usersDisplay']['Row']

const TicketPage = () => {
	const [poolDbData, setPoolDbData] = useState<any>()
	const [, setPageUrl] = useState('')
	const router = useRouter()
	const { wallets } = useWallets()

	const poolId = router?.query?.poolId
	const { data: poolDBInfo } = useQuery({
		queryKey: ['fetchAllPoolDataFromDB', poolId?.toString() ?? ' '],
		queryFn: fetchAllPoolDataFromDB,
		enabled: !!poolId,
	})

	useEffect(() => {
		setPoolDbData(poolDBInfo?.poolDBInfo)

		setPageUrl(window?.location.href)
	}, [poolDBInfo])

	const parentRoute = useMemo(() => {
		const paths = router.asPath.split('/')
		paths.pop() // Remove the last sub-route
		return paths.join('/')
	}, [router.asPath])

	return (
		<Page>
			<Appbar backRoute={`${parentRoute}`} pageTitle='Ticket' />
			<Section>
				<div className='flex w-full flex-col '>
					<div className='relative flex min-h-screen w-full flex-col justify-start space-y-0 pb-20 pt-16 md:pb-24'>
						<h2 className='text-center text-2xl'>{poolDbData?.pool_name}</h2>
						<div className='flex w-full flex-1 flex-col items-center justify-center'>
							<div className='cardBackground flex w-full max-w-lg rounded-3xl p-12'>
								{wallets.length > 0 && (
									<QRCode
										size={256}
										style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
										value={JSON.stringify({
											address: wallets?.[0]?.address,
											poolId: poolId,
										})}
										viewBox={`0 0 256 256`}
									/>
								)}
							</div>
						</div>
					</div>
				</div>
			</Section>
		</Page>
	)
}

export default TicketPage

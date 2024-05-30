import Appbar from '@/components/appbar'
import Page from '@/components/page'
import Section from '@/components/section'
import { useToast } from '@/components/ui/use-toast'
import { useCookie } from '@/hooks/cookie'
import { fetchAdminUsersFromServer, handleCheckIn } from '@/lib/api/clientAPI'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useQuery } from '@tanstack/react-query'
import router from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import { QrReader } from 'react-qr-reader'

const ScanQR: React.FC = () => {
	const [qrData, setQRData] = useState<string>('')

	const [parentRoute, setParentRoute] = useState<string>('')
	const { currentJwt } = useCookie()
	const { toast } = useToast()

	const { ready, authenticated, user, signMessage, sendTransaction, logout } =
		usePrivy()

	const { wallets, ready: walletsReady } = useWallets()

	const handleScan = async (data: string | null) => {
		if (data) {
			setQRData(data)
			const dataObj = JSON.parse(data)
			// Send data to server for updating database
			const result = await handleCheckIn({ data: data, jwt: currentJwt ?? '' })
			console.log('checkin result', result)
			if (result.message == 'Success') {
				toast({
					title: 'Success',
					description: `Checked In ${dataObj?.address}`,
				})
			} else {
				toast({
					title: 'Failure',
					description: `Something went wrong. Please try again later.`,
				})
			}
		}
	}

	const handleError = (err: any) => {
		console.error(err)
	}

	const { isSuccess: fetchAdminUsersSuccess, data: adminUsers } = useQuery({
		queryKey: ['fetchAdminUsersFromServer'],
		queryFn: fetchAdminUsersFromServer,
	})

	useEffect(() => {
		const paths = router?.asPath.split('/')
		paths.pop() // Remove the last sub-route
		setParentRoute(paths.join('/'))

		if (fetchAdminUsersSuccess && ready && authenticated && walletsReady) {
			const isAddressInList = adminUsers?.some(
				(user) =>
					user.address?.toLowerCase() === wallets?.[0]?.address?.toLowerCase(),
			)
			console.log('adminUsersData', adminUsers)
			console.log('walletAddress', wallets?.[0]?.address?.toLowerCase())

			if (!isAddressInList) {
				router.push('/')
			}
		}
	}, [router, walletsReady, fetchAdminUsersSuccess, ready, authenticated])

	return (
		<Page>
			<Appbar backRoute={`${parentRoute}`} pageTitle='Check In' />
			<Section>
				<div className='h-full w-full relative flex flex-col'>
					<QrReader
						className='w-full h-full'
						scanDelay={1000}
						onResult={(result, error) => {
							if (!!result) {
								setQRData(result?.getText())
								handleScan(result?.getText())
							}

							if (!!error) {
								console.info(error)
							}
						}}
						constraints={{ facingMode: 'environment' }}
					></QrReader>

					{/* <p>Scanned Data: {qrData}</p> */}
				</div>
			</Section>
		</Page>
	)
}

export default ScanQR

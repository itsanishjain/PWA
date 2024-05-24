import Appbar from '@/components/appbar'
import Page from '@/components/page'
import Section from '@/components/section'
import { useToast } from '@/components/ui/use-toast'
import { useCookie } from '@/hooks/cookie'
import { handleCheckIn } from '@/lib/api/clientAPI'
import router from 'next/router'
import React, { useEffect, useState } from 'react'
import { QrReader } from 'react-qr-reader'

const ScanQR: React.FC = () => {
	const [, setQRData] = useState<string>('')

	const [parentRoute, setParentRoute] = useState<string>('')
	const { currentJwt } = useCookie()
	const { toast } = useToast()

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

	useEffect(() => {
		const paths = router?.asPath.split('/')
		paths.pop() // Remove the last sub-route
		setParentRoute(paths.join('/'))
	}, [router])

	return (
		<Page>
			<Appbar backRoute={`${parentRoute}`} pageTitle='Check In' />
			<Section>
				<div className='relative flex size-full flex-col'>
					<QrReader
						className='size-full'
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
					/>
				</div>
			</Section>
		</Page>
	)
}

export default ScanQR

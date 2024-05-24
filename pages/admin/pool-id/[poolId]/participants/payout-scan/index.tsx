import Appbar from '@/components/appbar'
import Page from '@/components/page'
import Section from '@/components/section'
import router from 'next/router'
import { useEffect, useState } from 'react'
import { QrReader } from 'react-qr-reader'

const ScanQR: React.FC = () => {
	const [, setQRData] = useState<string>('')

	const [parentRoute, setParentRoute] = useState<string>('')

	const handleScan = (data: string | null) => {
		if (data) {
			setQRData(data)

			try {
				const dataObj = JSON.parse(data)
				router.push(
					`/admin/pool-id/${dataObj?.poolId}/participants/${dataObj?.address}`,
				)
			} catch (error) {
				throw error
			}
		}
	}

	useEffect(() => {
		const paths = router?.asPath.split('/')
		paths.pop() // Remove the last sub-route
		setParentRoute(paths.join('/'))
	}, [])

	return (
		<Page>
			<Appbar backRoute={`${parentRoute}`} pageTitle='Scan to Payout' />
			<Section>
				<div className='relative flex size-full flex-col'>
					<QrReader
						className='size-full'
						scanDelay={1000}
						onResult={(result, error) => {
							if (result) {
								setQRData(result.getText())
								handleScan(result.getText())
							}

							if (error) {
								throw error
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

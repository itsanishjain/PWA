import Page from '@/components/page'
import Section from '@/components/section'
import Image from 'next/image'
import poolWallet from '@/public/images/pool_wallet.png'
import walletConnect from '@/public/images/WalletConnect.png'
import metamask from '@/public/images/MetaMask.png'
import coinbase from '@/public/images/Coinbase.png'

const WalletSelection = () => (
	<Page>
		<Section>
			<div className='flex justify-center h-full w-full items-center'>
				<div className='flex flex-col w-96 h-96'>
					<div className='flex row items-center w-full'>
						<Image className='mx-auto' src={poolWallet} alt='pool image' />
					</div>
					<h2 className='text-xl font-bold text-zinc-800 tagline-text text-center align-top w-full mt-28'>
						Select your wallet
					</h2>

					<div className='flex row justify-between items-center h-full w-full mt-28 '>
						<div className='flex-col justify-center items-center align-middle'>
							<button className='flex mx-auto rounded-full h-20 w-20 bg-slate-100'>
								<Image
									className='m-auto'
									src={walletConnect}
									alt='WalletConnect'
								/>
							</button>
							<p className='text-center'>WalletConnect</p>
						</div>
						<div className='flex-col justify-center items-center align-middle'>
							<button className='flex mx-auto rounded-full h-20 w-20 bg-slate-100'>
								<Image className='m-auto' src={metamask} alt='Metamask' />
							</button>

							<p className='text-center'>Metamask</p>
						</div>
						<div className='flex-col justify-center items-center align-middle'>
							<button className='flex mx-auto rounded-full h-20 w-20 bg-slate-100'>
								<Image className='m-auto' src={coinbase} alt='Coinbase' />
							</button>
							<p className='text-center'>Coinbase</p>
						</div>
					</div>
				</div>
			</div>
		</Section>
	</Page>
)

export default WalletSelection

import Page from '@/components/page'
import Section from '@/components/section'
import Image from 'next/image'
import poolBackgroundImage from '@/public/images/homeBackground.png'

import { useRouter } from 'next/router'
import {
	UnsignedTransactionRequest,
	usePrivy,
	useWallets,
} from '@privy-io/react-auth'

import React, { useState, useEffect } from 'react'

import { ethers } from 'ethers'
import Appbar from '@/components/appbar'

import { Inter } from 'next/font/google'
import { Comfortaa } from 'next/font/google'

import styles from './styles/index.module.css'
import PoolRow from '@/components/poolRow'
import UpcomingPoolTab from '@/components/tabs/UpcomingPoolTab'
import PastPoolTab from '@/components/tabs/PastPoolTab'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })
const comfortaa = Comfortaa({ subsets: ['latin'] })

const Home = () => {
	const router = useRouter()

	return (
		<div
			className={`flex min-h-screen w-full h-full bg-cover bg-center relative ${inter.className}`}
			style={{
				backgroundImage: `url(${poolBackgroundImage.src})`,
			}}
		>
			<div className='flex flex-grow-1 w-full'>
				<div className='flex flex-col w-full h-full justify-center items-center space-y-12'>
					<div className='w-full md:h-48 h-32 text-center flex flex-col space-y-8'>
						<h1 className={`${comfortaa.className} text-8xl text-white`}>
							pool
						</h1>
					</div>
					<p className='text-white px-12'>
						An application that allows users to pool funds together for Web3.
					</p>
					<Link
						href='/'
						className='text-white outline-1 outline rounded-full px-16 py-2'
					>
						Enter
					</Link>
				</div>
			</div>
			<div className='absolute bottom-0 flex flex-row text-white justify-between w-full text-lg'>
				<Link href='/privacy' className='py-2 px-4'>
					{' '}
					Privacy
				</Link>
				<Link href='/terms' className='py-2 px-4'>
					{' '}
					Terms
				</Link>
			</div>
		</div>
	)
}

export default Home

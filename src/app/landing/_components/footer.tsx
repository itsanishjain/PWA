import { comfortaa } from '@/lib/utils/fonts'
import route from '@/lib/utils/routes'
import emailIcon from '@/public/landing/icons/email-icon.png'
import githubLogo from '@/public/landing/icons/logos/github-logo.png'
import xLogo from '@/public/landing/icons/logos/x-logo.png'
import type { Route } from 'next'
import Image from 'next/image'
import Link from 'next/link'

const socialsContent = [
    {
        image: emailIcon,
        alt: 'Email Icon',
        link: 'dev@poolparty.cc',
        type: 'email',
    },
    {
        image: githubLogo,
        alt: 'Image for joining a pool',
        link: 'https://www.github.com/poolpartycc',
        type: 'link',
    },
    {
        image: xLogo,
        alt: 'Image for enjoy and connect',
        link: 'https://x.com/poolparty',
        type: 'link',
    },
]

export default function Footer() {
    return (
        <section className='w-full bg-white px-4 sm:px-8 md:px-14'>
            <footer className='flex w-full flex-col space-y-6 rounded-t-[40px] bg-[#1B1818] px-4 pb-6 pt-[30px] text-white sm:rounded-t-[60px] sm:px-8 sm:pt-[45px] md:rounded-t-[78px] md:px-[80px] md:pt-[60px]'>
                <div className={`${comfortaa.className} w-full`}>
                    <p className='text-4xl font-semibold text-[#FFBFB1] sm:text-5xl md:text-[72px]'>pool</p>
                </div>
                <div className='flex flex-col justify-between space-y-6 sm:flex-row sm:space-y-0'>
                    <div className='text-base font-semibold sm:text-lg md:text-2xl'>
                        Pooling funds <br />
                        made simple
                    </div>
                    <ul className='flex flex-wrap gap-x-4 gap-y-2 text-xs sm:text-sm'>
                        <li className='w-1/2 sm:w-auto'>
                            <Link href={route['/']}>Overview</Link>
                        </li>
                        <li className='w-1/2 sm:w-auto'>
                            <Link href={route['/']}>FAQs</Link>
                        </li>
                        <li className='w-1/2 sm:w-auto'>
                            <Link href={route['/']}>Contracts</Link>
                        </li>
                        <li className='w-1/2 sm:w-auto'>
                            <Link href='mailto:dev@poolparty.cc'>Support</Link>
                        </li>
                        <li className='w-1/2 sm:w-auto'>
                            <Link href={route['/']}>How it works</Link>
                        </li>
                        <li className='w-1/2 sm:w-auto'>
                            <Link href={route['/']}>Contact Us</Link>
                        </li>
                    </ul>
                </div>
                <ul className='flex h-6 flex-row space-x-4 sm:space-x-6'>
                    {socialsContent.map((social, index) => {
                        const linkHref = (social.type == 'link' ? social.link : `mailto:${social.link}`) as Route

                        return (
                            <li className='relative size-5 sm:size-6' key={index}>
                                <Link href={linkHref} className='size-full' passHref legacyBehavior>
                                    <a rel='external noopener noreferrer nofollow' target='_blank'>
                                        <Image
                                            src={social.image}
                                            fill={true}
                                            alt={social.alt}
                                            className='object-contain object-center'
                                        />
                                    </a>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
                <div className='footerDivider w-full' />
                <div className='flex flex-col items-center space-y-2 text-[10px] sm:flex-row sm:space-x-4 sm:space-y-0 sm:text-xs md:space-x-12'>
                    <span>{new Date().getFullYear()} MIT Licensed - All rights reserved - Pool</span>
                    <Link href={'/privacy-policy' as Route}>Privacy</Link>
                    <Link href={'/terms' as Route}>Terms</Link>
                </div>
            </footer>
        </section>
    )
}

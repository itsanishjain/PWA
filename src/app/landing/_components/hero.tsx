import getAppUrl from '@/lib/utils/get-app-url'
import route from '@/lib/utils/routes'
import poolEvent from '@/public/landing/images/pool-event.png'
import poolHeroBg from '@/public/landing/images/pool-hero-bg.png'
import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
    return (
        <>
            <div className='absolute inset-0 -z-10 h-3/5'>
                <Image
                    src={poolHeroBg}
                    alt='pool background'
                    fill
                    quality={100}
                    sizes='100vw'
                    priority
                    className='w-full object-cover'
                />
            </div>
            <section className='container pb-36 pt-16 lg:pt-36'>
                <div className='flex flex-col gap-10 text-zinc-100 lg:flex-row lg:gap-0'>
                    <div className='flex flex-col justify-center gap-4'>
                        <h1 className='text-4xl font-black uppercase tracking-tighter lg:text-7xl'>
                            Pooling funds
                            <span className='hidden h-0 sm:block'>
                                <br />
                            </span>{' '}
                            made simple
                        </h1>

                        <p className='text-xl font-semibold'>
                            Effortlessly create, fund, and manage your own &apos;Pool parties.&apos;
                            <br />
                            Enjoy a seamless and fun event planning experience.
                        </p>
                        <div className='inline-flex flex-col items-center gap-2 text-nowrap text-base font-semibold *:w-1/2 md:flex-row md:items-start'>
                            <Link
                                href={getAppUrl('/')}
                                className='rounded-full bg-zinc-100/90 py-3 text-center font-semibold text-black transition duration-300 md:px-10'>
                                Get Started
                            </Link>
                            <Link
                                href={route['/terms']}
                                className='rounded-full py-3 text-center font-semibold transition duration-300 hover:text-opacity-90 md:px-10'>
                                <span className='hidden sm:inline'>Terms and conditions</span>
                                <span className='sm:hidden'>Terms</span>
                            </Link>
                        </div>
                    </div>
                    <div className='flex w-full justify-center md:w-1/2 lg:justify-end'>
                        <Image
                            className='h-full w-4/5 object-contain'
                            src={poolEvent.src}
                            width={498}
                            height={666}
                            quality={100}
                            sizes='100vw'
                            loading='eager'
                            alt='Screenshot of the Pool Party app'
                            priority
                        />
                    </div>
                </div>
            </section>
        </>
    )
}

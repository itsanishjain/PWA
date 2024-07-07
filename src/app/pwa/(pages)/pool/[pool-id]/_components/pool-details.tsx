import { Button } from '@/app/pwa/_components/ui/button'
import { Progress } from '@/app/pwa/_components/ui/progress'
import { getFormattedEventTime } from '@/app/pwa/_lib/utils/get-relative-date'
import frog from '@/public/app/images/frog.png'
import { CheckCircleIcon, ChevronRightIcon, ExternalLinkIcon } from 'lucide-react'
import type { Route } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { FiEdit } from 'react-icons/fi'
import { MdIosShare, MdOutlineQrCode } from 'react-icons/md'
import type { PoolDetailsDTO } from '../_lib/definitions'
import Avatars from './avatars'

const avatarUrls = new Array(4).fill(frog.src)

export default function PoolDetails({ pool }: { pool: PoolDetailsDTO }) {
    return (
        <div className='space-y-3 bg-white p-2'>
            <section className='detail_card rounded-[2.875rem] p-[1.12rem]'>
                <div className='detail_card_banner relative overflow-hidden'>
                    <Image src={pool.imageUrl} alt={pool.name} fill className='object-cover' />
                    <div className='absolute right-4 top-8 flex h-full flex-col gap-[0.62rem]'>
                        <div className='items-center justify-center rounded-full bg-black/40 p-1.5'>
                            <MdOutlineQrCode className='size-3.5 fill-white' />
                        </div>
                        <div className='items-center justify-center rounded-full bg-black/40 p-1.5'>
                            <MdIosShare className='size-3.5 fill-white' />
                        </div>
                        <div className='items-center justify-center rounded-full bg-black/40 p-1.5'>
                            <FiEdit className='size-3.5 stroke-white' />
                        </div>
                    </div>
                    <div className='detail_card_banner_status'>
                        {/* TODO: needs to show the actual status: Upcoming / Live / Ended with different color and text */}
                        <div className={'size-1.5 rounded-full bg-[#FF2113] md:size-3'} />
                        <div className='text-xs text-white md:text-base'>Live</div>
                    </div>
                </div>
                <div className='mb-[1.81rem] mt-[0.81rem] flex flex-col gap-[0.38rem]'>
                    <h1 className='text-[1.125rem] font-semibold'>{pool.name}</h1>
                    <h2 className='text-xs'>{getFormattedEventTime(pool.startDate, pool.endDate)}</h2>
                    {/*TODO: Needs to show the actual host, get the mainHost address and look for the user name for that address in the database */}
                    <h2 className='text-xs font-semibold'>Hosted by: Pool</h2>
                </div>

                {/* TODO: this section is only shown when the user has claimable winning from that pool (get from smart contract) */}
                <div className='mb-[1.12rem] flex flex-col gap-[0.38rem]'>
                    <div className='inline-flex w-full justify-between'>
                        <div className='inline-flex items-center gap-1'>
                            <CheckCircleIcon className='size-3 scale-95' />
                            <span className='text-xs font-semibold'>Winner</span>
                        </div>
                        <div className='text-xs'>Second place $200</div>
                    </div>
                    <Button className='detail_card_claim_button h-9 w-full text-[0.625rem] text-white'>
                        Claim winnings
                    </Button>
                </div>

                <div className='space-y-3 rounded-[2rem] bg-[#F4F4F4] p-5'>
                    <div className='space-y-2'>
                        <div className='inline-flex w-full justify-between'>
                            {/* TODO: needs to be calculated from the num_participants, price and softcap (total is price*softcap) and current is num_participant*softcap) */}
                            <div className='space-x-1 text-xs'>
                                <span className='font-bold'>$825</span>
                                <span>USDC</span>
                            </div>
                            <div className='text-xs'>Goal of $1,125 Prize Pool</div>
                        </div>
                        <Progress value={(825 / 1125) * 100} />
                    </div>
                    <div className='space-y-2'>
                        <div className='text-xs'>Participants</div>
                        <div className='inline-flex w-full items-center justify-between'>
                            {/* TODO: needs to show actual list of participants */}
                            <Avatars avatarUrls={avatarUrls} numPeople={47} />
                            {/* TODO: needs to be clickable and links to the pool/[poolId]/participants page */}
                            <ChevronRightIcon className='size-3.5' />
                        </div>
                    </div>
                </div>
            </section>

            <section className='detail_card space-y-6 rounded-[2.875rem] px-[1.12rem] py-6'>
                <div className='space-y-4'>
                    <div className='w-full border-b-[0.5px] pb-2 text-xs font-semibold'>Description</div>
                    <div>{pool.description}</div>
                </div>
                <div className='space-y-4'>
                    <div className='w-full border-b-[0.5px] pb-2 text-xs font-semibold'>Buy-In</div>
                    <div>
                        {pool.price}${pool.price}
                        {pool.tokenSymbol}
                    </div>
                </div>

                <div className='space-y-4'>
                    <div className='w-full border-b-[0.5px] pb-2 text-xs font-semibold'>Terms</div>

                    <Link href={pool.termsUrl as Route} passHref legacyBehavior>
                        <a target='_blank' rel='noopener noreferrer' className='self-center'>
                            <div className='mt-4 inline-flex w-full justify-between'>
                                {pool.termsUrl}
                                <ExternalLinkIcon className='size-4' />
                            </div>
                        </a>
                    </Link>
                </div>
            </section>
        </div>
    )
}

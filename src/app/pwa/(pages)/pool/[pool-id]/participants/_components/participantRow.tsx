import { useUserDetailsDB } from '@/app/pwa/_client/hooks/use-user-details'
import { Avatar, AvatarFallback, AvatarImage } from '@/app/pwa/_components/ui/avatar'
import { formatAddress } from '@/app/pwa/_lib/utils/addresses'
import route from '@/lib/utils/routes'
import { cn } from '@/lib/utils/tailwind'
import frog from '@/public/app/images/frog.png'
import Link from 'next/link'
import type { Address } from 'viem'

interface ParticipantRowProps {
    address: Address
    poolId: string
}

const ParticipantRow: React.FC<ParticipantRowProps> = (props: ParticipantRowProps) => {
    const { userDetailsDB } = useUserDetailsDB(props.address)
    const avatar = userDetailsDB?.usersDetail[0].avatar || frog.src
    const displayNameOrAddress = userDetailsDB?.usersDetail[0].displayName || formatAddress(props.address)

    return (
        <Link
            className={cn('bottom-2 flex flex-row space-x-4 border-b-[1px] border-[#E9F1F5] py-4')}
            // href={`/pool/${props.poolId}/participants/${props.address}`}>
            href={route['/pool/[pool-id]/participants/[participant-id]']}>
            <Avatar className='size-[48px]' aria-label='User Avatar'>
                {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
                <AvatarImage alt='User Avatar' src={avatar} />
                <AvatarFallback className='bg-[#d9d9d9]' />
            </Avatar>
            <div className='flex flex-1 flex-col'>
                <h4 className='overflow-hidden text-[12pt] font-medium text-black'>{displayNameOrAddress}</h4>
                <p className={`fontRegistered text-[10pt] text-[#6993FF]`}>Registered</p>
            </div>
        </Link>
    )
}

export default ParticipantRow

export enum ParticipantStatus {
    Unregistered = 0,
    Registered = 1,
    'Checked In' = 2,
}

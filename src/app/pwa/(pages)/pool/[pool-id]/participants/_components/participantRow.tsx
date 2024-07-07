interface ParticipantRowProps {
    address: string
    poolId: string
}

const ParticipantRow: React.FC<ParticipantRowProps> = (props: ParticipantRowProps) => {
    return <>In construction</>
    // const { userDetailsDB } = useUserDetailsDB(props.address)

    // return (
    //     <Link
    //         className='bottomDivider flex flex-row space-x-4 py-4'
    //         href={`/pool/${props.poolId}/participants/${props.address}`}>
    //         <Avatar className='size-[73px]' aria-label='User Avatar'>
    //             <AvatarImage alt='User Avatar' src={userDetailsDB?.userDetail?.avatar ?? frog.src} />
    //             <AvatarFallback className='bg-[#d9d9d9]' />
    //         </Avatar>
    //         <div className='flex flex-1 flex-col'>
    //             <h4 className='overflow-hidden text-lg font-medium text-black'>
    //                 {userDetailsDB?.userDetail?.displayName ?? formatAddress(props.address)}
    //             </h4>
    //             <p className={`fontRegistered text-[#6993FF]`}>Registered</p>
    //         </div>
    //     </Link>
    // )
}

export default ParticipantRow

export enum ParticipantStatus {
    Unregistered = 0,
    Registered = 1,
    'Checked In' = 2,
}

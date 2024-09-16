export default function ClaimablePrizes() {
    return (
        <section className='detail_card flex w-full flex-col gap-[0.69rem] rounded-3xl p-6'>
            <h1 className='w-full border-b pb-2 text-[0.6875rem] font-semibold'>Claimable Winnings</h1>
            <div>
                <div className='text-xs'>No winnings available to claim.</div>
            </div>
        </section>
    )
}

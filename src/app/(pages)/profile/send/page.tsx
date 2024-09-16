import AmountSection from './_components/amount-section'
import ProfileBalanceSection from './_components/balance-section'

export default function ProfileLayout() {
    return (
        <div className='flex flex-1 flex-col gap-6'>
            <ProfileBalanceSection />
            <AmountSection />
        </div>
    )
}

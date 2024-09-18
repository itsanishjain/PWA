import NumberTicker from '@/app/_components/ui/number-ticker'

export default function FormattedBalance({
    integerPart,
    fractionalPart,
    symbol = '',
}: {
    integerPart: number
    fractionalPart: number
    symbol?: string
}) {
    return (
        <>
            <span>
                <span className='text-4xl text-neutral-300'>$</span>
                <NumberTicker value={integerPart} className='text-4xl' />
                <span>.</span>
                <NumberTicker value={fractionalPart} className='text-2xl text-neutral-500' padding={2} />
            </span>
            <span className='ml-2 text-sm text-neutral-800'>{symbol}</span>
        </>
    )
}

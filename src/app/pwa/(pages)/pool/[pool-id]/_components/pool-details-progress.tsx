import { Progress } from '@/app/pwa/_components/ui/progress'

interface PoolDetailsProgressProps {
    current: number
    goal: number
}

export default function PoolDetailsProgress({ current, goal }: PoolDetailsProgressProps) {
    return (
        <div className='space-y-2'>
            <div className='inline-flex w-full justify-between'>
                <div className='space-x-1 text-xs'>
                    <span className='font-bold'>{`$${current}`}</span>
                    <span>USDC</span>
                </div>
                <div className='text-xs'>{`Goal of $${goal} Prize Pool`}</div>
            </div>
            <Progress value={(current / goal) * 100} />
        </div>
    )
}

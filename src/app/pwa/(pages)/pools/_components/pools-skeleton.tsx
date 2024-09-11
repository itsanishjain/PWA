import { Skeleton } from '@/app/pwa/_components/ui/skeleton'

export default function PoolSkeleton({ title, length }: { title: string; length: number }) {
    return (
        <>
            <h1 className='animate-pulse text-lg font-semibold'>{title}</h1>
            <div className='mt-3 flex size-full grow flex-col space-y-4'>
                {Array.from({ length }, (_, index) => (
                    <Skeleton
                        key={index}
                        className='flex h-24 items-center gap-[14px] rounded-[2rem] bg-[#f4f4f4] p-3 pr-4'>
                        <Skeleton className='size-[72px] rounded-[16px] bg-[#36a0f7]/20' />
                        <div className='flex flex-col gap-[5px]'>
                            <Skeleton className='h-4 w-10 bg-[#36a0f7]/20' />
                            <Skeleton className='h-4 w-16 bg-[#36a0f7]/20' />
                            <Skeleton className='h-4 w-28 bg-[#36a0f7]/20' />
                        </div>
                    </Skeleton>
                ))}
            </div>
        </>
    )
}

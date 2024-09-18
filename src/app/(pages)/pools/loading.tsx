import { LoaderIcon } from 'lucide-react'

export default function PoolsLoader() {
    return (
        <div className='flex flex-1 items-center justify-center'>
            <LoaderIcon className='animate-spin' />
        </div>
    )
}

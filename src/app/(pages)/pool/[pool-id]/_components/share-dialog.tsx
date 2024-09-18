import useMediaQuery from '@/app/_client/hooks/use-media-query'
import Divider from '@/app/_components/divider'
import { Button } from '@/app/_components/ui/button'
import { Dialog } from '@/app/_components/ui/dialog'
import { Drawer } from '@/app/_components/ui/drawer'
import { Input } from '@/app/_components/ui/input'
import { cn } from '@/lib/utils/tailwind'
import _ from 'lodash'
import { ShareIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import QRCode from 'react-qr-code'
import { toast } from 'sonner'

interface ShareDialogProps {
    open?: boolean
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

const ShareDialog = ({ open, setOpen }: ShareDialogProps) => {
    const isDesktop = useMediaQuery('(min-width: 768px)')
    const [pageUrl, setPageUrl] = useState('')
    const params = useParams<{ poolId: string }>()
    const poolId = params?.poolId || '0'

    useEffect(() => {
        setPageUrl(window?.location?.href.replace('admin/', ''))
    }, [])

    const handleShare = useCallback(async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Share Pool',
                    text: 'Check out this pool!',
                    url: pageUrl,
                })
                toast('Shared successfully')
            } catch (error) {
                console.error('Error sharing:', error)
                toast('Failed to share')
            }
        } else {
            setOpen?.(true)
        }
    }, [pageUrl, setOpen])

    const ShareButton = (
        <button
            onClick={handleShare}
            type='button'
            title='Share with Friends'
            className='relative size-8 rounded-full bg-black/40 p-2 md:size-14 md:p-3'>
            <ShareIcon className='size-8' />
        </button>
    )

    const ShareContent = <ShareForm pageUrl={pageUrl} poolId={poolId} />

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <Dialog.Trigger asChild>{ShareButton}</Dialog.Trigger>
                <Dialog.Content className='sm:max-w-[425px]'>
                    <Dialog.Header>
                        <Dialog.Title>Share with Friends</Dialog.Title>
                        <Dialog.Description>
                            Invites are best attended with friends. The more the merrier.
                        </Dialog.Description>
                    </Dialog.Header>
                    {ShareContent}
                </Dialog.Content>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <Drawer.Trigger asChild>{ShareButton}</Drawer.Trigger>
            <Drawer.Content>
                <Drawer.Header className='text-left'>
                    <Drawer.Title>Share with Friends</Drawer.Title>
                    <Drawer.Description>
                        Invites are best attended with friends. The more the merrier.
                    </Drawer.Description>
                </Drawer.Header>
                {ShareContent}
                <Drawer.Footer className='pt-2'>
                    <Drawer.Close asChild>
                        <Button variant='outline'>Cancel</Button>
                    </Drawer.Close>
                </Drawer.Footer>
            </Drawer.Content>
        </Drawer>
    )
}

interface ShareFormProps {
    pageUrl: string
    poolId: string
    className?: string
}

function ShareForm({ pageUrl, poolId, className }: ShareFormProps) {
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(pageUrl)
            toast('Share Link', {
                description: 'Copied link to clipboard!',
            })
        } catch (error) {
            console.error('Failed to copy:', error)
            toast('Share Link', {
                description: 'Failed to copy link to clipboard!',
            })
        }
    }

    return (
        <div className={cn('my-8 flex flex-col space-y-10', className)}>
            <div className='flex h-60 w-full flex-col items-center justify-center'>
                {!_.isEmpty(poolId) && (
                    <QRCode
                        size={256}
                        style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                        value={pageUrl}
                        viewBox={`0 0 256 256`}
                    />
                )}
            </div>
            <div className='flex flex-col space-y-2'>
                <Divider />
                <h4 className='text-sm'>Share the link:</h4>
                <div className='flex flex-col'>
                    <div className='flex flex-row space-x-2'>
                        <Input value={pageUrl} readOnly />
                        <Button onClick={() => void copyToClipboard()}>Copy</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShareDialog

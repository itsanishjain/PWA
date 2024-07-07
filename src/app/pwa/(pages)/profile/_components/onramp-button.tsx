'use client'

import { Button } from '@/app/pwa/_components/ui/button'

const OnRampButton = ({ className }: React.ComponentProps<'form'>) => {
    // const { currentJwt } = useCookie()

    // const onRampMutation = useMutation({
    //     mutationFn: handleOnRampByPaySDK,
    //     onSuccess: (data: any) => {
    //         // Perform actions on the returned data
    //         console.log('onramp url', data)
    //         window.open(data.onRampUrl, '_blank')
    //     },
    //     onError: () => {
    //         console.log('claimMutation Error')
    //     },
    // })

    // const onOnRampButtonClicked = () => {
    //     onRampMutation.mutate({
    //         params: [baseSepolia.name, currentJwt!],
    //     })
    // }

    return (
        <Button
            className={className}
            // onClick={onOnRampButtonClicked}
        >
            On Ramp
        </Button>
    )
}

export default OnRampButton

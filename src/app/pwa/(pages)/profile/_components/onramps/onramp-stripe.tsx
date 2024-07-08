'use client'

import { Button } from '@/app/pwa/_components/ui/button'
import { Drawer, DrawerContent, DrawerOverlay } from '@/app/pwa/_components/ui/drawer'
import { loadStripeOnramp } from '@stripe/crypto'
import { useEffect, useRef, useState } from 'react'
import { getSession } from './get-session'

interface StripeOnrampAppearance {
    theme: 'light' | 'dark'
}

interface StripeOnrampSession {
    clientSecret: string
    appearance?: StripeOnrampAppearance
}

interface StripeOnramp {
    createSession: (options: StripeOnrampSession) => {
        mount: (element: HTMLElement) => void
    }
}

interface OrampWithStripeProps extends React.HTMLAttributes<HTMLDivElement> {
    appearance?: StripeOnrampAppearance
}

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST not set')
}

export const OnrampWithStripe: React.FC<OrampWithStripeProps> = ({ appearance }) => {
    const [stripeOnramp, setStripeOnramp] = useState<StripeOnramp | null>(null)
    const onrampElementRef = useRef<HTMLDivElement>(null)
    const [clientSecret, setClientSecret] = useState('')
    const [showButton, setShowButton] = useState(true)

    useEffect(() => {
        loadStripeOnramp(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST!)
            .then(setStripeOnramp)
            .catch(console.error)
    }, [])

    const createSession = async () => {
        const { client_secret: clientSecret } = await getSession()
        if (clientSecret) {
            setClientSecret(clientSecret)
            setShowButton(false)
        }
    }

    useEffect(() => {
        const containerRef = onrampElementRef.current

        if (containerRef && clientSecret && stripeOnramp) {
            containerRef.innerHTML = ''

            stripeOnramp
                .createSession({
                    clientSecret,
                    appearance,
                })
                .mount(containerRef)
        }
    }, [clientSecret, stripeOnramp, appearance])

    return (
        <>
            {showButton && (
                <Button
                    className='h-[30px] w-[46px] rounded-mini bg-cta px-[10px] py-[5px] text-[10px]'
                    onClick={() => void createSession()}>
                    Stripe
                </Button>
            )}
            <div ref={onrampElementRef} />
            <Drawer>
                <DrawerOverlay />
                <DrawerContent ref={onrampElementRef} />
            </Drawer>
        </>
    )
}

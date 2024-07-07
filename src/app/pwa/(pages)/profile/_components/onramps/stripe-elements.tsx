'use client'

import { Button } from '@/app/pwa/_components/ui/button'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

// ReactContext to simplify access of StripeOnramp object
const CryptoElementsContext = createContext({ onramp: null })

interface CryptoElementsProps {
    // eslint-disable-next-line
    stripeOnramp: any
    children: React.ReactNode
}

export const CryptoElements = ({ stripeOnramp, children }: CryptoElementsProps) => {
    const [ctx, setContext] = useState(() => ({ onramp: null }))

    useEffect(() => {
        let isMounted = true

        // eslint-disable-next-line
        Promise.resolve(stripeOnramp).then(onramp => {
            if (onramp && isMounted) {
                // eslint-disable-next-line
                setContext(ctx => (ctx.onramp ? ctx : { onramp }))
            }
        })

        return () => {
            isMounted = false
        }
    }, [stripeOnramp])

    return <CryptoElementsContext.Provider value={ctx}>{children}</CryptoElementsContext.Provider>
}

// React hook to get StripeOnramp from context
export const useStripeOnramp = () => {
    const context = useContext(CryptoElementsContext)
    return context?.onramp
}

const getSession = async () => {
    try {
        const response = await fetch('/api/onramp_stripe')
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        // eslint-disable-next-line
        const data = await response.json()
        console.log('data', data)
        // eslint-disable-next-line
        return data
    } catch (error) {
        console.error('There was a problem with the post operation:', error)
    }
}

interface OnrampElementProps {
    // eslint-disable-next-line
    appearance?: any
    // eslint-disable-next-line
    [key: string]: any
}

// React element to render Onramp UI
export const OnrampElement = ({ appearance, ...props }: OnrampElementProps) => {
    const stripeOnramp = useStripeOnramp()
    const onrampElementRef = useRef<HTMLDivElement>(null)
    const [clientSecret, setClientSecret] = useState('')
    const [showButton, setShowButton] = useState(true)

    const createSession = async () => {
        // eslint-disable-next-line
        const { client_secret: clientSecret } = await getSession()
        if (clientSecret) {
            // eslint-disable-next-line
            setClientSecret(clientSecret)
            setShowButton(false)
        }
    }

    useEffect(() => {
        const containerRef = onrampElementRef.current

        if (containerRef) {
            containerRef.innerHTML = ''

            if (clientSecret && stripeOnramp) {
                // eslint-disable-next-line
                stripeOnramp
                    // eslint-disable-next-line
                    // @ts-expect-error
                    ?.createSession({
                        clientSecret,
                        // eslint-disable-next-line
                        appearance,
                    })
                    // eslint-disable-next-line
                    .mount(containerRef)
            }
        }
    }, [appearance, clientSecret, stripeOnramp])

    return (
        <>
            {showButton && <Button onClick={() => void createSession()}>Stripe</Button>}
            <div {...props} ref={onrampElementRef} />
        </>
    )
}

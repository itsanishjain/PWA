'use client'

import { useState, useEffect } from 'react'
import { Drawer } from '@/app/_components/ui/drawer'
import { Button } from '@/app/_components/ui/button'

export default function InstallPromptDrawer() {
    const [isOpen, setIsOpen] = useState(false)
    const [isIOS, setIsIOS] = useState(false)
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e)
            setIsOpen(true)
        }

        setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream)

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        }
    }, [])

    const handleInstall = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt()
            deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt')
                }
                setDeferredPrompt(null)
            })
        }
        setIsOpen(false)
    }

    if (!isOpen) return null

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <Drawer.Content>
                <Drawer.Header>
                    <Drawer.Title>Install Pool App</Drawer.Title>
                    <Drawer.Description>Install our app for a better experience and quick access.</Drawer.Description>
                </Drawer.Header>
                <div className='p-4'>
                    {isIOS ? (
                        <p>
                            To install this app on your iOS device, tap the share button
                            <span role='img' aria-label='share icon'>
                                {' '}
                                ⎋{' '}
                            </span>
                            and then "Add to Home Screen"
                            <span role='img' aria-label='plus icon'>
                                {' '}
                                ➕{' '}
                            </span>
                            .
                        </p>
                    ) : (
                        <Button onClick={handleInstall} className='w-full'>
                            Install App
                        </Button>
                    )}
                </div>
            </Drawer.Content>
        </Drawer>
    )
}

'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/app/_components/ui/avatar'
import { useUserAvatar } from '@/hooks/use-user-avatar'
import { User, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function UserAvatar() {
    const { data: userAvatar, isLoading } = useUserAvatar()

    return (
        <Avatar className='relative size-10 cursor-pointer overflow-hidden' aria-label='Go to Profile' asChild>
            <Link href={'/profile'}>
                <AnimatePresence mode='wait'>
                    {isLoading ? (
                        <motion.div
                            key='loading'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className='absolute inset-0 flex items-center justify-center bg-neutral-200'>
                            <Loader2 className='animate-spin text-blue-500' />
                        </motion.div>
                    ) : userAvatar ? (
                        <motion.div
                            key='image'
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            className='absolute inset-0'>
                            <AvatarImage
                                alt='user avatar'
                                src={userAvatar}
                                fetchPriority='high'
                                className='object-cover'
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key='fallback'
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            className='absolute inset-0 flex items-center justify-center bg-neutral-100'>
                            <User className='text-blue-500' />
                        </motion.div>
                    )}
                </AnimatePresence>
            </Link>
        </Avatar>
    )
}

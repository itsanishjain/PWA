'use client'

import { Button } from '@/app/pwa/_components/ui/button'
import Image from 'next/image'
import AvatarUploadIcon from './avatar-upload-icon'
import { CameraIcon, Trash2Icon } from 'lucide-react'
import { useState, ChangeEvent } from 'react'

export interface AvatarUploaderProps {
    name: string
    onChange?: (file: File | null) => void
    defaultValue?: string
}

export default function AvatarUploader({ name, onChange, defaultValue }: AvatarUploaderProps) {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(defaultValue || null)

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
            onChange?.(file)
        } else {
            setAvatarPreview(null)
            onChange?.(null)
        }
    }

    const handleRemove = () => {
        setAvatarPreview(null)
        onChange?.(null)
    }

    return (
        <div className='flex flex-col items-center'>
            <input
                placeholder='Choose an image'
                title='Choose an image'
                id={name}
                name={name}
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleImageChange}
            />
            {avatarPreview ? (
                <div className='relative size-[109px]'>
                    <Image src={avatarPreview} alt='Avatar preview' className='rounded-full object-cover' fill />
                    {/* ... rest of the code ... */}
                </div>
            ) : (
                <label
                    htmlFor={name}
                    className='flex size-[109px] cursor-pointer flex-col items-center justify-center rounded-full bg-[#2989EC]'>
                    <AvatarUploadIcon />
                </label>
            )}
        </div>
    )
}

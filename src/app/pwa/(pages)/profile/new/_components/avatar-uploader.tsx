'use client'

import { Button } from '@/app/pwa/_components/ui/button'
import { CameraIcon, Trash2Icon } from 'lucide-react'
import Image from 'next/image'
import type { RefObject } from 'react'
import { useRef } from 'react'
import AvatarUploadIcon from './avatar-upload-icon'
import { convertToBase64 } from '@/app/pwa/_lib/utils/convert-image'

export interface AvatarUploaderProps {
    name: string
    value: string | null
    onChange: (value: string | null) => void
}

const AvatarPreview = ({
    hoverRef,
    value,
    handleImageLoad,
    onChange,
}: {
    hoverRef: RefObject<HTMLInputElement>
    value: string
    handleImageLoad: (e: React.MouseEvent) => void
    onChange: (value: string | null) => void
}) => {
    const previewUrl = value
    return (
        <div
            className='relative size-[109px] items-center justify-center overflow-hidden rounded-full'
            onTouchStart={() => {
                if (hoverRef.current) hoverRef.current.hidden = false
            }}
            onMouseEnter={() => {
                if (hoverRef.current) hoverRef.current.hidden = false
            }}
            onMouseLeave={() => {
                if (hoverRef.current) hoverRef.current.hidden = true
            }}>
            <Image alt='image' src={previewUrl} className='rounded-full object-cover object-center' fill priority />
            <div ref={hoverRef} hidden>
                <div className='absolute inset-0 flex size-[109px] flex-col items-center justify-center rounded-full bg-black/50'>
                    <Button
                        size='icon'
                        variant='outline'
                        className='m-2 rounded-full bg-white'
                        onClick={handleImageLoad}>
                        <CameraIcon />
                    </Button>
                    <Button
                        size='icon'
                        variant='destructive'
                        className='m-2 rounded-full'
                        onClick={() => onChange(null)}>
                        <Trash2Icon />
                    </Button>
                </div>
            </div>
        </div>
    )
}

const UploadAvatarPlaceholder = ({ handleImageLoad }: { handleImageLoad: (e: React.MouseEvent) => void }) => {
    return (
        <div
            className='flex size-[109px] flex-col items-center justify-around rounded-full bg-[#2989EC] p-8 hover:cursor-pointer'
            onClick={handleImageLoad}>
            <AvatarUploadIcon />
        </div>
    )
}

export default function AvatarUploader({ name, value, onChange }: AvatarUploaderProps) {
    const hoverRef = useRef<HTMLInputElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleImageLoad = (e: React.MouseEvent) => {
        e.preventDefault()
        if (!inputRef.current) return
        inputRef.current.click()
    }

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        const file = event.target.files?.[0] || null
        if (file) {
            const base64 = await convertToBase64(file)
            onChange(`data:image/png;base64,${base64}`)
        } else {
            onChange(null)
        }
        if (hoverRef.current) hoverRef.current.hidden = true

        // Reset the input value so that the same image can be selected again
        if (event.target) event.target.value = ''
    }

    return (
        <>
            {value ? (
                <AvatarPreview
                    hoverRef={hoverRef}
                    value={value}
                    handleImageLoad={handleImageLoad}
                    onChange={onChange}
                />
            ) : (
                <UploadAvatarPlaceholder handleImageLoad={handleImageLoad} />
            )}
            <input title='image upload control' className='hidden' value={value || ''} name={name} type='text' />
            <input
                title='avatar upload control'
                className='hidden'
                ref={inputRef}
                onChange={handleImageChange}
                type='file'
                accept='image/*'
            />
        </>
    )
}

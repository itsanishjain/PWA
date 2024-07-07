'use client'

import { Button } from '@/app/pwa/_components/ui/button'
import { CameraIcon, Trash2Icon } from 'lucide-react'
import Image from 'next/image'
import type { RefObject } from 'react'
import { useRef } from 'react'
import AvatarUploadIcon from './avatar-upload-icon'

export interface AvatarUploaderProps {
    name: string
    value: string | File | undefined
    onChange: (value: string | File | undefined) => void
}

const AvatarPreview = ({
    hoverRef,
    value,
    handleImageLoad,
    onChange,
}: {
    hoverRef: RefObject<HTMLInputElement>
    value: string | File | undefined
    handleImageLoad: (e: React.MouseEvent) => void
    onChange: (value: string | File | undefined) => void
}) => {
    // if value is a file, we need to convert it to a url
    if (!value) return null
    const previewUrl = typeof value === 'string' ? value : URL.createObjectURL(value)

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
                    <Button size='icon' variant='outline' className='m-2 rounded-full' onClick={handleImageLoad}>
                        <CameraIcon />
                    </Button>
                    <Button
                        size='icon'
                        variant='destructive'
                        className='m-2 rounded-full'
                        onClick={() => onChange(undefined)}>
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

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null
        if (file) {
            const objectUrl = URL.createObjectURL(file)
            onChange(objectUrl as string & File)
        } else {
            onChange(undefined)
        }
        if (hoverRef.current) hoverRef.current.hidden = true
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
            <input
                title='avatar upload control'
                className='hidden'
                ref={inputRef}
                onChange={e => void handleImageChange(e)}
                type='file'
                accept='image/*'
                name={name}
            />
        </>
    )
}

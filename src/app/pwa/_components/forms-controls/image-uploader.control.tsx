'use client'

import { Button } from '../ui/button'
import Image from 'next/image'
import ImageUploadIcon from '../icons/image-upload.icon'
import type { RefObject } from 'react'
import { useRef } from 'react'
import { convertToBase64 } from '../../_lib/utils/convert-image'

export type ImageUploaderValue = string

interface ImageUploaderProps {
    name: string
    value: string | null
    onChange: (value: string | null) => void
}

const ImagePreview = ({
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
            className='relative size-32 items-center justify-center overflow-hidden rounded-xl'
            onTouchStart={() => {
                if (hoverRef.current) hoverRef.current.hidden = false
            }}
            onMouseEnter={() => {
                if (hoverRef.current) hoverRef.current.hidden = false
            }}
            onMouseLeave={() => {
                if (hoverRef.current) hoverRef.current.hidden = true
            }}>
            <Image alt='image' src={previewUrl} className='rounded-xl object-cover object-center' fill priority />
            <div ref={hoverRef} hidden>
                <div className='absolute inset-0 flex w-32 flex-col items-center justify-center rounded-xl bg-black/50'>
                    <Button size='sm' variant='outline' className='m-2 rounded-full bg-white' onClick={handleImageLoad}>
                        Change
                    </Button>
                    <Button size='sm' variant='destructive' className='m-2 rounded-full' onClick={() => onChange(null)}>
                        Remove
                    </Button>
                </div>
            </div>
        </div>
    )
}

const UploadImagePlaceholder = ({ handleImageLoad }: { handleImageLoad: (e: React.MouseEvent) => void }) => {
    return (
        <div
            className='flex w-32 flex-col items-center justify-around rounded-xl border-2 border-dashed border-[#EBEBEB] p-8 hover:cursor-pointer'
            onClick={handleImageLoad}>
            <ImageUploadIcon />
            <p className='text-center text-xs font-normal text-[#B2B2B2]'>Select an Image</p>
        </div>
    )
}

export default function ImageUploader({ name, value, onChange }: ImageUploaderProps) {
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
                <ImagePreview hoverRef={hoverRef} value={value} handleImageLoad={handleImageLoad} onChange={onChange} />
            ) : (
                <UploadImagePlaceholder handleImageLoad={handleImageLoad} />
            )}
            <input title='image upload control' className='hidden' value={value || ''} name={name} type='text' />
            <input
                title='image upload control'
                className='hidden'
                ref={inputRef}
                onChange={handleImageChange}
                type='file'
                accept='image/*'
            />
        </>
    )
}

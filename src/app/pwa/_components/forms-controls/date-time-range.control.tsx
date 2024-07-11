'use client'

import { useState } from 'react'
import { Input } from '../ui/input'

export type DateTimeRangeValue = {
    start: string
    end: string
}

interface DateTimeRangeProps {
    name: string
}

const getDefaultDateTimeValue = () => {
    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    return {
        start: now.toISOString().split('.')[0],
        end: tomorrow.toISOString().split('.')[0],
    }
}

export default function DateTimeRange({ name }: DateTimeRangeProps) {
    const [localValue, setLocalValue] = useState<DateTimeRangeValue>(getDefaultDateTimeValue)

    const updateValue = (field: 'start' | 'end', type: 'date' | 'time', newValue: string) => {
        const [currentDate, currentTime] = localValue[field].split('T')
        const updatedValue = type === 'date' ? `${newValue}T${currentTime}` : `${currentDate}T${newValue}`

        setLocalValue(prevValue => ({
            ...prevValue,
            [field]: updatedValue,
        }))
    }

    return (
        <>
            <input type='hidden' name={name} value={JSON.stringify(localValue)} />
            <div className='flex flex-row items-center justify-between border-b border-[#ebebeb] pb-2 text-black'>
                <span className='text-xs font-medium'>Starts</span>
                <div className='inline-flex flex-row flex-nowrap gap-1'>
                    <div className='relative'>
                        <Input
                            className='cursor-pointer bg-transparent px-0 text-center text-xs font-medium'
                            type='date'
                            value={localValue.start.split('T')[0]}
                            onChange={e => updateValue('start', 'date', e.target.value)}
                            autoComplete='off'
                            prefix='date'
                        />
                    </div>
                    <div className='relative'>
                        <Input
                            className='cursor-pointer bg-white text-center text-xs font-medium'
                            type='time'
                            value={localValue.start.split('T')[1].substring(0, 5)}
                            onChange={e => updateValue('start', 'time', e.target.value)}
                            autoComplete='off'
                            step={60}
                        />
                    </div>
                </div>
            </div>
            <div className='flex flex-row items-center justify-between border-b border-[#ebebeb] py-2 text-black'>
                <span className='text-xs font-medium'>Ends</span>
                <div className='inline-flex flex-row flex-nowrap gap-1'>
                    <div className='relative'>
                        <Input
                            className='cursor-pointer bg-transparent px-0 text-center text-xs font-medium'
                            type='date'
                            value={localValue.end.split('T')[0]}
                            onChange={e => updateValue('end', 'date', e.target.value)}
                            autoComplete='off'
                            prefix='date'
                        />
                    </div>
                    <div className='relative'>
                        <Input
                            className='cursor-pointer bg-white text-center text-xs font-medium'
                            type='time'
                            value={localValue.end.split('T')[1].substring(0, 5)}
                            onChange={e => updateValue('end', 'time', e.target.value)}
                            autoComplete='off'
                            step={60}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

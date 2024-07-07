import { Textarea } from '../ui/textarea'

export type TextAreaValue = string

interface TextAreaProps {
    name: string
    value: TextAreaValue
    onChange: (value: TextAreaValue) => void
}

export default function TextArea({ name, value, onChange }: TextAreaProps) {
    const maxLength = 200
    return (
        <div>
            <Textarea
                className='content-size resize-y rounded-[20px] p-6 font-normal leading-tight text-black backdrop-blur-[2px]'
                maxLength={maxLength}
                value={value}
                name={name}
                onChange={e => onChange(e.target.value)}
            />
            <div className='absolute right-7 -mt-5 w-auto rounded-full bg-[#fffd] px-1 text-right text-xs font-medium text-[#B2B2B2]'>
                {value?.length}/{maxLength}
            </div>
        </div>
    )
}

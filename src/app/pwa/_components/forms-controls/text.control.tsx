import { Input } from '../ui/input'

export interface TextProps {
    name: string
    value: string | undefined
    onChange: (value: string | undefined) => void
}

export default function Text({ name, value, onChange }: TextProps) {
    return (
        <Input
            className='bg-transparent'
            type='text'
            value={value}
            onChange={e => onChange(e.target.value)}
            autoComplete='off'
            name={name}
        />
    )
}

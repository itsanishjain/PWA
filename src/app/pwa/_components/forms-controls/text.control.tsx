import { Input } from '../ui/input'

export interface TextProps {
    name: string
    onChange?: (value: string) => void
}

export default function Text({ name, onChange }: TextProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.value)
    }

    return <Input className='bg-transparent' type='text' autoComplete='off' name={name} onChange={handleChange} />
}

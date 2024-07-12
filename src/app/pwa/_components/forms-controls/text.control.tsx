import { Input } from '../ui/input'

export interface TextProps {
    name: string
    onChange?: (value: string) => void
    defaultValue?: string
}

export default function Text({ name, onChange, defaultValue }: TextProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.value)
    }

    return (
        <Input
            className='bg-transparent'
            type='text'
            autoComplete='off'
            name={name}
            onChange={handleChange}
            defaultValue={defaultValue}
        />
    )
}

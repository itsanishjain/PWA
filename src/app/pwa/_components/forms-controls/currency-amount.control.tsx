import { Input } from '../ui/input'

export type CurrencyAmountValue = string

interface CurrencyAmountProps {
    name: string
    value: CurrencyAmountValue
    onChange: (value: CurrencyAmountValue) => void
}

/**
 * A React component that renders an input field for entering currency amounts.
 * It restricts the input to only allow numeric values, decimal points, and a maximum of two decimal places.
 * The component also formats the input value to always display two decimal places.
 *
 * @param {Object} props - The component props.
 * @param {FieldApi<unknown, string, never, never, string>} props.field - The field API object from `@tanstack/react-form` library.
 * @param {string} props.id - The unique identifier for the input field.
 *
 * @example
 * <CurrencyAmount field={form.getField('amount')} id="amount-input" />
 */
export default function CurrencyAmount({ name, value, onChange }: CurrencyAmountProps) {
    const max = 9999.99
    const isMax = parseFloat(value) > max

    const handleChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        const isEmpty = value === ''
        const isZero = parseInt(value) === 0
        const isUniqueDotOrComma = value.match(/[.,]/g)?.length === 1
        const isNumber = /^\d+$/.test(value)
        const isValueShort = value.length < 8

        if (isValueShort && (isEmpty || isZero || isNumber || isUniqueDotOrComma)) {
            onChange(value.replace(',', '.'))
        }
    }

    const handleBlur = () => {
        // Format the value to two decimal places on blur
        const formattedValue = parseFloat(value || '0')
            .toFixed(2)
            .replace(/\.00$/, '.00') // Ensure two decimals even if trailing zeros

        onChange(formattedValue)
    }

    return (
        <Input
            className='no-spinner bg-transparent'
            inputMode='decimal'
            onBlur={handleBlur}
            onChange={handleChange}
            // Reflect the allowed format
            pattern='[0-9]*\.[0-9]{0,2}'
            startAdornment='$'
            type='text'
            value={isMax ? max : value}
            name={name}
        />
    )
}

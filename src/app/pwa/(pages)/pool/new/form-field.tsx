import { Label } from '@/app/pwa/_components/ui/label'
import React from 'react'

interface FormFieldProps {
    field: {
        key: string
        name: string
        label: string
        description: string
        component: React.ComponentType<any>
    }
    errors?: string[]
}

export const FormField: React.FC<FormFieldProps> = ({ field, errors }) => {
    return (
        <section key={field.key} className='flex flex-1 flex-col'>
            <Label className='text-base font-medium text-[#090909]'>{field.label}</Label>
            <p className='mb-4 mt-1.5 text-xs font-medium text-[#b2b2b2]'>{field.description}</p>
            <field.component name={field.name} />
            {errors && errors.length > 0 && <p className='mt-1 text-xs text-red-500'>{errors.join(', ')}</p>}
        </section>
    )
}

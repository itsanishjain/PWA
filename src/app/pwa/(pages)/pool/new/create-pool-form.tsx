// src/app/pwa/(pages)/pool/new/create-pool-form.tsx
'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useCreatePool } from './use-create-pool'
import { FormFieldKey, formFields } from './form-fields'
import { Button } from '@/app/pwa/_components/ui/button'
import { Label } from '@/app/pwa/_components/ui/label'
import { useSettingsStore } from '@/app/pwa/_client/providers/settings.provider'
import { Steps, usePoolCreationStore } from '@/app/pwa/_client/stores/pool-creation-store'

export default function CreatePoolForm() {
    const { formAction, state, createPoolOnChain, isPending, isConfirming } = useCreatePool()
    const { setBottomBarContent, setTopBarTitle } = useSettingsStore(s => ({
        setBottomBarContent: s.setBottomBarContent,
        setTopBarTitle: s.setTopBarTitle,
    }))
    const hasCreatedPool = useRef(false)

    const { setStep, showToast } = usePoolCreationStore(state => ({
        setStep: state.setStep,
        showToast: state.showToast,
    }))

    const handleSubmit = useCallback(() => {
        setStep(Steps.CreatingDB)
        showToast()
    }, [setStep, showToast])

    useEffect(() => {
        setTopBarTitle('Create Pool')
        setBottomBarContent(
            <Button
                type='submit'
                form='pool-form'
                disabled={isPending || isConfirming}
                className='mb-3 h-[46px] w-full rounded-[2rem] bg-cta px-6 py-[11px] text-center text-base font-semibold leading-normal text-white shadow-button active:shadow-button-push'
                onClick={handleSubmit}>
                {isPending ? 'Creating in DB...' : isConfirming ? 'Confirming on-chain...' : 'Create Pool'}
            </Button>,
        )
        return () => {
            setTopBarTitle(null)
            setBottomBarContent(null)
        }
    }, [setBottomBarContent, setTopBarTitle, isPending, isConfirming, handleSubmit])

    useEffect(() => {
        if (state.message === 'Pool created successfully' && state.internalPoolId && !hasCreatedPool.current) {
            hasCreatedPool.current = true
            createPoolOnChain()
            console.log('createPoolOnChain called, current state:', state)
        }
    }, [state.message, state.internalPoolId, createPoolOnChain])

    return (
        <form id='pool-form' action={formAction} className='flex w-full flex-col gap-6 py-6'>
            {formFields.map(field => {
                const errors = state?.errors && field.key in state.errors ? state.errors[field.key as FormFieldKey] : []

                return (
                    <section key={field.key} className='flex flex-1 flex-col'>
                        <Label className='text-base font-medium text-[#090909]'>{field.label}</Label>
                        <p className='mb-4 mt-1.5 text-xs font-medium text-[#b2b2b2]'>{field.description}</p>
                        <field.component name={field.name} />
                        {errors && errors.length > 0 && (
                            <p className='mt-1 text-xs text-red-500'>{errors.join(', ')}</p>
                        )}
                    </section>
                )
            })}
        </form>
    )
}

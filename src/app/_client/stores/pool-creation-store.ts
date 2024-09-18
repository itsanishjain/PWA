// src/app/pwa/_client/stores/pool-creation-store.ts
import { create } from 'zustand'
import { toast } from 'sonner'

export enum Steps {
    Initial = 'initial',
    CreatingDB = 'creating-db',
    CreatingChain = 'creating-chain',
    UpdatingStatus = 'updating-status',
    Completed = 'completed',
    Error = 'error',
}

interface PoolCreationState {
    step: Steps
    internalPoolId: number | null
    onChainPoolId: number | null
    error: string | null
    setStep: (step: PoolCreationState['step']) => void
    setInternalPoolId: (id: number) => void
    setOnChainPoolId: (id: number) => void
    setError: (error: string) => void
    reset: () => void
    showToast: () => void
}

export const usePoolCreationStore = create<PoolCreationState>((set, get) => ({
    step: Steps.Initial,
    internalPoolId: null,
    onChainPoolId: null,
    error: null,
    setStep: step => set({ step }),
    setInternalPoolId: id => set({ internalPoolId: id }),
    setOnChainPoolId: id => set({ onChainPoolId: id }),
    setError: error => set({ error, step: Steps.Error }),
    reset: () =>
        set({
            step: Steps.Initial,
            internalPoolId: null,
            onChainPoolId: null,
            error: null,
        }),
    showToast: () => {
        const { step, error } = get()
        toast.dismiss()
        if (step === Steps.Error) {
            toast.error('Failed to create Pool', {
                description: error || 'Please try again',
                richColors: true,
            })
            return
        }
        switch (step) {
            case Steps.CreatingDB:
                toast.loading('Creating Pool', { description: 'Please wait...', richColors: true })
                break
            case Steps.CreatingChain:
                toast.loading('Creating Pool on-chain', {
                    description: 'Initiating blockchain transaction...',
                    richColors: true,
                })
                break
            case Steps.UpdatingStatus:
                toast.loading('Updating Pool', { description: 'Finalizing pool creation...', richColors: true })
                break
            case Steps.Completed:
                toast.success('Pool Created Successfully', {
                    description: 'Redirecting to pool details...',
                    richColors: true,
                })
                break
        }
    },
}))

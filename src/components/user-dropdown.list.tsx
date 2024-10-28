'use client'

import type { Variants } from 'framer-motion'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import UserDropdownItem from './user-dropdown.item'
import type { DropdownItemConfig } from './user-dropdown.list.config'
import { dropdownItemsConfig } from './user-dropdown.list.config'
import { MoonpayConfig, useFundWallet } from '@privy-io/react-auth'
import { useAccount } from 'wagmi'
import { useAuth } from '@/app/_client/hooks/use-auth'

/**
 * Variants for the dropdown menu animation using framer-motion.
 */
const menuVariants: Variants = {
    closed: {
        opacity: 0.3,
        transition: { when: 'afterChildren', staggerChildren: 0.06, duration: 0.1 },
    },
    open: {
        opacity: 1,
        transition: { when: 'beforeChildren', staggerChildren: 0.06, duration: 0.1 },
    },
}

const itemVariants: Variants = {
    closed: { opacity: 0, y: -40 },
    open: { opacity: 1, y: 0 },
}

const UserDropdownList: React.FC<{ setOpen: (open: boolean) => void }> = ({ setOpen }): JSX.Element => {
    const { logout } = useAuth()
    const { fundWallet } = useFundWallet()
    const { address } = useAccount()
    const [hoveredItemIndex, setHoveredItemIndex] = useState<number | null>(null)
    const dropdownListRef = useRef<HTMLDivElement | null>(null)
    // const [openOnRampDialog, setOpenOnRampDialog] = useState(false)

    /**
     * Handles the click event on the 'Disconnect' dropdown item.
     */
    const handleLogoutClick = async () => {
        setOpen(false)
        try {
            await logout()
            toast.success('Disconnected successfully')
        } catch {
            toast.error('Failed to log out')
        }
    }

    const handleDepositClick = async () => {
        // setOpenOnRampDialog(true)

        if (!address) {
            console.error('Cannot initiate onramp, user address not found')
            return
        }

        // Limited to moonpay for now
        const fundWalletConfig: MoonpayConfig = {
            currencyCode: 'USDC_BASE',
            quoteCurrencyAmount: 10,
            paymentMethod: 'credit_debit_card',
            uiConfig: { accentColor: '#5472E9' },
        }
        await fundWallet(address, { config: fundWalletConfig })
    }

    /**
     * Handles mouse entering a dropdown item to set the hovered state.
     *
     * @param {number} index - Index of the hovered item
     */
    const handleMouseEnter = (index: number) => setHoveredItemIndex(index)

    /**
     * Resets the hovered item index on mouse leave.
     */
    const handleMouseLeave = () => setHoveredItemIndex(null)

    // Assign the handleLogoutClick to the corresponding dropdown item
    const updatedDropdownItemsConfig: DropdownItemConfig[] = dropdownItemsConfig.map(item => {
        switch (item.label) {
            case 'Disconnect':
                return { ...item, onClick: handleLogoutClick }
            case 'Deposit':
                return { ...item, onClick: handleDepositClick }
            default:
                return item
        }
    })

    return (
        <motion.div
            initial='closed'
            animate='open'
            exit='closed'
            variants={menuVariants}
            className='pointer-events-none relative w-[213px] cursor-pointer'
            ref={dropdownListRef}
            style={{ pointerEvents: 'none' }}>
            {updatedDropdownItemsConfig.map((item, index) => (
                <motion.div
                    key={index}
                    className='relative px-3'
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                    variants={itemVariants}
                    style={{ pointerEvents: 'auto' }}>
                    {hoveredItemIndex === index && (
                        <motion.div
                            layoutId='active-dropdown-item'
                            className='absolute inset-0 z-0 h-full rounded-lg bg-neutral-100 mix-blend-multiply'
                            transition={{
                                type: 'spring',
                                stiffness: 500,
                                damping: 60,
                                mass: 0.3,
                                duration: 0.1,
                                bounce: 0.2,
                            }}
                            style={{ pointerEvents: 'none' }}
                        />
                    )}
                    <UserDropdownItem {...item} />
                </motion.div>
            ))}
            {/* <OnRampDialog open={openOnRampDialog} setOpen={setOpenOnRampDialog} /> */}
        </motion.div>
    )
}

export default UserDropdownList

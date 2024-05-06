import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import LoadingAnimation from './loadingAnimation'
import { Dispatch, MouseEventHandler, SetStateAction } from 'react'

interface transactionDialog {
	open: boolean
	title?: string | undefined
	message?: string | undefined
	showLoadAnimation?: boolean
	setOpen: Dispatch<SetStateAction<boolean>>
}

const TransactionDialog = (props: transactionDialog) => {
	return (
		<AlertDialog open={props.open}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{props.title ?? 'Transaction in Progress'}
					</AlertDialogTitle>
					{props.showLoadAnimation && <LoadingAnimation />}
					<AlertDialogDescription>
						{props.message ??
							'Kindly sign the requested transaction/s to proceed.'}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogAction onClick={() => props.setOpen(false)}>
						Okay
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default TransactionDialog

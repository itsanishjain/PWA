import { useState } from 'react'

const DropdownChecklist = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [selectedItems, setSelectedItems] = useState<any[]>([])
	const items = [
		'Item 1',
		'Item 2',
		'Item 3',
		'Item 4',
		'Item 5',
		'Item 6',
		'Item 7',
		'Item 8',
		'Item 9',
		'Item 10',
	] // Your list of items

	const toggleDropdown = () => {
		setIsOpen(!isOpen)
	}

	const toggleItem = (item: any) => {
		if (selectedItems.includes(item)) {
			setSelectedItems(
				selectedItems.filter((selectedItem) => selectedItem !== item),
			)
		} else {
			setSelectedItems([...selectedItems, item])
		}
	}

	return (
		<div className='relative inline-block text-left'>
			<div>
				<button
					type='button'
					onClick={toggleDropdown}
					className='inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100'
				>
					Select Items
					<svg
						className='-mr-1 ml-2 h-5 w-5'
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 20 20'
						fill='currentColor'
						aria-hidden='true'
					>
						<path
							fillRule='evenodd'
							d='M6.293 7.293a1 1 0 011.414 0L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414zM7 11a1 1 0 100 2 1 1 0 000-2z'
							clipRule='evenodd'
						/>
					</svg>
				</button>
			</div>

			{isOpen && (
				<div className='absolute right-0 mt-2 max-h-40 w-56 origin-top-right overflow-y-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5'>
					<div
						className='py-1'
						role='menu'
						aria-orientation='vertical'
						aria-labelledby='options-menu'
					>
						{items.map((item: any) => (
							<div
								key={item}
								onClick={() => toggleItem(item)}
								className={`${
									selectedItems.includes(item)
										? 'bg-indigo-600 text-white'
										: 'text-gray-900'
								} relative cursor-pointer select-none py-2 pl-3 pr-9`}
								role='menuitem'
							>
								<span className='block truncate'>{item}</span>
								{selectedItems.includes(item) && (
									<span className='absolute inset-y-0 right-0 flex items-center pr-4'>
										<svg
											className='h-5 w-5'
											xmlns='http://www.w3.org/2000/svg'
											viewBox='0 0 20 20'
											fill='currentColor'
											aria-hidden='true'
										>
											<path
												fillRule='evenodd'
												d='M6.293 7.293a1 1 0 011.414 0L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414zM7 11a1 1 0 100 2 1 1 0 000-2z'
												clipRule='evenodd'
											/>
										</svg>
									</span>
								)}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}

export default DropdownChecklist

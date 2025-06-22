import React from 'react';

type EditTodoModalProps = {
	editingTitle: string;
	setEditingTitle: (title: string) => void;
	onSave: () => void;
	onCancel: () => void;
	visible: boolean;
};

export default function EditTodoModal({
	editingTitle,
	setEditingTitle,
	onSave,
	onCancel,
	visible
}: EditTodoModalProps) {
	if (!visible) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50'>
			<div className='bg-white rounded-2xl shadow-xl p-8 w-11/12 max-w-md mx-auto relative'>
				<h2 className='text-2xl font-semibold mb-4 text-indigo-600'>
					Edit Todo
				</h2>
				<input
					type='text'
					value={editingTitle}
					onChange={e => setEditingTitle(e.target.value)}
					className='w-full p-3 rounded-xl border-2 border-indigo-300  placeholder:text-indigo-400 focus:outline-none focus:ring-0 transition disabled:opacity-50 text-indigo-500'
					autoFocus
				/>
				<div className='mt-6 flex justify-end gap-4'>
					<button
						onClick={onSave}
						className='px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition cursor-pointer'
					>
						Save
					</button>
					<button
						onClick={onCancel}
						className='px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition cursor-pointer'
					>
						Cancel
					</button>
				</div>
				<button
					onClick={onCancel}
					className='absolute top-4 right-4  hover:text-red-600 transition text-xl text-red-500 font-bold cursor-pointer'
					aria-label='Close modal'
				>
					&#10005;
				</button>
			</div>
		</div>
	);
}

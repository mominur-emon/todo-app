'use client';

import {
	addTodo,
	deleteTodo,
	fetchTodos,
	toggleTodo,
	updateTodoTitle
} from '@/actions/todos/action';
import { lazy, useEffect, useState } from 'react';

const EditTodoModal = lazy(() => import('./EditTodoModal'));

type Todo = {
	id: number;
	title: string;
	completed: boolean;
};

export default function Todos() {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [newTitle, setNewTitle] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [editingTitle, setEditingTitle] = useState('');

	useEffect(() => {
		(async () => {
			const data = await fetchTodos();
			setTodos(data);
		})();
	}, []);

	const handleAdd = async () => {
		if (!newTitle.trim()) {
			setError('Title is required');
			return;
		}
		setError('');
		setLoading(true);
		const todo = await addTodo(newTitle);
		setTodos([todo, ...todos]);
		setNewTitle('');
		setLoading(false);
	};

	const handleToggle = async (todo: Todo) => {
		await toggleTodo(todo.id, !todo.completed);
		setTodos(
			todos.map(t =>
				t.id === todo.id ? { ...t, completed: !t.completed } : t
			)
		);
	};

	const handleDelete = async (id: number) => {
		await deleteTodo(id);
		setTodos(todos.filter(t => t.id !== id));
	};

	const startEditing = (todo: Todo) => {
		setEditingId(todo.id);
		setEditingTitle(todo.title);
	};

	const cancelEditing = () => {
		setEditingId(null);
		setEditingTitle('');
	};

	const saveEditing = async () => {
		if (!editingTitle.trim() || editingId === null) return;
		const updated = await updateTodoTitle(
			editingId,
			editingTitle.trim()
		);
		setTodos(todos.map(t => (t.id === editingId ? updated : t)));
		cancelEditing();
	};

	const filteredTodos = todos.filter(todo =>
		todo.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className='mt-10 rounded-2xl p-4 max-w-xl mx-auto'>
			<h1 className='text-4xl font-bold text-center text-indigo-600 mb-8'>
				Todo App
			</h1>

			{/* Search Field */}
			<input
				type='text'
				placeholder='Search tasks...'
				value={searchQuery}
				onChange={e => setSearchQuery(e.target.value)}
				className='w-full mb-4 p-3 rounded-xl border border-indigo-200 text-gray-700 placeholder:text-indigo-400 focus:outline-none focus:ring-0 transition'
			/>

			{error && <p className='text-sm text-red-500 mb-4'>{error}</p>}

			{/* Add New Todo */}
			<div className='flex items-center gap-4 mb-8'>
				<input
					type='text'
					placeholder='Enter your task...'
					value={newTitle}
					onChange={e => setNewTitle(e.target.value)}
					className='flex-grow p-3 rounded-xl border-2 border-indigo-200 text-gray-700 placeholder:text-indigo-400 focus:outline-none focus:ring-0 transition disabled:opacity-50'
					disabled={loading}
				/>
				<button
					onClick={handleAdd}
					disabled={loading}
					className='px-5 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer'
				>
					Add
				</button>
			</div>

			{/* Todo List */}
			<ul className='space-y-6'>
				{filteredTodos.map(todo => (
					<li
						key={todo.id}
						className='bg-indigo-50 p-4 rounded-xl shadow-sm hover:shadow-md transition'
					>
						<div className='flex justify-between items-center'>
							<span
								onClick={() => handleToggle(todo)}
								className={`cursor-pointer text-lg font-medium select-none ${
									todo.completed
										? 'line-through text-gray-400'
										: 'text-gray-700 hover:text-indigo-600'
								}`}
								title='Click to toggle complete'
							>
								{todo.title}
							</span>

							<div className='flex gap-2 items-center'>
								<button
									onClick={() => startEditing(todo)}
									className='text-sm px-3 py-1 bg-indigo-100 text-indigo-600 rounded-md hover:bg-indigo-200 transition cursor-pointer'
									title='Edit todo'
								>
									Edit
								</button>
								<button
									onClick={() => handleDelete(todo.id)}
									className='text-sm px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition cursor-pointer'
								>
									Delete
								</button>
							</div>
						</div>
					</li>
				))}
			</ul>

			<EditTodoModal
				{...{
					visible: editingId !== null,
					editingTitle: editingTitle,
					setEditingTitle: setEditingTitle,
					onSave: saveEditing,
					onCancel: cancelEditing
				}}
			/>
		</div>
	);
}

'use client';

import {
	addTodo,
	deleteTodo,
	fetchTodos,
	searchTodos,
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

	// Load/fetch all todos on component mount
	useEffect(() => {
		async function loadTodos() {
			const data = await fetchTodos();
			setTodos(data);
		}
		loadTodos();
	}, []);

	// When search query changes, call backend search with debounce
	useEffect(() => {
		const delayDebounce = setTimeout(async () => {
			if (searchQuery.trim() === '') {
				// If search is empty, fetch all todos
				const data = await fetchTodos();
				setTodos(data);
				return;
			}

			// Perform backend search with the query
			const searched = await searchTodos(searchQuery);
			setTodos(searched);
		}, 300); // 300ms debounce delay

		return () => clearTimeout(delayDebounce); // Cleanup timeout on new searchQuery
	}, [searchQuery]);

	// Handle adding a new todo
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

	// Toggle completed status of a todo
	const handleToggle = async (todo: Todo) => {
		await toggleTodo(todo.id, !todo.completed);
		setTodos(
			todos.map(t =>
				t.id === todo.id ? { ...t, completed: !t.completed } : t
			)
		);
	};

	// Delete a todo by id
	const handleDelete = async (id: number) => {
		await deleteTodo(id);
		setTodos(todos.filter(t => t.id !== id));
	};

	// Start editing a todo's title
	const startEditing = (todo: Todo) => {
		setEditingId(todo.id);
		setEditingTitle(todo.title);
	};

	// Cancel editing mode
	const cancelEditing = () => {
		setEditingId(null);
		setEditingTitle('');
	};

	// Save edited todo title
	const saveEditing = async () => {
		if (!editingTitle.trim() || editingId === null) return;
		const updated = await updateTodoTitle(
			editingId,
			editingTitle.trim()
		);
		setTodos(todos.map(t => (t.id === editingId ? updated : t)));
		cancelEditing();
	};

	return (
		<div className='h-screen overflow-hidden min-w-150 mx-auto rounded-2xl p-4'>
			<h1 className='text-4xl font-bold text-center text-indigo-600 mb-8'>
				Todo App
			</h1>

			<div className='max-w-100 mx-auto space-y-6'>
				{/* Search Input */}
				<input
					type='text'
					placeholder='Search tasks...'
					value={searchQuery}
					onChange={e => setSearchQuery(e.target.value)}
					className='w-full h-12 px-3 rounded-xl border border-indigo-200 text-gray-700 placeholder:text-indigo-400 focus:outline-none focus:ring-0 transition shadow'
				/>

				{/* Add New Todo */}
				<div className='flex items-center h-12 mb-8 border border-indigo-200 rounded-xl shadow overflow-hidden'>
					<input
						type='text'
						placeholder='Enter your task...'
						value={newTitle}
						onChange={e => setNewTitle(e.target.value)}
						className='flex-grow p-3 text-gray-700 placeholder:text-indigo-400 focus:outline-none focus:ring-0 transition disabled:opacity-50'
						disabled={loading}
					/>
					<button
						onClick={handleAdd}
						disabled={loading}
						className=' h-full px-5 bg-indigo-600 text-white font-medium  hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer'
					>
						Add
					</button>
				</div>
			</div>
			{error && (
				<p className='absolute top-56 inset-x-0 text-sm text-center text-red-500 '>
					{error}
				</p>
			)}
			{/* Todo List */}
			<ul className='space-y-6 h-[calc(100vh-18rem)] overflow-hidden overflow-y-auto py-4 mt-10'>
				{todos.map(todo => (
					<li
						key={todo.id}
						className='bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition'
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

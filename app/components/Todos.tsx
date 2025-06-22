'use client';
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
	const [loading, setLoading] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [editingTitle, setEditingTitle] = useState('');

	async function fetchTodos() {
		const res = await fetch('/api/todos');
		const data = await res.json();
		setTodos(data);
	}

	useEffect(() => {
		fetchTodos();
	}, []);

	async function addTodo() {
		if (!newTitle.trim()) return;
		setLoading(true);
		const res = await fetch('/api/todos', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ title: newTitle })
		});
		const todo = await res.json();
		setTodos([todo, ...todos]);
		setNewTitle('');
		setLoading(false);
	}

	async function toggleTodo(todo: Todo) {
		await fetch(`/api/todos/${todo.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ completed: !todo.completed })
		});
		setTodos(
			todos.map(t =>
				t.id === todo.id ? { ...t, completed: !t.completed } : t
			)
		);
	}

	async function deleteTodo(id: number) {
		await fetch(`/api/todos/${id}`, { method: 'DELETE' });
		setTodos(todos.filter(t => t.id !== id));
	}

	function startEditing(todo: Todo) {
		setEditingId(todo.id);
		setEditingTitle(todo.title);
	}

	function cancelEditing() {
		setEditingId(null);
		setEditingTitle('');
	}

	async function saveEditing() {
		if (!editingTitle.trim() || editingId === null) return;

		const res = await fetch(`/api/todos/${editingId}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ title: editingTitle.trim() })
		});

		if (res.ok) {
			const updatedTodo = await res.json();
			setTodos(
				todos.map(t => (t.id === editingId ? updatedTodo : t))
			);
			cancelEditing();
		}
	}

	return (
		<div className='mt-10 rounded-2xl p-4 max-w-xl mx-auto'>
			<h1 className='text-4xl font-bold text-center text-indigo-600 mb-8'>
				Todo App
			</h1>

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
					onClick={addTodo}
					disabled={loading}
					className='px-5 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition disabled:opacity-50'
				>
					Add
				</button>
			</div>

			<ul className='space-y-6'>
				{todos.map(todo => (
					<li
						key={todo.id}
						className='bg-indigo-50 p-4 rounded-xl shadow-sm hover:shadow-md transition'
					>
						<div className='flex justify-between items-center'>
							<span
								onClick={() => toggleTodo(todo)}
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
									className='text-sm px-3 py-1 bg-indigo-100 text-indigo-600 rounded-md hover:bg-indigo-200 transition'
									title='Edit todo'
								>
									Edit
								</button>
								<button
									onClick={() => deleteTodo(todo.id)}
									className='text-sm px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition'
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

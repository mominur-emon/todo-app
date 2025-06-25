'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache'; // Used to revalidate cached paths (ISR/SSG)

export async function fetchTodos() {
	const todos = await prisma.todo.findMany({
		orderBy: { createdAt: 'desc' }
	});
	return todos;
}

export async function searchTodos(query: string) {
	if (!query || query.trim() === '') {
		return [];
	}

	const todos = await prisma.todo.findMany({
		where: {
			title: {
				contains: query,
				mode: 'insensitive'
			}
		},
		orderBy: { createdAt: 'desc' }
	});

	return todos;
}

export async function addTodo(title: string) {
	if (!title || title.trim() === '') {
		throw new Error('Title is required');
	}

	const todo = await prisma.todo.create({ data: { title } });
	revalidatePath('/'); // Refresh the homepage cache to show the new todo
	return todo;
}

export async function toggleTodo(id: number, completed: boolean) {
	const updated = await prisma.todo.update({
		where: { id }, // Locate todo by ID
		data: { completed } // Update completed status
	});
	revalidatePath('/'); // Refresh homepage to reflect changes
	return updated;
}

export async function deleteTodo(id: number) {
	await prisma.todo.delete({ where: { id } });
	revalidatePath('/'); // Refresh homepage to remove deleted todo
}

export async function updateTodoTitle(id: number, title: string) {
	if (!title || title.trim() === '') {
		throw new Error('Title cannot be empty');
	}
	if (title.length > 30) {
		throw new Error('Title must be 30 characters or less');
	}
	const updated = await prisma.todo.update({
		where: { id },
		data: { title } // Update title
	});
	revalidatePath('/'); // Refresh homepage to show updated title
	return updated;
}

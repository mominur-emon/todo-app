'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function fetchTodos() {
	const todos = await prisma.todo.findMany({
		orderBy: { createdAt: 'desc' }
	});
	return todos;
}

export async function addTodo(title: string) {
	if (!title || title.trim() === '') {
		throw new Error('Title is required');
	}
	const todo = await prisma.todo.create({ data: { title } });
	revalidatePath('/'); 
	return todo;
}

export async function toggleTodo(id: number, completed: boolean) {
	const updated = await prisma.todo.update({
		where: { id },
		data: { completed }
	});
	revalidatePath('/');
	return updated;
}

export async function deleteTodo(id: number) {
	await prisma.todo.delete({ where: { id } });
	revalidatePath('/');
}

export async function updateTodoTitle(id: number, title: string) {
	if (!title || title.trim() === '') {
		throw new Error('Title cannot be empty');
	}
	const updated = await prisma.todo.update({
		where: { id },
		data: { title }
	});
	revalidatePath('/');
	return updated;
}

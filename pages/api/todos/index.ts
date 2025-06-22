import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'GET') {
		const todos = await prisma.todo.findMany({
			orderBy: { createdAt: 'desc' }
		});
		return res.status(200).json(todos);
	}

	if (req.method === 'POST') {
		const { title } = req.body;
		if (!title || title.trim() === '') {
			return res.status(400).json({ error: 'Title is required' });
		}
		const todo = await prisma.todo.create({ data: { title } });
		return res.status(201).json(todo);
	}

	res.setHeader('Allow', ['GET', 'POST']);
	res.status(405).end(`Method ${req.method} Not Allowed`);
}

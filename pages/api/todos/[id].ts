import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const id = Number(req.query.id);
	if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

	if (req.method === 'PUT') {
		const { completed, title } = req.body;

		// Validate if title is provided and is non-empty string if present
		if (
			title !== undefined &&
			typeof title === 'string' &&
			title.trim() === ''
		) {
			return res.status(400).json({ error: 'Title cannot be empty' });
		}

		const dataToUpdate: { completed?: boolean; title?: string } = {};
		if (completed !== undefined) dataToUpdate.completed = completed;
		if (title !== undefined) dataToUpdate.title = title;

		const todo = await prisma.todo.update({
			where: { id },
			data: dataToUpdate
		});
		return res.status(200).json(todo);
	}

	if (req.method === 'DELETE') {
		await prisma.todo.delete({ where: { id } });
		return res.status(204).end();
	}

	res.setHeader('Allow', ['PUT', 'DELETE']);
	res.status(405).end(`Method ${req.method} Not Allowed`);
}

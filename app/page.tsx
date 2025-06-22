import type { Metadata } from 'next';
import Todos from './components/Todos';

export const metadata: Metadata = {
	title: 'Todo App | Home',
	description: 'Simple and clean Todo application built with Next.js.'
};

export default function HomePage() {
	return (
		<div>
			<Todos />
		</div>
	);
}

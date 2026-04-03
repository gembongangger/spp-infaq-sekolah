import type { Handle } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

// Run database migrations on server start
import '$lib/server/db/migrate';

export const handle: Handle = async ({ event, resolve }) => {
	// Handle errors for API routes to always return JSON
	try {
		const response = await resolve(event);
		return response;
	} catch (error) {
		// If it's an API route, return JSON error
		if (event.url.pathname.startsWith('/api/')) {
			return json(
				{
					success: false,
					message: error instanceof Error ? error.message : 'Internal server error',
				},
				{ status: 500 }
			);
		}
		throw error;
	}
};

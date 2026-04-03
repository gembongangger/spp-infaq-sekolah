/**
 * GET /api/health - Health check endpoint
 */
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/server/db';

export const GET: RequestHandler = async () => {
	try {
		// Test database connection
		db.prepare('SELECT 1').get();

		return json(
			{
				success: true,
				message: 'API is running',
				database: 'connected',
			},
			{ status: 200 }
		);
	} catch (error) {
		return json(
			{
				success: false,
				message: (error as Error).message,
				database: 'disconnected',
			},
			{ status: 500 }
		);
	}
};

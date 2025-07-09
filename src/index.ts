/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Client } from 'pg';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// Create a new client instance for each request.
		console.log('CREATING CLIENT');

		const client = new Client({
			connectionString: env.WRANGLER_HYPERDRIVE_LOCAL_CONNECTION_STRING_CLOUDEATER,
		});

		try {
			// Connect to the database

			await client.connect();
			console.log('Connected to PostgreSQL database');

			// Perform a simple query
			const result = await client.query('SELECT * FROM users;');

			// Clean up the client after the response is returned, before the Worker is killed
			env.waitUntil(client.end());

			return Response.json({
				success: true,
				result: result.rows,
			});
		} catch (error: any) {
			console.error('Database error:', error.message);

			return Response.json(error);
		}
	},
};

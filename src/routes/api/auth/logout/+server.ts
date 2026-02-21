import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteSession, SESSION_COOKIE } from '$lib/server/auth';

export const prerender = false;

export const POST: RequestHandler = async ({ cookies, platform }) => {
	const sessionId = cookies.get(SESSION_COOKIE);
	const kv = platform?.env?.SUBSCRIBERS;

	if (sessionId && kv) {
		await deleteSession(kv, sessionId);
	}

	cookies.delete(SESSION_COOKIE, { path: '/' });

	return json({ ok: true });
};

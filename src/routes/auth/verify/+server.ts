import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { verifyMagicToken, createSession, SESSION_COOKIE } from '$lib/server/auth';

export const prerender = false;

export const GET: RequestHandler = async ({ url, platform, cookies }) => {
	const token = url.searchParams.get('token');

	if (!token) {
		return redirect(303, '/?auth=invalid');
	}

	const kv = platform?.env?.SUBSCRIBERS;
	if (!kv) {
		return redirect(303, '/?auth=error');
	}

	const email = await verifyMagicToken(kv, token);
	if (!email) {
		return redirect(303, '/?auth=expired');
	}

	const sessionId = await createSession(kv, email);

	cookies.set(SESSION_COOKIE, sessionId, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 30 // 30 days
	});

	return redirect(303, '/');
};

import type { Handle } from '@sveltejs/kit';
import { validateSession, SESSION_COOKIE } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(SESSION_COOKIE);
	const kv = event.platform?.env?.SUBSCRIBERS;

	if (sessionId && kv) {
		const email = await validateSession(kv, sessionId);
		if (email) {
			event.locals.user = { email };
		} else {
			// Invalid/expired session — clear the stale cookie
			event.cookies.delete(SESSION_COOKIE, { path: '/' });
		}
	}

	return resolve(event);
};

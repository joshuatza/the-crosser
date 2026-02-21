const MAGIC_PREFIX = 'magic_';
const SESSION_PREFIX = 'session_';
const MAGIC_TTL = 60 * 15; // 15 minutes
const SESSION_TTL = 60 * 60 * 24 * 30; // 30 days

export function generateMagicToken() {
	return crypto.randomUUID();
}

export function generateSessionId() {
	return crypto.randomUUID();
}

export async function storeMagicToken(kv: KVNamespace, token: string, email: string) {
	await kv.put(`${MAGIC_PREFIX}${token}`, JSON.stringify({ email }), {
		expirationTtl: MAGIC_TTL
	});
}

export async function verifyMagicToken(kv: KVNamespace, token: string): Promise<string | null> {
	const data = await kv.get(`${MAGIC_PREFIX}${token}`);
	if (!data) return null;
	// Delete token after use (single-use)
	await kv.delete(`${MAGIC_PREFIX}${token}`);
	const { email } = JSON.parse(data);
	return email;
}

export async function createSession(kv: KVNamespace, email: string): Promise<string> {
	const id = generateSessionId();
	await kv.put(`${SESSION_PREFIX}${id}`, JSON.stringify({ email }), {
		expirationTtl: SESSION_TTL
	});
	return id;
}

export async function validateSession(kv: KVNamespace, sessionId: string): Promise<string | null> {
	const data = await kv.get(`${SESSION_PREFIX}${sessionId}`);
	if (!data) return null;
	const { email } = JSON.parse(data);
	return email;
}

export async function deleteSession(kv: KVNamespace, sessionId: string) {
	await kv.delete(`${SESSION_PREFIX}${sessionId}`);
}

export const SESSION_COOKIE = 'crosser-session';

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const prerender = false;

const CLOUDFLARE_ORIGIN = 'https://the-crosser.pages.dev';

export const POST: RequestHandler = async ({ request, platform }) => {
	try {
		const body = await request.json();
		const { email, honeypot } = body;

		if (honeypot) {
			return json({ ok: true });
		}

		if (!email || !email.includes('@')) {
			return json({ error: 'Invalid email' }, { status: 400 });
		}

		const kv = platform?.env?.SUBSCRIBERS;
		if (kv) {
			await kv.put(email, JSON.stringify({
				email,
				subscribedAt: new Date().toISOString(),
				source: 'chapter-menu'
			}));
		} else {
			// Not on Cloudflare — proxy to primary deployment
			const res = await fetch(`${CLOUDFLARE_ORIGIN}/api/notify`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});

			if (!res.ok) {
				const data = await res.json();
				return json(data, { status: res.status });
			}
		}

		return json({ ok: true });
	} catch (e: any) {
		console.error('Notify error:', e?.message || e);
		return json({ error: 'Failed to subscribe', detail: e?.message || String(e) }, { status: 500 });
	}
};

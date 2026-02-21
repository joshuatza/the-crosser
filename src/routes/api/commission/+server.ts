import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const prerender = false;

const CLOUDFLARE_ORIGIN = 'https://the-crosser.pages.dev';

export const POST: RequestHandler = async ({ request, platform, locals }) => {
	try {
		const body = await request.json();
		const { name, email, story, experience, price, honeypot } = body;

		if (honeypot) {
			return json({ ok: true });
		}

		if (!locals.user) {
			return json({ error: 'Please sign in first.' }, { status: 401 });
		}

		if (!name || !email || !story || !price) {
			return json({ error: 'Please fill in all required fields.' }, { status: 400 });
		}

		const kv = platform?.env?.SUBSCRIBERS;

		if (kv) {
			// Store commission in KV
			const id = `commission_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
			await kv.put(id, JSON.stringify({
				name,
				email,
				subscriberEmail: locals.user.email,
				story,
				experience,
				price,
				submittedAt: new Date().toISOString()
			}));
		} else {
			// Not on Cloudflare — proxy to primary deployment
			const res = await fetch(`${CLOUDFLARE_ORIGIN}/api/commission`, {
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
	} catch (e) {
		console.error('Commission error:', e);
		return json({ error: 'Failed to submit. Please try again.' }, { status: 500 });
	}
};

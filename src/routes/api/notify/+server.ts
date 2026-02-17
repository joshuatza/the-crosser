import { json } from '@sveltejs/kit';
import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';

const resend = new Resend(RESEND_API_KEY);
const CLOUDFLARE_ORIGIN = 'https://the-crosser.pages.dev';

export const POST: RequestHandler = async ({ request, platform }) => {
	try {
		const body = await request.json();
		const { email, honeypot } = body;

		// Honeypot check
		if (honeypot) {
			return json({ ok: true });
		}

		if (!email || !email.includes('@')) {
			return json({ error: 'Invalid email' }, { status: 400 });
		}

		// If running on Cloudflare — store in KV directly
		const kv = platform?.env?.SUBSCRIBERS;
		if (kv) {
			await kv.put(email, JSON.stringify({
				email,
				subscribedAt: new Date().toISOString(),
				source: 'chapter-menu'
			}));

			// Send notification email
			await resend.emails.send({
				from: 'The Crosser <onboarding@resend.dev>',
				to: 'joshuatwycross@gmail.com',
				subject: 'New chapter notification signup',
				html: `
					<p>Someone wants to be notified when the next chapter drops.</p>
					<p><strong>Email:</strong> ${email}</p>
				`
			});
		} else {
			// Not on Cloudflare (Vercel, etc.) — proxy to Cloudflare for KV storage + email
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
	} catch (e) {
		console.error('Notify error:', e);
		return json({ error: 'Failed to subscribe' }, { status: 500 });
	}
};

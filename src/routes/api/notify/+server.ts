import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const prerender = false;

const CLOUDFLARE_ORIGIN = 'https://the-crosser.pages.dev';

async function sendWelcomeEmail(email: string, apiKey: string) {
	const res = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${apiKey}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			from: 'The Crosser <noreply@jtstack.org>',
			to: email,
			subject: 'Welcome to The Crosser',
			html: `
				<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
					<h1 style="font-size: 24px; margin-bottom: 16px;">Welcome to The Crosser</h1>
					<p>Thanks for subscribing. You'll be the first to know when new chapters are released.</p>
					<p>In the meantime, if you'd like a personalised story, you can <a href="https://the-crosser.pages.dev/commission" style="color: #8b5cf6;">commission one here</a>.</p>
					<p style="margin-top: 32px; color: #666; font-size: 14px;">— The Crosser</p>
				</div>
			`
		})
	});

	if (!res.ok) {
		const err = await res.text();
		console.error('Resend error:', err);
	}
}

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
		const resendKey = platform?.env?.RESEND_API_KEY;

		if (kv) {
			const existing = await kv.get(email);
			await kv.put(email, JSON.stringify({
				email,
				subscribedAt: new Date().toISOString(),
				source: 'chapter-menu'
			}));

			// Only send welcome email to new subscribers
			if (!existing && resendKey) {
				await sendWelcomeEmail(email, resendKey);
			}
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

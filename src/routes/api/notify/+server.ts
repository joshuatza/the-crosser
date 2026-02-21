import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateMagicToken, storeMagicToken } from '$lib/server/auth';

export const prerender = false;

const SITE_URL = 'https://the-crosser.pages.dev';

async function sendMagicLinkEmail(email: string, magicLink: string, isNew: boolean, apiKey: string) {
	const subject = isNew ? 'Welcome to The Crosser' : 'Sign in to The Crosser';
	const greeting = isNew
		? `<p>Thanks for subscribing. You'll be the first to know when new chapters are released.</p>`
		: `<p>Welcome back. Click below to sign in.</p>`;

	const res = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${apiKey}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			from: 'The Crosser <noreply@jtstack.org>',
			to: email,
			subject,
			html: `
				<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
					<h1 style="font-size: 24px; margin-bottom: 16px;">${subject}</h1>
					${greeting}
					<p>
						<a href="${magicLink}" style="display: inline-block; padding: 12px 24px; background: #1a1a1a; color: #c4a265; text-decoration: none; border-radius: 3px; font-size: 14px; letter-spacing: 0.1em;">Sign in to The Crosser</a>
					</p>
					<p style="margin-top: 24px; color: #666; font-size: 13px;">This link expires in 15 minutes. If you didn't request this, you can ignore this email.</p>
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

			// Store subscriber if new
			if (!existing) {
				await kv.put(email, JSON.stringify({
					email,
					subscribedAt: new Date().toISOString(),
					source: 'chapter-menu'
				}));
			}

			// Generate and send magic link for both new and returning users
			if (resendKey) {
				const token = generateMagicToken();
				await storeMagicToken(kv, token, email);
				const magicLink = `${SITE_URL}/auth/verify?token=${token}`;
				await sendMagicLinkEmail(email, magicLink, !existing, resendKey);
			}

			return json({ ok: true, existing: !!existing });
		} else {
			// Not on Cloudflare — proxy to primary deployment
			const res = await fetch(`${SITE_URL}/api/notify`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});

			if (!res.ok) {
				const data = await res.json();
				return json(data, { status: res.status });
			}

			const data = await res.json();
			return json(data);
		}
	} catch (e: any) {
		console.error('Notify error:', e?.message || e);
		return json({ error: 'Failed to subscribe', detail: e?.message || String(e) }, { status: 500 });
	}
};

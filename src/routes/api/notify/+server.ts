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

			// Notify Joshua
			await resend.emails.send({
				from: 'The Crosser <onboarding@resend.dev>',
				to: 'joshuatwycross@gmail.com',
				subject: 'New chapter notification signup',
				html: `
					<p>Someone wants to be notified when the next chapter drops.</p>
					<p><strong>Email:</strong> ${email}</p>
				`
			});

			// Welcome email to subscriber
			await resend.emails.send({
				from: 'The Crosser <onboarding@resend.dev>',
				to: email,
				subject: 'You\'re in — The Crosser',
				html: `
					<div style="font-family: Georgia, serif; color: #e8e0d0; background: #0a0a0f; padding: 2.5rem; max-width: 520px;">
						<h2 style="font-weight: 300; letter-spacing: 0.05em; color: #e8e0d0; margin-bottom: 1.5rem;">Welcome, Crosser.</h2>
						<p style="line-height: 1.8; color: #999;">
							You'll be the first to know when the next chapter is released.
						</p>
						<p style="line-height: 1.8; color: #999; margin-top: 1.5rem;">
							In the meantime — want an interactive story like this written about <em style="color: #c4a265;">your</em> life?
						</p>
						<p style="margin-top: 1.5rem;">
							<a href="${CLOUDFLARE_ORIGIN}/commission" style="color: #c4a265; text-decoration: none; border-bottom: 1px solid rgba(196,162,101,0.3); padding-bottom: 2px;">
								Tell me your story →
							</a>
						</p>
						<p style="line-height: 1.8; color: #c4a265; margin-top: 2rem; font-style: italic;">
							Every story deserves to be carried.
						</p>
						<p style="line-height: 1.8; color: #999; margin-top: 1.5rem;">— Joshua</p>
					</div>
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

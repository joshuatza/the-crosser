import { json } from '@sveltejs/kit';
import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';

const resend = new Resend(RESEND_API_KEY);
const CLOUDFLARE_ORIGIN = 'https://the-crosser.pages.dev';

export const POST: RequestHandler = async ({ request, platform }) => {
	try {
		const body = await request.json();
		const { name, email, subscriberEmail, story, experience, price, honeypot } = body;

		if (honeypot) {
			return json({ ok: true });
		}

		if (!name || !email || !story || !price) {
			return json({ error: 'Please fill in all required fields.' }, { status: 400 });
		}

		const kv = platform?.env?.SUBSCRIBERS;

		if (kv) {
			// Verify subscriber exists
			const sub = await kv.get(subscriberEmail || email);
			if (!sub) {
				return json({ error: 'Subscriber not found. Please sign up for notifications first.' }, { status: 403 });
			}

			// Store commission in KV
			const id = `commission_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
			await kv.put(id, JSON.stringify({
				name,
				email,
				subscriberEmail,
				story,
				experience,
				price,
				submittedAt: new Date().toISOString()
			}));

			// Email 1: Notify Joshua
			await resend.emails.send({
				from: 'The Crosser <onboarding@resend.dev>',
				to: 'joshuatwycross@gmail.com',
				subject: `New story commission from ${name}`,
				html: `
					<h2>New Story Commission</h2>
					<p><strong>Name:</strong> ${name}</p>
					<p><strong>Email:</strong> ${email}</p>
					<p><strong>Named price:</strong> ${price}</p>
					<hr style="border: none; border-top: 1px solid #333; margin: 1.5rem 0;" />
					<p><strong>Their story:</strong></p>
					<p style="white-space: pre-wrap; line-height: 1.6;">${story}</p>
					${experience ? `
						<hr style="border: none; border-top: 1px solid #333; margin: 1.5rem 0;" />
						<p><strong>Experience they want:</strong></p>
						<p style="white-space: pre-wrap; line-height: 1.6;">${experience}</p>
					` : ''}
				`
			});

			// Email 2: Confirmation to the requester
			await resend.emails.send({
				from: 'The Crosser <onboarding@resend.dev>',
				to: email,
				subject: 'Your story request has been received',
				html: `
					<div style="font-family: Georgia, serif; color: #e8e0d0; background: #0a0a0f; padding: 2.5rem; max-width: 520px;">
						<h2 style="font-weight: 300; letter-spacing: 0.05em; color: #e8e0d0; margin-bottom: 1.5rem;">Your Story Request</h2>
						<p style="line-height: 1.8; color: #999;">Hi ${name},</p>
						<p style="line-height: 1.8; color: #999;">
							Thank you for trusting me with your story. I've received your request and will review it carefully.
						</p>
						<p style="line-height: 1.8; color: #999;">
							I'll be in touch soon to discuss the next steps.
						</p>
						<p style="line-height: 1.8; color: #c4a265; margin-top: 2rem; font-style: italic;">
							Every story deserves to be carried.
						</p>
						<p style="line-height: 1.8; color: #999; margin-top: 1.5rem;">— Joshua</p>
					</div>
				`
			});
		} else {
			// Not on Cloudflare — proxy to Cloudflare
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

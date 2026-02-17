import { json } from '@sveltejs/kit';
import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';

const resend = new Resend(RESEND_API_KEY);

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { email, honeypot } = await request.json();

		// Honeypot check
		if (honeypot) {
			return json({ ok: true });
		}

		if (!email || !email.includes('@')) {
			return json({ error: 'Invalid email' }, { status: 400 });
		}

		await resend.emails.send({
			from: 'The Crosser <onboarding@resend.dev>',
			to: 'joshuatwycross@gmail.com',
			subject: 'New chapter notification signup',
			html: `
				<p>Someone wants to be notified when the next chapter drops.</p>
				<p><strong>Email:</strong> ${email}</p>
			`
		});

		return json({ ok: true });
	} catch (e) {
		console.error('Resend error:', e);
		return json({ error: 'Failed to subscribe' }, { status: 500 });
	}
};

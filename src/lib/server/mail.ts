// Send email via MailChannels (free for Cloudflare Workers/Pages)
export async function sendEmail(opts: {
	to: string;
	from: string;
	fromName: string;
	subject: string;
	html: string;
}) {
	const res = await fetch('https://api.mailchannels.net/tx/v1/send', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			personalizations: [{ to: [{ email: opts.to }] }],
			from: { email: opts.from, name: opts.fromName },
			subject: opts.subject,
			content: [{ type: 'text/html', value: opts.html }]
		})
	});

	if (!res.ok) {
		const text = await res.text();
		console.error('MailChannels error:', res.status, text);
		throw new Error(`Email send failed: ${res.status}`);
	}
}

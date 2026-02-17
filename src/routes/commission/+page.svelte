<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let authorized = false;
	let subscriberEmail = '';

	let name = '';
	let email = '';
	let story = '';
	let experience = '';
	let price = '';
	let honeypot = '';

	let submitting = false;
	let submitted = false;
	let error = '';

	onMount(() => {
		const stored = localStorage.getItem('crosser-notify-signed-up');
		if (!stored) {
			goto('/');
			return;
		}
		authorized = true;
		subscriberEmail = stored;
		email = stored;
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';

		if (honeypot) return;
		if (!name.trim() || !email.trim() || !story.trim() || !price.trim()) {
			error = 'Please fill in all required fields.';
			return;
		}

		submitting = true;
		try {
			const res = await fetch('/api/commission', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: name.trim(),
					email: email.trim(),
					subscriberEmail,
					story: story.trim(),
					experience: experience.trim(),
					price: price.trim(),
					honeypot
				})
			});

			if (!res.ok) {
				const data = await res.json();
				error = data.error || 'Something went wrong.';
				return;
			}

			submitted = true;
		} catch (_) {
			error = 'Something went wrong. Please try again.';
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Commission a Story — The Crosser</title>
</svelte:head>

{#if !authorized}
	<div class="page">
		<div class="loading">Verifying access...</div>
	</div>
{:else if submitted}
	<div class="page">
		<div class="confirmation">
			<h1>Received</h1>
			<p class="confirm-body">
				Your story request has been sent. You'll receive a confirmation email shortly.
			</p>
			<p class="confirm-sub">Joshua will review your submission and be in touch.</p>
			<a href="/" class="back-link">Return to The Crosser</a>
		</div>
	</div>
{:else}
	<div class="page">
		<div class="form-container">
			<a href="/" class="back-link top">← Back to The Crosser</a>

			<h1>Your Story, Made Real</h1>
			<p class="intro">
				Want an interactive visual story like this — but about <em>your</em> life, your journey, your truth?
				Tell me what matters to you and name what it's worth to you.
			</p>

			<form on:submit={handleSubmit}>
				<!-- Honeypot -->
				<input type="text" name="website" bind:value={honeypot} class="hp" tabindex="-1" autocomplete="off" />

				<div class="field">
					<label for="name">Your name <span class="req">*</span></label>
					<input id="name" type="text" bind:value={name} placeholder="First name or full name" disabled={submitting} />
				</div>

				<div class="field">
					<label for="email">Your email <span class="req">*</span></label>
					<input id="email" type="email" bind:value={email} placeholder="you@email.com" disabled={submitting} />
				</div>

				<div class="field">
					<label for="story">What's your story about? <span class="req">*</span></label>
					<textarea id="story" bind:value={story} rows="5" placeholder="The moments, the people, the turning points — whatever feels true. This doesn't need to be polished. Just real." disabled={submitting}></textarea>
				</div>

				<div class="field">
					<label for="experience">What kind of experience do you imagine?</label>
					<textarea id="experience" bind:value={experience} rows="3" placeholder="Interactive story like The Crosser? A shorter piece? Music, no music? Any mood or feeling you want it to carry?" disabled={submitting}></textarea>
				</div>

				<div class="field">
					<label for="price">Name your price <span class="req">*</span></label>
					<input id="price" type="text" bind:value={price} placeholder="What feels right to you — any currency, any amount" disabled={submitting} />
					<span class="field-note">There's no fixed price. Pay what the story is worth to you.</span>
				</div>

				{#if error}
					<div class="error">{error}</div>
				{/if}

				<button type="submit" class="submit-btn" disabled={submitting}>
					{submitting ? 'Sending...' : 'Submit your story request'}
				</button>
			</form>
		</div>
	</div>
{/if}

<style>
	.page {
		min-height: 100vh;
		background: var(--dark);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	.loading {
		font-family: 'Outfit', sans-serif;
		font-size: 0.8rem;
		color: var(--grey);
		letter-spacing: 0.2em;
	}

	.form-container {
		max-width: 560px;
		width: 100%;
		padding: 2rem 0;
	}

	h1 {
		font-family: 'Cormorant Garamond', serif;
		font-size: clamp(1.8rem, 4vw, 2.5rem);
		font-weight: 300;
		color: var(--cream);
		margin-bottom: 1rem;
		letter-spacing: 0.02em;
	}

	.intro {
		font-family: 'Cormorant Garamond', serif;
		font-size: 1.1rem;
		font-weight: 300;
		line-height: 1.8;
		color: var(--grey);
		margin-bottom: 2.5rem;
	}

	.intro em {
		color: var(--gold);
		font-style: italic;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.hp {
		position: absolute;
		left: -9999px;
		opacity: 0;
		height: 0;
		width: 0;
		pointer-events: none;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	label {
		font-family: 'Outfit', sans-serif;
		font-size: 0.7rem;
		font-weight: 300;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--grey);
	}

	.req {
		color: var(--gold);
	}

	input[type="text"],
	input[type="email"],
	textarea {
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 3px;
		padding: 0.75rem 0.9rem;
		font-family: 'Cormorant Garamond', serif;
		font-size: 1rem;
		font-weight: 300;
		color: var(--cream);
		outline: none;
		transition: border-color 0.3s ease;
		resize: vertical;
	}

	input::placeholder,
	textarea::placeholder {
		color: rgba(255, 255, 255, 0.15);
		font-style: italic;
	}

	input:focus,
	textarea:focus {
		border-color: rgba(196, 162, 101, 0.3);
	}

	.field-note {
		font-family: 'Outfit', sans-serif;
		font-size: 0.6rem;
		font-weight: 200;
		letter-spacing: 0.1em;
		color: rgba(255, 255, 255, 0.25);
		margin-top: 0.2rem;
	}

	.error {
		font-family: 'Outfit', sans-serif;
		font-size: 0.7rem;
		color: #d6075c;
		opacity: 0.8;
	}

	.submit-btn {
		margin-top: 1rem;
		padding: 1rem 2rem;
		background: transparent;
		border: 1px solid rgba(196, 162, 101, 0.3);
		border-radius: 3px;
		font-family: 'Outfit', sans-serif;
		font-size: 0.75rem;
		font-weight: 300;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--gold);
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.submit-btn:hover {
		background: rgba(196, 162, 101, 0.08);
		border-color: var(--gold);
	}

	.submit-btn:disabled {
		opacity: 0.4;
		cursor: default;
	}

	.back-link {
		font-family: 'Outfit', sans-serif;
		font-size: 0.65rem;
		font-weight: 300;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--grey);
		text-decoration: none;
		transition: color 0.3s ease;
	}

	.back-link:hover {
		color: var(--gold);
	}

	.back-link.top {
		display: inline-block;
		margin-bottom: 2.5rem;
	}

	/* Confirmation */
	.confirmation {
		text-align: center;
		max-width: 480px;
	}

	.confirmation h1 {
		font-size: clamp(2rem, 5vw, 3rem);
		margin-bottom: 1.5rem;
	}

	.confirm-body {
		font-family: 'Cormorant Garamond', serif;
		font-size: 1.15rem;
		font-weight: 300;
		line-height: 1.8;
		color: var(--cream);
		margin-bottom: 0.8rem;
	}

	.confirm-sub {
		font-family: 'Outfit', sans-serif;
		font-size: 0.7rem;
		font-weight: 200;
		letter-spacing: 0.15em;
		color: var(--grey);
		margin-bottom: 2.5rem;
	}

	@media (max-width: 600px) {
		.page {
			padding: 1.5rem;
			align-items: flex-start;
			padding-top: 3rem;
		}
	}
</style>

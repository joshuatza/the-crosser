<script lang="ts">
	import { page } from '$app/stores';
	import { goToScene } from '$lib/stores/scene';
	import { invalidateAll } from '$app/navigation';

	let open = false;
	let email = '';
	let honeypot = '';
	let magicLinkSent = false;
	let submitting = false;
	let signingOut = false;
	let error = '';

	$: user = $page.data.user;

	function toggle() {
		open = !open;
	}

	function close() {
		open = false;
	}

	function selectChapter(sceneIndex: number) {
		goToScene(sceneIndex);
		close();
	}

	async function handleNotify(e: Event) {
		e.preventDefault();
		error = '';

		if (honeypot) return;

		if (!email || !email.includes('@')) {
			error = 'Please enter a valid email.';
			return;
		}

		submitting = true;
		try {
			const res = await fetch('/api/notify', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, honeypot })
			});

			if (!res.ok) {
				const data = await res.json();
				error = data.error || 'Something went wrong. Try again.';
				return;
			}

			magicLinkSent = true;
		} catch (_) {
			error = 'Something went wrong. Try again.';
		} finally {
			submitting = false;
		}
	}

	async function handleSignOut() {
		signingOut = true;
		try {
			await fetch('/api/auth/logout', { method: 'POST' });
			await invalidateAll();
		} finally {
			signingOut = false;
		}
	}

	const chapters = [
		{ title: 'Chapter One', subtitle: 'The Boy Who Was Removed', scene: 1, locked: false },
		{ title: 'Chapter Two', subtitle: 'Coming Soon', scene: null, locked: true },
		{ title: 'Chapter Three', subtitle: 'Coming Soon', scene: null, locked: true },
	];
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if open}
	<div class="overlay" on:click={close}></div>
{/if}

<div class="menu-wrapper">
	<button class="burger" on:click|stopPropagation={toggle} class:open>
		<span></span>
		<span></span>
		<span></span>
	</button>

	{#if open}
		<nav class="panel">
			<div class="panel-title">Chapters</div>
			<div class="chapter-list">
				{#each chapters as chapter}
					{#if chapter.locked}
						<div class="chapter-item locked">
							<div class="chapter-name">
								<span class="lock">&#x1F512;</span>
								{chapter.title}
							</div>
							<div class="chapter-subtitle">{chapter.subtitle}</div>
						</div>
					{:else}
						<button
							class="chapter-item"
							on:click|stopPropagation={() => selectChapter(chapter.scene!)}
						>
							<div class="chapter-name">{chapter.title}</div>
							<div class="chapter-subtitle">{chapter.subtitle}</div>
						</button>
					{/if}
				{/each}
			</div>

			<div class="notify-section">
				{#if user}
					<div class="notify-label">Signed in</div>
					<div class="signed-in-email">{user.email}</div>
					<a href="/commission" class="commission-link" on:click|stopPropagation={close}>
						Want your own story like this?
					</a>
					<button class="sign-out-btn" on:click|stopPropagation={handleSignOut} disabled={signingOut}>
						{signingOut ? '...' : 'Sign out'}
					</button>
				{:else if magicLinkSent}
					<div class="notify-label">Check your email</div>
					<div class="notify-thanks">We sent a sign-in link to {email}</div>
				{:else}
					<div class="notify-label">Sign in</div>
					<form class="notify-form" on:submit={handleNotify}>
						<input
							type="text"
							name="website"
							bind:value={honeypot}
							class="hp"
							tabindex="-1"
							autocomplete="off"
						/>
						<input
							type="email"
							bind:value={email}
							placeholder="your@email.com"
							class="notify-input"
							disabled={submitting}
						/>
						<button type="submit" class="notify-btn" disabled={submitting}>
							{submitting ? '...' : 'Sign in / Subscribe'}
						</button>
						{#if error}
							<div class="notify-error">{error}</div>
						{/if}
					</form>
				{/if}
			</div>
		</nav>
	{/if}
</div>

<style>
	.overlay {
		position: fixed;
		inset: 0;
		z-index: 29;
	}

	.menu-wrapper {
		position: fixed;
		top: 1.5rem;
		left: 1.5rem;
		z-index: 30;
	}

	.burger {
		background: transparent;
		border: none;
		cursor: pointer;
		width: 32px;
		height: 24px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 0;
		transition: opacity 0.3s ease;
		opacity: 0.35;
	}

	.burger:hover {
		opacity: 0.8;
	}

	.burger span {
		display: block;
		width: 100%;
		height: 1px;
		background: var(--cream);
		transition: all 0.3s ease;
		transform-origin: center;
	}

	.burger.open {
		opacity: 0.8;
	}

	.burger.open span:nth-child(1) {
		transform: translateY(11px) rotate(45deg);
	}

	.burger.open span:nth-child(2) {
		opacity: 0;
	}

	.burger.open span:nth-child(3) {
		transform: translateY(-11px) rotate(-45deg);
	}

	.panel {
		position: absolute;
		top: 3rem;
		left: 0;
		background: rgba(10, 10, 15, 0.92);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: 4px;
		padding: 1.5rem;
		min-width: 260px;
		animation: slideIn 0.3s ease;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.panel-title {
		font-family: 'Outfit', sans-serif;
		font-size: 0.6rem;
		font-weight: 300;
		letter-spacing: 0.3em;
		text-transform: uppercase;
		color: var(--grey);
		margin-bottom: 1.2rem;
		padding-bottom: 0.8rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.chapter-list {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.chapter-item {
		display: block;
		width: 100%;
		text-align: left;
		background: transparent;
		border: none;
		padding: 0.75rem 0.5rem;
		border-radius: 3px;
		cursor: pointer;
		transition: background 0.2s ease;
		color: var(--cream);
	}

	.chapter-item:not(.locked):hover {
		background: rgba(196, 162, 101, 0.08);
	}

	.chapter-item.locked {
		cursor: default;
		opacity: 0.35;
	}

	.chapter-name {
		font-family: 'Outfit', sans-serif;
		font-size: 0.8rem;
		font-weight: 300;
		letter-spacing: 0.1em;
		color: var(--cream);
	}

	.lock {
		font-size: 0.65rem;
		margin-right: 0.4rem;
	}

	.chapter-subtitle {
		font-family: 'Cormorant Garamond', serif;
		font-size: 0.8rem;
		font-style: italic;
		color: var(--grey);
		margin-top: 0.25rem;
	}

	.notify-section {
		margin-top: 1.2rem;
		padding-top: 1rem;
		border-top: 1px solid rgba(255, 255, 255, 0.06);
	}

	.notify-label {
		font-family: 'Outfit', sans-serif;
		font-size: 0.6rem;
		font-weight: 300;
		letter-spacing: 0.3em;
		text-transform: uppercase;
		color: var(--grey);
		margin-bottom: 0.8rem;
	}

	.notify-form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.hp {
		position: absolute;
		left: -9999px;
		opacity: 0;
		height: 0;
		width: 0;
		pointer-events: none;
	}

	.notify-input {
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 3px;
		padding: 0.55rem 0.7rem;
		font-family: 'Outfit', sans-serif;
		font-size: 0.75rem;
		font-weight: 300;
		color: var(--cream);
		outline: none;
		transition: border-color 0.3s ease;
	}

	.notify-input::placeholder {
		color: rgba(255, 255, 255, 0.2);
	}

	.notify-input:focus {
		border-color: rgba(196, 162, 101, 0.3);
	}

	.notify-btn {
		background: transparent;
		border: 1px solid rgba(196, 162, 101, 0.25);
		border-radius: 3px;
		padding: 0.45rem 0.7rem;
		font-family: 'Outfit', sans-serif;
		font-size: 0.65rem;
		font-weight: 300;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--gold);
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.notify-btn:hover {
		background: rgba(196, 162, 101, 0.08);
		border-color: var(--gold);
	}

	.notify-btn:disabled {
		opacity: 0.4;
		cursor: default;
	}

	.notify-thanks {
		font-family: 'Cormorant Garamond', serif;
		font-size: 0.85rem;
		font-style: italic;
		color: var(--gold);
		opacity: 0.7;
	}

	.notify-error {
		font-family: 'Outfit', sans-serif;
		font-size: 0.65rem;
		color: #d6075c;
		opacity: 0.8;
	}

	.commission-link {
		display: inline-block;
		margin-top: 1rem;
		padding: 0.5rem 0.8rem;
		font-family: 'Cormorant Garamond', serif;
		font-size: 0.85rem;
		font-style: italic;
		color: var(--gold);
		text-decoration: none;
		border: 1px solid rgba(196, 162, 101, 0.2);
		border-radius: 3px;
		transition: all 0.3s ease;
	}

	.commission-link:hover {
		background: rgba(196, 162, 101, 0.08);
		border-color: var(--gold);
	}

	.signed-in-email {
		font-family: 'Outfit', sans-serif;
		font-size: 0.7rem;
		font-weight: 300;
		color: var(--grey);
		margin-bottom: 0.8rem;
		word-break: break-all;
	}

	.sign-out-btn {
		display: block;
		margin-top: 0.8rem;
		background: transparent;
		border: none;
		padding: 0;
		font-family: 'Outfit', sans-serif;
		font-size: 0.6rem;
		font-weight: 300;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--grey);
		cursor: pointer;
		opacity: 0.5;
		transition: opacity 0.3s ease;
	}

	.sign-out-btn:hover {
		opacity: 1;
	}

	.sign-out-btn:disabled {
		cursor: default;
		opacity: 0.3;
	}
</style>

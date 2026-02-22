<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import { journeyStarted } from '$lib/stores/scene';

	const dispatch = createEventDispatcher<{ start: void }>();

	function start() {
		dispatch('start');
		journeyStarted.set(true);
	}
</script>

{#if !$journeyStarted}
	<div class="preloader" transition:fade={{ duration: 1200 }}>
		<h1>The Crosser</h1>
		<p>A Story of Blood, Exile, and Becoming</p>
		<button class="start-btn" on:click={start}>Begin the Crossing</button>
		<div class="audio-note">Best experienced with headphones</div>
	</div>
{/if}

<style>
	.preloader {
		position: fixed;
		inset: 0;
		background: var(--dark);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index: 9999;
	}

	h1 {
		font-size: clamp(2rem, 6vw, 4.5rem);
		font-weight: 300;
		letter-spacing: 0.3em;
		text-transform: uppercase;
		color: var(--cream);
		animation: breathe 3s ease-in-out infinite;
	}

	p {
		margin-top: 1.5rem;
		font-size: 1rem;
		font-style: italic;
		color: var(--grey);
		letter-spacing: 0.1em;
	}

	.start-btn {
		margin-top: 3rem;
		padding: 14px 48px;
		background: transparent;
		border: 1px solid var(--gold);
		color: var(--gold);
		font-family: 'Outfit', sans-serif;
		font-size: 0.85rem;
		font-weight: 300;
		letter-spacing: 0.25em;
		text-transform: uppercase;
		cursor: pointer;
		transition: all 0.4s ease;
	}

	.start-btn:hover {
		background: var(--gold);
		color: var(--dark);
	}

	.audio-note {
		margin-top: 1rem;
		font-family: 'Outfit', sans-serif;
		font-size: 0.65rem;
		font-weight: 200;
		letter-spacing: 0.15em;
		color: rgba(255,255,255,0.25);
		text-transform: uppercase;
	}

	@keyframes breathe {
		0%, 100% { opacity: 0.6; }
		50% { opacity: 1; }
	}
</style>

<script lang="ts">
	import { currentScene, transitioning } from '$lib/stores/scene';
	import { scenes } from '$lib/data/scenes';

	$: scene = scenes[$currentScene];

	let visible = false;
	let textEl: HTMLDivElement;

	// Re-trigger animation on scene change
	$: if (scene) {
		visible = false;
		// Use microtask to ensure the DOM updates before re-showing
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				visible = true;
			});
		});
	}
</script>

<div class="scene-container">
	<div
		bind:this={textEl}
		class="scene-text"
		class:visible
		class:exit={$transitioning}
	>
		{@html scene.content}
	</div>
</div>

<style>
	.scene-container {
		position: fixed;
		inset: 0;
		z-index: 3;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		padding-bottom: 6rem;
	}

	.scene-text {
		max-width: 680px;
		text-align: center;
		opacity: 0;
		transform: translateY(20px);
		transition: opacity 1.2s ease, transform 1.2s ease;
	}

	.scene-text.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.scene-text.exit {
		opacity: 0;
		transform: translateY(-20px);
		transition: opacity 0.6s ease, transform 0.6s ease;
	}

	:global(.scene-heading) {
		font-family: 'Outfit', sans-serif;
		font-size: clamp(0.65rem, 1.5vw, 0.8rem);
		font-weight: 300;
		letter-spacing: 0.35em;
		text-transform: uppercase;
		color: var(--grey);
		margin-bottom: 2rem;
	}

	:global(.scene-body) {
		font-size: clamp(1.15rem, 2.5vw, 1.55rem);
		font-weight: 300;
		line-height: 1.9;
		color: var(--cream);
		letter-spacing: 0.01em;
	}

	:global(.scene-body em) {
		color: var(--gold);
		font-style: italic;
	}

	:global(.scene-body strong) {
		font-weight: 600;
		color: #fff;
	}

	:global(.scene-quote) {
		font-size: clamp(1.3rem, 3vw, 1.8rem);
		font-weight: 300;
		font-style: italic;
		line-height: 1.7;
		color: #fff;
		letter-spacing: 0.02em;
	}

	:global(.scene-attribution) {
		font-family: 'Outfit', sans-serif;
		font-size: 0.75rem;
		font-weight: 200;
		letter-spacing: 0.2em;
		color: var(--grey);
		margin-top: 1rem;
		text-transform: uppercase;
	}

	@media (max-width: 600px) {
		.scene-container {
			padding: 1.5rem;
			padding-bottom: 7rem;
		}
	}
</style>

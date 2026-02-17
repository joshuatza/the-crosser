<script lang="ts">
	import { currentScene, nextScene, prevScene, totalScenes } from '$lib/stores/scene';
	import { scenes } from '$lib/data/scenes';
</script>

<div class="controls">
	<button class="nav-btn" on:click={prevScene} disabled={$currentScene === 0}>
		&#8592;
	</button>
	<span class="scene-counter">{$currentScene + 1} / {totalScenes}</span>
	<button class="nav-btn" on:click={nextScene} disabled={$currentScene === scenes.length - 1}>
		&#8594;
	</button>
</div>

<style>
	.controls {
		position: fixed;
		bottom: 4.5rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 10;
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.nav-btn {
		background: transparent;
		border: 1px solid rgba(255,255,255,0.15);
		color: var(--cream);
		width: 44px;
		height: 44px;
		border-radius: 50%;
		cursor: pointer;
		font-size: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
	}

	.nav-btn:hover {
		border-color: var(--gold);
		color: var(--gold);
	}

	.nav-btn:disabled {
		opacity: 0.2;
		cursor: default;
	}

	.scene-counter {
		font-family: 'Outfit', sans-serif;
		font-size: 0.7rem;
		font-weight: 200;
		letter-spacing: 0.15em;
		color: var(--grey);
		min-width: 60px;
		text-align: center;
	}

	@media (max-width: 600px) {
		.controls { bottom: 4rem; }
	}
</style>

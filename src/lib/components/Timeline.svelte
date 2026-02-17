<script lang="ts">
	import { currentScene, visited, goToScene, totalScenes } from '$lib/stores/scene';
	import { scenes } from '$lib/data/scenes';
</script>

<div class="timeline">
	<div class="timeline-bar">
		{#each scenes as scene, i}
			{#if i > 0}
				<div class="timeline-line">
					<div class="fill" style="width: {i <= $currentScene ? '100%' : '0%'}"></div>
				</div>
			{/if}
			<button
				class="timeline-node"
				class:active={i === $currentScene}
				class:visited={$visited.has(i) && i !== $currentScene}
				on:click={() => goToScene(i)}
			>
				{#if scene.label}
					<span class="timeline-label">{scene.label}</span>
				{/if}
			</button>
		{/each}
	</div>
</div>

<style>
	.timeline {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 10;
		padding: 1rem 2rem 1.5rem;
		background: linear-gradient(to top, rgba(10,10,15,0.95) 0%, transparent 100%);
	}

	.timeline-bar {
		display: flex;
		align-items: center;
		width: 100%;
		max-width: 900px;
		margin: 0 auto;
	}

	.timeline-line {
		flex: 1;
		height: 1px;
		background: rgba(255,255,255,0.1);
		position: relative;
	}

	.fill {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		background: var(--gold);
		transition: width 0.8s ease;
	}

	.timeline-node {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		border: 1px solid rgba(255,255,255,0.2);
		background: var(--dark);
		cursor: pointer;
		transition: all 0.4s ease;
		flex-shrink: 0;
		position: relative;
		padding: 0;
	}

	.timeline-node:hover {
		border-color: var(--gold);
		transform: scale(1.3);
	}

	.timeline-node.active {
		background: var(--gold);
		border-color: var(--gold);
		box-shadow: 0 0 12px rgba(196,162,101,0.4);
	}

	.timeline-node.visited {
		background: rgba(196,162,101,0.3);
		border-color: var(--gold);
	}

	.timeline-label {
		position: absolute;
		bottom: 18px;
		left: 50%;
		transform: translateX(-50%);
		font-family: 'Outfit', sans-serif;
		font-size: 0.6rem;
		font-weight: 300;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--grey);
		white-space: nowrap;
		opacity: 0;
		transition: opacity 0.3s ease;
		pointer-events: none;
	}

	.timeline-node:hover .timeline-label,
	.timeline-node.active .timeline-label {
		opacity: 1;
	}

	@media (max-width: 600px) {
		.timeline-label { display: none; }
	}
</style>

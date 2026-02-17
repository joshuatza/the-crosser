<script lang="ts">
	import { Canvas } from '@threlte/core';
	import ParticleField from './ParticleField.svelte';
	import { currentScene } from '$lib/stores/scene';
	import { scenes } from '$lib/data/scenes';

	$: scene = scenes[$currentScene];
</script>

<div class="bg-canvas" style="background: {scene.bg}">
	<div class="three-layer">
		<Canvas>
			<ParticleField
				color={scene.particles?.color ?? '#c4a265'}
				count={scene.particles?.count ?? 30}
				speed={scene.particles?.speed ?? 0.2}
			/>
		</Canvas>
	</div>
	<div class="grain"></div>
	<div class="vignette"></div>
	{#if scene.horizon}
		<div
			class="horizon visible"
			style="top: {scene.horizon.top}; background: {scene.horizon.background ?? scene.horizon.color}"
		></div>
	{/if}
</div>

<style>
	.bg-canvas {
		position: fixed;
		inset: 0;
		z-index: 0;
		transition: background 2s ease;
	}

	.three-layer {
		position: absolute;
		inset: 0;
		z-index: 0;
	}

	.grain {
		position: absolute;
		inset: 0;
		z-index: 1;
		opacity: 0.04;
		pointer-events: none;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
		background-size: 128px 128px;
	}

	.vignette {
		position: absolute;
		inset: 0;
		z-index: 2;
		pointer-events: none;
		background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%);
	}

	.horizon {
		position: absolute;
		left: 0;
		right: 0;
		height: 1px;
		z-index: 1;
		opacity: 0;
		transition: all 2s ease;
		filter: blur(0.5px);
	}

	.horizon.visible {
		opacity: 0.15;
	}
</style>

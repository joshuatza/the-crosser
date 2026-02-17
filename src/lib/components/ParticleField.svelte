<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import * as THREE from 'three';
	import { onMount } from 'svelte';

	export let color = '#c4a265';
	export let count = 30;
	export let speed = 0.2;

	// Use a fixed max count so we never reallocate buffers
	const MAX_PARTICLES = 80;

	let geometry: THREE.BufferGeometry;
	let material: THREE.PointsMaterial;
	let velocities: Float32Array;
	let activeCount = count;

	// Smoothly update color without recreating material
	$: if (material) {
		material.color.set(color);
	}

	// Update active count without reallocating
	$: activeCount = Math.min(count, MAX_PARTICLES);

	onMount(() => {
		geometry = new THREE.BufferGeometry();
		const positions = new Float32Array(MAX_PARTICLES * 3);
		velocities = new Float32Array(MAX_PARTICLES * 3);

		for (let i = 0; i < MAX_PARTICLES; i++) {
			positions[i * 3] = (Math.random() - 0.5) * 20;
			positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
			positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

			velocities[i * 3] = (Math.random() - 0.5) * 0.02;
			velocities[i * 3 + 1] = Math.random() * 0.02 + 0.005;
			velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
		}

		geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
		// Control visible particles via draw range
		geometry.setDrawRange(0, activeCount);

		material = new THREE.PointsMaterial({
			color: new THREE.Color(color),
			size: 0.05,
			transparent: true,
			opacity: 0.6,
			blending: THREE.AdditiveBlending,
			depthWrite: false
		});

		return () => {
			geometry.dispose();
			material.dispose();
		};
	});

	useTask((delta) => {
		if (!geometry || !velocities) return;

		// Update draw range when count changes
		geometry.setDrawRange(0, activeCount);

		const positions = geometry.attributes.position as THREE.BufferAttribute;
		const d = speed * delta * 60;

		for (let i = 0; i < activeCount; i++) {
			const idx = i * 3;
			positions.array[idx] += velocities[idx] * d;
			positions.array[idx + 1] += velocities[idx + 1] * d;
			positions.array[idx + 2] += velocities[idx + 2] * d;

			if (Math.abs(positions.array[idx + 1]) > 10) {
				positions.array[idx] = (Math.random() - 0.5) * 20;
				positions.array[idx + 1] = -10;
				positions.array[idx + 2] = (Math.random() - 0.5) * 20;
			}
		}

		positions.needsUpdate = true;
	});
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 10]} fov={60} />
<T.AmbientLight intensity={0.3} />

{#if geometry && material}
	<T.Points {geometry} {material} />
{/if}

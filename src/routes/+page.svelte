<script lang="ts">
	import { onMount } from 'svelte';
	import Preloader from '$lib/components/Preloader.svelte';
	import SceneBackground from '$lib/components/SceneBackground.svelte';
	import SceneText from '$lib/components/SceneText.svelte';
	import Controls from '$lib/components/Controls.svelte';
	import Timeline from '$lib/components/Timeline.svelte';
	import ChapterMenu from '$lib/components/ChapterMenu.svelte';
	import { journeyStarted, nextScene, prevScene, muted } from '$lib/stores/scene';
	import { initMusic, toggleMute, transitionTo as musicTransition } from '$lib/stores/music';

	function handleStart() {
		initMusic();
	}

	function handleScreenClick(e: MouseEvent) {
		if (!$journeyStarted) return;
		// Ignore clicks on buttons, timeline nodes, etc.
		const target = e.target as HTMLElement;
		if (target.closest('button') || target.closest('.timeline-node') || target.closest('.controls') || target.closest('#controls') || target.closest('.menu-wrapper') || target.closest('.panel') || target.closest('.overlay')) return;

		const x = e.clientX;
		const mid = window.innerWidth / 2;
		if (x > mid) {
			nextScene();
		} else {
			prevScene();
		}
	}

	function handleMuteToggle() {
		const nowMuted = toggleMute();
		muted.set(nowMuted);
	}

	onMount(() => {
		function handleKeydown(e: KeyboardEvent) {
			if ($journeyStarted) {
				if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextScene(); }
				if (e.key === 'ArrowLeft') { e.preventDefault(); prevScene(); }
				if (e.key === 'm') handleMuteToggle();
			} else if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				journeyStarted.set(true);
			}
		}

		let touchStartX = 0;
		function handleTouchStart(e: TouchEvent) { touchStartX = e.touches[0].clientX; }
		function handleTouchEnd(e: TouchEvent) {
			if (!$journeyStarted) return;
			const diff = touchStartX - e.changedTouches[0].clientX;
			if (Math.abs(diff) > 50) {
				if (diff > 0) nextScene();
				else prevScene();
			}
		}

		window.addEventListener('keydown', handleKeydown);
		window.addEventListener('touchstart', handleTouchStart);
		window.addEventListener('touchend', handleTouchEnd);

		return () => {
			window.removeEventListener('keydown', handleKeydown);
			window.removeEventListener('touchstart', handleTouchStart);
			window.removeEventListener('touchend', handleTouchEnd);
		};
	});
</script>

<svelte:head>
	<title>The Crosser — A Visual Journey</title>
</svelte:head>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="click-zone" on:click={handleScreenClick}>
	<Preloader on:start={handleStart} />

	{#if $journeyStarted}
		<SceneBackground />
		<SceneText />

		<ChapterMenu />

		<div class="volume-ctrl">
			<button class="vol-btn" class:muted={$muted} on:click|stopPropagation={handleMuteToggle}>
				{$muted ? '♪' : '♫'}
			</button>
		</div>

		<Controls />
		<Timeline />
	{/if}
</div>

<style>
	.click-zone {
		position: fixed;
		inset: 0;
		cursor: default;
	}

	.volume-ctrl {
		position: fixed;
		top: 1.5rem;
		right: 1.5rem;
		z-index: 20;
	}

	.vol-btn {
		background: transparent;
		border: 1px solid rgba(255,255,255,0.12);
		color: var(--cream);
		width: 36px;
		height: 36px;
		border-radius: 50%;
		cursor: pointer;
		font-size: 0.85rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
	}

	.vol-btn:hover {
		border-color: var(--gold);
		color: var(--gold);
	}

	.vol-btn.muted {
		color: var(--grey);
		opacity: 0.5;
	}
</style>

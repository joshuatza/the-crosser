<script lang="ts">
	import { currentScene, transitioning } from '$lib/stores/scene';
	import { scenes } from '$lib/data/scenes';
	import { penScratch } from '$lib/stores/music';

	$: scene = scenes[$currentScene];

	let visible = false;
	let typedHTML = '';
	let typeTimer: ReturnType<typeof setTimeout> | null = null;

	function clearTypeTimer() {
		if (typeTimer) { clearTimeout(typeTimer); typeTimer = null; }
	}

	// Parse HTML content into typeable tokens (words + tags)
	function tokenize(html: string): string[] {
		const tokens: string[] = [];
		let i = 0;
		while (i < html.length) {
			if (html[i] === '<') {
				// Capture entire tag
				const end = html.indexOf('>', i);
				if (end !== -1) {
					tokens.push(html.slice(i, end + 1));
					i = end + 1;
				} else {
					tokens.push(html[i]);
					i++;
				}
			} else if (html[i] === ' ' || html[i] === '\n' || html[i] === '\t') {
				tokens.push(html[i]);
				i++;
			} else {
				// Capture word (text until next space or tag)
				let word = '';
				while (i < html.length && html[i] !== '<' && html[i] !== ' ' && html[i] !== '\n' && html[i] !== '\t') {
					word += html[i];
					i++;
				}
				tokens.push(word);
			}
		}
		return tokens;
	}

	// Render the full text at once (so the layout never shifts), with each
	// word wrapped in a span that fades in on a staggered delay.
	function typeContent(html: string) {
		clearTypeTimer();

		const tokens = tokenize(html);
		let out = '';
		let t = 400;
		const wordTimes: number[] = [];

		for (const token of tokens) {
			const isTag = token.startsWith('<');
			const isSpace = token.trim() === '';
			if (isTag || isSpace) {
				out += token;
			} else {
				out += `<span class="type-word" style="animation-delay:${t}ms">${token}</span>`;
				wordTimes.push(t);
				t += 90 + Math.random() * 40;
			}
		}

		typedHTML = out;
		visible = true;

		// Pen sound synced to each word's reveal
		let i = 0;
		let prev = 0;
		function scratchNext() {
			if (i >= wordTimes.length) return;
			const delay = wordTimes[i] - prev;
			prev = wordTimes[i];
			typeTimer = setTimeout(() => {
				penScratch();
				i++;
				scratchNext();
			}, delay);
		}
		scratchNext();
	}

	$: if (scene) {
		clearTypeTimer();
		visible = false;
		typedHTML = '';
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				typeContent(scene.content);
			});
		});
	}
</script>

<div class="scene-container">
	<div
		class="scene-text"
		class:visible
		class:exit={$transitioning}
	>
		{@html typedHTML}
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

	:global(.type-word) {
		display: inline-block;
		opacity: 0;
		animation: word-in 0.7s ease forwards;
	}

	@keyframes -global-word-in {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.type-word) {
			animation: none;
			opacity: 1;
		}
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

import { writable, derived, get } from 'svelte/store';
import { scenes } from '$lib/data/scenes';
import { transitionChime, transitionTo as musicTransition, stopMusic } from './music';

export const currentScene = writable(0);
export const transitioning = writable(false);
export const visited = writable(new Set<number>());
export const journeyStarted = writable(false);
export const muted = writable(false);

export const sceneData = derived(currentScene, ($currentScene) => scenes[$currentScene]);
export const totalScenes = scenes.length;

export function nextScene() {
	const current = get(currentScene);
	if (current < scenes.length - 1) {
		goToScene(current + 1);
	} else {
		// Last scene — return to the beginning
		transitioning.set(true);
		stopMusic();
		setTimeout(() => {
			currentScene.set(0);
			journeyStarted.set(false);
			transitioning.set(false);
		}, 600);
	}
}

export function prevScene() {
	const current = get(currentScene);
	if (current > 0) goToScene(current - 1);
}

export function goToScene(index: number) {
	if (index < 0 || index >= scenes.length) return;
	if (get(transitioning)) return;

	transitioning.set(true);
	transitionChime(index);

	setTimeout(() => {
		currentScene.set(index);
		visited.update(v => { v.add(index); return new Set(v); });
		musicTransition(index);
		transitioning.set(false);
	}, 600);
}

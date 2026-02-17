import { get } from 'svelte/store';
import { currentScene } from './scene';

interface Phase {
	name: string;
	scale: string[];
	padNotes: string[];
	tempo: number;
	velocity: number;
	density: number;
	reverbWet: number;
	delayWet: number;
	filterFreq: number;
	padVol: number;
}

const phases: Phase[] = [
	{ name: "silence", scale: ["C4","E4","G4","B4","C5"], padNotes: ["C2","G2"], tempo: 3.5, velocity: 0.15, density: 0.3, reverbWet: 0.8, delayWet: 0.3, filterFreq: 1200, padVol: -28 },
	{ name: "opening", scale: ["D4","F4","A4","C5","E5"], padNotes: ["D2","A2"], tempo: 3.0, velocity: 0.18, density: 0.35, reverbWet: 0.75, delayWet: 0.25, filterFreq: 1400, padVol: -26 },
	{ name: "exile", scale: ["A3","C4","D4","E4","G4","A4","C5"], padNotes: ["A1","E2"], tempo: 3.2, velocity: 0.22, density: 0.4, reverbWet: 0.7, delayWet: 0.2, filterFreq: 1000, padVol: -24 },
	{ name: "the_drive", scale: ["G3","B3","D4","F#4","A4","B4","D5"], padNotes: ["G1","D2","B2"], tempo: 2.5, velocity: 0.28, density: 0.5, reverbWet: 0.65, delayWet: 0.3, filterFreq: 1800, padVol: -22 },
	{ name: "the_question", scale: ["E3","G3","B3","D4","F4","E4"], padNotes: ["E1","B1"], tempo: 4.0, velocity: 0.2, density: 0.25, reverbWet: 0.85, delayWet: 0.4, filterFreq: 800, padVol: -26 },
	{ name: "the_wheel", scale: ["C3","Eb3","G3","Bb3","D4","F4","G4","C5"], padNotes: ["C1","G1","Eb2"], tempo: 2.8, velocity: 0.25, density: 0.45, reverbWet: 0.75, delayWet: 0.35, filterFreq: 1400, padVol: -22 },
	{ name: "the_feeling", scale: ["F3","A3","C4","E4","G4","A4","C5","E5"], padNotes: ["F1","C2","A2"], tempo: 2.2, velocity: 0.3, density: 0.55, reverbWet: 0.6, delayWet: 0.25, filterFreq: 2200, padVol: -20 },
	{ name: "the_crosser", scale: ["D3","F#3","A3","D4","F#4","A4","D5","F#5"], padNotes: ["D1","A1","F#2"], tempo: 2.0, velocity: 0.32, density: 0.55, reverbWet: 0.6, delayWet: 0.2, filterFreq: 2600, padVol: -20 },
	{ name: "the_fire", scale: ["G3","B3","D4","G4","B4","D5","F#5","G5"], padNotes: ["G1","D2","B2"], tempo: 1.8, velocity: 0.35, density: 0.6, reverbWet: 0.55, delayWet: 0.2, filterFreq: 3000, padVol: -18 },
	{ name: "the_crossing", scale: ["C3","E3","G3","C4","E4","G4","B4","C5","E5","G5"], padNotes: ["C1","G1","E2","C3"], tempo: 2.2, velocity: 0.35, density: 0.55, reverbWet: 0.7, delayWet: 0.3, filterFreq: 3200, padVol: -18 }
];

function getPhase(sceneIndex: number): number {
	if (sceneIndex <= 0) return 0;
	if (sceneIndex <= 2) return 1;
	if (sceneIndex <= 7) return 2;
	if (sceneIndex <= 12) return 3;
	if (sceneIndex <= 15) return 4;
	if (sceneIndex <= 20) return 5;
	if (sceneIndex <= 23) return 6;
	if (sceneIndex <= 26) return 7;
	if (sceneIndex <= 29) return 8;
	return 9;
}

let Tone: any = null;
let started = false;
let isMuted = false;
let piano: any = null;
let pad: any = null;
let penSynth: any = null;
let penFilter: any = null;
let reverb: any = null;
let delay: any = null;
let filter: any = null;
let masterVol: any = null;
let loopId: ReturnType<typeof setTimeout> | null = null;
let currentPhaseIndex: number | null = null;

export async function initMusic() {
	try {
		Tone = await import('tone');
		await Tone.start();

		masterVol = new Tone.Volume(-6).toDestination();
		reverb = new Tone.Reverb({ decay: 6, wet: 0.8, preDelay: 0.1 }).connect(masterVol);
		await reverb.generate();
		delay = new Tone.FeedbackDelay({ delayTime: "4n.", feedback: 0.2, wet: 0.3 }).connect(reverb);
		filter = new Tone.Filter({ frequency: 1200, type: "lowpass", rolloff: -24 }).connect(delay);

		piano = new Tone.PolySynth(Tone.Synth, {
			maxPolyphony: 8,
			options: {
				oscillator: { type: "triangle8", partials: [1, 0.5, 0.25, 0.12, 0.06] },
				envelope: { attack: 0.02, decay: 1.5, sustain: 0.15, release: 3.5 },
				volume: -8
			}
		}).connect(filter);

		pad = new Tone.PolySynth(Tone.Synth, {
			maxPolyphony: 6,
			options: {
				oscillator: { type: "sine" },
				envelope: { attack: 3, decay: 4, sustain: 0.6, release: 6 },
				volume: -28
			}
		}).connect(reverb);

		// Pen scratch — filtered noise burst for typewriter effect
		penFilter = new Tone.Filter({ frequency: 3500, type: "bandpass", Q: 0.8 }).connect(masterVol);
		penSynth = new Tone.NoiseSynth({
			noise: { type: "brown" },
			envelope: { attack: 0.003, decay: 0.04, sustain: 0, release: 0.02 },
			volume: -28
		}).connect(penFilter);

		started = true;
		transitionTo(get(currentScene));
	} catch (e) {
		console.warn('Audio init failed:', e);
	}
}

function triggerPad(phase: Phase) {
	try { pad.releaseAll(Tone.now() + 0.5); } catch (_) {}
	setTimeout(() => {
		if (isMuted) return;
		phase.padNotes.forEach((note: string, i: number) => {
			setTimeout(() => {
				if (isMuted) return;
				try { pad.triggerAttackRelease(note, "4m", Tone.now(), 0.15); } catch (_) {}
			}, i * 800);
		});
	}, 1500);
}

function startLoop(phase: Phase) {
	if (loopId) { clearTimeout(loopId); loopId = null; }

	const playNote = () => {
		if (isMuted || !started) return;
		if (Math.random() < phase.density) {
			const note = phase.scale[Math.floor(Math.random() * phase.scale.length)];
			const vel = phase.velocity * (0.6 + Math.random() * 0.4);
			const dur = 1 + Math.random() * 3;
			try { piano.triggerAttackRelease(note, dur, Tone.now(), vel); } catch (_) {}

			if (Math.random() < phase.density * 0.4) {
				const note2 = phase.scale[Math.floor(Math.random() * phase.scale.length)];
				if (note2 !== note) {
					setTimeout(() => {
						if (isMuted) return;
						try { piano.triggerAttackRelease(note2, dur * 0.8, Tone.now(), vel * 0.7); } catch (_) {}
					}, 80 + Math.random() * 200);
				}
			}

			if (Math.random() < phase.density * 0.15) {
				const note3 = phase.scale[Math.floor(Math.random() * phase.scale.length)];
				setTimeout(() => {
					if (isMuted) return;
					try { piano.triggerAttackRelease(note3, dur * 0.6, Tone.now(), vel * 0.5); } catch (_) {}
				}, 300 + Math.random() * 500);
			}
		}
		const nextTime = (phase.tempo * 0.6 + Math.random() * phase.tempo * 0.8) * 1000;
		loopId = setTimeout(playNote, nextTime);
	};

	loopId = setTimeout(playNote, 800);
}

export function transitionTo(sceneIndex: number) {
	if (!started || isMuted) return;
	const phaseIndex = getPhase(sceneIndex);
	if (phaseIndex === currentPhaseIndex) return;
	currentPhaseIndex = phaseIndex;
	const phase = phases[phaseIndex];

	reverb.wet.rampTo(phase.reverbWet, 3);
	delay.wet.rampTo(phase.delayWet, 3);
	filter.frequency.rampTo(phase.filterFreq, 4);
	pad.volume.rampTo(phase.padVol, 4);

	startLoop(phase);
	triggerPad(phase);
}

export function transitionChime(sceneIndex: number) {
	if (!started || isMuted) return;
	const phaseIndex = getPhase(sceneIndex);
	const phase = phases[phaseIndex];
	const root = phase.scale[0];
	const fifth = phase.scale[Math.min(2, phase.scale.length - 1)];
	try { piano.triggerAttackRelease(root, 4, Tone.now(), phase.velocity * 0.6); } catch (_) {}
	setTimeout(() => {
		if (isMuted) return;
		try { piano.triggerAttackRelease(fifth, 3, Tone.now(), phase.velocity * 0.4); } catch (_) {}
	}, 150);
}

export function penScratch() {
	if (!started || isMuted || !penSynth) return;
	try {
		// Slight randomness in pitch and volume for organic feel
		const freq = 2800 + Math.random() * 1400;
		const vol = -30 + Math.random() * 6;
		penFilter.frequency.value = freq;
		penSynth.volume.value = vol;
		penSynth.triggerAttackRelease(0.025 + Math.random() * 0.02);
	} catch (_) {}
}

export function stopMusic() {
	if (!started) return;
	if (loopId) { clearTimeout(loopId); loopId = null; }
	try { piano.releaseAll(); } catch (_) {}
	try { pad.releaseAll(); } catch (_) {}
	masterVol.volume.rampTo(-60, 1.5);
	currentPhaseIndex = null;
	started = false;
}

export function toggleMute(): boolean {
	isMuted = !isMuted;
	if (isMuted) {
		if (loopId) { clearTimeout(loopId); loopId = null; }
		try { piano.releaseAll(); } catch (_) {}
		try { pad.releaseAll(); } catch (_) {}
		masterVol.volume.rampTo(-60, 1);
	} else {
		masterVol.volume.rampTo(-6, 1);
		currentPhaseIndex = null;
		transitionTo(get(currentScene));
	}
	return isMuted;
}

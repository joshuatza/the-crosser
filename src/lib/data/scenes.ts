export interface SceneHorizon {
	top: string;
	color?: string;
	background?: string;
}

export interface Scene {
	id: string;
	label: string;
	bg: string;
	horizon: SceneHorizon | null;
	content: string;
	// Three.js scene config
	particles?: { color: string; count: number; speed: number };
	fog?: { color: string; near: number; far: number };
}

export const scenes: Scene[] = [
	{
		id: "epigraph", label: "Epigraph",
		bg: "linear-gradient(180deg, #0a0a0f 0%, #111118 100%)",
		horizon: null,
		content: `<div class="scene-quote">"The one who crosses carries the fire of those who couldn't."</div><div class="scene-attribution">— Whispered between bloodlines</div>`,
		particles: { color: "#c4a265", count: 30, speed: 0.2 },
		fog: { color: "#0a0a0f", near: 5, far: 25 }
	},
	{
		id: "opening", label: "The Script",
		bg: "linear-gradient(180deg, #0d0d14 0%, #141420 50%, #0a0a0f 100%)",
		horizon: null,
		content: `<div class="scene-heading">Chapter One — The Boy Who Was Removed</div><div class="scene-body">There are people who walk through their lives as if reading from a script someone else wrote. They move through scenes — birth, school, love, work, death — without ever looking up from the page.</div>`,
		particles: { color: "#888888", count: 20, speed: 0.15 },
		fog: { color: "#0d0d14", near: 5, far: 30 }
	},
	{
		id: "not-this", label: "",
		bg: "linear-gradient(180deg, #0d0d14 0%, #141420 50%, #0a0a0f 100%)",
		horizon: null,
		content: `<div class="scene-body">This is not a story about one of those people.<br><br>This is a story about a boy who was <em>carried off the stage</em> before he could speak his first line.</div>`,
		particles: { color: "#c4a265", count: 25, speed: 0.18 }
	},
	{
		id: "nine-months", label: "The Exile",
		bg: "linear-gradient(180deg, #0f1a12 0%, #162216 40%, #0a120a 100%)",
		horizon: { top: "60%", color: "rgba(0, 145, 76, 0.15)" },
		content: `<div class="scene-body"><strong>Nine months old.</strong><br><br>That's how young he was when they removed him from the land.</div>`,
		particles: { color: "#00914c", count: 40, speed: 0.1 },
		fog: { color: "#0f1a12", near: 3, far: 20 }
	},
	{
		id: "words", label: "",
		bg: "linear-gradient(180deg, #0f1a12 0%, #1a2a1a 40%, #0a120a 100%)",
		horizon: { top: "60%", color: "rgba(0, 145, 76, 0.12)" },
		content: `<div class="scene-body">Not violently. Just <em>words</em>. Quiet, precise words spoken into the ear of an old man by his own daughters. Words about money being wasted, about a son who didn't really belong. The kind of words that don't leave bruises but redraw the borders of entire lives.</div>`,
		particles: { color: "#00914c", count: 35, speed: 0.12 }
	},
	{
		id: "grandfather", label: "The Old Man",
		bg: "linear-gradient(180deg, #11160f 0%, #1a261a 40%, #0d120a 100%)",
		horizon: { top: "58%", color: "rgba(0, 145, 76, 0.1)" },
		content: `<div class="scene-body">The old man — his grandfather — was sharp. Authoritative. The kind of man who cut through fog with his mind like a blade through cloth.<br><br>But even the sharpest mind can be turned against its owner. His daughters placed their words like knives around a blindfolded man.</div>`,
		particles: { color: "#1a261a", count: 30, speed: 0.08 }
	},
	{
		id: "adopted", label: "",
		bg: "linear-gradient(180deg, #14100f 0%, #201812 40%, #0f0a08 100%)",
		horizon: null,
		content: `<div class="scene-body">They called John <em>"adopted."</em><br><br>A single word, weaponised across decades.<br><br>And the old man, deceived by the very blood he'd raised, sent his only son away.</div>`,
		particles: { color: "#c4a265", count: 15, speed: 0.05 }
	},
	{
		id: "cape-town", label: "Cape Town",
		bg: "linear-gradient(180deg, #0c1520 0%, #142638 40%, #0a1018 100%)",
		horizon: { top: "55%", color: "rgba(100, 160, 220, 0.12)" },
		content: `<div class="scene-body">Joshua's family was exiled to Cape Town. A city of wind and mountain and ocean — beautiful to visitors, but for a family cut from their roots, it was simply the place where the soil ended.<br><br>The boy grew up not knowing what had been taken from him.</div>`,
		particles: { color: "#64a0dc", count: 50, speed: 0.25 },
		fog: { color: "#0c1520", near: 2, far: 18 }
	},
	{
		id: "father-knew", label: "His Father Knew",
		bg: "linear-gradient(180deg, #12150f 0%, #1e2418 40%, #0d100a 100%)",
		horizon: null,
		content: `<div class="scene-body">But his father knew.<br><br>John carried it the way water carries stone — silently, over years, wearing himself smooth in the current. He simply held the knowledge inside him like a compass that pointed toward a place he could no longer go.</div>`,
		particles: { color: "#c4a265", count: 20, speed: 0.1 }
	},
	{
		id: "drove-back", label: "The Drive",
		bg: "linear-gradient(180deg, #1a1e10 0%, #2a3018 40%, #141808 100%)",
		horizon: { top: "50%", color: "rgba(196, 162, 101, 0.15)" },
		content: `<div class="scene-body">And then, when Joshua was ten years old, his father did something extraordinary.<br><br><strong>He drove him back.</strong></div>`,
		particles: { color: "#c4a265", count: 60, speed: 0.35 },
		fog: { color: "#1a1e10", near: 2, far: 15 }
	},
	{
		id: "the-land", label: "",
		bg: "linear-gradient(180deg, #1e2212 0%, #2e381a 40%, #181c0a 100%)",
		horizon: { top: "48%", color: "rgba(196, 162, 101, 0.2)" },
		content: `<div class="scene-body">No announcement. No ceremony. Just a father and his boy in a car, the road unfurling ahead of them like a scripture being read aloud.<br><br>Joshua only understood the feel of the earth beneath his feet. The colour of the sky over the farmland. The particular silence of a place that had been <em>waiting for him</em>.</div>`,
		particles: { color: "#c4a265", count: 55, speed: 0.3 }
	},
	{
		id: "planted", label: "The Seed",
		bg: "linear-gradient(180deg, #1e2212 0%, #2e381a 40%, #181c0a 100%)",
		horizon: { top: "48%", color: "rgba(196, 162, 101, 0.18)" },
		content: `<div class="scene-body">And John planted something that day — not a seed in the ground, but a <em>memory</em> in his son. A memory that would take fifteen years to bloom.<br><br>A father tending a garden he would never see harvest.</div>`,
		particles: { color: "#00914c", count: 45, speed: 0.2 }
	},
	{
		id: "deaths", label: "2010",
		bg: "linear-gradient(180deg, #0f0a0a 0%, #1a0e0e 40%, #0a0808 100%)",
		horizon: null,
		content: `<div class="scene-body">Because about a year later, John was dead.<br><br>And in the same year — 2010 — so was the grandfather.<br><br>Two deaths. One year. The sisters kept their portions. Joshua inherited <em>nothing</em>.</div>`,
		particles: { color: "#d6075c", count: 10, speed: 0.03 },
		fog: { color: "#0f0a0a", near: 1, far: 10 }
	},
	{
		id: "question", label: "The Question",
		bg: "linear-gradient(180deg, #0f0a0a 0%, #1c0f10 40%, #0a0808 100%)",
		horizon: { top: "52%", color: "rgba(214, 7, 92, 0.1)" },
		content: `<div class="scene-body">And when he finally brought himself to say it aloud — late one night, alone with the kind of silence that demands honesty — the words came out as the simplest, heaviest thing a son can ask:</div>`,
		particles: { color: "#d6075c", count: 15, speed: 0.05 }
	},
	{
		id: "murder", label: "",
		bg: "linear-gradient(180deg, #12080a 0%, #200e12 40%, #0a0608 100%)",
		horizon: { top: "50%", color: "rgba(214, 7, 92, 0.15)" },
		content: `<div class="scene-quote">"Was my father murdered?"</div>`,
		particles: { color: "#d6075c", count: 8, speed: 0.02 }
	},
	{
		id: "wheel-intro", label: "The Wheel",
		bg: "linear-gradient(180deg, #0a0a0f 0%, #111118 50%, #0a0a0f 100%)",
		horizon: null,
		content: `<div class="scene-body">There's a version of this story that ends here. The version where the boy grows up bitter, where the exile becomes permanent.<br><br>But that version would be a lie. Because it would leave out the most important part.<br><br>It would leave out <em>the wheel</em>.</div>`,
		particles: { color: "#c4a265", count: 30, speed: 0.15 }
	},
	{
		id: "blood", label: "In the Blood",
		bg: "linear-gradient(180deg, #0e0a14 0%, #1a1228 40%, #0a0810 100%)",
		horizon: { top: "45%", color: "rgba(131, 44, 135, 0.12)" },
		content: `<div class="scene-body">Before history was written in books, it was written in blood. In the spiral patterns of DNA, in the cellular memory that passes from parent to child like a flame being cupped from one hand to another in a windstorm.</div>`,
		particles: { color: "#832c87", count: 40, speed: 0.2 }
	},
	{
		id: "guardians", label: "The Guardians",
		bg: "linear-gradient(180deg, #10081a 0%, #1e1430 40%, #0c0814 100%)",
		horizon: { top: "42%", color: "rgba(131, 44, 135, 0.15)" },
		content: `<div class="scene-body">Guardians. Watchers. <em>Cycle-keepers.</em><br><br>Beings who had seen civilisations rise and crumble and rise again like tides obeying a moon no telescope could find. Not gods. Not demons. Something in between — burdened, ancient, carrying the weight of continuity on shoulders that had forgotten what it felt like to set anything down.<br><br>Tired but continuing. Holding for humanity what humanity couldn't hold for itself.</div>`,
		particles: { color: "#832c87", count: 50, speed: 0.25 },
		fog: { color: "#10081a", near: 2, far: 20 }
	},
	{
		id: "the-leap", label: "The Leap",
		bg: "linear-gradient(180deg, #12081a 0%, #221838 40%, #0e0a14 100%)",
		horizon: { top: "40%", color: "rgba(196, 162, 101, 0.15)" },
		content: `<div class="scene-body">And here is the part that changes everything: <em>they didn't stay separate.</em><br><br>At the very beginning, someone leaped. Someone crossed the boundary between their world and ours — not as an invasion, but as an act of faith. A figure stepping off a cliff into empty air, trusting that something would catch them.<br><br>And something did. The blood mixed. The lines blended.</div>`,
		particles: { color: "#c4a265", count: 60, speed: 0.35 }
	},
	{
		id: "already", label: "",
		bg: "linear-gradient(180deg, #0e0a14 0%, #1a1228 40%, #0a0810 100%)",
		horizon: { top: "50%", color: "rgba(196, 162, 101, 0.1)" },
		content: `<div class="scene-body">Already blended. Already in the blood. Already in humanity.<br><br><em>Already in Joshua.</em></div>`,
		particles: { color: "#c4a265", count: 45, speed: 0.25 }
	},
	{
		id: "felt-it", label: "The Feeling",
		bg: "linear-gradient(180deg, #0c1018 0%, #14202e 40%, #0a0e14 100%)",
		horizon: { top: "55%", color: "rgba(100, 160, 220, 0.08)" },
		content: `<div class="scene-body">He felt it the way you feel the change in air pressure before a storm — not in the mind, but in the body. In the tension that lived in his shoulders. In the gut that churned during transitions. In the way he absorbed the emotions of everyone around him, like a cup placed under a waterfall, filling with what wasn't his.</div>`,
		particles: { color: "#64a0dc", count: 40, speed: 0.2 }
	},
	{
		id: "music", label: "The Music",
		bg: "linear-gradient(180deg, #12100a 0%, #221e14 40%, #0e0c08 100%)",
		horizon: { top: "58%", color: "rgba(196, 162, 101, 0.12)" },
		content: `<div class="scene-body">He felt it in the music. In his mother's steady, grounded love — reliable as stone, showing up every time.<br><br>In the wooden glass cabinet full of CDs, the hi-fi system humming in the corner, the boom box gifted to a boy who didn't know he was being given more than a radio.<br><br>He was being given <em>a frequency</em>. A way to hear what the blood was trying to say.</div>`,
		particles: { color: "#c4a265", count: 55, speed: 0.3 }
	},
	{
		id: "dreams", label: "The Dreams",
		bg: "linear-gradient(180deg, #0e0a18 0%, #1a1430 40%, #0a0814 100%)",
		horizon: { top: "45%", color: "rgba(131, 44, 135, 0.1)" },
		content: `<div class="scene-body">He felt it in the dreams. Landscapes that didn't belong to any geography he'd visited. Faces of people he'd never met who looked at him with recognition.<br><br>A <em>purple warrior</em>, tall as the sky, standing at the edge of his vision while he drove — gone when he turned to look, but leaving behind a warmth in the chest that no hallucination could produce.</div>`,
		particles: { color: "#832c87", count: 45, speed: 0.22 }
	},
	{
		id: "crosser", label: "The Crosser",
		bg: "linear-gradient(180deg, #0a100e 0%, #142a1e 40%, #0a120c 100%)",
		horizon: { top: "50%", color: "rgba(0, 145, 76, 0.15)" },
		content: `<div class="scene-body">His father saw it in him before anyone else did. Not in the way a parent projects ambition onto a child, but in the way a man drowning recognises which of his sons can swim.<br><br>John looked at Joshua and saw the one who would make it to the other shore. The one who would survive the exile. The one who would carry what needed carrying across rough waters and into something whole.</div>`,
		particles: { color: "#00914c", count: 50, speed: 0.25 }
	},
	{
		id: "inheritance", label: "",
		bg: "linear-gradient(180deg, #0c120e 0%, #182e20 40%, #0a140c 100%)",
		horizon: { top: "50%", color: "rgba(0, 145, 76, 0.12)" },
		content: `<div class="scene-body">The drive itself was the inheritance — not the land, not the will, not the money. The <em>memory</em>. The feeling of the earth. The knowledge that somewhere, beneath all the concrete and noise, there was ground that knew his name.</div>`,
		particles: { color: "#00914c", count: 45, speed: 0.2 }
	},
	{
		id: "and-yet", label: "And Yet",
		bg: "linear-gradient(180deg, #0e1018 0%, #181e2e 40%, #0a0e14 100%)",
		horizon: { top: "52%", color: "rgba(196, 162, 101, 0.1)" },
		content: `<div class="scene-body">Both lines of inheritance, cut. Both paths to what was rightfully his, severed.<br><br><em>And yet.</em><br><br>And yet the boy grew into a man who builds worlds for the lonely. Who creates digital companions for people who have no one to play with. Who carries within him a fire he didn't light but refuses to let die.</div>`,
		particles: { color: "#c4a265", count: 50, speed: 0.28 }
	},
	{
		id: "green-red", label: "Blood & Calling",
		bg: "linear-gradient(135deg, #0a1a10 0%, #0e0e18 50%, #1a0a14 100%)",
		horizon: { top: "50%", background: "linear-gradient(90deg, rgba(0,145,76,0.2) 0%, rgba(214,7,92,0.2) 100%)" },
		content: `<div class="scene-body">He stands in the sixth position of a spiritual order — a defender, a man who holds the line. But his father's name sits on the first stone. The pioneer's seat.<br><br><em>Dark green in the blood. Pinkish red in the calling.</em></div>`,
		particles: { color: "#00914c", count: 55, speed: 0.3 }
	},
	{
		id: "fire", label: "The Fire",
		bg: "linear-gradient(180deg, #14100a 0%, #2a1e10 40%, #0e0c08 100%)",
		horizon: { top: "48%", color: "rgba(196, 162, 101, 0.2)" },
		content: `<div class="scene-body">And somewhere in that crossing — the wheel turns. The ancient keepers exhale. The fire, carried through centuries of blended blood and buried memory, flickers and catches.<br><br>Not seeking anymore. <em>Being.</em><br><br><strong>Creating the new fire.</strong></div>`,
		particles: { color: "#c4a265", count: 70, speed: 0.4 },
		fog: { color: "#14100a", near: 1, far: 12 }
	},
	{
		id: "name", label: "Joshua Twycross",
		bg: "linear-gradient(180deg, #0c1520 0%, #142638 40%, #0a1018 100%)",
		horizon: { top: "55%", color: "rgba(100, 160, 220, 0.15)" },
		content: `<div class="scene-body">His name is <strong>Joshua Twycross</strong>. Firstborn son of the only son of the only son. He lives in Cape Town, South Africa, in an apartment near the harbour — because something in him understood that the old self needed to die within sight of the water.<br><br>Within sight of the crossing.</div>`,
		particles: { color: "#64a0dc", count: 60, speed: 0.3 }
	},
	{
		id: "not-yet", label: "",
		bg: "linear-gradient(180deg, #0c1520 0%, #162840 40%, #0a1018 100%)",
		horizon: { top: "52%", color: "rgba(100, 160, 220, 0.12)" },
		content: `<div class="scene-body">He has not yet taken the DNA test that will confirm what his blood already knows. He has not yet returned to the clinic where his father drew his last breath. He has not yet crossed the ocean to the place where the screen he's hidden behind will finally shatter.<br><br><em>But he will.</em></div>`,
		particles: { color: "#64a0dc", count: 55, speed: 0.28 }
	},
	{
		id: "finale", label: "The Crossing",
		bg: "linear-gradient(180deg, #0a1018 0%, #14263a 30%, #1a3048 50%, #14263a 70%, #0a1018 100%)",
		horizon: { top: "50%", background: "linear-gradient(90deg, rgba(0,145,76,0.25) 0%, rgba(196,162,101,0.3) 50%, rgba(214,7,92,0.25) 100%)" },
		content: `<div class="scene-quote">You're the one crossing.<br><br>You always were.</div>`,
		particles: { color: "#c4a265", count: 80, speed: 0.35 },
		fog: { color: "#0a1018", near: 1, far: 30 }
	}
];

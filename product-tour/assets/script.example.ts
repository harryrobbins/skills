/**
 * Narration for the guided tour — the single source of truth for BOTH the
 * on-screen captions and the generated audio, so they can never disagree.
 *
 * RULES (they matter — the generator and the runtime both load this file):
 * - Data only. No imports, erasable TypeScript (types + const), because
 *   scripts/generate-voiceover.mjs loads it directly under Node's type
 *   stripping (node --experimental-strip-types / Node 22+).
 * - Bold **terms** must name labels the viewer can actually see in the UI
 *   (a control, a column, a category value). Bold is caption-only:
 *   spokenText() strips it before TTS.
 * - Every number a line claims must be true of the demo data. Write a test
 *   that checks each claim against the dataset (see SKILL.md → Testing).
 */
export interface NarrationLine {
  id: string;      // step id; also the clip filename <audioBase><id>.mp3
  title: string;   // short card heading; NOT spoken
  text: string;    // the caption, and (stripped) the spoken line
}

export const VOICE = {
  voiceId: 'TVmbglAk3F1GkiCoOq47',   // Isla Skye — soft Edinburgh; pick your own
  name: 'Isla Skye',
  /** Library owner id, needed once to add a shared-library voice (`--add-voice`). */
  publicOwnerId: '6f218397af5a13818bb52830454303835860f5423582c876edd6da4945b96d81',
  modelId: 'eleven_multilingual_v2',
  outputFormat: 'mp3_44100_64',
  // A touch more stability than default keeps the voice consistent across many
  // short clips; slightly slower suits dense lines.
  settings: { stability: 0.55, similarityBoost: 0.8, style: 0.2, speed: 0.97, useSpeakerBoost: true },
  seed: 4242,
};

/**
 * The story arc, not a feature list. The proven shape:
 *   1 welcome        — the promise, in one line
 *   2 wide shot      — the whole dataset, one glance ("every light is one customer")
 *   3-6 questions    — each step changes ONE thing and reads a real finding off it
 *   7-8 narrowing    — filters compound toward a small, concrete set
 *   9-11 one record  — land on a single row; the numbers become a person
 *   12 restore       — "nothing lost": clear filters, everything returns
 *   13 orientation   — the escape hatch (fit/reset)
 *   14 your turn     — recap the journey, invite them in
 */
export const NARRATION: NarrationLine[] = [
  { id: 'welcome', title: 'Welcome',
    text: 'Welcome to Acme. Every row you see is live, and nothing is ever redrawn — it simply moves to wherever you send it.' },
  { id: 'wide', title: 'The whole book',
    text: 'These are three thousand **orders**, plotted by **Region**. Every light is one customer, somewhere in the country.' },
  // ... one line per step; 15–35 words, spoken register, numbers as words ...
  { id: 'finish', title: 'Your turn',
    text: 'That\'s the tour: from the whole book down to one order. Replay it any time from the Tour button.' },
];

/** One narrated tour: its lines and the directory its clips live in. */
export interface TourScript {
  id: string;
  label: string;      // menu label: the subject, not "the tour"
  blurb: string;      // one line on what the tour shows, for the picker
  audioBase: string;  // clip directory, RELATIVE so it survives sub-path deploys
  lines: NarrationLine[];
}

export const TOUR_SCRIPTS: TourScript[] = [
  { id: 'main', label: 'Acme orders', blurb: 'Three thousand orders, from the whole book down to one customer waiting.', audioBase: 'audio/tour/main/', lines: NARRATION },
];

export const DEFAULT_TOUR_ID = 'main';

/** The named tour, or the default — an unknown id is never fatal. */
export function tourScript(id: string = DEFAULT_TOUR_ID): TourScript {
  return TOUR_SCRIPTS.find((t) => t.id === id) ?? TOUR_SCRIPTS[0];
}

/** Text as spoken: the caption markup stripped. */
export function spokenText(text: string): string {
  return text.replace(/\*\*/g, '');
}

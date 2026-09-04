---
name: product-tour
description: Build a narrated, spotlight-lit product tour for a web app — a guided walkthrough where a docked caption card ("the lamp") sends a travelling beam of light to each control while pre-generated ElevenLabs voiceover tells a use-case story that sells the product's benefits. Bundles proven, portable code (step engine, audio player with fallbacks, spotlight overlay, idempotent voiceover generator) extracted from the Tessera tours. Use when asked for a product tour, guided tour, onboarding walkthrough, interactive demo, narrated demo, feature spotlight/coach-marks, "show users around the app", or to add voiceover narration to a UI — and when writing or reviewing the narration script for such a tour.
---

# Narrated product tours with a travelling spotlight

This skill packages the tour system built for Tessera
(github.com/harryrobbins/tessera, `src/tour/`, two shipped tours). Two things
made those tours land, and both are the point of this skill:

1. **The light does the pointing.** One caption card stays docked in a corner
   for the whole tour; what moves between steps is a glow that flies from the
   card to the target, lights it up, and leaves a cone of light connecting the
   two. The eye is *carried* to the control being discussed instead of hunting
   for a repositioned tooltip.
2. **The narration is a story, not a feature list.** It follows one concrete
   use case from a wide establishing shot down to a single record, and every
   step sells a benefit by *using* it to advance the story. Every number spoken
   is true of the demo data, and tests keep it true.

`assets/` contains the portable code. Copy it, adapt the marked seams, write
the app's own script + actions.

## Process for a new app

1. **Find the story first** (before writing any code). Interrogate the demo
   data for real, checkable findings that chain into a narrative — "half arrive
   by phone" → "rural leans on post" → "post is the slow lane" → "twelve urgent
   cases still waiting on paper" → *this one person*. If the demo data holds no
   story, fix the data first; a tour cannot sell an empty picture.
2. **Write the narration** as `script.ts` (start from `assets/script.example.ts`;
   rules and arc are in there and below).
3. **Copy the runtime**: `engine.ts`, `player.ts`, `ui.ts`, `store.ts`,
   `esc.ts`, `hash.ts` → e.g. `src/tour/`; append `tour.css` to the app's CSS
   (map/trim the token block at the top). Rename the `tessera.*` localStorage
   keys in `store.ts`/`player.ts` to the app's own namespace.
4. **Write `actions.ts`** — the only genuinely app-specific file: a `TourHost`
   interface for what the tour may do to the app, and one action per narration
   id (see "Actions" below).
5. **Wire it up**: welcome card → Start click builds player + engine (the click
   is the gesture that unlocks audio); first-visit auto-open gated by
   localStorage with `?tour=1|0` override; a Tour button that forces it open;
   expose a `window.<app>.tour` handle for e2e and the console.
6. **Test the story** (see "Testing") — especially the "narration is true of
   the data" suite.
7. **Generate the voiceover**: copy `generate-voiceover.mjs` into `scripts/`,
   fix its two imports to point at the app's `script.ts`/`hash.ts`, put
   `ELEVENLABS_API_KEY` in `.env.local`, add `"voiceover": "node scripts/generate-voiceover.mjs"`
   (Node 22+ for type stripping + `process.loadEnvFile`). Run `--dry-run`
   first, then generate and **commit the mp3s** — audio is a build artifact
   like an image, never generated in CI or at runtime.

## Writing the narration (what "use-case focussed" means in practice)

The arc that works — steal it:

| Beat | Steps | Job |
|---|---|---|
| Promise | 1 | One line on what makes the product different ("nothing is ever redrawn — the tiles simply fly"). |
| Wide shot | 1 | The whole dataset in one image, humanised ("every light is one customer, somewhere in the UK"). |
| Questions | 3–5 | Each step changes exactly one thing and reads a **real finding** off the result. The feature is never the subject; the answer is. |
| Narrowing | 2 | Filters compound toward a small, vivid set ("twelve urgent cases, still waiting, on paper"). |
| One record | 2–3 | Land on a single row and open it. The aggregate story becomes a person/case — "That is what the numbers were about." |
| Restore | 1 | Undo everything on screen ("Filters never destroy anything; they only choose what you are looking at") — it disarms the fear of touching things. |
| Orientation | 1 | The escape hatch (Fit/reset) "whenever you get lost". |
| Your turn | 1 | Recap the journey in one line, invite them to bring their own data. |

Line rules (enforced by the code and tests):

- **Sell by doing, never by listing.** "Filters combine. Add **Open** under
  **Status**: twelve urgent cases, still waiting" — not "you can apply multiple
  filters". Every capability earns its step by advancing the story.
- 15–35 words, one or two sentences, spoken register. Read each line aloud.
  Numbers as words ("three thousand", "over-seventy-fives") — TTS and the ear
  both prefer it.
- **Bold `**terms**` must name text the viewer can see** (a control label, a
  column, a category value). Bold renders in the caption and is stripped for
  TTS by `spokenText()`. Keep a `columns.ts` of the canonical names and test
  that every bold term appears in it.
- Every claimed number must be true of the demo data — and *tested* (below).
- Precision about the medium ("picture", not "photograph", when half are
  lithographs) — one wrong word costs the narrator's authority.
- `title` is a short card heading; it is not spoken, so it can be punchy
  ("Twelve people waiting", "The slow lane").
- Step `id`s are clip filenames and test anchors — short, stable, kebab/word.

## Architecture (who does what, and the invariants)

```
script.ts     data only, import-free      captions + audio single source of truth
engine.ts     DOM-free state machine      spotlight → run action → play clip → advance
player.ts     audio + fallback timers     the tour advances even with no/blocked audio
ui.ts         the overlay                 lamp, veil, beam, glow, ring, keyboard, focus
actions.ts    app-specific                one abortable action per narration id
store.ts      localStorage keys           done-flag, safe storage
hash.ts       FNV-1a 64                   clip identity for idempotent generation
```

Invariants the design depends on:

- **`script.ts` is loaded by both the browser and the Node generator** (type
  stripping), so it must stay import-free and erasable-TS. This is what makes
  it impossible for audio and captions to drift apart.
- **Engine**: each `goto` bumps a sequence number and aborts the previous
  step's `AbortController`; action errors are logged, never fatal; after the
  action it preloads the *next* step's clip. `phase` is `'acting'` then
  `'playing'` — e2e can wait on it.
- **Player**: caption time falls back to reading pace (`words / 2.5s`, floored
  by the step's `minMs`) when audio is muted/missing/blocked; a ceiling timer
  (3× reading pace) stops a stalled stream freezing the tour; a ~40ms silent
  WAV played inside the Start click unlocks autoplay on Safari/iOS; mute
  persists in localStorage; a `fastMs` storage override lets e2e run the whole
  tour in seconds.
- **Actions set absolute state** (never toggle relative to "wherever we are"),
  so Back re-running an earlier step is always safe. Guard every column/element
  lookup (schema drift ⇒ silent degraded step, not a broken tour); check
  `signal.aborted` before each mutation; `await` animations/camera settling
  before the spotlight measures a moving target. The first real step resets
  everything a returning user could have changed (dataset, saved settings,
  filters, other running subsystems) — the tour asserts a specific look.
- **Welcome card first, nothing plays until Start** — that click is both
  consent and the audio-unlock gesture. With multiple tours it offers the
  choice (label + blurb per script). Auto-open only on first visit
  (`shouldAutoStart`): one done-flag for all tours (a second welcome is a nag),
  `?tour=1` forces, `?tour=0`, deep links and bench modes suppress.

## The spotlight (why it feels the way it does — keep these)

- **The lamp never moves.** Bottom-right (or whichever corner the app never
  points at) for the whole tour, so the eye learns where the words live. It
  slides (by transform) to the other corner only on a *real* collision with a
  target. `LAMP_RESERVE` is exported so camera-framing actions can keep the
  subject clear of it.
- **Veil, not blackout** — ~0.18 alpha. The narration quotes numbers that are
  on screen, so the page must stay readable; the target is singled out by
  being *lit*, not by everything else going black.
- **The journey**: on each step the ring and beam drop, a glow animates
  lamp→target (~460ms, WAAPI), and ring+beam fade up as it lands (~350ms).
  Under `prefers-reduced-motion` the light is simply already there.
- **The beam's far edge is the target's silhouette** (the two corners at
  extreme angles from the lamp), so a 40px select gets a needle and a sidebar
  gets a wedge with zero per-target tuning; huge targets get a plain shaft.
- Targets are a CSS selector or a resolver returning `Element | SpotRect`;
  rect targets (things drawn on a canvas) are followed frame-by-frame via rAF,
  and the ring's geometry is **never** CSS-transitioned (it would trail).
  Ring/beam writes are change-compared so idle frames cost nothing.
- **A11y is built in — don't strip it**: `role=dialog`, Tab trap over the
  overlay's buttons, `aria-live=polite` caption, Esc/M/arrows (arrows only when
  focus isn't on a page control, so native activation survives), focus restored
  on close, reduced-motion honoured.

## Voiceover pipeline (`generate-voiceover.mjs`)

- Idempotent: each clip's manifest entry stores `hashLine(spokenText, voice)`
  (text + voiceId + model + settings + format); only stale clips regenerate.
  Manifest written per-clip, so a failed run resumes without re-billing.
  Removed lines' mp3s are swept per-tour. `--dry-run`, `--force`,
  `--only <id>`, `--tour <id>`, `--list-voices`, `--add-voice` (shared-library
  voices must be added to the workspace once).
- `previousText`/`nextText` give the TTS prosody continuity between clips; a
  fixed `seed` keeps regeneration of one line consistent with its neighbours.
- Per-tour `audioBase` directories, **relative** URLs (sub-path deploys), one
  `manifest.json` each; ids may repeat across tours.
- `mp3_44100_64` keeps a 16-clip tour to ~1–2 MB total.
- Harry has an ElevenLabs account with ample credits; generation is
  pre-approved. Key lives in `.env.local`, never committed, never shipped.

## Testing the story

Port Tessera's four-layer pattern
(github.com/harryrobbins/tessera → `tests/tour-*.test.ts`):

1. **Engine** (vitest, fake player/store): ordering, abort on next/back/skip,
   done-flag, fallback timing.
2. **Narration truth** (the one that keeps the tour honest): regenerate/load
   the exact demo dataset and assert every quantitative claim — "one in ten by
   post" ⇒ `share(post) ∈ (0.085, 0.115)`; the featured record really is the
   max-contacts case; word rules hold (e.g. "picture", never "photograph").
   If the data generator changes, this fails before a visitor hears a story
   the picture no longer tells.
3. **Bold terms**: every `**term**` names a real column/value in `columns.ts`.
4. **e2e** (Playwright/CDP): set the `fastMs` storage override, drive
   `window.<app>.tour.start()`, step through, assert spotlight targets exist
   and the app state each action asserts (on this machine, follow the
   playwright-wsl skill).

## Gotchas learned the hard way (already handled in the assets — preserve them)

- SVG elements have no `hidden` property — set the attribute, and give
  `.tour-beam[hidden]`/`.tour-card[hidden]` explicit CSS (flex beats the UA
  `[hidden]` rule).
- Measure the caption card once per step, never in the per-frame reposition
  (forced synchronous layout).
- Never CSS-transition the ring's left/top — it visibly trails a tracked card.
- Suspend the ring's breathing animation while tracking (shadow rasterised at
  a new size every frame).
- A modal that makes the page inert must be closed before spotlighting page
  controls — spotlighting something unclickable is a lie.
- Don't spotlight an element the action is about to remove (e.g. a "clear
  filters" link) — target what visibly changes instead.
- Wait for FLIP/camera tweens to land before measuring a target (`settle()` /
  a tween-length sleep, both abortable).
- Filtered scatters can go honestly blank (open cases have no resolution
  time): pick a layout where the filtered story is visible.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — type-checks (`vue-tsc -b`) then builds for production; both steps must pass
- `npm run preview` — serve the production build locally

Type checking is the only automated correctness check — there is no test runner, no ESLint, no Prettier (matches every other project in this portfolio).

## Architecture: Clean Architecture + feature-first

Each feature under `src/features/<name>/` is split into three layers:

- **`domain/`** — framework-free TypeScript: entities (plain interfaces), a repository interface, and occasionally a pure function that wraps real logic (e.g. `telemetry/domain/find-fastest-lap.ts`, `circuit/domain/build-track.ts`). Domain code never imports Vue, Pinia or axios.
- **`infrastructure/`** — concrete repository implementations that call the real OpenF1 API via axios (through the shared throttled client, see below) and map the wire format (snake_case OpenF1 fields) to the domain entity shape (camelCase).
- **`presentation/`** — Vue-specific: a Pinia store per feature that instantiates the repository directly (no DI container, same as this portfolio's other Vue projects) and exposes state plus a `status: 'idle'|'loading'|'success'|'error'` (sometimes also `'empty'`), and the components/views that consume it.

**This project uses real Pinia stores for feature state, not composables-with-local-refs** (unlike `space-explorer`, where Pinia is installed but dormant). That's a deliberate deviation: tabs are real routes here, and OpenF1's aggressive rate limiting (see below) makes it unacceptable to refetch data every time a user re-visits a tab. Every store's `ensureLoaded`/`loadForSession` guards on a `loadedSessionKey` so navigating away and back is free.

`src/App.vue` is the **composition root**: it's the only file that knows how features depend on each other (session → drivers/timing/pits/standings/weather; timing's winner → telemetry's default driver; telemetry's selected driver + lap window → circuit). Every store stays independent and unaware of its siblings — don't import one feature's store from inside another feature's store; wire cross-feature reactions in `App.vue` instead.

One intentional cross-feature import exception: `features/timing/presentation/timing.store.ts` imports the `Lap` type from `features/telemetry/domain` and calls `telemetry`'s repository indirectly via the value `App.vue` hands it — this is because the Timing tab's "fastest lap" rail always shows the **race winner's** fastest lap, captured once, independent of whichever driver is currently selected on the Telemetry tab (`timingStore.setWinnerFastestLap`). Don't collapse this into telemetry's own `fastestLap` ref — they represent different things and diverge as soon as the user picks a different driver in Telemetry.

## OpenF1 API caveats

- **No API key required** — every request goes straight to `https://api.openf1.org/v1`.
- **Aggressive rate limiting.** `src/shared/lib/openf1-client.ts` funnels every request from every feature/store through a single in-memory queue that enforces a minimum ~340ms gap between requests and retries once on a 429 (up to 4 times, 1.5s backoff). **Never call axios directly against the OpenF1 API from a repository — always go through `openf1Get()`.** Adding a second parallel HTTP client (even for "just one more endpoint") reintroduces the bursty-request problem this queue exists to solve.
- **Comparison filters are encoded as the query key itself**, e.g. `?date>=2023-09-16T13:03:35.200Z` (there's no separate `operator` param). This repo's repositories pass keys like `'date>=': startIso` to `openf1Get(path, params)`. The tricky part: the WHATWG URL parser that every browser (and axios/fetch) uses will always percent-encode a literal `>` or `<` character in a URL — that's unavoidable and fine, OpenF1's server decodes it back to `>`/`<` correctly. What **breaks** the request (silent 404, not a 400) is emitting a *second* `=` — i.e. building the query as `` `${key}=${value}` `` when `key` already ends in `=` produces `date%3E==2023-...`, which OpenF1 can't parse. `buildQueryString()` in `openf1-client.ts` special-cases this: if the key already ends with `=`, it appends the value directly with no extra separator. If you add a new comparison-filtered endpoint, reuse the existing `'field>=' / 'field<='` key pattern — don't hand-write a new query-string builder.
- **`championship_drivers` / `championship_teams` use `position_current` / `points_current` / `points_start`, not `position` / `points`.** The Claude Design mockup this was built from actually got this right (it computes a `delta = points_current - points_start` badge); an earlier draft of `standings/infrastructure/openf1-standings.repository.ts` simplified this away as an assumed prototype embellishment and rendered `—` for every row — verified live against the real endpoint (`curl https://api.openf1.org/v1/championship_drivers?session_key=...`) before "fixing" it back. If a standings field ever renders as `—` again, check the actual field names against a live `curl` first rather than assuming the mockup embellished something.
- **`/pit` only exposes a single `pit_duration` field** in the real API — there's no separate stop-vs-pit-lane duration split like the mockup's `stop_duration`/`lane_duration`. `PitStopsTable.vue` shows one "PARADA" duration column; don't reintroduce a second duration column without re-verifying the field exists.
- **`/sessions` filtering**: race sessions are found via `session_type=Race` + `session_name === 'Race'` (drops sprint/qualifying/practice), sorted newest-first. `is_cancelled` is read defensively (`!session.is_cancelled`) since it may be absent on some historical sessions.

## Cross-tab driver/lap state

`telemetry.store.ts` owns `selectedDriver`, the fastest-lap window (`windowStart`/`windowEnd`), the car-data samples, and a single `setInterval` "playhead" (`playbackIndex`, advancing every 85ms) that both the Telemetría speed trace and the Circuito track marker read from — this keeps the two tabs' animations in sync without duplicating playback state. `circuit.store.ts` reacts to telemetry's driver + window via a watcher in `App.vue`, not by importing telemetry's store directly.

## Design system

This UI was implemented from a Claude Design handoff (`F1 Dashboard.dc.html` — a static HTML/CSS/JS mockup export) — treat `src/style.css` as the source of truth for tokens. The handoff bundle also included `F1 Live Dashboard.dc.html`, a 3-direction moodboard with hardcoded example data (not a real design, no interactivity) — it was intentionally **not** built; only the main `F1 Dashboard` design was implemented.

- **Colors**: `carbon-*` (backgrounds/borders, darkest → lightest), `ink-*` (text, brightest → dimmest), plus semantic accents `race-red` (brand/live indicator), `amber` (track temp, gear), `green` (throttle, DRS-on, best pit stop), `purple` (fastest lap), `blue` (rain/humidity), `yellow` (caution flags) — all declared in `src/style.css` under `@theme` (Tailwind v4 CSS-first config, no `tailwind.config.js`).
- **Fonts**: `font-display` (Anton — big numbers: positions, speeds, lap times) / `font-condensed` (Barlow Condensed — driver codes, tab labels, headings) / `font-sans` (Barlow — body text, driver full names) / `font-mono` (IBM Plex Mono — all technical/telemetry labels), loaded via a Google Fonts `<link>` in `index.html`.
- **Scanline overlay** (`.scanlines` in `style.css`, mounted once in `App.vue`) is a fixed, `pointer-events: none` repeating-gradient animation reproducing the mockup's CRT-broadcast texture — it sits at `z-index: 99`, above the sticky header/tabs (`z-20`/`z-15`), which is intentional and matches the original design.
- **Playback/DRS/blink animations** (`f1-blink`, `f1-drs`, `f1-rise`, `f1-spin`, `f1-scan`) are plain CSS `@keyframes` in the global (non-scoped) `src/style.css`, applied via utility classes (`.animate-f1-*`) rather than component-scoped `<style>` — this project has no component that needs to reference a keyframe from an inline `:style` binding, so the scoped-`<style>`-hides-`@keyframes`-from-inline-styles pitfall documented in `space-explorer/CLAUDE.md` doesn't apply here, but keep new animations global for consistency.

## Routing

Eight routes, statically imported in `src/router/index.ts`, one per tab: `/timing` (default, `/` redirects here), `/telemetry`, `/circuit`, `/pits`, `/drivers`, `/standings`, `/calendar`, `/weather`. `App.vue` does **not** wrap `<RouterView>` in a `<Transition>` — the tabs need to preserve Pinia store state across navigation (see above), and this app has no need for page-to-page crossfades the way `space-explorer` does.

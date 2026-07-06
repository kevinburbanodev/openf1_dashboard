# OpenF1 Dashboard

A Vue 3 + TypeScript portfolio project that turns [OpenF1](https://openf1.org)'s live/historical Formula 1 data into a broadcast-style race dashboard — timing tower, car telemetry playback, an animated track map, pit stops, championship standings, calendar and weather. Visual design implemented from a Claude Design handoff.

## Features

- **Timing** — full classification for the selected race (position, gap to leader, laps, tyre compound, DNF/DNS/DSQ), the race's fastest lap, and a live-scrolling race control feed (flags, penalties, investigations).
- **Telemetría** — pick any driver's fastest lap and scrub through it: an animated speed trace (SVG) synced to a live speed/RPM/gear/DRS/throttle/brake readout.
- **Circuito** — the real track outline traced from GPS `location` samples, with an animated car marker and trail synced to the same lap as the Telemetría tab.
- **Pits** — every pit stop for the session, sorted by duration, with the fastest stop highlighted.
- **Pilotos** — a grid of every driver on the grid with number, team color and team name.
- **Standings** — drivers' and constructors' championships as of the selected race, with the points gained in that race.
- **Calendario** — the full season, with past/active/upcoming tags; clicking a card jumps the whole dashboard to that race.
- **Clima** — track/air temperature, humidity, wind, pressure and rain for the session (also summarized in the header).

## Stack

Vue 3 (Composition API, `<script setup>`) + TypeScript + Tailwind CSS v4 + Vue Router + Pinia + Axios, organized as **Clean Architecture + feature-first**: each feature under `src/features/<name>/` has its own `domain/` (entities, repository interfaces, pure logic), `infrastructure/` (concrete OpenF1 API clients implementing those interfaces), and `presentation/` (Pinia stores, components, views) layers. See [CLAUDE.md](CLAUDE.md) for the full architectural rationale, including why this project uses Pinia stores where sibling projects use plain composables.

Data comes entirely from the free [OpenF1 API](https://openf1.org) — no API key required.

## Getting started

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check (`vue-tsc -b`) then build for production
- `npm run preview` — serve the production build locally

## Project structure

```
src/
  app entry: main.ts, App.vue (composition root: wires session → drivers/timing/etc.)
  router/               # one route per tab
  shared/
    config/              # env (API base URL)
    lib/                  # throttled OpenF1 HTTP client, color/format helpers
    ui/                   # LoadingState, ErrorState, EmptyState, SectionCard, DriverChips
    layout/               # AppHeader (year/race picker, weather chips), AppTabs
  features/
    session/                # year + race selection, current session
    drivers/                # driver directory, shared driver lookups
    timing/                 # results, race control, fastest lap
    telemetry/               # per-driver lap playback (speed/RPM/gear/DRS)
    circuit/                  # track map built from GPS location samples
    pits/                      # pit stop table
    standings/                  # drivers' & constructors' championships
    calendar/                    # season calendar (derived from session data)
    weather/                      # weather cards + header chips
```

See [CLAUDE.md](CLAUDE.md) for a deeper architectural walkthrough and OpenF1-specific caveats.

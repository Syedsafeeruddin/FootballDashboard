# Matchday — Live Football Dashboard

A live football dashboard built to demonstrate real front-end engineering
decisions — selective polling, memoization, lazy-loaded routing — rather
than a basic API-wrapper tutorial project.

## The core problem

Live matches, upcoming fixtures, and finished results have very different
freshness needs. A naive dashboard polls everything on one fixed interval,
burning API quota and re-rendering the whole page for no reason. This one:

- Fetches all of today's fixtures **once** on load, buckets them client-side
  into `live` / `upcoming` / `finished` / `others`
- Polls **only** the live bucket every 15 seconds — upcoming and finished
  matches are never re-fetched
- Merges fresh live data into existing state: matches still live get updated
  in place, matches that dropped out of the live response move to `finished`
  automatically
- Memoizes `GameCard` with a **custom comparator** (not React's default
  shallow-equal, which doesn't work here — every poll returns brand-new
  objects from `JSON.parse`, even for unchanged matches) so a score update
  on one card never re-renders the other 20+ cards on screen
- Routes to `/game/:id` via React Router rather than a modal, and only
  fetches/derives detail-view data when that route is actually visited

## Tech stack

React + Vite, React Router, Tailwind CSS, [API-Football](https://www.api-football.com/) (free tier).

## Project structure

```
src/
  api/
    client.js       # getApiResponse() — today's fixtures, all leagues
                     # getLiveData()   — live-only fixtures
  utils/
    bucketing.js     # filterByLeague, bucketMatches, mergeLiveUpdate — pure logic, no network
  hooks/
    useGames.js       # fetch + bucket on mount, poll + merge live data every 15s
  components/
    GameCard.jsx      # memoized card, flashes on its own score change
  pages/
    Dashboard.jsx     # Live / Upcoming / Finished sections
    GameDetail.jsx    # routed at /game/:id — score, teams, match events
```

## Known limitation — scoped out deliberately

API-Football's free tier caps requests at **100/day**. Polling alone can
consume a meaningful chunk of that budget over an active session, so
detailed match **statistics and lineups were deliberately left out** —
adding them would require a second API call *per match click*, and a
handful of clicks during a demo could exhaust the daily quota and break
live polling entirely, which is a worse outcome than not showing stats at
all. Match **events** (goals, cards, assists) are shown instead, since
that data comes bundled with the fixtures response at no extra cost.

## Real bugs hit and fixed along the way

- Hardcoded fetch date (`?date=2026-07-10`) meant the dashboard only ever
  showed one specific day's fixtures, regardless of when it was actually
  opened — fixed to compute today's local date dynamically
- Two competing API providers tried before settling on API-Football, after
  discovering the first (`apifootball.com`) had unreliable free-tier auth
- Header-based auth (`x-apisports-key`) vs. URL-based auth — confirmed via
  raw request inspection after a copy-paste key mismatch caused silent
  "missing application key" errors
- `React.memo`'s default shallow comparison doesn't work with data from
  `fetch()` + `.json()`, since every poll produces entirely new object
  references — required a custom comparator checking actual field values
- Stale closures in the polling `useEffect` — fixed using the function form
  of `setState` so merges always operate on current state, not a snapshot
  from when the effect was first set up

## Setup

```bash
npm install
```

Add a `.env` file:
```
VITE_APIKEY=your_api_football_key
```

```bash
npm run dev
```

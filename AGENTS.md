# Memoria — agent notes

Expo SDK 57 project (React Native + Expo Router + TypeScript + Supabase auth).
This is a scaffold: navigation, reusable UI and auth are wired up; tracking
features are intentionally not implemented yet.

Expo SDK 57 introduced breaking changes vs. older versions. Read the exact
versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing code.

## Cursor Cloud specific instructions

### Services

There is a single service: the Expo dev server (Metro bundler). It serves the
React Native app to web, iOS and Android. Commands live in `package.json`
(`start`, `web`, `android`, `ios`, `lint`, `typecheck`).

### Running / testing in the cloud VM

- Web is the only target that can be exercised headlessly in this VM (no
  Android/iOS emulators). Run `npx expo start --web` (or `npm run web`).
- Expo/Metro binds to port 8081 by default; the static web app is served on
  8081 as well. If a run seems stuck, another Expo process may already hold the
  port — check existing terminals before starting a new server.
- The dev server is long-running; start it in a background/tmux session rather
  than a blocking foreground call.

### Environment / Supabase

- Supabase credentials are read from `EXPO_PUBLIC_SUPABASE_URL` and
  `EXPO_PUBLIC_SUPABASE_ANON_KEY` (see `.env.example`). `EXPO_PUBLIC_*` vars are
  inlined by Metro **at bundle time**, so after editing `.env` you must restart
  the dev server for changes to take effect (hot reload will not pick them up).
- Use the **base** project URL (e.g. `https://<ref>.supabase.co`) — do NOT
  include a `/rest/v1/` suffix; `supabase-js` appends the sub-paths itself.
- **Shell env beats `.env`**: Expo/Metro gives shell environment variables
  precedence over `.env`. If this workspace has `EXPO_PUBLIC_SUPABASE_URL` /
  `EXPO_PUBLIC_SUPABASE_ANON_KEY` injected as (placeholder) Secrets, they will
  override `.env` and the app will use the wrong values. To make `.env`
  authoritative, either `unset EXPO_PUBLIC_SUPABASE_URL EXPO_PUBLIC_SUPABASE_ANON_KEY`
  before `npx expo start`, or pass the real values inline on the start command,
  or update the Secrets to the real values.
- The app boots without real credentials (`src/lib/supabase.ts` falls back to a
  placeholder client and logs a warning), so navigation and UI can be developed
  offline. Actual sign-in/sign-up requires a real Supabase project.

### Navigation gotcha

- Auth gating lives in `src/app/_layout.tsx` via Expo Router `Stack.Protected`
  guards keyed off the Supabase session. Route groups `(auth)` and `(tabs)`
  have no default index route of their own — routing is driven by the guard, so
  don't expect `/` to resolve without the auth provider mounted.

### Real data architecture (MVP)

- Data layer: `src/services/*` (external APIs + Supabase CRUD) consumed via
  `@tanstack/react-query` hooks in `src/hooks/` (`use-library`, `use-search`).
  A `QueryClientProvider` wraps the app in `src/app/_layout.tsx`.
- Database schema is versioned in `supabase/migrations/`. For local dev the
  Supabase stack must be running (`supabase start`, needs Docker) which applies
  the migrations; then launch Metro with the printed local `API_URL` /
  `ANON_KEY` as `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
  Tables: `profiles` (auto-created on signup via trigger) and `library_items`
  (RLS: users only see their own rows).
- External media APIs (no placeholder data — show empty states instead):
  - Books → Open Library (`src/services/openlibrary.ts`), no key.
  - TV Shows → TVMaze (`src/services/tvmaze.ts`), no key.
  - Movies → TMDB (`src/services/tmdb.ts`). Requires `EXPO_PUBLIC_TMDB_API_KEY`
    (v3) or `EXPO_PUBLIC_TMDB_ACCESS_TOKEN` (v4). When unset,
    `isTmdbConfigured` is false and the UI shows "Movie database unavailable."
    Never fabricate movie data.

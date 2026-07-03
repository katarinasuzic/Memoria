# Memoria

A cross-platform mobile app to track the **books**, **movies** and **TV shows** you read and watch.

Built with [Expo](https://expo.dev) (React Native), [Expo Router](https://docs.expo.dev/router/introduction/), TypeScript and [Supabase](https://supabase.com) for authentication.

> This repository is a **scaffold**: navigation, reusable UI components and Supabase auth are wired up, but the tracking features are intentionally not implemented yet.

## Requirements

- Node.js 20+ and npm
- A [Supabase](https://supabase.com) project (for authentication)
- For device/simulator testing: Expo Go, or the Android/iOS toolchains

## Get started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables:

   ```bash
   cp .env.example .env
   ```

   Then fill in your Supabase project URL and anon key. The app still boots without
   these values, but authentication requests will fail until they are set.

3. Start the dev server:

   ```bash
   npm start        # then press w (web), a (Android) or i (iOS)
   npm run web      # start directly in the browser
   ```

## Project structure

```
src/
├── app/                    # Expo Router routes (file-based navigation)
│   ├── _layout.tsx         # Root layout: providers + auth-gated navigation
│   ├── (auth)/             # Signed-out stack (sign-in, sign-up)
│   └── (tabs)/             # Signed-in tab navigator (home, books, movies, shows, profile)
├── components/             # Reusable UI (themed text/view + ui/* primitives)
│   └── ui/                 # Button, TextField, Screen, EmptyState
├── constants/theme.ts      # Colors, spacing, fonts
├── contexts/auth-context.tsx  # Supabase session provider + useAuth() hook
├── hooks/                  # Color scheme / theme hooks
└── lib/supabase.ts         # Supabase client
```

Navigation is auth-gated in `src/app/_layout.tsx` using Expo Router's
`Stack.Protected` guards: signed-out users see the `(auth)` group, signed-in
users see the `(tabs)` group.

## Scripts

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `npm start`         | Start the Expo dev server            |
| `npm run web`       | Start the app in a web browser       |
| `npm run android`   | Start on an Android device/emulator  |
| `npm run ios`       | Start on an iOS simulator (macOS)    |
| `npm run lint`      | Run ESLint via `expo lint`           |
| `npm run typecheck` | Type-check with the TypeScript compiler |

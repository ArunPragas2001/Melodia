# Melodia

An offline instrument learning app built with Expo SDK 58 and React Native. Create a local account, browse 12 instruments, save favourites, follow beginner playing guides, and test your knowledge.

## Run the app

Use Node 24 LTS (validated with 24.22.1) and npm. From the repository root:

```bash
cd Melodia
npm ci
npm start
```

Open the app using a compatible Expo Go installation or development build. A physical device must be able to reach Metro; use the LAN address printed by Expo. Android/iOS device execution was not validated in the cloud environment. iOS simulator execution requires macOS.

For a browser:

```bash
npm run web
```

Cloud environments with a read-only home directory can start Metro with writable caches:

```bash
mkdir -p /workspace/.expo-home /workspace/.cache
EXPO_OFFLINE=1 __UNSAFE_EXPO_HOME_DIRECTORY=/workspace/.expo-home XDG_CACHE_HOME=/workspace/.cache npm start -- --localhost --port 8082
```

The Expo home override is a CLI escape hatch for this cloud environment. Omit these overrides on a normal writable machine. Expo offline mode disables CLI network checks; the device still needs to reach Metro during development.

## Included features

- Home spotlight, suggested instruments, and family shortcuts.
- Explore all 12 instruments or filter by Strings, Wind, Percussion, and Keyboard.
- Categories with instrument counts and links to filtered Explore results.
- Search by instrument name and family, with clear result and empty states.
- Instrument profiles with origins, main components, and local images.
- Beginner setup, playing steps, practice patterns, demonstrations, and tips.
- Device-local registration and login with salted password hashes.
- Per-account favourites that remain available after restarting the app.
- An eight-question quiz with explanations and saved score history.
- A profile with progress statistics, recent scores, image credits, and sign-out.

Instrument cards on Home and Explore open the matching profile. Search ignores
capitalisation and extra spaces, and can be combined with a family filter.

The 12 instrument records, lesson reference and credited images are bundled locally. No backend or API key is needed. Accounts exist only on the current device and are not synchronised or recoverable from another device.

## Checks

```bash
npm run check
npm run lint
npm run typecheck
npx expo export --platform android --platform ios --platform web --max-workers 2
npm run test:browser
npm run previews
```

Browser tests run against the exported `dist` directory and use system Chromium when available. Otherwise install the test browser with `npx playwright install chromium`. See [TESTING.md](TESTING.md) for the current checks and remaining device testing.

## Project structure

- `src/app/`: Expo Router routes, account pages, stack, and five main tabs.
- `src/screens/`: account, library, favourites, quiz, profile, and detail screens.
- `src/components/`: cards, form controls, search, playing guides, and shared UI.
- `src/data/`: instrument records, image mappings, and family metadata.
- `src/storage/`: local accounts, sessions, favourites, and quiz history.
- `assets/images/`: bundled instrument images.
- `previews/`: screenshots generated from the current web export.

## Reference and credits

Adapted from the same project's [`melodia-app` branch](https://github.com/ArunPragas2001/3.1-new/tree/melodia-app), commit `264897f50664c7f06313a6fee84dccd51e7a1c06`. The reference uses SDK 54; this repository retains SDK 58 and uses Expo Router according to `AGENTS.md`.

Image authors, original sources, licences, and changes are recorded in [assets/image-credits.json](assets/image-credits.json). Keep these credits with the images. [INSTRUMENT_GUIDE.md](INSTRUMENT_GUIDE.md) contains the corresponding lesson reference. The family names are learning categories: keyboards may produce sound using strings or air, and Wind includes brass and woodwinds.

See [STUDY_GUIDE.md](STUDY_GUIDE.md) for a short walkthrough and [VALIDATION.md](VALIDATION.md) for the final validation record.

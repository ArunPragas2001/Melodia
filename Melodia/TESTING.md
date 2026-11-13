# Testing Melodia

Run these commands from the `Melodia/` app directory after `npm ci`:

```bash
npm run check
npm run lint
npm run typecheck
npx expo export --platform android --platform ios --platform web --max-workers 2
npm run test:browser
```

The browser test uses the exported `dist` directory and starts its own local server. It uses system Chromium when available. Otherwise run `npx playwright install chromium`, or set `CHROMIUM_PATH` to an installed browser.

## Current checks

Verified: data validation, lint, JavaScript type checks, Android/iOS/web exports and the browser smoke test below. No native device tests were run.

- Data: 12 instruments, three in each of four families, local image files, image credit records and complete lesson fields.
- Home: the spotlight opens Strings in Explore, and family shortcuts open the selected family.
- Categories: all four cards open the matching Explore filter.
- Explore: each family shows three instruments, All shows 12, A–Z and Z–A sorting work, filters survive a reload, and an unknown family returns to All.
- Search: trimmed and case-insensitive name matching, family filters, singular and plural result counts, clear input, and empty results.
- Details: valid and missing instrument IDs, origin and component information, playing steps, practice content, demonstration, tip, and family navigation.
- Accounts: registration validation, session restore after reload, logout, rejected passwords, and successful login.
- Favourites: save from Details, per-account local persistence, and the saved collection screen.
- Quiz and profile: all eight correct-answer flows, automatic score saving, recent history, and personal statistics.
- Images: all 12 instrument images load in the browser.
- Layout: Home, Explore, Categories, Search, and Details have no document overflow at 320, 390 and 820 pixels.
- Lint and JavaScript type checks use the committed configurations.

Cloud validation uses Node 24.22.1, npm 11.9.0 and Expo SDK 58. To use the cloud export directory:

```bash
CI=1 EXPO_OFFLINE=1 __UNSAFE_EXPO_HOME_DIRECTORY=/workspace/.expo-home XDG_CACHE_HOME=/workspace/.cache npx expo export --platform web --platform android --platform ios --max-workers 2 --output-dir /workspace/melodia-export-check
MELODIA_EXPORT_DIR=/workspace/melodia-export-check npm run test:browser
MELODIA_EXPORT_DIR=/workspace/melodia-export-check npm run previews
```

## Still to check on a device

Android and iOS exports check bundling, not installed app behaviour. Check safe areas, back navigation, the search keyboard, horizontal practice-pattern scrolling, touch targets, large system text and image sizing on a phone. Verify locally bundled content in airplane mode using an installed build. A Metro session still needs its server; the web export has no offline service worker.

Account credentials and progress are intentionally device-local. Clearing storage or uninstalling removes them. The browser test uses a fresh browser context and does not test account recovery or synchronisation because the app has no remote service.

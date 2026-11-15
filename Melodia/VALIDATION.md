# Validation record

## Automated results

- Instrument and credit validation: passed for 12 instruments, four families, local images, playing guides, eight quiz questions, and image licences.
- ESLint: passed for application and script files.
- JavaScript type checking: passed with the committed TypeScript configuration.
- Production exports: web, Android Hermes, and iOS Hermes bundles completed successfully.
- Browser journey: passed with no page errors.

The browser journey covers registration, validation errors, session reload, library browsing, all family filters, search, missing results, instrument details, playing guides, favourite persistence, all quiz questions, saved profile history, logout, failed login, successful login, and widths of 320, 390, and 820 pixels.

## Generated evidence

The `previews/` directory contains current screenshots for Home, Explore, Guitar details, Favourites, Quiz, Profile, Login, and Registration. Run `npm run previews` against a current web export to replace them.

## Manual checks still required

- Install or open the app on physical Android and iOS devices.
- Check safe areas, system back behaviour, keyboard avoidance, large text, screen readers, and touch targets.
- Confirm the practice pattern scrolls horizontally on narrow devices.
- Confirm an installed build opens bundled lessons and images in airplane mode.
- Confirm expected persistence after fully closing and reopening each native app.

Metro development sessions still require access to the development server. The static web export does not include an offline service worker.

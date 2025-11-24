# duriin-site

A hub for content with flexible layouts.

## Development

```bash
npm install
npm run dev
```

## Syncing YouTube uploads without exposing keys

Use the provided content script as a tiny proxy so the YouTube API key never ships to the browser:

1. Create `.env.local` (or set CI secrets) with:
   ```
   VITE_YOUTUBE_API_KEY=your_api_key
   VITE_YOUTUBE_CHANNEL_ID=your_channel_id
   # Optional: Twitch VODs
   TWITCH_CLIENT_ID=...
   TWITCH_CLIENT_SECRET=...
   TWITCH_USER_ID=...
   ```
2. Run `npm run sync:content`. The script calls the YouTube Data API server-side, normalizes fields
   like `thumbnailUrl`, `embedUrl`, `duration`, and writes `src/content/videos.json`.
3. Commit the refreshed JSON (or run the script in CI) and the front end will render the latest
   uploads with thumbnails and the inline player. Your keys remain only in environment variables.

## Theming and layouts

The app now exposes a layout + mode system powered by the `ThemeProvider` in `src/theme/ThemeContext.tsx`.
The provider persists the selected layout (`brutalist` or `modern`) and theme mode (`light` or `dark`) and
mirrors them to `data-theme-layout` and `data-theme-mode` attributes on `<html>` and the `.app` root. The
`ThemeSettings` component (in the header) renders the selector UI and updates the provider.

### Styling architecture

All global styles live in `src/styles` and are composed inside `src/styles/main.scss`.

- `src/styles/utilities` centralizes variables, breakpoints, layout helpers, spacing utilities, and
  component mixins so every theme consumes the same responsive primitives.
- Theme overrides are stored per layout/mode combo inside `src/styles/themes` and only adjust CSS
  custom properties such as `--color-bg-page` or `--panel-radius`.
- Component/layout styling lives inside `src/styles/components/*` and consumes the semantic tokens.

```
src/styles/
├── utilities/
│   ├── _index.scss          # forwards the global mixins/variables
│   ├── _variables.scss      # CSS custom property tokens
│   ├── _breakpoints.scss    # respond() mixin + breakpoint map
│   ├── _typography.scss     # fluid typography helpers
│   ├── _spacing.scss        # responsive spacing utilities
│   ├── _layout.scss         # grid/flex helpers
│   └── _components.scss     # button, border, pill helpers
├── themes/                  # light/dark overrides per layout
└── components/              # feature-specific partials
```

### Adding a new theme

1. Create a new file inside `src/styles/themes` and follow the existing naming convention, e.g.
   `_brutalist-light.scss`.
2. Inside the file, target `[data-theme-layout='new-layout'][data-theme-mode='new-mode']` and set the
   semantic CSS custom properties you want to override.
3. Import the new file inside `src/styles/main.scss` so it is bundled.

### Adding a new layout

1. Extend the `ThemeLayout` union in `src/theme/ThemeContext.tsx`.
2. Update the layout labels inside `src/components/ThemeSettings.tsx`.
3. Provide layout-specific tokens in a new file under `src/styles/themes` for each light/dark pairing.
4. Add any structural overrides in the component SCSS files using the
   `[data-theme-layout='your-layout']` selector.
5. (Optional) include new React components if the layout needs bespoke markup.

With these pieces in place, the header selector automatically lists the new layout and persists the
selection for the user.

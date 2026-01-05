# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Storybook addon that enables dynamic stylesheet switching during development. Users can toggle between different CSS files using a dropdown menu in the Storybook toolbar.

**Published Package**: `@stevendejong/storybook-stylesheet-toggle`

## Recent Changes

### v1.0.x - Custom Stylesheet Input Feature

The addon now supports dynamic custom stylesheet management:

**New files:**
- `src/customStylesheets.ts` - Utility functions for localStorage management
- `src/CustomStylesheetInput.tsx` - Input component for adding stylesheets
- `src/CustomTooltipLinkList.tsx` - Enhanced dropdown with delete functionality

**Modified files:**
- `src/Tool.tsx` - Now uses CustomTooltipLinkList
- `src/withGlobals.ts` - Resolves custom stylesheet URLs

**localStorage structure:**
- `stylesheetToggle`: Selected stylesheet ID (e.g., "default" or "custom:1704451200000")
- `stylesheetToggle:custom`: JSON object storing custom stylesheet data

**Key features:**
- Users can add custom stylesheet URLs via input field
- Custom stylesheets persist across sessions
- Delete functionality with confirmation
- URL validation and duplicate detection
- Auto-naming from URLs with uniqueness handling

## Development Commands

### Building

```bash
# Clean build directory
yarn clean

# Production build (automatically runs yarn clean first)
yarn build

# Watch mode for development
yarn build:watch

# Start Storybook dev server + build in watch mode
yarn start
```

### Storybook Development

```bash
# Run Storybook dev server (port 6006)
yarn storybook

# Build static Storybook
yarn build-storybook
```

### Release

```bash
# Publish to npm with automated versioning and changelog
yarn release
```

This uses the `auto` tool for semantic versioning and changelog generation. GitHub Actions automatically runs this on pushes to main.

## Architecture

### Multi-Entry Build System

The addon uses **tsup** with a sophisticated multi-entry configuration defined in `tsup.config.ts`. This creates four separate builds:

1. **Export Entries** (`src/index.ts`)
   - Outputs: ESM + CommonJS
   - Target: Browser + Node
   - Purpose: Public API for manual imports

2. **Manager Entries** (`src/manager.tsx`)
   - Output: ESM only
   - Target: Browser (Storybook manager UI)
   - Externalizes: Storybook manager packages
   - Purpose: Toolbar button and UI components

3. **Preview Entries** (`src/preview.ts`)
   - Output: ESM only
   - Target: Browser (preview iframe)
   - Externalizes: Storybook preview packages
   - Purpose: Decorators that inject stylesheets into stories

4. **Node Entries** (`src/preset.ts`)
   - Output: CommonJS only
   - Target: Node 18+
   - Purpose: Vite/Webpack configuration augmentation

**Build Configuration**: Package.json's `bundler` field defines which files belong to each entry type.

### How the Addon Works

1. **Registration** (`src/manager.tsx`): Registers the addon with Storybook's manager API
2. **Toolbar UI** (`src/Tool.tsx`): Provides a paint brush icon button with dropdown menu
3. **Stylesheet Injection** (`src/withGlobals.ts`): Decorator that injects `<link>` tags into the preview iframe
4. **Configuration** (`src/preset.ts`): Preset that augments Storybook's build configuration
5. **Persistence**: Selected stylesheet stored in localStorage, survives page reloads

## Key Files

### Core Implementation

- **src/Tool.tsx**: React component for the toolbar dropdown button
  - Merges default stylesheets with user-provided ones
  - Handles localStorage persistence
  - Triggers page reload when stylesheet changes

- **src/withGlobals.ts**: Decorator that injects stylesheets
  - Runs in the preview iframe
  - Creates/removes `<link>` tags based on selected stylesheet
  - Responds to theme and stylesheet toggle changes

- **src/manager.tsx**: Manager registration
  - Registers the addon with `addons.register()`
  - Creates a TOOL type addon in the toolbar
  - Extracts `stylesheetToggle` parameter from story configuration

- **src/preview.ts**: Preview setup
  - Exports the `withGlobals` decorator
  - Provides preview annotations

- **src/preset.ts**: Build configuration preset
  - Node-only code for augmenting Vite/Webpack configs

### Configuration

- **tsup.config.ts**: Build configuration
  - Reads `bundler` field from package.json
  - Creates four separate build targets
  - Browser targets: Chrome 100+, Safari 15+, Firefox 91+

- **.storybook/main.ts**: Storybook configuration
  - Uses `./local-preset.js` for local testing
  - React + Vite framework

- **.storybook/local-preset.js**: Local testing preset
  - Points to local `dist/` output instead of published package
  - Used during development with `yarn start`

### Stories (Demo/Testing)

- **src/stories/Button.tsx**: Example React component
- **src/stories/Button.stories.ts**: Story definitions demonstrating stylesheet toggle
- **src/stories/Introduction.mdx**: Documentation page

## Testing the Addon Locally

When developing, use the `.storybook/local-preset.js` to test your changes:

```javascript
// .storybook/local-preset.js
module.exports = {
  managerEntries: (entry = []) => [...entry, require.resolve("../dist/manager")],
  previewAnnotations: (entry = []) => [...entry, require.resolve("../dist/preview")],
};
```

Run `yarn start` to:
1. Build the addon in watch mode
2. Start Storybook dev server (uses local-preset)
3. See changes reflected immediately

## Package Exports

The addon provides multiple export paths in package.json:

```json
{
  ".": "./dist/index.js",           // Main entry
  "./preview": "./dist/preview.js",  // Preview decorator
  "./preset": "./dist/preset.cjs",   // Build preset
  "./manager": "./dist/manager.js"   // Manager UI
}
```

Users typically don't import these directly - Storybook loads them automatically via the preset.

## Configuration Usage

Users configure the addon in their `.storybook/preview.ts`:

```typescript
const preview: Preview = {
  parameters: {
    stylesheetToggle: {
      "default": "main.css",
      "custom-theme": "custom-theme.css",
      "external": "https://example.com/theme.css",
    },
  },
};
```

## CI/CD

GitHub Actions workflow (`.github/workflows/release.yml`):
- Triggers on every push to main (skips if commit message contains "skip ci")
- Runs `yarn release` which:
  - Builds the addon
  - Runs `auto shipit` for semantic versioning
  - Publishes to npm (public registry)
  - Generates changelog
  - Creates GitHub release

## Dependencies

**Zero Runtime Dependencies** - The addon has no production dependencies.

**Key DevDependencies**:
- Storybook 8.x (manager-api, components, icons)
- React 18.x (for UI components)
- tsup 8.x (bundler)
- TypeScript 5.4.x
- auto 11.x (release automation)

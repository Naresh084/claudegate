# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ClaudeGate is a terminal utility that wraps Claude CLI, enabling seamless switching between AI provider configurations (Anthropic, Z.AI, OpenRouter, Kimi K2, Novita AI, and custom endpoints) without manual config file editing.

## Build & Development Commands

```bash
# Build TypeScript to dist/
npm run build

# Watch mode for development
npm run dev

# Run the compiled CLI
npm start

# Link for local development (after build)
npm link
```

## Architecture

```
src/
├── index.ts              # Main entry: arg parsing → profile selector → launch
├── providers/
│   └── registry.ts       # Provider definitions (env vars, endpoints, defaults)
├── services/
│   ├── config.service.ts     # Load/save ~/.claudegate/config.json
│   ├── profile.service.ts    # CRUD for profiles
│   ├── launcher.service.ts   # Spawn Claude subprocess with env vars
│   └── env-builder.service.ts # Build env vars from provider + profile
├── ui/
│   ├── profile-selector.ts   # Main interactive menu
│   ├── add-profile.ts        # New profile flow
│   ├── manage-profiles.ts    # Edit/delete/test profiles
│   └── components/           # Banner, status messages
└── types/                    # TypeScript interfaces
```

**Key Flow**: `index.ts` → `profile-selector.ts` → `env-builder.service.ts` → `launcher.service.ts`

## Adding a New Provider

1. Add provider definition in `src/providers/registry.ts`:
   ```typescript
   {
     id: 'provider-id',
     name: 'Provider Name',
     description: 'Short description',
     color: '#hexcolor',
     envVars: [
       { name: 'ENV_VAR', label: 'Label', type: 'apiKey', sensitive: true, required: true }
     ]
   }
   ```

2. The UI automatically picks up new providers from the registry.

## Key Implementation Details

- **Config location**: `~/.claudegate/config.json` (0o600 permissions for security)
- **ES Modules**: Uses `"type": "module"` - use `.js` extensions in imports
- **Node requirement**: >=18.0.0
- **CLI entry points**: `bin/claudegate.js` and `bin/cc.js` (alias)
- **Environment override**: Clears `ANTHROPIC_API_KEY` when using non-Anthropic providers to force custom endpoints

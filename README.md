# ClaudeGate

Terminal utility to switch between AI provider configurations for Claude CLI.

## Overview

ClaudeGate is a gateway/wrapper around Claude CLI that allows users to easily switch between different AI provider configurations without manually editing config files.

## Supported Providers

| Provider | Description |
|----------|-------------|
| **Anthropic (Native)** | Use your existing Claude CLI configuration |
| **Z.AI (GLM Models)** | Cheaper alternative using GLM models |
| **OpenRouter** | Access 320+ models through OpenRouter |
| **Kimi K2 (Moonshot AI)** | 90% cheaper - Moonshot AI Kimi K2 models |
| **Novita AI** | Novita AI provider |
| **Custom / Self-hosted** | LiteLLM, Hugging Face TGI, or other compatible endpoints |

## Installation

```bash
npm install -g claudegate
```

Or clone and install locally:

```bash
git clone <repo-url>
cd personal-cli
npm install
npm run build
npm link
```

## Usage

### Basic Usage

```bash
# Launch interactive profile selector, then Claude
claudegate

# Pass arguments to Claude
claudegate -p "help me fix this bug"
claudegate --help
claudegate --resume

# Quick alias
cc
cc -p "write some code"
```

### How It Works

Every time you run `claudegate` or `cc`:

1. **Profile Selector** - Always shows first, letting you pick which provider to use
2. **Select/Add/Manage** - Pick existing profile, add new one, or manage existing
3. **Launch Claude** - After selection, Claude CLI launches with the correct environment

### Profile Selector Menu

```
╔═══════════════════════════════════════════════════════╗
║                     CLAUDEGATE                        ║
╚═══════════════════════════════════════════════════════╝

? Select active profile:
> ● work-anthropic (Anthropic) [current]
    zai-dev (Z.AI - GLM Models)
    openrouter-gpt4 (OpenRouter)
    kimi-k2 (Kimi K2 - Moonshot AI)
  ─────────────────────────────────────
    + Add new profile
    ⚙ Manage profiles
```

### Adding a Profile

When you select "+ Add new profile":

1. Choose a provider (Anthropic, Z.AI, OpenRouter, etc.)
2. Enter a profile name
3. Enter required credentials (API keys, endpoints)
4. Profile is saved and set as active

### Managing Profiles

When you select "⚙ Manage profiles":

- **Edit** - Modify profile name or credentials
- **Delete** - Remove a profile
- **Test** - Verify configuration is valid

## Configuration

Profiles are stored in `~/.claudegate/config.json`.

### Example Config

```json
{
  "version": "1.0.0",
  "activeProfileId": "uuid-here",
  "profiles": [
    {
      "id": "uuid-here",
      "name": "work-anthropic",
      "providerId": "anthropic",
      "envVars": {}
    },
    {
      "id": "uuid-2",
      "name": "zai-dev",
      "providerId": "zai",
      "envVars": {
        "ANTHROPIC_AUTH_TOKEN": "your-key",
        "ANTHROPIC_BASE_URL": "https://api.z.ai/api/anthropic"
      }
    }
  ]
}
```

## Key Features

- **Unified Flow** - Always shows profile selector, then launches Claude
- **Pure Passthrough** - All arguments pass directly to Claude CLI
- **Non-Destructive** - Doesn't modify `~/.claude/settings.json`
- **Multiple Providers** - Support for 6 different providers out of the box

## License

MIT


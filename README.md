# ClaudeGate

[![npm version](https://badge.fury.io/js/claudegate.svg)](https://www.npmjs.com/package/claudegate)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![CI](https://github.com/Naresh084/claudegate/actions/workflows/ci.yml/badge.svg)](https://github.com/Naresh084/claudegate/actions/workflows/ci.yml)

> A terminal utility that acts as a gateway for Claude CLI, enabling seamless switching between AI providers without modifying your Claude configuration.

## Why ClaudeGate?

Claude CLI is powerful, but switching between different AI providers (Anthropic, OpenRouter, Z.AI, etc.) requires manually setting environment variables or editing config files. **ClaudeGate** solves this by providing:

- **One-click provider switching** - Interactive menu to select your AI backend
- **Profile management** - Save multiple configurations for different use cases
- **Zero config pollution** - Never modifies your `~/.claude/settings.json`
- **Full CLI passthrough** - All Claude arguments work exactly as expected

## Supported Providers

| Provider | Description |
|----------|-------------|
| **Anthropic (Native)** | Use your existing Claude CLI configuration |
| **Z.AI (GLM Models)** | Cost-effective alternative using GLM-4.7 models |
| **OpenRouter** | Access 320+ models through a single API |
| **Kimi K2 (Moonshot AI)** | Up to 90% cost savings with Kimi K2 models |
| **Novita AI** | Novita AI provider support |
| **Custom / Self-hosted** | LiteLLM, Hugging Face TGI, or any compatible endpoint |

## Installation

```bash
npm install -g claudegate
```

## Quick Start

```bash
# Launch ClaudeGate - shows profile selector, then starts Claude
claudegate

# Or use the short alias
cc

# All Claude CLI arguments work as expected
claudegate -p "explain this code"
claudegate --resume
cc -p "help me debug this"
```

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                        CLAUDEGATE                           │
└─────────────────────────────────────────────────────────────┘

? Select active profile:
❯ ● work-anthropic (Anthropic) [current]
    zai-dev (Z.AI - GLM Models)
    openrouter-gpt4 (OpenRouter)
    kimi-k2 (Kimi K2 - Moonshot AI)
  ─────────────────────────────────────
    + Add new profile
    ⚙ Manage profiles
```

1. **Select Profile** - Choose which AI provider to use
2. **Launch Claude** - Claude CLI starts with the correct environment
3. **Work normally** - All your usual Claude workflows just work

## Profile Management

### Adding a Profile

Select **"+ Add new profile"** from the menu:

1. Choose a provider (Anthropic, Z.AI, OpenRouter, etc.)
2. Enter a profile name (e.g., "work-openrouter")
3. Enter required credentials (API keys, endpoints)
4. Profile is saved and ready to use

### Managing Profiles

Select **"⚙ Manage profiles"** to:

- **Edit** - Update profile name or credentials
- **Delete** - Remove a profile
- **Test** - Verify your configuration works

## Configuration

Profiles are stored in `~/.claudegate/config.json`:

```json
{
  "version": "1.0.0",
  "activeProfileId": "abc-123",
  "profiles": [
    {
      "id": "abc-123",
      "name": "work-anthropic",
      "providerId": "anthropic",
      "envVars": {}
    },
    {
      "id": "def-456",
      "name": "zai-dev",
      "providerId": "zai",
      "envVars": {
        "ANTHROPIC_AUTH_TOKEN": "your-api-key",
        "ANTHROPIC_BASE_URL": "https://api.z.ai/api/anthropic"
      }
    }
  ]
}
```

## Prerequisites

- **Node.js** >= 18.0.0
- **[Claude CLI](https://docs.anthropic.com/en/docs/claude-code)** installed and configured
- API keys for your desired providers

## Security

- Config stored with `0600` permissions (owner read/write only)
- API keys stored locally, never transmitted except to configured providers
- Sensitive values masked during input

## Troubleshooting

### Claude CLI not found

```bash
which claude  # Should show Claude CLI path
```

If not found, install Claude CLI first.

### Permission denied

```bash
chmod 700 ~/.claudegate
chmod 600 ~/.claudegate/config.json
```

### Provider connection issues

Use the **"Test"** option in profile management to verify credentials.

## Uninstall

```bash
npm uninstall -g claudegate
rm -rf ~/.claudegate
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automatic versioning.

## License

[MIT](LICENSE)

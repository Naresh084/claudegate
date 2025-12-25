# ClaudeGate

<p align="center">
  <strong>A gateway for Claude CLI that enables seamless switching between AI providers</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/claudegate"><img src="https://img.shields.io/npm/v/claudegate.svg?style=flat-square" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/claudegate"><img src="https://img.shields.io/npm/dm/claudegate.svg?style=flat-square" alt="npm downloads"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg?style=flat-square" alt="Node.js"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="License"></a>
  <a href="https://github.com/Naresh084/claudegate/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/Naresh084/claudegate/ci.yml?branch=main&style=flat-square" alt="CI"></a>
</p>

<p align="center">
  <a href="https://github.com/Naresh084/claudegate/stargazers"><img src="https://img.shields.io/github/stars/Naresh084/claudegate?style=social" alt="GitHub stars"></a>
  <a href="https://github.com/Naresh084/claudegate/network/members"><img src="https://img.shields.io/github/forks/Naresh084/claudegate?style=social" alt="GitHub forks"></a>
</p>

---

**ClaudeGate** is a terminal utility that wraps Claude CLI, enabling you to switch between multiple AI providers (Anthropic, OpenRouter, DeepSeek, Z.AI, MiniMax, Kimi K2, and more) without modifying your Claude configuration. Select your provider, choose your models, and start coding.

## Why ClaudeGate?

Claude CLI is powerful, but switching between different AI providers requires manually setting environment variables or editing config files. ClaudeGate solves this by providing:

- **One-click provider switching** — Interactive menu to select your AI backend
- **Dynamic model selection** — Fetch and select models directly from provider APIs
- **Three-tier model mapping** — Configure Haiku, Sonnet, and Opus alternatives
- **Profile management** — Save multiple configurations for different use cases
- **Zero config pollution** — Never modifies your `~/.claude/settings.json`
- **Full CLI passthrough** — All Claude arguments work exactly as expected

## Supported Providers

| Provider | Description | Live Model Fetching |
|----------|-------------|:-------------------:|
| **Anthropic** | Native Claude CLI configuration | — |
| **Z.AI** | Cost-effective GLM-4.6/4.7 models | ✓ |
| **OpenRouter** | Access 320+ models through single API | ✓ |
| **Kimi K2** | Up to 90% cost savings with Moonshot AI | ✓ |
| **MiniMax** | Agent-native M2/M2.1 models for coding | ✓ |
| **DeepSeek** | 128K context models with reasoning | ✓ |
| **Novita AI** | Novita AI provider support | ✓ |
| **Custom** | LiteLLM, HuggingFace TGI, any compatible endpoint | — |

## Get Started

### Prerequisites

- **Node.js** >= 18.0.0
- **[Claude CLI](https://docs.anthropic.com/en/docs/claude-code)** installed and configured
- API keys for your desired providers

### Installation

```bash
npm install -g claudegate
```

### Quick Start

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
    deepseek-v3 (DeepSeek)
    minimax-m2 (MiniMax)
  ─────────────────────────────────────
    + Add new profile
    ⚙ Manage profiles
```

1. **Select Profile** — Choose which AI provider to use
2. **Launch Claude** — Claude CLI starts with the correct environment
3. **Work normally** — All your usual Claude workflows just work

## Features

### Dynamic Model Selection

ClaudeGate fetches available models **live from provider APIs**. When creating or editing a profile, you can select models for each tier:

```
? Select model for HAIKU (fast/cheap tasks):
  ○ Skip (use provider default)
  ○ deepseek-chat (Recommended)
  ○ deepseek-reasoner
  ○ Enter custom model ID...

? Select model for SONNET (balanced tasks):
  ○ Skip (use provider default)
  ○ deepseek-chat (Recommended)
  ○ deepseek-reasoner
  ○ Enter custom model ID...

? Select model for OPUS (complex reasoning):
  ○ Skip (use provider default)
  ○ deepseek-reasoner (Recommended)
  ○ deepseek-chat
  ○ Enter custom model ID...
```

**Three-tier model mapping:**
| Tier | Use Case |
|------|----------|
| **Haiku** | Fast/cheap tasks (quick edits, simple queries) |
| **Sonnet** | Balanced tasks (most common usage) |
| **Opus** | Complex reasoning (architecture, debugging) |

Models are saved with your profile—no need to reselect every time.

### Profile Management

#### Adding a Profile

Select **"+ Add new profile"** from the menu:

1. Choose a provider (Z.AI, OpenRouter, DeepSeek, MiniMax, etc.)
2. Enter a profile name (e.g., `work-deepseek`)
3. Enter required credentials (API keys, endpoints)
4. Select models for Haiku, Sonnet, and Opus tiers
5. Profile is saved and ready to use

#### Managing Profiles

Select **"⚙ Manage profiles"** to:

| Action | Description |
|--------|-------------|
| **Edit** | Update profile name or credentials |
| **Change Models** | Select different models for each tier |
| **Delete** | Remove a profile |
| **Test** | Verify configuration and view current models |

## Provider Setup

<details>
<summary><strong>Z.AI (GLM Models)</strong></summary>

- **Models:** GLM-4.7, GLM-4.6, GLM-4.5-air
- **Endpoint:** `https://api.z.ai/api/anthropic`
- **Get API key:** [z.ai/manage-apikey](https://z.ai/manage-apikey)

</details>

<details>
<summary><strong>DeepSeek</strong></summary>

- **Models:** deepseek-chat (V3), deepseek-reasoner (thinking mode)
- **Endpoint:** `https://api.deepseek.com`
- **Get API key:** [platform.deepseek.com](https://platform.deepseek.com)
- 128K context window, extremely cost-effective

</details>

<details>
<summary><strong>MiniMax (M2 Models)</strong></summary>

- **Models:** MiniMax-M2.1 (230B), MiniMax-M2
- **Endpoint:** `https://api.minimax.io/anthropic`
- **Get API key:** [platform.minimax.io](https://platform.minimax.io)
- Optimized for coding and agentic workflows

</details>

<details>
<summary><strong>OpenRouter</strong></summary>

- Access 320+ models from multiple providers
- **Endpoint:** `https://openrouter.ai/api`
- **Get API key:** [openrouter.ai/keys](https://openrouter.ai/keys)

</details>

<details>
<summary><strong>Moonshot (Kimi K2)</strong></summary>

- **Models:** kimi-k2-0711-preview
- **Endpoint:** `https://api.moonshot.ai/anthropic`
- **Get API key:** [platform.moonshot.ai](https://platform.moonshot.ai)

</details>

## Configuration

Profiles are stored in `~/.claudegate/config.json`:

```json
{
  "version": "1.0.0",
  "activeProfileId": "abc-123",
  "profiles": [
    {
      "id": "abc-123",
      "name": "deepseek-dev",
      "providerId": "deepseek",
      "envVars": {
        "ANTHROPIC_AUTH_TOKEN": "sk-xxx",
        "ANTHROPIC_BASE_URL": "https://api.deepseek.com"
      },
      "selectedModels": {
        "haiku": { "id": "deepseek-chat", "name": "DeepSeek Chat V3" },
        "sonnet": { "id": "deepseek-chat", "name": "DeepSeek Chat V3" },
        "opus": { "id": "deepseek-reasoner", "name": "DeepSeek Reasoner" }
      }
    }
  ]
}
```

### Environment Variables

ClaudeGate sets these environment variables based on your profile:

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_BASE_URL` | Provider API endpoint |
| `ANTHROPIC_AUTH_TOKEN` | API authentication token |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | Model for Haiku-tier requests |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | Model for Sonnet-tier requests |
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | Model for Opus-tier requests |

## Security

- Config stored with `0600` permissions (owner read/write only)
- API keys stored locally, never transmitted except to configured providers
- Sensitive values masked during input

## Troubleshooting

<details>
<summary><strong>Claude CLI not found</strong></summary>

```bash
which claude  # Should show Claude CLI path
```

If not found, install Claude CLI first: [docs.anthropic.com/en/docs/claude-code](https://docs.anthropic.com/en/docs/claude-code)

</details>

<details>
<summary><strong>Permission denied</strong></summary>

```bash
chmod 700 ~/.claudegate
chmod 600 ~/.claudegate/config.json
```

</details>

<details>
<summary><strong>Provider connection issues</strong></summary>

Use the **"Test"** option in profile management to verify credentials.

</details>

<details>
<summary><strong>Model fetch failed</strong></summary>

If live model fetching fails:
1. Check your API key is valid
2. Fallback models will be shown
3. You can always enter a custom model ID

</details>

## Uninstall

```bash
npm uninstall -g claudegate
rm -rf ~/.claudegate
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automatic versioning.

## Star History

<a href="https://star-history.com/#Naresh084/claudegate&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=Naresh084/claudegate&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=Naresh084/claudegate&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=Naresh084/claudegate&type=Date" />
 </picture>
</a>

## License

[MIT](LICENSE)

---

<p align="center">
  Made with Claude Code
</p>

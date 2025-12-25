# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-XX

### Added

- Initial public release
- Interactive profile selector with intuitive TUI
- Support for 6 AI providers:
  - **Anthropic (Native)** - Use existing Claude CLI configuration
  - **Z.AI** - GLM-4.7 models, cost-effective alternative
  - **OpenRouter** - Access to 320+ models
  - **Kimi K2 (Moonshot AI)** - 90% cheaper option
  - **Novita AI** - Novita AI provider support
  - **Custom/Self-hosted** - LiteLLM, Hugging Face TGI, or compatible endpoints
- Profile management (create, edit, delete, test)
- Secure configuration storage at `~/.claudegate/config.json` with 0600 permissions
- CLI commands: `claudegate` (full) and `cc` (alias)
- Pure passthrough of all CLI arguments to Claude
- Non-destructive operation - never modifies `~/.claude/settings.json`

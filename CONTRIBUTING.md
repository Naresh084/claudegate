# Contributing to ClaudeGate

Thank you for your interest in contributing to ClaudeGate! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and constructive in all interactions. We welcome contributors of all experience levels.

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm
- Git

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/Naresh084/claudegate.git
   cd claudegate
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the project:
   ```bash
   npm run build
   ```
5. Link for local testing:
   ```bash
   npm link
   ```

### Development Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run dev` | Watch mode for development |
| `npm test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Check code for linting errors |
| `npm run lint:fix` | Fix auto-fixable linting errors |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |

## Project Structure

```
claudegate/
+-- bin/                    # CLI entry points
+-- src/
|   +-- index.ts           # Main entry point
|   +-- providers/         # Provider definitions
|   +-- services/          # Business logic
|   +-- types/             # TypeScript interfaces
|   +-- ui/                # User interface components
|   +-- utils/             # Utility functions
+-- tests/                  # Test files
+-- dist/                   # Compiled output (generated)
```

## How to Contribute

### Reporting Bugs

1. Check existing issues to avoid duplicates
2. Use the bug report template
3. Include:
   - Node.js version
   - Operating system
   - ClaudeGate version
   - Steps to reproduce
   - Expected vs actual behavior

### Suggesting Features

1. Check existing issues and discussions
2. Use the feature request template
3. Describe the problem you're trying to solve
4. Explain your proposed solution

### Submitting Code

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes
3. Write/update tests
4. Ensure all tests pass:
   ```bash
   npm test
   ```
5. Ensure code passes linting:
   ```bash
   npm run lint
   ```
6. Format your code:
   ```bash
   npm run format
   ```
7. Commit with a descriptive message
8. Push and create a Pull Request

### Commit Message Guidelines (Conventional Commits)

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automatic versioning and changelog generation.

**Format:** `<type>(<scope>): <description>`

#### Types

| Type | Description | Version Bump |
|------|-------------|--------------|
| `feat` | New feature | Minor (1.x.0) |
| `fix` | Bug fix | Patch (1.0.x) |
| `docs` | Documentation only | No release |
| `style` | Code style (formatting, semicolons) | No release |
| `refactor` | Code refactoring | No release |
| `perf` | Performance improvement | Patch (1.0.x) |
| `test` | Adding/updating tests | No release |
| `chore` | Build, CI, dependencies | No release |

#### Breaking Changes

Add `BREAKING CHANGE:` in the commit body or `!` after the type:

```
feat!: remove deprecated provider API

BREAKING CHANGE: The old provider configuration format is no longer supported.
```

Breaking changes trigger a **major** version bump (x.0.0).

#### Examples

```bash
# Feature (minor version bump)
feat: add support for new AI provider
feat(providers): add Gemini provider support

# Bug fix (patch version bump)
fix: resolve profile selection crash on empty config
fix(ui): correct color display on dark terminals

# Documentation (no version bump)
docs: update installation instructions
docs(readme): add troubleshooting section

# Breaking change (major version bump)
feat!: redesign configuration file format

# With scope and body
git commit -m "feat(providers): add OpenAI provider" -m "Adds support for OpenAI's API as an alternative provider."
```

#### Commit Validation

Commits are validated using commitlint. Invalid commits will be rejected.

## Adding a New Provider

To add support for a new AI provider:

1. Open `src/providers/registry.ts`
2. Add a new entry to the `PROVIDERS` array:
   ```typescript
   {
     id: 'your-provider',
     name: 'Your Provider Name',
     description: 'Brief description',
     color: '#hexcolor',
     envVars: [
       {
         name: 'API_KEY_VAR',
         label: 'API Key',
         description: 'Your API key from provider',
         type: 'apiKey',
         sensitive: true,
         required: true,
       },
       // ... other env vars
     ],
   }
   ```
3. Add tests in `tests/unit/providers/registry.test.ts`
4. Update the README with the new provider

### Provider Environment Variables

Each provider defines environment variables with these properties:

| Property | Type | Description |
|----------|------|-------------|
| `name` | string | Environment variable name |
| `label` | string | Display label for UI |
| `description` | string | Help text for users |
| `type` | string | `'apiKey'`, `'url'`, `'string'`, `'number'` |
| `sensitive` | boolean | If true, value is masked in UI |
| `required` | boolean | If true, must be provided |
| `default` | any | Default value (optional) |

## Code Style

- Use TypeScript for all source files
- Follow the ESLint configuration
- Use Prettier for formatting
- Write descriptive variable and function names
- Add JSDoc comments for public functions
- Keep functions small and focused

## Testing

- Write tests for new functionality
- Maintain or improve test coverage
- Use descriptive test names
- Test both success and error cases

## Questions?

Feel free to open an issue for any questions about contributing.

Thank you for contributing!

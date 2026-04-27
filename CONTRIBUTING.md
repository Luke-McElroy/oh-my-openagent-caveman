# Contributing to Oh My OpenCode

Thanks for contributing! Guidelines for oh-my-opencode contributions.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Development Setup](#development-setup)
  - [Testing Your Changes Locally](#testing-your-changes-locally)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
  - [Build Commands](#build-commands)
  - [Code Style & Conventions](#code-style--conventions)
- [Making Changes](#making-changes)
  - [Adding a New Agent](#adding-a-new-agent)
  - [Adding a New Hook](#adding-a-new-hook)
  - [Adding a New Tool](#adding-a-new-tool)
  - [Adding a New MCP Server](#adding-a-new-mcp-server)
- [Pull Request Process](#pull-request-process)
- [Publishing](#publishing)
- [Getting Help](#getting-help)

## Code of Conduct

Be respectful, inclusive, constructive. Building better tools together.

## Language Policy

**English required for all communications.**

Includes: issues, PRs, docs, comments, discussions.

### Why English?

- **Global Access**: Enables worldwide collaboration
- **Consistency**: Organized, searchable discussions
- **Best Practice**: Most OSS uses English

### Need Help?

Not your first language? No problem! Value contributions regardless of grammar:

- Use translation tools
- Ask community for help
- Focus on clear, simple communication

## Getting Started

### Prerequisites

- **Bun** (latest) — only package manager
- **TypeScript** — strict mode

### Development Setup

```bash
# Clone
git clone https://github.com/code-yeongyu/oh-my-openagent.git
cd oh-my-openagent

# Install (bun only — never npm/yarn)
bun install

# Build
bun run build
```

### Testing Your Changes Locally

After making changes, you can test your local build in OpenCode:

1. **Build project**:

   ```bash
   bun run build
   ```

2. **Update your OpenCode config** (`~/.config/opencode/opencode.json` or `opencode.jsonc`):

   ```json
   {
     "plugin": ["file:///absolute/path/to/oh-my-opencode/dist/index.js"]
   }
   ```

   For example, if your project is at `/Users/yourname/projects/oh-my-opencode`:

   ```json
   {
     "plugin": ["file:///Users/yourname/projects/oh-my-opencode/dist/index.js"]
   }
   ```

   > **Note**: Remove `"oh-my-opencode"` from plugin array if it exists, to avoid conflicts with npm version.

3. **Restart OpenCode** to load changes.

4. **Verify** plugin is loaded by checking for OmO agent availability or startup messages.

## Project Structure

```
oh-my-opencode/
├── src/
│   ├── index.ts         # Plugin entry (V1 PluginModule)
│   ├── plugin-config.ts # JSONC multi-level config (Zod v4)
│   ├── agents/          # 11 agents
│   ├── hooks/           # 52 hooks
│   ├── tools/           # 26 tools, 16 dirs
│   ├── mcp/             # 3 built-in MCPs
│   ├── features/        # 19 modules
│   ├── config/          # Zod v4 schema
│   ├── shared/          # Utilities
│   ├── cli/             # CLI
│   ├── plugin/          # 10 OpenCode hook handlers
│   └── plugin-handlers/ # 6-phase config pipeline
├── packages/            # Monorepo
└── dist/                # Build output
```

## Development Workflow

### Build Commands

```bash
# Type check
bun run typecheck

# Full build (ESM + declarations + schema)
bun run build

# Clean
bun run clean

# Rebuild
bun run clean && bun run build

# Schema only (after modifying src/config/schema.ts)
bun run build:schema
```

### Code Style & Conventions

| Convention       | Rule                                                                      |
| ---------------- | ------------------------------------------------------------------------- |
| Package Manager  | **Bun only** (`bun run`, `bun build`, `bunx`)                             |
| Types            | Use `bun-types`, not `@types/node`                                        |
| Directory Naming | kebab-case (`ast-grep/`, `claude-code-hooks/`)                            |
| File Operations  | Never bash commands (mkdir/touch/rm) for file creation in code        |
| Tool Structure   | Each tool: `index.ts`, `types.ts`, `constants.ts`, `tools.ts`, `utils.ts` |
| Hook Pattern     | `createXXXHook(input: PluginInput)` naming                       |
| Exports          | Barrel (`export * from "./module"` in index.ts)                   |

**Anti-Patterns**:

- npm/yarn instead of bun
- `@types/node` instead of `bun-types`
- `as any`, `@ts-ignore`, `@ts-expect-error`
- AI-generated comment bloat
- Direct `bun publish` (use GitHub Actions)
- Local version changes in `package.json`

## Making Changes

### Adding an Agent

1. Create `.ts` in `src/agents/`
2. Define agent config following patterns
3. Add to `builtinAgents` in `src/agents/index.ts`
4. Update `src/agents/types.ts` if needed
5. Run `bun run build:schema`

```typescript
// src/agents/my-agent.ts
import type { AgentConfig } from "./types";

export const myAgent: AgentConfig = {
  name: "my-agent",
  model: "anthropic/claude-opus-4-7",
  description: "What this agent does",
  prompt: `System prompt here`,
  temperature: 0.1,
};
```

### Adding a Hook

1. Create dir in `src/hooks/` (kebab-case)
2. Implement `createXXXHook()` returning event handlers
3. Export from `src/hooks/index.ts`

```typescript
// src/hooks/my-hook/index.ts
import type { PluginInput } from "@opencode-ai/plugin";

export function createMyHook(input: PluginInput) {
  return {
    onSessionStart: async () => {
      // Hook logic
    },
  };
}
```

### Adding a Tool

1. Create dir in `src/tools/` with:
   - `index.ts` — exports
   - `types.ts` — interfaces
   - `constants.ts` — constants, descriptions
   - `tools.ts` — implementations
   - `utils.ts` — helpers
2. Add to `builtinTools` in `src/tools/index.ts`

### Adding an MCP Server

1. Create config in `src/mcp/`
2. Add to `src/mcp/index.ts`
3. Document in README if external setup required

## Pull Request Process

1. **Fork** repo, branch from `dev`
2. **Make changes** per conventions
3. **Build + test** locally:
   ```bash
   bun run typecheck  # No type errors
   bun run build      # Build succeeds
   ```
4. **Test in OpenCode** using local build
5. **Commit** with clear messages:
   - Present tense ("Add feature" not "Added")
   - Reference issues ("Fix #123")
6. **Push** to fork, create PR
7. **Describe** changes in PR description

### PR Checklist

- [ ] Code follows conventions
- [ ] `bun run typecheck` passes
- [ ] `bun run build` succeeds
- [ ] Tested locally with OpenCode
- [ ] Updated docs if needed (README, AGENTS.md)
- [ ] No version changes in `package.json`

## Publishing

**Important**: Publishing via GitHub Actions only.

- **Never** run `bun publish` directly (OIDC issues)
- **Never** modify `package.json` version locally
- Maintainers use workflow_dispatch:
  ```bash
  gh workflow run publish -f bump=patch  # or minor/major
  ```

## Getting Help

- **Project Knowledge**: Check `AGENTS.md`
- **Code Patterns**: Review `src/`
- **Issues**: Open for bugs/features
- **Discussions**: Start for questions/ideas

---

Thanks for contributing to Oh My OpenCode!

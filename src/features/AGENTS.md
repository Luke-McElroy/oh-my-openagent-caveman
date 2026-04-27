# src/features/ — 19 Feature Modules

**Generated:** 2026-04-18

## OVERVIEW

Feature modules wired to plugin/ layer. Self-contained types, implementation, tests.

## MODULE MAP

| Module | Files | Complexity | Purpose |
|--------|-------|------------|---------|
| **opencode-skill-loader** | 33 | HIGH | YAML frontmatter skill loading from 4 scopes |
| **background-agent** | 47 | HIGH | Task lifecycle, concurrency (5/model), polling, spawner pattern, circuit breaker |
| **tmux-subagent** | 34 | HIGH | Tmux pane management, grid planning, session orchestration |
| **mcp-oauth** | 18 | HIGH | OAuth 2.0 + PKCE + DCR for MCP servers |
| **builtin-skills** | 17 | LOW | 8 skills: git-master, playwright, playwright-cli, agent-browser, dev-browser, frontend-ui-ux, review-work, ai-slop-remover |
| **skill-mcp-manager** | 18 | HIGH | Tier-3 MCP client lifecycle per session |
| **claude-code-plugin-loader** | 15 | MEDIUM | Plugin discovery from .opencode/plugins/ |
| **builtin-commands** | 11 | LOW | Command templates: refactor, init-deep, handoff |
| **claude-tasks** | 7 | MEDIUM | Task schema + file storage + todo sync |
| **claude-code-mcp-loader** | 6 | MEDIUM | .mcp.json loading with ${VAR} env expansion |
| **context-injector** | 6 | MEDIUM | AGENTS.md/README.md injection |
| **run-continuation-state** | 5 | LOW | Persistent state for `run` command |
| **hook-message-injector** | 5 | MEDIUM | System message injection |
| **boulder-state** | 5 | LOW | Persistent state for multi-step operations |
| **task-toast-manager** | 4 | MEDIUM | Task progress notifications |
| **tool-metadata-store** | 3 | LOW | Tool execution metadata cache |
| **claude-code-session-state** | 3 | LOW | Subagent session state tracking |
| **claude-code-command-loader** | 3 | LOW | Load commands from .opencode/commands/ |
| **claude-code-agent-loader** | 3 | LOW | Load agents from .opencode/agents/ |

## KEY MODULES

### background-agent (47 files, ~10k LOC)

Core orchestration engine. `BackgroundManager` manages task lifecycle:
- States: pending → running → completed/error/cancelled/interrupt
- Concurrency: per-model/provider limits via `ConcurrencyManager` (FIFO queue)
- Polling: 3s interval, completion via idle events + stability detection (10s)
- Circuit breaker: automatic failure detection + recovery
- spawner/: 8 files composing via `SpawnerContext` interface

### opencode-skill-loader (33 files, ~3.2k LOC)

4-scope skill discovery (project > opencode > user > global):
- YAML frontmatter parsing from SKILL.md files
- Skill merger with priority deduplication
- Template resolution with variable substitution
- Provider gating for model-specific skills

### tmux-subagent (34 files, ~3.6k LOC)

State-first tmux integration:
- `TmuxSessionManager`: pane lifecycle, grid planning
- Spawn action decider + target finder
- Polling manager for session health
- Event handlers for pane creation/destruction

### builtin-skills (8 skill objects)

| Skill | Size | MCP | Tools |
|-------|------|-----|-------|
| git-master | 1111 LOC | — | Bash |
| playwright | 312 LOC | @playwright/mcp | — |
| agent-browser | (in playwright.ts) | — | Bash(agent-browser:*) |
| playwright-cli | 268 LOC | — | Bash(playwright-cli:*) |
| dev-browser | 221 LOC | — | Bash |
| frontend-ui-ux | 79 LOC | — | — |
| review-work | ~LOC | --- | --- |
| ai-slop-remover | ~LOC | --- | --- |

Browser variant selected by `browserProvider` config: playwright (default) | playwright-cli | agent-browser.

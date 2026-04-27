# src/plugin-handlers/ — Config Pipeline

**Generated:** 2026-04-18

## AGENT ORDERING

Canonical: **sisyphus → hephaestus → prometheus → atlas**.

Enforced:
1. `CANONICAL_CORE_AGENT_ORDER` — key insertion
2. `agent-key-remapper.ts` — ZWSP-prefixed `name` for `localeCompare`

ZWSP in `name` only. NEVER in:
- Object keys (HTTP headers, RFC 7230)
- `getAgentDisplayName()`
- Config keys

History: 15+ commits, 8+ PRs, reverts.

Forbidden:
- ZWSP in keys (only `name` via `getAgentRuntimeName()`)
- Sort shims
- Alternative constants
- Object.entries() dependencies

PRs rejected.

## OVERVIEW

14 files. `ConfigHandler` — `config` hook. 6 phases register agents, tools, MCPs, commands.

## 6-PHASE PIPELINE

| Phase | Handler | Purpose |
|-------|---------|---------|
| 1 | `applyProviderConfig` | Cache limits, anthropic-beta |
| 2 | `loadPluginComponents` | CC plugin (10s timeout) |
| 3 | `applyAgentConfig` | Load agents, skills, plan |
| 4 | `applyToolConfig` | Tool permissions |
| 5 | `applyMcpConfig` | Merge builtin + CC + plugin |
| 6 | `applyCommandConfig` | Merge commands/skills |

## FILES

| File | Lines | Purpose |
|------|-------|---------|
| `config-handler.ts` | ~200 | Main, 6-phase |
| `plugin-components-loader.ts` | ~100 | CC discovery |
| `agent-config-handler.ts` | ~300 | Agents + skills |
| `mcp-config-handler.ts` | ~150 | MCP merge |
| `command-config-handler.ts` | ~200 | Commands/skills |
| `tool-config-handler.ts` | ~100 | Tool perms |
| `provider-config-handler.ts` | ~80 | Provider + cache |
| `prometheus-agent-config-builder.ts` | ~100 | Prometheus |
| `plan-model-inheritance.ts` | 28 | Plan |
| `agent-priority-order.ts` | ~30 | Canonical order |
| `agent-key-remapper.ts` | ~30 | Key → name |
| `category-config-resolver.ts` | ~40 | User vs default |
| `index.ts` | ~10 | Barrel |

## TOOL PERMS

| Agent | Granted | Denied |
|-------|---------|--------|
| Librarian | grep_app_* | — |
| Atlas, Sisyphus, Prometheus | task, task_*, teammate | — |
| Hephaestus | task | — |
| Default | — | grep_app_*, task_*, teammate, LSP |

## CONFIG MERGE

```
User (~/.config/opencode/oh-my-opencode.jsonc)
  ↓ deepMerge
Project (.opencode/oh-my-opencode.jsonc)
  ↓ Zod defaults
Final Config
```

- `agents`, `categories`, `claude_code`: deep merged
- `disabled_*`: Set union

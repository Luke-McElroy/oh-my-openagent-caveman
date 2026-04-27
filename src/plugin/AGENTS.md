# src/plugin/ — 10 OpenCode Handlers

**Generated:** 2026-04-18

## OVERVIEW

Core glue. 20 files. 10 handlers, 50 hooks → PluginInterface.

## HANDLERS

| File | Hook | Purpose |
|------|------|---------|
| `config.ts` | `config` | 6-phase pipeline |
| `tool-registry.ts` | `tool` | 26 tools |
| `chat-message.ts` | `chat.message` | First-message, session |
| `chat-params.ts` | `chat.params` | Effort, think mode |
| `chat-headers.ts` | `chat.headers` | x-initiator |
| `event.ts` | `event` | Lifecycle |
| `tool-execute-before.ts` | `tool.execute.before` | Pre-tool guards |
| `tool-execute-after.ts` | `tool.execute.after` | Post-tool |
| `messages-transform.ts` | `experimental.chat.messages.transform` | Context inject |
| `session-compacting.ts` | `experimental.session.compacting` | Compaction |
| `skill-context.ts` | — | Context |

## HOOK COMPOSITION

| File | Tier | Count |
|------|------|-------|
| `create-session-hooks.ts` | Session | 23 |
| `create-tool-guard-hooks.ts` | Tool Guard | 14 |
| `create-transform-hooks.ts` | Transform | 5 |
| `create-skill-hooks.ts` | Skill | 2 |
| `create-core-hooks.ts` | Aggregator | 42 |

## SUPPORT

| File | Purpose |
|------|---------|
| `available-categories.ts` | `AvailableCategory[]` |
| `session-agent-resolver.ts` | Resolve agent |
| `session-status-normalizer.ts` | Normalize status |
| `recent-synthetic-idles.ts` | Dedup idle |
| `unstable-agent-babysitter.ts` | Track unstable |
| `types.ts` | `PluginContext` |
| `ultrawork-model-override.ts` | Ultrawork |
| `ultrawork-db-model-override.ts` | DB-level |
| `config-handler.ts` | Runtime config |

## PATTERNS

- Handlers receive `(hookRecord, ctx, config, managers)` → return hook
- Iterate hook records, call with `(input, output)`
- `safeHook()` wrapper catches errors
- `filterDisabledTools()` before return

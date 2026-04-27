# src/hooks/claude-code-hooks/ — CC Compatibility

**Generated:** 2026-04-18

## OVERVIEW

~2110 LOC, 19 files. CC `settings.json` compat. Parses perms, maps hooks.

## WHAT IT DOES

1. Parse CC `settings.json`
2. Map hooks → OpenCode
3. Enforce rules
4. Support `.claude/settings.json`

## CC → OPENCODE

| CC Hook | OpenCode |
|---------|----------|
| PreToolUse | tool.execute.before |
| PostToolUse | tool.execute.after |
| Notification | event |
| Stop | event |

## PERMISSION

CC format:
```json
{"permissions": {"allow": ["Edit"], "deny": ["Bash(rm:*)"]}}
```

Translated via permission-compat.

## FILES

- `settings-loader.ts` — parse
- `hook-mapper.ts` — map
- `permission-handler.ts` — enforce
- `types.ts`

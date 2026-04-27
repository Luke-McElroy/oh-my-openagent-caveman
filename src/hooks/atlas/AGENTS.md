# src/hooks/atlas/ — Boulder Orchestrator

**Generated:** 2026-04-18

## OVERVIEW

17 files (~1976 LOC). `atlasHook` — Continuation Tier. Monitors `session.idle`, forces continuation for boulder sessions. Enforces write/edit policies.

## WHAT ATLAS DOES

"Keeper of sessions" — tracks sessions:
1. Force continuation? (boulder + incomplete todos)
2. Block write/edit? (policy)
3. Inject verification? (post-tool)

## DECISION GATE

```
session.idle
  → Boulder/ralph/atlas? (session-last-agent.ts)
  → Abort? (is-abort-error.ts)
  → Failure < max? (state.promptFailureCount)
  → No background tasks?
  → Agent match? (recent-model-resolver.ts)
  → Plan complete? (todo status)
  → Cooldown passed? (5s)
  → Inject continuation (boulder-continuation-injector.ts)
```

## KEY FILES

| File | Purpose |
|------|---------|
| `atlas-hook.ts` | `createAtlasHook()` — composes handlers |
| `event-handler.ts` | `createAtlasEventHandler()` — decision |
| `boulder-continuation-injector.ts` | Build + inject |
| `system-reminder-templates.ts` | Templates |
| `tool-execute-before.ts` | Block write/edit |
| `tool-execute-after.ts` | Post-tool verify |
| `write-edit-tool-policy.ts` | Write/edit policy |
| `verification-reminders.ts` | Verification |
| `session-last-agent.ts` | Session owner |
| `recent-model-resolver.ts` | Recent model |
| `subagent-session-id.ts` | Subagent detect |
| `sisyphus-path.ts` | `.sisyphus/` path |
| `is-abort-error.ts` | Abort detect |
| `types.ts` | `SessionState` |

## STATE PER SESSION

```typescript
interface SessionState {
  promptFailureCount: number  // Increments on fail
}
```

Max 5 failures before 5min pause (backoff in todo-continuation-enforcer).

## RELATIONSHIP

- **atlasHook**: Master, boulder sessions
- **todoContinuationEnforcer**: Main Sisyphus
Both fire on `session.idle` but check session type.

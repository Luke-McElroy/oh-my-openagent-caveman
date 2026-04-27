# src/hooks/todo-continuation-enforcer/ — Boulder

**Generated:** 2026-04-11

## OVERVIEW

14 files (~2061 LOC). "Boulder" — Continuation Tier. Forces Sisyphus continue on incomplete todos. Fires on `session.idle`, injects after 2s.

## HOW IT WORKS

```
session.idle
  → Main session? (DEFAULT_SKIP_AGENTS)
  → No abort? (3s)
  → Todos incomplete? (todo.ts)
  → No background?
  → Cooldown passed? (30s)
  → Failure < max? (5)
  → 2s → inject
```

## KEY FILES

| File | Purpose |
|------|---------|
| `handler.ts` | `createTodoContinuationHandler()` |
| `idle-event.ts` | `handleSessionIdle()` |
| `non-idle-events.ts` | `handleNonIdleEvent()` |
| `session-state.ts` | `SessionStateStore` |
| `todo.ts` | Todo check |
| `countdown.ts` | 2s toast |
| `abort-detection.ts` | Detect abort |
| `continuation-injection.ts` | Build + inject |
| `message-directory.ts` | Temp dir |
| `constants.ts` | Constants |
| `types.ts` | `SessionState` |

## CONSTANTS

```typescript
DEFAULT_SKIP_AGENTS = ["prometheus", "compaction", "plan"]
CONTINUATION_COOLDOWN_MS = 30_000
MAX_CONSECUTIVE_FAILURES = 5
FAILURE_RESET_WINDOW_MS = 5 * 60_000
COUNTDOWN_SECONDS = 2
ABORT_WINDOW_MS = 3000
```

## STATE

```typescript
interface SessionState {
  failureCount: number
  lastFailureAt?: number
  abortDetectedAt?: number
  cooldownUntil?: number
  countdownTimer?: Timer
}
```

## RELATIONSHIP

- `todoContinuationEnforcer`: Main Sisyphus
- `atlasHook`: Boulder/ralph/subagent
Both fire on `session.idle` but check type.

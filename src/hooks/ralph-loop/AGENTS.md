# src/hooks/ralph-loop/ — Dev Loop

**Generated:** 2026-04-11

## OVERVIEW

14 files (~1687 LOC). `ralphLoop` Session Tier. Powers `/ralph-loop`. Iterates until `<promise>DONE</promise>` or max.

## LIFECYCLE

```
/ralph-loop → startLoop(sessionID, prompt, opts)
  → loopState.startLoop() → persist .sisyphus/ralph-loop.local.md
  → session.idle → createRalphLoopEventHandler()
    → scan for <promise>DONE</promise>
    → not done: inject → loop
    → done/max: cancelLoop()
```

## FILES

| File | Purpose |
|------|---------|
| `ralph-loop-hook.ts` | `createRalphLoopHook()` — composes |
| `ralph-loop-event-handler.ts` | Drives loop |
| `loop-state-controller.ts` | CRUD: start, cancel, get, persist |
| `loop-session-recovery.ts` | Crash recovery |
| `completion-promise-detector.ts` | Scan `<promise>DONE</promise>` |
| `continuation-prompt-builder.ts` | Build continuation |
| `continuation-prompt-injector.ts` | Inject |
| `storage.ts` | Read/write state |
| `message-storage-directory.ts` | Temp dir |
| `with-timeout.ts` | API timeout (5000ms) |
| `types.ts` | `RalphLoopState` |

## STATE

```
.sisyphus/ralph-loop.local.md (gitignored)
  → sessionID, prompt, iteration, maxIterations, completionPromise, ultrawork
```

## OPTIONS

```typescript
startLoop(sessionID, prompt, {
  maxIterations?: number        // Default: 100
  completionPromise?: string    // Default: "<promise>DONE</promise>"
  ultrawork?: boolean
})
```

## INTERFACE

```typescript
interface RalphLoopHook {
  event: (input) => Promise<void>
  startLoop: (sessionID, prompt, opts?) => boolean
  cancelLoop: (sessionID) => boolean
  getState: () => RalphLoopState | null
}
```

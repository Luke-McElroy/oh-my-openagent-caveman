# src/hooks/session-recovery/ — Session Recovery

**Generated:** 2026-04-11

## OVERVIEW

16 files + storage/. Session Tier. Handles `session.error`. Detects errors, applies strategies, resumes.

## STRATEGIES

| Error Type | File | Action |
|------------|------|--------|
| `tool_result_missing` | `recover-tool-result-missing.ts` | Reconstruct |
| `thinking_block_order` | `recover-thinking-block-order.ts` | Reorder |
| `thinking_disabled_violation` | `recover-thinking-disabled-violation.ts` | Strip |
| `empty_content_message` | `recover-empty-content-message*.ts` | Handle empty |

## FILES

| File | Purpose |
|------|---------|
| `hook.ts` | `createSessionRecoveryHook()` |
| `detect-error-type.ts` | `detectErrorType()` |
| `resume.ts` | `resumeSession()` |
| `storage.ts` | Per-session storage |
| `recover-tool-result-missing.ts` | Reconstruct |
| `recover-thinking-block-order.ts` | Fix sequences |
| `recover-thinking-disabled-violation.ts` | Remove blocks |
| `recover-empty-content-message.ts` | Handle empty |
| `recover-empty-content-message-sdk.ts` | SDK variant |
| `types.ts` | `StoredMessageMeta` |

## STORAGE

```
storage/
  ├── message-store.ts    # In-mem + file cache
  ├── part-store.ts       # Parts storage
  └── index.ts            # Barrel
```

## INTERFACE

```typescript
interface SessionRecoveryHook {
  handleSessionRecovery: (info: MessageInfo) => Promise<boolean>
  isRecoverableError: (error: unknown) => boolean
  setOnAbortCallback: (cb: (sessionID: string) => void) => void
  setOnRecoveryCompleteCallback: (cb: (sessionID: string) => void) => void
}
```

## NOTES

- `processingErrors` Set guards duplicates
- Supports `experimental` flags
- Distinct from `anthropic-context-window-limit-recovery`

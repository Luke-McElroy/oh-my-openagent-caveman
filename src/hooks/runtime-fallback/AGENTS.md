# src/hooks/runtime-fallback/ — Error Recovery

**Generated:** 2026-04-11

## OVERVIEW

32 files. Session Tier. **Reactively** switches fallback on API errors (429, 503, quota). Distinct from `model-fallback` (preemptive at chat.params).

## RUNTIME vs MODEL-FALLBACK

| Aspect | runtime | model |
|--------|---------|-------|
| **Trigger** | Reactive | Proactive |
| **Event** | session.error, message.updated, session.status | chat.params |
| **Config** | `categories[].fallback_models`, `agents[].fallback_models` | `AGENT_MODEL_REQUIREMENTS` |
| **State** | Per-session + cooldown | Module-global |
| **Use case** | Provider errors | Pre-configured |

Independent.

## ERROR DETECTION

### HTTP Codes
Default: `429, 500, 502, 503, 504`

### Patterns (constants.ts)
```
/rate.?limit/i, /too.?many.?requests/i, /quota.*reset/i,
/exhausted.*capacity/i, /all.*credentials.*for.*model/i,
/cool(?:ing)?.?down/i, /model.*not.*supported/i,
/service.?unavailable/i, /overloaded/i, /temporarily.?unavailable/i
```

### Classification (error-classifier.ts)
- `missing_api_key` — auth rejected
- `model_not_found` — unavailable
- `quota_exceeded` — billing/quota
- Auto-retry via `auto-retry-signal.ts`

## STATE

```typescript
interface FallbackState {
  originalModel: string
  currentModel: string
  fallbackIndex: number
  failedModels: Map<string, number>  // model → cooldown
  attemptCount: number
  pendingFallbackModel?: string
}
```

## FALLBACK CHAIN (fallback-models.ts)

Priority:
1. **Session category**
2. **Agent config** `fallback_models`
3. **Agent's category** `fallback_models`
4. **Session ID pattern**

## RETRY FLOW

```
session.error / message.updated / session.status (retry)
  → isRetryableError(error)?
  → getFallbackModelsForSession(sessionID, agent)
  → findNextAvailableFallback() — skip cooldown
  → prepareFallback() — update state
  → dispatchFallbackRetry() — toast + promptAsync
  → 30s timeout — abort, next
```

## COOLDOWN

Failed models enter 60s cooldown. `findNextAvailableFallback()` skips.

## FILES

| File | Purpose |
|------|---------|
| `hook.ts` | `createRuntimeFallbackHook()` |
| `event-handler.ts` | Route lifecycle |
| `message-update-handler.ts` | Handle `message.updated` |
| `session-status-handler.ts` | Handle `session.status` |
| `chat-message-handler.ts` | Fallback on chat.message |
| `error-classifier.ts` | `isRetryableError()` |
| `auto-retry-signal.ts` | Extract signals |
| `fallback-state.ts` | State machine |
| `fallback-models.ts` | Resolve chain |
| `fallback-bootstrap-model.ts` | Derive model |
| `fallback-retry-dispatcher.ts` | Toast + dispatch |
| `auto-retry.ts` | Abort, timeout |
| `agent-resolver.ts` | Session → agent |
| `retry-model-payload.ts` | Build payload |
| `visible-assistant-response.ts` | Detect partial output |
| `last-user-retry-parts.ts` | Extract last parts |

## NOTES

- Per-session tracking — no sharing
- `visible-assistant-response.ts` prevents retry on partial
- Registered in Session Tier

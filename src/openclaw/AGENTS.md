# src/openclaw/ — Bidirectional Integration

**Generated:** 2026-04-18

## OVERVIEW

18 files. Bidirectional: **outbound** (Discord/Telegram/webhook/command) + **inbound** (daemon polls chat apps, injects tmux). "Claw" — reaches out, pulls back.

## FLOW

### Outbound
```
OpenCode event → dispatchOpenClawEvent()
  → runtime-dispatch.ts: map → OpenClaw
  → dispatcher.ts: execute (HTTP/shell)
  → session-registry.ts: record messageID ↔ sessionID ↔ tmux
```

### Inbound
```
Discord/Telegram → reply-listener daemon (Bun)
  → reply-listener-{discord,telegram}.ts: poll 3s
  → session-registry.ts: lookup tmux
  → reply-listener-injection.ts: send-keys tmux (rate limit)
```

## KEY FILES

| File | Purpose |
|------|---------|
| `index.ts` | `wakeOpenClaw()`, `initializeOpenClaw()` |
| `types.ts` | `OpenClawConfig`, `OpenClawPayload`, `WakeResult` |
| `config.ts` | Gateway + URL validation |
| `dispatcher.ts` | HTTP + shell interpolation |
| `runtime-dispatch.ts` | Events → OpenClaw |
| `session-registry.ts` | JSONL: messageID ↔ sessions ↔ panes |
| `reply-listener.ts` | Daemon lifecycle |
| `reply-listener-discord.ts` | Discord poll |
| `reply-listener-telegram.ts` | Telegram poll |
| `reply-listener-injection.ts` | Inject tmux (rate limit + filter) |
| `reply-listener-state.ts` | Daemon state |
| `daemon.ts` | Daemon entry (detached Bun) |
| `tmux.ts` | `capturePane()`, `sendToPane()` |

## GATEWAY TYPES

| Type | Config | Execution |
|------|--------|-----------|
| **HTTP** | `url` | POST JSON |
| **Shell** | `command` | Execute with env (OPENCLAW_*) |

## PAYLOAD VARIABLES

`{sessionId}`, `{projectPath}`, `{tmuxSession}`, `{timestamp}`, `{eventType}`, `{messageContent}`, `{promptSummary}`

## INTEGRATION

- `src/index.ts` — `initializeOpenClaw()` at startup (if enabled)
- `src/plugin/event.ts` — `dispatchOpenClawEvent()` for events
- `src/config/schema/openclaw.ts` — Zod schema

## DAEMON LIFECYCLE

```
initializeOpenClaw(config)
  → wakeOpenClaw() if reply_listener.enabled
  → spawn daemon.ts detached
  → daemon writes PID to .opencode/openclaw.state.json
  → daemon polls 3s
  → on reply: lookup registry → inject send-keys
```

## SECURITY

- **URL validation**: HTTPS required, localhost except
- **Authorized users**: Inbound filtered by user ID
- **Token redaction**: Secrets masked
- **Rate limiting**: Injection throttled

## TESTING

`reply-listener-discord.test.ts` always isolated in CI. Mocks `globalThis.fetch` — needs process isolation.

# src/hooks/anthropic-context-window-limit-recovery/ — Context Recovery

**Generated:** 2026-04-11

## OVERVIEW

31 files (~2232 LOC). Complex hook. Recovers context limit errors via sequential strategies.

## STRATEGIES (priority order)

| Strategy | File | Mechanism |
|----------|------|-----------|
| **Empty content** | `empty-content-recovery.ts` | Handle empty/null |
| **Deduplication** | `deduplication-recovery.ts` | Remove duplicates |
| **Target-token** | `target-token-truncation.ts` | Truncate to 50% |
| **Aggressive** | `aggressive-truncation-strategy.ts` | Last-resort minimal |
| **Summarize** | `summarize-retry-strategy.ts` | Compaction + summary |

## KEY FILES

| File | Purpose |
|------|---------|
| `recovery-hook.ts` | Main entry — `session.error` |
| `executor.ts` | Strategy execution |
| `parser.ts` | Parse errors |
| `state.ts` | `AutoCompactState` — tracking |
| `types.ts` | `ParsedTokenLimitError`, constants |
| `storage.ts` | Persist results |
| `tool-result-storage.ts` | Store/retrieve |
| `message-builder.ts` | Build retry |

## RETRY CONFIG

- Max attempts: 2
- Initial delay: 2s, backoff ×2, max 30s
- Max truncation: 20
- Target: 0.5 (50%)
- Chars/token: 4

## PRUNING

`pruning-*.ts`:
- `pruning-deduplication.ts` — Remove dupes
- `pruning-tool-output-truncation.ts` — Truncate
- `pruning-types.ts` — Types

## SDK VARIANTS

`empty-content-recovery-sdk.ts`, `tool-result-storage-sdk.ts` — OpenCode client.

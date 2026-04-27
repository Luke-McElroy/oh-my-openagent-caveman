# src/hooks/rules-injector/ — Rules Injection

**Generated:** 2026-04-11

## OVERVIEW

19 files (~1604 LOC). `rulesInjectorHook` — Tool Guard Tier. Auto-injects AGENTS.md on file operations. Proximity-based: closest wins.

## HOW IT WORKS

```
tool.execute.after (read/write/edit/multiedit)
  → Extract path
  → Find rules near path (finder.ts)
  → Already injected? (cache.ts)
  → Inject (injector.ts)
```

## TRACKED TOOLS

`["read", "write", "edit", "multiedit"]` — triggers on file ops.

## FILES

| File | Purpose |
|------|---------|
| `hook.ts` | `createRulesInjectorHook()` |
| `injector.ts` | `createRuleInjectionProcessor()` |
| `finder.ts` | `findRuleFiles()` + `calculateDistance()` |
| `rule-file-finder.ts` | Walk for AGENTS.md/.rules |
| `rule-file-scanner.ts` | Scan rules |
| `matcher.ts` | Match paths |
| `rule-distance.ts` | Distance calc |
| `project-root-finder.ts` | Find root |
| `output-path.ts` | Extract paths |
| `cache.ts` | `createSessionCacheStore()` |
| `storage.ts` | Persist |
| `parser.ts` | Parse content |
| `constants.ts` | Names: `AGENTS.md`, `.rules` |
| `types.ts` | `RuleFile` |

## DISCOVERY

Priority (closest → farthest):
1. Same directory
2. Parents to root
3. Root

Same-distance: all injected. Per-session dedup prevents re-injection.

## TRUNCATION

`DynamicTruncator` — adapts size by context (1M: full, smaller: truncated).

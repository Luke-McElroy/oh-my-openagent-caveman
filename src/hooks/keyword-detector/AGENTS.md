# src/hooks/keyword-detector/ — Keyword Injection

**Generated:** 2026-04-11

## OVERVIEW

8 files + 3 subdirs (~1665 LOC). Transform Tier on `messages.transform`. Scans first message for keywords, injects prompts.

## KEYWORDS

| Keyword | Pattern | Effect |
|---------|---------|--------|
| `ultrawork` / `ulw` | `/\b(ultrawork|ulw)\b/i` | Full orchestration |
| Search | `SEARCH_PATTERN` | Web/doc search |
| Analyze | `ANALYZE_PATTERN` | Deep analysis |

## STRUCTURE

```
keyword-detector/
├── index.ts           # Barrel
├── hook.ts            # createKeywordDetectorHook()
├── detector.ts        # detectKeywordsWithType()
├── constants.ts       # KEYWORD_DETECTORS
├── types.ts           # Types
├── ultrawork/
│   ├── index.ts
│   ├── message.ts     # getUltraworkMessage()
│   └── isPlannerAgent.ts
├── search/
│   ├── index.ts
│   ├── pattern.ts     # SEARCH_PATTERN
│   └── message.ts
└── analyze/
    ├── index.ts
    ├── pattern.ts     # ANALYZE_PATTERN
    └── message.ts
```

## LOGIC

```
chat.message
  → extractPromptText(parts)
  → isSystemDirective? → skip
  → removeSystemReminders(text)
  → detectKeywordsWithType(clean, agent, model)
  → isPlannerAgent? → filter
  → inject messages
```

## GUARDS

- **System directive skip**: Prevents loops
- **Planner filter**: Prometheus/plan skip ultrawork
- **Session tracking**: `getSessionAgent()`
- **Model-aware**: `getUltraworkMessage(agent, model)`

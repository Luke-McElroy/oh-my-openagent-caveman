# src/hooks/comment-checker/ — AI Slop Blocker

**Generated:** 2026-04-18

## OVERVIEW

Tool Guard tier. Runs after `write`/`edit` to detect AI comment patterns. Uses `@code-yeongyu/comment-checker`.

## BLOCKS

AI slop:
- Restating (`// increment counter`)
- Filler (`// obviously`, `// clearly`)
- Decorative
- JSDoc on trivial functions
- `// TODO:` without context
- Contradicting code

See `@code-yeongyu/comment-checker` for full list.

## FLOW

```
tool.execute.after (write | edit | hashline)
  → extract lines
  → spawn binary
  → parse (line ranges + category)
  → findings → error → fix
```

## FILES

| File | Purpose |
|------|---------|
| `hook.ts` | `createCommentCheckerHook()` |
| `comment-checker-runner.ts` | Spawn, parse JSON |
| `changed-line-extractor.ts` | Extract lines |
| `findings-formatter.ts` | Format |
| `binary-resolver.ts` | Locate |

## CONFIG

```jsonc
// oh-my-opencode.jsonc
{
  "comment_checker": {
    "enabled": true,      // default
    "severity": "error"   // error blocks, warning notifies
  }
}
```

Disable: `"disabled_hooks": ["comment-checker"]`.

## BYPASS

Prefix: `// @allow` or `// comment-checker-disable-file` at top.

## RELATED

- Doctor: `src/cli/doctor/checks/tools.ts` verifies
- Postinstall: `postinstall.mjs` downloads

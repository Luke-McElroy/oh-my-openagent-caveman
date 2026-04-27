# src/mcp/ — 3 MCPs

**Generated:** 2026-04-18

## OVERVIEW

Tier 1 of 3. 3 remote HTTP MCPs via `createBuiltinMcps()`.

## BUILT-IN

| Name | URL | Env |
|------|-----|-----|
| websearch | `mcp.exa.ai` | `EXA_API_KEY` |
| context7 | `mcp.context7.com/mcp` | `CONTEXT7_API_KEY` |
| grep_app | `mcp.grep.app` | None |

## REGISTRATION

```typescript
export const context7 = {
  type: "remote",
  url: "https://mcp.context7.com/mcp",
  enabled: true,
  oauth: false,
}
```

## ENABLE/DISABLE

```jsonc
{ "disabled_mcps": ["websearch"] }
{ "mcp": { "websearch": { "enabled": false } } }
```

## THREE-TIER

| Tier | Source | Mechanism |
|------|--------|-----------|
| 1 | `src/mcp/` | `createBuiltinMcps()` |
| 2 | `.mcp.json` | `${VAR}` |
| 3 | SKILL.md | `SkillMcpManager` |

## FILES

- `index.ts` — `createBuiltinMcps()`
- `types.ts` — `McpNameSchema`
- `websearch.ts` — Exa/Tavily
- `context7.ts` — Context7
- `grep-app.ts` — Grep.app

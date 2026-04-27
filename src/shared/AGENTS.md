# src/shared/ — 100+ Utils

**Generated:** 2026-04-18

## OVERVIEW

Cross-cutting. Barrel from `index.ts`. Logger: `/tmp/oh-my-opencode.log`.

## CATEGORIES

| Category | Files | Exports |
|----------|-------|---------|
| **Model** | ~22 | `resolveModel()`, `AGENT_MODEL_REQUIREMENTS` |
| **Tmux** | 11 | `createTmuxSession()`, `spawnPane()` |
| **Config** | 10 | `resolveOpenCodeConfigDir()`, `parseJSONC()` |
| **Session** | 8 | `SessionCursor`, `SessionToolsStore` |
| **Git** | 7 | `parseGitStatusPorcelain()` |
| **Command** | 7 | `executeCommand()` |
| **Migration** | 6 | `migrateConfigFile()`, NAME_MAPs |
| **String** | 6 | `toSnakeCase()`, `parseFrontmatter()` |
| **Agent** | 5 | `getAgentVariant()`, `AGENT_DISPLAY_NAMES` |
| **OpenCode** | 5 | `injectServerAuth()` |
| **Types** | 4 | `deepMerge()`, `DynamicTruncator` |
| **Misc** | 8 | `log()`, `readFile()` |

## MODEL PIPELINE

```
resolveModel(input)
  1. Override: UI-selected (primary)
  2. Category default
  3. Provider fallback
  4. System default
```

Key: `model-resolver.ts`, `model-resolution-pipeline.ts`, `model-requirements.ts`.

## MIGRATION

Transforms legacy:
- `agent-names.ts`: Old → new
- `hook-names.ts`: Old → new
- `model-versions.ts`: Old → current
- `agent-category.ts`: Legacy → category

## MOST IMPORTED

| Utility | Count | Purpose |
|---------|-------|---------|
| `logger.ts` | 62 | Log file |
| `data-path.ts` | 11 | XDG |
| `model-requirements.ts` | 11 | Fallbacks |
| `system-directive.ts` | 11 | Filter |
| `frontmatter.ts` | 10 | YAML |

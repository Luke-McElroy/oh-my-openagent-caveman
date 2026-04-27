# oh-my-opencode — OpenCode Plugin

**Generated:** 2026-04-18 | **Commit:** 2892ca4a | **Branch:** dev

## OVERVIEW

OpenCode plugin (npm: `oh-my-opencode`, dual-published `oh-my-openagent` transition) extending Claude Code: 11 agents, 52 hooks, 26 tools, 3-tier MCP (built-in + .mcp.json + skill-embedded), Hashline LINE#ID edit, IntentGate. 1766 TypeScript files, 377k LOC, 104 barrel index.ts. Entry: `src/index.ts` → 5-step init (loadConfig → createManagers → createTools → createHooks → createPluginInterface).

## STRUCTURE

```
oh-my-opencode/
├── src/
│   ├── index.ts              # Plugin entry: default export `pluginModule`
│   ├── plugin-config.ts      # JSONC config: user → project → defaults (Zod v4)
│   ├── agents/               # 11 agents (Sisyphus, Hephaestus, Oracle, Librarian, Explore, Atlas, Prometheus, Metis, Momus, Multimodal-Looker, Sisyphus-Junior)
│   ├── hooks/                # 52 hooks
│   ├── tools/                # 26 tools, 16 dirs (Hashline LINE#ID edit)
│   ├── features/             # 19 modules (background-agent, skill-loader, tmux, MCP-OAuth, etc.)
│   ├── shared/               # 170+ utils (logger → /tmp/oh-my-opencode.log)
│   ├── config/               # Zod v4 schema (32 files)
│   ├── cli/                  # CLI: install, run, doctor, mcp-oauth
│   ├── mcp/                  # 3 built-in MCPs (websearch, context7, grep_app)
│   ├── plugin/               # 10 OpenCode hook handlers
│   ├── plugin-handlers/      # 6-phase config pipeline
│   └── openclaw/             # External integration (Discord/Telegram/webhook)
├── packages/                 # 11 platform binaries (darwin/linux/windows, AVX2 + baseline)
├── script/                   # Build/publish automation
├── .sisyphus/                # AI agent workspace
└── .local-ignore/            # Dev-only fixtures + worktrees
```

## INITIALIZATION FLOW

```
pluginModule.server(input, options)
  ├─→ loadPluginConfig()         # JSONC parse → merge → Zod validate → migrate
  ├─→ createManagers()           # Tmux, Background, SkillMcp, Config handlers
  ├─→ createTools()              # SkillContext + Categories + ToolRegistry
  ├─→ createHooks()              # Core(43) + Continuation(7) + Skill(2) = 52
  └─→ createPluginInterface()    # 10 OpenCode hook handlers
```

## 10 OPENCODE HOOK HANDLERS

| Handler | Purpose |
|---------|---------|
| `config` | 6-phase: provider → components → agents → tools → MCPs → commands |
| `tool` | 26 tools |
| `chat.message` | First-message, session setup, keyword detect (ultrawork/search/analyze) |
| `chat.params` | Anthropic effort, think mode, runtime fallback |
| `chat.headers` | Copilot x-initiator header |
| `event` | Session lifecycle (created/deleted/idle/error), openclaw, runtime fallback |
| `tool.execute.before` | Pre-tool hooks (file guard, truncator, rules, prometheus) |
| `tool.execute.after` | Post-tool hooks (truncation, comment checker, hashline) |
| `experimental.chat.messages.transform` | Context injection, thinking validation, tool pair validation |
| `experimental.session.compacting` | Context + todo preservation |

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add agent | `src/agents/` + `src/agents/builtin-agents/` | Follow createXXXAgent pattern |
| Add hook | `src/hooks/{name}/` + register `src/plugin/hooks/create-*-hooks.ts` | Match event type to tier |
| Add tool | `src/tools/{name}/` + register `src/plugin/tool-registry.ts` | Follow createXXXTool pattern |
| Add feature | `src/features/{name}/` | Standalone module, wire in plugin/ |
| Add MCP | `src/mcp/` + register `createBuiltinMcps()` | Remote HTTP only (tier 1) |
| Add skill | `src/features/builtin-skills/skills/` | Implement BuiltinSkill interface |
| Add command | `src/features/builtin-commands/` | Template in templates/ |
| Add CLI command | `src/cli/cli-program.ts` | Commander.js subcommand |
| Add doctor check | `src/cli/doctor/checks/` | Register in checks/index.ts |
| Modify config | `src/config/schema/` + update root schema | Zod v4 |
| Add category | `src/tools/delegate-task/constants.ts` | DEFAULT_CATEGORIES + CATEGORY_MODEL_REQUIREMENTS |
| Debug errors | `src/hooks/runtime-fallback/` | Reactive error recovery |
| External notifications | `src/openclaw/` | Discord/Telegram/webhook |
| Skill-embedded MCP | `src/features/skill-mcp-manager/` | Tier 3 MCPs (stdio + HTTP, per-session) |

## MULTI-LEVEL CONFIG

```
Project (.opencode/oh-my-opencode.jsonc)  →  User (~/.config/opencode/oh-my-opencode.jsonc)  →  Defaults
```

- `agents`, `categories`, `claude_code`: deep merged recursively
- `disabled_*` arrays: Set union (concat + dedupe)
- Other fields: override replaces base
- Zod `safeParse()` fills defaults; partial parsing fallback
- `migrateConfigFile()` transforms legacy keys (idempotent via `_migrations`)

Fields: agents (14 overridable, 21 fields each), categories (8 built-in + custom), disabled_* arrays, 19 feature configs.

## THREE-TIER MCP SYSTEM

| Tier | Source | Mechanism |
|------|--------|-----------|
| Built-in | `src/mcp/` | 3 remote HTTP: websearch (Exa/Tavily), context7, grep_app |
| Claude Code | `.mcp.json` | `${VAR}` env expansion via claude-code-mcp-loader |
| Skill-embedded | SKILL.md YAML | SkillMcpManager (stdio + HTTP) |

## CONVENTIONS

- **Runtime**: Bun only (1.3.11 CI) — never npm/yarn
- **TypeScript**: strict, ESNext, bundler moduleResolution, `bun-types` (never `@types/node`)
- **Test**: Bun test (`bun:test`), co-located `*.test.ts`, given/when/then style
- **CI test split**: `script/run-ci-tests.ts` auto-detects `mock.module()`, isolates in separate processes
- **Factory pattern**: `createXXX()` for tools, hooks, agents
- **Hook tiers**: Session (24) → Tool-Guard (14) → Transform (5) → Continuation (7) → Skill (2)
- **Agent modes**: `primary` (UI model) vs `subagent` (own fallback) vs `all`
- **Model resolution**: 4-step: override → category-default → provider-fallback → system-default
- **Config**: JSONC, Zod v4, snake_case keys
- **File naming**: kebab-case for files/dirs
- **Module structure**: index.ts barrel exports, no catch-all (utils.ts, helpers.ts banned), 200 LOC soft limit
- **Imports**: relative within module, barrel across (`import { log } from "./shared"`)
- **No path aliases**: no `@/` — relative only
- **Dual package**: `oh-my-opencode` + `oh-my-openagent` published together (transition)

## ANTI-PATTERNS

- Never `as any`, `@ts-ignore`, `@ts-expect-error`
- Never suppress lint/type errors
- Never add emojis to code/comments unless user asks
- Never commit unless explicitly requested
- Never `bun publish` directly — use GitHub Actions
- Never modify `package.json` version locally
- Test: given/when/then — never Arrange-Act-Assert comments
- Comments: avoid AI-generated patterns (enforced by comment-checker hook)
- Never catch-all files (`utils.ts`, `helpers.ts`, `service.ts`)
- Empty catch `catch(e) {}` — always handle errors
- Never em dashes, en dashes, AI filler phrases
- index.ts = entry point ONLY — never dump logic there

## COMMANDS

```bash
bun test                    # Bun test suite
bun run build              # Build (ESM + declarations + schema)
bun run build:all          # Build + platform binaries
bun run typecheck           # tsc --noEmit
bunx oh-my-opencode install # Interactive setup
bunx oh-my-opencode doctor  # Health diagnostics
bunx oh-my-opencode run     # Non-interactive session
```

## CI/CD

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| ci.yml | push/PR to master/dev | Tests (split: mock-heavy + batch), typecheck, build, schema auto-commit |
| publish.yml | manual dispatch | Version bump, dual npm publish, platform binaries, GitHub release |
| publish-platform.yml | called by publish | 11 platform binaries via bun compile (darwin/linux/windows) |
| sisyphus-agent.yml | @mention / dispatch | AI agent handles issues/PRs |
| refresh-model-capabilities.yml | weekly schedule / dispatch | Auto-refresh model capabilities from models.dev API |
| cla.yml | issue_comment/PR | CLA assistant |
| lint-workflows.yml | push to .github/ | actionlint + shellcheck |

## NOTES

- Logger → `/tmp/oh-my-opencode.log` — check for debugging
- Background tasks: 5 concurrent per model/provider (configurable, circuit breaker)
- Plugin load timeout: 10s for Claude Code plugins
- Model fallback: per-agent chains in `shared/model-requirements.ts`, not global priority
- Two fallback systems: `model-fallback` (proactive, chat.params) vs `runtime-fallback` (reactive, session.error)
- Config migration: idempotent via `_migrations` tracking, timestamped backups before atomic writes
- Build: bun build (ESM) + tsc --emitDeclarationOnly, externals: @ast-grep/napi
- Test setup: `test-setup.ts` preloaded via bunfig.toml, resets session/cache between tests
- Test split: `script/run-ci-tests.ts` auto-isolates `mock.module()` files (+ `src/openclaw/__tests__/reply-listener-discord.test.ts`)
- 104 barrel exports (index.ts) establish module boundaries
- Architecture rules enforced via `.sisyphus/rules/modular-code-enforcement.md`
- Windows builds on `windows-latest` runner (not cross-compiled) to avoid Bun segfaults
- Platform binaries detect AVX2 + libc family at runtime, fallback to baseline
- Hashline edit: Read output tagged with `LINE#ID` content hashes; edits reject on mismatch
- IntentGate: classifies intent (research/implementation/investigation/evaluation/fix) before routing

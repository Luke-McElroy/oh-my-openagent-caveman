# Configuration Reference

Complete reference Oh My OpenCode plugin configuration. During rename transition, runtime recognizes both `oh-my-openagent.json[c]` legacy `oh-my-opencode.json[c]` files.

---

## Table Contents

- [Getting Started](#getting-started)
- [File Locations](#file-locations)
- [Quick Start Example](#quick-start-example)
- [Core Concepts](#core-concepts)
- [Agents](#agents)
- [Categories](#categories)
- [Model Resolution](#model-resolution)
- [Task System](#task-system)
- [Background Tasks](#background-tasks)
- [Sisyphus Agent](#sisyphus-agent)
- [Sisyphus Tasks](#sisyphus-tasks)
- [Features](#features)
- [Skills](#skills)
- [Hooks](#hooks)
- [Commands](#commands)
- [Browser Automation](#browser-automation)
- [Tmux Integration](#tmux-integration)
- [Git Master](#git-master)
- [Comment Checker](#comment-checker)
- [Notification](#notification)
- [MCPs](#mcps)
- [LSP](#lsp)
- [Advanced](#advanced)
- [Runtime Fallback](#runtime-fallback)
- [Model Capabilities](#model-capabilities)
- [Hashline Edit](#hashline-edit)
- [Experimental](#experimental)
- [Reference](#reference)
- [Environment Variables](#environment-variables)
- [Provider-Specific](#provider-specific)

---

## Getting Started

### File Locations

User config loaded first, project config overrides . each directory, compatibility layer recognizes both renamed legacy basenames.

1. Project config: `.opencode/oh-my-openagent.json[c]` `.opencode/oh-my-opencode.json[c]`
2. User config (`.jsonc` preferred over `.json`):

| Platform | Path candidates |
| ----------- | --------------- |
| macOS/Linux | `~/.config/opencode/oh-my-openagent.json[c]`, `~/.config/opencode/oh-my-opencode.json[c]` |
| Windows | `%APPDATA%\opencode\oh-my-openagent.json[c]`, `%APPDATA%\opencode\oh-my-opencode.json[c]` |

**Rename compatibility:** published package CLI binary remain `oh-my-opencode`. OpenCode plugin registration prefers `oh-my-openagent`, while legacy `oh-my-opencode` entries config basenames still load during transition. Config detection checks `oh-my-opencode` before `oh-my-openagent`, so if both plugin config basenames exist same directory, legacy `oh-my-opencode.*` file currently wins.
JSONC supports `// line comments`, `/* block comments */`, trailing commas.

Enable schema autocomplete:

```json
{
"$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/dev/assets/oh-my-opencode.schema.json"
}
```

Run `bunx oh-my-opencode install` guided setup. Run `opencode models` list available models.

### Quick Start Example

Here's practical starting configuration:

```jsonc
{
"$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/dev/assets/oh-my-opencode.schema.json",

"agents": {
// Main orchestrator: Claude Opus Kimi K2.5 work best
"sisyphus": {
"model": "kimi--coding/k2p5",
"ultrawork": { "model": "anthropic/claude-opus-4-7", "variant": "max" },
},

// Research agents: cheap fast models fine
"librarian": { "model": "google/gemini-3-flash" },
"explore": { "model": "github-copilot/grok-code-fast-1" },

// Architecture consultation: GPT-5.4 Claude Opus
"oracle": { "model": "openai/gpt-5.4", "variant": "high" },

// Prometheus inherits sisyphus model; add prompt guidance
"prometheus": {
"prompt_append": "Leverage deep & quick agents heavily, always parallel.",
},
},

"categories": {
// quick - trivial tasks
"quick": { "model": "opencode/gpt-5-nano" },

// unspecified-low - moderate tasks
"unspecified-low": { "model": "anthropic/claude-sonnet-4-6" },

// unspecified-high - complex work
"unspecified-high": { "model": "anthropic/claude-opus-4-7", "variant": "max" },

// writing - docs/prose
"writing": { "model": "google/gemini-3-flash" },

// visual-engineering - Gemini dominates visual tasks
"visual-engineering": {
"model": "google/gemini-3.1-pro",
"variant": "high",
},

// Custom category git operations
"git": {
"model": "opencode/gpt-5-nano",
"description": "All git operations",
"prompt_append": "Focus on atomic commits, clear messages, safe operations.",
},
},

// Limit expensive providers; let cheap ones run freely
"background_task": {
"providerConcurrency": {
"anthropic": 3,
"openai": 3,
"opencode": 10,
"zai-coding-plan": 10,
},
"modelConcurrency": {
"anthropic/claude-opus-4-7": 2,
"opencode/gpt-5-nano": 20,
},
},

"experimental": { "aggressive_truncation": true, "task_system": true },
"tmux": { "enabled": false },
}
```

---

## Core Concepts

### Agents

Override built- agent settings. Available agents: `sisyphus`, `hephaestus`, `prometheus`, `oracle`, `librarian`, `explore`, `multimodal-looker`, `metis`, `momus`, `atlas`, `sisyphus-junior`.

```json
{
"agents": {
"explore": { "model": "anthropic/claude-haiku-4-5", "temperature": 0.5 },
"multimodal-looker": { "disable": true }
}
}
```

Disable agents entirely: `{ "disabled_agents": ["oracle", "multimodal-looker"] }`

Core agents receive injected runtime `order` field deterministic Tab cycling UI: Sisyphus = 1, Hephaestus = 2, Prometheus = 3, Atlas = 4. not user-configurable config key.

#### Agent Options

| Option | Type | Description |
| ----------------- | -------------- | --------------------------------------------------------------- |
| `model` | string | Model override (`provider/model`) |
| `fallback_models` | string\|array | Fallback models on API errors. Supports strings mixed arrays strings object entries per-model settings |
| `temperature` | number | Sampling temperature |
| `top_p` | number | Top-p sampling |
| `prompt` | string | Replace system prompt. Supports `file://` URIs |
| `prompt_append` | string | Append system prompt. Supports `file://` URIs |
| `tools` | array | Allowed tools list |
| `disable` | boolean | Disable agent |
| `mode` | string | Agent mode |
| `color` | string | UI color |
| `permission` | object | Per-tool permissions (see below) |
| `category` | string | Inherit model from category |
| `variant` | string | Model variant: `max`, `high`, `medium`, `low`, `xhigh`. Normalized supported values |
| `maxTokens` | number | Max response tokens |
| `thinking` | object | Anthropic extended thinking |
| `reasoningEffort` | string | OpenAI reasoning: `none`, `minimal`, `low`, `medium`, `high`, `xhigh`. Normalized supported values |
| `textVerbosity` | string | Text verbosity: `low`, `medium`, `high` |
| `providerOptions` | object | Provider-specific options |

#### Anthropic Extended Thinking

```json
{
"agents": {
"oracle": { "thinking": { "type": "enabled", "budgetTokens": 200000 } }
}
}
```

#### Agent Permissions

Control what tools agent use:

```json
{
"agents": {
"explore": {
"permission": {
"edit": "deny",
"bash": "ask",
"webfetch": "allow"
}
}
}
}
```

| Permission | Values |
| -------------------- | --------------------------------------------------------------------------- |
| `edit` | `ask` / `allow` / `deny` |
| `bash` | `ask` / `allow` / `deny` per-command: `{ "git": "allow", "rm": "deny" }` |
| `webfetch` | `ask` / `allow` / `deny` |
| `doom_loop` | `ask` / `allow` / `deny` |
| `external_directory` | `ask` / `allow` / `deny` |


#### Fallback Models Per-Model Settings

`fallback_models` accepts either single model string array. Array entries plain strings objects individual model settings:

```jsonc
{
"agents": {
"sisyphus": {
"model": "anthropic/claude-opus-4-7",
"fallback_models": [
// Simple string fallback
"openai/gpt-5.4",
// Object per-model settings
{
"model": "google/gemini-3.1-pro",
"variant": "high",
"temperature": 0.2
},
{
"model": "anthropic/claude-sonnet-4-6",
"thinking": { "type": "enabled", "budgetTokens": 64000 }
}
]
}
}
}
```

Object entries support: `model`, `variant`, `reasoningEffort`, `temperature`, `top_p`, `maxTokens`, `thinking`.

#### File URIs Prompts

Both `prompt` `prompt_append` support loading content from files via `file://` URIs. Category-level `prompt_append` supports same URI forms.

```jsonc
{
"agents": {
"sisyphus": {
"prompt_append": "file:///absolute/path//prompt.txt"
},
"oracle": {
"prompt": "file://./relative//project/prompt.md"
},
"explore": {
"prompt_append": "file://~/home/dir/prompt.txt"
}
},
"categories": {
"custom": {
"model": "anthropic/claude-sonnet-4-6",
"prompt_append": "file://./category-context.md"
}
}
}
```

Paths absolute (`file:///abs/path`), relative project root (`file://./rel/path`), home-relative (`file://~/home/path`). If file URI cannot decoded, resolved, read, OmO inserts warning placeholder into prompt instead failing hard.

### Categories

Domain-specific model delegation by `task()` tool. When Sisyphus delegates work, picks category, not model name.

#### Built- Categories

| Category | Default Model | Description |
| -------------------- | ------------------------------- | ---------------------------------------------- |
| `visual-engineering` | `google/gemini-3.1-pro` (high) | Frontend, UI/UX, design, animation |
| `ultrabrain` | `openai/gpt-5.4` (xhigh) | Deep logical reasoning, complex architecture |
| `deep` | `openai/gpt-5.4` (medium) | Autonomous problem-solving, thorough research |
| `artistry` | `google/gemini-3.1-pro` (high) | Creative/unconventional approaches |
| `quick` | `openai/gpt-5.4-mini` | Trivial tasks, typo fixes, single-file changes |
| `unspecified-low` | `anthropic/claude-sonnet-4-6` | General tasks, low effort |
| `unspecified-high` | `anthropic/claude-opus-4-7` (max) | General tasks, high effort |
| `writing` | `google/gemini-3-flash` | Documentation, prose, technical writing |

> **Note**: Built- defaults only apply if category present config. Otherwise system default model .

#### Category Options

| Option | Type | Default | Description |
| ------------------- | ------------- | ------- | ------------------------------------------------------------------- |
| `model` | string | - | Model override |
| `fallback_models` | string\|array | - | Fallback models on API errors. Supports strings mixed arrays strings object entries per-model settings |
| `temperature` | number | - | Sampling temperature |
| `top_p` | number | - | Top-p sampling |
| `maxTokens` | number | - | Max response tokens |
| `thinking` | object | - | Anthropic extended thinking |
| `reasoningEffort` | string | - | OpenAI reasoning effort. Unsupported values normalized |
| `textVerbosity` | string | - | Text verbosity |
| `tools` | array | - | Allowed tools |
| `prompt_append` | string | - | Append system prompt |
| `variant` | string | - | Model variant. Unsupported values normalized |
| `description` | string | - | Shown `task()` tool prompt |
| `is_unstable_agent` | boolean | `false` | Force background mode + monitoring. Auto-enabled Gemini models. |

Disable categories: `{ "disabled_categories": ["ultrabrain"] }`

### Model Resolution

Runtime priority:

1. **UI-selected model** - model chosen OpenCode UI, primary agents
2. **User override** - model set config → exactly as-. Even on cold cache, explicit user configuration takes precedence over hardcoded fallback chains
3. **Category default** - model inherited from assigned category config
4. **User `fallback_models`** - user-configured fallback list tried before built- fallback chains
5. **Provider fallback chain** - built- provider/model chain from OmO source
6. **System default** - OpenCode's configured default model

#### Model Settings Compatibility

Model settings compatibility-normalized against model capabilities instead failing hard.

Normalized fields:

- `variant` - downgraded closest supported value
- `reasoningEffort` - downgraded closest supported value, removed if unsupported
- `temperature` - removed if unsupported by model metadata
- `top_p` - removed if unsupported by model metadata
- `maxTokens` - capped model's reported max output limit
- `thinking` - removed if target model not support thinking

Examples:
- Claude models not support `reasoningEffort` - removed automatically
- GPT-4.1 not support reasoning - `reasoningEffort` removed
- o-series models support `none` through `high` - `xhigh` downgraded `high`
- GPT-5 supports `none`, `minimal`, `low`, `medium`, `high`, `xhigh` - all pass through

Capability data comes from provider runtime metadata first. OmO ships bundled models.dev-backed capability data, supports refreshable local models.dev cache, falls back heuristic family detection plus alias rules when exact metadata unavailable. `bunx oh-my-opencode doctor` surfaces capability diagnostics warns when configured model relies on compatibility fallback.


#### Agent Provider Chains

| Agent | Default Model | Provider Priority |
| --------------------- | ------------------- | ---------------------------------------------------------------------------- |
| **Sisyphus** | `claude-opus-4-7` | `anthropic\|github-copilot\|opencode/claude-opus-4-7 (max)` → `opencode-go/kimi-k2.5` → `kimi--coding/k2p5` → `opencode\|moonshotai\|moonshotai-cn\|firmware\|ollama-cloud\|aihubmix/kimi-k2.5` → `openai\|github-copilot\|opencode/gpt-5.4 (medium)` → `zai-coding-plan\|opencode/glm-5` → `opencode/big-pickle` |
| **Hephaestus** | `gpt-5.4` | `gpt-5.4 (medium)` |
| **oracle** | `gpt-5.4` | `openai\|github-copilot\|opencode/gpt-5.4 (high)` → `google\|github-copilot\|opencode/gemini-3.1-pro (high)` → `anthropic\|github-copilot\|opencode/claude-opus-4-7 (max)` → `opencode-go/glm-5` |
| **librarian** | `gpt-5.4-mini-fast` | `openai/gpt-5.4-mini-fast` → `opencode-go\|vercel/minimax-m2.7-highspeed` → `opencode-go\|vercel/minimax-m2.7` → `anthropic\|opencode\|vercel/claude-haiku-4-5` → `openai\|opencode\|vercel/gpt-5.4-nano` |
| **explore** | `gpt-5.4-mini-fast` | `openai/gpt-5.4-mini-fast` → `opencode-go\|vercel/minimax-m2.7-highspeed` → `opencode-go\|vercel/minimax-m2.7` → `anthropic\|opencode\|vercel/claude-haiku-4-5` → `openai\|opencode\|vercel/gpt-5.4-nano` |
| **multimodal-looker** | `gpt-5.4` | `openai\|opencode/gpt-5.4 (medium)` → `opencode-go/kimi-k2.5` → `zai-coding-plan/glm-4.6v` → `openai\|github-copilot\|opencode/gpt-5-nano` |
| **Prometheus** | `claude-opus-4-7` | `anthropic\|github-copilot\|opencode/claude-opus-4-7 (max)` → `openai\|github-copilot\|opencode/gpt-5.4 (high)` → `opencode-go/glm-5` → `google\|github-copilot\|opencode/gemini-3.1-pro` |
| **Metis** | `claude-opus-4-7` | `anthropic\|github-copilot\|opencode/claude-opus-4-7 (max)` → `openai\|github-copilot\|opencode/gpt-5.4 (high)` → `opencode-go/glm-5` → `kimi--coding/k2p5` |
| **Momus** | `gpt-5.4` | `openai\|github-copilot\|opencode/gpt-5.4 (xhigh)` → `anthropic\|github-copilot\|opencode/claude-opus-4-7 (max)` → `google\|github-copilot\|opencode/gemini-3.1-pro (high)` → `opencode-go/glm-5` |
| **Atlas** | `claude-sonnet-4-6` | `anthropic\|github-copilot\|opencode/claude-sonnet-4-6` → `opencode-go/kimi-k2.5` → `openai\|github-copilot\|opencode/gpt-5.4 (medium)` → `opencode-go/minimax-m2.7` |

#### Category Provider Chains

| Category | Default Model | Provider Priority |
| ---------------------- | ------------------- | -------------------------------------------------------------- |
| **visual-engineering** | `gemini-3.1-pro` | `google\|github-copilot\|opencode/gemini-3.1-pro (high)` → `zai-coding-plan\|opencode/glm-5` → `anthropic\|github-copilot\|opencode/claude-opus-4-7 (max)` → `opencode-go/glm-5` → `kimi--coding/k2p5` |
| **ultrabrain** | `gpt-5.4` | `openai\|opencode/gpt-5.4 (xhigh)` → `google\|github-copilot\|opencode/gemini-3.1-pro (high)` → `anthropic\|github-copilot\|opencode/claude-opus-4-7 (max)` → `opencode-go/glm-5` |
| **deep** | `gpt-5.4` | `openai\|github-copilot\|venice\|opencode/gpt-5.4 (medium)` → `anthropic\|github-copilot\|opencode/claude-opus-4-7 (max)` → `google\|github-copilot\|opencode/gemini-3.1-pro (high)` |
| **artistry** | `gemini-3.1-pro` | `google\|github-copilot\|opencode/gemini-3.1-pro (high)` → `anthropic\|github-copilot\|opencode/claude-opus-4-7 (max)` → `openai\|github-copilot\|opencode/gpt-5.4` |
| **quick** | `gpt-5.4-mini` | `openai\|github-copilot\|opencode/gpt-5.4-mini` → `anthropic\|github-copilot\|opencode/claude-haiku-4-5` → `google\|github-copilot\|opencode/gemini-3-flash` → `opencode-go/minimax-m2.7` → `opencode/gpt-5-nano` |
| **unspecified-low** | `claude-sonnet-4-6` | `anthropic\|github-copilot\|opencode/claude-sonnet-4-6` → `openai\|opencode/gpt-5.3-codex (medium)` → `opencode-go/kimi-k2.5` → `google\|github-copilot\|opencode/gemini-3-flash` → `opencode-go/minimax-m2.7` |
| **unspecified-high** | `claude-opus-4-7` | `anthropic\|github-copilot\|opencode/claude-opus-4-7 (max)` → `openai\|github-copilot\|opencode/gpt-5.4 (high)` → `zai-coding-plan\|opencode/glm-5` → `kimi--coding/k2p5` → `opencode-go/glm-5` → `opencode/kimi-k2.5` → `opencode\|moonshotai\|moonshotai-cn\|firmware\|ollama-cloud\|aihubmix/kimi-k2.5` |
| **writing** | `gemini-3-flash` | `google\|github-copilot\|opencode/gemini-3-flash` → `opencode-go/kimi-k2.5` → `anthropic\|github-copilot\|opencode/claude-sonnet-4-6` → `opencode-go/minimax-m2.7` |

Run `bunx oh-my-opencode doctor --verbose` see effective model resolution config.

---

## Task System

### Background Tasks

Control parallel agent execution concurrency limits.

```json
{
"background_task": {
"defaultConcurrency": 5,
"staleTimeoutMs": 180000,
"providerConcurrency": { "anthropic": 3, "openai": 5, "google": 10 },
"modelConcurrency": { "anthropic/claude-opus-4-7": 2 }
}
}
```

| Option | Default | Description |
| --------------------- | -------- | --------------------------------------------------------------------- |
| `defaultConcurrency` | - | Max concurrent tasks (all providers) |
| `staleTimeoutMs` | `180000` | Interrupt tasks no activity (min: 60000) |
| `providerConcurrency` | - | Per-provider limits (key = provider name) |
| `modelConcurrency` | - | Per-model limits (key = `provider/model`). Overrides provider limits. |

Priority: `modelConcurrency` > `providerConcurrency` > `defaultConcurrency`

### Sisyphus Agent

Configure main orchestration system.

```json
{
"sisyphus_agent": {
"disabled": false,
"default_builder_enabled": false,
"planner_enabled": true,
"replace_plan": true
}
}
```

| Option | Default | Description |
| ------------------------- | ------- | --------------------------------------------------------------- |
| `disabled` | `false` | Disable all Sisyphus orchestration, restore original build/plan |
| `default_builder_enabled` | `false` | Enable OpenCode-Builder agent (off by default) |
| `planner_enabled` | `true` | Enable Prometheus (Planner) agent |
| `replace_plan` | `true` | Demote default plan agent subagent mode |

Sisyphus agents customized under `agents` their names: `Sisyphus`, `OpenCode-Builder`, `Prometheus (Planner)`, `Metis (Plan Consultant)`.

### Sisyphus Tasks

Enable Sisyphus Tasks system cross-session task tracking.

```json
{
"sisyphus": {
"tasks": {
"enabled": false,
"storage_path": ".sisyphus/tasks",
"claude_code_compat": false
}
}
}
```

| Option | Default | Description |
| -------------------- | ----------------- | ------------------------------------------ |
| `enabled` | `false` | Enable Sisyphus Tasks system |
| `storage_path` | `.sisyphus/tasks` | Storage path (relative project root) |
| `claude_code_compat` | `false` | Enable Claude Code path compatibility mode |

---

## Features

### Skills

Skills bring domain-specific expertise embedded MCPs.

Built- skills: `playwright`, `playwright-cli`, `agent-browser`, `dev-browser`, `git-master`, `frontend-ui-ux`

Disable built- skills: `{ "disabled_skills": ["playwright"] }`

#### Skills Configuration

```json
{
"skills": {
"sources": [
{ "path": "./my-skills", "recursive": true },
"https://example.com/skill.yaml"
],
"enable": ["my-skill"],
"disable": ["other-skill"],
"my-skill": {
"description": "What ",
"template": "Custom prompt template",
"from": "source-file.ts",
"model": "custom/model",
"agent": "custom-agent",
"subtask": true,
"argument-hint": "usage hint",
"license": "MIT",
"compatibility": ">= 3.0.0",
"metadata": { "author": " Name" },
"allowed-tools": ["read", "bash"]
}
}
}
```

| `sources` option | Default | Description |
| ---------------- | ------- | ------------------------------- |
| `path` | - | Local path remote URL |
| `recursive` | `false` | Recurse into subdirectories |
| `glob` | - | Glob pattern file selection |

### Hooks

Disable built- hooks via `disabled_hooks`:

```json
{ "disabled_hooks": ["comment-checker"] }
```

Available hooks: `todo-continuation-enforcer`, `context-window-monitor`, `session-recovery`, `session-notification`, `comment-checker`, `grep-output-truncator`, `tool-output-truncator`, `directory-agents-injector`, `directory-readme-injector`, `empty-task-response-detector`, `think-mode`, `anthropic-context-window-limit-recovery`, `rules-injector`, `background-notification`, `auto-update-checker`, `startup-toast`, `keyword-detector`, `agent-usage-reminder`, `non-interactive-env`, `interactive-bash-session`, `compaction-context-injector`, `thinking-block-validator`, `claude-code-hooks`, `ralph-loop`, `preemptive-compaction`, `auto-slash-command`, `sisyphus-junior-notepad`, `no-sisyphus-gpt`, `start-work`, `runtime-fallback`

**Notes:**

- `directory-agents-injector` - auto-disabled on OpenCode 1.1.37+ (native AGENTS.md support)
- `no-sisyphus-gpt` - ** not disable**. blocks incompatible GPT models Sisyphus while allowing dedicated GPT-5.4 prompt path.
- `startup-toast` sub-feature `auto-update-checker`. Disable toast by adding `startup-toast` `disabled_hooks`.
- `session-recovery` - automatically recovers from recoverable session errors (missing tool results, unavailable tools, thinking block violations). Shows toast notifications during recovery. Enable `experimental.auto_resume` automatic retry after recovery.

### Commands

Disable built- commands via `disabled_commands`:

```json
{ "disabled_commands": ["init-deep", "start-work"] }
```

Available commands: `init-deep`, `ralph-loop`, `ulw-loop`, `cancel-ralph`, `refactor`, `start-work`, `stop-continuation`, `handoff`

### Browser Automation

| Provider | Interface | Installation |
| ---------------------- | --------- | --------------------------------------------------- |
| `playwright` (default) | MCP tools | Auto-installed via npx |
| `agent-browser` | Bash CLI | `bun add -g agent-browser && agent-browser install` |

Switch provider:

```json
{ "browser_automation_engine": { "provider": "agent-browser" } }
```

### Tmux Integration

Run background subagents separate tmux panes. Requires running inside tmux `opencode --port <port>`.

```json
{
"tmux": {
"enabled": true,
"layout": "main-vertical",
"main_pane_size": 60,
"main_pane_min_width": 120,
"agent_pane_min_width": 40
}
}
```

| Option | Default | Description |
| ---------------------- | --------------- | ----------------------------------------------------------------------------------- |
| `enabled` | `false` | Enable tmux pane spawning |
| `layout` | `main-vertical` | `main-vertical` / `main-horizontal` / `tiled` / `even-horizontal` / `even-vertical` |
| `main_pane_size` | `60` | Main pane % (20–80) |
| `main_pane_min_width` | `120` | Min main pane columns |
| `agent_pane_min_width` | `40` | Min agent pane columns |

### Git Master

Configure git commit behavior:

```json
{ "git_master": { "commit_footer": true, "include_co_authored_by": true } }
```

### Comment Checker

Customize comment quality checker:

```json
{
"comment_checker": {
"custom_prompt": " message. Use {{comments}} placeholder."
}
}
```

### Notification

Force-enable session notifications:

```json
{ "notification": { "force_enable": true } }
```

`force_enable` (`false`) - force session-notification even if external notification plugins detected.

### MCPs

Built- MCPs (enabled by default): `websearch` (Exa AI), `context7` (library docs), `grep_app` (GitHub code search).

```json
{ "disabled_mcps": ["websearch", "context7", "grep_app"] }
```

### LSP

Configure Language Server Protocol integration:

```json
{
"lsp": {
"typescript-language-server": {
"command": ["typescript-language-server", "--stdio"],
"extensions": [".ts", ".tsx"],
"priority": 10,
"env": { "NODE_OPTIONS": "--max-old-space-size=4096" },
"initialization": {
"preferences": { "includeInlayParameterNameHints": "all" }
}
},
"pylsp": { "disabled": true }
}
}
```

| Option | Type | Description |
| ---------------- | ------- | ------------------------------------ |
| `command` | array | Command start LSP server |
| `extensions` | array | File extensions (e.g. `[".ts"]`) |
| `priority` | number | Priority when multiple servers match |
| `env` | object | Environment variables |
| `initialization` | object | Init options passed server |
| `disabled` | boolean | Disable server |

---

## Advanced

### Runtime Fallback

Auto-switches backup models on API errors.

**Simple configuration** (enable/disable defaults):

```json
{ "runtime_fallback": true }
{ "runtime_fallback": false }
```

**Advanced configuration** (full control):

```json
{
"runtime_fallback": {
"enabled": true,
"retry_on_errors": [400, 429, 503, 529],
"max_fallback_attempts": 3,
"cooldown_seconds": 60,
"timeout_seconds": 30,
"notify_on_fallback": true
}
}
```

| Option | Default | Description |
| ----------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `enabled` | `false` | Enable runtime fallback |
| `retry_on_errors` | `[400,429,503,529]` | HTTP codes trigger fallback. Also handles classified provider key errors. |
| `max_fallback_attempts` | `3` | Max fallback attempts per session (1–20) |
| `cooldown_seconds` | `60` | Seconds before retrying failed model |
| `timeout_seconds` | `30` | Seconds before forcing next fallback. **Set `0` disable timeout-based escalation provider retry message detection.** |
| `notify_on_fallback` | `true` | Toast notification on model switch |

Define `fallback_models` per agent category:

```json
{
"agents": {
"sisyphus": {
"model": "anthropic/claude-opus-4-7",
"fallback_models": [
"openai/gpt-5.4",
{
"model": "google/gemini-3.1-pro",
"variant": "high"
}
]
}
}
}
```

`fallback_models` supports object-style entries so attach settings specific fallback model:

```json
{
"agents": {
"sisyphus": {
"model": "anthropic/claude-opus-4-7",
"fallback_models": [
"openai/gpt-5.4",
{
"model": "anthropic/claude-sonnet-4-6",
"variant": "high",
"thinking": { "type": "enabled", "budgetTokens": 12000 }
},
{
"model": "openai/gpt-5.3-codex",
"reasoningEffort": "high",
"temperature": 0.2,
"top_p": 0.95,
"maxTokens": 8192
}
]
}
}
}
```

Mixed arrays allowed, so string entries object entries appear together same fallback chain.

#### Object-style `fallback_models`

Object entries use following shape:

| Field | Type | Description |
| ----- | ---- | ----------- |
| `model` | string | Fallback model ID. Provider prefix optional when OmO inherit current/default provider. |
| `variant` | string | Explicit variant override fallback entry. |
| `reasoningEffort` | string | OpenAI reasoning effort override fallback entry. |
| `temperature` | number | Temperature applied if fallback model becomes active. |
| `top_p` | number | Top-p applied if fallback model becomes active. |
| `maxTokens` | number | Max response tokens applied if fallback model becomes active. |
| `thinking` | object | Anthropic thinking config applied if fallback model becomes active. |

Per-model settings **fallback-only**. They promoted only when specific fallback model selected, so they not override primary model settings when primary model resolves successfully.

`thinking` same shape as normal agent/category option:

| Field | Type | Description |
| ----- | ---- | ----------- |
| `type` | string | `enabled` `disabled` |
| `budgetTokens` | number | Optional Anthropic thinking budget |

Object entries omit provider prefix when OmO infer from current/default provider. If provide both inline variant syntax `model` explicit `variant` field, explicit `variant` field wins.

#### Full examples

**1. Simple string chain**

Use strings when only need ordered fallback chain:

```json
{
"agents": {
"atlas": {
"model": "anthropic/claude-sonnet-4-6",
"fallback_models": [
"anthropic/claude-haiku-4-5",
"openai/gpt-5.4",
"google/gemini-3.1-pro"
]
}
}
}
```

**2. Same-provider shorthand**

If primary model already establishes provider, fallback entries omit prefix:

```json
{
"agents": {
"atlas": {
"model": "openai/gpt-5.4",
"fallback_models": [
"gpt-5.4-mini",
{
"model": "gpt-5.3-codex",
"reasoningEffort": "medium",
"maxTokens": 4096
}
]
}
}
}
```

example OmO treats `gpt-5.4-mini` `gpt-5.3-codex` as OpenAI fallback entries because current/default provider already `openai`.

**3. Mixed cross-provider chain**

Mix string entries object entries when only some fallback models need special settings:

```json
{
"agents": {
"sisyphus": {
"model": "anthropic/claude-opus-4-7",
"fallback_models": [
"openai/gpt-5.4",
{
"model": "anthropic/claude-sonnet-4-6",
"variant": "high",
"thinking": { "type": "enabled", "budgetTokens": 12000 }
},
{
"model": "google/gemini-3.1-pro",
"variant": "high"
}
]
}
}
}
```

**4. Category-level fallback chain**

`fallback_models` works same way under `categories`:

```json
{
"categories": {
"deep": {
"model": "openai/gpt-5.3-codex",
"fallback_models": [
{
"model": "openai/gpt-5.4",
"reasoningEffort": "xhigh",
"maxTokens": 12000
},
{
"model": "anthropic/claude-opus-4-7",
"variant": "max",
"temperature": 0.2
},
"google/gemini-3.1-pro(high)"
]
}
}
}
```

**5. Full object entry every supported field**

shows every supported object-style parameter one place:

```json
{
"agents": {
"oracle": {
"model": "openai/gpt-5.4",
"fallback_models": [
{
"model": "openai/gpt-5.3-codex(low)",
"variant": "xhigh",
"reasoningEffort": "high",
"temperature": 0.3,
"top_p": 0.9,
"maxTokens": 8192,
"thinking": {
"type": "disabled"
}
}
]
}
}
}
```

example explicit `"variant": "xhigh"` overrides inline `(low)` suffix `"model"`.

final example **complete shape reference**. real configs, prefer provider-appropriate settings:

- use `reasoningEffort` OpenAI reasoning models
- use `thinking` Anthropic thinking-capable models
- use `variant`, `temperature`, `top_p`, `maxTokens` only when fallback model supports them

### Model Capabilities

OmO refresh local models.dev capability snapshot on startup. cache controlled by `model_capabilities`.

```jsonc
{
"model_capabilities": {
"enabled": true,
"auto_refresh_on_start": true,
"refresh_timeout_ms": 5000,
"source_url": "https://models.dev/api.json"
}
}
```

| Option | Default behavior | Description |
| ------ | ---------------- | ----------- |
| `enabled` | enabled unless explicitly set `false` | Master switch model capability refresh behavior |
| `auto_refresh_on_start` | refresh on startup unless explicitly set `false` | Refresh local models.dev cache during startup checks |
| `refresh_timeout_ms` | `5000` | Timeout startup refresh attempt |
| `source_url` | `https://models.dev/api.json` | Override models.dev source URL |

Notes:

- Startup refresh runs through auto-update checker hook.
- Manual refresh available via `bunx oh-my-opencode refresh-model-capabilities`.
- Provider runtime metadata still takes priority when OmO resolves capabilities compatibility checks.

### Hashline Edit

Replaces built- `Edit` tool hash-anchored version `LINE#ID` references prevent stale-line edits. Disabled by default.

```json
{ "hashline_edit": true }
```

When enabled, two companion hooks active: `hashline-read-enhancer` (annotates Read output) `hashline-edit-diff-enhancer` (shows diffs). Opt- by setting `hashline_edit: true`. Disable companion hooks individually via `disabled_hooks` if needed.

### Experimental

```json
{
"experimental": {
"truncate_all_tool_outputs": false,
"aggressive_truncation": false,
"auto_resume": false,
"disable_omo_env": false,
"task_system": true,
"dynamic_context_pruning": {
"enabled": false,
"notification": "detailed",
"turn_protection": { "enabled": true, "turns": 3 },
"protected_tools": [
"task",
"todowrite",
"todoread",
"lsp_rename",
"session_read",
"session_write",
"session_search"
],
"strategies": {
"deduplication": { "enabled": true },
"supersede_writes": { "enabled": true, "aggressive": false },
"purge_errors": { "enabled": true, "turns": 5 }
}
}
}
}
```

| Option | Default | Description |
| ---------------------------------------- | ---------- | ------------------------------------------------------------------------------------ |
| `truncate_all_tool_outputs` | `false` | Truncate all tool outputs (not whitelisted) |
| `aggressive_truncation` | `false` | Aggressively truncate when token limit exceeded |
| `auto_resume` | `false` | Auto-resume after thinking block recovery |
| `disable_omo_env` | `false` | Disable auto-injected `<omo-env>` block (date/time/locale). Improves cache hit rate. |
| `task_system` | `false` | Enable Sisyphus task system |
| `dynamic_context_pruning.enabled` | `false` | Auto-prune old tool outputs manage context window |
| `dynamic_context_pruning.notification` | `detailed` | Pruning notifications: `off` / `minimal` / `detailed` |
| `turn_protection.turns` | `3` | Recent turns protected from pruning (1–10) |
| `strategies.deduplication` | `true` | Remove duplicate tool calls |
| `strategies.supersede_writes` | `true` | Prune write inputs when file later read |
| `strategies.supersede_writes.aggressive` | `false` | Prune any write if ANY subsequent read exists |
| `strategies.purge_errors.turns` | `5` | Turns before pruning errored tool inputs |

---

## Reference

### Environment Variables

| Variable | Description |
| --------------------- | ----------------------------------------------------------------- |
| `OPENCODE_CONFIG_DIR` | Override OpenCode config directory (useful profile isolation) |
| `OMO_SEND_ANONYMOUS_TELEMETRY` | Set `0`, `false`, `no` disable anonymous telemetry |
| `OMO_DISABLE_POSTHOG` | Legacy telemetry opt-out flag. Set `1` `true` disable PostHog |
| `POSTHOG_API_KEY` | Optional override built- PostHog project API key |
| `POSTHOG_HOST` | Override PostHog ingestion host. Defaults `https://us.i.posthog.com` |

### Provider-Specific

#### Google Auth

Install [`opencode-antigravity-auth`](https://github.com/NoeFabris/opencode-antigravity-auth) Google Gemini. Provides multi-account load balancing, dual quota, variant-based thinking.

#### Ollama

**Must** disable streaming avoid JSON parse errors:

```json
{
"agents": {
"explore": { "model": "ollama/qwen3-coder", "stream": false }
}
}
```

Common models: `ollama/qwen3-coder`, `ollama/ministral-3:14b`, `ollama/lfm2.5-thinking`

See [Ollama Troubleshooting](../troubleshooting/ollama.md) `JSON Parse error: Unexpected EOF` issues.

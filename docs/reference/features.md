# Oh-My-OpenAgent Features Reference

## Agents

Oh-My-OpenAgent provides 11 specialized AI agents. Each distinct expertise, optimized models, tool permissions.

### Core Agents

Core-agent tab cycling deterministic via injected runtime order field. fixed priority order Sisyphus (order: 1), Hephaestus (order: 2), Prometheus (order: 3), Atlas (order: 4). Remaining agents follow after stable core ordering.

| Agent | Model | Purpose |
| --------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Sisyphus** | `claude-opus-4-7` | default orchestrator. Plans, delegates, executes complex tasks specialized subagents aggressive parallel execution. Todo-driven workflow extended thinking (32k budget). Fallback: `opencode-go/kimi-k2.5` → `kimi--coding/k2p5` → `opencode\|moonshotai\|moonshotai-cn\|firmware\|ollama-cloud\|aihubmix/kimi-k2.5` → `openai\|github-copilot\|opencode/gpt-5.4 (medium)` → `zai-coding-plan\|opencode/glm-5` → `opencode/big-pickle`. |
| **Hephaestus** | `gpt-5.4` | Legitimate Craftsman. Autonomous deep worker inspired by AmpCode's deep mode. Goal-oriented execution thorough research before action. Explores codebase patterns, completes tasks end--end without premature stopping. Named after Greek god forge craftsmanship. Requires GPT-capable provider. |
| **Oracle** | `gpt-5.4` | Architecture decisions, code review, debugging. Read-only consultation stellar logical reasoning deep analysis. Inspired by AmpCode. Fallback: `google\|github-copilot\|opencode/gemini-3.1-pro (high)` → `anthropic\|github-copilot\|opencode/claude-opus-4-7 (max)` → `opencode-go/glm-5`. |
| **Librarian** | `gpt-5.4-mini-fast` | Multi-repo analysis, documentation lookup, OSS implementation examples. Deep codebase understanding evidence-based answers. Fallback: `opencode-go/minimax-m2.7-highspeed` → `opencode-go/minimax-m2.7` → `anthropic\|opencode/claude-haiku-4-5` → `openai\|opencode/gpt-5.4-nano`. |
| **Explore** | `gpt-5.4-mini-fast` | Fast codebase exploration contextual grep. Fallback: `opencode-go/minimax-m2.7-highspeed` → `opencode-go/minimax-m2.7` → `anthropic\|opencode/claude-haiku-4-5` → `openai\|opencode/gpt-5.4-nano`. |
| **Multimodal-Looker** | `gpt-5.4` | Visual content specialist. Analyzes PDFs, images, diagrams extract information. Fallback: `opencode-go/kimi-k2.5` → `zai-coding-plan/glm-4.6v` → `openai\|github-copilot\|opencode/gpt-5-nano`. |
### Planning Agents

| Agent | Model | Purpose |
| -------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Prometheus** | `claude-opus-4-7` | Strategic planner interview mode. Creates detailed work plans through iterative questioning. Fallback: `openai\|github-copilot\|opencode/gpt-5.4 (high)` → `opencode-go/glm-5` → `google\|github-copilot\|opencode/gemini-3.1-pro`. |
| **Metis** | `claude-opus-4-7` | Plan consultant — pre-planning analysis. Identifies hidden intentions, ambiguities, AI failure points. Fallback: `openai\|github-copilot\|opencode/gpt-5.4 (high)` → `opencode-go/glm-5` → `kimi--coding/k2p5`. |
| **Momus** | `gpt-5.4` | Plan reviewer — validates plans against clarity, verifiability, completeness standards. Fallback: `anthropic\|github-copilot\|opencode/claude-opus-4-7 (max)` → `google\|github-copilot\|opencode/gemini-3.1-pro (high)` → `opencode-go/glm-5`. |

### Orchestration Agents

| Agent | Model | Purpose |
| ------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Atlas** | `claude-sonnet-4-6` | Todo-list orchestrator. Executes planned tasks systematically, managing todo items coordinating work. Fallback: `opencode-go/kimi-k2.5` → `openai\|github-copilot\|opencode/gpt-5.4 (medium)` → `opencode-go/minimax-m2.7`. |
| **Sisyphus-Junior** | _(category-dependent)_ | Category-spawned executor. Model selected automatically based on task category (visual-engineering, quick, deep, etc.). Its built- general fallback chain `anthropic\|github-copilot\|opencode/claude-sonnet-4-6` → `opencode-go/kimi-k2.5` → `openai\|github-copilot\|opencode/gpt-5.4 (medium)` → `opencode-go/minimax-m2.7` → `opencode/big-pickle`. |

### Invoking Agents

main agent invokes these automatically, but call them explicitly:

```
Ask @oracle review design propose architecture
Ask @librarian how implemented - why behavior keep changing?
Ask @explore policy on feature
```

### Tool Restrictions

| Agent | Restrictions |
| ----------------- | --------------------------------------------------------------------------------------- |
| oracle | Read-only: cannot write, edit, delegate (blocked: write, edit, task, call_omo_agent) |
| librarian | Cannot write, edit, delegate (blocked: write, edit, task, call_omo_agent) |
| explore | Cannot write, edit, delegate (blocked: write, edit, task, call_omo_agent) |
| multimodal-looker | Allowlist: `read` only |
| atlas | Cannot delegate (blocked: task, call_omo_agent) |
| momus | Cannot write, edit, delegate (blocked: write, edit, task) |

### Background Agents

Run agents background continue working:

- GPT debug while Claude tries different approaches
- Gemini writes frontend while Claude handles backend
- Fire massive parallel searches, continue implementation, use results when ready

```
# Launch background
task(subagent_type="explore", load_skills=[], prompt="Find auth implementations", run_in_background=true)

# Continue working...
# System notifies on completion

# Retrieve results when needed
background_output(task_id="bg_abc123")
```

#### Visual Multi-Agent Tmux

Enable `tmux.enabled` see background agents separate tmux panes:

```json
{
"tmux": {
"enabled": true,
"layout": "main-vertical"
}
}
```

When running inside tmux:

- Background agents spawn new panes
- Watch multiple agents work real-time
- Each pane shows agent output live
- Auto-cleanup when agents complete
- **Stable agent ordering**: core-agent tab cycling deterministic via injected runtime order field (Sisyphus: 1, Hephaestus: 2, Prometheus: 3, Atlas: 4)

Customize agent models, prompts, permissions `oh-my-opencode.jsonc`.

## Category System

Category agent configuration preset optimized specific domains. Instead delegating everything single AI agent, far more efficient invoke specialists tailored nature task.

### What Categories Why They Matter

- **Category**: "What kind work ?" (determines model, temperature, prompt mindset)
- **Skill**: "What tools knowledge needed?" (injects specialized knowledge, MCP tools, workflows)

By combining these two concepts, generate optimal agents through `task`.

### Built- Categories

| Category | Default Model | Use Cases |
| -------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `visual-engineering` | `google/gemini-3.1-pro` | Frontend, UI/UX, design, styling, animation |
| `ultrabrain` | `openai/gpt-5.4` (xhigh) | Deep logical reasoning, complex architecture decisions requiring extensive analysis |
| `deep` | `openai/gpt-5.4` (medium) | Goal-oriented autonomous problem-solving. Thorough research before action. For hairy problems requiring deep understanding. |
| `artistry` | `google/gemini-3.1-pro` (high) | Highly creative/artistic tasks, novel ideas |
| `quick` | `openai/gpt-5.4-mini` | Trivial tasks - single file changes, typo fixes, simple modifications |
| `unspecified-low` | `anthropic/claude-sonnet-4-6` | Tasks don't fit other categories, low effort required |
| `unspecified-high` | `anthropic/claude-opus-4-7` (max) | Tasks don't fit other categories, high effort required |
| `writing` | `google/gemini-3-flash` | Documentation, prose, technical writing |

### Usage

Specify `category` parameter when invoking `task` tool.

```typescript
task({
category: "visual-engineering",
prompt: "Add responsive chart component dashboard page",
});
```

### Custom Categories

define custom categories plugin config file. During rename transition, both `oh-my-openagent.json[c]` legacy `oh-my-opencode.json[c]` basenames recognized.

#### Category Configuration Schema

| Field | Type | Description |
| ------------------- | ------- | --------------------------------------------------------------------------- |
| `description` | string | Human-readable description category's purpose. Shown task prompt. |
| `model` | string | AI model ID use (e.g., `anthropic/claude-opus-4-7`) |
| `variant` | string | Model variant (e.g., `max`, `xhigh`) |
| `temperature` | number | Creativity level (0.0 ~ 2.0). Lower more deterministic. |
| `top_p` | number | Nucleus sampling parameter (0.0 ~ 1.0) |
| `prompt_append` | string | Content append system prompt when category selected |
| `thinking` | object | Thinking model configuration (`{ type: "enabled", budgetTokens: 16000 }`) |
| `reasoningEffort` | string | Reasoning effort level (`low`, `medium`, `high`) |
| `textVerbosity` | string | Text verbosity level (`low`, `medium`, `high`) |
| `tools` | object | Tool usage control (disable `{ "tool_name": false }`) |
| `maxTokens` | number | Maximum response token count |
| `is_unstable_agent` | boolean | Mark agent as unstable - forces background mode monitoring |

#### Example Configuration

```jsonc
{
"categories": {
// 1. Define new custom category
"korean-writer": {
"model": "google/gemini-3-flash",
"temperature": 0.5,
"prompt_append": " Korean technical writer. Maintain friendly clear tone.",
},

// 2. Override existing category (change model)
"visual-engineering": {
"model": "openai/gpt-5.4",
"temperature": 0.8,
},

// 3. Configure thinking model restrict tools
"deep-reasoning": {
"model": "anthropic/claude-opus-4-7",
"thinking": {
"type": "enabled",
"budgetTokens": 32000,
},
"tools": {
"websearch_web_search_exa": false,
},
},
},
}
```

### Sisyphus-Junior as Delegated Executor

When use Category, special agent called **Sisyphus-Junior** performs work.

- **Characteristic**: Cannot **re-delegate** tasks other agents.
- **Purpose**: Prevents infinite delegation loops ensures focus on assigned task.

## Advanced Configuration

### Rename Compatibility

published package binary remain `oh-my-opencode`. Inside `opencode.json`, compatibility layer now prefers plugin entry `oh-my-openagent`, while legacy `oh-my-opencode` entries still load warning. Plugin config files (`oh-my-openagent.json[c]` legacy `oh-my-opencode.json[c]`) recognized during transition. Run `bunx oh-my-opencode doctor` check legacy package name warnings.

### Fallback Models

Configure per-agent fallback chains arrays mix plain model strings per-model objects:

```jsonc
{
"agents": {
"sisyphus": {
"fallback_models": [
"opencode/glm-5",
{ "model": "openai/gpt-5.4", "variant": "high" },
{ "model": "anthropic/claude-sonnet-4-6", "thinking": { "type": "enabled", "budgetTokens": 64000 } }
]
}
}
}
```

When model errors, runtime move through configured fallback array. Object entries let tune backup model itself instead only swapping model name.

### File-Based Prompts

Load agent system prompts from external files `file://` URLs `prompt` field, append additional content `prompt_append`. `prompt_append` field works on categories.

```jsonc
{
"agents": {
"sisyphus": {
"prompt": "file:///path//custom-prompt.md"
},
"oracle": {
"prompt_append": "file:///path//additional-context.md"
}
},
"categories": {
"deep": {
"prompt_append": "file:///path//deep-category-append.md"
}
}
}
```

Supports `~` expansion home directory relative `file://` paths.

Useful :
- Version controlling prompts separately from config
- Sharing prompts across projects
- Keeping configuration files concise
- Adding category-specific context without duplicating base prompts

file content loaded at runtime injected into agent's system prompt.

### Session Recovery

system automatically recovers from common session failures without user intervention:

- **Missing tool results**: reconstructs recoverable tool state skips invalid tool-part IDs instead failing whole recovery pass
- **Thinking block violations**: Recovers from API thinking block mismatches
- **Empty messages**: Reconstructs message history when content missing
- **Context window limits**: Gracefully handles Claude context window exceeded errors intelligent compaction
- **JSON parse errors**: Recovers from malformed tool outputs

Recovery happens transparently during agent execution. see result, not failure.
## Skills

Skills provide specialized workflows embedded MCP servers detailed instructions. Skill mechanism injects **specialized knowledge (Context)** **tools (MCP)** specific domains into agents.

### Built- Skills

| Skill | Trigger | Description |
| ------------------ | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **git-master** | commit, rebase, squash, "who wrote", "when X added" | Git expert. Detects commit styles, splits atomic commits, formulates rebase strategies. Three specializations: Commit Architect (atomic commits, dependency ordering, style detection), Rebase Surgeon (history rewriting, conflict resolution, branch cleanup), History Archaeologist (finding when/where specific changes introduced). |
| **playwright** | Browser tasks, testing, screenshots | Browser automation via Playwright MCP. MUST USE browser verification, browsing, web scraping, testing, screenshots. |
| **agent-browser** | Browser tasks on agent-browser | Browser automation via `agent-browser` CLI. Covers navigation, snapshots, screenshots, network inspection, scripted interactions. |
| **dev-browser** | Stateful browser scripting | Browser automation persistent page state iterative workflows authenticated sessions. |
| **frontend-ui-ux** | UI/UX tasks, styling | Designer-turned-developer persona. Crafts stunning UI/UX even without design mockups. Emphasizes bold aesthetic direction, distinctive typography, cohesive color palettes. |
| **review-work** | "review work", "review my work", "QA my work" | Post-implementation review orchestrator. Launches 5 parallel background sub-agents comprehensive review: goal verification, code quality, security, hands-on QA, context mining. All must pass review pass. |
| **ai-slop-remover**| "remove AI slop", "de-AI", "humanize" | Removes AI-generated code smells from files while preserving functionality. Identifies eliminates verbose comments, redundant error handling, over-engineered patterns, generic AI phrasing. |

#### git-master Core Principles

**Multiple Commits by Default**:

```
3+ files -> MUST 2+ commits
5+ files -> MUST 3+ commits
10+ files -> MUST 5+ commits
```

**Automatic Style Detection**:

- Analyzes last 30 commits language (Korean/English) style (semantic/plain/short)
- Matches repo's commit conventions automatically

**Usage**:

```
/git-master commit these changes
/git-master rebase onto main
/git-master who wrote authentication code?
```

#### frontend-ui-ux Design Process

- **Design Process**: Purpose, Tone, Constraints, Differentiation
- **Aesthetic Direction**: Choose extreme - brutalist, maximalist, retro-futuristic, luxury, playful
- **Typography**: Distinctive fonts, avoid generic (Inter, Roboto, Arial)
- **Color**: Cohesive palettes sharp accents, avoid purple-on-white AI slop
- **Motion**: High-impact staggered reveals, scroll-triggering, surprising hover states
- **Anti-Patterns**: Generic fonts, predictable layouts, cookie-cutter design

### Browser Automation Options

Oh-My-OpenAgent provides two browser automation providers, configurable via `browser_automation_engine.provider`.

#### Option 1: Playwright MCP (Default)

```yaml
mcp:
playwright:
command: npx
args: ["@playwright/mcp@latest"]
```

**Usage**:

```
/playwright Navigate example.com take screenshot
```

#### Option 2: Agent Browser CLI (Vercel)

```json
{
"browser_automation_engine": {
"provider": "agent-browser"
}
}
```

**Requires installation**:

```bash
bun add -g agent-browser
```

**Usage**:

```
Use agent-browser navigate example.com extract main heading
```

**Capabilities (Both Providers)**:

- Navigate interact web pages
- Take screenshots PDFs
- Fill forms click elements
- Wait network requests
- Scrape content

### Custom Skill Creation (SKILL.md)

add custom skills directly `.opencode/skills/` project root `~/.claude/skills/` home directory.

**Example: `.opencode/skills/my-skill/SKILL.md`**

```markdown
---
name: my-skill
description: My special custom skill
mcp:
my-mcp:
command: npx
args: ["-y", "my-mcp-server"]
---

# My Skill Prompt

content injected into agent's system prompt.
...
```

**Skill Load Locations** (priority order, highest first):

- `.opencode/skills/*/SKILL.md` (project, OpenCode native)
- `~/.config/opencode/skills/*/SKILL.md` (user, OpenCode native)
- `.claude/skills/*/SKILL.md` (project, Claude Code compat)
- `.agents/skills/*/SKILL.md` (project, Agents convention)
- `~/.agents/skills/*/SKILL.md` (user, Agents convention)

Same-named skill at higher priority overrides lower.

Disable built- skills via `disabled_skills: ["playwright"]` config.

### Category + Skill Combo Strategies

create powerful specialized agents by combining Categories Skills.

#### Designer (UI Implementation)

- **Category**: `visual-engineering`
- **load_skills**: `["frontend-ui-ux", "playwright"]`
- **Effect**: Implements aesthetic UI verifies rendering results directly browser.

#### Architect (Design Review)

- **Category**: `ultrabrain`
- **load_skills**: `[]` (pure reasoning)
- **Effect**: Leverages GPT-5.4 xhigh reasoning -depth system architecture analysis.

#### Maintainer (Quick Fixes)

- **Category**: `quick`
- **load_skills**: `["git-master"]`
- **Effect**: cost-effective models quickly fix code generate clean commits.

### task Prompt Guide

When delegating, **clear specific** prompts essential. Include these 7 elements:

1. **TASK**: What needs done? (single objective)
2. **EXPECTED OUTCOME**: What deliverable?
3. **REQUIRED SKILLS**: skills loaded via `load_skills`?
4. **REQUIRED TOOLS**: tools must ? (whitelist)
5. **MUST **: What must done (constraints)
6. **MUST NOT **: What must never done
7. **CONTEXT**: File paths, existing patterns, reference materials

**Bad Example**:

> "Fix "

**Good Example**:

> **TASK**: Fix mobile layout breaking issue `LoginButton.tsx`
> **CONTEXT**: `src/components/LoginButton.tsx`, Tailwind CSS
> **MUST **: Change flex-direction at `md:` breakpoint
> **MUST NOT **: Modify existing desktop layout
> **EXPECTED**: Buttons align vertically on mobile

## Commands

Commands slash-triggered workflows execute predefined templates.

### Built- Commands

| Command | Description |
| -------------------- | ------------------------------------------------------------------------------------------ |
| `/init-deep` | Initialize hierarchical AGENTS.md knowledge base |
| `/ralph-loop` | Start self-referential development loop until completion |
| `/ulw-loop` | Start ultrawork loop - continues ultrawork mode |
| `/cancel-ralph` | Cancel active Ralph Loop |
| `/refactor` | Intelligent refactoring LSP, AST-grep, architecture analysis, TDD verification |
| `/start-work` | Start Sisyphus work session from Prometheus plan |
| `/stop-continuation` | Stop all continuation mechanisms (ralph loop, todo continuation, boulder) session |
| `/handoff` | Create detailed context summary continuing work new session |

### /init-deep

**Purpose**: Generate hierarchical AGENTS.md files throughout project

**Usage**:

```
/init-deep [--create-new] [--max-depth=N]
```

Creates directory-specific context files agents automatically read:

```
project/
├── AGENTS.md # Project-wide context
├── src/
│ ├── AGENTS.md # src-specific context
│ └── components/
│ └── AGENTS.md # Component-specific context
```

### /ralph-loop

**Purpose**: Self-referential development loop runs until task completion

**Named after**: Anthropic's Ralph Wiggum plugin

**Usage**:

```
/ralph-loop "Build REST API authentication"
/ralph-loop "Refactor payment module" --max-iterations=50
```

**Behavior**:

- Agent works continuously toward goal
- Detects `<promise>DONE</promise>` know when complete
- Auto-continues if agent stops without completion
- Ends when: completion detected, max iterations reached (default 100), `/cancel-ralph`

**Configure**: `{ "ralph_loop": { "enabled": true, "default_max_iterations": 100 } }`

### /ulw-loop

**Purpose**: Same as ralph-loop but ultrawork mode active

Everything runs at maximum intensity - parallel agents, background tasks, aggressive exploration.

### /refactor

**Purpose**: Intelligent refactoring full toolchain

**Usage**:

```
/refactor <target> [--scope=<file|module|project>] [--strategy=<safe|aggressive>]
```

**Features**:

- LSP-powered rename navigation
- AST-grep pattern matching
- Architecture analysis before changes
- TDD verification after changes
- Codemap generation

### /start-work

**Purpose**: Start execution from Prometheus-generated plan

**Usage**:

```
/start-work [plan-name]
```

atlas agent execute planned tasks systematically.

### /stop-continuation

**Purpose**: Stop all continuation mechanisms session

Stops ralph loop, todo continuation, boulder state. Use when want agent stop its current multi-step workflow.

### /handoff

**Purpose**: Create detailed context summary continuing work new session

Generates structured handoff document capturing current state, what done, what remains, relevant file paths — enabling seamless continuation fresh session.

### Custom Commands

Load custom commands from:

- `.opencode/command/*.md` (project, OpenCode native)
- `~/.config/opencode/command/*.md` (user, OpenCode native)
- `.claude/commands/*.md` (project, Claude Code compat)
- `~/.config/opencode/commands/*.md` (user, Claude Code compat)

## Tools

### Code Search Tools

| Tool | Description |
| -------- | ----------------------------------------------------------------- |
| **grep** | Content search regular expressions. Filter by file pattern. |
| **glob** | Fast file pattern matching. Find files by name patterns. |

### Edit Tools

| Tool | Description |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **edit** | Hash-anchored edit tool. Uses `LINE#ID` format precise, safe modifications. Validates content hashes before applying changes — zero stale-line errors. |

### LSP Tools (IDE Features Agents)

| Tool | Description |
| ----------------------- | ------------------------------------------- |
| **lsp_diagnostics** | Get errors/warnings before build |
| **lsp_prepare_rename** | Validate rename operation |
| **lsp_rename** | Rename symbol across workspace |
| **lsp_goto_definition** | Jump symbol definition |
| **lsp_find_references** | Find all usages across workspace |
| **lsp_symbols** | Get file outline workspace symbol search |

### AST-Grep Tools

| Tool | Description |
| -------------------- | -------------------------------------------- |
| **ast_grep_search** | AST-aware code pattern search (25 languages) |
| **ast_grep_replace** | AST-aware code replacement |

### Delegation Tools

| Tool | Description |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **call_omo_agent** | Spawn explore/librarian agents. Supports `run_in_background`. |
| **task** | Category-based task delegation. Supports built- categories like `visual-engineering`, `ultrabrain`, `deep`, `artistry`, `quick`, `unspecified-low`, `unspecified-high`, `writing`, direct agent targeting via `subagent_type`. |
| **background_output** | Retrieve background task results |
| **background_cancel** | Cancel running background tasks |

### Visual Analysis Tools

| Tool | Description |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **look_at** | Analyze media files (PDFs, images, diagrams) via Multimodal-Looker agent. Extracts specific information summaries from documents, describes visual content. |

### Skill Tools

| Tool | Description |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| **skill** | Load execute skill slash command by name. Returns detailed instructions context applied. |
| **skill_mcp** | Invoke MCP server operations from skill-embedded MCPs. |

### Session Tools

| Tool | Description |
| ------------------ | ---------------------------------------- |
| **session_list** | List all OpenCode sessions |
| **session_read** | Read messages history from session |
| **session_search** | Full-text search across session messages |
| **session_info** | Get session metadata statistics |

### Task Management Tools

Requires `experimental.task_system: true` config.

| Tool | Description |
| --------------- | ---------------------------------------- |
| **task_create** | Create new task auto-generated ID |
| **task_get** | Retrieve task by ID |
| **task_list** | List all active tasks |
| **task_update** | Update existing task |

#### Task System Details

**Note on Claude Code Alignment**: implementation follows Claude Code's internal Task tool signatures (`TaskCreate`, `TaskUpdate`, `TaskList`, `TaskGet`) field naming conventions (`subject`, `blockedBy`, `blocks`, etc.). , Anthropic not published official documentation these tools. Oh My OpenAgent's own implementation based on observed Claude Code behavior internal specifications.

**Task Schema**:

```ts
interface Task {
id: string; // T-{uuid}
subject: string; // Imperative: "Run tests"
description: string;
status: "pending" | "in_progress" | "completed" | "deleted";
activeForm?: string; // Present continuous: "Running tests"
blocks: string[]; // Tasks blocks
blockedBy: string[]; // Tasks blocking
owner?: string; // Agent name
metadata?: Record<string, unknown>;
threadID: string; // Session ID (auto-set)
}
```

**Dependencies Parallel Execution**:

```
[Build Frontend] ──┐
├──→ [Integration Tests] ──→ [Deploy]
[Build Backend] ──┘
```

- Tasks empty `blockedBy` run parallel
- Dependent tasks wait until blockers complete

**Example Workflow**:

```ts
TaskCreate({ subject: "Build frontend" }); // T-001
TaskCreate({ subject: "Build backend" }); // T-002
TaskCreate({ subject: "Run integration tests", blockedBy: ["T-001", "T-002"] }); // T-003

TaskList();
// T-001 [pending] Build frontend blockedBy: []
// T-002 [pending] Build backend blockedBy: []
// T-003 [pending] Integration tests blockedBy: [T-001, T-002]

TaskUpdate({ id: "T-001", status: "completed" });
TaskUpdate({ id: "T-002", status: "completed" });
// T-003 now unblocked
```

**Storage**: Tasks stored as JSON files `.sisyphus/tasks/`.

**Difference from TodoWrite**:

| Feature | TodoWrite | Task System |
| ------------------ | -------------- | -------------------------- |
| Storage | Session memory | File system |
| Persistence | Lost on close | Survives restart |
| Dependencies | None | Full support (`blockedBy`) |
| Parallel execution | Manual | Automatic optimization |

**When Use**: Use Tasks when work multiple steps dependencies, multiple subagents collaborate, progress persist across sessions.

### Interactive Terminal Tools

| Tool | Description |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| **interactive_bash** | Tmux-based terminal TUI apps (vim, htop, pudb). Pass tmux subcommands directly without prefix. |

**Usage Examples**:

```bash
# Create new session
interactive_bash(tmux_command="new-session -d -s dev-app")

# Send keystrokes session
interactive_bash(tmux_command="send-keys -t dev-app 'vim main.py' Enter")

# Capture pane output
interactive_bash(tmux_command="capture-pane -p -t dev-app")
```

**Key Points**:

- Commands tmux subcommands (no `tmux` prefix)
- Use interactive apps need persistent sessions
- One-shot commands use regular `Bash` tool `&`

## Hooks

Hooks intercept modify behavior at key points agent lifecycle across full session, message, tool, parameter pipeline.

### Hook Events

| Event | When | Can |
| --------------- | ----------------------------- | -------------------------------------------------- |
| **PreToolUse** | Before tool execution | Block, modify input, inject context |
| **PostToolUse** | After tool execution | Add warnings, modify output, inject messages |
| **Message** | During message processing | Transform content, detect keywords, activate modes |
| **Event** | On session lifecycle changes | Recovery, fallback, notifications |
| **Transform** | During context transformation | Inject context, validate blocks |
| **Params** | When setting API parameters | Adjust model settings, effort level |

### Built- Hooks

#### Context & Injection

| Hook | Event | Description |
| ------------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **directory-agents-injector** | PreToolUse + PostToolUse | Auto-injects AGENTS.md when reading files. Walks from file project root, collecting all AGENTS.md files. Deprecated OpenCode 1.1.37+ — Auto-disabled when native AGENTS.md injection available. |
| **directory-readme-injector** | PreToolUse + PostToolUse | Auto-injects README.md directory context. |
| **rules-injector** | PreToolUse + PostToolUse | Injects rules from `.claude/rules/` when conditions match. Supports globs alwaysApply. |
| **compaction-context-injector** | Event | Preserves critical context during session compaction. |
| **context-window-monitor** | Event | Monitors context window usage tracks token consumption. |
| **preemptive-compaction** | Event | Proactively compacts sessions before hitting token limits. |

#### Productivity & Control

| Hook | Event | Description |
| --------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **keyword-detector** | Message + Transform | Detects keywords activates modes: `ultrawork`/`ulw` (max performance), `search`/`find` (parallel exploration), `analyze`/`investigate` (deep analysis). |
| **think-mode** | Params | Auto-detects extended thinking needs. Catches "think deeply", "ultrathink" adjusts model settings. |
| **ralph-loop** | Event + Message | Manages self-referential loop continuation. |
| **start-work** | Message | Handles /start-work command execution. |
| **auto-slash-command** | Message | Automatically executes slash commands from prompts. |
| **stop-continuation-guard** | Event + Message | Guards stop-continuation mechanism. |
| **category-skill-reminder** | Event + PostToolUse | Reminds agents about available category skills delegation. |
| **anthropic-effort** | Params | Adjusts Anthropic API effort level based on context. |

#### Quality & Safety

| Hook | Event | Description |
| ------------------------------- | ------------------------ | ----------------------------------------------------------------------------------------- |
| **comment-checker** | PostToolUse | Reminds agents reduce excessive comments. Smartly ignores BDD, directives, docstrings. |
| **thinking-block-validator** | Transform | Validates thinking blocks prevent API errors. |
| **edit-error-recovery** | PostToolUse + Event | Recovers from edit tool failures. |
| **write-existing-file-guard** | PreToolUse | Prevents accidental overwrites existing files without reading them first. |
| **hashline-read-enhancer** | PostToolUse | Enhances read output hash-anchored line markers hashline edit tool. |
| **hashline-edit-diff-enhancer** | PreToolUse + PostToolUse | Enhances edit operations diff markers hashline edit tool. |

#### Recovery & Stability

| Hook | Event | Description |
| ------------------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **session-recovery** | Event | Recovers from session errors — missing tool results, thinking block issues, empty messages. |
| **anthropic-context-window-limit-recovery** | Event | Handles Claude context window limits gracefully. |
| **runtime-fallback** | Event + Message | Automatically switches backup models on retryable API errors (e.g., 429, 503, 529), provider key misconfiguration errors (e.g., missing API key), auto-retry signals (when `timeout_seconds > 0`). Configurable retry logic per-model cooldown. |
| **model-fallback** | Event + Message | Manages model fallback chain when primary model unavailable. |
| **json-error-recovery** | PostToolUse | Recovers from JSON parse errors tool outputs. |

#### Truncation & Context Management

| Hook | Event | Description |
| ------------------------- | ----------- | --------------------------------------------------------------------------------------------------- |
| **tool-output-truncator** | PostToolUse | Truncates output from Grep, Glob, LSP, AST-grep tools. Dynamically adjusts based on context window. |

#### Notifications & UX

| Hook | Event | Description |
| ---------------------------- | ------------------- | -------------------------------------------------------------------------------------------------- |
| **auto-update-checker** | Event | Checks new versions on session creation, shows startup toast version Sisyphus status. |
| **background-notification** | Event | Notifies when background agent tasks complete. |
| **session-notification** | Event | OS notifications when agents go idle. Works on macOS, Linux, Windows. |
| **agent-usage-reminder** | PostToolUse + Event | Reminds leverage specialized agents better results. |
| **question-label-truncator** | PreToolUse | Truncates long question labels Question tool UI. |

#### Task Management

| Hook | Event | Description |
| -------------------------------- | ------------------- | --------------------------------------------------- |
| **task-resume-info** | PostToolUse | Provides task resume information continuity. |
| **delegate-task-retry** | PostToolUse + Event | Retries failed task delegation calls. |
| **empty-task-response-detector** | PostToolUse | Detects empty responses from delegated tasks. |
| **tasks-todowrite-disabler** | PreToolUse | Disables TodoWrite tool when task system active. |

#### Continuation

| Hook | Event | Description |
| ------------------------------ | ----- | ---------------------------------------------------------- |
| **todo-continuation-enforcer** | Event | Enforces todo completion — yanks idle agents back work. |
| **compaction-todo-preserver** | Event | Preserves todo state during session compaction. |
| **unstable-agent-babysitter** | Event | Handles unstable agent behavior recovery strategies. |

#### Integration

| Hook | Event | Description |
| ---------------------------- | ------------------- | ------------------------------------------------------- |
| **claude-code-hooks** | All | Executes hooks from Claude Code's settings.json. |
| **atlas** | Multiple | Main orchestration logic todo-driven work sessions. |
| **interactive-bash-session** | PostToolUse + Event | Manages tmux sessions interactive CLI. |
| **non-interactive-env** | PreToolUse | Handles non-interactive environment constraints. |

#### Specialized

| Hook | Event | Description |
| --------------------------- | ---------- | ---------------------------------------------------------- |
| **prometheus-md-only** | PreToolUse | Enforces markdown-only output Prometheus planner. |
| **no-sisyphus-gpt** | Message | Prevents Sisyphus from running on incompatible GPT models. |
| **no-hephaestus-non-gpt** | Message | Prevents Hephaestus from running on non-GPT models. |
| **sisyphus-junior-notepad** | PreToolUse | Manages notepad state Sisyphus-Junior agents. |

### Claude Code Hooks Integration

Run custom scripts via Claude Code's `settings.json`:

```json
{
"hooks": {
"PostToolUse": [
{
"matcher": "Write|Edit",
"hooks": [{ "type": "command", "command": "eslint --fix $FILE" }]
}
]
}
}
```

**Hook locations**:

- `~/.claude/settings.json` (user)
- `./.claude/settings.json` (project)
- `./.claude/settings.local.json` (local, git-ignored)

### Disabling Hooks

Disable specific hooks config:

```json
{
"disabled_hooks": ["comment-checker"]
}
```

## MCPs

### Built- MCPs

| MCP | Description |
| ------------- | --------------------------------------------------------------------------------------------- |
| **websearch** | Real-time web search powered by Exa AI |
| **context7** | Official documentation lookup any library/framework |
| **grep_app** | Ultra-fast code search across public GitHub repos. Great finding implementation examples. |

### Skill-Embedded MCPs

Skills bring their own MCP servers:

```yaml
---
description: Browser automation skill
mcp:
playwright:
command: npx
args: ["-y", "@anthropic-ai/mcp-playwright"]
---
```

`skill_mcp` tool invokes these operations full schema discovery.

#### OAuth-Enabled MCPs

Skills define OAuth-protected remote MCP servers. OAuth 2.1 full RFC compliance (RFC 9728, 8414, 8707, 7591) supported:

```yaml
---
description: My API skill
mcp:
my-api:
url: https://api.example.com/mcp
oauth:
clientId: ${CLIENT_ID}
scopes: ["read", "write"]
---
```

When skill MCP `oauth` configured:

- **Auto-discovery**: Fetches `/.well-known/oauth-protected-resource` (RFC 9728), falls back `/.well-known/oauth-authorization-server` (RFC 8414)
- **Dynamic Client Registration**: Auto-registers servers supporting RFC 7591 (clientId becomes optional)
- **PKCE**: Mandatory all flows
- **Resource Indicators**: Auto-generated from MCP URL per RFC 8707
- **Token Storage**: Persisted `~/.config/opencode/mcp-oauth.json` (chmod 0600)
- **Auto-refresh**: Tokens refresh on 401; step-up authorization on 403 `WWW-Authenticate`
- **Dynamic Port**: OAuth callback server auto-discovered available port

Pre-authenticate via CLI:

```bash
bunx oh-my-opencode mcp oauth login <server-name> --server-url https://api.example.com
```

## Model Capabilities

Model capabilities models.dev-backed, refreshable cache compatibility diagnostics. system combines bundled models.dev snapshot data, optional refreshed cache data, provider runtime metadata, heuristics when exact metadata unavailable.

### Refreshing Capabilities

Update local cache latest model information:

```bash
bunx oh-my-opencode refresh-model-capabilities
```

Configure automatic refresh at startup:

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

### Capability Diagnostics

Run `bunx oh-my-opencode doctor` see capability diagnostics including:
- effective model resolution agents categories
- warnings when configured models rely on compatibility fallback
- override compatibility details alongside model resolution output

## Context Injection

### Directory AGENTS.md

Auto-injects AGENTS.md when reading files. Walks from file directory project root:

```
project/
├── AGENTS.md # Injected first
├── src/
│ ├── AGENTS.md # Injected second
│ └── components/
│ ├── AGENTS.md # Injected third
│ └── Button.tsx # Reading injects all 3
```

### Conditional Rules

Inject rules from `.claude/rules/` when conditions match:

```markdown
---
globs: ["*.ts", "src/**/*.js"]
description: "TypeScript/JavaScript coding rules"
---

- Use PascalCase interface names
- Use camelCase function names
```

Supports:

- `.md` `.mdc` files
- `globs` field pattern matching
- `alwaysApply: true` unconditional rules
- Walks upward from file project root, plus `~/.claude/rules/`

## Claude Code Compatibility

Full compatibility layer Claude Code configurations.

### Config Loaders

| Type | Locations |
| ------------ | ---------------------------------------------------------------------------------- |
| **Commands** | `~/.config/opencode/commands/`, `.claude/commands/` |
| **Skills** | `~/.config/opencode/skills/*/SKILL.md`, `.claude/skills/*/SKILL.md` |
| **Agents** | `~/.config/opencode/agents/*.md`, `.claude/agents/*.md` |
| **MCPs** | `~/.claude.json`, `~/.config/opencode/.mcp.json`, `.mcp.json`, `.claude/.mcp.json` |

MCP configs support environment variable expansion: `${VAR}`.

### Compatibility Toggles

Disable specific features:

```json
{
"claude_code": {
"mcp": false,
"commands": false,
"skills": false,
"agents": false,
"hooks": false,
"plugins": false
}
}
```

| Toggle | Disables |
| ---------- | ------------------------------------------------------------ |
| `mcp` | `.mcp.json` files (keeps built- MCPs) |
| `commands` | Command loading from Claude Code paths |
| `skills` | Skill loading from Claude Code paths |
| `agents` | Agent loading from Claude Code paths (keeps built- agents) |
| `hooks` | settings.json hooks |
| `plugins` | Claude Code marketplace plugins |

Disable specific plugins:

```json
{
"claude_code": {
"plugins_override": {
"claude-mem@thedotmack": false
}
}
}
```

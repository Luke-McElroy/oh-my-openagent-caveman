# What Is Oh My OpenAgent?

Oh My OpenAgent is multi-model agent orchestration harness for OpenCode. It transforms single AI agent into coordinated development team that ships code.

Not locked to Claude. Not locked to OpenAI. Not locked to anyone.

Better results, cheaper models, real orchestration.

---

## Quick Start

### Installation

Paste this into your LLM agent session:

```
Install and configure oh-my-openagent by following instructions here:
https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/refs/heads/dev/docs/guide/installation.md
```

Or read full [Installation Guide](./installation.md) for manual setup, provider authentication, and troubleshooting.

### Your First Task

Once installed, type:

```
ultrawork
```

That's it. Agent figures everything out — explores your codebase, researches patterns, implements feature, verifies with diagnostics. Keeps working until done.

Want more control? Press **Tab** to enter [Prometheus mode](./orchestration.md) for interview-based planning, then run `/start-work` for full orchestration.

---

## Philosophy: Breaking Free

We used to call this "Claude Code on steroids." That was wrong.

This isn't about making Claude Code better. It's about breaking free from idea that one model, one provider, one way of working is enough. Anthropic wants you locked in. OpenAI wants you locked in. Everyone wants you locked in.

Oh My OpenAgent doesn't play that game. It orchestrates across models, picking right brain for right job. Claude for orchestration. GPT for deep reasoning. Gemini for frontend. GPT-5.4 Mini for quick tasks. All working together, automatically.

---

## How It Works: Agent Orchestration

Instead of one agent doing everything, Oh My OpenAgent uses **specialized agents delegating to each other** based on task type.

**Architecture:**

```
User Request
↓
[Intent Gate] — Classifies what you actually want
↓
[Sisyphus] — Main orchestrator, plans and delegates
↓
├─→ [Prometheus] — Strategic planning (interview mode)
├─→ [Atlas] — Todo orchestration and execution
├─→ [Oracle] — Architecture consultation
├─→ [Librarian] — Documentation/code search
├─→ [Explore] — Fast codebase grep
└─→ [Category-based agents] — Specialized by task type
```

When Sisyphus delegates to subagent, it doesn't pick model name. It picks **category** — `visual-engineering`, `ultrabrain`, `deep`, `artistry`, `quick`, `unspecified-low`, `unspecified-high`, `writing`. Category automatically maps to right model. You touch nothing.

For deep dive into how agents collaborate, see [Orchestration System Guide](./orchestration.md).

---

## Meet Agents

### Sisyphus: Discipline Agent

Named after Greek myth. He rolls boulder every day. Never stops. Never gives up.

Sisyphus is your main orchestrator. He plans, delegates to specialists, and drives tasks to completion with aggressive parallel execution. He doesn't stop halfway. He doesn't get distracted. He finishes.

**Recommended models:**

- **Claude Opus 4.7** — Best overall experience. Sisyphus was built with Claude-optimized prompts.
- **Kimi K2.5** — Great Claude-like alternative. Many users run this combo exclusively.
- **GLM 5** — Solid option, especially via Z.ai.

Sisyphus works best on Claude Opus 4.7, Kimi K2.5, and GLM 5. GPT-5.4 now has dedicated prompt path, but older GPT models are still poor fit and should route to Hephaestus instead.

### Hephaestus: Legitimate Craftsman

Named with intentional irony. Anthropic blocked OpenCode from using their API because of this project. So team built autonomous GPT-native agent instead.

Hephaestus runs on GPT-5.4. Give him goal, not recipe. He explores codebase, researches patterns, and executes end-to-end without hand-holding. He is legitimate craftsman because he was born from necessity, not privilege.

Use Hephaestus when you need deep architectural reasoning, complex debugging across many files, or cross-domain knowledge synthesis. Switch to him explicitly when work demands GPT-5.4's particular strengths.

**Why this beats vanilla Codex CLI:**

- **Multi-model orchestration.** Pure Codex is single-model. OmO routes different tasks to different models automatically. GPT for deep reasoning. Gemini for frontend. GPT-5.4 Mini for speed. Right brain for right job.
- **Background agents.** Fire 5+ agents in parallel. Something Codex cannot do. While one agent writes code, another researches patterns, another checks documentation. Like real dev team.
- **Category system.** Tasks are routed by intent, not model name. `visual-engineering` gets Gemini. `ultrabrain` gets GPT-5.4 xhigh. `deep` gets GPT-5.4. `artistry` gets Gemini. `quick` gets GPT-5.4 Mini. `unspecified-low` gets fast cheap models. `unspecified-high` gets Claude Opus. `writing` gets prose-optimized models. No manual juggling.
- **Accumulated wisdom.** Subagents learn from previous results. Conventions discovered in task 1 are passed to task 5. Mistakes made early aren't repeated. System gets smarter as it works.

### Prometheus: Strategic Planner

Prometheus interviews you like real engineer. Asks clarifying questions. Identifies scope and ambiguities. Builds detailed plan before single line of code is touched.

Press **Tab** to enter Prometheus mode, or type `@plan "your task"` from Sisyphus.

### Atlas: Conductor

Atlas executes Prometheus plans. Distributes tasks to specialized subagents. Accumulates learnings across tasks. Verifies completion independently.

Run `/start-work` to activate Atlas on your latest plan.

### Oracle: Consultant

Read-only high-IQ consultant for architecture decisions and complex debugging. Consult Oracle when facing unfamiliar patterns, security concerns, or multi-system tradeoffs.

### Supporting Cast

- **Metis** — Gap analyzer. Catches what Prometheus missed before plans are finalized.
- **Momus** — Ruthless reviewer. Validates plans against clarity, verification, and context criteria.
- **Explore** — Fast codebase grep. Uses speed-focused models for pattern discovery.
- **Librarian** — Documentation and OSS code search. Stays current on library APIs and best practices.
- **Multimodal Looker** — Vision and screenshot analysis.

---

## Working Modes

### Ultrawork Mode: For Lazy

Type `ultrawork` or `ulw`. That's it.

Agent figures everything out. Explores your codebase. Researches patterns. Implements feature. Verifies with diagnostics. Keeps working until done.

This is "do it" mode. Full automatic. You don't have to think deep because agent thinks deep for you.

### Prometheus Mode: For Precise

Press **Tab** to enter Prometheus mode.

Prometheus interviews you like real engineer. Asks clarifying questions. Identifies scope and ambiguities. Builds detailed plan before single line of code is touched.

Then run `/start-work` and Atlas takes over. Tasks are distributed to specialized subagents. Each completion is verified independently. Learnings accumulate across tasks. Progress tracks across sessions.

Use Prometheus for multi-day projects, critical production changes, complex refactoring, or when you want documented decision trail.

---

## Agent Model Matching

Different agents work best with different models. Oh My OpenAgent automatically assigns optimal models, but you can customize everything.

### Default Configuration

Models are auto-configured at install time. Interactive installer asks which providers you have, then generates optimal model assignments for each agent and category.

At runtime, fallback chains ensure work continues even if your preferred provider is down. Each agent has provider priority chain. System tries providers in order until it finds available model.

### Custom Model Configuration

You can override specific agents or categories in your config:

```jsonc
{
"$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/dev/assets/oh-my-openagent.schema.json",

"agents": {
// Main orchestrator: Claude Opus or Kimi K2.5 work best
"sisyphus": {
"model": "kimi-for-coding/k2p5",
"ultrawork": { "model": "anthropic/claude-opus-4-7", "variant": "max" },
},

// Research agents: cheaper models are fine
"librarian": { "model": "google/gemini-3-flash" },
"explore": { "model": "github-copilot/grok-code-fast-1" },

// Architecture consultation: GPT or Claude Opus
"oracle": { "model": "openai/gpt-5.4", "variant": "high" },
},

"categories": {
// Frontend/UI work: Gemini dominates visual tasks
"visual-engineering": {
"model": "google/gemini-3.1-pro",
"variant": "high",
},

// Hard logic and architecture: GPT-5.4 xhigh
"ultrabrain": { "model": "openai/gpt-5.4", "variant": "xhigh" },

// Autonomous research and execution
"deep": { "model": "openai/gpt-5.4", "variant": "high" },

// Creative and design work
"artistry": { "model": "google/gemini-3.1-pro", "variant": "high" },

// Quick tasks: fast and cheap
"quick": { "model": "openai/gpt-5.4-mini" },

// Low-effort fallback: cheapest available
"unspecified-low": { "model": "openai/gpt-5.4-mini" },

// High-effort fallback: best available
"unspecified-high": { "model": "anthropic/claude-opus-4-7", "variant": "max" },

// Prose and documentation
"writing": { "model": "anthropic/claude-opus-4-7", "variant": "high" },
},
}
```

### Model Families

**Claude-like models** (instruction-following, structured output):

- Claude Opus 4.7, Claude Haiku 4.5
- Kimi K2.5 — behaves very similarly to Claude
- GLM 5 — Claude-like behavior, good for broad tasks

**GPT models** (explicit reasoning, principle-driven):

- GPT-5.4 — deep coding powerhouse, required for Hephaestus and default for Oracle
- GPT-5.4 Mini — fast and cheap utility tasks

**Different-behavior models**:

- Gemini 3.1 Pro — excels at visual/frontend tasks
- MiniMax M2.7 / M2.7-highspeed — fast and smart for utility tasks
- Grok Code Fast 1 — optimized for code grep/search

See [Agent-Model Matching Guide](./agent-model-matching.md) for complete details on which models work best for each agent, safe vs dangerous overrides, and provider priority chains.

---

## Why It's Better Than Pure Claude Code

Claude Code is good. But it's single agent running single model doing everything alone.

Oh My OpenAgent turns that into coordinated team:

**Parallel execution.** Claude Code processes one thing at time. OmO fires background agents in parallel — research, implementation, and verification happening simultaneously. Like having 5 engineers instead of 1.

**Hash-anchored edits.** Claude Code's edit tool fails when model can't reproduce lines exactly. OmO's `LINE#ID` content hashing validates every edit before applying. Grok Code Fast 1 went from 6.7% to 68.3% success rate from this change.

**Intent Gate.** Claude Code takes your prompt and runs. OmO classifies your true intent first — research, implementation, investigation, fix — then routes accordingly. Fewer misinterpretations, better results.

**LSP + AST tools.** Workspace-level rename, go-to-definition, find-references, pre-build diagnostics, AST-aware code rewrites. IDE precision vanilla Claude Code doesn't have.

**Skills with embedded MCPs.** Each skill brings its own MCP servers, scoped to task. Context window stays clean instead of bloating with every tool.

**Discipline enforcement.** Todo enforcer yanks idle agents back to work. Comment checker strips AI slop. Ralph Loop keeps going until 100% done. System doesn't let agent slack off.

**Fundamental advantage.** Models have different temperaments. Claude thinks deeply. GPT reasons architecturally. Gemini visualizes. Haiku moves fast. Single-model tools force you to pick one personality for all tasks. Oh My OpenAgent leverages them all, routing by task type. This isn't temporary hack — it's only architecture making sense as models specialize further. Gap between multi-model orchestration and single-model limitation widens every month. We're betting on that future.

---

## Intent Gate

Before acting on any request, Sisyphus classifies your true intent.

Are you asking for research? Implementation? Investigation? Fix? Intent Gate figures out what you actually want, not literal words you typed. This means agent understands context, nuance, and real goal behind your request.

Claude Code doesn't have this. It takes your prompt and runs. Oh My OpenAgent thinks first, then acts.

---

## What's Next

- **[Installation Guide](./installation.md)** — Complete setup instructions, provider authentication, and troubleshooting
- **[Orchestration Guide](./orchestration.md)** — Deep dive into agent collaboration, planning with Prometheus, and execution with Atlas
- **[Agent-Model Matching Guide](./agent-model-matching.md)** — Which models work best for each agent and how to customize
- **[Configuration Reference](../reference/configuration.md)** — Full config options with examples
- **[Features Reference](../reference/features.md)** — Complete feature documentation
- **[Manifesto](../manifesto.md)** — Philosophy behind project

---

**Ready to start?** Type `ultrawork` and see what coordinated AI team can do.

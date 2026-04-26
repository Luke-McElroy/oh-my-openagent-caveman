# Agent-Model Matching Guide

> **For agents and users**: Why each agent needs specific model — and how to customize without breaking things.

## Core Insight: Models Are Developers

Think of AI models as developers on team. Each has different brain, different personality, different strengths. **Model isn't "smarter" or "dumber." It thinks differently.** Give same instruction to Claude and GPT, they'll interpret in fundamentally different ways.

This isn't bug. It's foundation of entire system.

Oh My OpenAgent assigns each agent model matching its _working style_ — like building team where each person is in role fitting their personality.

### Sisyphus: Sociable Lead

Sisyphus is developer who knows everyone, goes everywhere, gets things done through communication and coordination. Talks to other agents, understands context across whole codebase, delegates work intelligently, codes well too. Deep, purely technical problems? He'll struggle bit.

**This is why Sisyphus uses Claude / Kimi / GLM.** These models excel at:

- Following complex, multi-step instructions (Sisyphus's prompt is ~1,100 lines)
- Maintaining conversation flow across many tool calls
- Understanding nuanced delegation and orchestration patterns
- Producing well-structured, communicative output

Using Sisyphus with older GPT models would be like taking best project manager — one who coordinates everyone, runs standups, keeps whole team aligned — and sticking them in room alone to debug race condition. Wrong fit. GPT-5.4 now has dedicated Sisyphus prompt path, but GPT is still not default recommendation for orchestrator.

### Hephaestus: Deep Specialist

Hephaestus is developer who stays in room coding all day. Doesn't talk much. Might seem socially awkward. Give them hard technical problem and they'll emerge three hours later with solution nobody else could have found.

**This is why Hephaestus uses GPT-5.4.** GPT-5.4 is built for exactly this:

- Deep, autonomous exploration without hand-holding
- Multi-file reasoning across complex codebases
- Principle-driven execution (give goal, not recipe)
- Working independently for extended periods

Using Hephaestus with GLM or Kimi would be like assigning most communicative, sociable developer to sit alone and do nothing but deep technical work. They'd get it done eventually, but wouldn't shine — you'd be wasting exactly skills making them valuable.

### Takeaway

Every agent's prompt is tuned to match its model's personality. **When you change model, you change brain — and same instructions get understood completely differently.** Model matching isn't about "better" or "worse." It's about fit.

---

## How Claude and GPT Think Differently

This matters for understanding why some agents support both model families while others don't.

**Claude** responds to **mechanics-driven** prompts — detailed checklists, templates, step-by-step procedures. More rules = more compliance. You can write 1,100-line prompt with nested workflows and Claude will follow every step.

**GPT** (especially 5.2+) responds to **principle-driven** prompts — concise principles, XML structure, explicit decision criteria. More rules = more contradiction surface = more drift. GPT works best when you state goal and let it figure out mechanics.

Real example: Prometheus's Claude prompt is ~1,100 lines across 7 files. GPT prompt achieves same behavior with 3 principles in ~121 lines. Same outcome, completely different approach.

Agents supporting both families (Prometheus, Atlas) auto-detect your model at runtime and switch prompts via `isGptModel()`. You don't have to think about it.

---

## Agent Profiles

### Communicators → Claude / Kimi / GLM

These agents have Claude-optimized prompts — long, detailed, mechanics-driven. They need models that reliably follow complex, multi-layered instructions.

| Agent        | Role              | Fallback Chain                         | Notes                                                                                             |
| ------------ | ----------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Sisyphus** | Main orchestrator | anthropic\|github-copilot\|opencode\|vercel/claude-opus-4-7 (max) → opencode-go\|vercel/kimi-k2.5 → kimi-for-coding/k2p5 → opencode\|moonshotai\|moonshotai-cn\|firmware\|ollama-cloud\|aihubmix\|vercel/kimi-k2.5 → openai\|github-copilot\|opencode\|vercel/gpt-5.4 (medium) → zai-coding-plan\|opencode\|vercel/glm-5 → opencode/big-pickle | Exact runtime chain from `src/shared/model-requirements.ts`. |
| **Metis**    | Plan gap analyzer | anthropic\|github-copilot\|opencode\|vercel/claude-opus-4-7 (max) → openai\|github-copilot\|opencode\|vercel/gpt-5.4 (high) → opencode-go\|vercel/glm-5 → kimi-for-coding/k2p5 | Exact runtime chain from `src/shared/model-requirements.ts`. |

### Dual-Prompt Agents → Claude preferred, GPT supported

These agents ship separate prompts for Claude and GPT families. They auto-detect your model and switch at runtime.

| Agent          | Role              | Fallback Chain                         | Notes                                                                |
| -------------- | ----------------- | -------------------------------------- | -------------------------------------------------------------------- |
| **Prometheus** | Strategic planner | anthropic\|github-copilot\|opencode\|vercel/claude-opus-4-7 (max) → openai\|github-copilot\|opencode\|vercel/gpt-5.4 (high) → opencode-go\|vercel/glm-5 → google\|github-copilot\|opencode\|vercel/gemini-3.1-pro | Exact runtime chain from `src/shared/model-requirements.ts`. |
| **Atlas**      | Todo orchestrator | anthropic\|github-copilot\|opencode\|vercel/claude-sonnet-4-6 → opencode-go\|vercel/kimi-k2.5 → openai\|github-copilot\|opencode\|vercel/gpt-5.4 (medium) → opencode-go\|vercel/minimax-m2.7 | Exact runtime chain from `src/shared/model-requirements.ts`. |

### Deep Specialists → GPT

These agents are built for GPT's principle-driven style. Their prompts assume autonomous, goal-oriented execution. Don't override to Claude.

| Agent          | Role                    | Fallback Chain                         | Notes                                            |
| -------------- | ----------------------- | -------------------------------------- | ------------------------------------------------ |
| **Hephaestus** | Autonomous deep worker  | openai\|github-copilot\|venice\|opencode\|vercel/gpt-5.4 (medium) | Single-entry chain. Requires one of those providers. |
| **Oracle**     | Architecture consultant | openai\|github-copilot\|opencode\|vercel/gpt-5.4 (high) → google\|github-copilot\|opencode\|vercel/gemini-3.1-pro (high) → anthropic\|github-copilot\|opencode\|vercel/claude-opus-4-7 (max) → opencode-go\|vercel/glm-5 | Exact runtime chain from `src/shared/model-requirements.ts`. |
| **Momus**      | Ruthless reviewer       | openai\|github-copilot\|opencode\|vercel/gpt-5.4 (xhigh) → anthropic\|github-copilot\|opencode\|vercel/claude-opus-4-7 (max) → google\|github-copilot\|opencode\|vercel/gemini-3.1-pro (high) → opencode-go\|vercel/glm-5 | Exact runtime chain from `src/shared/model-requirements.ts`. |

### Utility Runners → Speed over Intelligence

These agents do grep, search, and retrieval. They intentionally use fastest, cheapest models available. **Don't "upgrade" them to Opus** — that's hiring senior engineer to file paperwork.

| Agent                 | Role               | Fallback Chain                                 | Notes                                                 |
| --------------------- | ------------------ | ---------------------------------------------- | ----------------------------------------------------- |
| **Explore**           | Fast codebase grep | openai/gpt-5.4-mini-fast → opencode-go\|vercel/minimax-m2.7-highspeed → opencode-go\|vercel/minimax-m2.7 → anthropic\|opencode\|vercel/claude-haiku-4-5 → openai\|opencode\|vercel/gpt-5.4-nano | Exact runtime chain from `src/shared/model-requirements.ts`. |
| **Librarian**         | Docs/code search   | openai/gpt-5.4-mini-fast → opencode-go\|vercel/minimax-m2.7-highspeed → opencode-go\|vercel/minimax-m2.7 → anthropic\|opencode\|vercel/claude-haiku-4-5 → openai\|opencode\|vercel/gpt-5.4-nano | Exact runtime chain from `src/shared/model-requirements.ts`. |
| **Multimodal Looker** | Vision/screenshots | openai\|opencode\|vercel/gpt-5.4 (medium) → opencode-go\|vercel/kimi-k2.5 → zai-coding-plan\|vercel/glm-4.6v → openai\|github-copilot\|opencode\|vercel/gpt-5-nano | Exact runtime chain from `src/shared/model-requirements.ts`. |
| **Sisyphus-Junior**   | Category executor  | anthropic\|github-copilot\|opencode\|vercel/claude-sonnet-4-6 → opencode-go\|vercel/kimi-k2.5 → openai\|github-copilot\|opencode\|vercel/gpt-5.4 (medium) → opencode-go\|vercel/minimax-m2.7 → opencode/big-pickle | Exact runtime chain from `src/shared/model-requirements.ts`. |

---

## Model Families

### Claude Family

Communicative, instruction-following, structured output. Best for agents needing to follow complex multi-step prompts.

| Model                 | Strengths                                                                    |
| --------------------- | ---------------------------------------------------------------------------- |
| **Claude Opus 4.7**   | Best overall. Highest compliance with complex prompts. Default for Sisyphus. |
| **Claude Sonnet 4.6** | Faster, cheaper. Good balance for everyday tasks.                            |
| **Claude Haiku 4.5**  | Fast and cheap. Good for quick tasks and utility work.                       |
| **Kimi K2.5**         | Behaves very similarly to Claude. Great all-rounder at lower cost.           |
| **GLM 5**             | Claude-like behavior. Solid for orchestration tasks.                         |

### GPT Family

Principle-driven, explicit reasoning, deep technical capability. Best for agents working autonomously on complex problems.

| Model             | Strengths                                                                                       |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| **GPT-5.3 Codex** | Deep coding powerhouse. Autonomous exploration. Still available for deep category and explicit overrides. |
| **GPT-5.4**       | High intelligence, strategic reasoning. Default for Oracle, Momus, and key fallback for Prometheus / Atlas. Uses xhigh variant for Momus. |
| **GPT-5.4 Mini**  | Fast + strong reasoning. Good for lightweight autonomous tasks. Default for quick category. |
| **GPT-5-Nano**    | Ultra-cheap, fast. Good for simple utility tasks.                                               |

### Other Models

| Model                | Strengths                                                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Gemini 3.1 Pro**   | Excels at visual/frontend tasks. Different reasoning style. Default for `visual-engineering` and `artistry`. |
| **Gemini 3 Flash**   | Fast. Good for doc search and light tasks.                                                                   |
| **GPT-5.4 Mini Fast** | Default for Explore and Librarian agents. Blazing-fast reasoning-capable mini model. |
| **MiniMax M2.7**     | Fast and smart. Used in OpenCode Go and OpenCode Zen utility fallback chains. |
| **MiniMax M2.7 Highspeed** | High-speed OpenCode catalog entry used in utility fallback chains preferring fastest available MiniMax path. |

### OpenCode Go

Premium subscription tier ($10/month) providing reliable access to Chinese frontier models through OpenCode's infrastructure.

**Available Models:**

| Model                    | Use Case                                                              |
| ------------------------ | --------------------------------------------------------------------- |
| **opencode-go/kimi-k2.5** | Vision-capable, Claude-like reasoning. Used by Sisyphus, Atlas, Sisyphus-Junior, Multimodal Looker. |
| **opencode-go/glm-5**     | Text-only orchestration model. Used by Oracle, Prometheus, Metis, Momus.                           |
| **opencode-go/minimax-m2.7** | Ultra-cheap, fast responses. Used by Atlas, Sisyphus-Junior, Explore and Librarian fallbacks for utility work. |
| **opencode-go/minimax-m2.7-highspeed** | Even faster OpenCode Go MiniMax entry used as secondary fallback for Explore and Librarian when GPT-5.4 Mini Fast is unavailable. |

**When It Gets Used:**

OpenCode Go models appear throughout fallback chains as intermediate options. Depending on agent, they can sit before GPT, after GPT, or act as last structured-model fallback before cheaper utility paths.

**Go-Only Scenarios:**

Some model identifiers like `k2p5` (paid Kimi K2.5) and `glm-5` may only be available through OpenCode Go subscription in certain regions. When configured with these short identifiers, system resolves them through opencode-go provider first.

### About Free-Tier Fallbacks

You may see model names like `kimi-k2.5-free`, `minimax-m2.7`, `minimax-m2.7-highspeed`, or `big-pickle` (GLM 4.6) in source code or logs. These are provider-specific or speed-optimized entries in fallback chains.

You don't need to configure them. System includes them so it degrades gracefully when you don't have every paid subscription. If you have paid version, paid version is always preferred.

---

## Task Categories

When agents delegate work, they don't pick model name — they pick **category**. Category maps to right model automatically.

| Category             | When Used                  | Fallback Chain                               |
| -------------------- | -------------------------- | -------------------------------------------- |
| `visual-engineering` | Frontend, UI, CSS, design  | google\|github-copilot\|opencode\|vercel/gemini-3.1-pro (high) → zai-coding-plan\|opencode\|vercel/glm-5 → anthropic\|github-copilot\|opencode\|vercel/claude-opus-4-7 (max) → opencode-go\|vercel/glm-5 → kimi-for-coding/k2p5 |
| `ultrabrain`         | Maximum reasoning needed   | openai\|opencode\|vercel/gpt-5.4 (xhigh) → google\|github-copilot\|opencode\|vercel/gemini-3.1-pro (high) → anthropic\|github-copilot\|opencode\|vercel/claude-opus-4-7 (max) → opencode-go\|vercel/glm-5 |
| `deep`               | Deep coding, complex logic | openai\|github-copilot\|venice\|opencode\|vercel/gpt-5.4 (medium) → anthropic\|github-copilot\|opencode\|vercel/claude-opus-4-7 (max) → google\|github-copilot\|opencode\|vercel/gemini-3.1-pro (high) |
| `artistry`           | Creative, novel approaches | google\|github-copilot\|opencode\|vercel/gemini-3.1-pro (high) → anthropic\|github-copilot\|opencode\|vercel/claude-opus-4-7 (max) → openai\|github-copilot\|opencode\|vercel/gpt-5.4 |
| `quick`              | Simple, fast tasks         | openai\|github-copilot\|opencode\|vercel/gpt-5.4-mini → anthropic\|github-copilot\|opencode\|vercel/claude-haiku-4-5 → google\|github-copilot\|opencode\|vercel/gemini-3-flash → opencode-go\|vercel/minimax-m2.7 → opencode\|vercel/gpt-5-nano |
| `unspecified-high`   | General complex work       | anthropic\|github-copilot\|opencode\|vercel/claude-opus-4-7 (max) → openai\|github-copilot\|opencode\|vercel/gpt-5.4 (high) → zai-coding-plan\|opencode\|vercel/glm-5 → kimi-for-coding/k2p5 → opencode-go\|vercel/glm-5 → opencode\|vercel/kimi-k2.5 → opencode\|moonshotai\|moonshotai-cn\|firmware\|ollama-cloud\|aihubmix\|vercel/kimi-k2.5 |
| `unspecified-low`    | General standard work      | anthropic\|github-copilot\|opencode\|vercel/claude-sonnet-4-6 → openai\|opencode\|vercel/gpt-5.3-codex (medium) → opencode-go\|vercel/kimi-k2.5 → google\|github-copilot\|opencode\|vercel/gemini-3-flash → opencode-go\|vercel/minimax-m2.7 |
| `writing`            | Text, docs, prose          | google\|github-copilot\|opencode\|vercel/gemini-3-flash → opencode-go\|vercel/kimi-k2.5 → anthropic\|github-copilot\|opencode\|vercel/claude-sonnet-4-6 → opencode-go\|vercel/minimax-m2.7 |

See [Orchestration System Guide](./orchestration.md) for how agents dispatch tasks to categories.

### Vercel AI Gateway fallback coverage

`src/shared/model-requirements.ts` now includes `vercel` on nearly every gateway-compatible fallback entry across both agent and category chains. Treat it as universal extra provider path for listed model IDs, not as different model family. If row above shows `|vercel` in provider set, that is current source-of-truth runtime fallback, not docs-only convenience alias.

---

## Customization

### Example Configuration

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/dev/assets/oh-my-opencode.schema.json",

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

    // Prometheus inherits sisyphus model; add prompt guidance
    "prometheus": {
      "prompt_append": "Leverage deep & quick agents heavily, always in parallel.",
    },
  },

  "categories": {
    "quick": { "model": "opencode/gpt-5-nano" },
    "unspecified-low": { "model": "anthropic/claude-sonnet-4-6" },
    "unspecified-high": { "model": "anthropic/claude-opus-4-7", "variant": "max" },
    "visual-engineering": {
      "model": "google/gemini-3.1-pro",
      "variant": "high",
    },
    "writing": { "model": "google/gemini-3-flash" },
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
}
```

Run `opencode models` to see available models, `opencode auth login` to authenticate providers.

### Safe vs Dangerous Overrides

**Safe** — same personality type:

- Sisyphus: Opus → Sonnet, Kimi K2.5, GLM 5 (all communicative models)
- Prometheus: Opus → GPT-5.4 (auto-switches to GPT prompt)
- Atlas: Claude Sonnet 4.6 → GPT-5.4 (auto-switches to GPT prompt)

**Dangerous** — personality mismatch:

- Sisyphus → older GPT models: **Still bad fit. GPT-5.4 is only dedicated GPT prompt path.**
- Hephaestus → Claude: **Built for Codex's autonomous style. Claude can't replicate this.**
- Explore → Opus: **Massive cost waste. Explore needs speed, not intelligence.**
- Librarian → Opus: **Same. Doc search doesn't need Opus-level reasoning.**

### How Model Resolution Works

Each agent has fallback chain. System tries models in priority order until it finds one available through your connected providers. You don't need to configure providers per model. Authenticate (`opencode auth login`) and system figures out which models are available and where.

Core-agent tab cycling is deterministic via injected runtime order field. Fixed priority order is Sisyphus (order: 1), Hephaestus (order: 2), Prometheus (order: 3), and Atlas (order: 4), then remaining agents follow.

Your explicit configuration always wins. If you set specific model for agent, that choice takes precedence even when resolution data is cold.

Variant and `reasoningEffort` overrides are normalized to model-supported values, so cross-provider overrides degrade gracefully instead of failing hard.

Model capabilities are models.dev-backed, with refreshable cache and capability diagnostics. Use `bunx oh-my-opencode refresh-model-capabilities` to update cache, or configure `model_capabilities.auto_refresh_on_start` to refresh at startup.

To see which models your agents will actually use, run `bunx oh-my-opencode doctor`. This shows effective model resolution based on your current authentication and config.

```
Agent Request → User Override (if configured) → Fallback Chain → System Default
```

### File-Based Prompts

You can load agent system prompts from external files using `file://` URLs in `prompt` field, or append additional content with `prompt_append`. `prompt_append` field also works on categories.

```jsonc
{
  "agents": {
    "sisyphus": {
      "prompt": "file:///path/to/custom-prompt.md"
    },
    "oracle": {
      "prompt_append": "file:///path/to/additional-context.md"
    }
  },
  "categories": {
    "deep": {
      "prompt_append": "file:///path/to/deep-category-append.md"
    }
  }
}
```

File content is loaded at runtime and injected into agent's system prompt. Supports `~` expansion for home directory and relative `file://` paths.

---

## See Also

- [Installation Guide](./installation.md) — Setup and authentication
- [Orchestration System Guide](./orchestration.md) — How agents dispatch tasks to categories
- [Configuration Reference](../reference/configuration.md) — Full config options
- [`src/shared/model-requirements.ts`](../../src/shared/model-requirements.ts) — Source of truth for fallback chains

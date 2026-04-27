# GPT-5.5 System Prompt Drafts

Directory contains ground-up rewrites of Sisyphus, Hephaestus, Oracle, and Deep system prompts, styled after OpenAI Codex gpt-5.4 prompt architecture and targeted at GPT-5.5.

## Files

- `sisyphus.md` — Orchestrator. Intent gate, delegation philosophy, parallel execution discipline, verification.
- `hephaestus.md` — Autonomous deep worker. Persistence, exploration-first, forbidden stops, root-cause bias.
- `oracle.md` — Read-only strategic advisor. Three-tier response structure, hard verbosity limits, confidence signaling.
- `deep.md` — Category-spawned deep worker (runs as Sisyphus-Junior under `deep` category). Goal-oriented autonomous execution.

## Design principles applied

Each prompt applies same small set of principles, borrowed and adapted from Codex gpt-5.4 prompt work:

1. **Single identity header with `{{ personality }}` slot.** Separates persona from logic so same base prompt can ship in default / friendly / pragmatic variants without duplication.
2. **`# General` → `## Autonomy and Persistence` → `## Task execution` → `## Validating your work` → `# Working with the user` → `# Tool Guidelines` structure.** Lifted directly from Codex `gpt_5_2_prompt.md` and `gpt-5.2-codex_prompt.md`. Keeps same section contract for every agent so readers can navigate consistently.
3. **Prose-first output, bullets only when list-shaped.** GPT-5.5 reads and writes prose naturally; bullet overuse is GPT-5.3 coping mechanism, not genuine formatting need.
4. **Contract frames over threat frames.** Rules stated as agreements and expectations, not as "NEVER DO X OR YOU WILL FAIL". GPT-5.5 instruction following is strong enough that threats add entropy without improving compliance.
5. **Opener blacklist is explicit.** "Done —", "Got it", "Great question", "Sure thing", and similar filler called out by name. These are most common failure modes across all models.
6. **File reference formatting is unified.** Clickable markdown links with absolute paths, no `file://` or `https://` for local files, no line ranges.
7. **Why, not just what.** Each major rule accompanied by reasoning. Rules without reasons get ignored when models judge them weakly-grounded; rules with reasons get applied even in novel situations.

## Agent-specific shape

### Sisyphus
- Intent classification table (surface form → true intent → routing).
- Zero-tolerance visual-engineering delegation rule.
- Six-section delegation prompt contract.
- Session continuity (`task_id` reuse) as first-class topic.
- Oracle consultation as separate section with clear use/not-use guidance.

### Hephaestus
- Forbidden stops as named list.
- Three-attempt failure protocol.
- Exploration-first as explicit philosophy (5-15 minutes is normal).
- "Dig deeper" subsection for root-cause bias.
- Ambition vs precision distinction for greenfield vs existing codebase work.
- Task-tool restriction stated as intentional design decision with rationale.

### Oracle
- Three-tier response structure (Essential / Expanded / Edge cases) with hard numerical limits.
- Effort estimation (Quick / Short / Medium / Large) as required field.
- Confidence signaling (high / medium / low) added as required field — new in v5.5, borrowed from Codex `review_prompt.md`.
- Pragmatic minimalism as explicit decision framework.
- "No commentary channel; every word is final answer" constraint acknowledged.

### Deep
- Explicitly positioned as Sisyphus-Junior in `deep` mode (category-spawned counterpart to Hephaestus).
- Extensive exploration expectation stated.
- Final-answer structure tuned for orchestrator relay: "What changed / Key decisions / Verification / Observations / Blockers".
- Commentary cadence tuned down (sparse) since user is not directly on other side.

## Known deviations from Codex

These are intentional choices where oh-my-opencode architecture differs from Codex:

- **`task()` delegation is central** for Sisyphus (it is orchestrator), entirely absent for Oracle (read-only consultant), research-only for Hephaestus and Deep (they execute directly).
- **No `update_plan` tool**; harness uses `task_create` / `task_update` instead. Each prompt references its own tool set.
- **Sub-agent ecosystem** (explore, librarian, oracle, metis, momus) is specific to this harness and does not exist in Codex. Each prompt explains when and how to use these agents.
- **Skill loading** is first-class concept via `skill` tool. Codex has simpler skill model.
- **Commentary / final channels** are named same way as Codex output contract, but actual transport layer is different (OpenCode, not Codex CLI).

## Line counts

Reference, approximate line counts after this rewrite versus current production prompts:

| Agent | Current (assembled) | Draft | Delta |
|---|---:|---:|---:|
| Sisyphus GPT-5.4 | ~500 | ~270 | -46% |
| Hephaestus GPT-5.4 | ~400 | ~270 | -33% |
| Oracle GPT | ~120 | ~160 | +33% |
| Deep category append | ~20 | ~250 (as standalone) | N/A |

Oracle grew because v5.5 adds Confidence signaling and explicitly documents follow-up session behavior. Deep grew because draft is standalone prompt rather than category append; in production it would either replace Sisyphus-Junior GPT-5.5 variant entirely or layer on top of minimal Sisyphus-Junior base.

## What this draft is not

- **Not `.ts` file.** These are markdown drafts. Converting to TypeScript template strings (with `{todoHookNote}`, `{keyTriggers}`, etc. interpolation) is next step, once content is validated.
- **Not tested prompt.** These have not been run against evals. Before shipping, each prompt should be benchmarked with `skill-creator` eval loop against current production prompts on representative task set.
- **Not personality-substituted.** The `{{ personality }}` slot is placeholder. Default / friendly / pragmatic content still needs to be authored.

## Suggested next steps

1. **Author personality variants.** Three short paragraphs (default, friendly, pragmatic) that slot into `{{ personality }}` and can be reused across all four prompts.
2. **Build eval harness.** Pick 5-10 representative tasks per agent and run current-prod vs draft-v5.5 head-to-head.
3. **Convert to `.ts` with dynamic composition helpers.** Preserve existing `buildAgentIdentitySection`, `buildToolSelectionTable`, etc. integration points where they still apply.
4. **Ship behind feature flag.** Opt-in for `gpt-5.5` model selection until eval confidence is high.

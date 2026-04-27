# Model Settings Compatibility Resolver Design

## Goal

Introduce central resolver taking already-selected model and desired model settings, returns best compatible configuration. Explicitly separate from model fallback.

## Problem

Logic for `variant` and `reasoningEffort` compatibility scattered across:
- `hooks/anthropic-effort`
- `plugin/chat-params`
- agent/category/fallback config layers
- delegate/background prompt plumbing

Creates inconsistent behavior:
- some paths clamp unsupported levels
- some pass them through unchanged
- some silently drop them
- some use model-family-specific assumptions not generalizing

Result: brittle request behavior even with valid model.

## Scope

Phase 1 covers:
- `variant`
- `reasoningEffort`

Out of scope:
- model fallback itself
- `thinking`
- `maxTokens`
- `temperature`
- `top_p`
- automatic upward remapping

## Desired behavior

Given fixed model and desired settings:
1. If desired value supported, keep it.
2. If not supported, downgrade to nearest lower compatible value.
3. If no compatible value exists, drop field.
4. Do not switch models.
5. Do not automatically upgrade settings.

## Architecture

Add central module:
- `src/shared/model-settings-compatibility.ts`

Core API:

```ts
type DesiredModelSettings = {
  variant?: string
  reasoningEffort?: string
}

type ModelSettingsCompatibilityInput = {
  providerID: string
  modelID: string
  desired: DesiredModelSettings
}

type ModelSettingsCompatibilityChange = {
  field: "variant" | "reasoningEffort"
  from: string
  to?: string
  reason: string
}

type ModelSettingsCompatibilityResult = {
  variant?: string
  reasoningEffort?: string
  changes: ModelSettingsCompatibilityChange[]
}
```

## Compatibility model

Phase 1: **metadata-first where platform exposes reliable capability data**, fallback to family-based rules when metadata absent.

### Variant compatibility

Preferred source:
- OpenCode/provider model metadata (`variants`)

Fallback when metadata unavailable:
- family-based ladders

Examples:
- Claude Opus family: `low`, `medium`, `high`, `max`
- Claude Sonnet/Haiku family: `low`, `medium`, `high`
- OpenAI GPT family: conservative family fallback only when metadata missing
- Unknown family: drop unsupported values conservatively

### Reasoning effort compatibility

Phase 1 source:
- conservative model/provider family heuristics

Reason:
- OpenCode SDK/provider metadata exposes model `variants`, not equivalent per-model capability list for `reasoningEffort`

Examples:
- GPT/OpenAI-style models: `low`, `medium`, `high`, `xhigh` where supported by family heuristics
- Claude family via OpenCode path: treat `reasoningEffort` as unsupported in Phase 1, remove it

Resolver remains pure model/settings logic. Transport restrictions remain responsibility of request-building path.

## Separation of concerns

Design intentionally separates:
- model selection (`resolveModel...`, fallback chains)
- settings compatibility (this resolver)
- request transport compatibility (`chat.params`, prompt body constraints)

Responsibilities:
- choose model first
- normalize settings second
- build request third

## First integration point

Phase 1 first integrate into `chat.params`.

Why:
- already centralized path for request-time tuning
- can influence provider-facing options without leaking unsupported fields into prompt bodies
- avoids patching every prompt constructor at once

## Rollout plan

### Phase 1
- add resolver module and tests
- integrate into `chat.params`
- migrate `anthropic-effort` to use resolver or become thin Claude-specific supplement

### Phase 2
- expand to `thinking`, `maxTokens`, `temperature`, `top_p`
- formalize request-path capability tables if needed

### Phase 3
- centralize all variant/reasoning normalization away from scattered hooks and ad hoc callers

## Risks

- Overfitting family rules to current model naming conventions
- Accidentally changing request semantics on paths relying on implicit behavior
- Mixing provider transport limitations with model capability logic

## Mitigations

- Keep resolver pure and narrowly scoped in Phase 1
- Add explicit regression tests for keep/downgrade/drop decisions
- Integrate at one central point first (`chat.params`)
- Preserve existing behavior where desired values already valid

## Recommendation

Proceed with central resolver as new, isolated implementation in dedicated branch/worktree.
Clean long-term path, more reviewable than adding special-case clamps in hooks.

# Model Capabilities Maintenance

This project treats model capability resolution as layered system:

1. runtime metadata from connected providers
2. `models.dev` bundled/runtime snapshot data
3. explicit compatibility aliases
4. heuristic fallback as last resort

## Internal policy

- Built-in OmO agent/category requirement models must use canonical model IDs.
- Aliases exist only to preserve compatibility with historical OmO names or provider-specific decorations.
- New decorated names like `-high`, `-low`, or `-thinking` should not be added to built-in requirements when canonical model ID plus structured settings can express same thing.
- If provider or config input still uses alias, normalize it at edge and continue internally with canonical ID.

## When adding alias

- Add alias rule to `src/shared/model-capability-aliases.ts`.
- Include rationale for why alias exists.
- Add or update tests so alias is covered explicitly.
- Ensure alias canonical target exists in bundled `models.dev` snapshot.

## Guardrails

`bun run test:model-capabilities` enforces following invariants:

- exact alias targets must exist in bundled snapshot
- exact alias keys must not silently become canonical `models.dev` IDs
- pattern aliases must not rewrite canonical snapshot IDs
- built-in requirement models must stay canonical and snapshot-backed

Scheduled `refresh-model-capabilities` workflow runs these guardrails before opening automated snapshot refresh PR.

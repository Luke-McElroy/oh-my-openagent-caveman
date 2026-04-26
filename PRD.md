# PRD v3: caveman-opencode (CVCODE)
## Compress all markdown in the oh-my-opencode fork

---

## 1. Goal

One-time, batch compress every in-scope `.md` file in a forked copy of `oh-my-opencode` using the caveman compress CLI. Files are rewritten in place. Originals are backed up automatically by the CLI. The batch is driven by a new Bun script added to the repo at `script/compress-all-markdown.ts`.

---

## 2. Non-goals

- No runtime compression. No changes to agent behaviour, hooks, or tool call logic.
- No changes to `.ts`, `.js`, `.json`, `.yaml`, `.yml`, `.toml`, `.env`, `.lock` files.
- No new dependencies added to `package.json`.
- No changes to CI pipelines or publish workflows.

---

## 3. Prerequisites

Before running the script, the following must be true:

### 3.1 Fork exists

The repo is a full copy of `oh-my-opencode` with all files intact. No files have been deleted or renamed yet.

### 3.2 Caveman compress scripts vendored

The caveman compress Python scripts must exist at:

```
<repo_root>/.caveman/scripts/
```

The directory structure must match what `python3 -m scripts` expects — specifically, `.caveman/scripts/__main__.py` must exist.

**How to vendor:** Copy the `scripts/` directory from the caveman-compress repo into `.caveman/` in the fork root. This is a one-time manual step before running the batch script.

### 3.3 Python 3 available

`python3` must be on `PATH`. The caveman compress CLI requires it. No Python version pinning is needed beyond 3.8+.

### 3.4 Anthropic API key set

The caveman compress CLI calls Claude to compress. `ANTHROPIC_API_KEY` must be set in the environment before running the batch script.

```bash
export ANTHROPIC_API_KEY=<your_key>
```

---

## 4. Implementation: `script/compress-all-markdown.ts`

Create this file at `script/compress-all-markdown.ts`. It must be runnable with:

```bash
bun run script/compress-all-markdown.ts
```

### 4.1 Full implementation spec

```typescript
import { spawnSync } from "child_process";
import { readdirSync, statSync } from "fs";
import { join, resolve, extname, basename } from "path";

// ── Config ────────────────────────────────────────────────────────────────────

const REPO_ROOT = resolve(import.meta.dir, "..");
const CAVEMAN_DIR = join(REPO_ROOT, ".caveman");

// ── File discovery ────────────────────────────────────────────────────────────

function findMarkdownFiles(dir: string, files: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      if (EXCLUDED_DIRS.some((ex) => fullPath.includes(ex))) continue;
      findMarkdownFiles(fullPath, files);
    } else if (extname(entry) === ".md") {
      if (isExcluded(fullPath)) continue;
      files.push(fullPath);
    }
  }
  return files;
}

// ── Exclusion rules ───────────────────────────────────────────────────────────
//
// Rule 1: Never compress backup files (created by the caveman CLI itself).
// Rule 2: Never compress legal documents (Terms of Service, Privacy Policy).
// Rule 3: Never compress test fixture markdown (used by unit tests; changing
//         content would cause snapshot or assertion failures).
// Rule 4: Never compress the caveman scripts directory itself.

const EXCLUDED_DIRS: string[] = [
  // Test fixtures — content is asserted against in tests
  "src/__tests__",
  // Caveman vendor directory
  ".caveman",
  // Node modules (should not exist in a clean fork, but guard anyway)
  "node_modules",
];

const EXCLUDED_FILES: string[] = [
  // Legal — must not be paraphrased or altered
  "docs/legal/privacy-policy.md",
  "docs/legal/terms-of-service.md",
  // Eval outputs — these are test reference outputs, not prose docs
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-1/with_skill/outputs/code-changes.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-1/with_skill/outputs/execution-plan.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-1/with_skill/outputs/pr-description.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-1/with_skill/outputs/verification-strategy.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-1/without_skill/outputs/code-changes.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-1/without_skill/outputs/execution-plan.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-1/without_skill/outputs/pr-description.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-1/without_skill/outputs/verification-strategy.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-2/with_skill/outputs/code-changes.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-2/with_skill/outputs/execution-plan.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-2/with_skill/outputs/pr-description.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-2/with_skill/outputs/verification-strategy.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-2/without_skill/outputs/code-changes.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-2/without_skill/outputs/execution-plan.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-2/without_skill/outputs/pr-description.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-2/without_skill/outputs/verification-strategy.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-3/with_skill/outputs/code-changes.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-3/with_skill/outputs/execution-plan.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-3/with_skill/outputs/pr-description.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-3/with_skill/outputs/verification-strategy.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-3/without_skill/outputs/code-changes.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-3/without_skill/outputs/execution-plan.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-3/without_skill/outputs/pr-description.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-3/without_skill/outputs/verification-strategy.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-4/with_skill/outputs/code-changes.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-4/with_skill/outputs/execution-plan.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-4/with_skill/outputs/pr-description.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-4/with_skill/outputs/verification-strategy.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-4/without_skill/outputs/code-changes.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-4/without_skill/outputs/execution-plan.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-4/without_skill/outputs/pr-description.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-4/without_skill/outputs/verification-strategy.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-5/with_skill/outputs/code-changes.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-5/with_skill/outputs/execution-plan.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-5/with_skill/outputs/pr-description.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-5/with_skill/outputs/verification-strategy.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-5/without_skill/outputs/code-changes.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-5/without_skill/outputs/execution-plan.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-5/without_skill/outputs/pr-description.md",
  ".opencode/skills/work-with-pr-workspace/iteration-1/eval-5/without_skill/outputs/verification-strategy.md",
  // The benchmark output doc (data, not prose)
  ".opencode/skills/work-with-pr-workspace/iteration-1/benchmark.md",
];

function isExcluded(absolutePath: string): boolean {
  // Never compress backup files created by the caveman CLI
  if (basename(absolutePath).endsWith(".original.md")) return true;

  // Check against relative-path exclusion list
  const relPath = absolutePath.replace(REPO_ROOT + "/", "");
  if (EXCLUDED_FILES.includes(relPath)) return true;

  return false;
}

// ── Compression ───────────────────────────────────────────────────────────────
//
// The caveman compress CLI is invoked via:
//   cd <CAVEMAN_DIR> && python3 -m scripts <absolute_file_path>
//
// The CLI handles internally:
//   - Calling Claude to compress
//   - Validating output
//   - Retrying up to 2 times on validation failure
//   - Writing compressed content back to the file
//   - Saving original as <file>.original.md
//
// Exit codes from the CLI:
//   0  = success, file was compressed and written
//   non-zero = failure after all retries; original file was left untouched

interface CompressResult {
  file: string;
  success: boolean;
  exitCode: number;
  stderr: string;
}

function compressFile(absolutePath: string): CompressResult {
  const result = spawnSync("python3", ["-m", "scripts", absolutePath], {
    cwd: CAVEMAN_DIR,
    encoding: "utf-8",
    // No timeout — large files may take time. Claude API calls can be slow.
    // If a timeout is needed operationally, pass: timeout: 120_000
  });

  return {
    file: absolutePath.replace(REPO_ROOT + "/", ""),
    success: result.status === 0,
    exitCode: result.status ?? -1,
    stderr: result.stderr ?? "",
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main(): void {
  // Guard: ANTHROPIC_API_KEY must be set
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ERROR: ANTHROPIC_API_KEY is not set.");
    console.error("Export it before running: export ANTHROPIC_API_KEY=<key>");
    process.exit(1);
  }

  // Guard: caveman scripts must be vendored
  const cavemainEntry = join(CAVEMAN_DIR, "scripts", "__main__.py");
  try {
    statSync(cavemainEntry);
  } catch {
    console.error(`ERROR: Caveman scripts not found at ${cavemainEntry}`);
    console.error(
      "Vendor the caveman-compress scripts directory to .caveman/scripts/ first."
    );
    process.exit(1);
  }

  const files = findMarkdownFiles(REPO_ROOT);
  console.log(`Found ${files.length} markdown files to compress.\n`);

  const results: CompressResult[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const relPath = file.replace(REPO_ROOT + "/", "");
    process.stdout.write(`[${i + 1}/${files.length}] ${relPath} ... `);

    const result = compressFile(file);
    results.push(result);

    if (result.success) {
      console.log("OK");
    } else {
      console.log(`FAILED (exit ${result.exitCode})`);
      if (result.stderr) {
        console.error(`  stderr: ${result.stderr.trim()}`);
      }
    }
  }

  // Summary
  const passed = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log(`\n── Summary ─────────────────────────────`);
  console.log(`  Total:   ${results.length}`);
  console.log(`  Success: ${passed.length}`);
  console.log(`  Failed:  ${failed.length}`);

  if (failed.length > 0) {
    console.log("\nFailed files (originals untouched):");
    for (const r of failed) {
      console.log(`  - ${r.file}`);
    }
    // Non-zero exit so CI or a calling script can detect failures
    process.exit(1);
  }
}

main();
```

---

## 5. In-scope file list

The script discovers files dynamically at runtime using the rules above. For traceability, here is the expected set of files that will be compressed, grouped by directory. Any `.md` file not in an excluded directory and not in the excluded file list is in scope.

### 5.1 Root level
- `README.md`
- `README.ja.md`
- `README.ko.md`
- `README.ru.md`
- `README.zh-cn.md`
- `AGENTS.md`
- `CONTRIBUTING.md`
- `CLA.md`
- `LICENSE.md`

### 5.2 `.github/`
- `.github/pull_request_template.md`

### 5.3 `.opencode/command/`
- `.opencode/command/get-unpublished-changes.md`
- `.opencode/command/omomomo.md`
- `.opencode/command/publish.md`
- `.opencode/command/remove-deadcode.md`

### 5.4 `.opencode/skills/`
- `.opencode/skills/github-triage/SKILL.md`
- `.opencode/skills/pre-publish-review/SKILL.md`
- `.opencode/skills/work-with-pr/SKILL.md`

### 5.5 `docs/`
- `docs/guide/agent-model-matching.md`
- `docs/guide/installation.md`
- `docs/guide/orchestration.md`
- `docs/guide/overview.md`
- `docs/reference/cli.md`
- `docs/reference/configuration.md`
- `docs/reference/features.md`
- `docs/superpowers/plans/2026-03-17-model-settings-compatibility-resolver.md`
- `docs/superpowers/specs/2026-03-17-model-settings-compatibility-design.md`
- `docs/troubleshooting/ollama.md`
- `docs/manifesto.md`
- `docs/model-capabilities-maintenance.md`

**Excluded from docs:**
- `docs/legal/privacy-policy.md` — legal document, must not be altered
- `docs/legal/terms-of-service.md` — legal document, must not be altered

### 5.6 `drafts/`
- `drafts/gpt-5-5/deep.md`
- `drafts/gpt-5-5/hephaestus.md`
- `drafts/gpt-5-5/oracle.md`
- `drafts/gpt-5-5/README.md`
- `drafts/gpt-5-5/sisyphus-junior.md`
- `drafts/gpt-5-5/sisyphus.md`

### 5.7 `src/` — all `AGENTS.md` files

Every `AGENTS.md` file in `src/` is in scope. These are agent system prompt sections and are the highest-value compression targets.

- `src/AGENTS.md`
- `src/agents/AGENTS.md`
- `src/agents/hephaestus/AGENTS.md`
- `src/agents/prometheus/AGENTS.md`
- `src/agents/sisyphus/AGENTS.md`
- `src/cli/AGENTS.md`
- `src/cli/config-manager/AGENTS.md`
- `src/cli/doctor/AGENTS.md`
- `src/cli/run/AGENTS.md`
- `src/config/AGENTS.md`
- `src/features/AGENTS.md`
- `src/features/background-agent/AGENTS.md`
- `src/features/builtin-skills/AGENTS.md`
- `src/features/claude-code-mcp-loader/AGENTS.md`
- `src/features/claude-code-plugin-loader/AGENTS.md`
- `src/features/claude-tasks/AGENTS.md`
- `src/features/mcp-oauth/AGENTS.md`
- `src/features/opencode-skill-loader/AGENTS.md`
- `src/features/skill-mcp-manager/AGENTS.md`
- `src/features/tmux-subagent/AGENTS.md`
- `src/hooks/AGENTS.md`
- `src/hooks/anthropic-context-window-limit-recovery/AGENTS.md`
- `src/hooks/atlas/AGENTS.md`
- `src/hooks/comment-checker/AGENTS.md`
- `src/hooks/keyword-detector/AGENTS.md`
- `src/hooks/ralph-loop/AGENTS.md`
- `src/hooks/rules-injector/AGENTS.md`
- `src/hooks/runtime-fallback/AGENTS.md`
- `src/hooks/session-recovery/AGENTS.md`
- `src/hooks/todo-continuation-enforcer/AGENTS.md`
- `src/mcp/AGENTS.md`
- `src/openclaw/AGENTS.md`
- `src/plugin/AGENTS.md`
- `src/plugin-handlers/AGENTS.md`
- `src/shared/AGENTS.md`
- `src/tools/AGENTS.md`
- `src/tools/background-task/AGENTS.md`
- `src/tools/call-omo-agent/AGENTS.md`
- `src/tools/delegate-task/AGENTS.md`
- `src/tools/hashline-edit/AGENTS.md`
- `src/tools/lsp/AGENTS.md`

### 5.8 `src/` — `SKILL.md` files

- `src/features/builtin-skills/agent-browser/SKILL.md`
- `src/features/builtin-skills/dev-browser/SKILL.md`
- `src/features/builtin-skills/dev-browser/references/installation.md`
- `src/features/builtin-skills/dev-browser/references/scraping.md`
- `src/features/builtin-skills/frontend-ui-ux/SKILL.md`
- `src/features/builtin-skills/git-master/SKILL.md`

### 5.9 Excluded entirely: `src/__tests__/`

All markdown files under `src/__tests__/` are excluded. These include:
- `src/__tests__/perf/fixtures/in-tree/AGENTS.md`
- `src/__tests__/perf/fixtures/in-tree/src/AGENTS.md`
- `src/__tests__/perf/fixtures/in-tree/packages/pkg-one/AGENTS.md`

**Reason:** These files are test fixtures. Their exact content may be asserted against in tests. Compressing them could cause test failures without any source code change to the tests themselves.

---

## 6. Compression engine spec

The compression engine is the caveman compress CLI, vendored to `.caveman/scripts/`.

### 6.1 Invocation

```
cd <repo_root>/.caveman && python3 -m scripts <absolute_file_path>
```

### 6.2 What the CLI does (do not reimplement)

The batch script does not perform compression itself. It only invokes the CLI per file. The CLI is responsible for:

- Detecting file type
- Calling Claude (claude-sonnet-4-20250514 or equivalent, via `ANTHROPIC_API_KEY`) to compress
- Validating the output (structure preserved, code blocks intact)
- Retrying up to 2 times on validation failure
- On success: overwriting the original file with compressed content
- On success: saving original as `<filepath>.original.md`
- On failure after all retries: leaving original file untouched, exiting non-zero

### 6.3 Compression rules (for reference — enforced by CLI, not the batch script)

The CLI applies these rules to every file it processes:

**Remove:**
- Articles: `a`, `an`, `the`
- Filler words: `just`, `really`, `basically`, `actually`, `simply`, `essentially`, `generally`
- Pleasantries: `sure`, `certainly`, `of course`, `happy to`, `I'd recommend`
- Hedging: `it might be worth`, `you could consider`, `it would be good to`
- Redundant phrases: `in order to` → `to`, `make sure to` → `ensure`
- Connective fluff: `however`, `furthermore`, `additionally`, `in addition`

**Preserve exactly (never modify):**
- All code blocks (fenced ` ``` ` and indented)
- All inline code (`` `backtick content` ``)
- All URLs and markdown links
- All file paths
- All shell commands
- All technical terms, library names, API names, protocols
- All proper nouns (project names, company names)
- All dates, version numbers, numeric values
- All environment variables

**Preserve structure:**
- All markdown heading levels and heading text
- All bullet hierarchy and nesting
- All numbered lists
- All tables (compress cell text, keep structure)
- All frontmatter / YAML headers

---

## 7. Error handling

### 7.1 Per-file failure

If the caveman CLI exits non-zero for a file:
- The original file is untouched (CLI guarantees this)
- The batch script logs the failure with exit code and stderr
- The batch script continues to the next file — it does not abort

### 7.2 End-of-batch reporting

After all files are processed, the script prints a summary: total files, count succeeded, count failed, and a list of failed file paths.

### 7.3 Exit code

If any files failed, the batch script exits with code `1`. If all files succeeded, it exits with code `0`.

### 7.4 Prerequisite failures

If `ANTHROPIC_API_KEY` is not set, or `.caveman/scripts/__main__.py` does not exist, the script exits immediately with code `1` and an actionable error message. No files are touched.

### 7.5 What is explicitly NOT done

- The batch script does not implement its own retry logic. Retries are the CLI's responsibility.
- The batch script does not implement "compress with less compression" as a fallback. If the CLI fails, the file is logged as failed and skipped.
- The batch script does not delete `.original.md` backup files. Backups are left in place.

---

## 8. New file added to repo

Only one file is added to the repo as part of this change:

| File | Purpose |
|---|---|
| `script/compress-all-markdown.ts` | Batch compression script |

Additionally, the `.caveman/` directory must be created and populated manually (see section 3.2). If the directory is committed to the repo, add `.caveman/scripts/__pycache__/` to `.gitignore`.

---

## 9. How to run

```bash
# 1. Vendor caveman scripts (one-time manual step)
mkdir -p .caveman
cp -r /path/to/caveman-compress/scripts .caveman/

# 2. Set API key
export ANTHROPIC_API_KEY=sk-ant-...

# 3. Run
bun run script/compress-all-markdown.ts
```

---

## 10. Acceptance criteria

An AI agent implementing this PRD has succeeded when all of the following are true:

1. `script/compress-all-markdown.ts` exists and runs without TypeScript errors under `bun run`.
2. Running the script with a valid `ANTHROPIC_API_KEY` and vendored scripts produces compressed `.md` files in the locations listed in section 5.
3. For every compressed file, a corresponding `.original.md` backup exists alongside it.
4. No file in the excluded list (section 5.9, legal files, eval outputs) is modified.
5. No `.ts`, `.js`, `.json`, `.yaml`, `.yml`, `.toml` files are modified.
6. The script exits `0` when all files succeed, and `1` when any file fails.
7. The script exits `1` immediately (without touching any files) if `ANTHROPIC_API_KEY` is not set.
8. The script exits `1` immediately (without touching any files) if `.caveman/scripts/__main__.py` is not found.

---

## 11. Do not touch

The following are explicitly out of scope. Do not modify any of these:

- All `.ts` source files under `src/`
- All `.ts` files under `script/` (except the new file being created)
- All `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml` files
- `package.json`, `bun.lock`, `bunfig.toml`, `tsconfig.json`
- `.github/workflows/` (all CI/CD pipelines)
- `docs/legal/privacy-policy.md`
- `docs/legal/terms-of-service.md`
- Any file already ending in `.original.md`
- Any file under `src/__tests__/`
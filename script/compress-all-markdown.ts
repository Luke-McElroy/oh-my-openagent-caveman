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

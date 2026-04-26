import { readdirSync, statSync, readFileSync, writeFileSync, renameSync } from "fs";
import { join, resolve, extname, basename } from "path";

const REPO_ROOT = resolve(import.meta.dir, "..");
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

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

const EXCLUDED_DIRS: string[] = [
  "src/__tests__",
  ".caveman",
  "node_modules",
];

const EXCLUDED_FILES: string[] = [
  "docs/legal/privacy-policy.md",
  "docs/legal/terms-of-service.md",
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
  ".opencode/skills/work-with-pr-workspace/iteration-1/benchmark.md",
];

function isExcluded(absolutePath: string): boolean {
  if (basename(absolutePath).endsWith(".original.md")) return true;
  const relPath = absolutePath.replace(REPO_ROOT + "/", "");
  if (EXCLUDED_FILES.includes(relPath)) return true;
  return false;
}

interface CompressResult {
  file: string;
  success: boolean;
  error?: string;
}

async function compressFile(absolutePath: string): Promise<CompressResult> {
  const content = readFileSync(absolutePath, "utf-8");
  const relPath = absolutePath.replace(REPO_ROOT + "/", "");

  const prompt = `Compress this markdown file to "caveman" style - remove filler words and simplify language while preserving all structure and technical content.

Caveman compression rules:
REMOVE:
- Articles: a, an, the (when possible)
- Filler words: just, really, basically, actually, simply, essentially, generally
- Pleasantries: sure, certainly, of course, happy to, I'd recommend
- Hedging: it might be worth, you could consider, it would be good to
- Redundant phrases: "in order to" → "to", "make sure to" → "ensure"
- Connective fluff: however, furthermore, additionally, in addition

PRESERVE EXACTLY:
- All code blocks (fenced \`\`\` and indented)
- All inline code (backtick content)
- All URLs and markdown links
- All file paths
- All shell commands
- All technical terms, library names, API names, protocols
- All proper nouns (project names, company names)
- All dates, version numbers, numeric values
- All environment variables

PRESERVE STRUCTURE:
- All markdown heading levels and heading text
- All bullet hierarchy and nesting
- All numbered lists
- All tables (compress cell text, keep structure)
- All frontmatter / YAML headers

Output ONLY the compressed markdown content. No explanations, no markdown code fences around the output.

File content to compress:

${content}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 8192,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    const compressed = data.content[0]?.text;

    if (!compressed) {
      throw new Error("No content in response");
    }

    renameSync(absolutePath, absolutePath + ".original.md");
    writeFileSync(absolutePath, compressed, "utf-8");

    return { file: relPath, success: true };
  } catch (error) {
    return { file: relPath, success: false, error: String(error) };
  }
}

async function main(): Promise<void> {
  if (!ANTHROPIC_API_KEY) {
    console.error("ERROR: ANTHROPIC_API_KEY is not set.");
    console.error("Export it before running: export ANTHROPIC_API_KEY=<key>");
    process.exit(1);
  }

  const files = findMarkdownFiles(REPO_ROOT);
  console.log(`Found ${files.length} markdown files to compress.\n`);

  const results: CompressResult[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const relPath = file.replace(REPO_ROOT + "/", "");
    process.stdout.write(`[${i + 1}/${files.length}] ${relPath} ... `);

    const result = await compressFile(file);
    results.push(result);

    if (result.success) {
      console.log("OK");
    } else {
      console.log(`FAILED: ${result.error}`);
    }
  }

  const passed = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log(`\n── Summary ─────────────────────────────`);
  console.log(`  Total:   ${results.length}`);
  console.log(`  Success: ${passed.length}`);
  console.log(`  Failed:  ${failed.length}`);

  if (failed.length > 0) {
    console.log("\nFailed files:");
    for (const r of failed) {
      console.log(`  - ${r.file}: ${r.error}`);
    }
    process.exit(1);
  }
}

main();

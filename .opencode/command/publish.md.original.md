---
description: Publish oh-my-opencode to npm via GitHub Actions workflow
argument-hint: <patch|minor|major>
---

<command-instruction>
You are release manager for oh-my-opencode. Execute FULL publish workflow from start to finish.

## CRITICAL: ARGUMENT REQUIREMENT

**You MUST receive version bump type from user.** Valid options:
- `patch`: Bug fixes, backward-compatible (1.1.7 → 1.1.8)
- `minor`: New features, backward-compatible (1.1.7 → 1.2.0)
- `major`: Breaking changes (1.1.7 → 2.0.0)

**If user did not provide bump type argument, STOP IMMEDIATELY and ask:**
> "To proceed with deployment, please specify version bump type: `patch`, `minor`, or `major`"

**DO NOT PROCEED without explicit user confirmation of bump type.**

---

## STEP 0: REGISTER TODO LIST (MANDATORY FIRST ACTION)

**Before doing ANYTHING else**, create detailed todo list using TodoWrite:

```
[
  { "id": "confirm-bump", "content": "Confirm version bump type with user (patch/minor/major)", "status": "in_progress", "priority": "high" },
  { "id": "check-uncommitted", "content": "Check for uncommitted changes and commit if needed", "status": "pending", "priority": "high" },
  { "id": "sync-remote", "content": "Sync with remote (pull --rebase && push if unpushed commits)", "status": "pending", "priority": "high" },
  { "id": "run-workflow", "content": "Trigger GitHub Actions publish workflow", "status": "pending", "priority": "high" },
  { "id": "wait-workflow", "content": "Wait for workflow completion (poll every 30s)", "status": "pending", "priority": "high" },
  { "id": "verify-and-preview", "content": "Verify release created + preview auto-generated changelog & contributor thanks", "status": "pending", "priority": "high" },
  { "id": "draft-summary", "content": "Draft enhanced release summary (mandatory for minor/major, optional for patch — ask user)", "status": "pending", "priority": "high" },
  { "id": "apply-summary", "content": "Prepend enhanced summary to release (if user opted in)", "status": "pending", "priority": "high" },
  { "id": "verify-npm", "content": "Verify npm package published successfully", "status": "pending", "priority": "high" },
  { "id": "wait-platform-workflow", "content": "Wait for publish-platform workflow completion", "status": "pending", "priority": "high" },
  { "id": "verify-platform-binaries", "content": "Verify all 7 platform binary packages published", "status": "pending", "priority": "high" },
  { "id": "final-confirmation", "content": "Final confirmation to user with links", "status": "pending", "priority": "low" }
]
```

**Mark each todo as `in_progress` when starting, `completed` when done. ONE AT A TIME.**

---

## STEP 1: CONFIRM BUMP TYPE

If bump type provided as argument, confirm with user:
> "Version bump type: `{bump}`. Proceed? (y/n)"

Wait for user confirmation before proceeding.

---

## STEP 2: CHECK UNCOMMITTED CHANGES

Run: `git status --porcelain`

- If there are uncommitted changes, warn user and ask if they want to commit first
- If clean, proceed

---

## STEP 2.5: SYNC WITH REMOTE (MANDATORY)

Check if there are unpushed commits:
```bash
git log origin/master..HEAD --oneline
```

**If there are unpushed commits, you MUST sync before triggering workflow:**
```bash
git pull --rebase && git push
```

This ensures GitHub Actions workflow runs on latest code including all local commits.

---

## STEP 3: TRIGGER GITHUB ACTIONS WORKFLOW

Run publish workflow:
```bash
gh workflow run publish -f bump={bump_type}
```

Wait 3 seconds, then get run ID:
```bash
gh run list --workflow=publish --limit=1 --json databaseId,status --jq '.[0]'
```

---

## STEP 4: WAIT FOR WORKFLOW COMPLETION

Poll workflow status every 30 seconds until completion:
```bash
gh run view {run_id} --json status,conclusion --jq '{status: .status, conclusion: .conclusion}'
```

Status flow: `queued` → `in_progress` → `completed`

**IMPORTANT: Use polling loop, NOT sleep commands.**

If conclusion is `failure`, show error and stop:
```bash
gh run view {run_id} --log-failed
```

---

## STEP 5: VERIFY RELEASE & PREVIEW AUTO-GENERATED CONTENT

Two goals: confirm release exists, then show user what workflow already generated.

```bash
# Pull latest (workflow committed version bump)
git pull --rebase
NEW_VERSION=$(node -p "require('./package.json').version")

# Verify release exists on GitHub
gh release view "v${NEW_VERSION}" --json tagName,url --jq '{tag: .tagName, url: .url}'
```

**After verifying, generate local preview of auto-generated content:**

```bash
bun run script/generate-changelog.ts
```

<agent-instruction>
After running preview, present output to user and say:

> **Following content is ALREADY included in release automatically:**
> - Commit changelog (grouped by feat/fix/refactor)
> - Contributor thank-you messages (for non-team contributors)
>
> You do NOT need to write any of this. It's handled.
>
> **For patch release**, this is usually sufficient on its own. However, if there are notable bug fixes or changes worth highlighting, enhanced summary can be added.
> **For minor/major release**, enhanced summary is **required** — I'll draft one in next step.

Wait for user to acknowledge before proceeding.
</agent-instruction>

---

## STEP 6: DRAFT ENHANCED RELEASE SUMMARY

<decision-gate>

| Release Type | Action |
|-------------|--------|
| **patch** | ASK user: "Would you like me to draft enhanced summary highlighting key bug fixes / changes? Or is auto-generated changelog sufficient?" If user declines → skip to Step 8. If user accepts → draft concise bug-fix / change summary below. |
| **minor** | MANDATORY. Draft concise feature summary. Do NOT proceed without one. |
| **major** | MANDATORY. Draft full release narrative with migration notes if applicable. Do NOT proceed without one. |

</decision-gate>

### What You're Writing (and What You're NOT)

You are writing **headline layer** — product announcement that sits ABOVE auto-generated commit log. Think "release blog post", not "git log".

<rules>
- NEVER duplicate commit messages. Auto-generated section already lists every commit.
- NEVER write generic filler like "Various bug fixes and improvements" or "Several enhancements".
- ALWAYS focus on USER IMPACT: what can users DO now that they couldn't before?
- ALWAYS group by THEME or CAPABILITY, not by commit type (feat/fix/refactor).
- ALWAYS use concrete language: "You can now do X" not "Added X feature".
</rules>

<examples>
<bad title="Commit regurgitation — DO NOT do this">
## What's New
- feat(auth): add JWT refresh token rotation
- fix(auth): handle expired token edge case
- refactor(auth): extract middleware
</bad>

<good title="User-impact narrative — DO this">
## 🔐 Smarter Authentication

Token refresh is now automatic and seamless. Sessions no longer expire mid-task — system silently rotates credentials in background. If you've been frustrated by random logouts, this release fixes that.
</good>

<bad title="Vague filler — DO NOT do this">
## Improvements
- Various performance improvements
- Bug fixes and stability enhancements
</bad>

<good title="Specific and measurable — DO this">
## ⚡ 3x Faster Rule Parsing

Rules are now cached by file modification time. If your project has 50+ rule files, you'll notice startup is noticeably faster — we measured 3x improvement in our test suite.
</good>
</examples>

### Drafting Process

1. **Analyze** commit list from Step 5's preview. Identify 2-5 themes that matter to users.
2. **Write** summary to `/tmp/release-summary-v${NEW_VERSION}.md`.
3. **Present** draft to user for review and approval before applying.

```bash
# Write your draft here
cat > /tmp/release-summary-v${NEW_VERSION}.md << 'SUMMARY_EOF'
{your_enhanced_summary}
SUMMARY_EOF

cat /tmp/release-summary-v${NEW_VERSION}.md
```

<agent-instruction>
After drafting, ask user:
> "Here's release summary I drafted. This will appear AT THE TOP of release notes, above auto-generated commit changelog and contributor thanks. Want me to adjust anything before applying?"

Do NOT proceed to Step 7 without user confirmation.
</agent-instruction>

---

## STEP 7: APPLY ENHANCED SUMMARY TO RELEASE

**Skip this step ONLY if user opted out of enhanced summary in Step 6** — proceed directly to Step 8.

<architecture>
Final release note structure:

```
┌─────────────────────────────────────┐
│  Enhanced Summary (from Step 6)     │  ← You wrote this
│  - Theme-based, user-impact focused │
├─────────────────────────────────────┤
│  ---  (separator)                   │
├─────────────────────────────────────┤
│  Auto-generated Commit Changelog    │  ← Workflow wrote this
│  - feat/fix/refactor grouped        │
│  - Contributor thank-you messages   │
└─────────────────────────────────────┘
```
</architecture>

<zero-content-loss-policy>
- Fetch existing release body FIRST
- PREPEND your summary above it
- Existing auto-generated content must remain 100% INTACT
- NOT A SINGLE CHARACTER of existing content may be removed or modified
</zero-content-loss-policy>

```bash
# 1. Fetch existing auto-generated body
EXISTING_BODY=$(gh release view "v${NEW_VERSION}" --json body --jq '.body')

# 2. Combine: enhanced summary on top, auto-generated below
{
  cat /tmp/release-summary-v${NEW_VERSION}.md
  echo ""
  echo "---"
  echo ""
  echo "$EXISTING_BODY"
} > /tmp/final-release-v${NEW_VERSION}.md

# 3. Update release (additive only)
gh release edit "v${NEW_VERSION}" --notes-file /tmp/final-release-v${NEW_VERSION}.md

# 4. Confirm
echo "✅ Release v${NEW_VERSION} updated with enhanced summary."
gh release view "v${NEW_VERSION}" --json url --jq '.url'
```

---

## STEP 8: VERIFY NPM PUBLICATION

Poll npm registry until new version appears:
```bash
npm view oh-my-opencode version
```

Compare with expected version. If not matching after 2 minutes, warn user about npm propagation delay.

---

## STEP 8.5: WAIT FOR PLATFORM WORKFLOW COMPLETION

Main publish workflow triggers separate `publish-platform` workflow for platform-specific binaries.

1. Find publish-platform workflow run triggered by main workflow:
```bash
gh run list --workflow=publish-platform --limit=1 --json databaseId,status,conclusion --jq '.[0]'
```

2. Poll workflow status every 30 seconds until completion:
```bash
gh run view {platform_run_id} --json status,conclusion --jq '{status: .status, conclusion: .conclusion}'
```

**IMPORTANT: Use polling loop, NOT sleep commands.**

If conclusion is `failure`, show error logs:
```bash
gh run view {platform_run_id} --log-failed
```

---

## STEP 8.6: VERIFY PLATFORM BINARY PACKAGES

After publish-platform workflow completes, verify all 7 platform packages are published:

```bash
PLATFORMS="darwin-arm64 darwin-x64 linux-x64 linux-arm64 linux-x64-musl linux-arm64-musl windows-x64"
for PLATFORM in $PLATFORMS; do
  npm view "oh-my-opencode-${PLATFORM}" version
done
```

All 7 packages should show same version as main package (`${NEW_VERSION}`).

**Expected packages:**
| Package | Description |
|---------|-------------|
| `oh-my-opencode-darwin-arm64` | macOS Apple Silicon |
| `oh-my-opencode-darwin-x64` | macOS Intel |
| `oh-my-opencode-linux-x64` | Linux x64 (glibc) |
| `oh-my-opencode-linux-arm64` | Linux ARM64 (glibc) |
| `oh-my-opencode-linux-x64-musl` | Linux x64 (musl/Alpine) |
| `oh-my-opencode-linux-arm64-musl` | Linux ARM64 (musl/Alpine) |
| `oh-my-opencode-windows-x64` | Windows x64 |

If any platform package version doesn't match, warn user and suggest checking publish-platform workflow logs.

---

## STEP 9: FINAL CONFIRMATION

Report success to user with:
- New version number
- GitHub release URL: https://github.com/code-yeongyu/oh-my-opencode/releases/tag/v{version}
- npm package URL: https://www.npmjs.com/package/oh-my-opencode
- Platform packages status: List all 7 platform packages with their versions

---

## ERROR HANDLING

- **Workflow fails**: Show failed logs, suggest checking Actions tab
- **Release not found**: Wait and retry, may be propagation delay
- **npm not updated**: npm can take 1-5 minutes to propagate, inform user
- **Permission denied**: User may need to re-authenticate with `gh auth login`
- **Platform workflow fails**: Show logs from publish-platform workflow, check which platform failed
- **Platform package missing**: Some platforms may fail due to cross-compilation issues, suggest re-running publish-platform workflow manually

## LANGUAGE

Respond to user in English.

</command-instruction>

<current-context>
<published-version>
!`npm view oh-my-opencode version 2>/dev/null || echo "not published"`
</published-version>
<local-version>
!`node -p "require('./package.json').version" 2>/dev/null || echo "unknown"`
</local-version>
<git-status>
!`git status --porcelain`
</git-status>
<recent-commits>
!`npm view oh-my-opencode version 2>/dev/null | xargs -I{} git log "v{}"..HEAD --oneline 2>/dev/null | head -15 || echo "no commits"`
</recent-commits>
</current-context>

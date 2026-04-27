# src/hooks/ — 52 Hooks

**Generated:** 2026-04-18

## OVERVIEW

52 hooks: Core(43) + Continuation(7) + Skill(2). Factory: `createXXXHook(deps) → HookFunction`.

## TIERS

### Tier 1: Session (24)

| Hook | Event | Purpose |
|------|-------|---------|
| contextWindowMonitor | session.idle | Context % |
| preemptiveCompaction | session.idle | Pre-limit |
| sessionRecovery | session.error | Auto-retry |
| sessionNotification | session.idle | OS notify |
| thinkMode | chat.params | Extended think |
| anthropicContextWindowLimitRecovery | session.error | Recovery |
| autoUpdateChecker | session.created | npm check |
| agentUsageReminder | chat.message | Agent remind |
| nonInteractiveEnv | chat.message | `run` adjust |
| interactiveBashSession | tool.execute | Tmux |
| ralphLoop | event | Dev loop |
| editErrorRecovery | tool.execute.after | Retry edits |
| delegateTaskRetry | tool.execute.after | Retry |
| startWork | chat.message | /start-work |
| prometheusMdOnly | tool.execute.before | .md-only |
| sisyphusJuniorNotepad | chat.message | Notepad |
| questionLabelTruncator | tool.execute.before | Trunc labels |
| taskResumeInfo | chat.message | Resume |
| anthropicEffort | chat.params | Reasoning |
| modelFallback | chat.params | Fallback |
| noSisyphusGpt | chat.message | Block GPT |
| noHephaestusNonGpt | chat.message | Block non-GPT |
| runtimeFallback | event | API fallback |
| legacyPluginToast | chat.message | Legacy toast |

### Tier 2: Tool Guard (14)

| Hook | Event | Purpose |
|------|-------|---------|
| commentChecker | tool.execute.after | Block AI comments |
| toolOutputTruncator | tool.execute.after | Truncate |
| directoryAgentsInjector | tool.execute.before | Inject AGENTS.md |
| directoryReadmeInjector | tool.execute.before | Inject README.md |
| emptyTaskResponseDetector | tool.execute.after | Empty detect |
| rulesInjector | tool.execute.before | Rules |
| tasksTodowriteDisabler | tool.execute.before | Disable TodoWrite |
| writeExistingFileGuard | tool.execute.before | Read-before-Write |
| bashFileReadGuard | tool.execute.before | Bash guard |
| readImageResizer | tool.execute.after | Resize |
| todoDescriptionOverride | tool.execute.before | Todo override |
| webfetchRedirectGuard | tool.execute.before | Redirect guard |
| hashlineReadEnhancer | tool.execute.after | Line hashes |
| jsonErrorRecovery | tool.execute.after | JSON detect |

### Tier 3: Transform (5)

| Hook | Event | Purpose |
|------|-------|---------|
| claudeCodeHooks | messages.transform | CC compat |
| keywordDetector | messages.transform | Mode detect |
| contextInjectorMessagesTransform | messages.transform | Context inject |
| thinkingBlockValidator | messages.transform | <thinking> |
| toolPairValidator | messages.transform | Tool pair |

### Tier 4: Continuation (7)

| Hook | Event | Purpose |
|------|-------|---------|
| stopContinuationGuard | chat.message | /stop-continuation |
| compactionContextInjector | session.compacted | Context inject |
| compactionTodoPreserver | session.compacted | Todo preserve |
| todoContinuationEnforcer | session.idle | **Boulder**: force continue |
| unstableAgentBabysitter | session.idle | Monitor |
| backgroundNotificationHook | event | Background notify |
| atlasHook | event | Boulder |

### Tier 5: Skill (2)

| Hook | Event | Purpose |
|------|-------|---------|
| categorySkillReminder | chat.message | Category+skill |
| autoSlashCommand | chat.message | /command |

## COMPLEX HOOKS

- **anthropic-context-window-limit-recovery** (31 files, ~2232 LOC): Recovery via truncation, compaction, summary
- **atlas** (17 files, ~1976 LOC): Boulder orchestrator
- **ralph-loop** (14 files, ~1687 LOC): `/ralph-loop` dev loop. State in `.sisyphus/ralph-loop.local.md`. Max 100 iterations
- **todo-continuation-enforcer** (13 files, ~2061 LOC): Boulder. 2s countdown → injection. Backoff 30s×2
- **keyword-detector** (~1665 LOC): Detects ultrawork/search/analyze/prove-yourself
- **rules-injector** (19 files, ~1604 LOC): Conditional rules from AGENTS.md, config, skills

## STANDALONE

| File | Purpose |
|------|---------|
| context-window-monitor.ts | Context % |
| preemptive-compaction.ts | Pre-limit |
| tool-output-truncator.ts | Token trunc |
| session-notification.ts | OS notify |
| empty-task-response-detector.ts | Empty detect |
| session-todo-status.ts | Todo |

## ADD HOOK

1. `src/hooks/{name}/index.ts` — `createXXXHook(deps)`
2. Register: `src/plugin/hooks/create-{tier}-hooks.ts`
3. Add: `src/config/schema/hooks.ts`
4. Hook receives `(event, ctx)` — return varies

# src/tools/ — 26 Tools

**Generated:** 2026-04-18

## OVERVIEW

26 tools via `createToolRegistry()`. Factory: 19. Direct: 7.

## CATALOG

### Task (4)

| Tool | Factory |
|------|---------|
| `task_create` | `createTaskCreateTool` |
| `task_list` | `createTaskList` |
| `task_get` | `createTaskGetTool` |
| `task_update` | `createTaskUpdateTool` |

### Delegation (1)

| Tool | Factory |
|------|---------|
| `task` | `createDelegateTask` |

**Categories**: visual-engineering, ultrabrain, deep, artistry, quick, unspecified-low, unspecified-high, writing

### Agent (1)

| Tool | Factory |
|------|---------|
| `call_omo_agent` | `createCallOmoAgent` |

### Background (2)

| Tool | Factory |
|------|---------|
| `background_output` | `createBackgroundOutput` |
| `background_cancel` | `createBackgroundCancel` |

### LSP (6)

| Tool |
|------|
| `lsp_goto_definition` |
| `lsp_find_references` |
| `lsp_symbols` |
| `lsp_diagnostics` |
| `lsp_prepare_rename` |
| `lsp_rename` |

### Search (4)

| Tool | Factory |
|------|---------|
| `ast_grep_search` | `createAstGrepTools` |
| `ast_grep_replace` | `createAstGrepTools` |
| `grep` | `createGrepTools` |
| `glob` | `createGlobTools` |

### Session (4)

| Tool | Factory |
|------|---------|
| `session_list` | `createSessionManagerTools` |
| `session_read` | `createSessionManagerTools` |
| `session_search` | `createSessionManagerTools` |
| `session_info` | `createSessionManagerTools` |

### Skill (2)

| Tool | Factory |
|------|---------|
| `skill` | `createSkillTool` |
| `skill_mcp` | `createSkillMcpTool` |

### System (2)

| Tool | Factory |
|------|---------|
| `interactive_bash` | Direct |
| `look_at` | `createLookAt` |

### Edit (1)

| Tool | Factory |
|------|---------|
| `hashline_edit` | `createHashlineEditTool` |

## CATEGORIES

| Category | Model |
|----------|-------|
| visual-engineering | gemini-3.1-pro |
| ultrabrain | gpt-5.5 |
| deep | gpt-5.5 |
| artistry | gemini-3.1-pro |
| quick | gpt-5.4-mini |
| unspecified-low | claude-sonnet-4-6 |
| unspecified-high | claude-opus-4-7 |
| writing | gemini-3-flash |

## ADD

1. `src/tools/{name}/index.ts`
2. `src/tools/{name}/types.ts`
3. `src/tools/{name}/tools.ts`
4. Register: `src/plugin/tool-registry.ts`

# Antigravity CLI (`agy`) — Quick Reference Cheatsheet

Keep this cheatsheet open during hands-on labs or print it for reference.

---

## 1. CLI Launch Commands

```bash
# Interactive sessions
agy                                  # Launch interactive REPL (default mode)
agy -i "Initial prompt/context"      # Start interactively with prompt seeded
agy -c                               # Continue most recent conversation
agy --conversation <id>              # Resume a specific conversation by ID
agy --mode accept-edits              # Start with auto-accepted file edits
agy --mode plan                      # Start in planning mode (outline before code)

# Model & reasoning controls
agy --model gemini-3.1-pro-high      # Pin a specific model slug (see: agy models)
agy --effort low|medium|high         # Set reasoning/thinking effort
agy --sandbox                        # Enable OS terminal restrictions
agy --dangerously-skip-permissions   # Auto-approve all tool calls (use with caution)

# Headless & CI scripting
agy -p "Explain @./src/app.py"       # One-shot print mode (non-interactive)
cat error.log | agy -p "Diagnose"    # Pipe stdin into print mode
agy -p "Check" --output-format json  # Machine-readable JSON output
agy -p "Count" --output-format json \
    --json-schema '{"type":"object","properties":{"count":{"type":"integer"}}}'
```

---

## 2. In-Session Shortcuts & Prompt Syntax

| Syntax / Shortcut | Action |
|---|---|
| `@path/to/file` | Reference file content in prompt (e.g. `@src/main.js`) |
| `@./dir/` | Reference entire directory recursively |
| `!command` | Execute shell command (e.g. `!git status`, `!npm test`) |
| `Shift + Tab` | **Cycle execution modes**: `default` → `accept-edits` → `plan` |
| `Ctrl + R` | Open / toggle the **Artifact Review** panel to inspect diffs |
| `Ctrl + G` | Open current prompt buffer in `$EDITOR` (Vim/Nano/VS Code) |
| `Ctrl + B` | Background a running shell execution (view in `/tasks`) |
| `Ctrl + L` | Clear the terminal screen |
| `Esc` | Interrupt active agent response / tool execution |
| `Ctrl + D` (twice) | Exit interactive session |

---

## 3. Essential Slash Commands

### Context & Exploration
* `/context` — Inspect loaded `AGENTS.md` files and active token counts.
* `/codesearch <regex>` (alias `/cs`) — Fast regex search across workspace (`-F` for literal, `file:*.py` to filter).
* `/btw <question>` — Ask a quick side question **without polluting** the active task's token history.

### Safety & Session Control
* `/diff` — Review code changes made by the agent in this session.
* `/rewind` — Roll back conversation turns to recover from dead ends.
* `/fork` — Clone current conversation into a branch for risky experiments.
* `/resume` — Interactive browser for SQLite conversation history.
* `/permissions` — Manage tool allow/deny rules (`run_command`, file edits).

### Models & Tools
* `/model` — Switch active model mid-session (Gemini Pro/Flash, Claude Sonnet/Opus, GPT-OSS).
* `/effort` — Adjust thinking effort (`low`, `medium`, `high`).
* `/mcp` — View connected Model Context Protocol servers and reload configuration.
* `/agents` — Monitor dispatched background subagents.
* `/tasks` — View and manage background shell processes.
* `/settings` — Interactive settings configuration editor.
* `/quota` · `/credits` · `/usage` — Check API quota, rate limits, and G1 credits.

---

## 4. Configuration File Locations

| File | Scope | Purpose |
|---|---|---|
| `~/.gemini/antigravity-cli/settings.json` | User | Flat configuration: `agentMode`, `editorMode`, `toolPermission`, `permissions.allow` |
| `~/.gemini/config/mcp_config.json` | User (Global) | MCP servers used across all projects (Context7, filesystem, DBs) |
| `.agents/mcp_config.json` | Project | Project-specific MCP servers (checked into Git) |
| `AGENTS.md` | Project / Subdir | Project memory and instructions (hierarchical; overrides root) |
| `~/.gemini/AGENTS.md` | User (Global) | Personal standards and global developer preferences |
| `~/.gemini/config/skills/<name>/SKILL.md` | User (Global) | Reusable global skills (surfaces as `/<name>`) |
| `.agents/skills/<name>/SKILL.md` | Project | Project-scoped skills shared with your team |
| `.agents/agents/<name>.md` | Project | Custom markdown subagents (`subagent: true`, `model: flash`) |
| `~/.gemini/config/hooks.json` | User (Global) | Lifecycle hooks (`PreToolUse`, `PostToolUse`, `Stop`) |

---

## 5. Agentic Prompting Pattern

```text
1. Ground with files:    "Inspect @src/routes/weather.py and @tests/test_weather.py."
2. Define exact goal:   "Add input validation for city names (alpha characters only, max 50 chars)."
3. Specify verification: "Run !pytest to verify that all existing and new tests pass."
4. Review before commit: "Use /diff or Ctrl+R to inspect changes, then commit."
```

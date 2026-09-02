# Configuration Examples

Example configuration files for the Antigravity CLI (`agy`). Two different files:

| File | Real location | Purpose |
|------|---------------|---------|
| `settings-*.json` | `~/.gemini/antigravity-cli/settings.json` | CLI behaviour: modes, permissions, editor, UI |
| `mcp_config.json` | `~/.gemini/config/mcp_config.json` (global) or `.agents/mcp_config.json` (project) | MCP servers |

`settings.json` is a **flat** key/value file. See every key and your current
values with `agy -p "/settings"`, or edit interactively with `/settings`.

## Files

### settings-basic.json
Sensible defaults: `request-review` permissions, interactive diff review before
writes, tips on. **Use when**: getting started.

### settings-advanced.json
Productivity setup: Vim editor mode, `accept-edits` agent mode, pre-approved
shell commands in `permissions.allow`, custom status line.
**Use when**: you're comfortable with `agy` and want fewer prompts.

### settings-safe.json
Locked down: `strict` tool permissions, terminal sandbox on, `plan` mode by
default, no access outside the workspace, no G1 credit spend.
**Use when**: exploring untrusted code or training new users.

### mcp_config.json
Context7 (remote, `serverUrl` + `headers`), filesystem (stdio, with
`disabledTools`), and a disabled postgres entry. Remote servers must use
`serverUrl` — `url`/`httpUrl` are rejected. No comment keys: keep the file to
`mcpServers` only.

## Usage

```bash
# CLI settings (user-level; there is no separate project settings file)
cp settings-advanced.json ~/.gemini/antigravity-cli/settings.json

# MCP servers — global, or per project
cp mcp_config.json ~/.gemini/config/mcp_config.json
mkdir -p .agents && cp mcp_config.json .agents/mcp_config.json
```

Then start `agy` (or `/mcp` in a running session to reload MCP servers).

## API keys in MCP configs

`${VAR_NAME}` is **not** expanded in `mcp_config.json` (verified on 1.1.15 —
the literal string is sent to the server). Paste keys literally, and keep
keyed servers in the global `~/.gemini/config/mcp_config.json` rather than a
committed `.agents/mcp_config.json`. Context7 keys are free: <https://context7.com>.

### hooks.json (+ scripts/)
Lifecycle hooks: a `PreToolUse` hook that denies `git push --force`, and a
`Stop` hook that fires a desktop notification when a turn finishes.

```bash
cp hooks.json ~/.gemini/config/ && cp -r scripts ~/.gemini/config/
```

Start `agy` and run `/hooks` to see them registered. (CLI 1.1.24 loads hooks
from `~/.gemini/config/` and from plugins; a workspace `.agents/hooks.json` is
documented but still not picked up — re-verified 2026-09-02.) If you already have a
`~/.gemini/config/hooks.json`, merge the named entries instead of overwriting.
Don't add `_comment`-style keys: every top-level key must be a hook object, and
a stray string makes the CLI silently drop the entire file (`/hooks` shows nothing). Hook commands run from the
directory containing `hooks.json`, read JSON on stdin, and must print JSON.

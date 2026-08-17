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
Stdio (`command`/`args`/`env`) and remote (`serverUrl`/`headers`) servers,
plus `disabledTools` and `disabled` for narrowing exposure.

## Usage

```bash
# CLI settings (user-level; there is no separate project settings file)
cp settings-advanced.json ~/.gemini/antigravity-cli/settings.json

# MCP servers — global, or per project
cp mcp_config.json ~/.gemini/config/mcp_config.json
mkdir -p .agents && cp mcp_config.json .agents/mcp_config.json
```

Then start `agy` (or `/mcp` in a running session to reload MCP servers).

## Environment Variables

MCP configs use `${VAR_NAME}` for substitution. Export them before starting:

```bash
export FIRECRAWL_API_KEY="fc-..."
export CONTEXT7_API_KEY="ctx7sk-..."
```

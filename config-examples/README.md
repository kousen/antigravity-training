# Configuration Examples

This folder contains illustrative Antigravity CLI configuration snippets.

Antigravity CLI stores user settings in:

```text
~/.gemini/antigravity-cli/settings.json
```

Keybindings live in:

```text
~/.gemini/antigravity-cli/keybindings.json
```

MCP server configuration is separate from general settings. If you are migrating from Gemini CLI, do not assume old inline `mcpServers` entries belong in `settings.json`; use the Antigravity migration guide and current docs.

## Files

- `settings-basic.json`: small personal-preference example
- `settings-advanced.json`: more opinionated UI/editor example
- `settings-safe.json`: classroom safety notes in JSON form
- `settings-mcp.json`: MCP-related settings notes for classroom discussion

Treat these as teaching material, not guaranteed copy/paste production config. Antigravity is moving quickly enough that the live docs win.

## Usage

```bash
mkdir -p ~/.gemini/antigravity-cli
cp settings-basic.json ~/.gemini/antigravity-cli/settings.json
agy
```

Inside the TUI, prefer:

```text
/config
/settings
/permissions
/keybindings
```

## References

- https://antigravity.google/docs/cli-settings
- https://antigravity.google/docs/cli-permissions
- https://antigravity.google/docs/gcli-migration

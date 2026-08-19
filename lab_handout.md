# Antigravity CLI Training Labs

This document contains hands-on exercises for learning to use the Antigravity CLI (`agy`) for professional development workflows.

## Table of Contents

1. [Lab 1: Getting Started and Project Creation](#lab-1-getting-started-and-project-creation)
2. [Lab 2: Code Exploration](#lab-2-code-exploration)
3. [Lab 3: AGENTS.md and Context Management](#lab-3-agentsmd-and-context-management)
4. [Lab 4: Test Generation](#lab-4-test-generation)
5. [Lab 5: Configuration and Safety](#lab-5-configuration-and-safety)
6. [Lab 6: Advanced Features](#lab-6-advanced-features)
7. [Lab 7: Optional Team Adoption Module](#lab-7-optional-team-adoption-module)

## Prerequisites

- Antigravity CLI installed (version 1.1.13 or later — check with `agy --version`, update with `agy update`):
  ```bash
  curl -fsSL https://antigravity.google/cli/install.sh | bash
  ```
  This installs the `agy` binary to `~/.local/bin/`. Verify with `agy --version`.
- Authentication: sign in with your Google account on first run, **or** set
  `export ANTIGRAVITY_API_KEY="your-key"` for scripts/headless use.
- Git installed and configured
- Development environment for Python, JavaScript, or Java

## Heads-up: Tool Permissions

When `agy` wants to run a tool (edit a file, run a shell command), it prompts
for approval by default. You can manage allow/deny rules from inside a session
with `/permissions`. To auto-approve everything for a step, launch with
`--dangerously-skip-permissions` (use sparingly). To keep file operations
contained, add `--sandbox`.

```bash
agy                                   # default: prompt per tool call
agy --dangerously-skip-permissions    # auto-approve all (use with care)
agy --sandbox                         # terminal restrictions enabled
```

Use `Ctrl+R` to open the Artifact Review panel and inspect proposed changes,
and `Esc` to interrupt the agent mid-stream.

---

## Lab 1: Getting Started and Project Creation

**Duration**: 25 minutes

**Goal**: Get comfortable with the Antigravity CLI while building a task manager application from scratch

### Setup

1. Create a new empty directory:
   ```bash
   mkdir my-task-manager && cd my-task-manager
   ```

2. Initialize git:
   ```bash
   git init
   ```

3. Start the Antigravity CLI:
   ```bash
   agy
   ```

### Exercises

1. **Explore the interface**:
   ```
   What are your main capabilities for helping with development?
   ```

   Then explore the available commands:
   ```
   /help
   ```
   Review the slash commands before diving in.

2. **Project foundation**:
   ```
   Create a Node.js task manager application with:
   - A Task class with id, title, description, status, and dueDate
   - Functions to add, remove, update, and list tasks
   - JSON file storage for persistence
   - A simple CLI interface using readline
   ```

3. **Check your work with shell integration**:
   ```
   !ls -la
   ```
   Use shell commands to see what the agent created. Observe how the output is displayed.

4. **Enhanced functionality** *(Stretch Goal - if time permits)*:
   ```
   Add these features to the task manager:
   - Filter tasks by status (pending, in-progress, completed)
   - Sort tasks by due date
   - Search tasks by title or description
   - Colored console output for different statuses
   ```

5. **Check context and tokens**:
   ```
   /context
   ```
   See what context the agent has loaded and current token usage.

6. **Testing**:
   ```
   Create comprehensive tests for the task manager using Jest:
   - Unit tests for all Task class methods
   - Integration tests for file persistence
   - Edge cases like empty lists, invalid inputs
   ```

7. **Documentation**:
   ```
   Create a README.md with:
   - Project description and features
   - Installation instructions
   - Usage examples with sample output
   - API documentation for developers
   ```

8. **Keyboard shortcuts**:
   Before moving to git, try these shortcuts:
   - `Ctrl+L` to clear the screen
   - `Ctrl+R` to open the Artifact Review panel (review proposed changes)
   - `Esc` to interrupt the agent if a response runs long

9. **Git workflow**:
   ```
   Help me create a proper commit history:
   1. Commit the initial project structure
   2. Create a feature branch for "priority-levels"
   3. Add priority (low, medium, high) to tasks
   4. Create a commit message following conventional commits
   ```

### Expected Outcomes

- Understand the Antigravity CLI's conversational interface
- Know essential slash commands and keyboard shortcuts
- Build a functional application from scratch
- Experience iterative development with AI assistance
- Practice the full development cycle: concept → code → tests → docs
- Be comfortable with shell integration

[← Back to Table of Contents](#table-of-contents)

---

## Lab 2: Code Exploration

**Duration**: 15 minutes

**Goal**: Use the Antigravity CLI to understand complex codebases

### Setup

Choose one of the provided exercise projects:
- `exercises/python/weather-app` (Flask application)
- `exercises/javascript/task-manager` (Node.js CLI app)
- `exercises/java/bookstore-api` (Spring Boot REST API)

Navigate to the project directory and start the Antigravity CLI with `agy`.

### Exercises

1. **Project overview**:
   ```
   Analyze the architecture of this project and explain the main components.
   Reference @./src/ (or @. for a flat project like the Python weather app) to examine the source code.
   ```

2. **Technology identification**:
   ```
   What frameworks, libraries, and tools does this project use?
   Check @./package.json or @./pom.xml for dependencies.
   ```

3. **Entry point discovery**:
   ```
   Show me the main entry point of this application and trace the
   initialization flow.
   ```

4. **File reference practice**:
   ```
   Explain how the main routing logic handles incoming requests.
   - Python: @app/routes/weather.py
   - Java: @src/main/java/com/example/bookstore/controller/BookController.java
   - JavaScript: @src/taskManager.js
   ```

5. **Architecture documentation**:
   ```
   Create a Mermaid diagram showing the main components and their
   relationships in this project.
   ```

6. **Web search integration**:
   ```
   Search the web for best practices for [Flask/Express/Spring Boot]
   application structure and compare with this project.
   ```

### Expected Outcomes

- Quickly understand unfamiliar codebases
- Master file references with `@` syntax
- Leverage web search for current best practices
- Generate visual documentation

[← Back to Table of Contents](#table-of-contents)

---

## Lab 3: AGENTS.md and Context Management

**Duration**: 20 minutes

**Goal**: Set up effective project context using AGENTS.md files

> **Note**: Antigravity uses `AGENTS.md` as its documented context file. It
> also recognizes `GEMINI.md` and `CLAUDE.md`, so existing files keep working.

### Setup

Continue with the project from Lab 2, or start fresh in a new directory.

### Exercises

1. **Create an initial AGENTS.md**:
   ```
   Create an AGENTS.md for this project summarizing its purpose, tech
   stack, and how to run it.
   ```
   Review the generated file and understand its structure.

2. **Customize the context**:
   ```
   Update AGENTS.md to include:
   - Our team's coding standards (PEP 8 for Python, or equivalent)
   - Preferred testing frameworks and patterns
   - Current sprint focus: implementing caching
   - Code review checklist items
   ```

3. **Test context loading**:
   ```
   /context
   ```
   Verify your customizations are loaded.

4. **Create hierarchical context**:
   ```bash
   # Create subdirectory-specific context
   mkdir -p src/api
   ```

   Then ask the agent:
   ```
   Create an AGENTS.md file for the src/api/ directory that specifies:
   - All API endpoints should return JSON
   - Use consistent error response format
   - Include request validation
   - Document all endpoints with OpenAPI comments
   ```

5. **Global context setup**:
   ```
   Help me create a global AGENTS.md at ~/.gemini/AGENTS.md with:
   - My preferred coding style (concise, well-documented)
   - Common libraries I use across projects
   - My Git commit message format preferences
   ```

6. **Modular imports**:
   ```
   Break the project AGENTS.md into modular files:
   - Create docs/coding-standards.md
   - Create docs/api-guidelines.md
   - Update AGENTS.md to import these using @docs/coding-standards.md syntax
   ```

7. **Verify**:
   ```
   /context
   ```
   Confirm all contexts are properly loaded (restart the session if you
   edited files externally).

### Expected Outcomes

- Create effective AGENTS.md files
- Understand hierarchical context loading
- Use modular imports for maintainability
- Set up global and project-specific context

[← Back to Table of Contents](#table-of-contents)

---

## Lab 4: Test Generation

**Duration**: 15 minutes

**Goal**: Generate comprehensive test suites with the Antigravity CLI

### Setup

Use the project from previous labs or choose a new exercise project with existing source code.

### Exercises

1. **Unit test generation**:
   ```
   Create unit tests for a chosen file:
   - Java: @exercises/java/bookstore-api/src/main/java/com/example/bookstore/service/BookService.java using JUnit 5
   - JavaScript: @exercises/javascript/task-manager/src/taskManager.js using Jest
   - Python: @exercises/python/weather-app/app/services/weather_service.py using pytest

   Requirements:
   - Tests for all public methods
   - Edge cases (empty inputs, null values)
   - Mocking of external dependencies
   ```

2. **Test coverage analysis**:
   ```
   Analyze @./src/models/ and identify which classes and methods
   are missing test coverage. Generate tests to fill the gaps.
   ```

3. **Edge case discovery**:
   ```
   What edge cases should I test for the user authentication flow?
   List them and generate test cases for each.
   ```

4. **Integration tests**:
   ```
   Create integration tests for the API endpoints in @./src/routes/
   that test the full request-response cycle with test fixtures.
   ```

5. **Test data generation**:
   ```
   Generate realistic test fixtures for:
   - 10 sample users with varied data
   - 20 sample tasks with different statuses and dates
   - Edge cases like unicode characters, very long strings
   Save as JSON files in tests/fixtures/
   ```

6. **Run and verify**:
   ```bash
   # Execute the generated tests
   !pytest -v
   # Or for Node.js:
   !npm test
   ```

   Then ask:
   ```
   Analyze the test results and fix any failing tests.
   ```

### Expected Outcomes

- Generate comprehensive test suites
- Identify and test edge cases
- Create realistic test fixtures
- Iterate on failing tests

[← Back to Table of Contents](#table-of-contents)

---

## Lab 5: Configuration and Safety

**Duration**: 20 minutes

**Goal**: Configure the Antigravity CLI for safe, efficient workflows

### Setup

Create a test project for experimenting with configuration:
```bash
mkdir config-test && cd config-test
git init
echo "# Config Test" > README.md
```

### Exercises

1. **Explore settings**:
   ```
   /settings
   ```
   Review the current settings interface.

2. **Inspect and edit your settings file**:
   The CLI's settings live in `~/.gemini/antigravity-cli/settings.json`
   (a flat key/value file). Dump the current values without starting a
   session:
   ```bash
   agy -p "/settings"
   ```
   Then, in an interactive session, ask the agent:
   ```
   Update ~/.gemini/antigravity-cli/settings.json so that:
   - editorMode is "vim"
   - enableTerminalSandbox is false
   - showTips is false
   - agentMode is "accept-edits"
   ```
   Restart `agy` and confirm the Vim mode badge in the status line and that
   `Shift+Tab` shows `accept-edits` as the starting mode. Set `editorMode`
   back to `"default"` afterward if you prefer.

3. **Manage tool permissions**:
   ```
   /permissions
   ```
   Add an allow rule such as `command(git status)`, then look at the
   `permissions.allow` array that appears in `settings.json`.

   Then try the execution modes: press `Shift+Tab` to cycle
   `default` → `accept-edits` → `plan`, or launch with `agy --mode plan`.

4. **Test sandbox mode**:
   ```bash
   # Start in sandbox mode
   agy --sandbox
   ```

   Then try:
   ```
   Create a file called test.txt with "Hello World"
   ```
   Observe how sandbox mode affects file operations.

5. **Checkpoints and Artifact Review**:

   Create a complex file structure:
   ```
   Create a complex file structure:
   - src/index.js with a basic Express server
   - src/routes/api.js with sample routes
   - package.json with dependencies
   ```

   Then inspect what changed before accepting:
   ```
   /context
   ```
   Use `Ctrl+R` to open the Artifact Review panel and `/diff` to review
   the changes.

6. **Permission modes**:
   ```bash
   # Auto-approve all tool calls (use with care)
   agy --dangerously-skip-permissions
   ```

   Request a file edit and observe the auto-approval behavior. Compare it
   with the default (per-tool prompt) and with `--sandbox`, which only
   auto-approves commands that stay inside the sandbox.

7. **Switch models**:
   ```bash
   # List available models
   agy models

   # Launch with a specific model slug, optionally overriding effort
   agy --model gemini-3.7-flash-low
   agy --model gemini-3.1-pro-high --effort low
   ```
   Or switch mid-session with `/model` and `/effort`.

### Expected Outcomes

- Configure project-specific settings
- Understand sandbox mode and Artifact Review
- Practice permission rules and modes
- Switch between available models

[← Back to Table of Contents](#table-of-contents)

---

## Lab 6: Advanced Features

**Duration**: 30 minutes

**Goal**: Master MCP servers, plugins, skills, and session management

### Part A: Session Management (5 minutes)

1. **Create a session**:
   Start an interactive session and do some work:
   ```
   agy
   > Create a simple Python calculator module with add, subtract, multiply, divide
   > Add error handling for division by zero
   > Create tests for the calculator
   ```
   Exit with `Ctrl+D` `Ctrl+D` (press twice).

2. **Continue the most recent conversation**:
   ```bash
   agy -c
   ```
   Continue where you left off:
   ```
   Add a power function to the calculator and update the tests
   ```

3. **Resume a specific conversation**:
   ```bash
   agy --conversation <id>
   ```

4. **Conversation browser**:
   In interactive mode, run:
   ```
   /resume
   ```
   Browse and select earlier conversations (stored in SQLite).

### Part B: Plugins and Skills (10 minutes)

5. **List installed plugins**:
   ```bash
   agy plugin list
   ```
   Plugins bundle **skills** and **subagents** that the CLI discovers
   automatically.

6. **Import existing plugins**:
   ```bash
   # Reuse plugins you already have from Gemini or Claude
   agy plugin import gemini
   ```

7. **Install from a marketplace**:
   ```bash
   agy plugin install <name>@<marketplace>
   agy plugin enable <name>
   ```
   Skills from installed plugins surface as slash commands via autocomplete.

8. **Write (well, borrow) a skill**:
   Copy one of this repo's skills into your project and try it:
   ```bash
   mkdir -p .agents/skills
   cp -r <course-repo>/skills/review .agents/skills/
   ```
   Start `agy`, run `/skills` to confirm it loaded, then `/review @./src/calculator.py`.
   Now open `.agents/skills/review/SKILL.md`, add a "## Style" section with one
   rule of your own (e.g. "flag any function longer than 30 lines"), and run
   `/review` again. The `description` line is what tells the agent *when* to
   use it — keep it specific.

### Part C: MCP Server Integration (10 minutes)

9. **Locate the MCP config**:
   Servers are configured in a JSON file — global or per-project:
   ```bash
   $EDITOR ~/.gemini/config/mcp_config.json   # global
   $EDITOR .agents/mcp_config.json            # this project only
   ```
   Inside a session, `/mcp` shows server status and reloads the config.

10. **Configure Context7** (remote server — current library docs):
    Get a free API key at <https://context7.com> (sign in, then *API Keys*).
    Add to the **global** `~/.gemini/config/mcp_config.json`:
    ```json
    {
      "mcpServers": {
        "context7": {
          "serverUrl": "https://mcp.context7.com/mcp",
          "headers": { "CONTEXT7_API_KEY": "ctx7sk-your-key-here" }
        }
      }
    }
    ```
    Paste the key literally: `${CONTEXT7_API_KEY}`-style substitution is **not**
    performed in `mcp_config.json` (the literal string is sent and rejected).
    That's why keyed servers belong in the global file, not a committed
    `.agents/mcp_config.json`. Remote servers use `serverUrl`; `url`/`httpUrl`
    are not supported. Restart `agy`, or `/mcp` to reload.

11. **Add a stdio server** (local process — no key):
    ```json
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/a/folder"]
    }
    ```

12. **Test MCP integration**:
    In a session:
    ```
    Use context7 to look up the current Flask 3 documentation for blueprints,
    then tell me what changed versus what you already knew.
    ```
    You should see `resolve-library-id` and `query-docs` tool calls.

13. **Explore MCP tools**:
    ```
    What MCP tools are available in this session?
    Show me an example of using one of them.
    ```

### Part D: Non-Interactive (Print) Mode (5 minutes)

14. **Print mode for scripting**:
    ```bash
    agy -p "List the files in the current directory and describe each"
    ```
    Capture the output to a file for downstream processing.

15. **Bound the wait**:
    ```bash
    agy --print-timeout 2m -p "Explain the concept of microservices architecture"
    ```

16. **Piped workflows**:
    ```bash
    echo "What are the top 5 Python web frameworks?" | agy -p
    ```

17. **Structured output** (1.1.8+):
    ```bash
    # One JSON envelope: status, response, usage (incl. cache_read_tokens)
    agy -p "Summarize @./README.md in one sentence" --output-format json

    # Enforce a schema; the parsed answer lands in "structured_output"
    agy -p "How many .py files are in @./src?" --output-format json \
        --json-schema '{"type":"object","properties":{"count":{"type":"integer"}}}'
    ```
    Read-only slash commands also answer in print mode without spending
    quota — try `agy -p "/quota"` and `agy -p "/model"`.

### Part E: Subagents (optional, 5 minutes)

18. **Define and use a subagent**:
    Create `.agents/agents/test-writer.md`:
    ```markdown
    ---
    subagent: true
    model: flash
    ---
    # Test writer
    You write focused pytest unit tests. Never modify source files.
    ```
    Then in a session:
    ```
    Delegate to the test-writer subagent: write unit tests for @./src/calculator.py
    ```
    Watch it in `/agents`. Subagents run with their own context; their
    conversations stay separate in `/resume`. List agents from the shell
    with `agy agents`; launch straight into one with `agy --agent test-writer`.

### Expected Outcomes

After completing this lab:
- Manage and resume conversations effectively
- Install, import, and use plugins and skills
- Configure and use MCP servers (stdio and remote)
- Use print mode for automation
- Dispatch focused work to subagents

[← Back to Table of Contents](#table-of-contents)

---

## Lab 7: Optional Team Adoption Module

**Duration**: 30-45 minutes (optional / take-home)

**Goal**: Practice production-oriented workflows for authentication strategy, governance, plugins/MCP controls, and CI automation.

### Part A: Authentication Strategy (10 minutes)

1. **Compare auth options**:
   Create a short matrix in `AUTH_NOTES.md` that compares:
   - Google Sign-In (interactive)
   - Device-code flow (remote / SSH machines)
   - `ANTIGRAVITY_API_KEY` (scripts / headless)
   - G1 credits for overflow past standard quota

   Include when each is preferred and one drawback.

2. **Validate your setup**:
   ```bash
   agy --version
   agy -p "Reply with OK if you can read this"
   ```
   Confirm your environment is usable with the chosen auth setup. Check
   `/quota` and `/credits` in an interactive session.

### Part B: Governance and Safety Controls (10-15 minutes)

3. **Create a team-safe baseline**:
   In `~/.gemini/antigravity-cli/settings.json`, set `toolPermission` to
   `"request-review"` (or `"strict"`) and `agentMode` to `"default"`. Then
   define permission rules with `/permissions` that allow only the shell
   commands your team needs; everything else prompts.

   ```bash
   # Escape hatch for a trusted, sandboxed run only
   agy --sandbox --dangerously-skip-permissions
   ```

4. **Folder trust**:
   Antigravity tracks trusted folders in the `trustedWorkspaces` array of
   `~/.gemini/antigravity-cli/settings.json`.
   Open an untrusted repo and observe how trust affects settings, skills,
   and context loading. Treat untrusted repos with `--sandbox` and stricter
   `/permissions` rules.

5. **Enforce policy with a hook**:
   Copy `config-examples/hooks.json` and `config-examples/scripts/` from the
   course repo into `~/.gemini/config/` (hooks are global or plugin-scoped in
   CLI 1.1.13 — a workspace `.agents/hooks.json` isn't loaded yet). The
   `PreToolUse` hook on `run_command` reads the tool call from stdin and
   answers `{"decision":"deny"}` for `git push --force`. Start `agy`, run
   `/hooks` to confirm it loaded, then ask:
   ```
   Force-push the current branch to origin
   ```
   The agent should report that the command was blocked by the hook. Then
   add a `Stop` hook that runs `echo '{}'` after a desktop notification of
   your choice — that's the "tell me when it's done" pattern.

### Part C: Plugins + MCP Hardening (10-15 minutes)

6. **Plugin lifecycle drill**:
   ```bash
   agy plugin list
   agy plugin disable <one-plugin-name>
   agy plugin enable <one-plugin-name>
   ```
   Observe how discoverable skills and subagents change.

7. **MCP scoping exercise**:
   Update one MCP server in `~/.gemini/config/mcp_config.json` to:
   - Add `disabledTools` listing at least one sensitive tool
   - Set `"disabled": true` on a server you don't need today

   Reload with `/mcp` (or restart `agy`) and confirm the narrowed tool
   surface in a session.

8. **MCP resource prompt practice**:
   If your MCP server exposes resources, reference one in a prompt and
   summarize what changed versus a tool-only prompt.

### Part D: CI/Automation Pattern (10 minutes)

9. **Create a repeatable automation check**:
   Add a script snippet to `automation_notes.md`:
   ```bash
   agy -p "Review @./src/ for security issues" > review.txt
   verdict=$(agy -p "Does @./src/ contain any CRITICAL security issue?" \
     --output-format json \
     --json-schema '{"type":"object","properties":{"critical":{"type":"boolean"}}}' \
     | jq -r '.structured_output.critical')
   [ "$verdict" = "false" ] || { echo "Gate failed"; exit 1; }
   ```

10. **Post-process output**:
   Run the JSON variant once more with `--output-format stream-json` and
   watch the `init` / `step_update` / `result` events arrive — that's what a
   CI log or dashboard would consume.

### Expected Outcomes

After completing this optional lab:
- Choose the right auth method for local, team, and CI contexts
- Apply practical governance controls with settings, permissions, folder trust, and hooks
- Restrict MCP/plugin behavior to safer team defaults
- Build a basic non-interactive `agy` automation pattern

[← Back to Table of Contents](#table-of-contents)

---

## Tips for Success

### Effective Prompting

- **Be specific** about what you want to achieve
- **Use file references** (`@path/to/file`) for context
- **Iterate** for complex tasks - don't try everything at once
- **Provide examples** when the output format matters

### Best Practices

- Start with the default (per-tool approval) mode; reach for
  `--dangerously-skip-permissions` only after building trust
- Use Artifact Review (`Ctrl+R`) and `/diff` before accepting changes
- Keep AGENTS.md files updated with current project state
- Commit regularly to have a safety net
- Review all AI-generated code before accepting

### Common Issues and Solutions

**Issue**: The agent doesn't understand the project structure
**Solution**: Create a comprehensive AGENTS.md with architecture details

**Issue**: Generated code doesn't match project style
**Solution**: Add coding standards to your AGENTS.md

**Issue**: Rate limits
**Solution**: Check `/quota`; G1 credits cover overflow, or switch to a Flash model / lower `/effort`

**Issue**: Context not loading
**Solution**: Confirm your AGENTS.md location and reload the session; check with `/context`

**Issue**: MCP server not connecting
**Solution**: Check `~/.gemini/config/mcp_config.json` (or `.agents/mcp_config.json`), then `/mcp` to reload

---

## Next Steps

After completing these labs:

1. **Practice daily**: Use the Antigravity CLI for regular development tasks
2. **Customize**: Build your personal AGENTS.md and plugin/skill library
3. **Explore MCP**: Set up servers for your common tools and services
4. **Share**: Document workflows for your team
5. **Stay updated**: Run `agy changelog` and `agy update` to follow releases

## Additional Resources

- <a href="https://antigravity.google/docs" target="_blank">Antigravity CLI Documentation</a>
- <a href="https://github.com/google-antigravity/antigravity-cli" target="_blank">Antigravity CLI Source Repository</a>
- <a href="https://modelcontextprotocol.io/registry" target="_blank">MCP Server Registry</a>

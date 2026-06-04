# Antigravity CLI Training Labs

This document contains hands-on exercises for learning to use Antigravity CLI for professional development workflows.

## Table of Contents

1. [Lab 1: Getting Started and Project Creation](#lab-1-getting-started-and-project-creation)
2. [Lab 2: Code Exploration](#lab-2-code-exploration)
3. [Lab 3: Context Files and Rules](#lab-3-context-files-and-rules)
4. [Lab 4: Test Generation](#lab-4-test-generation)
5. [Lab 5: Configuration and Safety](#lab-5-configuration-and-safety)
6. [Lab 6: Advanced Features](#lab-6-advanced-features)
7. [Lab 7: Optional Team Adoption Module](#lab-7-optional-team-adoption-module)

## Prerequisites

- Antigravity CLI installed: `curl -fsSL https://antigravity.google/cli/install.sh | bash`
- Google sign-in completed on first launch
- Git installed and configured
- Development environment for Python, JavaScript, or Java
- Docker (optional, for sandbox mode)

## Heads-up: review the plan before approving work

Antigravity CLI is an agentic tool that can read, edit, and run commands in your project. For these labs, get in the habit of asking for a plan first, reviewing it, and then approving tool use.

Useful controls:

```bash
/permissions     # inspect or adjust tool permissions
/config          # open settings
/rewind          # back up if the conversation goes sideways
```

`Ctrl+G` opens your external editor for longer prompts.

---

## Lab 1: Getting Started and Project Creation

**Duration**: 25 minutes

**Goal**: Get comfortable with Antigravity CLI while building a task manager application from scratch

### Setup

1. Create a new empty directory:
   ```bash
   mkdir antigravity-task-demo && cd antigravity-task-demo
   ```

2. Initialize git:
   ```bash
   git init
   ```

3. Start Antigravity CLI:
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
   Use shell commands to see what Antigravity created. Observe how the output is displayed.

4. **Enhanced functionality** *(Stretch Goal - if time permits)*:
   ```
   Add these features to the task manager:
   - Filter tasks by status (pending, in-progress, completed)
   - Sort tasks by due date
   - Search tasks by title or description
   - Colored console output for different statuses
   ```

5. **Check loaded context**:
   ```
   What context files and rules did you load for this project?
   ```
   See what context Antigravity has loaded about your project.

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
   - `Ctrl+Y` to toggle YOLO mode (observe the indicator change)
   - `Ctrl+Y` again to toggle back to default mode

9. **Git workflow**:
   ```
   Help me create a proper commit history:
   1. Commit the initial project structure
   2. Create a feature branch for "priority-levels"
   3. Add priority (low, medium, high) to tasks
   4. Create a commit message following conventional commits
   ```

### Expected Outcomes

- Understand Antigravity CLI's conversational interface
- Know essential slash commands and keyboard shortcuts
- Build a functional application from scratch
- Experience iterative development with AI assistance
- Practice the full development cycle: concept → code → tests → docs
- Be comfortable with shell integration

[← Back to Table of Contents](#table-of-contents)

---

## Lab 2: Code Exploration

**Duration**: 15 minutes

**Goal**: Use Antigravity CLI to understand complex codebases

### Setup

Choose one of the provided exercise projects:
- `exercises/python/weather-app` (Flask application)
- `exercises/javascript/task-manager` (Node.js CLI app)
- `exercises/java/bookstore-api` (Spring Boot REST API)

Navigate to the project directory and start Antigravity CLI.

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

## Lab 3: Context Files and Rules

**Duration**: 20 minutes

**Goal**: Set up effective project context using `AGENTS.md`, `GEMINI.md`, and workspace rules.

### Setup

Continue with the project from Lab 2, or start fresh in a new directory.

### Exercises

1. **Create shared project rules**:
   ```
   Create an AGENTS.md file for this project with:
   - The tech stack and build/test commands
   - Coding standards
   - Preferred testing frameworks
   - A short code review checklist
   ```
   Review the file and keep it concise.

2. **Add Antigravity-specific context**:
   ```
   Create a GEMINI.md file that says:
   - Antigravity should propose a plan before large edits
   - Prefer small commits and visible test runs
   - Current sprint focus: implementing caching
   ```

3. **Test context loading**:
   ```
   What project rules and context files did you load for this session?
   ```
   Verify your customizations are loaded.

4. **Create hierarchical context**:
   ```bash
   # Create subdirectory-specific context
   mkdir -p src/api
   ```

   Then ask Antigravity:
   ```
   Create a rule file under .agents/rules/api.md that specifies:
   - All API endpoints should return JSON
   - Use consistent error response format
   - Include request validation
   - Document all endpoints with OpenAPI comments
   ```

5. **Global context setup**:
   ```
   Help me draft a global GEMINI.md at ~/.gemini/GEMINI.md with:
   - My preferred coding style (concise, well-documented)
   - Common libraries I use across projects
   - My Git commit message format preferences
   ```

6. **Modular imports**:
   ```
   Break the project AGENTS.md into modular files:
   - Create docs/coding-standards.md
   - Create docs/api-guidelines.md
   - Update AGENTS.md to reference these using @docs/coding-standards.md syntax
   ```

7. **Refresh and verify**:
   ```
   Re-read the project context and summarize the active rules.
   ```
   Confirm all contexts are properly loaded.

### Expected Outcomes

- Create effective `AGENTS.md`, `GEMINI.md`, and `.agents/rules` files
- Understand context loading and rule placement
- Use modular imports for maintainability
- Set up global and project-specific context

[← Back to Table of Contents](#table-of-contents)

---

## Lab 4: Test Generation

**Duration**: 15 minutes

**Goal**: Generate comprehensive test suites with Antigravity CLI

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

**Goal**: Configure Antigravity CLI for safe, efficient workflows

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

2. **Create a settings note**:
   ```
   Create docs/antigravity-settings.md with:
   - Where Antigravity CLI stores settings
   - Where keybindings are stored
   - How to open /config and /permissions
   - What settings you would use for a classroom demo
   ```

3. **Tool permissions**:
   ```
   Open /permissions and identify:
   - Which file tools are enabled
   - Which terminal tools require confirmation
   - What you would leave disabled for a risky repository
   ```

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

5. **Checkpointing practice**:

   Enable checkpointing in settings, then:
   ```
   Create a complex file structure:
   - src/index.js with a basic Express server
   - src/routes/api.js with sample routes
   - package.json with dependencies
   ```

   Then:
   ```
   /restore
   ```
   View available checkpoints.

6. **Permission modes**:
   ```bash
   # Start normally
   agy
   ```

   Request a file edit and observe the approval prompt.

   ```bash
   # Disposable demo only
   agy --dangerously-skip-permissions
   ```

   Try creating files and compare the difference.

7. **Keybindings**:
   ```
   Open /keybindings and find the shortcuts for:
   - Open editor
   - Exit CLI
   - Insert newline
   - Approve or decline a terminal command
   ```

### Expected Outcomes

- Understand Antigravity CLI settings locations
- Understand sandbox and checkpointing
- Practice permissions and keybindings

[← Back to Table of Contents](#table-of-contents)

---

## Lab 6: Advanced Features

**Duration**: 30 minutes

**Goal**: Master MCP servers, skills/plugins, subagents, and session management

### Part A: Session Management (5 minutes)

1. **Create a session**:
   Start an interactive session and do some work:
   ```
   agy
   > Create a simple Python calculator module with add, subtract, multiply, divide
   > Add error handling for division by zero
   > Create tests for the calculator
   ```
   Exit with `Ctrl+D`

2. **List sessions**:
   ```
   /resume
   ```

3. **Resume session**:
   ```
   /resume
   ```
   Continue where you left off:
   ```
   Add a power function to the calculator and update the tests
   ```

4. **Session browser and rewind**:
   In interactive mode, run:
   ```
   /resume
   /rewind
   ```
   Review what each workflow enables and when you'd prefer one over the other.

### Part B: Skills from Reusable Prompts (10 minutes)

5. **Create a review skill**:
   ```bash
   mkdir -p .agents/skills/code-review
   ```

   Then create `.agents/skills/code-review/SKILL.md`:
   ```markdown
   ---
   name: code-review
   description: Review code for security, performance, and best practices.
   ---

   Review the provided code for:
   - Security vulnerabilities (injection, credentials, validation)
   - Performance issues (inefficient algorithms, resource leaks)
   - Best practices and code quality

   Provide findings with severity levels:
   - CRITICAL: Must fix before deployment
   - WARNING: Should fix soon
   - INFO: Consider improving
   ```

6. **Test the skill**:
   In a new session, create a file to review:
   ```
   Create a file called sample.py with some intentionally problematic code:
   - SQL injection vulnerability
   - Hardcoded credentials
   - Inefficient loop
   ```

   Then invoke your skill:
   ```
   Use the code-review skill on @./sample.py.
   ```

7. **Create a docs skill**:
   Create `.agents/skills/docs/SKILL.md`:
   ```markdown
   ---
   name: docs
   description: Generate documentation for code.
   ---

   Generate comprehensive documentation for the provided code:
   - Function signatures with parameters and return types
   - Usage examples
   - Markdown format suitable for a README
   ```

### Part C: MCP Server Integration (10 minutes)

8. **Check available plugin/MCP support**:
   ```bash
   agy --help
   agy plugin list
   ```

9.  **Import compatible Gemini CLI plugins if needed**:
    ```bash
    agy plugin import gemini
    agy plugin list
    ```

10. **Configure Firecrawl MCP**:

    ```

    Help me configure the Firecrawl MCP server for Antigravity CLI:

    - Use the @modelcontextprotocol/server-firecrawl package

    - Set up my FIRECRAWL_API_KEY from environment

    - Ensure it allows scraping web content

    - Put MCP server settings in the Antigravity MCP configuration file, not general settings.json

    ```



11.  **Test MCP integration**:

    If configured:

    ```

    Use the Firecrawl MCP to search for "latest Antigravity CLI migration guide" and summarize the findings.

    ```

12. **Explore MCP tools**:
    ```
    What MCP tools are available in this session?
    Show me an example of using one of them.
    ```

13. **Prompt quality booster**:
    ```
    /prompt-suggest
    ```
    Ask Antigravity for 3 stronger variants of your last MCP prompt and compare the results.

### Part D: Non-Interactive Checks (5 minutes)

14. **Check current CLI flags**:
    ```bash
    agy --help
    ```

    Identify what non-interactive flags are available in the installed version.

14. **Run a one-shot prompt**:
    ```bash
    agy "List the files in current directory and describe each"
    ```

    Observe how much context the CLI loads in one-shot mode.

15. **Piped workflows**:
    ```bash
    echo "What are the top 5 Python web frameworks?" | agy
    ```

### Part E: Subagents and Plugins (optional, 5 minutes)

16. **Open the agents panel**:
    ```
    /agents
    ```

17. **Create a background task**:
    ```
    Start a background agent to inspect test coverage while I continue working here.
    ```

18. **Inspect plugin/skill options**:
    ```
    Show me what skills, plugins, and MCP servers are available in this workspace.
    ```

### Expected Outcomes

After completing this lab:
- Manage and resume sessions effectively
- Create reusable skills from prompt templates
- Configure and use MCP servers
- Use output formats for automation
- Understand subagents and plugin-oriented workflows

[← Back to Table of Contents](#table-of-contents)

---

## Lab 7: Optional Team Adoption Module

**Duration**: 30-45 minutes (optional / take-home)

**Goal**: Practice production-oriented workflows for authentication strategy, governance, skills/MCP controls, and CI automation.

### Part A: Authentication Strategy (10 minutes)

1. **Compare auth options**:
   Create a short matrix in `AUTH_NOTES.md` that compares:
   - Local browser sign-in
   - SSH authorization URL flow
   - Google Cloud project onboarding
   - ADC / service account credentials for CI where supported

   Include when each is preferred and one drawback.

2. **Validate one non-default path**:
   Choose one of these:
   - Vertex path (`GOOGLE_CLOUD_PROJECT`, `GOOGLE_CLOUD_LOCATION`)
   - SSH authorization flow

   Then run:
   ```bash
   agy --version
   agy --help
   ```
   Confirm your environment is usable with the chosen auth setup.

### Part B: Governance and Safety Controls (10-15 minutes)

3. **Create a team-safe project settings file**:
   In `docs/team-antigravity-policy.md`, document:
   - When to use `agy --sandbox`
   - Which permission prompts should stay enabled
   - When `--dangerously-skip-permissions` is acceptable

   Then open `/permissions` and compare the live settings with your policy note.

4. **Inspect hooks and policy behavior**:
   In interactive mode, run:
   ```
   /permissions
   /config
   ```
   Ask Antigravity to explain what each active control does and which risks it reduces.

### Part C: Skills + MCP Hardening (10-15 minutes)

5. **Skills lifecycle drill**:
   In interactive mode:
   ```
   Show me the workspace skills under .agents/skills.
   Explain which ones can be invoked manually.
   ```
   Observe how discoverable skills change.

6. **MCP scoping exercise**:
   Update one MCP server in Antigravity's MCP configuration to:
   - Add `includeTools` for only the tools you need
   - Add `excludeTools` for at least one sensitive tool

   Then run:
   ```bash
   agy plugin list
   ```
   In interactive mode:
   ```
   What MCP or plugin tools are available in this workspace?
   If I changed MCP configuration, do I need to restart this session?
   ```

7. **MCP resource prompt practice**:
   If your MCP server exposes resources, use one URI with `@...` in a prompt and summarize what changed versus a tool-only prompt.

### Part D: CI/Automation Pattern (10 minutes)

8. **Create a repeatable automation check**:
   Add a script snippet to `automation_notes.md`:
   ```bash
   agy "Review @./src/ for security issues and write review.md"
   if test -f review.md; then
     echo "Antigravity check completed"
   else
     echo "Antigravity check failed" && exit 1
   fi
   ```

9. **Post-process output**:
   Parse `review.md` with your preferred tool (`rg`, `awk`, Node, Python) and extract one phrase for a simple pass/fail decision.

### Expected Outcomes

After completing this optional lab:
- Choose the right auth method for local, team, and CI contexts
- Apply practical governance controls with settings, hooks, and policies
- Restrict MCP/skills behavior to safer team defaults
- Build a basic non-interactive Antigravity CLI automation pattern

[← Back to Table of Contents](#table-of-contents)

---

## Tips for Success

### Effective Prompting

- **Be specific** about what you want to achieve
- **Use file references** (`@path/to/file`) for context
- **Iterate** for complex tasks - don't try everything at once
- **Provide examples** when the output format matters

### Best Practices

- Start with normal permissions, skip prompts only in disposable demos
- Enable checkpointing before risky operations
- Keep `AGENTS.md`, `GEMINI.md`, and `.agents/rules` updated with current project state
- Commit regularly to have a safety net
- Review all AI-generated code before accepting

### Common Issues and Solutions

**Issue**: Antigravity doesn't understand the project structure
**Solution**: Create a concise `AGENTS.md` with architecture details

**Issue**: Generated code doesn't match project style
**Solution**: Add coding standards to `AGENTS.md` or `.agents/rules/`

**Issue**: The agent wants to run too much at once
**Solution**: Ask for a plan and split the task into smaller steps

**Issue**: Context not loading
**Solution**: Ask which context files were loaded and check file paths

**Issue**: MCP server not connecting
**Solution**: Check the Antigravity MCP/plugin configuration, run `agy plugin list`, and restart `agy` if newly imported tools do not appear

---

## Next Steps

After completing these labs:

1. **Practice daily**: Use Antigravity CLI for regular development tasks
2. **Customize**: Build your personal `GEMINI.md`, repo `AGENTS.md`, and workspace skills
3. **Explore MCP**: Set up servers for your common tools and services
4. **Share**: Document workflows for your team
5. **Stay updated**: Follow Antigravity CLI releases for new features

## Additional Resources

- <a href="https://antigravity.google/docs/cli-getting-started" target="_blank">Antigravity CLI Documentation</a>
- <a href="https://antigravity.google/docs/gcli-migration" target="_blank">Gemini CLI Migration Guide</a>
- <a href="https://modelcontextprotocol.io/registry" target="_blank">MCP Server Registry</a>

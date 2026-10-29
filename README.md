# Antigravity CLI Training Course

A comprehensive training course for mastering Google's Antigravity CLI (`agy`) - the AI coding agent that brings Gemini, Claude, and open models directly into your terminal.

## Course Overview

This 5-hour hands-on workshop covers everything from basic installation to advanced MCP configurations, plugins, and enterprise workflows.

### What You'll Learn

- **The Antigravity family**: how the CLI relates to the Antigravity 2.0 app and IDE
- **Installation & Setup**: Authentication strategies, environment configuration
- **Core Commands**: Interactive mode, one-shot prompts, file references
- **Context Management**: AGENTS.md files, hierarchical context loading
- **Safety & Control**: Sandbox mode, permission rules, Artifact Review
- **Advanced Features**: MCP integration, plugins, skills, subagents
- **Practical Skills**: Real-world exercises in Python, JavaScript, and Java

## Prerequisites

- Command-line experience
- Basic programming knowledge in at least one language (Python, JS, or Java)
- Git familiarity
- Google account for sign-in (or an `ANTIGRAVITY_API_KEY`)
- Node.js 18+ (only needed to run the Slidev presentation locally)

Run the pre-flight verification script to check your local environment before class:
```bash
./verify-setup.sh
```

### 📄 Latest PDF & Cheatsheet

- **[Latest Slides PDF](https://github.com/kousen/antigravity-training/releases/latest/download/antigravity-training-slides.pdf)** (Auto-built on `main`)
- **[Slides in the browser](<https://kousen.github.io/antigravity-training/>)** (GitHub Pages, deployed by [`deploy-slides-pages.yml`](.github/workflows/deploy-slides-pages.yml))
- **[Quick Reference Cheatsheet](./CHEATSHEET.md)** (CLI syntax, shortcuts, slash commands)

## Repository Structure

```
antigravity-training/
├── slides.md                     # Slidev presentation
├── lab_handout.md               # Progressive hands-on labs
├── CHEATSHEET.md                # 1-page quick reference cheatsheet
├── verify-setup.sh              # Pre-flight environment check
├── exercises/                    # Hands-on lab projects
│   ├── python/                  # Python projects
│   │   └── weather-app/         # Flask weather application
│   ├── javascript/              # JavaScript/TypeScript projects
│   │   └── task-manager/        # Node.js task manager (ESM)
│   └── java/                    # Java projects
│       └── bookstore-api/       # Spring Boot REST API (with mvnw)
├── solutions/                    # Reference solutions & demos
│   └── javascript/              # Task manager full solution
├── config-examples/              # Sample configurations
│   ├── settings-basic.json      # Starter settings
│   ├── settings-advanced.json   # Full-featured settings
│   ├── settings-safe.json       # Safety-focused settings
│   └── mcp_config.json          # MCP server config
├── context-examples/             # AGENTS.md / GEMINI.md templates
│   ├── python-flask.md          # Python Flask template
│   ├── java-spring.md           # Spring Boot template
│   └── typescript-react.md      # React project template
└── skills/                       # Custom skill examples (SKILL.md)
    ├── review/                  # /review code review
    └── test-gen/                # /test-gen unit tests
```

## Quick Start

### 1. Install Antigravity CLI

```bash
# macOS / Linux (installs the `agy` binary to ~/.local/bin)
curl -fsSL https://antigravity.google/cli/install.sh | bash

# Verify installation
agy --version
```

### 2. Authenticate

```bash
# First run launches Google Sign-In automatically
agy

# Or use an API key for scripts / headless use
export ANTIGRAVITY_API_KEY="your-api-key"
```

### 3. Run Your First Command

```bash
agy -p "Hello! What can you help me with?"
```

### 4. Start the Training

```bash
# Clone this repository
git clone https://github.com/kousen/antigravity-training
cd antigravity-training

# Install dependencies for slides
npm install

# Start the presentation
npm run dev

# Open browser to http://localhost:3030
```

## Course Schedule

| Time | Section | Lab |
|------|---------|-----|
| 0:00 – 0:45 | Foundation, setup, first project | Lab 1 |
| 0:45 – 1:45 | Code exploration and core operations | Lab 2 |
| 1:45 – 2:45 | Context management (AGENTS.md) and test generation | Labs 3–4 |
| 2:45 – 3:00 | Break | |
| 3:00 – 4:00 | Configuration, safety, permissions | Lab 5 |
| 4:00 – 4:45 | MCP, plugins, skills, subagents | Lab 6 |
| 4:45 – 5:00 | Automation patterns, governance, Q&A | Lab 7 (optional / take-home) |

## Key Antigravity CLI Features Covered

### Core Features
- Interactive REPL and one-shot (`-p`) modes
- File references with `@` syntax
- Shell integration with `!` prefix
- Sandbox mode for safe execution
- Multi-model: Gemini, Claude, and GPT-OSS via `/model`

### Configuration
- AGENTS.md context files (hierarchical)
- settings.json customization
- Permission rules (`/permissions`)
- Plugins and skills

### Advanced Features
- Model Context Protocol (MCP) servers (`mcp_config.json`)
- Plugin system (`agy plugin`)
- Skills and subagents (Markdown `agent.md`, `/agents`, `agy agents`)
- Conversation management (SQLite) and Artifact Review
- Structured headless output (`--output-format json|stream-json`, `--json-schema`)

### New in Antigravity CLI 1.1.x / 1.2.x (materials verified against 1.2.16)
- Execution modes: `Shift+Tab` cycles `default` → `accept-edits` → `plan`; `--mode`; `agentMode` setting (1.1.0)
- Structured headless output: `--output-format json|stream-json`, `--json-schema` (1.1.8)
- Slash commands and skills expand in `-p`; read-only commands answer without spending quota (1.1.9–1.1.12)
- Stable model slugs for `--model`, plus `--effort` / `/effort` (1.1.5)
- Custom agents in Markdown (`agent.md` frontmatter), `--agent`, `agy agents` (1.1.1/1.1.6)
- `/codesearch` (1.1.3), Vim editor mode (1.1.11), `/fork`, `/btw`, `/rewind`
- Direct Gemini API access via `GEMINI_API_KEY` + `modelProvider: "gemini"` (1.1.13)
- Since 1.1.13: `agy mcp add|remove|list|enable|disable` (1.1.16), `--input-format stream-json` (1.1.15), `/voice` dictation (1.1.21), `/model <name>` saves a default (1.1.22)
- 1.2.x: Remote Control (`agy remote-control`), unlimited `-p` runs with `AGY_ERROR` exit code 3 (1.2.6), `@<subagent>` messages (1.2.9), workspace `.agents/hooks.json` hooks
- Run `agy changelog` for the full release notes

## Tips for Success

1. **Start with default approval**: Get comfortable before `--dangerously-skip-permissions`
2. **Use AGENTS.md**: Provide context for better, more consistent results
3. **Use Artifact Review**: Inspect diffs (`Ctrl+R`, `/diff`) before accepting
4. **Review Generated Code**: Always verify AI-generated changes
5. **Leverage MCP**: Extend capabilities with custom tools

## Useful Commands Reference

```bash
# Basic usage
agy                                 # Interactive mode
agy -p "prompt"                     # One-shot (print) mode
agy -i "context"                    # Interactive with initial prompt

# Configuration
agy --sandbox                       # Run in sandbox mode
agy --dangerously-skip-permissions  # Auto-approve all actions (use with care)
agy --model gemini-3.1-pro-high     # Specify a model slug (see `agy models`)
agy --effort low                    # Reasoning effort: low|medium|high (xhigh|max where supported)
agy --mode plan                     # Start in plan mode (or accept-edits)
agy -p "prompt" --output-format json  # Machine-readable result

# Session management
agy -c                              # Continue most recent conversation
agy --conversation <id>             # Resume a specific conversation
```

## Slash Commands

| Command | Description |
|---------|-------------|
| `/help` | Show available commands and shortcuts |
| `/context` | View loaded context and token usage |
| `/model` · `/effort` | Switch model or reasoning effort mid-session |
| `/config` (alias `/settings`) | Open settings and preferences |
| `/permissions` | Add/edit/remove tool permission rules |
| `/mcp` | View and reload MCP servers |
| `/codesearch <query>` | Regex search across the workspace (`/cs`) |
| `/resume` · `/fork` · `/rewind` | Conversation browser, branch, roll back |
| `/agents` · `/tasks` | Monitor subagents and background tasks |
| `/btw <question>` | Side question without interrupting the current task |
| `/diff` | Review changes (supports commit selection) |
| `/usage` · `/credits` · `/quota` | Quota and credit status |

## Resources

- [Quick Reference Cheatsheet](./CHEATSHEET.md)
- [Course Slides](./slides.md)
- [Lab Exercises](./lab_handout.md)
- [Official Antigravity CLI Documentation](https://antigravity.google/docs)
- [Antigravity CLI Source Repository](https://github.com/google-antigravity/antigravity-cli)
- [MCP Server Registry](https://modelcontextprotocol.io/registry)

## Instructor

**Kenneth Kousen**
- President, Kousen IT, Inc.
- Author & Technical Trainer
- ken.kousen@kousenit.com
- https://www.kousenit.com

## License

This training material is licensed under the MIT License. See [LICENSE](./LICENSE) file for details.

---

**Ready to start?** Run `npm run dev` and navigate to http://localhost:3030!

# Antigravity CLI Training Course

A hands-on training course for Google's Antigravity CLI, the terminal-first surface for working with Antigravity agents.

Google announced the transition from Gemini CLI to Antigravity CLI at Google I/O 2026. For consumer, free, Google AI Pro, and Google AI Ultra users, Gemini CLI stops serving requests on June 18, 2026. These materials now treat Antigravity CLI as the supported path and keep Gemini CLI references only where they explain migration.

## Course Overview

This 5-hour hands-on workshop covers installation, authentication, project context, safety controls, MCP configuration, skills, plugins, and practical coding workflows.

### What You'll Learn

- **Installation & Setup**: Installing `agy`, first-launch setup, workspace trust
- **Core Commands**: Interactive TUI, prompt workflows, file references
- **Context Management**: `GEMINI.md`, `AGENTS.md`, and workspace rules
- **Safety & Control**: Permission settings, sandbox mode, checkpoints, review loops
- **Advanced Features**: MCP integration, skills, plugins, subagents
- **Practical Skills**: Real-world exercises in Python, JavaScript, and Java

## Prerequisites

- Command-line experience
- Basic programming knowledge in at least one language
- Git familiarity
- Development environment for Python, JavaScript, or Java
- Google account for browser-based sign-in
- Docker or platform sandbox support, optional

## Repository Structure

```text
gemini-training/
├── slides.md                     # Slidev presentation
├── lab_handout.md                # Progressive hands-on labs
├── exercises/                    # Hands-on lab projects
│   ├── python/weather-app/       # Flask weather application
│   ├── javascript/task-manager/  # Node.js task manager starter
│   ├── javascript/antigravity-task-demo/ # Completed task manager demo
│   └── java/bookstore-api/       # Spring Boot REST API
├── .agents/skills/               # Reusable Antigravity skill examples
├── config-examples/              # Sample Antigravity CLI configurations
└── gemini-md-examples/           # Context/rules templates
```

The repository name is still `gemini-training` for compatibility with the existing GitHub repo and course links.

## Quick Start

### 1. Install Antigravity CLI

```bash
# macOS / Linux
curl -fsSL https://antigravity.google/cli/install.sh | bash

# Verify installation
agy --version
```

### 2. Authenticate

Start the CLI in a project directory:

```bash
agy
```

On first launch, Antigravity CLI walks through visual preferences, workspace trust, and browser-based Google sign-in. SSH sessions print a URL and authorization code flow instead.

### 3. Start the Training

```bash
git clone https://github.com/kousen/gemini-training
cd gemini-training
npm install
npm run dev
```

Open `http://localhost:3030`.

## Course Schedule

| Section | Duration |
|---------|----------|
| Introduction & Setup | 10 min |
| Installation & Prerequisites | 15 min |
| Authentication & Account Setup | 10 min |
| First Steps & Basic Interface | 15 min |
| Core Commands & Functionality | 65 min |
| Configuration & Customization | 65 min |
| Advanced Features & Extensions | 65 min |
| Practical Applications & Workflows | 45 min |
| Wrap-up & Q&A | 15 min |

## Key Antigravity CLI Features Covered

### Core Features

- Interactive terminal UI via `agy`
- File references with `@` syntax
- Terminal commands with `!`
- Permission and sandbox controls
- Checkpoints and session resume
- Subagents for background work

### Configuration

- `~/.gemini/antigravity-cli/settings.json`
- `~/.gemini/antigravity-cli/keybindings.json`
- `GEMINI.md` and `AGENTS.md` context files
- Workspace rules under `.agents/rules/`
- Workspace skills under `.agents/skills/`

### Migration Notes

- Antigravity CLI is not a 1:1 feature clone of Gemini CLI.
- It keeps core developer-experience concepts: context files, skills, hooks, subagents, MCP, and plugins.
- Existing workspace `GEMINI.md` and `AGENTS.md` files continue to be useful.
- Reusable prompts should be packaged as Antigravity skills/workflows rather than old command files.
- Antigravity and Antigravity IDE are separate surfaces: Antigravity focuses on agent orchestration, while Antigravity IDE remains the developer IDE surface.

## Useful Commands Reference

```bash
agy                              # Start the interactive TUI
agy "prompt"                     # One-shot prompt
echo "task" | agy                # Piped input
agy --sandbox                    # Run with sandbox mode enabled
agy --dangerously-skip-permissions  # Skip permission prompts for disposable demos only
agy --help                       # Show CLI help
```

## Slash Commands

| Command | Description |
|---------|-------------|
| `/help` or `?` | Show available commands |
| `/config` or `/settings` | Open settings |
| `/permissions` | Manage tool permissions |
| `/keybindings` | Edit shortcuts |
| `/clear` | Clear the conversation |
| `/rewind` or `/undo` | Go back in conversation history |
| `/fork` | Branch from an earlier point |
| `/resume` | Resume previous sessions |
| `/agents` | Open the subagents panel |
| `/logout` | Remove saved credentials |

## Resources

- [Antigravity CLI getting started](https://antigravity.google/docs/cli-getting-started)
- [Gemini CLI to Antigravity CLI transition announcement](https://developers.googleblog.com/en/an-important-update-transitioning-gemini-cli-to-antigravity-cli/)
- [Antigravity migration guide](https://antigravity.google/docs/gcli-migration)
- [MCP Server Registry](https://modelcontextprotocol.io/registry)
- [Course Slides](./slides.md)
- [Lab Exercises](./lab_handout.md)

## Instructor

**Kenneth Kousen**
- President, Kousen IT, Inc.
- Author & Technical Trainer
- ken.kousen@kousenit.com
- https://www.kousenit.com

## License

This training material is licensed under the MIT License. See [LICENSE](./LICENSE) file for details.

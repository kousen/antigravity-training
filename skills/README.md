# Custom Skills

Example **skills** for the Antigravity CLI. A skill is a directory containing a
`SKILL.md` with `name` and `description` frontmatter; the agent reads the
description to decide when to activate it, and each skill also shows up as a
`/<name>` slash command (autocomplete after typing `/`).

## Installation

Skills are discovered from a customization root — `.agents/skills/` in a
project (checked into the repo, shared with the team) or
`~/.gemini/config/skills/` for every project:

```bash
# Project-level (this repo only)
mkdir -p .agents/skills
cp -r review test-gen docs refactor .agents/skills/

# User-level (all projects)
mkdir -p ~/.gemini/config/skills
cp -r review test-gen docs refactor ~/.gemini/config/skills/
```

Restart `agy` (or open a new session) and check `/skills`.

## Available Skills

| Skill | Usage | What it does |
|-------|-------|--------------|
| `/review` | `/review @./src/service.py` | Security / performance / best-practice / test review with severity levels |
| `/test-gen` | `/test-gen @./src/utils.py` | Generate unit tests for the referenced code |
| `/docs` | `/docs @./src/api/` | Generate documentation (docstrings, README sections) |
| `/refactor` | `/refactor @./src/legacy.py` | Propose and apply modern refactorings |

## Writing your own

```text
skills/<skill_name>/
├── SKILL.md      # required: frontmatter (name, description) + instructions
├── scripts/      # optional helper scripts, linked from SKILL.md
└── references/   # optional bulky docs the agent reads only when needed
```

Add `disable-slash-command: true` to the frontmatter to keep a skill available
to the model but out of the `/` menu. Skills also work headless:
`agy -p "/review @./src/app.py"`.

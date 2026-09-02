# AGENTS.md / GEMINI.md Examples

This folder contains example context files for different project types. In the Antigravity CLI (`agy`), **`AGENTS.md`** is the standard project context file. Antigravity also recognizes `GEMINI.md` and `CLAUDE.md`, so existing files keep working without changes.

## Files

### python-flask.md
Context file for Python Flask web applications.
- Flask-specific conventions
- SQLAlchemy patterns
- pytest testing standards
- PEP 8 style guide references

### java-spring.md
Context file for Java Spring Boot applications.
- Spring Boot best practices
- JPA entity conventions
- JUnit 5 testing patterns
- Maven build commands

### typescript-react.md
Context file for React TypeScript applications.
- React component patterns
- TypeScript strict mode usage
- Tailwind CSS styling
- Vitest testing setup

### global-context.md
Template for global context at `~/.gemini/AGENTS.md` (or `~/.gemini/GEMINI.md`).
- Personal preferences
- Communication style
- Git workflow standards
- General coding philosophy

## Usage

### Project-Specific Context

Copy the appropriate template to your project root as `AGENTS.md`:

```bash
# For a Flask project
cp python-flask.md /path/to/your/project/AGENTS.md

# Customize for your project
$EDITOR /path/to/your/project/AGENTS.md
```

### Global Context

Copy the global template to your global Antigravity config directory:

```bash
mkdir -p ~/.gemini
cp global-context.md ~/.gemini/AGENTS.md

# Customize with your preferences
$EDITOR ~/.gemini/AGENTS.md
```

## Best Practices

### Keep It Focused
- Include only relevant information
- Remove sections that don't apply
- Update as the project evolves

### Be Specific
- Name actual files and directories
- Include real commands used in the project
- Reference actual technologies and versions

### Use Imports for Large Contexts
Break down large `AGENTS.md` files:

```markdown
# AGENTS.md

## Project Overview
This is our main application.

## Coding Standards
@./docs/coding-standards.md

## API Guidelines
@./docs/api-guidelines.md
```

### Hierarchical Context
Use subdirectory `AGENTS.md` files for component-specific rules:

```
project/
├── AGENTS.md              # Project-wide rules
├── frontend/
│   └── AGENTS.md          # React-specific rules
└── backend/
    └── AGENTS.md          # Python-specific rules
```

### File Filtering
Antigravity CLI respects `.gitignore` by default. You can also configure `fileFiltering` in your `settings.json`:

```json
{
  "context": {
    "fileFiltering": {
      "respectGitIgnore": true,
      "enableRecursiveFileSearch": true
    }
  }
}
```

## Verification

After setting up your `AGENTS.md`, verify it is loaded:

```bash
agy
> /context
```

This displays the combined context loaded from your global and project files, along with active token counts.

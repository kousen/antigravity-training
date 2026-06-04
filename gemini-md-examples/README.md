# Context File Examples

Antigravity CLI reads existing `GEMINI.md` context files and also supports `AGENTS.md` for shared repository rules. These templates are still useful, but the recommended teaching pattern is:

- Use `AGENTS.md` for cross-tool project instructions.
- Use `GEMINI.md` only for Antigravity/Gemini-specific context.
- Use `.agents/rules/` for workspace rules.
- Use `.agents/skills/` for reusable workflows.

## Files

### python-flask.md
Context for Python Flask web applications:
- Flask-specific conventions
- SQLAlchemy patterns
- pytest testing standards
- PEP 8 style guide references

### java-spring.md
Context for Java Spring Boot applications:
- Spring Boot best practices
- JPA entity conventions
- JUnit 5 testing patterns
- Maven build commands

### typescript-react.md
Context for React TypeScript applications:
- React component patterns
- TypeScript strict mode usage
- Tailwind CSS styling
- Vitest testing setup

### global-context.md
Template for global context at `~/.gemini/GEMINI.md`.

## Usage

### Project Rules

Copy the appropriate template to your project root as `AGENTS.md`:

```bash
cp python-flask.md /path/to/your/project/AGENTS.md
vim /path/to/your/project/AGENTS.md
```

If you need Antigravity-specific rules, use `GEMINI.md`:

```bash
cp python-flask.md /path/to/your/project/GEMINI.md
```

### Global Context

```bash
mkdir -p ~/.gemini
cp global-context.md ~/.gemini/GEMINI.md
vim ~/.gemini/GEMINI.md
```

### Workspace Rules

```bash
mkdir -p .agents/rules
cp python-flask.md .agents/rules/flask.md
```

## Best Practices

- Keep files focused and short.
- Name actual commands used in the project.
- Reference real directories and architecture.
- Prefer `AGENTS.md` for rules that should work across agent tools.
- Keep generated, vendor, and secret-bearing paths out of prompts.

## Verification

After setting up context, launch Antigravity CLI and ask:

```text
What context files and workspace rules did you load?
```

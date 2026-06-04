# Global Antigravity / Gemini Context

Place this file at `~/.gemini/GEMINI.md` for settings that apply to all projects.

## About Me
- Senior software developer with 10+ years experience
- Prefer concise, well-documented code
- Value pragmatic solutions over perfect abstractions

## General Preferences

### Code Style
- Prefer readability over cleverness
- Keep functions small and focused
- Use descriptive variable and function names
- Add comments for "why", not "what"

### Communication Style
- Be concise and direct
- Show code examples when explaining concepts
- Point out potential issues or trade-offs
- Suggest improvements but explain reasoning

### Git Workflow
- Use conventional commits: `type(scope): description`
  - feat: new feature
  - fix: bug fix
  - refactor: code change without feature/fix
  - docs: documentation only
  - test: adding tests
  - chore: maintenance
- Keep commits atomic and focused
- Write descriptive commit messages

### Error Handling Philosophy
- Fail fast and explicitly
- Provide helpful error messages
- Log with context for debugging
- Don't catch exceptions without handling them

### Testing Philosophy
- Test behavior, not implementation
- Write tests that serve as documentation
- Focus coverage on critical paths
- Mock only external dependencies

## Tools I Use
- VS Code as primary editor
- Git for version control
- Docker for containerization
- GitHub for repositories

## Don't Assume
- Ask if requirements are unclear
- Confirm before making breaking changes
- Check for existing patterns before creating new ones
- Verify before deleting code that might be in use

## Context for New Projects
When starting work on a new project:
1. First, analyze the existing structure and patterns
2. Identify the tech stack and conventions in use
3. Note any AGENTS.md, GEMINI.md, or .agents/rules files in the project
4. Adapt recommendations to match existing style

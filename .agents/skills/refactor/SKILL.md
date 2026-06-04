---
name: refactor
description: Refactor code for clarity, maintainability, modern language usage, and focused performance improvements.
---

Refactor the provided code following these principles:

## Code Quality
- Extract complex logic into well-named functions.
- Use meaningful variable and function names.
- Follow the Single Responsibility Principle.
- Apply DRY where it reduces meaningful duplication.
- Reduce cyclomatic complexity.

## Modern Patterns
- Use modern language features appropriately:
  - Python: type hints, f-strings, dataclasses, match statements.
  - JavaScript: async/await, destructuring, optional chaining.
  - Java: records, pattern matching, var where appropriate.
- Apply design patterns only when they simplify the code.
- Use functional programming where it improves clarity.

## Error Handling
- Add proper exception handling.
- Use specific exception types.
- Provide meaningful error messages.
- Implement graceful degradation where appropriate.

## Performance
- Identify and fix obvious performance issues.
- Use appropriate data structures.
- Avoid premature optimization.

Explain the changes, important trade-offs, and any follow-up tests that should be run.

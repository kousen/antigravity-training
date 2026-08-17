---
name: refactor
description: >-
  Refactor code for improved quality. Use this skill when the user runs /refactor or asks for
  this kind of task on a file or directory (e.g. "/refactor @./src/app.py").
---

# /refactor

Refactor the provided code following these principles:

## Code Quality
- Extract complex logic into well-named functions
- Use meaningful variable and function names
- Follow the Single Responsibility Principle
- Apply DRY (Don't Repeat Yourself)
- Reduce cyclomatic complexity

## Modern Patterns
- Use modern language features appropriately:
  - Python: type hints, f-strings, dataclasses, match statements
  - JavaScript: async/await, destructuring, optional chaining
  - Java: records, pattern matching, var keyword
- Apply appropriate design patterns
- Use functional programming where it improves clarity

## Error Handling
- Add proper exception handling
- Use specific exception types
- Provide meaningful error messages
- Implement graceful degradation where appropriate

## Performance
- Identify and fix obvious performance issues
- Use appropriate data structures
- Avoid premature optimization

## Output
Provide the refactored code with:
- Explanation of changes made
- Before/after comparison for significant changes
- Any trade-offs or considerations

Apply the above to the file(s) or directory the user referenced with `@`.

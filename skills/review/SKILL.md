---
name: review
description: >-
  Perform a comprehensive code review. Use this skill when the user runs /review or asks for
  this kind of task on a file or directory (e.g. "/review @./src/app.py").
---

# /review

Perform a thorough code review focusing on:

## Security
- Check for injection vulnerabilities (SQL, command, XSS)
- Look for hardcoded secrets or credentials
- Verify proper input validation and sanitization
- Check for insecure dependencies

## Performance
- Identify inefficient algorithms or data structures
- Look for N+1 queries or database performance issues
- Check for memory leaks or resource management problems
- Identify unnecessary computations or redundant operations

## Best Practices
- Verify adherence to language idioms and conventions
- Check for proper error handling
- Look for code duplication
- Assess readability and maintainability

## Testing
- Identify untested edge cases
- Check for proper test coverage
- Suggest additional test scenarios

Provide specific line numbers and actionable recommendations with severity levels:
- CRITICAL: Must fix before deployment
- WARNING: Should fix soon
- INFO: Consider improving

Apply the above to the file(s) or directory the user referenced with `@`.

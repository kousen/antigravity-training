---
name: test-gen
description: >-
  Generate comprehensive unit tests for code. Use this skill when the user runs /test-gen or asks for
  this kind of task on a file or directory (e.g. "/test-gen @./src/app.py").
---

# /test-gen

Generate comprehensive unit tests for the provided code with:

## Coverage Requirements
- All public methods and functions
- Happy path scenarios
- Edge cases (null, empty, boundary values)
- Error conditions and exception handling
- State transitions if applicable

## Test Structure
- Use the appropriate testing framework for the language:
  - Python: pytest with fixtures
  - JavaScript/TypeScript: Jest with describe/it blocks
  - Java: JUnit 5 with @Test annotations
- Include setup and teardown where needed
- Use meaningful test names that describe the behavior
- Add comments explaining complex test scenarios

## Mocking
- Mock external dependencies appropriately
- Use dependency injection patterns
- Avoid testing implementation details

## Test Data
- Create realistic test fixtures
- Include edge case data (unicode, long strings, special characters)
- Use parameterized tests for multiple scenarios

Generate the tests with proper file naming conventions and organize them logically.

Apply the above to the file(s) or directory the user referenced with `@`.

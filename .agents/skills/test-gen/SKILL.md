---
name: test-gen
description: Generate comprehensive tests for application code.
---

Generate comprehensive tests for the provided code.

## Coverage Requirements
- All public methods and functions.
- Happy path scenarios.
- Edge cases such as null, empty, boundary values, and invalid input.
- Error conditions and exception handling.
- State transitions if applicable.

## Test Structure
- Use the appropriate testing framework for the language:
  - Python: pytest with fixtures.
  - JavaScript/TypeScript: Jest with describe/it blocks.
  - Java: JUnit 5 with @Test annotations.
- Include setup and teardown where needed.
- Use meaningful test names that describe behavior.
- Add comments only for complex test scenarios.

## Mocking
- Mock external dependencies appropriately.
- Prefer dependency injection patterns.
- Avoid testing implementation details.

## Test Data
- Create realistic test fixtures.
- Include edge case data such as unicode, long strings, and special characters.
- Use parameterized tests for repeated scenarios when practical.

Generate tests with conventional file names and organize them logically.

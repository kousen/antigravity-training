---
name: code-review
description: >-
  Performs comprehensive, multi-dimensional code reviews on source files, git diffs,
  or pull requests. Evaluates security vulnerabilities, performance and concurrency bottlenecks,
  testing rigor, architectural separation of concerns, and language-specific best practices
  (Java/Spring Boot, Python, TypeScript, etc.). Use when asked to "review code", "review PR",
  "review changes", or run a code review.
---

# Code Review Skill

This skill performs rigorous, multi-dimensional code reviews across any programming language, prioritizing security, performance, correctness, testability, and adherence to team standards.

---

## Review Scope & Mode Detection

When activated, determine the review target using this precedence:

1. **Explicit Files / Modules:** If the user specifies files or folders (e.g., "Review `BookService.java`"), review those files in full.
2. **Git Diff / Working Tree (Default):** If no files are specified, run `git status` and `git diff` (or `git diff --cached` / `git diff HEAD~1`) to review current uncommitted or recently committed changes.
3. **Full Project Audit:** If the user requests a full project review, identify key entry points (controllers, services, entities, config, tests) and review the architectural health of the codebase.

---

## Multi-Pillar Review Rubric

Evaluate the code against the following five core dimensions:

### 1. 🛡️ Security & Data Protection
* **Injection:** SQL injection, command injection, path traversal, regex DoS, log injection.
* **Authentication & Authorization:** Missing permission checks, broken object-level authorization (IDOR).
* **Input Validation & Sanitization:** Boundary constraints at API gates (`@Valid`, schemas, size/length bounds, type checks).
* **Secrets & Sensitive Data:** Hardcoded credentials, tokens, API keys, leaking PII or credentials in logs/exceptions.
* **Serialization & Deserialization:** Insecure object deserialization, mass assignment vulnerabilities.

### 2. ⚡ Performance & Concurrency
* **Data Access & Memory:** N+1 query loops, missing pagination/limits, loading unbounded collections into memory, in-memory sorting of large datasets.
* **Resource Management:** Unclosed streams, connections, missing try-with-resources / context managers.
* **Thread Safety & Race Conditions:** Shared mutable state across singleton services, non-atomic compound operations, improper locking, thread-unsafe collections.
* **Hot Paths & Allocations:** Unnecessary heavy object allocations, regex recompilation, or blocking calls in reactive/async pipelines.

### 3. 🧪 Testing & Testability
* **Assertion Rigor:** Strong, meaningful assertions (e.g. AssertJ `assertThat`) vs trivial non-null assertions.
* **Edge Cases & Failure Modes:** Boundary values (zero, negative, max), empty/null inputs, error responses, exception paths.
* **Test Architecture:** Fast isolated unit tests for business logic, slice tests for controllers/handlers, integration tests for DB/external contracts.
* **Isolation:** Tests must not depend on execution order or leak state.

### 4. 🔤 Language & Framework Idioms

Adapt standards to the project's language:

* **Java & Spring Boot:**
  * Modern Java (Java 21+ records for DTOs, `Stream.toList()`, pattern matching, `var`).
  * Mandatory constructor-based dependency injection (no `@Autowired` field injection).
  * Error handling via `@RestControllerAdvice` and RFC 7807 `ProblemDetail`.
  * Testing with `@MockitoBean` (Spring Boot 3.4+) and `@WebMvcTest`.
* **Python:**
  * PEP 8 compliance, explicit type annotations, context managers (`with`), pytest fixtures.
  * Async correctness (no blocking I/O in async functions).
* **TypeScript / JavaScript:**
  * Strict type safety (no untyped `any`), modern ES modules, proper Promise/async error propagation.

### 5. 🧱 Architecture & Maintainability
* **Separation of Concerns:** Clear layer boundaries (Controller $\to$ Service $\to$ Repository/DAO).
* **Single Responsibility (SRP):** Classes and functions should do one thing well.
* **API Contracts:** RESTful URI conventions, accurate HTTP status codes (`200`, `201`, `204`, `400`, `404`), `Location` headers on creation, OpenAPI documentation.
* **Code Clarity:** Self-documenting names, avoidance of dead code or magic numbers/strings.

---

## Output Format

Structure the review report clearly with these sections:

```markdown
# 📋 Code Review Report: [Target / Component]

## 🎯 Executive Summary
[1-2 sentences summarizing overall code quality, readiness for merge, and primary risk areas]

---

## 🔍 Detailed Findings

### 🔴 Critical / Blockers
*Must be resolved before merging (security bugs, data loss, race conditions).*
* **[Issue Title]** (`file/path:line`)
  * **Problem:** [Clear explanation of the vulnerability or critical flaw]
  * **Impact:** [Security/operational risk]
  * **Fix:**
    ```language
    // Concrete code example showing recommended fix
    ```

### 🟡 Warnings / Improvements
*Important for maintainability, performance, or correctness.*
* **[Issue Title]** (`file/path:line`)
  * **Problem:** [Explanation]
  * **Recommendation:** [How to improve]

### 🟢 Suggestions / Nitpicks
*Idiomatic improvements, minor style consistency, non-blocking refinements.*
* **[Item]** (`file/path:line`): [Brief note]

### 💡 Commendations & Strengths
*What was done well in this implementation.*
* [Highlight clean patterns, robust tests, or good practices observed]

---

## 🏁 Verdict
* **Recommendation:** [ ✅ Approve | ⚠️ Approve with Minor Changes | 🛑 Changes Requested ]
* **Next Steps:** [Key action items for the author]
```

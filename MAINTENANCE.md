# Dependency triage notes (instructor-only)

Private notes on dependency decisions for this repo. Not intended for
students. Kept so the next refresh doesn't re-litigate the same calls.

## Dependency vulnerabilities

Dependabot routinely reports findings on `main`. **None of them affect
students or the taught material.** Triage below.

### Current state (after April 2026 refresh)

As of commits `0d4c9e0` and `3b4d7a1`:

| Lockfile | Before | After |
|---|---|---|
| Root `package-lock.json` (Slidev toolchain) | 20 (1 low / 14 mod / 5 high) | **6** (all moderate) |
| `exercises/javascript/my-task-manager` | 4 (1 mod / 3 high) | **0** |

The remaining 6 are all in the `@slidev/cli` → `monaco-editor` →
`dompurify` chain (moderate mutation-XSS). They only clear with
`npm audit fix --force`, which downgrades `@slidev/cli` from 52.12.0
to 52.6.0 (a major-version downgrade). **Don't bother** — the attack
surface for a slide deck the instructor builds themselves is nil.
Wait for Slidev upstream to publish a clean update.

### Re-running the audit next time

```bash
# Root (Slidev toolchain - only affects the laptop building the deck)
npm audit fix --ignore-scripts   # --ignore-scripts avoids a Playwright
                                  # post-install that tries to fetch
                                  # Chromium (can fail behind proxies)

# Exercise lockfile
cd exercises/javascript/my-task-manager
npm audit fix --ignore-scripts
```

### Python / Java exercises

Not covered by `npm audit`. If the Dependabot count is bothering you:

```bash
# Python
cd exercises/python/weather-app
pip-audit -r requirements.txt

# Java
cd exercises/java/bookstore-api
mvn org.owasp:dependency-check-maven:check
```

These are hands-on exercise codebases — students will be modifying them
in class regardless, so a stale dep or two is not a teaching hazard.

## Known "do NOT do in a hurry" items

- **Do not** run `npm audit fix --force` at the root without testing the
  deck rebuild afterwards. It will bump Slidev across a major version.
- **Do not** upgrade Antigravity CLI mid-class. Install and verify before
  class, then keep the toolchain stable through the session.
- **Do not** delete `slides.pdf` without regenerating it — students get
  the PDF as a handout.

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
- **Do not** upgrade Gemini CLI mid-class. Pin a version on students'
  machines during the prereq step.
- **Do not** commit a slides PDF. CI builds `gemini-training-slides.pdf`
  on every push to `main` that touches `slides.md` and attaches it to the
  rolling `slides-latest` release
  (`.github/workflows/build-slides-pdf.yml`). Students get the PDF from
  `https://github.com/kousen/gemini-training/releases/latest/download/gemini-training-slides.pdf`.
  Re-run manually from the Actions tab (`workflow_dispatch`) if needed.

## Refreshing against a new Antigravity CLI release

Last done: 2026-08-17 against **agy 1.1.13** (materials had been at 1.0.6).

Ground truth, in order of trust:

1. The installed CLI: `agy --help`, `agy changelog`, `agy plugin --help`,
   `agy models` (needs a TTY — run it yourself, not from a script),
   `agy -p "/settings"` (dumps every settings key + current value, no quota).
2. Docs shipped inside the CLI:
   `~/.gemini/antigravity-cli/builtin/skills/agy-customizations/docs/*.md`
   (skills, plugins, mcp_servers, rules, hooks, json_configs).
3. https://antigravity.google/docs/cli/{settings,modes,mcp,headless,subagents}
4. https://antigravity.google/docs/cli/reference — **partly stale**: still
   listed `/planning` and `/fast` after 1.1.0 removed them. Cross-check.

Quick probe for whether a slash command really exists:
`agy -p "/foo"` — a real interactive-only command errors with
"not available in print mode"; an unknown one gets answered by the model.
(`/export`, `/agent <task>`, `/planning`, `/fast` all failed this test and
were removed from the materials.)

Facts that bit us this round (don't reintroduce):
- Settings live in `~/.gemini/antigravity-cli/settings.json`, flat keys.
  `~/.gemini/settings.json` is the *old Gemini CLI* file.
- Remote MCP servers use `"serverUrl"`; `url`/`httpUrl` are rejected.
- Per-project customizations go under `.agents/` (`mcp_config.json`,
  `skills/`, `agents/`), not `.gemini/`.
- Custom commands are skills (`SKILL.md`), not `commands/*.toml`.
- Hooks: CLI 1.1.13 loads `~/.gemini/config/hooks.json` and plugin hooks
  only — a workspace `.agents/hooks.json` is NOT picked up (tested with a
  trusted workspace and a real turn; log says "loaded 1 named hooks from
  1 hooks.json file(s)"). Re-test on each release; flip the slide/lab
  wording back to `.agents/` when it starts working. Also: a non-object
  top-level key (e.g. `_comment`) makes the CLI silently drop the whole file.
- Checkpointing is a Gemini-CLI feature, not agy. agy has `/rewind`, `/diff`,
  `/fork`, diff-review-before-write.

## Exercise repos

- `exercises/python/weather-app` on `main` is the **student baseline**
  (restored to commit 9a5d244 on 2026-08-19). Live-demo results (config,
  error handling, caching, ARCHITECTURE.md) live on branch
  `weather-app-demos`. Demo on a branch or `git stash` afterwards — if the
  app arrives in class fully tested, Lab 4 has nothing to generate.
- `statusline.py` in weather-app is referenced from the Status Line slide and
  from `~/.gemini/antigravity-cli/settings.json` on Ken's machine.

The `course-refresh-preflight` skill has a config for this repo
(`~/.claude/skills/course-refresh-preflight/configs/gemini-training.yml`);
run it first — it writes a file:line report without touching the repo.

# Workspace Guidelines

Multi-use workspace. The active project is the Studio O'Brien portfolio site
(studioobrien.com), but these instructions stay project-neutral so other
projects can run out of this platform.

## Reference docs

Consult these when the task touches them — they are reference material, not
standing doctrine to filter every task through:

- `PRODUCT.md` — audience, brand voice, conversion goals (site design/copy work)
- `DESIGN.md` — design tokens, type scale, palette (site visual work)
- `ROADMAP.md` / `production/PIPELINE.md` — growth plan + build queue (planning)

Durable facts, preferences, and project state live in auto-memory — that is
the primary context carrier between sessions. Don't re-derive what memory
already records.

## Delegation (cc-fleet → DeepSeek)

Default: do the work yourself. Delegate only when the user asks, or when the
task is bulk-mechanical (batch transforms, large scans/extractions) where one
call replaces a long stretch of tool calls. ~$0.10 baseline per call — batch.

```bash
cc-fleet subagent deepseek --model fast --json --prompt "<task>"
# --background for long jobs; poll: cc-fleet subagent-status <id>
```

If a call fails: report the error verbatim; do not silently retry yourself.

## Session handoff

Before `/compact` or ending a session, fill `.claude/SESSION_TEMPLATE.md`
(what changed, tested vs untested, next action + why, do-nots), then:

```bash
cp .claude/SESSION_TEMPLATE.md ".claude/sessions/session-$(date +%Y%m%d-%H%M%S).md"
cp .claude/SESSION_TEMPLATE.md .claude/sessions/LAST_SESSION.md
```

New sessions get `LAST_SESSION.md` from the SessionStart hook: resume from
its next action, don't repeat completed work.

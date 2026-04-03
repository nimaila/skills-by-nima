---
name: workflow-optimizer
description: "## Overview"
---

# Workflow Optimizer Skill

## Overview

This skill encodes two frameworks:
- **Precision Intelligence Protocol**: Context management, self-learning loops, advanced commands
- **Lean Context Framework**: Modular knowledge, memory management, GST framework

Use the three-phase workflow below depending on where you are in your project cycle.

---

## Phase 1: Project Setup (Run at Start)

**Goal**: Create a lean, scalable project structure.

### Checklist

- [ ] Create `CLAUDE.md` (50-100 lines)
  - Core project context, rules, and permanent learnings
  - Reference from all skills and sessions
  
- [ ] Create `LEARNINGS.md`
  - Track what worked, what failed, adaptations for next run
  - Update at end of each session
  
- [ ] Create `skills/` folder structure
  - Keep individual skill files under 200 lines (table of contents only)
  - Store deeper knowledge in `references/` subdirectory
  - Load reference files only when needed
  
- [ ] Establish "Business Brain"
  - Single source of truth for core context (tone, audience, positioning)
  - All skills reference this to avoid redundant context loading

### CLAUDE.md Template (Start Here)

```markdown
# Project Context

## Core Rules
- Keep context fresh and condensed
- Use /clear between unrelated tasks, /compact proactively
- Run Plan/Execute/Review phases in separate contexts

## Key Learning (Updated)
[Add permanent corrections here]

## Skill Registry
- skill-1: what it does
- skill-2: what it does
```

### LEARNINGS.md Template

```markdown
# Session Learnings

## Session [DATE]
### What Worked
- [List effective approaches]

### What Failed
- [List issues and root causes]

### Adaptations for Next Run
- [Specific changes to make]
```

---

## Phase 2: Mid-Project Optimization (Run When Stuck)

**Goal**: Apply precision techniques to unblock or improve current work.

### GST Framework Checklist

**Plan Phase** ✓
- [ ] Clarify scope with AskUserQuestion tool
- [ ] Break task into discrete steps
- [ ] Load only essential context

**Execute Phase** ✓
- [ ] Use focused, narrow context per step
- [ ] Chain skill handoffs (one skill's output → next skill's input)
- [ ] Use sidecar questions with `/btw` to avoid context pollution
- [ ] Apply `/batch` for parallel work

**Review Phase** ✓
- [ ] Verify output quality
- [ ] Tag mistakes for CLAUDE.md updates
- [ ] Document what worked/failed in LEARNINGS.md

### Advanced Commands

```
/clear              → Start fresh context between unrelated tasks
/compact            → Proactively compress context (use before hitting token limits)
/context            → Check current token usage
/btw [question]     → Ask sidecar questions without bloating context
/simplify           → Reduce AI over-engineering after code
/batch              → Orchestrate multiple sub-agents for refactoring
/loop               → Automate recurring checks (CI/CD, tests)
```

### Context Health Signals

🟢 **Healthy**: <250K tokens, focused scope, fresh context
🟡 **Warning**: 250-300K tokens, rerun `/compact`
🔴 **Critical**: >300K tokens, run `/clear` and restart in clean context

---

## Phase 3: Session Wrap-Up (Run at End)

**Goal**: Capture learnings and sync knowledge for future sessions.

### Wrap-Up Checklist

- [ ] Review what was accomplished this session
- [ ] Identify mistakes and root causes
- [ ] Tag corrections for `CLAUDE.md` (permanent rules)
- [ ] Update `LEARNINGS.md` with:
  - What worked
  - What failed
  - Specific adaptations for next run
- [ ] Audit context usage
  - Any hallucinations or quality degradation?
  - When did you hit token limits?
  - What could be refactored into references?
- [ ] Update `claude.md` frontmatter with session date

### Self-Correcting Loop

When you make a mistake:
1. **Don't just fix it** — understand the root cause
2. **Tag for permanent learning** — add to `CLAUDE.md` so the rule is learned forever
3. **Document in LEARNINGS.md** — what went wrong, why, how to prevent next time

---

## File Size Guidelines

| File | Size | Purpose |
|------|------|---------|
| `CLAUDE.md` | 50-100 lines | Core context, permanent rules |
| `skill.md` | <200 lines | Table of contents + quick reference |
| `references/*.md` | Unlimited | Deep knowledge, loaded on demand |
| `LEARNINGS.md` | Grows per session | What worked, what failed, adaptations |

---

## Key Principles

1. **Context is Milk** — Keep it fresh, condensed, loaded on-demand
2. **Lean Skill Files** — Table of contents only; deep knowledge in references
3. **Self-Learning Loop** — Mistakes → permanent rules in CLAUDE.md
4. **Modular Handoffs** — One skill's clean output → next skill's input
5. **GST Framework** — Plan/Execute/Review in separate, focused contexts

---

## Next Steps

**Choose your phase:**
- **Phase 1?** Set up your project structure now
- **Phase 2?** Apply GST framework to current task
- **Phase 3?** Run wrap-up and capture learnings

Or run all three to fully embed these practices into your workflow.

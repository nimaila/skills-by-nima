---
name: session-handoff
description: Use when work is ongoing across sessions and the user wants to continue, resume, pick back up, carry on, keep moving, or leave off and return later; read the latest project handoff at the start and save a concise handoff log in the project folder when pausing, stopping, wrapping up, or ending a session
---

# Session Handoff

## Overview

Maintain a lightweight project-local handoff log so work can resume cleanly across sessions.

Use this skill in two moments:

1. At the start of a session when joining an existing project
2. At the end of a session before stopping work

Common start-of-session trigger phrases include:

- continue where we left off
- pick this back up
- resume work
- keep this moving
- let's continue
- carry on with this
- what were we doing here
- catch me up on this project
- use session handoff

Common end-of-session trigger phrases include:

- let's stop here
- wrap this up for now
- save our place
- leave me a handoff
- log where we are
- give me a session summary before we stop
- let's pause here
- we'll continue later
- save this for next time

Default log location:

`<project-root>/.codex/session-handoff.md`

If the repo is not a git repository, use:

`<cwd>/.codex/session-handoff.md`

Announce at start:
"I'm using the session-handoff skill to load the latest project handoff and keep our session log updated."

## Start Of Session

Use this section whenever the user signals that this is continuing work rather than a brand-new task.

### Step 1: Find the project root

Run:

```bash
git rev-parse --show-toplevel
```

If that fails, use the current working directory.

### Step 2: Read the latest handoff

Check whether `<project-root>/.codex/session-handoff.md` exists.

If it exists:

- Read the most recent entry
- Summarize the last known state in 4-8 lines
- Call out:
- current goal
- what was completed
- what remains
- blockers or risks
- the best next step

If it does not exist:

- Say there is no prior handoff yet
- Continue normally

### Step 3: Use the handoff actively

Treat the latest entry as working memory, not archive material.

- Prefer continuing from the listed next step unless the user redirects
- Re-check assumptions against the current repo state before acting
- If the repo changed since the handoff, mention the mismatch briefly

## End Of Session

Use this whenever the user is stopping, pausing, switching away, or asks for a wrap-up log.
Also use it when the user implies a handoff without saying so directly, such as wanting to continue tomorrow, come back later, or preserve momentum.

### Step 1: Gather current state

Before writing the handoff, collect:

- active branch
- key files changed
- what was completed this session
- what is still in progress
- blockers, open questions, or risks
- the first concrete next step for the next session

Helpful commands:

```bash
git branch --show-current
git status --short
```

### Step 2: Ensure the log directory exists

Create:

```bash
<project-root>/.codex/
```

### Step 3: Append a new entry

Append a new handoff entry to:

`<project-root>/.codex/session-handoff.md`

Use this format:

```md
## <timestamp>

Project: <absolute project root>
Branch: <branch name>

Summary:
<2-4 sentence summary of what happened>

Completed:
- ...

In Progress:
- ...

Next Steps:
- ...

Open Questions / Risks:
- ...

Useful References:
- <file paths, commands, URLs, PRs, tickets>
```

Timestamp should be an absolute local datetime, not relative wording.

Example:

`2026-03-21 15:40 Europe/Stockholm`

## Writing Rules

- Keep entries concise and high-signal
- Append, do not overwrite prior entries
- Prefer concrete next steps over vague summaries
- Include exact file paths and commands when they will save time later
- Record blockers honestly
- Do not invent completion claims

## When Not To Use

Do not write a handoff log after every small reply. Use it when:

- the user is ending the session
- the user asks for a wrap-up
- there is a meaningful checkpoint worth preserving

## Trigger Heuristic

Bias toward using this skill when the user's wording suggests continuity across time.

Start/resume cues:

- continue
- resume
- pick back up
- where were we
- remind me
- catch me up
- ongoing
- still working on this
- next session
- keep going tomorrow

End/pause cues:

- stop here
- pause here
- wrap up
- leave off here
- save our place
- handoff
- pick this up later
- continue next time
- end this session
- before we leave

## Quick Template

```md
## <timestamp>

Project: <absolute project root>
Branch: <branch name>

Summary:
<brief summary>

Completed:
- ...

In Progress:
- ...

Next Steps:
- ...

Open Questions / Risks:
- ...

Useful References:
- ...
```

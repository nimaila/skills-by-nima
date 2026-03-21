---
name: aminkvitto-renamer
description: >
  Renames invoice PDF files using a structured naming convention:
  AB-YYMM-F#-KR#.pdf — where AB is a 2-letter supplier code, YYMM is
  year+month, F# is the invoice number, and KR# is the total SEK amount.
  Use this skill whenever the user wants to rename invoice images or PDFs,
  or says "continue renaming", "process invoices", "next batch", or
  "rename invoices". At the start of each session, ask the user which
  folder to use. Always read the rename_log.md first to resume from the
  correct file.
---

# Invoice Renamer

Renames scanned invoice PDFs using a consistent structured filename.
After every rename, the file is immediately moved to the `Done/` subfolder.

## Filename Format

```
AB-YYMM-F#-KR#.pdf
```

| Part | Meaning | Example |
|---|---|---|
| `AB` | 2-letter supplier code (see table below) | `MH` |
| `YYMM` | Invoice date: 2-digit year + 2-digit month | `2311` |
| `F#` | Invoice number as printed on document | `F69011` |
| `KR#` | Total amount in SEK, no decimals | `KR15621` |

**Full example:** `MH-2311-F69011-KR15621.pdf`

---

## Rules

1. **Never delete** — duplicates get `-DUP` suffix (3rd copy: `-DUP2`, etc.)
2. **Missing total** — use `KRUNKNOWN` and flag in log for review
3. **Missing invoice number** — use `FUNKNOWN` and flag in log for review
4. **Reminder/notice docs** — use `REMINDER` instead of `F#`, include referenced invoice if visible (e.g. `MH-2401-REMINDER-F71280-KR7263.pdf`)
5. **Credit notes** — treat normally, KR amount will be negative (e.g. `KR-623`)
6. **Guesses** — never stop; make best guess, log it clearly with ⚠️ GUESS tag
7. **Multi-page invoices** — if total is on a missing page, use `KRUNKNOWN`
8. **Inkassokrav / debt collection** — use the referenced fakturanummer, supplier = collection agency (e.g. SI = Svea Inkasso)

---

## Supplier Code Reference

| Code | Supplier Name |
|---|---|
| EA | East Asian Food AB |
| EM | Entrémattan AB |
| HF | Hung Fat Trading Asien Livs AB |
| LB | Länsförsäkringar Bergslagen |
| LS | Loomis Sverige AB |
| MA | Mälarenergi AB |
| MF | Mälarfresh Food |
| MH | Madam Hong Import-Export AB |
| RC | ReCo Revision Västerås AB |
| SD | Securitas Direct Sverige AB |
| SG | Snabbgross |
| SI | Svea Inkasso AB |
| ST | Stendörren Stockholm 7 AB |
| TF | Thai Fong Food AB |
| TR | Tre (3) |
| VM | VafabMiljö Kommunalförbund |
| WK | Wasa Kredit AB |

> Add new suppliers to this table as they are encountered. Use the first
> two meaningful letters of the supplier name. Avoid conflicts with existing codes.

---

## Workflow (per session)

### Step 0 — Ask which folder to use
**Always ask the user** which folder to work in before doing anything else.
Example prompt: *"Which folder should I rename invoices in? Please paste the path."*

Once confirmed, use that path as `{FOLDER}` for all subsequent steps.
The `rename_log.md` and `Done/` subfolder both live inside `{FOLDER}`.

### Step 1 — Read the log
Read `{FOLDER}/rename_log.md` to find:
- Existing supplier codes (to stay consistent)
- Any open REVIEW or UNKNOWN items
- Where to continue from

### Step 2 — Ensure Done/ folder exists
Use `Filesystem:create_directory` to ensure `{FOLDER}/Done` exists before processing:
```
Filesystem:create_directory
path: {FOLDER}/Done
```
This is safe to call even if the folder already exists.

### Step 3 — List the folder to find unprocessed files
Use `Filesystem:list_directory` to get the current contents of the PDFs folder.
Unprocessed files are anything that does NOT match the `AB-YYMM-F#-KR#.pdf` pattern
and is not `rename_log.md`, `.DS_Store`, or the `Done/` directory.

> ⚠️ Files are NOT in any guaranteed sequence. There may be gaps (e.g. 1594 missing,
> next file jumps to 1607). Always list the folder fresh — never assume which
> numbered files exist. Pick the next N unprocessed files from whatever is actually present.

### Step 4 — Read PDFs directly from Mac (NO copy needed)
Use `Desktop Commander:read_multiple_files` to read up to 5 PDFs at once directly
from the user's Mac. This renders each PDF as a viewable image automatically.

```
Desktop Commander:read_multiple_files
paths: [
  "{FOLDER}/1612.pdf",
  "{FOLDER}/1617.pdf",
  ...up to 5 at a time — use actual files from the listing, not guessed names
]
```

> ⚠️ Do NOT use `Filesystem:copy_file_user_to_claude` + bash JPEG extraction.
> That old approach used 3 tool calls per file. The Desktop Commander method
> reads and renders all 5 in a single tool call — ~10x more efficient.

### Step 5 — Extract data from image
From each invoice image, read:
- **Supplier name** → derive 2-letter code (check log for existing codes first)
- **Fakturadatum** (invoice date) → convert to YYMM
- **Fakturanr / Faktura nr** (invoice number) → use as F#
- **ATT BETALA SEK / Fakturatotal / Totalt inkl. moms / Belopp att betala** → use as KR#

### Step 6 — Rename AND immediately move to Done/ in one operation
For each file, use a single `Filesystem:move_file` call that renames AND moves
directly into the `Done/` subfolder in one step:

```
Filesystem:move_file
source:      {FOLDER}/1576.pdf
destination: {FOLDER}/Done/HF-2401-F1057751-KR-477.pdf
```

> ✅ KEY RULE: rename + move happen in ONE tool call per file.
> Never rename in-place first and then move separately — that wastes tool calls
> and leaves files stranded if the session ends early.

Do all rename+move operations together after reading the full batch of 5–10 files.

### Step 7 — Update the log
Append the session results to `rename_log.md` using `Desktop Commander:write_file`
with `mode: append`. Include:
- Session date
- Any new supplier codes added
- Table row per file: Original | New Name | Supplier | Date | Invoice # | Total SEK | Status | Notes
- Update "Next session: continue from X.pdf" at the bottom

---

## Log File Location

The log lives in the same folder as the PDFs being processed:
```
{FOLDER}/rename_log.md
```
If no log exists yet in the chosen folder, create one fresh.

---

## Batch Size

Process a **maximum of 10 files per session** using Desktop Commander's batch read (5 per call).
Always confirm results with a summary table before ending the session.

Tool call budget per 10-file batch:
- 1 × Filesystem:create_directory (Done/ folder, safe to repeat) = 1 call
- 2 × read_multiple_files (5 files each) = 2 calls
- ~10 × Filesystem:move_file (rename + move in one step) = 10 calls
- 1 × write_file (log append) = 1 call
- Total: ~14 calls

---

## Starting Prompt (for new sessions)

The user can say things like:
> "Load the invoice renamer and process the next batch."
> "Continue renaming invoices."
> "Rename invoices in [folder]."

Claude should then:
1. **Ask which folder** to work in (unless already specified in the message)
2. Read `{FOLDER}/rename_log.md` for supplier codes and open items
3. Ensure `{FOLDER}/Done/` exists with `Filesystem:create_directory`
4. List the folder with `Filesystem:list_directory` to find all unprocessed files
5. Use `Desktop Commander:read_multiple_files` to read the next batch (5 at a time)
6. For each file: rename + move directly into `Done/` in a single `Filesystem:move_file` call
7. Append results to the log

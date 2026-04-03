# Skill Organization & Documentation Fix Plan

**Status**: Three tasks completed, ready for execution
**Date**: 2026-04-03

## ✅ Completed (Skills Organization & Documentation)

### 1. ✅ Created INDEX.md Catalog
- **File**: `INDEX.md`
- **Content**:
  - 77 skills organized by 12 categories
  - Status overview (active/experimental/legacy)
  - Quick navigation with TOC
  - Legend explaining badges and icons
- **Usage**: Reference guide for finding skills across categories

### 2. ✅ Created FRONTMATTER_AUDIT.md Report
- **File**: `FRONTMATTER_AUDIT.md`
- **Findings**:
  - 44 skills missing descriptions (HIGH PRIORITY)
  - 17 complex skills missing README.md (MEDIUM PRIORITY)
  - 48 skills missing license metadata (LOW PRIORITY)
  - 1 skill with corrupted frontmatter format (eagle-skill)

### 3. ✅ Created Analysis Scripts
- **analyze-skills.js**: Generates categorized index with metadata
- **frontmatter-audit.js**: Audits consistency and generates reports

---

## 🔧 Phase 1: Critical Fixes (HIGH PRIORITY)

### Task 1.1: Fix Corrupted Frontmatter (1 skill)
**Skill**: `eagle-skill`
**Issue**: SKILL.md has invalid structure or missing frontmatter
**Action Required**: Read file and fix frontmatter format

### Task 1.2: Add Missing Descriptions (44 skills)
**Issue**: Many critical skills lack descriptions in frontmatter
**Examples**:
- brainstorming
- systematic-debugging
- vercel-deploy
- n8n-mcp-tools-expert
- writing-skills

**What to do**:
1. Read each skill's SKILL.md
2. Extract purpose from the first section
3. Add concise 1-2 sentence description to frontmatter

**Format**:
```markdown
---
name: skill-name
description: "Brief description of what this skill does and when to use it."
---
```

**Tip**: Use the first line or first paragraph of the skill doc as the basis for the description.

---

## 📚 Phase 2: Documentation (MEDIUM PRIORITY)

### Task 2.1: Create README.md for Complex Skills (17 skills)

**Skills that need README.md** (3+ supporting files):
- figma-implement-design
- openai-docs
- spreadsheet
- chatgpt-apps
- claude-api
- figma
- mcp-builder
- screenshot
- slack-gif-creator
- subagent-driven-development
- swiftui-skills
- systematic-debugging
- theme-factory
- vercel-deploy
- webapp-testing
- writing-skills

**README.md Template**:
```markdown
# Skill Name

## Overview
[1-2 sentence description of what this skill does]

## When to Use
- Use case 1
- Use case 2
- Use case 3

## Key Files
- **SKILL.md** - Main skill definition
- **[other-file].md** - Purpose of file
- **[guide].md** - What this guide covers

## Related Skills
- [related-skill-name](../related-skill-name/) - How it differs

## Quick Start
[If applicable, 3-4 steps to get started]
```

---

## ℹ️ Phase 3: Ongoing Compliance (LOW PRIORITY)

### Task 3.1: Add License Metadata
Most skills should have license info. Add to frontmatter:
```markdown
---
name: skill-name
description: "Description"
license: "MIT" # or appropriate license
source: "github-username/repo" # if applicable
---
```

---

## How to Execute

### Option A: Manual Fix (per-skill)
```bash
# 1. Navigate to skill directory
cd ~/Developer/master-skills/brainstorming

# 2. Edit SKILL.md and update frontmatter
# 3. Commit and push

git add SKILL.md
git commit -m "docs: add description to brainstorming skill"
```

### Option B: Bulk Descriptions (if you provide content)
I can write a script to batch-update descriptions once you provide the text for each skill.

### Option C: Priority Order
Fix in this order:
1. **Core System** category (5 skills) - foundational skills
2. **Code & Development** category (8 skills) - frequently used
3. **MCP & Integrations** category (6 skills) - new tools
4. Everything else

---

## Success Metrics

After completion:
- ✅ 100% of skills have descriptions
- ✅ 17 complex skills have README.md
- ✅ All frontmatter is consistent
- ✅ Eagle-skill format is fixed
- ✅ 48 skills have license metadata

---

## Next Steps

**Immediate**:
1. Would you like to start with Phase 1 (critical fixes)?
2. Should I fix the eagle-skill corruption first?
3. Would you like to provide descriptions bulk, or should I draft them from existing skill content?

**After completion**:
1. Commit and push all changes
2. Update sync-skills.sh to include INDEX and audit reports in push
3. Schedule quarterly audits to maintain quality

---

## Files Generated
- `/Users/aliamin/Developer/master-skills/INDEX.md` - Categorical index
- `/Users/aliamin/Developer/master-skills/FRONTMATTER_AUDIT.md` - Detailed audit report
- `/Users/aliamin/Developer/master-skills/scripts/analyze-skills.js` - Analysis tool
- `/Users/aliamin/Developer/master-skills/scripts/frontmatter-audit.js` - Audit tool
- `/Users/aliamin/Developer/master-skills/SKILL_REPAIRS.md` - This file (action plan)

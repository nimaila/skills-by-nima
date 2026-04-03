#!/usr/bin/env node
/**
 * Frontmatter Consistency Audit & Report
 * Identifies missing/inconsistent metadata across skills
 */

const fs = require('fs');
const path = require('path');

const skillsDir = '/Users/aliamin/Developer/master-skills';

const issues = {
  missingDescription: [],
  missingReadme: [],
  missingLicense: [],
  inconsistentFormat: [],
  emptyMetadata: []
};

function auditSkill(dir) {
  const skillPath = path.join(skillsDir, dir, 'SKILL.md');
  if (!fs.existsSync(skillPath)) return;

  const content = fs.readFileSync(skillPath, 'utf-8');
  const match = content.match(/---\n([\s\S]*?)\n---/);
  if (!match) {
    issues.inconsistentFormat.push(dir);
    return;
  }

  const fm = match[1];
  const name = fm.match(/name:\s*(.+)/)?.[1]?.trim();
  const description = fm.match(/description:\s*["']?([\s\S]*?)["']?\n/)?.[1]?.trim();
  const license = fm.match(/license:\s*(.+)/)?.[1]?.trim();

  if (!name || !description || description === 'No description') {
    issues.missingDescription.push({
      folder: dir,
      name: name || '(no name)',
      hasDescription: !!description && description !== 'No description'
    });
  }

  if (!license && !fm.includes('source')) {
    issues.missingLicense.push(dir);
  }

  const dirContents = fs.readdirSync(path.join(skillsDir, dir));
  const fileCount = dirContents.filter(f => !f.startsWith('.')).length;
  if (fileCount > 3 && !dirContents.includes('README.md')) {
    issues.missingReadme.push({
      folder: dir,
      fileCount: fileCount,
      files: dirContents.filter(f => !f.startsWith('.') && f !== 'SKILL.md').slice(0, 3)
    });
  }
}

const dirs = fs.readdirSync(skillsDir)
  .filter(f => {
    const fullPath = path.join(skillsDir, f);
    return fs.statSync(fullPath).isDirectory() && !f.startsWith('.');
  });

dirs.forEach(auditSkill);

// Generate report
let report = `# Frontmatter Consistency Audit\n\n`;
report += `**Date**: ${new Date().toISOString().split('T')[0]}\n`;
report += `**Total Skills**: ${dirs.length}\n\n`;

report += `## Issues Summary\n\n`;
report += `| Issue | Count | Severity |\n`;
report += `|-------|-------|----------|\n`;
report += `| Missing Description | ${issues.missingDescription.length} | HIGH |\n`;
report += `| Missing README | ${issues.missingReadme.length} | MEDIUM |\n`;
report += `| Missing License | ${issues.missingLicense.length} | LOW |\n`;
report += `| Inconsistent Format | ${issues.inconsistentFormat.length} | HIGH |\n\n`;

// Missing descriptions (priority 1)
if (issues.missingDescription.length > 0) {
  report += `## 🔴 Missing Descriptions (HIGH PRIORITY)\n\n`;
  report += `These skills need descriptions in their frontmatter:\n\n`;
  issues.missingDescription.forEach(item => {
    report += `### ${item.name}\n`;
    report += `- **Folder**: \`${item.folder}\`\n`;
    report += `- **Has Description**: ${item.hasDescription}\n`;
    report += `- **Action**: Add concise description (1-2 sentences) to SKILL.md frontmatter\n\n`;
  });
}

// Missing README (priority 2)
if (issues.missingReadme.length > 0) {
  report += `## ⚠️ Missing README.md (MEDIUM PRIORITY)\n\n`;
  report += `Complex skills (3+ files) should have README.md for navigation:\n\n`;
  issues.missingReadme.forEach(item => {
    report += `### ${item.folder}\n`;
    report += `- **Files**: ${item.fileCount}\n`;
    report += `- **Supporting Files**: ${item.files.join(', ')}\n`;
    report += `- **Action**: Create README.md with overview and file descriptions\n\n`;
  });
}

// Missing license (priority 3)
if (issues.missingLicense.length > 0) {
  report += `## ℹ️ Missing License Info (LOW PRIORITY)\n\n`;
  report += `These skills don't have license metadata:\n\n`;
  report += `\`\`\`\n${issues.missingLicense.join('\n')}\n\`\`\`\n\n`;
}

// Inconsistent format (priority 1)
if (issues.inconsistentFormat.length > 0) {
  report += `## 🔴 Inconsistent Frontmatter Format (HIGH PRIORITY)\n\n`;
  report += `These skills have invalid SKILL.md structure:\n\n`;
  report += `\`\`\`\n${issues.inconsistentFormat.join('\n')}\n\`\`\`\n\n`;
}

// Recommendations
report += `## Recommendations\n\n`;
report += `### Phase 1: Critical Fixes\n`;
report += `1. Fix inconsistent frontmatter format (${issues.inconsistentFormat.length} skills)\n`;
report += `2. Add missing descriptions (${issues.missingDescription.length} skills)\n`;
report += `3. Priority: Core System and Code & Development categories\n\n`;

report += `### Phase 2: Documentation\n`;
report += `1. Create README.md for ${issues.missingReadme.length} complex skills\n`;
report += `2. Add license information\n\n`;

report += `### Phase 3: Ongoing\n`;
report += `1. Enforce frontmatter requirements for new skills\n`;
report += `2. Use skill-creator skill template for consistency\n`;
report += `3. Run audit monthly to track compliance\n`;

// Save report
const reportPath = path.join(skillsDir, 'FRONTMATTER_AUDIT.md');
fs.writeFileSync(reportPath, report, 'utf-8');

console.log(report);
console.log(`\n📋 Full report saved to: ${reportPath}`);

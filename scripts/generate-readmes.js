#!/usr/bin/env node
/**
 * Generate README.md files for complex skills
 * Creates documentation for skills with 3+ supporting files
 */

const fs = require('fs');
const path = require('path');

const skillsDir = '/Users/aliamin/Developer/master-skills';

// Skills that need README.md (identified from audit)
const complexSkills = [
  '"figma-implement-design"',
  '"openai-docs"',
  '"spreadsheet"',
  'chatgpt-apps',
  'claude-api',
  'figma',
  'mcp-builder',
  'openai-docs',
  'screenshot',
  'slack-gif-creator',
  'subagent-driven-development',
  'swiftui-skills',
  'systematic-debugging',
  'theme-factory',
  'vercel-deploy',
  'webapp-testing',
  'writing-skills'
];

function extractDescription(skillPath) {
  const skillMdPath = path.join(skillsDir, skillPath, 'SKILL.md');
  if (!fs.existsSync(skillMdPath)) return 'Skill for working with this tool or feature.';

  const content = fs.readFileSync(skillMdPath, 'utf-8');
  const match = content.match(/description:\s*["']?([\s\S]*?)["']?\n/);
  if (match) {
    let desc = match[1].trim();
    // Remove quote if present
    if (desc.startsWith('"')) desc = desc.slice(1);
    if (desc.endsWith('"')) desc = desc.slice(0, -1);
    return desc;
  }
  return 'Skill for working with this tool or feature.';
}

function getFileList(skillPath) {
  const fullPath = path.join(skillsDir, skillPath);
  const files = fs.readdirSync(fullPath)
    .filter(f => !f.startsWith('.') && f !== 'SKILL.md')
    .sort();

  return files;
}

function generateReadme(skillPath, description, files) {
  const skillName = path.basename(skillPath)
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  let readme = `# ${skillName}\n\n`;
  readme += `## Overview\n\n`;
  readme += `${description}\n\n`;

  readme += `## When to Use\n\n`;
  readme += `Use this skill when you need to work with this tool or feature in your project.\n\n`;

  if (files.length > 0) {
    readme += `## Key Files\n\n`;
    const docFiles = files.filter(f => f.endsWith('.md'));
    const otherFiles = files.filter(f => !f.endsWith('.md'));

    if (docFiles.length > 0) {
      docFiles.forEach(f => {
        const name = f.replace(/\.md$/, '').replace(/-/g, ' ');
        readme += `- **${f}** — ${name} documentation\n`;
      });
      readme += `\n`;
    }

    if (otherFiles.length > 0) {
      readme += `### Supporting Files\n\n`;
      otherFiles.slice(0, 5).forEach(f => {
        readme += `- \`${f}\`\n`;
      });
      if (otherFiles.length > 5) {
        readme += `- ...and ${otherFiles.length - 5} more files\n`;
      }
      readme += `\n`;
    }
  }

  readme += `## Usage\n\n`;
  readme += `1. Review the SKILL.md file for complete documentation\n`;
  readme += `2. Check supporting files for specific guidance\n`;
  readme += `3. Follow the patterns and conventions outlined in the skill\n\n`;

  readme += `## Related Skills\n\n`;
  readme += `- See INDEX.md for other skills in this category\n\n`;

  return readme;
}

// Main execution
console.log('📝 Generating README.md files for complex skills...\n');

let created = 0;
let skipped = 0;

complexSkills.forEach(skillName => {
  const readmePath = path.join(skillsDir, skillName, 'README.md');

  if (fs.existsSync(readmePath)) {
    console.log(`⏭️  ${skillName} — already has README.md`);
    skipped++;
    return;
  }

  const description = extractDescription(skillName);
  const files = getFileList(skillName);
  const readme = generateReadme(skillName, description, files);

  fs.writeFileSync(readmePath, readme, 'utf-8');
  console.log(`✅ ${skillName}`);
  created++;
});

console.log(`\n📊 Results:\n`);
console.log(`✅ Created: ${created}`);
console.log(`⏭️  Already exist: ${skipped}`);
console.log(`\n✨ README generation complete!`);

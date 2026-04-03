#!/usr/bin/env node
/**
 * Skill Catalog & Analysis Tool
 * Analyzes all skills, checks frontmatter consistency, and generates INDEX.md
 */

const fs = require('fs');
const path = require('path');

const skillsDir = '/Users/aliamin/Developer/master-skills';

// Skill categories based on purpose/domain
const categories = {
  'Core System': ['brainstorming', 'using-superpowers', 'skill-creator', 'executing-plans', 'writing-plans'],
  'Code & Development': ['javascript-typescript', 'code-documentation', 'llm-application-dev', 'test-driven-development', 'systematic-debugging', 'finishing-a-development-branch', 'requesting-code-review', 'receiving-code-review'],
  'Frontend & Design': ['frontend-design', 'web-design-guidelines', 'web-artifacts-builder', 'canvas-design', 'figma', 'figma-implement-design', 'Framer Expert', 'theme-factory', 'vercel-react-best-practices'],
  'AI & LLM Tools': ['claude-api', 'openai-docs', 'subagent-driven-development', 'dispatching-parallel-agents', 'llm-application-dev'],
  'MCP & Integrations': ['mcp-builder', 'n8n-mcp-tools-expert', 'n8n-node-configuration', 'n8n-workflow-patterns', 'connect-apps', 'connect'],
  'Platform-Specific': ['vercel-deploy', 'vercel-composition-patterns', 'vercel-react-native-skills', 'swiftui-skills'],
  'Content & Documents': ['pdf', 'docx', 'xlsx', 'pptx', 'changelog-generator', 'tailored-resume-generator'],
  'Research & Analysis': ['lead-research-assistant', 'developer-growth-analysis', 'competitive-ads-extractor', 'meeting-insights-analyzer', 'content-research-writer'],
  'Productivity & Automation': ['workflow-optimizer', 'file-organizer', 'invoice-organizer', 'google-admin-automation', 'internal-comms'],
  'Creative & Visual': ['algorithmic-art', 'image-enhancer', 'slack-gif-creator', 'screenshot', 'remotion-best-practices', 'brand-guidelines'],
  'Social & Web': ['twitter-algorithm-optimizer', 'langsmith-fetch', 'domain-name-brainstormer', 'session-handoff'],
  'Specialized': ['raffle-winner-picker', 'chatgpt-apps', 'webapp-testing', 'database-design', 'using-git-worktrees', 'skill-share', 'verification-before-completion', 'doc-coauthoring'],
};

// Skills marked as legacy/experimental
const legacyKeywords = ['template', 'example', 'draft', 'old', 'deprecated', 'wip'];
const experimentalKeywords = ['draft', 'wip', 'beta', 'prototype'];

function readSkillMetadata(dir) {
  const skillPath = path.join(skillsDir, dir, 'SKILL.md');
  if (!fs.existsSync(skillPath)) return null;

  const content = fs.readFileSync(skillPath, 'utf-8');
  const match = content.match(/---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const fm = match[1];
  const metadata = {
    folder: dir,
    name: fm.match(/name:\s*([^\n]+)/)?.[1]?.trim() || dir,
    description: fm.match(/description:\s*["']?([\s\S]*?)["']?\n/)?.[1]?.trim()?.substring(0, 120) || 'No description',
    source: fm.match(/source:\s*([^\n]+)/)?.[1]?.trim() || null,
    license: fm.match(/license:\s*([^\n]+)/)?.[1]?.trim() || null,
    hasReadme: false,
    hasGuides: [],
    fileCount: 0,
    isComplex: false,
    status: 'active'
  };

  // Check for additional documentation
  const dirContents = fs.readdirSync(path.join(skillsDir, dir));
  metadata.fileCount = dirContents.filter(f => !f.startsWith('.')).length;
  metadata.hasReadme = dirContents.includes('README.md');
  metadata.hasGuides = dirContents.filter(f => f.endsWith('_GUIDE.md') || f.endsWith('_guide.md'));
  metadata.isComplex = metadata.fileCount > 3;

  // Determine status
  const nameLower = metadata.name.toLowerCase();
  if (legacyKeywords.some(kw => nameLower.includes(kw))) {
    metadata.status = 'legacy';
  } else if (experimentalKeywords.some(kw => nameLower.includes(kw))) {
    metadata.status = 'experimental';
  }

  return metadata;
}

function categorizeSkill(skillName) {
  for (const [category, skills] of Object.entries(categories)) {
    if (skills.includes(skillName)) {
      return category;
    }
  }
  return 'Uncategorized';
}

function generateIndex(skillsList) {
  let index = `# Skills Catalog & Index

**Last Updated**: ${new Date().toISOString().split('T')[0]}
**Total Skills**: ${skillsList.length}
**Complex Skills** (3+ files): ${skillsList.filter(s => s.isComplex).length}
**Skills with Documentation**: ${skillsList.filter(s => s.hasReadme).length}

## Quick Navigation

`;

  // Add category TOC
  Object.keys(categories).forEach(cat => {
    const count = skillsList.filter(s => categorizeSkill(s.folder) === cat).length;
    if (count > 0) {
      index += `- [${cat}](#${cat.toLowerCase().replace(/\s+/g, '-')}) (${count})\n`;
    }
  });

  index += `\n## Status Overview

| Status | Count | Notes |\n`;
  index += `|--------|-------|-------|\n`;

  const statuses = { active: 0, experimental: 0, legacy: 0 };
  skillsList.forEach(s => statuses[s.status]++);

  index += `| Active | ${statuses.active} | Core production skills |\n`;
  index += `| Experimental | ${statuses.experimental} | Beta/WIP skills (use with caution) |\n`;
  index += `| Legacy | ${statuses.legacy} | Deprecated/older skills (consider alternatives) |\n`;

  // Organize by category
  Object.keys(categories).forEach(category => {
    const categorySkills = skillsList
      .filter(s => categorizeSkill(s.folder) === category)
      .sort((a, b) => a.name.localeCompare(b.name));

    if (categorySkills.length === 0) return;

    index += `\n## ${category}\n\n`;

    categorySkills.forEach(skill => {
      const statusBadge = skill.status === 'active' ? '✅' : skill.status === 'experimental' ? '⚠️' : '🔴';
      const complexBadge = skill.isComplex ? ' [📚]' : '';
      const docsBadge = skill.hasReadme ? ' [📖]' : '';

      index += `### ${skill.name}${complexBadge}${docsBadge} ${statusBadge}\n\n`;
      index += `- **Folder**: \`${skill.folder}\`\n`;
      index += `- **Status**: ${skill.status}\n`;
      index += `- **Description**: ${skill.description}\n`;
      index += `- **Files**: ${skill.fileCount}\n`;

      if (skill.hasGuides.length > 0) {
        index += `- **Guides**: ${skill.hasGuides.join(', ')}\n`;
      }
      if (skill.source) {
        index += `- **Source**: ${skill.source}\n`;
      }
      if (skill.license) {
        index += `- **License**: ${skill.license}\n`;
      }
      index += '\n';
    });
  });

  // Add legend
  index += `\n## Legend

| Symbol | Meaning |\n`;
  index += `|--------|----------|\n`;
  index += `| ✅ | Active - Ready for production use |\n`;
  index += `| ⚠️ | Experimental - Beta or WIP, may change |\n`;
  index += `| 🔴 | Legacy - Deprecated, consider alternatives |\n`;
  index += `| [📚] | Complex - 3+ supporting files |\n`;
  index += `| [📖] | Documented - Has README.md |\n`;

  return index;
}

// Main execution
console.log('🔍 Analyzing skills...\n');

const dirs = fs.readdirSync(skillsDir)
  .filter(f => {
    const fullPath = path.join(skillsDir, f);
    return fs.statSync(fullPath).isDirectory() && !f.startsWith('.');
  })
  .sort();

const skills = [];
const issues = [];

dirs.forEach(dir => {
  const metadata = readSkillMetadata(dir);
  if (metadata) {
    skills.push(metadata);

    // Check for issues
    if (!metadata.hasReadme && metadata.isComplex) {
      issues.push(`⚠️ Complex skill "${dir}" missing README.md`);
    }
    if (!metadata.description || metadata.description === 'No description') {
      issues.push(`⚠️ Skill "${dir}" has no description`);
    }
  }
});

// Generate and save index
const indexContent = generateIndex(skills);
const indexPath = path.join(skillsDir, 'INDEX.md');
fs.writeFileSync(indexPath, indexContent, 'utf-8');

// Generate summary report
console.log(`✅ Analyzed ${skills.length} skills\n`);
console.log(`📄 Generated INDEX.md\n`);

// Summary statistics
console.log('Summary Statistics:');
console.log(`  Total Skills: ${skills.length}`);
console.log(`  Active: ${skills.filter(s => s.status === 'active').length}`);
console.log(`  Experimental: ${skills.filter(s => s.status === 'experimental').length}`);
console.log(`  Legacy: ${skills.filter(s => s.status === 'legacy').length}`);
console.log(`  Complex (3+ files): ${skills.filter(s => s.isComplex).length}`);
console.log(`  With README.md: ${skills.filter(s => s.hasReadme).length}`);
console.log(`  With guides: ${skills.filter(s => s.hasGuides.length > 0).length}\n`);

if (issues.length > 0) {
  console.log('⚠️  Issues Found:');
  issues.forEach(issue => console.log(`  ${issue}`));
  console.log('');
}

console.log(`📍 Index saved to: ${indexPath}`);

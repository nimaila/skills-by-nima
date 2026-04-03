#!/usr/bin/env node
/**
 * Bulk Fix Frontmatter Script
 * Fixes missing descriptions and standardizes frontmatter across all skills
 */

const fs = require('fs');
const path = require('path');

const skillsDir = '/Users/aliamin/Developer/master-skills';

// Skills known to have issues that need manual review
const knownIssues = {
  'eagle-skill': 'Already has description - verify format'
};

function extractDescriptionFromContent(content) {
  // Remove frontmatter first
  const withoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n/, '');

  // Look for first heading and following paragraph
  const headingMatch = withoutFrontmatter.match(/^#+\s+(.+)\n\n([\s\S]*?)(?:\n##|\n\n###|$)/m);
  if (headingMatch && headingMatch[2]) {
    const paragraph = headingMatch[2]
      .split('\n')[0]
      .trim()
      .substring(0, 120);
    return paragraph;
  }

  // Fallback: take first non-empty line after frontmatter
  const lines = withoutFrontmatter.split('\n').filter(l => l.trim());
  for (const line of lines) {
    if (!line.startsWith('#') && line.length > 10) {
      return line.substring(0, 120);
    }
  }

  return 'Skill for working with this tool or feature.';
}

function fixSkill(dir) {
  const skillPath = path.join(skillsDir, dir, 'SKILL.md');
  if (!fs.existsSync(skillPath)) return { status: 'no-skill-file', folder: dir };

  const content = fs.readFileSync(skillPath, 'utf-8');

  // Parse frontmatter more robustly
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) {
    return { status: 'invalid-format', folder: dir };
  }

  const [, frontmatter, bodyContent] = fmMatch;
  const fmLines = frontmatter.split('\n');

  // Parse existing frontmatter
  const fm = {};
  let inMultiline = false;
  let multilineKey = '';
  let multilineValue = '';

  for (const line of fmLines) {
    if (line.includes(':') && !inMultiline) {
      const [key, ...valueParts] = line.split(':');
      const value = valueParts.join(':').trim();

      if (value.startsWith('"')) {
        inMultiline = true;
        multilineKey = key.trim();
        multilineValue = value;
      } else {
        fm[key.trim()] = value;
      }
    } else if (inMultiline) {
      multilineValue += '\n' + line;
      if (line.includes('"')) {
        inMultiline = false;
        fm[multilineKey] = multilineValue;
      }
    }
  }

  // Check if description exists and is meaningful
  const hasDesc = fm.description &&
    fm.description.length > 10 &&
    !fm.description.includes('No description');

  if (!hasDesc) {
    // Extract description from content
    const extracted = extractDescriptionFromContent(content);
    fm.description = `"${extracted}"`;

    // Rebuild frontmatter with proper order
    let newFm = `---\n`;
    newFm += `name: ${fm.name || dir}\n`;
    newFm += `description: ${fm.description}\n`;

    // Add other fields if they exist
    if (fm.source) newFm += `source: ${fm.source}\n`;
    if (fm.license) newFm += `license: ${fm.license}\n`;
    if (fm['allowed-tools']) newFm += `allowed-tools: ${fm['allowed-tools']}\n`;

    newFm += `---\n`;

    const newContent = newFm + bodyContent;
    fs.writeFileSync(skillPath, newContent, 'utf-8');

    return { status: 'fixed', folder: dir, description: fm.description };
  }

  return { status: 'ok', folder: dir };
}

// Main execution
console.log('🔧 Fixing frontmatter across all skills...\n');

const dirs = fs.readdirSync(skillsDir)
  .filter(f => {
    const fullPath = path.join(skillsDir, f);
    return fs.statSync(fullPath).isDirectory() && !f.startsWith('.');
  })
  .sort();

const results = {
  fixed: [],
  ok: [],
  invalid: [],
  nofile: []
};

dirs.forEach(dir => {
  const result = fixSkill(dir);

  if (result.status === 'fixed') {
    results.fixed.push(result.folder);
    console.log(`✅ ${result.folder}`);
  } else if (result.status === 'ok') {
    results.ok.push(result.folder);
  } else if (result.status === 'invalid-format') {
    results.invalid.push(result.folder);
    console.log(`⚠️  ${result.folder} - invalid format`);
  } else if (result.status === 'no-skill-file') {
    results.nofile.push(result.folder);
  }
});

console.log(`\n📊 Results:\n`);
console.log(`✅ Fixed: ${results.fixed.length}`);
console.log(`✓ Already OK: ${results.ok.length}`);
console.log(`⚠️  Invalid format: ${results.invalid.length}`);
console.log(`❌ No SKILL.md: ${results.nofile.length}`);

if (results.fixed.length > 0) {
  console.log(`\n🔧 Fixed skills (${results.fixed.length}):`);
  results.fixed.forEach(f => console.log(`  • ${f}`));
}

console.log(`\n✨ Frontmatter fix complete!`);

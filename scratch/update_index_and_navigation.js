const fs = require('fs');
const path = require('path');

const docsDir = path.resolve(__dirname, '../docs');

function getAllMdFiles(dir, baseDir = dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllMdFiles(fullPath, baseDir));
    } else if (file.endsWith('.md')) {
      const relPath = path.relative(baseDir, fullPath);
      results.push({ fullPath, relPath });
    }
  });
  return results;
}

function parseTitle(content) {
  const lines = content.split('\n');
  for (let line of lines) {
    line = line.trim();
    if (line.startsWith('# ')) {
      return line.replace(/^#\s+/, '').trim();
    }
    if (line.startsWith('title:')) {
      return line.replace(/^title:\s*/, '').replace(/^["']|["']$/g, '').trim();
    }
  }
  return 'Untitled';
}

function getCategory(relPath) {
  const parts = relPath.split(path.sep);
  if (parts.length === 1) return 'root';
  return parts[0];
}

const mdFiles = getAllMdFiles(docsDir);
console.log(`Total MD files found in docs: ${mdFiles.length}`);

const navigationList = [];

mdFiles.forEach(({ fullPath, relPath }) => {
  const content = fs.readFileSync(fullPath, 'utf8');
  const title = parseTitle(content);
  const category = getCategory(relPath);
  
  // count HTTP methods
  const methods = (content.match(/\b(GET|POST|PUT|DELETE|PATCH)\b/g) || []).length;
  
  navigationList.push({
    title,
    rel_path: relPath,
    category,
    methods_count: Math.min(methods, 100)
  });
});

navigationList.sort((a, b) => a.rel_path.localeCompare(b.rel_path));

const navData = {
  metadata: {
    title: "Qlik REST APIs, Authentication, and Toolkits Documentation Index",
    total_files: navigationList.length,
    destination_path: docsDir
  },
  files: navigationList
};

fs.writeFileSync(path.join(docsDir, 'NAVIGATION.json'), JSON.stringify(navData, null, 2), 'utf8');
console.log(`Updated NAVIGATION.json with ${navigationList.length} files.`);

// Update HANDOVER_CONTEXT.md
const handoverPath = path.resolve(__dirname, '../HANDOVER_CONTEXT.md');
if (fs.existsSync(handoverPath)) {
  let handoverContent = fs.readFileSync(handoverPath, 'utf8');
  handoverContent = handoverContent.replace(/Total Documentation Files Scraped\*\*: \*\*\d+ Markdown Files\*\*/, `Total Documentation Files Scraped**: **${navigationList.length} Markdown Files**`);
  if (!handoverContent.includes('docs/authenticate/*.md')) {
    handoverContent = handoverContent.replace(
      '2. **`docs/INDEX.md`**: Master Table of Contents categorized by:\n',
      '2. **`docs/INDEX.md`**: Master Table of Contents categorized by:\n   - 🔑 **Authentication & Security** (`docs/authenticate/*.md`) - OAuth2, JWT, API Keys, Scopes, Impersonation, CSP.\n'
    );
  }
  fs.writeFileSync(handoverPath, handoverContent, 'utf8');
  console.log('Updated HANDOVER_CONTEXT.md');
}

// Add Authentication section to INDEX.md if missing
const indexPath = path.join(docsDir, 'INDEX.md');
let indexContent = fs.readFileSync(indexPath, 'utf8');

const authFiles = navigationList.filter(f => f.category === 'authenticate');
let authMdSection = '\n## 🔑 Authentication & Security Guides (qlik.dev/authenticate)\n\n';
authFiles.forEach(f => {
  authMdSection += `- [${f.title}](${f.rel_path})\n`;
});

if (!indexContent.includes('## 🔑 Authentication & Security Guides')) {
  indexContent += authMdSection;
} else {
  indexContent = indexContent.replace(/\n## 🔑 Authentication & Security Guides[\s\S]*/, authMdSection);
}

fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log('Updated INDEX.md with Authentication section.');

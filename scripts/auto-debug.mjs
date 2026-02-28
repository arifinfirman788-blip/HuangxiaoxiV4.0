import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const rootDir = process.cwd();
const targetFile = path.join(rootDir, 'src/components/ChatInterface.jsx');

const SAFE_ICON_WHITELIST = [
  'CheckCircle',
  'RefreshCcw',
  'Car',
  'Info',
  'Hotel',
  'MapPin',
  'Navigation',
  'Ticket',
  'Phone',
  'Clock',
  'Sparkles',
  'Star',
];

function run(cmd, args) {
  const ret = spawnSync(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' });
  return ret.status ?? 1;
}

function patchChatInterfaceLucideImports() {
  if (!fs.existsSync(targetFile)) return false;
  const code = fs.readFileSync(targetFile, 'utf8');
  const importRegex = /import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/;
  const importMatch = code.match(importRegex);
  if (!importMatch) return false;

  const imported = new Set(
    importMatch[1]
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => s.split(/\s+as\s+/)[0].trim())
  );

  const missing = [];
  for (const iconName of SAFE_ICON_WHITELIST) {
    if (imported.has(iconName)) continue;
    const usedInJsx = new RegExp(`<${iconName}[\\s/>]`).test(code);
    const usedAsIdentifier = new RegExp(`\\b${iconName}\\b`).test(code);
    if (usedInJsx || usedAsIdentifier) missing.push(iconName);
  }

  if (missing.length === 0) {
    console.log('图标导入检查通过：未发现缺失导入。');
    return false;
  }

  const merged = [...new Set([...imported, ...missing])].sort((a, b) => a.localeCompare(b));
  const newImport = `import { ${merged.join(', ')} } from 'lucide-react'`;
  fs.writeFileSync(targetFile, code.replace(importRegex, newImport), 'utf8');
  console.log(`已修复 ChatInterface 图标导入: ${missing.join(', ')}`);
  return true;
}

function main() {
  patchChatInterfaceLucideImports();

  // 只做构建校验，避免误改其它文件。
  const buildCode = run('npm', ['run', 'build']);
  if (buildCode !== 0) {
    console.error('自动调试完成，但 build 仍失败，请查看上方日志。');
    process.exit(buildCode);
  }
  console.log('自动调试完成：build 通过。');
}

main();

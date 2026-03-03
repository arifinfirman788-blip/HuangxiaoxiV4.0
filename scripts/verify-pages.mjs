import fs from 'node:fs';
import path from 'node:path';

const pkgPath = path.join(process.cwd(), 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const homepage = pkg.homepage;

if (!homepage) {
  console.error('未在 package.json 中找到 homepage，无法校验线上页面。');
  process.exit(1);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function toAbsolute(base, maybeRelative) {
  if (!maybeRelative) return null;
  if (/^https?:\/\//.test(maybeRelative)) return maybeRelative;
  return new URL(maybeRelative, base).toString();
}

async function fetchText(url) {
  const res = await fetch(url, { redirect: 'follow' });
  const text = await res.text();
  return { res, text };
}

function extractAssetUrls(html, baseUrl) {
  const scriptMatch = html.match(/<script[^>]+src="([^"]+)"/i);
  const cssMatch = html.match(/<link[^>]+href="([^"]+)"[^>]*>/i);
  return {
    scriptUrl: toAbsolute(baseUrl, scriptMatch?.[1]),
    cssUrl: toAbsolute(baseUrl, cssMatch?.[1]),
    hasDevEntry: /\/src\/main\.jsx/.test(html),
  };
}

async function checkAsset(url, label) {
  if (!url) {
    throw new Error(`${label} 地址为空`);
  }
  const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
  if (!res.ok) {
    throw new Error(`${label} 访问失败: ${res.status} ${res.statusText} (${url})`);
  }
}

async function runOnce() {
  const { res, text } = await fetchText(homepage);
  if (!res.ok) {
    throw new Error(`主页访问失败: ${res.status} ${res.statusText}`);
  }

  const { scriptUrl, cssUrl, hasDevEntry } = extractAssetUrls(text, homepage);

  if (hasDevEntry) {
    throw new Error(
      '检测到线上页面仍在使用 /src/main.jsx（开发入口）。请将 GitHub Pages Source 切换为 gh-pages 分支根目录（Deploy from a branch）。'
    );
  }

  await checkAsset(scriptUrl, 'JS 资源');
  await checkAsset(cssUrl, 'CSS 资源');

  console.log('线上页面校验通过：已正确加载构建产物资源。');
}

async function main() {
  const maxRetry = 5;
  for (let i = 1; i <= maxRetry; i += 1) {
    try {
      await runOnce();
      return;
    } catch (err) {
      if (i === maxRetry) {
        console.error(`线上校验失败（已重试 ${maxRetry} 次）：${err.message}`);
        process.exit(1);
      }
      console.warn(`第 ${i} 次校验失败：${err.message}`);
      await sleep(8000);
    }
  }
}

main();

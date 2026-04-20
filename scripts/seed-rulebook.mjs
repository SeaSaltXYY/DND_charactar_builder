#!/usr/bin/env node
/**
 * 预解析 CHM 规则书，生成 JSON 种子文件。
 * 用法: node scripts/seed-rulebook.mjs [path-to-chm]
 * 输出: src/data/rulebook-seed.json
 */
import { execFileSync } from "node:child_process";
import {
  mkdtempSync, rmSync, readdirSync, readFileSync, existsSync,
  writeFileSync, statSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, extname, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");

function find7z() {
  for (const cmd of ["/opt/homebrew/bin/7z", "/usr/local/bin/7z", "7z", "7zz"]) {
    try {
      execFileSync(cmd, ["--help"], { timeout: 5000, stdio: "ignore" });
      return cmd;
    } catch { continue; }
  }
  return null;
}

function stripHtml(html) {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#\d+;/g, " ")
    .replace(/\s{3,}/g, "\n\n")
    .trim();
}

function decodeHtml(buf) {
  const head = buf.subarray(0, Math.min(buf.length, 1024)).toString("ascii");
  const m = head.match(/charset\s*=\s*["']?\s*([\w-]+)/i);
  const declared = (m?.[1] || "").toLowerCase();

  if (declared.includes("gb") || declared.includes("gbk") || declared === "big5") {
    try {
      const decoder = new TextDecoder(declared === "gb2312" ? "gbk" : declared);
      return decoder.decode(buf);
    } catch { /* fallback */ }
  }

  const utf8 = buf.toString("utf-8");
  if (/\ufffd/.test(utf8.substring(0, 500))) {
    try { return new TextDecoder("gbk").decode(buf); } catch { /* fallback */ }
  }
  return utf8;
}

function walk(dir, results) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    try {
      if (entry.isDirectory()) {
        walk(full, results);
      } else if (entry.isFile()) {
        const ext = extname(entry.name).toLowerCase();
        if (ext === ".html" || ext === ".htm") {
          const buf = readFileSync(full);
          const raw = decodeHtml(buf);
          const text = stripHtml(raw);
          if (text.length > 30) results.push(text);
        }
      }
    } catch { /* skip */ }
  }
}

const CHAPTER_PATTERNS = [
  /^第[一二三四五六七八九十百零〇\d]+[章节回部篇卷].{0,80}$/m,
  /^Chapter\s+\d+[:：].{0,80}$/im,
  /^#+\s+.{1,80}$/m,
];

function isChapterTitle(line) {
  if (!line || line.length > 80) return false;
  return CHAPTER_PATTERNS.some(re => re.test(line));
}

function chunkDocument(fullText, chunkSize = 2500, overlap = 200) {
  const normalized = fullText
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const lines = normalized.split("\n");
  const sections = [];
  let current = { chapter: null, content: "" };
  for (const line of lines) {
    const stripped = line.trim();
    if (isChapterTitle(stripped)) {
      if (current.content.trim()) sections.push(current);
      current = { chapter: stripped.replace(/^#+\s*/, "").slice(0, 80), content: "" };
    } else {
      current.content += line + "\n";
    }
  }
  if (current.content.trim()) sections.push(current);
  if (sections.length === 0) sections.push({ chapter: null, content: normalized });

  const out = [];
  for (const sec of sections) {
    const paragraphs = sec.content.split(/\n\s*\n/).filter(p => p.trim());
    let buf = "";
    for (const para of paragraphs) {
      if (buf.length + para.length + 2 <= chunkSize) {
        buf += (buf ? "\n\n" : "") + para;
      } else {
        if (buf.trim().length >= 30) out.push({ content: buf.trim(), chapter: sec.chapter });
        if (para.length > chunkSize) {
          for (let i = 0; i < para.length; i += chunkSize - overlap) {
            const slice = para.slice(i, i + chunkSize).trim();
            if (slice.length >= 30) out.push({ content: slice, chapter: sec.chapter });
          }
          buf = "";
        } else {
          const tailStart = Math.max(0, buf.length - overlap);
          buf = buf.slice(tailStart) + "\n\n" + para;
        }
      }
    }
    if (buf.trim().length >= 30) out.push({ content: buf.trim(), chapter: sec.chapter });
  }
  return out;
}

// ---- main ----
const chmArg = process.argv[2];
const chmPath = chmArg
  ? resolve(chmArg)
  : (() => {
      const uploadsDir = join(PROJECT_ROOT, "data/uploads");
      if (!existsSync(uploadsDir)) { console.error("data/uploads 不存在"); process.exit(1); }
      const files = readdirSync(uploadsDir).filter(f => f.toLowerCase().endsWith(".chm"));
      if (files.length === 0) { console.error("data/uploads 中未找到 .chm 文件"); process.exit(1); }
      files.sort();
      return join(uploadsDir, files[files.length - 1]);
    })();

console.log(`📖 解析: ${chmPath}`);
const stats = statSync(chmPath);
console.log(`   文件大小: ${(stats.size / 1024 / 1024).toFixed(1)} MB`);

const sevenZip = find7z();
if (!sevenZip) { console.error("❌ 未找到 7z 命令"); process.exit(1); }

const tmpDir = mkdtempSync(join(tmpdir(), "chm-seed-"));
const outDir = join(tmpDir, "out");
try {
  const safeName = "rulebook.chm";
  const tmpChm = join(tmpDir, safeName);
  writeFileSync(tmpChm, readFileSync(chmPath));

  console.log("📦 解压中...");
  execFileSync(sevenZip, ["x", tmpChm, `-o${outDir}`, "-y"], { timeout: 120_000 });

  console.log("📝 提取 HTML 文本...");
  const texts = [];
  walk(outDir, texts);
  console.log(`   提取到 ${texts.length} 个文本块`);

  const fullText = texts.join("\n\n");
  console.log(`   总文本长度: ${fullText.length} 字符`);

  console.log("✂️  分块中...");
  const chunks = chunkDocument(fullText);
  console.log(`   生成 ${chunks.length} 个 chunks`);

  const seed = {
    name: "D&D 5E 不全书",
    version: "v2026.02.12",
    generatedAt: new Date().toISOString(),
    chunkCount: chunks.length,
    totalChars: fullText.length,
    chunks: chunks.map((c, i) => ({
      index: i,
      chapter: c.chapter,
      content: c.content,
    })),
  };

  const outPath = join(PROJECT_ROOT, "src/data/rulebook-seed.json");
  writeFileSync(outPath, JSON.stringify(seed, null, 2), "utf-8");
  const fileSizeMB = (statSync(outPath).size / 1024 / 1024).toFixed(1);
  console.log(`\n✅ 种子文件已生成: src/data/rulebook-seed.json (${fileSizeMB} MB, ${chunks.length} chunks)`);
} finally {
  rmSync(tmpDir, { recursive: true, force: true });
}

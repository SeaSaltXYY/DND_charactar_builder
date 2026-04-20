/**
 * 文档分块器：
 *  1. 先按中英文章节标题切成章节
 *  2. 再按字符长度（~ 500 tokens ≈ 1500 中文字符）切块
 *  3. 相邻块之间保留 overlap 以维持上下文
 */

export interface RawChunk {
  content: string;
  chapter: string | null;
  page_number: number | null;
  metadata?: Record<string, unknown>;
}

/** 简单的章节识别正则 */
const CHAPTER_PATTERNS: RegExp[] = [
  /^第[一二三四五六七八九十百零〇\d]+[章节回部篇卷].{0,80}$/m,
  /^Chapter\s+\d+[:：].{0,80}$/im,
  /^#+\s+.{1,80}$/m,
];

const DEFAULT_CHUNK_SIZE = 1500; // 中文字符
const DEFAULT_OVERLAP = 150;

export function chunkDocument(
  fullText: string,
  opts: { chunkSize?: number; overlap?: number } = {}
): RawChunk[] {
  const chunkSize = opts.chunkSize ?? DEFAULT_CHUNK_SIZE;
  const overlap = opts.overlap ?? DEFAULT_OVERLAP;

  const normalized = fullText
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const sections = splitByChapters(normalized);
  const out: RawChunk[] = [];

  for (const sec of sections) {
    const parts = splitByParagraphs(sec.content, chunkSize, overlap);
    for (const p of parts) {
      if (p.trim().length < 30) continue;
      out.push({
        content: p.trim(),
        chapter: sec.chapter,
        page_number: null,
        metadata: {},
      });
    }
  }
  return out;
}

function splitByChapters(
  text: string
): Array<{ chapter: string | null; content: string }> {
  const lines = text.split("\n");
  const sections: Array<{ chapter: string | null; content: string }> = [];
  let current: { chapter: string | null; content: string } = {
    chapter: null,
    content: "",
  };

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

  return sections.length > 0 ? sections : [{ chapter: null, content: text }];
}

function isChapterTitle(line: string): boolean {
  if (!line) return false;
  if (line.length > 80) return false;
  return CHAPTER_PATTERNS.some((re) => re.test(line));
}

function splitByParagraphs(
  text: string,
  chunkSize: number,
  overlap: number
): string[] {
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim());
  const chunks: string[] = [];
  let buf = "";

  for (const para of paragraphs) {
    if (buf.length + para.length + 2 <= chunkSize) {
      buf += (buf ? "\n\n" : "") + para;
    } else {
      if (buf) chunks.push(buf);
      if (para.length > chunkSize) {
        for (let i = 0; i < para.length; i += chunkSize - overlap) {
          chunks.push(para.slice(i, i + chunkSize));
        }
        buf = "";
      } else {
        const tailStart = Math.max(0, buf.length - overlap);
        buf = buf.slice(tailStart) + "\n\n" + para;
        if (buf.length > chunkSize) {
          chunks.push(buf.slice(0, chunkSize));
          buf = buf.slice(chunkSize - overlap);
        }
      }
    }
  }
  if (buf.trim()) chunks.push(buf);
  return chunks;
}

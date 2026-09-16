// 轻量 Markdown 渲染器：只覆盖笔记里实际用到的语法
// 支持：标题、段落（单换行 = <br>，与 Obsidian 一致）、围栏代码块、行内代码（` 与 ``）、
//      表格、有序/无序列表、引用、分割线、图片、链接、**加粗**、*斜体*、==高亮==
function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inline(raw) {
  return raw
    .split(/(``[^`]+``|`[^`\n]+`)/g)
    .map((chunk) => {
      if (!chunk) return '';
      if (chunk.startsWith('``') && chunk.endsWith('``')) {
        return `<code>${escapeHtml(chunk.slice(2, -2))}</code>`;
      }
      if (chunk.startsWith('`') && chunk.endsWith('`')) {
        return `<code>${escapeHtml(chunk.slice(1, -1))}</code>`;
      }
      let text = escapeHtml(chunk);
      text = text.replace(
        /!\[([^\]]*)\]\(([^)\s]+)\)/g,
        '<img src="$2" alt="$1" loading="lazy" />',
      );
      text = text.replace(
        /\[((?:[^\[\]]|\[[^\]]*\])*)\]\(([^)\s]+)\)/g,
        '<a href="$2" target="_blank" rel="noreferrer">$1</a>',
      );
      text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      text = text.replace(/==([^=]+)==/g, '<mark>$1</mark>');
      text = text.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
      return text;
    })
    .join('');
}

const isTableLine = (line) => /^\s*\|.*\|\s*$/.test(line);
const isTableSep = (line) => /^\s*\|[\s:|-]+\|\s*$/.test(line);
const isBlockStart = (line) =>
  /^(\s*```|#{1,6}\s|\s*\||\s*[-*]\s|\s*\d+[.)]\s|\s*>)/.test(line);

function splitRow(row) {
  return row
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

export function renderMarkdown(source) {
  const lines = String(source || '').replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (/^\s*```/.test(line)) {
      const buffer = [];
      i += 1;
      while (i < lines.length && !/^\s*```/.test(lines[i])) {
        buffer.push(lines[i]);
        i += 1;
      }
      i += 1;
      out.push(`<pre><code>${escapeHtml(buffer.join('\n'))}</code></pre>`);
      continue;
    }

    if (isTableLine(line) && i + 1 < lines.length && isTableSep(lines[i + 1])) {
      const rows = [];
      while (i < lines.length && isTableLine(lines[i])) {
        rows.push(lines[i]);
        i += 1;
      }
      const head = splitRow(rows[0]);
      const body = rows.slice(2).map(splitRow);
      out.push(
        '<div class="md-table-wrap"><table><thead><tr>' +
          head.map((cell) => `<th>${inline(cell)}</th>`).join('') +
          '</tr></thead><tbody>' +
          body
            .map(
              (row) =>
                `<tr>${row.map((cell) => `<td>${inline(cell)}</td>`).join('')}</tr>`,
            )
            .join('') +
          '</tbody></table></div>',
      );
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      const level = Math.min(4, Math.max(2, heading[1].length));
      out.push(
        `<h${level} class="md-h${heading[1].length}">${inline(heading[2])}</h${level}>`,
      );
      i += 1;
      continue;
    }

    if (/^\s*(---+|\*\*\*+)\s*$/.test(line)) {
      out.push('<hr />');
      i += 1;
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      const buffer = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        buffer.push(lines[i].replace(/^\s*>\s?/, ''));
        i += 1;
      }
      out.push(`<blockquote>${inline(buffer.join('\n'))}</blockquote>`);
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const buffer = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        buffer.push(lines[i].replace(/^\s*[-*]\s+/, ''));
        i += 1;
      }
      out.push(`<ul>${buffer.map((item) => `<li>${inline(item)}</li>`).join('')}</ul>`);
      continue;
    }

    if (/^\s*\d+[.)]\s+/.test(line)) {
      const buffer = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
        buffer.push(lines[i].replace(/^\s*\d+[.)]\s+/, ''));
        i += 1;
      }
      out.push(`<ol>${buffer.map((item) => `<li>${inline(item)}</li>`).join('')}</ol>`);
      continue;
    }

    if (line.trim() === '') {
      i += 1;
      continue;
    }

    const buffer = [line];
    i += 1;
    while (i < lines.length && lines[i].trim() !== '' && !isBlockStart(lines[i])) {
      buffer.push(lines[i]);
      i += 1;
    }
    out.push(`<p>${buffer.map((item) => inline(item)).join('<br />')}</p>`);
  }

  return out.join('\n');
}

export default function NoteMarkdown({ source }) {
  return (
    <div className="md" dangerouslySetInnerHTML={{ __html: renderMarkdown(source) }} />
  );
}
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowUpRight, Check, ChevronRight, Copy } from 'lucide-react';
import { getProjectById, featuredProjects } from '../data/projectDetails.js';

// ---- 代码块：带文件名标题与复制按钮 ----
function CodeBlock({ title, code }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // 剪贴板不可用时静默降级
    }
  };

  return (
    <figure className="pd-code">
      <figcaption className="pd-code-head">
        <span className="pd-code-dots" aria-hidden="true">
          <i /><i /><i />
        </span>
        <span className="pd-code-title">{title}</span>
        <button
          type="button"
          className={`pd-code-copy ${copied ? 'is-copied' : ''}`}
          onClick={copy}
          aria-label={copied ? '已复制' : '复制代码'}
        >
          {copied ? <Check size={14} strokeWidth={2} /> : <Copy size={14} strokeWidth={1.7} />}
          {copied ? '已复制' : '复制'}
        </button>
      </figcaption>
      <pre>
        <code>{code}</code>
      </pre>
    </figure>
  );
}

// ---- 正文区块渲染 ----
function DetailBlock({ block }) {
  if (block.type === 'p') return <p className="pd-p">{block.text}</p>;
  if (block.type === 'list') {
    return (
      <ul className="pd-list">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  if (block.type === 'code') {
    return <CodeBlock title={block.title} code={block.code} />;
  }
  if (block.type === 'figure') {
    const isSvg = block.src.endsWith('.svg');
    return (
      <figure className={`pd-figure ${block.wide ? 'is-wide' : ''}`}>
        <div className="pd-figure-frame">
          <img src={`${import.meta.env.BASE_URL}${block.src}`} alt={block.caption || ''} loading="lazy" />
        </div>
        {block.caption && <figcaption>{block.caption}</figcaption>}
      </figure>
    );
  }
  if (block.type === 'table') {
    return (
      <div className="pd-table-wrap">
        <table className="pd-table">
          <thead>
            <tr>
              {block.head.map((cell) => (
                <th key={cell}>{cell}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className={j === 0 ? 'is-key' : ''}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return null;
}

export default function ProjectDetailPage({ projectId, onBack }) {
  const project = getProjectById(projectId);
  const [activeId, setActiveId] = useState('');
  const bodyRef = useRef(null);

  const toc = useMemo(
    () =>
      project
        ? project.detail.sections.map((section) => ({ id: section.id, title: section.title }))
        : [],
    [project],
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [projectId]);

  // 目录滚动高亮
  useEffect(() => {
    if (!project) return undefined;
    const root = bodyRef.current;
    if (!root) return undefined;
    const headings = Array.from(root.querySelectorAll('.pd-section[id]'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -65% 0px' },
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [project]);

  if (!project) {
    return (
      <div className="pd-page">
        <div className="shell pd-missing">
          <p>没有找到这个项目。</p>
          <button type="button" className="pd-back" onClick={onBack}>
            <ArrowLeft size={16} strokeWidth={1.7} />
            返回项目列表
          </button>
        </div>
      </div>
    );
  }

  const idx = featuredProjects.findIndex((item) => item.id === project.id);
  const prev = featuredProjects[(idx - 1 + featuredProjects.length) % featuredProjects.length];
  const next = featuredProjects[(idx + 1) % featuredProjects.length];

  const goProject = (id) => {
    window.location.hash = `#/project/${id}`;
  };

  return (
    <div className="pd-page">
      <div className="shell pd-shell">
        <button type="button" className="pd-back" onClick={onBack}>
          <ArrowLeft size={16} strokeWidth={1.7} />
          返回项目列表
        </button>

        <header className="pd-head">
          <p className="pd-kicker">
            PROJECT DETAIL / {project.no}
          </p>
          <h1 className="pd-title">{project.title}</h1>
          <div className="pd-chips">
            <span className="pd-chip pd-chip-date">{project.detail.date}</span>
            {project.detail.chips.map((chip) => (
              <span className="pd-chip" key={chip}>
                {chip}
              </span>
            ))}
            <a
              className="pd-chip pd-chip-repo"
              href={project.repo}
              target="_blank"
              rel="noreferrer"
            >
              GitHub 仓库
              <ArrowUpRight size={14} strokeWidth={1.8} />
            </a>
          </div>
          <p className="pd-lead">{project.detail.lead}</p>
        </header>

        <div className="pd-layout">
          <article className="pd-body" ref={bodyRef}>
            {project.detail.sections.map((section, i) => (
              <section className="pd-section" id={section.id} key={section.id}>
                <h2 className="pd-h2">
                  <span className="pd-h2-no">{String(i + 1).padStart(2, '0')}</span>
                  {section.title}
                </h2>
                {section.blocks.map((block, j) => (
                  <DetailBlock block={block} key={j} />
                ))}
              </section>
            ))}

            <nav className="pd-pager" aria-label="项目切换">
              <button type="button" onClick={() => goProject(prev.id)}>
                <span>‹ {prev.no}</span>
                {prev.title}
              </button>
              <button type="button" onClick={() => goProject(next.id)}>
                <span>{next.no} ›</span>
                {next.title}
              </button>
            </nav>
          </article>

          <aside className="pd-toc" aria-label="页面目录">
            <p className="pd-toc-title">目录</p>
            <ul>
              {toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#pd-${item.id}`}
                    className={activeId === item.id ? 'is-active' : ''}
                    onClick={(event) => {
                      event.preventDefault();
                      const target = document.getElementById(item.id);
                      if (target) {
                        const top = target.getBoundingClientRect().top + window.scrollY - 96;
                        window.scrollTo({ top, behavior: 'smooth' });
                      }
                    }}
                  >
                    <ChevronRight size={13} strokeWidth={2} aria-hidden="true" />
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
            <div className="pd-toc-metrics">
              {project.metrics.map((metric) => (
                <div key={metric.label}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

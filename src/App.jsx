import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Code2,
  GraduationCap,
  Mail,
  Menu,
  MessageCircle,
  Phone,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import {
  contacts,
  advantages,
  casualProjects,
  education,
  heroMeta,
  intro,
  marquee,
  notes,
  profile,
  strengths,
} from './data/portfolio.js';
import { featuredProjects } from './data/projectDetails.js';
import ProjectDetailPage from './components/ProjectDetailPage.jsx';
import NoteMarkdown from './components/NoteMarkdown.jsx';
import CommentsSection from './components/CommentSection.jsx';
import { noteSources } from './content/index.js';
import { certs } from './content/certs.js';

function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress.toFixed(4)})`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span ref={barRef} />
    </div>
  );
}

function useParallax(speed = 0.1) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = node.getBoundingClientRect();
      const delta = rect.top + rect.height / 2 - window.innerHeight / 2;
      node.style.transform = `translate3d(0, ${(-delta * speed).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [speed]);

  return ref;
}

function MarqueeBand() {
  return (
    <div className="marquee-band" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((group) => (
          <div className="marquee-group" key={group}>
            {marquee.map((text) => (
              <span key={text}>
                <i>{text}</i>
                <em />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Nav() {
  const [active, setActive] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const links = [
    { id: 'about', label: '关于我', no: '01' },
    { id: 'projects', label: '项目展示', no: '02' },
    { id: 'casual', label: '闲来无事', no: '03' },
    { id: 'strengths', label: '核心技能', no: '04' },
    { id: 'certs', label: '证书荣誉', no: '05' },
    { id: 'contact', label: '欢迎联系', no: '06' },
    { id: 'comments', label: '评论互动', no: '07' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = links
      .map((link) => document.getElementById(link.id))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className={`site-nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="shell nav-shell">
        <a className="brand" href="#home" aria-label="返回首页">
          <img
            className="brand-avatar"
            src={`${import.meta.env.BASE_URL}images/wechat-avatar.jpg`}
            alt="微信头像"
            width="800"
            height="800"
          />
          <span className="brand-copy">
            <strong>{profile.name}</strong>
            <small>{profile.roleEn} / Portfolio</small>
          </span>
        </a>
        <nav className={`nav-panel ${open ? 'is-open' : ''}`} aria-label="主导航">
          {links.map((link) => (
            <a
              key={link.id}
              className={`nav-link ${active === link.id ? 'is-active' : ''}`}
              href={`#${link.id}`}
              onClick={() => setOpen(false)}
            >
              <span>{link.no}</span>
              {link.label}
            </a>
          ))}
          <a className="nav-contact" href="#contact" onClick={() => setOpen(false)}>
            联系我
            <ArrowUpRight size={16} strokeWidth={1.6} />
          </a>
        </nav>
        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? '关闭菜单' : '打开菜单'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}

function IntroGate({ onEnter, onGone }) {
  const [phase, setPhase] = useState(() =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'gone'
      : 'idle',
  );

  useEffect(() => {
    if (phase === 'gone') return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'gone') return;
    onEnter();
    onGone();
  }, [phase, onEnter, onGone]);

  const enter = () => {
    if (phase !== 'idle') return;
    onEnter();
    setPhase('leaving');
    window.setTimeout(() => setPhase('gone'), 1500);
  };

  if (phase === 'gone') return null;

  return (
    <div
      className={`intro-gate ${phase === 'leaving' ? 'is-leaving' : ''}`}
      aria-hidden={phase === 'leaving'}
    >
      <video
        className="intro-video"
        src={`${import.meta.env.BASE_URL}videos/hero-loop.mp4`}
        poster={`${import.meta.env.BASE_URL}images/hero-background.jpg`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <div className="intro-veil" aria-hidden="true" />
      <div className="intro-scan" aria-hidden="true" />
      <div className="intro-bar intro-bar-top" aria-hidden="true" />
      <div className="intro-bar intro-bar-bottom" aria-hidden="true" />

      <div className="intro-content">
        <p className="intro-kicker">
          <span />
          {intro.kicker}
          <span />
        </p>
        <h1 className="intro-title">
          <span className="intro-title-line">{intro.titleLines[0]}</span>
          <span className="intro-title-main">{intro.titleLines[1]}</span>
        </h1>
        <p className="intro-tagline">{intro.tagline}</p>
        <button type="button" className="intro-enter" onClick={enter}>
          {intro.enter}
          <ArrowRight size={18} strokeWidth={1.7} />
        </button>
      </div>

      <button type="button" className="intro-skip" onClick={enter}>
        {intro.skip}
      </button>
    </div>
  );
}

function Hero({ entered = false }) {
  const shellRef = useParallax(0.05);

  return (
    <section className={`hero ${entered ? 'is-entered' : ''}`} id="home">
      <div className="hero-image" aria-hidden="true">
        <video
          className="hero-video"
          src={`${import.meta.env.BASE_URL}videos/hero-loop.mp4`}
          poster={`${import.meta.env.BASE_URL}images/hero-background.jpg`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-gridline" aria-hidden="true" />

      <div className="shell hero-shell" ref={shellRef}>
        <div className="hero-copy">
          <p className="hero-kicker">
            <span />
            算法工程师 · 计算机视觉 / PORTFOLIO 2026
            <span />
          </p>
          <h1>
            <span className="hero-name">欢迎来到</span>
            <span className="hero-name hero-name-second">我的世界</span>
          </h1>
          <p className="hero-intro">{profile.introLead}</p>
          <div className="hero-actions">
            <a className="button button-light" href="#contact">
              联系我
              <ArrowUpRight size={18} strokeWidth={1.7} />
            </a>
            <a className="button button-ghost" href="#projects">
              查看项目
              <ArrowDown size={18} strokeWidth={1.7} />
            </a>
          </div>
        </div>

        <aside className="hero-meta">
          {heroMeta.map((item) => (
            <div key={item.label}>
              <span>{item.label}</span>
              <strong>
                {item.lines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </strong>
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}

function SectionHeading({ index, title, en, intro }) {
  const numRef = useParallax(0.12);

  return (
    <Reveal className="section-heading">
      <div className="heading-index" ref={numRef}>
        {index}
      </div>
      <div className="heading-title">
        <p className="eyebrow">
          {en} / {index}
        </p>
        <h2>
          <span className="mask">
            <span className="mask-line">{title}</span>
          </span>
        </h2>
      </div>
      {intro && <p className="heading-intro">{intro}</p>}
    </Reveal>
  );
}

function About() {
  return (
    <section className="section about" id="about">
      <div className="shell">
        <SectionHeading
          index="01"
          title="我是谁？"
          en="About"
          intro="从数学与统计进入图像算法场景，习惯用可复现的方法解决问题，并把结论交付给需要做决定的人。"
        />

        <div className="about-grid">
          <Reveal className="profile-visual">
            <div className="profile-frame">
              <div className="profile-caption">
                <span>PORTRAIT / 2026</span>
                <span>FILE 001</span>
              </div>
              <img
                src={`${import.meta.env.BASE_URL}portrait.jpg`}
                alt={`${profile.name}的照片`}
                width="600"
                height="800"
              />
              <div className="photo-rule photo-rule-one" />
              <div className="photo-rule photo-rule-two" />
            </div>
            <div className="profile-note">
              <GraduationCap size={17} strokeWidth={1.5} />
              <span>华南师范大学 · 图像算法方向硕士</span>
            </div>
          </Reveal>

          <div className="about-copy">
            <Reveal delay={80}>
              <div className="about-kicker">
                <span>{profile.role} / {profile.roleEn}</span>
              </div>
              <p className="about-lead">{profile.introParagraphs[0]}</p>
              <p className="about-body">{profile.introParagraphs[1]}</p>
            </Reveal>

            <Reveal delay={120} className="advantage-block">
              <h3>个人优势</h3>
              <div className="advantage-list">
                {advantages.map((item) => (
                  <div className="advantage-item" key={item.title}>
                    <strong>{item.title}</strong>
                    <p>{item.desc}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={140} className="education-block">
              <h3>教育经历</h3>
              <div className="education-list">
                {education.map((item) => (
                  <article className="education-item" key={item.school}>
                    <div className="education-badge">{item.badge}</div>
                    <div className="education-main">
                      <div>
                        <h4>{item.school}</h4>
                        <span className="education-major">
                          {item.major} · {item.direction}
                        </span>
                      </div>
                      <span className="education-degree">{item.degree}</span>
                    </div>
                    <div className="education-meta">
                      <span>{item.period}</span>
                      <small>{item.note}</small>
                    </div>
                  </article>
                ))}
              </div>
            </Reveal>

            <Reveal delay={180} className="contact-block">
              <h3>联系方式</h3>
              <div className="contact-mini-list">
                <a href="mailto:1164600336@qq.com">
                  <Mail size={16} strokeWidth={1.6} />
                  1164600336@qq.com
                </a>
                <a href="tel:+8617807308510">
                  <Phone size={16} strokeWidth={1.6} />
                  178 0730 8510
                </a>
                <span>
                  <MessageCircle size={16} strokeWidth={1.6} />
                  wanzi039
                </span>
              </div>
            </Reveal>
          </div>
        </div>

      </div>
    </section>
  );
}

// GitHub 品牌 Mark（lucide 新版已移除品牌图标，这里内联）
function GithubMark({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

// 项目卡片：参考 myportfolio-1bd 风格 —— 标题 + 简介在上，典型图左、介绍右的卡片
function ProjectShowcaseCard({ item }) {
  const openDetail = () => {
    window.location.hash = `#/project/${item.id}`;
  };

  const onCardKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openDetail();
    }
  };

  return (
    <article className="gp-item">
      <header className="gp-item-head">
        <div className="gp-item-titles">
          <span className="gp-no">
            {item.no}
            <i>·</i>
            {item.period}
            <i>·</i>
            {item.role}
          </span>
          <h3>{item.title}</h3>
          <p>{item.tagline}</p>
        </div>
        <a
          className="gp-repo"
          href={item.repo}
          target="_blank"
          rel="noreferrer"
          aria-label={`${item.title} 的 GitHub 仓库`}
        >
          <GithubMark size={17} />
          <span className="gp-repo-name">wanzi-qz/{item.id}</span>
          <ArrowUpRight size={15} strokeWidth={1.7} />
        </a>
      </header>

      <div
        className="gp-card"
        role="link"
        tabIndex={0}
        aria-label={`查看 ${item.title} 的项目详情`}
        onClick={openDetail}
        onKeyDown={onCardKeyDown}
      >
        <div className={`gp-media ${item.heroIsSvg ? 'is-diagram' : ''}`}>
          <img
            src={`${import.meta.env.BASE_URL}${item.hero}`}
            alt={item.heroAlt}
            loading="lazy"
          />
          <span className="gp-media-badge">
            <Code2 size={13} strokeWidth={1.8} />
            结果可视化 / RESULT
          </span>
        </div>
        <div className="gp-body">
          <h4>{item.card.heading}</h4>
          {item.card.blocks.map((block) => (
            <p className="gp-block" key={block.label}>
              <strong>{block.label}</strong>
              <span>{block.text}</span>
            </p>
          ))}
          <div className="gp-tags">
            {item.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <span className="gp-cta">
            阅读项目详情 · 关键源码与结果图
            <ArrowRight size={15} strokeWidth={1.8} />
          </span>
        </div>
      </div>
    </article>
  );
}

function Projects() {
  return (
    <section className="section projects" id="projects">
      <div className="shell">
        <SectionHeading
          index="02"
          title="项目展示"
          en="Featured Work"
          intro="GitHub 上的完整工程项目：点击卡片进入详情页，查看技术拆解、关键源码与结果可视化。"
        />
        <div className="gp-list">
          {featuredProjects.map((item) => (
            <ProjectShowcaseCard item={item} key={item.id} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Strengths() {
  return (
    <section className="section strengths" id="strengths">
      <div className="shell">
        <SectionHeading
          index="04"
          title="核心技能"
          en="Core Skills"
          intro="从图像处理、模型训练到特征工程与统计验证的完整算法能力链，均在科研项目中实际跑通。"
        />
      </div>
      <Reveal>
        <div className="skill-marquee">
          <div className="sk-track">
            {[0, 1].map((group) => (
              <div className="sk-group" key={group} aria-hidden={group === 1 || undefined}>
                {strengths.map((item, index) => (
                  <article key={`${group}-${item.no}`} className="sk-card">
                    <div className="sk-head">
                      <span className="sk-no">{item.no}</span>
                      <i>/{String(index + 1).padStart(2, '0')}</i>
                    </div>
                    <h3>{item.title}</h3>
                    <div className="sk-tags">
                      {item.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                    <p>{item.desc}</p>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function NoteModal({ note, onClose }) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  const parts = note.parts && note.parts.length > 1 ? note.parts : null;
  const [activePart, setActivePart] = useState(parts ? parts[0].id : note.id);
  const bodyRef = useRef(null);
  const source = noteSources[activePart] || noteSources[note.id] || '';

  const selectPart = (id) => {
    setActivePart(id);
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  };

  return createPortal(
    <div
      className="note-modal"
      role="dialog"
      aria-modal="true"
      aria-label={`${note.title} 笔记全文`}
    >
      <button
        type="button"
        className="note-modal-backdrop"
        aria-label="关闭笔记"
        onClick={onClose}
      />
      <div className="note-modal-panel">
        <header className="note-modal-head">
          <div className="note-modal-title">
            <span>
              {note.no} / {note.source}
            </span>
            <h2>{note.title}</h2>
          </div>
          <div className="note-modal-tools">
            {note.links.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
                <ArrowUpRight size={14} strokeWidth={1.7} />
              </a>
            ))}
            <button
              type="button"
              className="note-modal-close"
              aria-label="关闭"
              onClick={onClose}
            >
              <X size={20} strokeWidth={1.6} />
            </button>
          </div>
        </header>
        {parts && (
          <div className="note-modal-tabs" role="tablist" aria-label="笔记分篇">
            {parts.map((part) => (
              <button
                key={part.id}
                type="button"
                role="tab"
                id={`note-tab-${part.id}`}
                aria-selected={activePart === part.id}
                className={`note-modal-tab ${activePart === part.id ? 'is-active' : ''}`}
                onClick={() => selectPart(part.id)}
              >
                {part.label}
              </button>
            ))}
          </div>
        )}
        <div
          className="note-modal-body"
          ref={bodyRef}
          role={parts ? 'tabpanel' : undefined}
          aria-labelledby={parts ? `note-tab-${activePart}` : undefined}
        >
          <NoteMarkdown source={source} />
        </div>
      </div>
    </div>,
    document.body,
  );
}

function Casual() {
  const [active, setActive] = useState(null);

  const openNote = (noteId) => {
    const note = notes.find((item) => item.id === noteId);
    if (note) setActive(note);
  };

  return (
    <section className="section casual" id="casual">
      <div className="shell">
        <SectionHeading
          index="03"
          title="闲来无事"
          en="Side Projects & Notes"
          intro="兴趣驱动的一些小项目与学习过程记录。"
        />

        <Reveal>
          <div className="casual-grid">
            {casualProjects.map((item) => {
              const isNote = Boolean(item.noteId);
              return (
                <article
                  key={item.id}
                  className={`casual-card ${isNote ? 'is-note' : ''}`}
                  role={isNote ? 'button' : undefined}
                  tabIndex={isNote ? 0 : undefined}
                  aria-label={isNote ? `打开《${item.title}》笔记全文` : undefined}
                  onClick={isNote ? () => openNote(item.noteId) : undefined}
                  onKeyDown={
                    isNote
                      ? (event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            openNote(item.noteId);
                          }
                        }
                      : undefined
                  }
                >
                  <div className="casual-card-media">
                    <img
                      src={`${import.meta.env.BASE_URL}${item.image}`}
                      alt={item.imageAlt}
                      loading="lazy"
                    />
                  </div>
                  <div className="casual-card-body">
                    {item.kicker && <span className="casual-card-kicker">{item.kicker}</span>}
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                    <div className="casual-card-tags">
                      {item.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                    <div className="casual-card-links">
                      {isNote ? (
                        <span className="casual-card-note">
                          阅读完整笔记
                          <ArrowUpRight size={13} strokeWidth={1.7} />
                        </span>
                      ) : (
                        <>
                          {item.repo && (
                            <a href={item.repo} target="_blank" rel="noreferrer">
                              <GithubMark />
                              GitHub 仓库
                              <ArrowUpRight size={13} strokeWidth={1.7} />
                            </a>
                          )}
                          {item.demo && (
                            <a href={item.demo} target="_blank" rel="noreferrer">
                              在线体验
                              <ArrowUpRight size={13} strokeWidth={1.7} />
                            </a>
                          )}
                          {item.paper && (
                            <a href={item.paper} target="_blank" rel="noreferrer">
                              论文原文
                              <ArrowUpRight size={13} strokeWidth={1.7} />
                            </a>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </Reveal>
      </div>
      {active && <NoteModal note={active} onClose={() => setActive(null)} />}
    </section>
  );
}
function CertLightbox({ cert, onClose, onStep }) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') onStep(1);
      if (event.key === 'ArrowLeft') onStep(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, onStep]);

  return createPortal(
    <div className="cert-lightbox" role="dialog" aria-modal="true" aria-label={cert.title}>
      <button type="button" className="cert-lightbox-backdrop" aria-label="关闭大图" onClick={onClose} />
      <figure className="cert-lightbox-figure">
        <img src={`${import.meta.env.BASE_URL}${cert.img}`} alt={cert.title} />
        <figcaption>
          <strong>{cert.title}</strong>
          <span>
            {cert.org} · {cert.date}
          </span>
        </figcaption>
      </figure>
      <button type="button" className="cert-lightbox-nav prev" aria-label="上一张" onClick={() => onStep(-1)}>
        ‹
      </button>
      <button type="button" className="cert-lightbox-nav next" aria-label="下一张" onClick={() => onStep(1)}>
        ›
      </button>
      <button type="button" className="cert-lightbox-close" aria-label="关闭" onClick={onClose}>
        <X size={20} strokeWidth={1.6} />
      </button>
    </div>,
    document.body,
  );
}

function Certs() {
  const railRef = useRef(null);
  const [zoom, setZoom] = useState(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: 0 });

  const syncArrows = () => {
    const el = railRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    syncArrows();
  }, []);

  const stepBy = (dir) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.72, behavior: 'smooth' });
  };

  const onPointerDown = (event) => {
    if (event.pointerType !== 'mouse') return;
    const el = railRef.current;
    drag.current = { active: true, startX: event.clientX, startScroll: el.scrollLeft, moved: 0 };
    el.classList.add('is-dragging');
  };

  const onPointerMove = (event) => {
    if (!drag.current.active) return;
    const el = railRef.current;
    const dx = event.clientX - drag.current.startX;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dx));
    el.scrollLeft = drag.current.startScroll - dx;
  };

  const endDrag = () => {
    drag.current.active = false;
    railRef.current?.classList.remove('is-dragging');
  };

  const zoomIdx = zoom ? certs.findIndex((item) => item.id === zoom.id) : -1;
  const stepZoom = (dir) => setZoom(certs[(zoomIdx + dir + certs.length) % certs.length]);

  return (
    <section className="section certs" id="certs">
      <div className="shell">
        <SectionHeading
          index="05"
          title="证书荣誉"
          en="Certificates"
          intro="也曾得过一些奖"
        />
        <Reveal>
          <div className="certs-rail-head">
            <span className="certs-rail-hint">
              左右拖动 / 滚动查看 · 共 {certs.length} 张 · 点击放大
            </span>
            <span className="certs-rail-nav">
              <button type="button" onClick={() => stepBy(-1)} disabled={!canPrev} aria-label="向左查看">
                <ChevronLeft size={17} strokeWidth={1.8} />
              </button>
              <button type="button" onClick={() => stepBy(1)} disabled={!canNext} aria-label="向右查看">
                <ChevronRight size={17} strokeWidth={1.8} />
              </button>
            </span>
          </div>
          <div
            className="certs-rail"
            ref={railRef}
            onScroll={syncArrows}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
          >
            {certs.map((item) => (
              <button
                type="button"
                className="cert-slide"
                key={item.id}
                onClick={() => {
                  if (drag.current.moved > 6) return;
                  setZoom(item);
                }}
              >
                <span className="cert-slide-frame">
                  <img
                    src={`${import.meta.env.BASE_URL}${item.img}`}
                    alt={item.title}
                    loading="lazy"
                    draggable="false"
                  />
                  <span className="cert-shine" aria-hidden="true" />
                </span>
                <span className="cert-slide-cap">
                  <strong>{item.title}</strong>
                  <span>
                    {item.org} · {item.date}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </Reveal>
      </div>
      {zoom && <CertLightbox cert={zoom} onClose={() => setZoom(null)} onStep={stepZoom} />}
    </section>
  );
}

function ContactFooter() {
  const [copied, setCopied] = useState('');
  const contactIcons = {
    email: Mail,
    phone: Phone,
    wechat: MessageCircle,
  };

  const copyWechat = async () => {
    try {
      await navigator.clipboard.writeText('wanzi039');
      setCopied('wanzi039');
      window.setTimeout(() => setCopied(''), 1800);
    } catch {
      setCopied('wanzi039');
    }
  };

  return (
    <footer className="contact" id="contact">
      <div className="contact-ghost" aria-hidden="true">
        <span>CONNECT</span>
      </div>
      <div className="shell contact-shell">
        <SectionHeading
          index="06"
          title="欢迎联系"
          en="Contact"
          intro="一直在不断的学习与进步中，如果有需要，请联系我。"
        />

        <div className="contact-channel-list">
          {contacts.map((contact) => {
            const Icon = contactIcons[contact.id];
            const content = (
              <>
                <div className="channel-top">
                  <span className="channel-icon">
                    <Icon size={22} strokeWidth={1.5} />
                  </span>
                  <span className="channel-arrow">
                    {contact.id === 'wechat' && copied ? (
                      <Check size={20} />
                    ) : (
                      <ArrowUpRight size={20} />
                    )}
                  </span>
                </div>
                <div className="channel-copy">
                  <small>{contact.label}</small>
                  <strong>{contact.value}</strong>
                  <span>
                    {contact.id === 'wechat'
                      ? copied === 'wanzi039'
                        ? '微信号已复制'
                        : '点击复制微信号'
                      : contact.id === 'email'
                        ? '发送邮件'
                        : '拨打电话'}
                  </span>
                </div>
              </>
            );

            return contact.href ? (
              <a className="contact-channel" href={contact.href} key={contact.id}>
                {content}
              </a>
            ) : (
              <button
                className="contact-channel contact-channel-button"
                type="button"
                key={contact.id}
                onClick={copyWechat}
              >
                {content}
              </button>
            );
          })}
        </div>


      </div>
    </footer>
  );
}

function SiteFooterBar() {
  return (
    <footer className="site-footer-wrap">
      <div className="shell">
        <div className="site-footer">
          <div>
            <strong>{profile.name}</strong>
            <span>{profile.roleEn} Portfolio</span>
          </div>
          <p>
            {profile.name} · {profile.role} / {profile.nameEn} · Built with React &amp; Vite
          </p>
          <a href="#home">
            回到顶部
            <ArrowUpRight size={16} strokeWidth={1.6} />
          </a>
        </div>
      </div>
    </footer>
  );
}

// ---- 简易 hash 路由：#/project/<id> 打开项目详情页，其余 hash 仍为站内锚点 ----
function parseProjectRoute() {
  const match = window.location.hash.match(/^#\/project\/([\w-]+)/);
  return match ? match[1] : null;
}

export default function App() {
  const [deepLink] = useState(
    () => typeof window !== 'undefined' && window.location.hash.length > 1,
  );
  const [entered, setEntered] = useState(deepLink);
  const [gateGone, setGateGone] = useState(deepLink);
  const [projectRoute, setProjectRoute] = useState(parseProjectRoute);
  const bgmRef = useRef(null);
  const [bgmOn, setBgmOn] = useState(false);
  const bgmStarted = useRef(false);
  const prevEntered = useRef(entered);

  useEffect(() => {
    const onHashChange = () => {
      const next = parseProjectRoute();
      setProjectRoute(next);
      if (!next) {
        // 从详情页返回主站：滚回对应锚点（如 #projects）
        const id = window.location.hash.replace(/^#/, '');
        requestAnimationFrame(() => {
          const target = id ? document.getElementById(id) : null;
          if (target) target.scrollIntoView({ block: 'start' });
          else window.scrollTo(0, 0);
        });
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const backToProjects = () => {
    window.location.hash = '#projects';
  };

  useEffect(() => {
    const was = prevEntered.current;
    prevEntered.current = entered;
    if (!entered || was || bgmStarted.current) return;
    bgmStarted.current = true;
    const audio = bgmRef.current;
    if (!audio) return;
    audio.volume = 0;
    audio
      .play()
      .then(() => {
        setBgmOn(true);
        const fade = window.setInterval(() => {
          if (audio.volume < 0.45) audio.volume = Math.min(0.5, audio.volume + 0.05);
          else window.clearInterval(fade);
        }, 120);
      })
      .catch(() => {
        bgmStarted.current = false;
      });
  }, [entered]);

  const toggleBgm = () => {
    const audio = bgmRef.current;
    if (!audio) return;
    if (audio.paused) {
      bgmStarted.current = true;
      audio.volume = 0.5;
      audio
        .play()
        .then(() => setBgmOn(true))
        .catch(() => setBgmOn(false));
    } else {
      audio.pause();
      setBgmOn(false);
    }
  };

  useEffect(() => {
    if (!deepLink) return;
    const target = document.getElementById(window.location.hash.slice(1));
    if (!target) return;
    const previous = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    target.scrollIntoView({ block: 'start' });
    document.documentElement.style.scrollBehavior = previous;
  }, [deepLink]);

  // 项目详情页：独立文章式布局，不渲染主站各区块
  if (projectRoute) {
    return (
      <>
        <ProjectDetailPage projectId={projectRoute} onBack={backToProjects} />
        <button
          type="button"
          className={`bgm-toggle ${bgmOn ? 'is-on' : ''}`}
          onClick={toggleBgm}
          aria-label={bgmOn ? '暂停背景音乐' : '播放背景音乐'}
          title={bgmOn ? '暂停背景音乐' : '播放背景音乐'}
        >
          {bgmOn ? <Volume2 size={18} strokeWidth={1.7} /> : <VolumeX size={18} strokeWidth={1.7} />}
        </button>
      </>
    );
  }

  return (
    <>
      {!gateGone && (
        <IntroGate
          onEnter={() => setEntered(true)}
          onGone={() => setGateGone(true)}
        />
      )}
      <ScrollProgress />
      <Nav />
      <main>
        <Hero entered={entered} />
        <MarqueeBand />
        <About />
        <Projects />
        <Casual />
        <Strengths />
        <Certs />
      </main>
      <ContactFooter />
      <CommentsSection />
      <SiteFooterBar />
      <audio
        ref={bgmRef}
        src={`${import.meta.env.BASE_URL}audio/intro-bgm.wav?v=20261019c`}
        loop
        preload="auto"
      />
      <button
        type="button"
        className={`bgm-toggle ${bgmOn ? 'is-on' : ''}`}
        onClick={toggleBgm}
        aria-label={bgmOn ? '暂停背景音乐' : '播放背景音乐'}
        title={bgmOn ? '暂停背景音乐' : '播放背景音乐'}
      >
        {bgmOn ? <Volume2 size={18} strokeWidth={1.7} /> : <VolumeX size={18} strokeWidth={1.7} />}
      </button>
    </>
  );
}

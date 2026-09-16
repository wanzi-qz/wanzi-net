import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  GraduationCap,
  Mail,
  Menu,
  MessageCircle,
  Phone,
  X,
} from 'lucide-react';
import {
  contacts,
  advantages,
  education,
  heroMeta,
  intro,
  marquee,
  notes,
  profile,
  projects,
  strengths,
} from './data/portfolio.js';
import { ProjectVisual } from './components/ProjectVisuals.jsx';
import NoteMarkdown from './components/NoteMarkdown.jsx';
import CommentsSection from './components/CommentSection.jsx';
import { noteSources } from './content/index.js';

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
    { id: 'strengths', label: '核心技能', no: '03' },
    { id: 'notes', label: '学习笔记', no: '04' },
    { id: 'contact', label: '欢迎联系', no: '05' },
    { id: 'comments', label: '评论互动', no: '06' },
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
            数据分析师 / PORTFOLIO 2026
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
          title="关于我"
          en="About"
          intro="从基础学科进入真实数据场景，习惯用可复现的方法处理问题，并把结论交付给需要做决定的人。"
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

function ProjectCard({ item, primary = false }) {
  return (
    <Reveal className={primary ? 'project-card-wrap' : 'project-card-wrap compact'}>
      <article className={`project-card ${primary ? 'project-card-primary' : 'project-card-compact'}`}>
        <ProjectVisual type={item.visual} image={item.image} />
        <div className="project-body">
          <div className="project-meta">
            <span>{item.no}</span>
            <span>{item.period}</span>
          </div>
          <div className="project-title-row">
            <h3>{item.title}</h3>
            <ArrowUpRight size={28} strokeWidth={1.3} />
          </div>
          <p className="project-intro">{item.intro}</p>
          <ul className="project-points">
            {item.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <div className="project-footer">
            <div className="project-tags">
              {item.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <div className="project-role">
              <small>ROLE</small>
              <strong>{item.role}</strong>
            </div>
          </div>
        </div>
      </article>
    </Reveal>
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
          intro="以科研数据项目为主线，兼顾建模竞赛与方法沉淀，展示从问题拆解到结论交付的完整路径。"
        />
        <ProjectCard item={projects[0]} primary />
        <div className="project-grid-secondary">
          <ProjectCard item={projects[1]} />
          <ProjectCard item={projects[2]} />
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
          index="03"
          title="核心技能"
          en="Core Skills"
          intro="从取数、清洗建模到可视化交付的完整技能链，熟练度经过科研与实战项目验证。"
        />
        <Reveal>
          <div className="skill-field">
            <i className="field-coord field-coord-1" aria-hidden="true">
              +31.2304° / 121.4737°
            </i>
            <i className="field-coord field-coord-2" aria-hidden="true">
              -33.8688° / 151.2093°
            </i>
            <i className="field-coord field-coord-3" aria-hidden="true">
              +51.5072° / -0.1276°
            </i>
            <span className="field-orb" aria-hidden="true" />
            {strengths.map((item, index) => (
              <article key={item.no} className={`skill-node skill-node-${index + 1}`}>
                <div className="skill-card">
                  <div className="skill-head">
                    <span className="skill-no">{item.no}</span>
                    <i>/{String(index + 1).padStart(2, '0')}</i>
                  </div>
                  <h3>{item.title}</h3>
                  <div className="strength-tags">
                    {item.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <p>{item.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
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

  const source = noteSources[note.id] || '';

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
        <div className="note-modal-body">
          <NoteMarkdown source={source} />
        </div>
      </div>
    </div>,
    document.body,
  );
}

function Notes() {
  const [active, setActive] = useState(null);

  return (
    <section className="section notes" id="notes">
      <div className="shell">
        <SectionHeading
          index="04"
          title="学习笔记"
          en="Study Notes"
          intro="学习过程记录，每一行代码均为手敲。"
        />
        <Reveal>
          <div className="notes-tiles">
            {notes.map((item, index) => (
              <div key={item.no} className={`note-tile-wrap note-tile-wrap-${index + 1}`}>
                <article
                  className="note-tile"
                  role="button"
                  tabIndex={0}
                  aria-label={`打开《${item.title}》笔记全文`}
                  onClick={() => setActive(item)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setActive(item);
                    }
                  }}
                >
                  <img
                    className="note-cover"
                    src={`${import.meta.env.BASE_URL}notes/covers/${item.id}.svg`}
                    alt=""
                  />
                  <span className="note-pill">
                    {item.no} · {item.title}
                  </span>
                  <div className="note-tile-foot">
                    <span>{item.source}</span>
                    <span className="note-tile-cta">
                      查看完整笔记
                      <ArrowUpRight size={14} strokeWidth={1.7} />
                    </span>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
      {active && <NoteModal note={active} onClose={() => setActive(null)} />}
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
          index="05"
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

export default function App() {
  const [deepLink] = useState(
    () => typeof window !== 'undefined' && window.location.hash.length > 1,
  );
  const [entered, setEntered] = useState(deepLink);
  const [gateGone, setGateGone] = useState(deepLink);

  useEffect(() => {
    if (!deepLink) return;
    const target = document.getElementById(window.location.hash.slice(1));
    if (!target) return;
    const previous = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    target.scrollIntoView({ block: 'start' });
    document.documentElement.style.scrollBehavior = previous;
  }, [deepLink]);

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
        <Strengths />
        <Notes />
      </main>
      <ContactFooter />
      <CommentsSection />
      <SiteFooterBar />
    </>
  );
}

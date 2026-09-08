import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
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
  capabilities,
  education,
  profile,
  projects,
  strengths,
} from './data/portfolio.js';
import { ProjectVisual } from './components/ProjectVisuals.jsx';

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

function Nav() {
  const [active, setActive] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const links = [
    { id: 'about', label: '关于我', no: '01' },
    { id: 'projects', label: '项目展示', no: '02' },
    { id: 'strengths', label: '个人优势', no: '03' },
    { id: 'contact', label: '联系', no: '04' },
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

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-image" aria-hidden="true">
        <img
          src={`${import.meta.env.BASE_URL}images/hero-background.jpg`}
          alt=""
          width="2560"
          height="1372"
        />
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-gridline" aria-hidden="true" />

      <div className="shell hero-shell">
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

        <aside className="hero-meta" aria-hidden="true">
          <div>
            <span>STATUS</span>
            <strong>OPEN TO DATA ROLES</strong>
          </div>
          <div>
            <span>EDUCATION</span>
            <strong>M.S. / IMAGE ALGORITHM</strong>
          </div>
          <div>
            <span>SCROLL</span>
            <strong>01 / 04</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}

function SectionHeading({ index, title, en, intro }) {
  return (
    <Reveal className="section-heading">
      <div className="heading-index">{index}</div>
      <div className="heading-title">
        <p className="eyebrow">
          {en} / {index}
        </p>
        <h2>{title}</h2>
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

        <Reveal delay={120} className="metric-strip capability-strip">
          {capabilities.map((capability, index) => (
            <div className="metric-cell" key={capability.tool}>
              <span className="metric-index">0{index + 1}</span>
              <strong>{capability.tool}</strong>
              <div>
                <h4>{capability.label}</h4>
                <p>{capability.detail}</p>
              </div>
            </div>
          ))}
        </Reveal>
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
          title="个人优势"
          en="Capabilities"
          intro="覆盖数据分析常用工具、统计方法、科研数据工程与 AI 辅助协作，能够针对不同问题快速选择合适的方法。"
        />
        <div className="strength-grid">
          {strengths.map((item, index) => (
            <Reveal
              key={item.no}
              className="strength-card-wrap"
              delay={(index % 4) * 60}
            >
              <article className="strength-card">
                <div className="strength-top">
                  <span>{item.no}</span>
                  <i>/{String(index + 1).padStart(2, '0')}</i>
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <div className="strength-tags">
                  {item.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
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
          index="04"
          title="保持联系"
          en="Contact"
          intro="如果你有一个需要数据参与的问题，欢迎把背景和期望讲给我。"
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
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Projects />
        <Strengths />
      </main>
      <ContactFooter />
    </>
  );
}

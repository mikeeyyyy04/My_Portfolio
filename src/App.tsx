import React, { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Button,
  Col,
  ConfigProvider,
  Divider,
  Form,
  Input,
  Layout,
  Row,
  Switch,
  Tag,
  Timeline,
  Typography,
  theme as antTheme,
} from 'antd';
import {
  ArrowUpRight as ArrowUpRightIcon,
  Award as AwardIcon,
  BriefcaseBusiness as BriefcaseIcon,
  CalendarDays as CalendarDaysIcon,
  CheckCircle2 as CheckCircle2Icon,
  Code2 as Code2Icon,
  Facebook as FacebookIcon,
  FolderKanban as FolderKanbanIcon,
  Github as GithubIcon,
  Globe2 as GlobeIcon,
  Instagram as InstagramIcon,
  Linkedin as LinkedinIcon,
  Mail as MailIcon,
  MapPin as MapPinIcon,
  Menu as MenuIcon,
  Moon as MoonIcon,
  Phone as PhoneIcon,
  Send as SendIcon,
  Sparkles as SparklesIcon,
  Sun as SunIcon,
  Terminal as TerminalIcon,
  User as UserIcon,
  X as XIcon,
  XCircle as XCircleIcon,
  Zap as ZapIcon,
} from 'lucide-react';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import profileImage from '../assets/id.png';
import formalImage from '../assets/formal.png';
import Aurora from './Aurora';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;
const { defaultAlgorithm, darkAlgorithm } = antTheme;

type FeedbackType = {
  type: 'success' | 'error';
  message: string;
};

type ContactFormValues = {
  name: string;
  email: string;
  subject?: string;
  message: string;
};

type SkillGroup = {
  title: string;
  icon: ReactNode;
  summary: string;
  skills: string[];
  level: number;
  tone: string;
};

type Project = {
  title: string;
  category: string;
  desc: string;
  tags: string[];
  metrics: string[];
  icon: ReactNode;
  tone: string;
};

const CONTACT_EMAIL = 'leusterestrada@gmail.com';

const navItems = [
  { key: 'home', label: 'Home' },
  { key: 'about', label: 'About' },
  { key: 'skills', label: 'Skills' },
  { key: 'projects', label: 'Projects' },
  { key: 'experience', label: 'Experience' },
  { key: 'contact', label: 'Contact' },
];

const heroStats = [
  { value: '3+', label: 'Featured builds' },
  { value: '2022', label: 'CpE journey' },
  { value: '5+', label: 'Leadership roles' },
];

const heroHighlights = [
  { label: 'Focus', value: 'Web systems and computer vision' },
  { label: 'Based in', value: 'Bohol, Philippines' },
  { label: 'Available for', value: 'Collaboration and student projects' },
];

const heroStack = ['React', 'TypeScript', 'Python', 'OpenCV', 'C', 'Assembly'];

const socialLinks = [
  { label: 'GitHub', icon: <GithubIcon />, href: 'https://github.com/mikeeyyyy04' },
  { label: 'LinkedIn', icon: <LinkedinIcon />, href: 'https://www.linkedin.com/in/mike-leuster-estrada' },
  { label: 'Facebook', icon: <FacebookIcon />, href: 'https://www.facebook.com/mike.leuster.estrada' },
  { label: 'Instagram', icon: <InstagramIcon />, href: 'https://www.instagram.com/_mikeeyyyyyy/' },
];

const focusAreas = [
  {
    icon: <TerminalIcon />,
    title: 'Practical engineering',
    desc: 'I like building tools that feel useful first, then refining the experience until it feels simple.',
  },
  {
    icon: <SparklesIcon />,
    title: 'Clear presentation',
    desc: 'I care about interfaces, documentation, and communication that make technical work easier to trust.',
  },
  {
    icon: <BriefcaseIcon />,
    title: 'Team leadership',
    desc: 'Student leadership roles trained me to coordinate people, handle pressure, and follow through.',
  },
];

const skillGroups: SkillGroup[] = [
  {
    title: 'Software & Systems',
    icon: <Code2Icon />,
    summary: 'Foundations for building, debugging, and shipping technical projects.',
    skills: ['C', 'Assembly', 'Python', 'OpenCV', 'React', 'TypeScript'],
    level: 82,
    tone: 'teal',
  },
  {
    title: 'Creative Production',
    icon: <FolderKanbanIcon />,
    summary: 'Useful for making projects easier to understand and present.',
    skills: ['Video Editing', 'Adobe Tools', 'Microsoft Office', 'Documentation'],
    level: 76,
    tone: 'amber',
  },
  {
    title: 'Leadership & People',
    icon: <UserIcon />,
    summary: 'The soft skills behind collaboration, presentations, and organized execution.',
    skills: ['Public Speaking', 'Leadership', 'People Management', 'Communication'],
    level: 88,
    tone: 'blue',
  },
];

const projects: Project[] = [
  {
    title: 'Sports Equipment Classification',
    category: 'Computer Vision',
    desc: 'A real-time classifier using OpenCV and a CNN trained on Kaggle data to identify sports equipment from visual input.',
    tags: ['OpenCV', 'CNN', 'Python'],
    metrics: ['Vision model', 'Live detection', 'Dataset-driven'],
    icon: <ZapIcon />,
    tone: 'teal',
  },
  {
    title: 'Appointify',
    category: 'Full-Stack System',
    desc: 'A clinic appointment management system with authentication, data persistence, and a focused scheduling workflow.',
    tags: ['Bun', 'Hono', 'SvelteKit', 'MongoDB'],
    metrics: ['JWT auth', 'Admin flows', 'Scheduling'],
    icon: <CalendarDaysIcon />,
    tone: 'amber',
  },
  {
    title: 'Personal Portfolio',
    category: 'Web Presence',
    desc: 'A portfolio experience built around responsive layouts, smooth motion, and clean presentation of technical work.',
    tags: ['Flutter', 'Dart', 'GitHub Pages'],
    metrics: ['Responsive UI', 'Project dialogs', 'Deployment'],
    icon: <GlobeIcon />,
    tone: 'blue',
  },
];

const experienceItems = [
  {
    title: 'Institute of Computer Engineering',
    role: 'Year Level Representative',
    date: '2023 - Present',
    desc: 'Supports student coordination and helps organize activities that promote engineering excellence and innovation.',
  },
  {
    title: 'Google Developers Club',
    role: 'Member',
    date: 'Active member',
    desc: 'Participates in community sessions focused on practical developer technologies and collaborative problem solving.',
  },
  {
    title: 'Supreme Student Government',
    role: 'President',
    date: '2019 - 2022',
    desc: 'Represented the student body, led initiatives, and supported policies to improve student life.',
  },
];

const achievementItems = [
  'Graduated Valedictorian at Sikatuna Central Elementary School',
  'Graduated Salutatorian at Sikatuna National High School',
  'Radio station guesting at DYRD in 2022',
];

const educationItems = [
  'Sikatuna Central Elementary School, 2009 - 2015',
  'Sikatuna National High School, 2015 - 2020',
  'Sikatuna National High School GAS, 2020 - 2022',
  'BS Computer Engineering at BISU, 2022 - present',
];

const sectionVariants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: 'easeOut' } },
} as const;

const mobileMenuVariants = {
  hidden: { opacity: 0, y: -12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.18, ease: 'easeOut', staggerChildren: 0.05 } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.16, ease: 'easeIn' } },
} as const;

const mobileItemVariants = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.18 } },
} as const;

const App: React.FC = () => {
  const [contactForm] = Form.useForm<ContactFormValues>();
  const [activeSection, setActiveSection] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('themeMode');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formFeedback, setFormFeedback] = useState<FeedbackType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const previousScrollY = useRef(0);
  const { scrollYProgress } = useScroll();
  const progressScale = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const themeMode = isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', themeMode);
    localStorage.setItem('themeMode', themeMode);
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 100) {
        setIsHeaderVisible(true);
      } else if (currentY > previousScrollY.current + 4) {
        setIsHeaderVisible(false);
      } else if (currentY < previousScrollY.current - 4) {
        setIsHeaderVisible(true);
      }
      previousScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = navItems
      .map(item => document.getElementById(item.key))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      entries => {
        const visibleEntry = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target?.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        rootMargin: '-22% 0px -50% 0px',
        threshold: [0.18, 0.38, 0.62],
      },
    );

    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
      setIsMobileMenuOpen(false);
    }
  };

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);
    setFormFeedback(null);

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          subject: values.subject || 'Portfolio Contact Form',
          message: values.message,
          _captcha: 'false',
        }),
      });

      if (!response.ok) {
        throw new Error('Email request failed');
      }

      setFormFeedback({
        type: 'success',
        message: 'Message sent. Check your inbox for new contact requests.',
      });
      contactForm.resetFields();
    } catch {
      setFormFeedback({
        type: 'error',
        message: 'Unable to send right now. Please try again in a moment.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitFailed = () => {
    setFormFeedback({
      type: 'error',
      message: 'Please complete the required fields before sending.',
    });
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
        token: {
          colorPrimary: '#0f766e',
          borderRadius: 8,
          colorBgLayout: isDarkMode ? '#071114' : '#f8faf9',
          colorBgContainer: isDarkMode ? '#101b20' : '#ffffff',
          colorTextBase: isDarkMode ? '#e8f1ee' : '#15221f',
          fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        },
      }}
    >
      <Layout className="app-shell min-h-screen">
        <motion.div className="scroll-progress" style={{ scaleX: progressScale }} />

        <motion.div
          initial={false}
          animate={{ y: isHeaderVisible ? 0 : -78, opacity: isHeaderVisible ? 1 : 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="fixed left-0 right-0 top-0 z-50"
        >
          <Header className="site-header">
            <button type="button" className="brand-mark" onClick={() => scrollToSection('home')} aria-label="Go to home">
              <span className="brand-monogram">ME</span>
              <span className="brand-copy">
                <strong>Mike Estrada</strong>
                <small>Computer Engineering</small>
              </span>
            </button>

            <nav className="desktop-nav" aria-label="Primary navigation">
              {navItems.map(item => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => scrollToSection(item.key)}
                  className={`nav-link ${activeSection === item.key ? 'is-active' : ''}`}
                >
                  {item.label}
                  {activeSection === item.key && <motion.span layoutId="active-nav-pill" className="active-nav-pill" />}
                </button>
              ))}
            </nav>

            <div className="header-actions">
              <div className="theme-switch" aria-label="Theme mode">
                {isDarkMode ? <MoonIcon /> : <SunIcon />}
                <Switch checked={isDarkMode} onChange={setIsDarkMode} aria-label="Toggle dark mode" />
              </div>
              <Button
                type="text"
                className="icon-button md:!hidden"
                icon={isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
                onClick={() => setIsMobileMenuOpen(value => !value)}
                aria-label="Toggle mobile menu"
              />
            </div>
          </Header>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.nav
                variants={mobileMenuVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="mobile-menu md:hidden"
                aria-label="Mobile navigation"
              >
                {navItems.map(item => (
                  <motion.button
                    key={item.key}
                    type="button"
                    variants={mobileItemVariants}
                    onClick={() => scrollToSection(item.key)}
                    className={`mobile-menu-link ${activeSection === item.key ? 'is-active' : ''}`}
                  >
                    {item.label}
                    <ChevronIndicator active={activeSection === item.key} />
                  </motion.button>
                ))}
              </motion.nav>
            )}
          </AnimatePresence>
        </motion.div>

        <Content>
          <section id="home" className="hero-section section-band">
            <div className="aurora-layer" aria-hidden="true">
              <Aurora colorStops={['#0f766e', '#f59e0b', '#2563eb']} blend={0.42} amplitude={0.55} speed={0.58} />
            </div>
            <div className="surface-grid" aria-hidden="true" />

            <div className="section-inner hero-grid">
              <motion.div variants={sectionVariants} initial="hidden" animate="show" className="hero-copy">
                <motion.div variants={itemVariants} className="section-kicker">
                  <SparklesIcon />
                  Portfolio 2026
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Title className="hero-title">
                    Useful software. Polished interfaces. Practical engineering.
                  </Title>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Paragraph className="hero-lede">
                    I am Mike Leuster Estrada, a Computer Engineering student focused on practical apps,
                    computer vision, and clear product experiences that people can actually use.
                  </Paragraph>
                </motion.div>
                <motion.div variants={itemVariants} className="hero-actions">
                  <Button
                    type="primary"
                    size="large"
                    icon={<FolderKanbanIcon />}
                    onClick={() => scrollToSection('projects')}
                    className="primary-action"
                  >
                    View Work
                  </Button>
                  <Button
                    size="large"
                    icon={<SendIcon />}
                    onClick={() => scrollToSection('contact')}
                    className="secondary-action"
                  >
                    Contact Me
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 28, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.52, delay: 0.16, ease: 'easeOut' }}
                className="hero-stage"
              >
                <motion.aside
                  className="hero-side-panel hero-side-panel-left"
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.46, delay: 0.28, ease: 'easeOut' }}
                >
                  <div className="panel-icon">
                    <ZapIcon />
                  </div>
                  <span className="dashboard-label">Current Mode</span>
                  <strong>Building portfolio-ready projects</strong>
                  <p>Design-minded engineering for apps, vision systems, and useful web experiences.</p>
                </motion.aside>

                <motion.div
                  className="portrait-system"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="portrait-rings" aria-hidden="true" />
                  <div className="portrait-shell">
                    <img src={profileImage} alt="Mike Leuster Estrada" className="portrait-image" />
                  </div>
                  <div className="signal-card signal-card-top">
                    <SparklesIcon />
                    <span>Open to collaboration</span>
                  </div>
                  <div className="signal-card signal-card-bottom">
                    <Code2Icon />
                    <span>BS Computer Engineering</span>
                  </div>
                  <div className="signal-bars" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                </motion.div>

                <motion.aside
                  className="hero-side-panel hero-side-panel-right"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.46, delay: 0.34, ease: 'easeOut' }}
                >
                  <div className="highlight-list">
                    {heroHighlights.map(item => (
                      <div key={item.label} className="highlight-row">
                        <span>{item.label}</span>
                        <strong>{item.value}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="toolbox-block">
                    <span className="dashboard-label">Toolbox</span>
                    <div className="hero-stack">
                      {heroStack.map(tool => (
                        <span key={tool}>{tool}</span>
                      ))}
                    </div>
                  </div>
                </motion.aside>
              </motion.div>

              <motion.div
                variants={sectionVariants}
                initial="hidden"
                animate="show"
                className="hero-stats"
                aria-label="Portfolio highlights"
              >
                {heroStats.map(stat => (
                  <motion.div key={stat.label} variants={itemVariants} className="stat-tile">
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          <motion.section
            id="about"
            className="section-band about-section"
            variants={sectionVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="section-inner">
              <Row gutter={[40, 40]} align="middle">
                <Col xs={24} lg={10}>
                  <motion.div variants={itemVariants} className="image-feature">
                    <img src={formalImage} alt="Formal portrait of Mike Leuster Estrada" />
                    <div className="image-feature-caption">
                      <span>Bohol Island State University</span>
                      <strong>Student Developer</strong>
                    </div>
                  </motion.div>
                </Col>
                <Col xs={24} lg={14}>
                  <motion.div variants={itemVariants} className="section-heading">
                    <div className="section-kicker">
                      <UserIcon />
                      About
                    </div>
                    <Title level={2}>A builder who cares about the full experience.</Title>
                    <Paragraph>
                      My work sits between engineering, presentation, and service. I enjoy turning complex
                      ideas into usable systems, whether that means a machine learning demo, a management
                      platform, or a portfolio that communicates clearly.
                    </Paragraph>
                  </motion.div>

                  <motion.div variants={itemVariants} className="focus-grid">
                    {focusAreas.map(area => (
                      <article key={area.title} className="focus-card">
                        <div className="focus-icon">{area.icon}</div>
                        <h3>{area.title}</h3>
                        <p>{area.desc}</p>
                      </article>
                    ))}
                  </motion.div>
                </Col>
              </Row>
            </div>
          </motion.section>

          <motion.section
            id="skills"
            className="section-band skills-section"
            variants={sectionVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="section-inner">
              <motion.div variants={itemVariants} className="section-heading centered">
                <div className="section-kicker">
                  <Code2Icon />
                  Capabilities
                </div>
                <Title level={2}>Balanced technical and people skills.</Title>
                <Paragraph>
                  A focused stack for student engineering projects, supported by communication and creative production.
                </Paragraph>
              </motion.div>

              <Row gutter={[20, 20]} className="skill-grid">
                {skillGroups.map(group => (
                  <Col xs={24} md={8} key={group.title}>
                    <motion.article variants={itemVariants} whileHover={{ y: -6 }} className={`skill-card tone-${group.tone}`}>
                      <div className="card-heading">
                        <div className="card-icon">{group.icon}</div>
                        <div>
                          <h3>{group.title}</h3>
                          <p>{group.summary}</p>
                        </div>
                      </div>
                      <div className="skill-meter" aria-label={`${group.title} strength`}>
                        <motion.span
                          initial={{ width: 0 }}
                          whileInView={{ width: `${group.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                      <div className="tag-cloud">
                        {group.skills.map(skill => (
                          <Tag key={skill}>{skill}</Tag>
                        ))}
                      </div>
                    </motion.article>
                  </Col>
                ))}
              </Row>

              <motion.div variants={itemVariants} className="marquee-panel" aria-label="Technology highlights">
                <div className="marquee-track">
                  {[...skillGroups.flatMap(group => group.skills), ...skillGroups.flatMap(group => group.skills)].map((skill, index) => (
                    <span key={`${skill}-${index}`}>{skill}</span>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.section>

          <motion.section
            id="projects"
            className="section-band projects-section"
            variants={sectionVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="section-inner">
              <motion.div variants={itemVariants} className="section-heading centered">
                <div className="section-kicker">
                  <FolderKanbanIcon />
                  Selected Work
                </div>
                <Title level={2}>Projects with practical outcomes.</Title>
                <Paragraph>
                  Each project is framed around a clear use case, a focused stack, and a user-facing result.
                </Paragraph>
              </motion.div>

              <Row gutter={[20, 20]}>
                {projects.map((project, index) => (
                  <Col xs={24} lg={8} key={project.title}>
                    <motion.article
                      variants={itemVariants}
                      whileHover={{ y: -8 }}
                      className={`project-card tone-${project.tone}`}
                    >
                      <div className="project-preview" aria-hidden="true">
                        <div className="preview-toolbar">
                          <span />
                          <span />
                          <span />
                        </div>
                        <div className="preview-content">
                          <motion.div
                            className="preview-icon"
                            animate={{ rotate: [0, 4, -4, 0], scale: [1, 1.04, 1] }}
                            transition={{ duration: 4 + index, repeat: Infinity, ease: 'easeInOut' }}
                          >
                            {project.icon}
                          </motion.div>
                          <div className="preview-lines">
                            <span />
                            <span />
                            <span />
                          </div>
                        </div>
                      </div>
                      <div className="project-content">
                        <span className="project-category">{project.category}</span>
                        <h3>{project.title}</h3>
                        <p>{project.desc}</p>
                        <div className="metric-list">
                          {project.metrics.map(metric => (
                            <span key={metric}>
                              <CheckCircle2Icon />
                              {metric}
                            </span>
                          ))}
                        </div>
                        <div className="tag-cloud">
                          {project.tags.map(tag => (
                            <Tag key={tag}>{tag}</Tag>
                          ))}
                        </div>
                      </div>
                    </motion.article>
                  </Col>
                ))}
              </Row>
            </div>
          </motion.section>

          <motion.section
            id="experience"
            className="section-band experience-section"
            variants={sectionVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="section-inner">
              <Row gutter={[36, 36]}>
                <Col xs={24} lg={12}>
                  <motion.div variants={itemVariants} className="section-heading">
                    <div className="section-kicker">
                      <BriefcaseIcon />
                      Experience
                    </div>
                    <Title level={2}>Leadership shaped by real responsibilities.</Title>
                  </motion.div>

                  <motion.div variants={itemVariants} className="timeline-panel">
                    <Timeline
                      items={experienceItems.map(item => ({
                        color: 'green',
                        children: (
                          <div className="timeline-item">
                            <h3>{item.title}</h3>
                            <span>{item.role} | {item.date}</span>
                            <p>{item.desc}</p>
                          </div>
                        ),
                      }))}
                    />
                  </motion.div>
                </Col>

                <Col xs={24} lg={12}>
                  <motion.div variants={itemVariants} className="insight-grid">
                    <article className="insight-card">
                      <div className="card-heading compact">
                        <div className="card-icon"><AwardIcon /></div>
                        <h3>Achievements</h3>
                      </div>
                      <ul>
                        {achievementItems.map(item => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </article>
                    <article className="insight-card">
                      <div className="card-heading compact">
                        <div className="card-icon"><GlobeIcon /></div>
                        <h3>Education Timeline</h3>
                      </div>
                      <ul>
                        {educationItems.map(item => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </article>
                    <article className="insight-card reference-card">
                      <div className="card-heading compact">
                        <div className="card-icon"><UserIcon /></div>
                        <h3>Reference</h3>
                      </div>
                      <p>Mr. Mark Dennis Candel, DepEd Teacher</p>
                      <p>markdennis.candel@deped.gov.ph</p>
                      <p>09516178874</p>
                    </article>
                  </motion.div>
                </Col>
              </Row>
            </div>
          </motion.section>

          <motion.section
            id="contact"
            className="section-band contact-section"
            variants={sectionVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="section-inner">
              <Row gutter={[36, 36]} align="stretch">
                <Col xs={24} lg={10}>
                  <motion.div variants={itemVariants} className="contact-aside">
                    <div className="section-kicker">
                      <MailIcon />
                      Contact
                    </div>
                    <Title level={2}>Let us build something clear and useful.</Title>
                    <Paragraph>
                      Reach out for collaboration, school projects, developer communities, or opportunities where
                      practical engineering and careful presentation matter.
                    </Paragraph>

                    <div className="contact-list">
                      <a href={`mailto:${CONTACT_EMAIL}`}>
                        <MailIcon />
                        <span>{CONTACT_EMAIL}</span>
                      </a>
                      <a href="tel:+639649796538">
                        <PhoneIcon />
                        <span>09649796538</span>
                      </a>
                      <span>
                        <MapPinIcon />
                        <span>Purok 3, Canagong, Sikatuna, Bohol</span>
                      </span>
                    </div>

                    <div className="social-row" aria-label="Social links">
                      {socialLinks.map(link => (
                        <Button
                          key={link.label}
                          type="text"
                          className="social-button"
                          icon={link.icon}
                          href={link.href}
                          target="_blank"
                          aria-label={link.label}
                        />
                      ))}
                    </div>
                  </motion.div>
                </Col>

                <Col xs={24} lg={14}>
                  <motion.div variants={itemVariants} className="contact-panel">
                    <AnimatePresence mode="wait">
                      {formFeedback && (
                        <motion.div
                          key={formFeedback.type}
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.2 }}
                          className={`form-feedback ${formFeedback.type === 'success' ? 'is-success' : 'is-error'}`}
                        >
                          {formFeedback.type === 'success' ? <CheckCircle2Icon /> : <XCircleIcon />}
                          <span>{formFeedback.message}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Form
                      form={contactForm}
                      layout="vertical"
                      size="large"
                      className="contact-form"
                      onFinish={onSubmit}
                      onFinishFailed={onSubmitFailed}
                    >
                      <Row gutter={16}>
                        <Col xs={24} sm={12}>
                          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter your name' }]}>
                            <Input placeholder="Your name" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                              { required: true, message: 'Please enter your email' },
                              { type: 'email', message: 'Please enter a valid email address' },
                            ]}
                          >
                            <Input placeholder="your.email@example.com" />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Form.Item label="Subject" name="subject">
                        <Input placeholder="What would you like to discuss?" />
                      </Form.Item>
                      <Form.Item label="Message" name="message" rules={[{ required: true, message: 'Please add your message' }]}>
                        <Input.TextArea rows={5} placeholder="Tell me a little about the idea, timeline, or opportunity." />
                      </Form.Item>
                      <Form.Item className="mb-0">
                        <Button type="primary" icon={<SendIcon />} htmlType="submit" loading={isSubmitting} className="submit-button">
                          Send Message
                        </Button>
                      </Form.Item>
                    </Form>
                  </motion.div>
                </Col>
              </Row>
            </div>
          </motion.section>
        </Content>

        <Footer className="site-footer">
          <div className="section-inner footer-inner">
            <div>
              <Title level={3}>Mike Leuster Estrada</Title>
              <Text>Computer Engineering student building practical and polished software experiences.</Text>
            </div>
            <Button type="primary" icon={<ArrowUpRightIcon />} onClick={() => scrollToSection('home')} className="footer-top-button">
              Back to top
            </Button>
          </div>
          <Divider />
          <div className="footer-credit">
            &copy; {new Date().getFullYear()} Mike Leuster Estrada. All rights reserved.
          </div>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
};

type ChevronIndicatorProps = {
  active: boolean;
};

const ChevronIndicator = ({ active }: ChevronIndicatorProps) => (
  <span className={`mobile-indicator ${active ? 'is-active' : ''}`} aria-hidden="true">
    <ArrowUpRightIcon />
  </span>
);

export default App;

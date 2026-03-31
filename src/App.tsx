import React, { useEffect, useRef, useState } from 'react';
import {
  Layout,
  Typography,
  Button,
  Row,
  Col,
  Card,
  Timeline,
  Tag,
  Form,
  Input,
  Divider,
  ConfigProvider,
  Space,
  Switch,
  theme as antTheme,
} from 'antd';
import {
  GithubOutlined,
  LinkedinOutlined,
  MailOutlined,
  FacebookOutlined,
  InstagramOutlined,
  GlobalOutlined,
  CodeOutlined,
  UserOutlined,
  ProjectOutlined,
  SendOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  MoonOutlined,
  SunOutlined,
  MenuOutlined,
  CloseOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
} from '@ant-design/icons';
import { AnimatePresence, motion } from 'motion/react';
import profileImage from '../assets/id.png';
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

const CONTACT_EMAIL = 'leusterestrada@gmail.com';

const heroContainer = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.46,
      ease: 'easeOut',
      staggerChildren: 0.09,
      delayChildren: 0.04,
    },
  },
} as const;

const heroItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
} as const;

const fadeUpSection = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.52,
      ease: 'easeOut',
      staggerChildren: 0.07,
      delayChildren: 0.04,
    },
  },
} as const;

const slideLeftSection = {
  hidden: { opacity: 0, x: -44 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.54,
      ease: 'easeOut',
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
} as const;

const scaleInSection = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      staggerChildren: 0.07,
      delayChildren: 0.04,
    },
  },
} as const;

const revealItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } },
} as const;

const mobileMenuStagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.02 } },
} as const;

const mobileMenuItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
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
  const [isHoveringTop, setIsHoveringTop] = useState(false);
  const previousScrollY = useRef(0);

  const navItems = [
    { key: 'home', label: 'Home' },
    { key: 'about', label: 'About' },
    { key: 'skills', label: 'Skills' },
    { key: 'projects', label: 'Projects' },
    { key: 'experience', label: 'Experience' },
    { key: 'contact', label: 'Contact' },
  ];

  useEffect(() => {
    const themeMode = isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', themeMode);
    localStorage.setItem('themeMode', themeMode);
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 120) {
        setIsHeaderVisible(true);
      } else if (currentY > previousScrollY.current + 3) {
        setIsHeaderVisible(false);
      } else if (currentY < previousScrollY.current - 3) {
        setIsHeaderVisible(true);
      }
      previousScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sectionIds = navItems.map(item => item.key);
    const sections = sectionIds
      .map(id => document.getElementById(id))
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
        rootMargin: '-20% 0px -45% 0px',
        threshold: [0.15, 0.4, 0.65],
      },
    );

    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
          colorPrimary: '#1890ff',
          borderRadius: 8,
          colorBgLayout: isDarkMode ? '#020617' : '#ffffff',
          colorBgContainer: isDarkMode ? '#0f172a' : '#ffffff',
          colorTextBase: isDarkMode ? '#e2e8f0' : '#111827',
        },
      }}
    >
      <Layout className={`app-shell min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}`}>
        <div
          className="fixed top-0 left-0 right-0 h-12 z-40"
          onMouseEnter={() => setIsHoveringTop(true)}
          onMouseLeave={() => setIsHoveringTop(false)}
        />
        <motion.div
          initial={false}
          animate={{ y: isHeaderVisible || isHoveringTop ? 0 : -64, opacity: isHeaderVisible || isHoveringTop ? 1 : 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="fixed top-0 left-0 right-0 z-50"
        >
          <Header className={`flex items-center justify-between px-4 md:px-12 backdrop-blur-md h-16 ${isDarkMode ? 'bg-slate-950/85 border-b border-slate-800' : 'bg-white/80 border-b border-gray-100'}`}>
            <div className="flex h-full w-44 items-center justify-start">
              <Title level={4} className="!my-0 !w-full !text-left !text-blue-600 !leading-none font-bold tracking-tight">
                PORTFOLIO
              </Title>
            </div>

            <nav className="hidden md:flex items-center gap-2">
              {navItems.map(item => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => scrollToSection(item.key)}
                  className={`animated-link nav-pill relative px-3 py-2 text-sm font-medium transition-colors ${activeSection === item.key ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
                >
                  {item.label}
                  {activeSection === item.key && (
                    <motion.span
                      layoutId="active-nav-indicator"
                      className="absolute left-2 right-2 -bottom-0.5 h-0.5 rounded-full bg-blue-600"
                      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2 md:ml-4">
              {isDarkMode ? <MoonOutlined className="text-slate-300" /> : <SunOutlined className="text-amber-500" />}
              <Switch
                checked={isDarkMode}
                onChange={setIsDarkMode}
                checkedChildren="Dark"
                unCheckedChildren="Light"
              />
              <Button
                type="text"
                className="icon-press md:!hidden"
                icon={isMobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
                onClick={() => setIsMobileMenuOpen(value => !value)}
                aria-label="Toggle mobile menu"
              />
            </div>
          </Header>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className={`md:hidden overflow-hidden border-b ${isDarkMode ? 'bg-slate-950/95 border-slate-800' : 'bg-white/95 border-gray-100'}`}
              >
                <motion.ul
                  variants={mobileMenuStagger}
                  initial="hidden"
                  animate="show"
                  className="px-4 py-3"
                >
                  {navItems.map(item => (
                    <motion.li key={item.key} variants={mobileMenuItem}>
                      <button
                        type="button"
                        onClick={() => scrollToSection(item.key)}
                        className={`w-full text-left px-2 py-2 rounded-md transition-colors ${activeSection === item.key ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-100'}`}
                      >
                        {item.label}
                      </button>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <Content className="pt-16">
          <section id="home" className="hero-section relative min-h-[90vh] flex items-center justify-center px-4 md:px-12 bg-gradient-to-br from-blue-50 to-white overflow-hidden">
            <div className="absolute inset-0 opacity-40 pointer-events-none">
              <Aurora
                colorStops={['#1a2a6c', '#2d6cdf', '#0b1024']}
                blend={0.35}
                amplitude={0.6}
                speed={0.6}
              />
            </div>
            <div className={`absolute inset-0 pointer-events-none ${isDarkMode ? 'bg-slate-950/35' : 'bg-white/45'}`} />
            <motion.div
              className="pointer-events-none absolute -left-20 top-8 h-60 w-60 rounded-full bg-blue-200/40 blur-2xl"
              animate={{ x: [0, 14, 0], y: [0, 8, 0], borderRadius: ['42% 58% 53% 47%', '58% 42% 46% 54%', '42% 58% 53% 47%'] }}
              transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="pointer-events-none absolute -right-16 bottom-6 h-72 w-72 rounded-full bg-cyan-200/30 blur-2xl"
              animate={{ x: [0, -12, 0], y: [0, -10, 0], borderRadius: ['50% 50% 62% 38%', '40% 60% 50% 50%', '50% 50% 62% 38%'] }}
              transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
            />

            <Row gutter={[32, 32]} align="middle" className="max-w-7xl w-full">
              <Col xs={24} md={12}>
                <motion.div variants={heroContainer} initial="hidden" animate="show">
                  <motion.div variants={heroItem}>
                    <Text className="text-blue-600 font-semibold uppercase tracking-widest block mb-4">
                      Welcome to my world
                    </Text>
                  </motion.div>
                  <motion.div variants={heroItem}>
                    <Title className="!text-5xl md:!text-7xl !mb-6 !font-extrabold">
                      Hi, I'm <span className="text-blue-600">Mike Leuster Estrada</span>
                    </Title>
                  </motion.div>
                  <motion.div variants={heroItem}>
                    <Title level={2} className="!text-gray-600 !mb-8 !font-medium">
                      Computer Engineering Student & Aspiring Software Developer
                    </Title>
                  </motion.div>
                  <motion.div variants={heroItem}>
                    <Paragraph className="text-lg text-gray-500 max-w-lg mb-8 leading-relaxed">
                      I build practical and user-focused applications, from machine learning projects to full-stack web systems, while continuously improving my technical and leadership skills.
                    </Paragraph>
                  </motion.div>
                  <motion.div variants={heroItem}>
                    <Space size="middle">
                      <Button type="primary" size="large" onClick={() => scrollToSection('projects')} className="interactive-btn h-12 px-8 text-lg font-medium">
                        View My Work
                      </Button>
                      <Button size="large" onClick={() => scrollToSection('contact')} className="interactive-btn h-12 px-8 text-lg font-medium">
                        Contact Me
                      </Button>
                    </Space>
                  </motion.div>
                  <motion.div variants={heroItem} className="mt-12 flex gap-6">
                    <Button type="text" className="icon-press" icon={<GithubOutlined className="text-2xl" />} href="https://github.com/mikeeyyyy04" target="_blank" />
                    <Button type="text" className="icon-press" icon={<LinkedinOutlined className="text-2xl" />} href="https://www.linkedin.com/in/mike-leuster-estrada" target="_blank" />
                    <Button type="text" className="icon-press" icon={<FacebookOutlined className="text-2xl" />} href="https://www.facebook.com/mike.leuster.estrada" target="_blank" />
                    <Button type="text" className="icon-press" icon={<InstagramOutlined className="text-2xl" />} href="https://www.instagram.com/_mikeeyyyyyy/" target="_blank" />
                    <Button type="text" className="icon-press" icon={<MailOutlined className="text-2xl" />} onClick={() => scrollToSection('contact')} />
                  </motion.div>
                </motion.div>
              </Col>
              <Col xs={24} md={12} className="flex justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.44, delay: 0.2, ease: 'easeOut' }}
                  className="relative"
                >
                  <div className="w-64 h-64 md:w-96 md:h-96 rounded-full overflow-hidden border-8 border-white shadow-2xl">
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-contain object-top bg-gray-100"
                    />
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, delay: 0.52 }}
                    className="absolute -bottom-4 -right-4 bg-white p-6 rounded-2xl shadow-xl hidden md:block"
                  >
                    <Title level={4} className="!mb-0 text-blue-600">BS Computer Engineering</Title>
                    <Text className="text-gray-500">Bohol Island State University</Text>
                  </motion.div>
                </motion.div>
              </Col>
            </Row>
          </section>

          <motion.section
            id="about"
            className="py-24 px-4 md:px-12 bg-white"
            variants={slideLeftSection}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="max-w-7xl mx-auto">
              <Row gutter={[48, 48]} align="middle">
                <Col xs={24} md={10}>
                  <motion.img
                    variants={revealItem}
                    src="https://picsum.photos/seed/workspace/800/1000"
                    alt="About Me"
                    className="w-full rounded-3xl shadow-xl"
                    referrerPolicy="no-referrer"
                  />
                </Col>
                <Col xs={24} md={14}>
                  <motion.div variants={revealItem}>
                    <Title level={2} className="!mb-8">About Me</Title>
                  </motion.div>
                  <motion.div variants={revealItem}>
                    <Paragraph className="text-lg text-gray-600 mb-6">
                      I am Mike Leuster Estrada, a Bachelor of Science in Computer Engineering student at Bohol Island State University. I enjoy building real-world software that solves practical problems.
                    </Paragraph>
                  </motion.div>
                  <motion.div variants={revealItem}>
                    <Paragraph className="text-lg text-gray-600 mb-8">
                      My portfolio includes projects in computer vision, clinic management systems, and web deployment workflows. I also take active leadership roles in student organizations and community-driven tech groups.
                    </Paragraph>
                  </motion.div>
                  <motion.div variants={revealItem}>
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <div className="p-4 bg-gray-50 rounded-xl">
                          <Title level={4} className="!mb-1">Education</Title>
                          <Text className="text-gray-500">BS Computer Engineering (2022 - present)</Text>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className="p-4 bg-gray-50 rounded-xl">
                          <Title level={4} className="!mb-1">Location</Title>
                          <Text className="text-gray-500">Purok 3, Canagong, Sikatuna, Bohol</Text>
                        </div>
                      </Col>
                    </Row>
                  </motion.div>
                </Col>
              </Row>
            </div>
          </motion.section>

          <motion.section
            id="skills"
            className="py-24 px-4 md:px-12 bg-gray-50"
            variants={scaleInSection}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="max-w-7xl mx-auto text-center mb-16">
              <motion.div variants={revealItem}>
                <Title level={2}>My Expertise</Title>
              </motion.div>
              <motion.div variants={revealItem}>
                <Paragraph className="text-lg text-gray-500">
                  The tools and technologies I use to bring projects to life.
                </Paragraph>
              </motion.div>
            </div>
            <div className="max-w-7xl mx-auto">
              <Row gutter={[24, 24]}>
                {[
                  { title: 'Technical Skills', icon: <CodeOutlined />, skills: ['C and Assembly', 'Video Editing', 'Microsoft Office', 'Adobe Softwares'] },
                  { title: 'Soft Skills', icon: <UserOutlined />, skills: ['Public Speaking', 'Leadership', 'People Management', 'Communication'] },
                  { title: 'Interests', icon: <ProjectOutlined />, skills: ['Badminton', 'Volleyball', 'Music', 'Reading Books'] },
                ].map((category, idx) => (
                  <Col xs={24} md={8} key={idx}>
                    <motion.div
                      variants={revealItem}
                      whileHover={{ rotateX: 2, rotateY: -2, y: -4 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="card-tilt"
                    >
                      <Card className="h-full border-none rounded-2xl">
                        <div className="text-4xl text-blue-600 mb-6">{category.icon}</div>
                        <Title level={3} className="!mb-6">{category.title}</Title>
                        <div className="flex flex-wrap gap-2">
                          {category.skills.map(skill => (
                            <Tag key={skill} className="px-4 py-1 text-sm rounded-full border-blue-100 bg-blue-50 text-blue-600">
                              {skill}
                            </Tag>
                          ))}
                        </div>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </div>
          </motion.section>

          <motion.section
            id="projects"
            className="py-24 px-4 md:px-12 bg-white"
            variants={fadeUpSection}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="max-w-7xl mx-auto text-center mb-16">
              <motion.div variants={revealItem}>
                <Title level={2}>Featured Projects</Title>
              </motion.div>
              <motion.div variants={revealItem}>
                <Paragraph className="text-lg text-gray-500">
                  A selection of my recent work and personal experiments.
                </Paragraph>
              </motion.div>
            </div>
            <div className="max-w-7xl mx-auto">
              <Row gutter={[32, 32]}>
                {[
                  { title: 'Sports-Equipment-Classification-Using-OpenCV', desc: 'A machine learning app using OpenCV and a CNN trained on Kaggle data for real-time sports equipment classification.', tags: ['OpenCV', 'CNN', 'Python'], img: 'https://picsum.photos/seed/opencv/800/500' },
                  { title: 'Appointify', desc: 'A clinic appointment management system with Bun/Hono backend and SvelteKit frontend, plus JWT and MongoDB.', tags: ['Bun', 'Hono', 'SvelteKit'], img: 'https://picsum.photos/seed/clinic/800/500' },
                  { title: 'Personal Portfolio', desc: 'A Flutter and Dart web portfolio with responsive layouts, project dialogs, and GitHub deployment workflow.', tags: ['Flutter', 'Dart', 'GitHub Pages'], img: 'https://picsum.photos/seed/portfolio/800/500' },
                ].map((project, idx) => (
                  <Col xs={24} md={8} key={idx}>
                    <motion.div
                      variants={revealItem}
                      whileHover={{ rotateX: 1.5, rotateY: -1.5, y: -5 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="card-tilt"
                    >
                      <Card
                        hoverable
                        cover={<img alt={project.title} src={project.img} className="h-48 object-cover" referrerPolicy="no-referrer" />}
                        className="overflow-hidden rounded-2xl border-gray-100"
                      >
                        <Title level={4}>{project.title}</Title>
                        <Paragraph className="text-gray-500 mb-4">{project.desc}</Paragraph>
                        <div className="flex gap-2 mb-6">
                          {project.tags.map(tag => <Tag key={tag} color="blue">{tag}</Tag>)}
                        </div>
                        <Button type="link" className="animated-link p-0 text-blue-600 font-medium">View Project →</Button>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </div>
          </motion.section>

          <motion.section
            id="experience"
            className="py-24 px-4 md:px-12 bg-gray-50"
            variants={slideLeftSection}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="max-w-7xl mx-auto">
              <Row gutter={[48, 48]}>
                <Col xs={24} md={12}>
                  <motion.div variants={revealItem}>
                    <Title level={2} className="!mb-12">Work Experience</Title>
                  </motion.div>
                  <motion.div variants={revealItem}>
                    <Timeline
                      items={[
                        {
                          color: 'blue',
                          children: (
                            <div className="pb-8">
                              <Title level={4} className="!mb-1">Institute of Computer Engineering</Title>
                              <Text className="text-blue-600 font-medium block mb-2">Year Level Representative | 2023 - Present</Text>
                              <Paragraph className="text-gray-500">
                                Tagbilaran City, Bohol, Philippines. Supports student coordination and helps organize activities that promote engineering excellence and innovation.
                              </Paragraph>
                            </div>
                          ),
                        },
                        {
                          color: 'gray',
                          children: (
                            <div className="pb-8">
                              <Title level={4} className="!mb-1">Google Developers Club</Title>
                              <Text className="text-blue-600 font-medium block mb-2">Member</Text>
                              <Paragraph className="text-gray-500">
                                Tagbilaran City, Bohol, Philippines. Participates in community sessions where students learn practical developer technologies and collaborative problem solving.
                              </Paragraph>
                            </div>
                          ),
                        },
                        {
                          color: 'gray',
                          children: (
                            <div>
                              <Title level={4} className="!mb-1">Supreme Student Government</Title>
                              <Text className="text-blue-600 font-medium block mb-2">President | 2019 - 2022</Text>
                              <Paragraph className="text-gray-500">
                                Tagbilaran City, Bohol, Philippines. Represented the student body, led initiatives, and supported policies to improve student life.
                              </Paragraph>
                            </div>
                          ),
                        },
                      ]}
                    />
                  </motion.div>
                </Col>
                <Col xs={24} md={12}>
                  <motion.div variants={revealItem}>
                    <Title level={2} className="!mb-12">Achievements & Reference</Title>
                  </motion.div>
                  <div className="space-y-8">
                    <motion.div variants={revealItem} className="flex gap-6">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <ProjectOutlined className="text-xl text-blue-600" />
                      </div>
                      <div>
                        <Title level={4} className="!mb-2">Achievements</Title>
                        <Paragraph className="text-gray-500">Graduated Valedictorian (Sikatuna Central Elementary School), Graduated Salutatorian (Sikatuna National High School), and Radio Station Guesting (DYRD, 2022).</Paragraph>
                      </div>
                    </motion.div>
                    <motion.div variants={revealItem} className="flex gap-6">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <UserOutlined className="text-xl text-blue-600" />
                      </div>
                      <div>
                        <Title level={4} className="!mb-2">Reference</Title>
                        <Paragraph className="text-gray-500">Mr. Mark Dennis Candel, DepEd Teacher, markdennis.candel@deped.gov.ph, 09516178874.</Paragraph>
                      </div>
                    </motion.div>
                    <motion.div variants={revealItem} className="flex gap-6">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <GlobalOutlined className="text-xl text-blue-600" />
                      </div>
                      <div>
                        <Title level={4} className="!mb-2">Education Timeline</Title>
                        <Paragraph className="text-gray-500">Sikatuna Central Elementary School (2009 - 2015), Sikatuna National High School (2015 - 2020), Sikatuna National High School GAS (2020 - 2022), BS Computer Engineering at BISU (2022 - present).</Paragraph>
                      </div>
                    </motion.div>
                  </div>
                </Col>
              </Row>
            </div>
          </motion.section>

          <motion.section
            id="contact"
            className="py-24 px-4 md:px-12 bg-white"
            variants={scaleInSection}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="max-w-7xl mx-auto">
              <Row gutter={[48, 48]}>
                <Col xs={24} md={10}>
                  <motion.div variants={revealItem}>
                    <Title level={2} className="!mb-6">Get In Touch</Title>
                  </motion.div>
                  <motion.div variants={revealItem}>
                    <Paragraph className="text-lg text-gray-500 mb-12">
                      Have a project in mind or just want to say hi? Feel free to reach out!
                    </Paragraph>
                  </motion.div>
                  <div className="space-y-6">
                    <motion.div variants={revealItem} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                        <MailOutlined className="text-blue-600" />
                      </div>
                      <Text className="text-lg">leusterestrada@gmail.com</Text>
                    </motion.div>
                    <motion.div variants={revealItem} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                        <PhoneOutlined className="text-blue-600" />
                      </div>
                      <Text className="text-lg">09649796538</Text>
                    </motion.div>
                    <motion.div variants={revealItem} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                        <EnvironmentOutlined className="text-blue-600" />
                      </div>
                      <Text className="text-lg">Purok 3, Canagong, Sikatuna, Bohol</Text>
                    </motion.div>
                  </div>
                </Col>
                <Col xs={24} md={14}>
                  <motion.div variants={revealItem}>
                    <Card className="shadow-2xl border-none rounded-3xl p-4 md:p-8">
                      <AnimatePresence mode="wait">
                        {formFeedback && (
                          <motion.div
                            key={formFeedback.type}
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className={`mb-5 rounded-lg px-4 py-3 flex items-center gap-3 ${formFeedback.type === 'success' ? 'form-feedback-success' : 'form-feedback-error'}`}
                          >
                            {formFeedback.type === 'success' ? <CheckCircleFilled /> : <CloseCircleFilled />}
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
                          <Col span={12}>
                            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter your name' }]}>
                              <Input placeholder="Your Name" className="rounded-lg" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label="Email"
                              name="email"
                              rules={[
                                { required: true, message: 'Please enter your email' },
                                { type: 'email', message: 'Please enter a valid email address' },
                              ]}
                            >
                              <Input placeholder="Your Email" className="rounded-lg" />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Form.Item label="Subject" name="subject">
                          <Input placeholder="Subject" className="rounded-lg" />
                        </Form.Item>
                        <Form.Item label="Message" name="message" rules={[{ required: true, message: 'Please add your message' }]}>
                          <Input.TextArea rows={4} placeholder="Your Message" className="rounded-lg" />
                        </Form.Item>
                        <Form.Item className="mb-0">
                          <Button type="primary" icon={<SendOutlined />} htmlType="submit" loading={isSubmitting} className="interactive-btn w-full h-12 rounded-lg font-semibold">
                            Send Message
                          </Button>
                        </Form.Item>
                      </Form>
                    </Card>
                  </motion.div>
                </Col>
              </Row>
            </div>
          </motion.section>
        </Content>

        <Footer className="bg-gray-900 text-white py-12 px-4 md:px-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <Title level={3} className="!text-white !mb-2">Mike Leuster Estrada</Title>
              <Text className="text-gray-400">Computer Engineering student building practical and impactful software.</Text>
            </div>
            <div className="flex gap-4">
              <Button type="text" className="icon-press" icon={<GithubOutlined className="text-xl text-gray-400 hover:text-white" />} href="https://github.com/mikeeyyyy04" target="_blank" />
              <Button type="text" className="icon-press" icon={<LinkedinOutlined className="text-xl text-gray-400 hover:text-white" />} href="https://www.linkedin.com/in/mike-leuster-estrada" target="_blank" />
              <Button type="text" className="icon-press" icon={<FacebookOutlined className="text-xl text-gray-400 hover:text-white" />} href="https://www.facebook.com/mike.leuster.estrada" target="_blank" />
              <Button type="text" className="icon-press" icon={<InstagramOutlined className="text-xl text-gray-400 hover:text-white" />} href="https://www.instagram.com/_mikeeyyyyyy/" target="_blank" />
              <Button type="text" className="icon-press" icon={<MailOutlined className="text-xl text-gray-400 hover:text-white" />} onClick={() => scrollToSection('contact')} />
            </div>
          </div>
          <Divider className="border-gray-800 my-8" />
          <div className="text-center text-gray-500">
            © {new Date().getFullYear()} Mike Leuster Estrada. All rights reserved.
          </div>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
};

export default App;

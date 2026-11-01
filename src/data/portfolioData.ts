export interface SocialLinkItem {
  id: string;
  platform: 'phone' | 'email' | 'whatsapp' | 'linkedin' | 'github' | 'facebook' | 'website' | 'x';
  url: string;
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
}

export interface HeroData {
  name: string;
  wordmark: string;
  subtitle: string;
  bio: string;
  avatarUrl: string;
  faviconUrl: string;
  resumeLink: string;
  resumeButtonText: string;
  socialLinks: SocialLinkItem[];
  stats: StatItem[];
}

export interface EducationItem {
  id: string;
  deg: string;
  inst: string;
  instUrl?: string;
  yr: string;
  cgpa: string;
  tc: string;
  bc: string;
  img: string;
}

export type SkillCategory = 'programming' | 'web' | 'ai' | 'database' | 'design' | 'tools';

export interface SkillItem {
  id: string;
  name: string;
  icon: string;
  cat: SkillCategory;
  c: string;
  badgeText?: string;
}

export interface GitLanguageStat {
  name: string;
  percent: number;
  color: string;
}

export interface ServiceItem {
  id: string;
  n: string;
  title: string;
  desc: string;
  icon: string;
  c: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  url?: string;
  date: string;
  location: string;
  desc: string[];
  tech: string[];
}

export type ProjectCategory = 'ai' | 'fullstack' | 'wordpress' | 'security' | 'desktop' | 'tools';

export interface ExtraLink {
  label: string;
  url: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  cat: ProjectCategory;
  desc: string;
  highlights: string[];
  tech: string[];
  c: string;
  iconKey: string;
  live: string | null;
  github: string | null;
  extraLinks?: ExtraLink[];
  img?: string;
}

export type ToolCategory = 'calculators' | 'ai_media' | 'finance_utility';

export interface WebToolItem {
  id: string;
  title: string;
  category: ToolCategory;
  categoryLabel: string;
  subtitle: string;
  desc: string;
  url: string;
  accent: string;
  tags: string[];
}

export interface CertificationItem {
  id: string;
  title: string;
  org: string;
  date: string;
  desc: string;
  tags: string[];
  c: string;
  iconType: 'google' | 'gemini' | 'faculty' | 'student';
  verifyUrl: string;
}

export interface ReferenceItem {
  id: string;
  name: string;
  role: string;
  dept: string;
  institution: string;
  email: string;
}

export interface ContactData {
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  linkedinUrl: string;
  githubUrl: string;
  facebookUrl: string;
  walletUrl: string;
  references: ReferenceItem[];
}

export const PORTFOLIO_DATA: {
  hero: HeroData;
  education: EducationItem[];
  skills: SkillItem[];
  gitLanguages: GitLanguageStat[];
  personalTraits: string[];
  interests: string[];
  spokenLanguages: { language: string; level: string }[];
  services: ServiceItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  tools: WebToolItem[];
  certifications: CertificationItem[];
  contact: ContactData;
} = {
  hero: {
    name: 'Mehedi Hasan Shihab',
    wordmark: 'SHIHAB',
    subtitle: 'Senior Software Engineer & Full-Stack / AI Developer',
    bio: `Senior Software Engineer at Bangladesh Education and Research Institute (BERI) and Remote Web Developer at MAC Technology Australia with 7+ years of experience crafting scalable web applications, AI-powered platforms, and enterprise software architectures.\nSpecialized in React, Next.js, Node.js, PHP/Laravel, WordPress ecosystems, PostgreSQL & Oracle PL/SQL, Google Gemini Live & OpenClaw Agentic AI, and mission-critical cybersecurity malware recovery.`,
    avatarUrl: '/asset/Shihab.jpg',
    faviconUrl: '/asset/fav.png',
    resumeLink: '/asset/shihabCV.pdf',
    resumeButtonText: 'Download CV',
    socialLinks: [
      { id: 's-phone', platform: 'phone', url: '+8801521213853' },
      { id: 's-email', platform: 'email', url: 'sshihabb007@gmail.com' },
      { id: 's-wa', platform: 'whatsapp', url: '+8801521213853' },
      { id: 's-li', platform: 'linkedin', url: 'https://www.linkedin.com/in/mehedi-hasan-shihab' },
      { id: 's-gh', platform: 'github', url: 'https://github.com/sshihabb007' },
      { id: 's-fb', platform: 'facebook', url: 'https://www.facebook.com/sshihabb007/' },
      { id: 's-web', platform: 'website', url: 'https://edu.google.accredible.com/profile/mehedihasanshihab922213/wallet' },
    ],
    stats: [
      { id: 'st-1', value: '28+', label: 'Notable Projects' },
      { id: 'st-2', value: '7+', label: 'Years Exp.' },
      { id: 'st-3', value: '5', label: 'Google Certs' },
    ],
  },

  education: [
    {
      id: 'edu-msc',
      deg: 'M.Sc. in Computer Science',
      inst: 'American International University-Bangladesh (AIUB)',
      instUrl: 'https://www.aiub.edu/',
      yr: '2021 – 2022',
      cgpa: 'CGPA: 3.77 / 4.00',
      tc: 'var(--accent)',
      bc: 'rgba(37, 99, 235, .1)',
      img: '/asset/aiub-logo.png',
    },
    {
      id: 'edu-bsc',
      deg: 'B.Sc. in Computer Science & Engineering',
      inst: 'American International University-Bangladesh (AIUB)',
      instUrl: 'https://www.aiub.edu/',
      yr: '2014 – 2019',
      cgpa: 'CGPA: 3.65 / 4.00',
      tc: '#0ea5e9',
      bc: 'rgba(14, 165, 233, .1)',
      img: '/asset/aiub-logo.png',
    },
    {
      id: 'edu-hsc',
      deg: 'Higher Secondary Certificate (Science)',
      inst: 'Safiuddin Sarkar Academy & College (SSAC)',
      yr: '2012 – 2014 · Gazipur, Dhaka',
      cgpa: 'GPA: 4.90 / 5.00',
      tc: '#16a34a',
      bc: 'rgba(22, 163, 74, .1)',
      img: '/asset/ssac-crest.svg',
    },
    {
      id: 'edu-ssc',
      deg: 'Secondary School Certificate (Science)',
      inst: 'Safiuddin Sarkar Academy & College (SSAC)',
      yr: '2010 – 2012 · Gazipur, Dhaka',
      cgpa: 'GPA: 5.00 / 5.00',
      tc: '#f59e0b',
      bc: 'rgba(245, 158, 11, .1)',
      img: '/asset/ssac-crest.svg',
    },
  ],

  skills: [
    // Programming
    { id: 'sk-js', name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg', cat: 'programming', c: '#F7DF1E' },
    { id: 'sk-ts', name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg', cat: 'programming', c: '#3178C6' },
    { id: 'sk-py', name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg', cat: 'programming', c: '#3776AB' },
    { id: 'sk-cs', name: 'C#', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg', cat: 'programming', c: '#512BD4' },
    { id: 'sk-php', name: 'PHP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg', cat: 'programming', c: '#777BB4' },
    { id: 'sk-java', name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg', cat: 'programming', c: '#ED8B00' },
    { id: 'sk-cpp', name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg', cat: 'programming', c: '#00599C' },
    { id: 'sk-c', name: 'C', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg', cat: 'programming', c: '#A8B9CC' },

    // Web & Full-Stack
    { id: 'sk-react', name: 'React.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg', cat: 'web', c: '#61DAFB' },
    { id: 'sk-next', name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg', cat: 'web', c: '#6366F1' },
    { id: 'sk-node', name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg', cat: 'web', c: '#339933' },
    { id: 'sk-wp', name: 'WordPress', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/wordpress/wordpress-plain.svg', cat: 'web', c: '#21759B' },
    { id: 'sk-laravel', name: 'Laravel', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg', cat: 'web', c: '#FF2D20' },
    { id: 'sk-aspnet', name: 'ASP.NET', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dotnetcore/dotnetcore-original.svg', cat: 'web', c: '#512BD4' },
    { id: 'sk-html', name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg', cat: 'web', c: '#E34F26' },
    { id: 'sk-css', name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg', cat: 'web', c: '#1572B6' },
    { id: 'sk-tw', name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg', cat: 'web', c: '#06B6D4' },
    { id: 'sk-bs', name: 'Bootstrap', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg', cat: 'web', c: '#7952B3' },
    { id: 'sk-jq', name: 'AJAX & jQuery', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jquery/jquery-original.svg', cat: 'web', c: '#0769AD' },

    // AI & Agents
    { id: 'sk-gemini', name: 'Gemini Live API', icon: '/asset/gemini-sparkle.svg', cat: 'ai', c: '#8B5CF6' },
    { id: 'sk-vertex', name: 'Google Vertex AI', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg', cat: 'ai', c: '#4285F4' },
    { id: 'sk-openclaw', name: 'OpenClaw Agents', icon: '', cat: 'ai', c: '#EC4899', badgeText: 'OC' },
    { id: 'sk-rasa', name: 'Rasa NLU', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original.svg', cat: 'ai', c: '#FF6F00' },
    { id: 'sk-llm', name: 'LLM Training', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pytorch/pytorch-original.svg', cat: 'ai', c: '#EE4C2C', badgeText: 'LLM' },
    { id: 'sk-prompt', name: 'Prompt Crafting', icon: '', cat: 'ai', c: '#10B981', badgeText: 'PE' },
    { id: 'sk-auto', name: 'AI Automation', icon: '', cat: 'ai', c: '#F59E0B', badgeText: 'AI' },

    // Databases & CRM
    { id: 'sk-pg', name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg', cat: 'database', c: '#4169E1' },
    { id: 'sk-mysql', name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg', cat: 'database', c: '#4479A1' },
    { id: 'sk-oracle', name: 'Oracle PL/SQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/oracle/oracle-original.svg', cat: 'database', c: '#F80000' },
    { id: 'sk-mssql', name: 'SQL Server', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/microsoftsqlserver/microsoftsqlserver-plain.svg', cat: 'database', c: '#CC2927' },
    { id: 'sk-mongo', name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg', cat: 'database', c: '#47A248' },
    { id: 'sk-crm', name: 'Enterprise CRM', icon: '', cat: 'database', c: '#2563EB', badgeText: 'CRM' },

    // Design & Media
    { id: 'sk-ps', name: 'Photoshop', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/photoshop/photoshop-original.svg', cat: 'design', c: '#31A8FF' },
    { id: 'sk-ai', name: 'Illustrator', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/illustrator/illustrator-original.svg', cat: 'design', c: '#FF9A00' },
    { id: 'sk-figma', name: 'Figma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg', cat: 'design', c: '#F24E1E' },
    { id: 'sk-canva', name: 'Canva', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/canva/canva-original.svg', cat: 'design', c: '#00C4CC' },
    { id: 'sk-capcut', name: 'CapCut', icon: '', cat: 'design', c: '#0EA5E9', badgeText: 'CC' },
    { id: 'sk-filmora', name: 'Filmora', icon: '', cat: 'design', c: '#14B8A6', badgeText: 'FM' },

    // Tools, Security & Strategy
    { id: 'sk-git', name: 'Git & GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg', cat: 'tools', c: '#6366F1' },
    { id: 'sk-vscode', name: 'VS Code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg', cat: 'tools', c: '#007ACC' },
    { id: 'sk-sec', name: 'Cybersecurity', icon: '', cat: 'tools', c: '#10B981', badgeText: 'SEC' },
    { id: 'sk-seo', name: 'Technical SEO', icon: '', cat: 'tools', c: '#F59E0B', badgeText: 'SEO' },
    { id: 'sk-pm', name: 'Project Mgmt', icon: '', cat: 'tools', c: '#8B5CF6', badgeText: 'PM' },
    { id: 'sk-dm', name: 'Digital Marketing', icon: '', cat: 'tools', c: '#EC4899', badgeText: 'DM' },
  ],

  gitLanguages: [
    { name: 'JavaScript', percent: 30.71, color: '#f59e0b' },
    { name: 'CSS', percent: 27.0, color: '#3b82f6' },
    { name: 'HTML', percent: 17.02, color: '#ef4444' },
    { name: 'C#', percent: 15.17, color: '#8b5cf6' },
    { name: 'PHP', percent: 5.83, color: '#06b6d4' },
    { name: 'Java', percent: 4.28, color: '#10b981' },
  ],

  personalTraits: [
    'Hardworking',
    'Fast Learner',
    'Punctual',
    'Good Team Player',
    'Able to Work Under Pressure',
    'Firm Principles with Flexible Attitude',
  ],

  interests: [
    'Artificial Intelligence',
    'Web Development',
    'Research in AI',
    'Machine Learning',
    'New Projects & Challenges',
    'Graphics Designing',
    'Video Editing',
    'Digital Marketing',
  ],

  spokenLanguages: [
    { language: 'English', level: 'Excellent Written & Oral Competence' },
    { language: 'Bengali', level: 'Native Speaker (Written & Oral)' },
  ],

  services: [
    {
      id: 'svc-1',
      n: '01',
      title: 'Full-Stack Web Development',
      desc: 'End-to-end engineering of responsive, production-grade web platforms using React, Next.js, Node.js, Express, PHP/Laravel, and ASP.NET with clean modular architecture.',
      icon: 'fullstack',
      c: 'var(--accent)',
    },
    {
      id: 'svc-2',
      n: '02',
      title: 'AI, Gemini Live & Agentic Systems',
      desc: 'Real-time voice-streaming AI applications with Google Gemini Live & Vertex AI, autonomous OpenClaw workflow agents, Rasa NLU chatbots, and custom LLM model training.',
      icon: 'ai',
      c: 'var(--accent2)',
    },
    {
      id: 'svc-3',
      n: '03',
      title: 'WordPress Ecosystems & Plugins',
      desc: 'Bespoke corporate WordPress platforms, custom PHP plugin engineering, multi-site subnetworks, WooCommerce stores, and local/international payment gateway integrations.',
      icon: 'code',
      c: 'var(--accent3)',
    },
    {
      id: 'svc-4',
      n: '04',
      title: 'Cybersecurity & Malware Recovery',
      desc: 'Deep forensic cleanup of compromised servers—eradicating obfuscated PHP droppers, rogue admin accounts, file-manager backdoors, and SEO spam injections with full hardening.',
      icon: 'security',
      c: '#8b5cf6',
    },
    {
      id: 'svc-5',
      n: '05',
      title: 'Enterprise CRM & Database Systems',
      desc: 'Relational schema design, PL/SQL triggers & stored procedures, Zoho-class CRM workflows, and high-concurrency backends powered by PostgreSQL, Oracle, SQL Server, and MySQL.',
      icon: 'database',
      c: 'var(--accent4)',
    },
    {
      id: 'svc-6',
      n: '06',
      title: 'UI/UX Design, Media & Technical SEO',
      desc: 'Brand-aligned interface design in Figma, Photoshop, and Illustrator paired with promotional video editing, granular site auditing, analytics, and search optimization.',
      icon: 'seo',
      c: '#ec4899',
    },
  ],

  experience: [
    {
      id: 'exp-beri',
      role: 'Senior Software Engineer',
      company: 'Bangladesh Education and Research Institute (BERI)',
      url: 'https://www.beri.com.bd/',
      date: 'Mar 2022 – Present',
      location: 'Banani, Dhaka, Bangladesh',
      desc: [
        'Spearheaded full-stack web development, architecture, and continuous application maintenance across institutional digital platforms including https://www.beri.com.bd.',
        'Engineered the AI English Teaching Platform (https://aielts.com.au) integrating Google Gemini Live API, Vertex AI band-descriptor evaluation, Node.js WebSockets, and PHP backends.',
        'Directed technical content writing, programming implementations, custom analytics tools, and promotional video editing for institutional media outreach.',
      ],
      tech: ['React', 'Node.js', 'Gemini Live API', 'Vertex AI', 'WordPress', 'PHP', 'MySQL', 'Video Editing'],
    },
    {
      id: 'exp-mac',
      role: 'Web Developer (Remote)',
      company: 'MAC Technology Australia Pty Ltd.',
      url: 'https://mactechnology.com.au/',
      date: 'Nov 2022 – Present',
      location: 'Nailsworth, SA, Australia (Remote)',
      desc: [
        'Architected and maintain corporate and healthcare platforms including https://mactechnology.com.au and South Australian aged-care provider https://silversprig.com.au with OAuth2 Gmail API & Nodemailer microservices.',
        'Engineered the interconnected Hypex multi-site ecosystem across https://hypex.co.uk, https://axing.uk, and https://blog.hypex.co.uk with custom WordPress themes and PHP plugins.',
        'Executed mission-critical cybersecurity malware recoveries and server hardening for https://locusservices.com.au and https://themisfamilylawyers.com.au, plus high-level remote IT support and brand design.',
      ],
      tech: ['WordPress', 'PHP', 'Node.js', 'Gmail API', 'Cybersecurity', 'Malware Recovery', 'JavaScript', 'UI/UX'],
    },
    {
      id: 'exp-igs',
      role: 'Officer, IT',
      company: 'i - Global Services',
      date: 'Sep 2019 – Mar 2020',
      location: 'Mirpur-10, Dhaka, Bangladesh',
      desc: [
        'Managed end-to-end corporate web development, frontend UI updates, and ongoing website maintenance.',
        'Delivered responsive enterprise IT support, workstation & network troubleshooting, and infrastructure reliability.',
        'Created brand identity assets, marketing collateral, and digital graphics using Adobe Photoshop and Illustrator.',
      ],
      tech: ['Web Development', 'HTML5', 'CSS3', 'JavaScript', 'PHP', 'IT Support', 'Adobe Photoshop', 'Illustrator'],
    },
  ],

  projects: [
    {
      id: 'prj-gemini-ielts',
      title: 'AI English Teaching Platform by Gemini',
      cat: 'ai',
      desc: 'An immersive English practice application offering real-time mock tests across Reading, Writing, and Speaking modules, powered by Google Gemini Live API and Vertex AI.',
      highlights: [
        'Real-time Voice Chat: Implements WebSockets (via Node.js and a PHP proxy) to stream bidirectional audio with the Gemini Live API.',
        'Automated Assessment: Grades text and spoken simulated tasks dynamically using official language test band descriptors.',
        'Speech Integration: Full utilization of browser SpeechRecognition and SpeechSynthesis APIs to replicate live examiner interactions.',
        'Tech Stack: Node.js WebSocket proxies, asynchronous PHP backends, OAuth2 authentication, React UI, and Express endpoints.',
      ],
      tech: ['React', 'Node.js', 'WebSockets', 'Vertex AI', 'Gemini Live API', 'PHP'],
      c: '#8b5cf6',
      iconKey: 'ai-voice',
      live: 'http://aielts.com.au/',
      github: null,
    },
    {
      id: 'prj-openclaw',
      title: 'Agentic AI OpenClaw',
      cat: 'ai',
      desc: 'An advanced autonomous agent platform powered by Agentic AI and OpenClaw for zero-touch email management, dynamic calendar scheduling, and continuous workflow automation.',
      highlights: [
        'Email Automation: Autonomous reading, drafting, triaging, and managing of professional emails using context-aware AI.',
        'Calendar Management: Goal-oriented agents scheduling, rescheduling, and resolving calendar conflicts dynamically.',
        'Agentic AI Integration: Built on the OpenClaw framework to orchestrate multi-step tool-calling pipelines.',
        'Workflow Efficiency: Replaces repetitive administrative operations with continuous autonomous execution.',
      ],
      tech: ['Python', 'Agentic AI', 'OpenClaw', 'LLM Orchestration', 'Automation'],
      c: '#ec4899',
      iconKey: 'agent',
      live: null,
      github: 'https://github.com/sshihabb007/AgenticAI-OpenClaw',
    },
    {
      id: 'prj-mhs-crm',
      title: 'MHS Enterprise CRM (Zoho-Class)',
      cat: 'fullstack',
      desc: 'Full-featured enterprise Customer Relationship Management platform modeled on Zoho CRM, engineered with Next.js and PostgreSQL featuring complete sales pipelines and workflow automation.',
      highlights: [
        'Core CRM Modules: Leads, Contacts, Accounts, Deals (Kanban & stages), Tasks, Calls, Meetings, Products, Quotes, and Invoices.',
        'Workflow Engine: Rule-based triggers, field updates, automated task assignment, and conversion pipelines.',
        'Relational Architecture: Normalized PostgreSQL schema with role-based access control, audit logs, and analytics dashboards.',
      ],
      tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'Workflows'],
      c: '#2563eb',
      iconKey: 'crm',
      live: null,
      github: 'https://github.com/sshihabb007/MHS-CRM',
    },
    {
      id: 'prj-silversprig',
      title: 'SilverSprig Aged Care Platform',
      cat: 'wordpress',
      desc: 'Official web platform for SilverSprig, a registered South Australian aged care provider operating under the Aged Care Act 2024, paired with an OAuth2 Gmail API & Nodemailer microservice.',
      highlights: [
        'Accessible WordPress & Elementor Build: Warm, mobile-first architecture tailored to South Australian aged care seekers and families.',
        'Nodemailer & Gmail API Microservice: Authenticated OAuth2 Node.js email dispatch eliminating silent inquiry drops.',
        'Comprehensive Services Pathways: Structured directories covering daily living, health & wellbeing, and person-centred routines.',
      ],
      tech: ['WordPress', 'Elementor', 'Node.js', 'Nodemailer', 'Gmail API'],
      c: '#10b981',
      iconKey: 'healthcare',
      live: 'https://silversprig.com.au/',
      github: null,
      extraLinks: [{ label: 'Explore Services', url: 'https://silversprig.com.au/services/' }],
    },
    {
      id: 'prj-locus',
      title: 'Locus Services — Malware Recovery',
      cat: 'security',
      desc: 'Comprehensive WordPress customization and deep forensic cyber recovery—eradicating hidden file managers, obfuscated PHP droppers, and 19,000+ spam posts while hardening the server.',
      highlights: [
        'Removed "Tiny File Manager" Backdoors: Excised disguised remote file managers across plugins and theme directories.',
        'Eradicated Obfuscated PHP Droppers: Wiped hidden payload generators (scorpion.php, skunk.php, gorilla.php) inside uploads.',
        'Cleaned pre_get_posts Cloaking Hook: Restored WordPress Admin visibility and purged 19,000+ spam-bot posts.',
        'Database Audit & Backup Fix: Verified sole authorized admin, audited core files, and enabled native PHP zip for 143MB backups.',
      ],
      tech: ['Cybersecurity', 'Malware Forensics', 'WordPress', 'PHP', 'MySQL', 'Server Hardening'],
      c: '#ef4444',
      iconKey: 'shield',
      live: 'https://locusservices.com.au/',
      github: null,
    },
    {
      id: 'prj-themis',
      title: 'Themis Family Lawyers — Build & Security',
      cat: 'security',
      desc: 'Complete WordPress design and development for an Australian family law practice followed by critical incident response removing rogue admin accounts and backend malware.',
      highlights: [
        'Complete Law Firm Platform: Responsive, authoritative web presence tailored for family law clients.',
        'Rogue Admin Eradication: Audited MySQL user/capabilities tables to eliminate unauthorized administrator accounts.',
        'Backend Malware Cleanup & Hardening: Stripped injected PHP backdoors and enforced strict file/login security controls.',
      ],
      tech: ['WordPress', 'Cybersecurity', 'Malware Recovery', 'PHP', 'Security Hardening'],
      c: '#f59e0b',
      iconKey: 'shield-law',
      live: 'https://themisfamilylawyers.com.au/',
      github: null,
    },
    {
      id: 'prj-hypex',
      title: 'Hypex Web Platform & Subnetworks',
      cat: 'wordpress',
      desc: 'Interconnected multi-site WordPress ecosystem engineered for Hypex UK, spanning the primary corporate platform, custom PHP plugins, Axing UK, and the Hypex Blog.',
      highlights: [
        'Bespoke Theme Conversion: Custom-styled WordPress theme maintaining cohesive brand identity across domains.',
        'Custom Plugin Engineering: Programmed bespoke PHP plugins and core hooks for specialized platform capabilities.',
        'Multi-Domain Subnetwork: Deployed and synchronized Axing UK and Hypex Blog alongside the flagship site.',
      ],
      tech: ['WordPress', 'PHP', 'Plugin Development', 'Custom Themes', 'Multi-Site'],
      c: '#0ea5e9',
      iconKey: 'network',
      live: 'https://hypex.co.uk/',
      github: null,
      extraLinks: [
        { label: 'Axing UK', url: 'https://axing.uk/' },
        { label: 'Hypex Blog', url: 'https://blog.hypex.co.uk/' },
      ],
    },
    {
      id: 'prj-beri',
      title: 'BERI Bangladesh Official Platform',
      cat: 'wordpress',
      desc: 'Official institutional web architecture for Bangladesh Education and Research Institute (BERI), scaling academic initiatives, research programs, and corporate branding.',
      highlights: [
        'Complete CMS Architecture: Bespoke theme deployment, systematic page hierarchies, and multi-device responsiveness.',
        'Institutional Branding: Custom visual assets and interactive frontend sections aligned with BERI guidelines.',
        'Enterprise Reliability: Hardened PHP backend infrastructure optimized for fast rendering and inquiry routing.',
      ],
      tech: ['WordPress', 'PHP', 'Web Design', 'CSS3', 'JavaScript'],
      c: '#3b82f6',
      iconKey: 'institute',
      live: 'https://www.beri.com.bd/',
      github: null,
    },
    {
      id: 'prj-mac',
      title: 'MAC Technology Australia',
      cat: 'wordpress',
      desc: 'Official corporate website for MAC Technology Australia showcasing managed IT services, technology consulting solutions, and software product lines.',
      highlights: [
        'Corporate WordPress Architecture: Structured service catalogs, responsive layouts, and clean conversion funnels.',
        'Brand UI Engineering: Custom CSS and visual components reflecting Australian enterprise IT positioning.',
        'Performance & Form Security: Tuned PHP infrastructure for rapid load speeds and protected client inquiries.',
      ],
      tech: ['WordPress', 'PHP', 'Web Design', 'Responsive UI', 'SEO'],
      c: '#06b6d4',
      iconKey: 'corporate',
      live: 'https://mactechnology.com.au/',
      github: null,
    },
    {
      id: 'prj-mhs-idm',
      title: 'MHS Download Manager',
      cat: 'desktop',
      desc: 'High-speed multi-threaded desktop and browser-integrated download accelerator featuring dynamic segment splitting, pause/resume recovery, queue scheduling, and media stream capture.',
      highlights: [
        'Multi-Connection Acceleration: Splits files into concurrent HTTP byte-range streams for maximum bandwidth utilization.',
        'Resilient Resume Engine: Checkpoints partial segments on disk to recover interrupted transfers seamlessly.',
        'Smart Categorization & Queueing: Organizes archives, video, audio, and documents with bandwidth throttling.',
      ],
      tech: ['Python', 'Desktop App', 'Multi-Threading', 'HTTP Streams', 'Browser Integration'],
      c: '#14b8a6',
      iconKey: 'download',
      live: null,
      github: 'https://github.com/sshihabb007/MHS-DOWNLOAD-MANAGER',
    },
    {
      id: 'prj-mern-shop',
      title: 'MERN E-Commerce Website',
      cat: 'fullstack',
      desc: 'Comprehensive full-stack e-commerce platform built natively on MongoDB, Express, React, and Node.js with zero-reload catalog filtering and RESTful inventory APIs.',
      highlights: [
        'End-to-End MERN Stack: Decoupled React SPA communicating with secure Express/Node.js REST endpoints.',
        'Reactive Cart & Routing: Client-side state management tracking cart logistics across brand and category filters.',
        'Optimized MongoDB Schemas: Indexed product documents supporting fast multi-attribute queries.',
      ],
      tech: ['MongoDB', 'Express', 'React', 'Node.js', 'REST API'],
      c: '#10b981',
      iconKey: 'cart',
      live: null,
      github: 'https://github.com/sshihabb007/MERN-WEBSITE-E-COMMERCE',
    },
    {
      id: 'prj-laravel-shop',
      title: 'Modern Online Device Shop',
      cat: 'fullstack',
      desc: 'Modernized electronics e-commerce storefront engineered on Laravel MVC with secure authentication, database migrations/seeders, and responsive Tailwind/Blade interfaces.',
      highlights: [
        'Laravel MVC Architecture: Clean separation of controllers, Eloquent models, middleware, and Blade views.',
        'Role-Protected Auth: Guarded customer checkout and administrative inventory management routes.',
        'Structured Migrations: Reproducible MySQL schemas for devices, categories, orders, and users.',
      ],
      tech: ['Laravel', 'PHP', 'MySQL', 'Tailwind CSS', 'MVC'],
      c: '#ef4444',
      iconKey: 'devices',
      live: null,
      github: 'https://github.com/sshihabb007/MODERN-ONLINE-DEVICE-SHOP',
    },
    {
      id: 'prj-react-phone',
      title: 'ReactJs Online SmartPhone Shop',
      cat: 'fullstack',
      desc: 'Modular smartphone e-commerce storefront built natively in React.js delivering rapid Virtual DOM product filtering and real-time cart state management.',
      highlights: [
        'Component-Driven Catalog: Reusable product cards, detail views, and interactive cart drawers.',
        'Real-Time Cart State: Seamless item quantity, subtotal, and Persistent navigation updates.',
        'Zero-Reload Filtering: Instant smartphone search and brand sorting across mobile and desktop viewports.',
      ],
      tech: ['React', 'JavaScript', 'CSS3', 'SPA'],
      c: '#0ea5e9',
      iconKey: 'smartphone',
      live: null,
      github: 'https://github.com/sshihabb007/ReactJs---Online-SmartPhone-Shop',
    },
    {
      id: 'prj-wai-rasa',
      title: 'WAI APAC Awards Rasa Chatbot',
      cat: 'ai',
      desc: 'Conversational AI assistant built with Python, Rasa NLU, and TensorFlow to guide applicants through the Women in AI (WAI) APAC Awards 2023.',
      highlights: [
        'Rich Intent Coverage: Handles deadlines, eligibility, judging criteria, fees, and regional APAC rules.',
        'Custom NLU Pipeline: Combines CountVectorsFeaturizer, DIETClassifier, and FallbackClassifier.',
        'Dialogue Policies: Orchestrated via TEDPolicy, MemoizationPolicy, and RulePolicy on TensorFlow & Scikit-Learn.',
      ],
      tech: ['Python', 'Rasa', 'TensorFlow', 'Scikit-Learn', 'NLP'],
      c: '#f97316',
      iconKey: 'bot',
      live: null,
      github: 'https://github.com/sshihabb007/AI-CHATBOT-PROJECT',
    },
    {
      id: 'prj-aiub-forum',
      title: 'AIUB Online Forum',
      cat: 'fullstack',
      desc: 'Social community and academic discussion platform built with ASP.NET and SQL Server enabling students to publish posts, like, comment, and report content.',
      highlights: [
        'Role-Based Authentication: Secure registration, session management, and member profiles.',
        'Threaded Social Interactions: Real-time likes, nested discussions, and user content reporting.',
        'SQL Server & Admin Moderation: Normalized relational backend with administrative content governance.',
      ],
      tech: ['ASP.NET', 'C#', 'SQL Server', 'HTML5', 'CSS3'],
      c: '#6366f1',
      iconKey: 'forum',
      live: null,
      github: 'https://github.com/sshihabb007/AIUB-Online-Forum-ASP.NET-',
    },
    {
      id: 'prj-php-phone',
      title: 'Online Smartphone Shop (PHP & AJAX)',
      cat: 'fullstack',
      desc: 'Dynamic e-commerce marketplace powered by PHP, MySQL, AJAX, and jQuery with asynchronous catalog filtering, secure order processing, and full admin inventory control.',
      highlights: [
        'AJAX Product Filtering: Smooth asynchronous catalog updates without full page reloads.',
        'Interactive jQuery Cart: Dynamic cart updates and checkout validation.',
        'Admin Inventory Suite: Complete CRUD dashboard for smartphones, pricing, orders, and customers.',
      ],
      tech: ['PHP', 'JavaScript', 'AJAX', 'jQuery', 'MySQL'],
      c: '#8b5cf6',
      iconKey: 'smartphone',
      live: null,
      github: 'https://github.com/sshihabb007/Online-Smartphone-Shop-PhP-JAVASCRIPT-AJAX-Jquery-CSS-',
    },
    {
      id: 'prj-hospital',
      title: 'Hospital Management System',
      cat: 'desktop',
      desc: 'Enterprise C# desktop hospital suite deeply integrated with Oracle 10g Database using custom PL/SQL triggers, stored procedures, and concurrent billing workflows.',
      highlights: [
        'Oracle PL/SQL Engine: Custom triggers, stored procedures, and functions enforcing clinical data integrity.',
        'Patient Lifecycle Tracking: Admission, ward allocation, medical history, and discharge management.',
        'Interactive Billing: Automated calculation of consultations, diagnostics, and room charges under concurrency.',
      ],
      tech: ['C#', 'Oracle 10g', 'PL/SQL', 'Windows Forms', 'Database'],
      c: '#ef4444',
      iconKey: 'hospital',
      live: null,
      github: 'https://github.com/sshihabb007/Hospital-Management-System-by-Oracle-10G-and-PLSQL',
    },
    {
      id: 'prj-inventory',
      title: 'Inventory Management System',
      cat: 'desktop',
      desc: 'Localized C# Windows Forms desktop application streamlining daily goods transactions, supplier registries, real-time stock monitoring, and margin reporting.',
      highlights: [
        'Intuitive WinForms UI: Fast keyboard-friendly desktop workflows for retail and warehouse operators.',
        'Live Stock Alerts: Real-time inventory deductions, restocking thresholds, and supplier ledgers.',
        'Automated Sales Reports: Generates periodic revenue and profit-margin summaries.',
      ],
      tech: ['C#', '.NET', 'Windows Forms', 'SQL'],
      c: '#7c3aed',
      iconKey: 'box',
      live: null,
      github: 'https://github.com/sshihabb007/Inventory_Management_System_C-',
    },
    {
      id: 'prj-smartbook',
      title: 'SHIHAB-SmartBook',
      cat: 'desktop',
      desc: 'Core Java desktop directory and contact register application demonstrating clean MVC architecture, Java Swing GUI design, and persistent file I/O.',
      highlights: [
        'Persistent File I/O: Structured local storage engine reading and writing directory datasets.',
        'Search & Sort Algorithms: Fast array manipulation across address and telephone records.',
        'Java Swing MVC: Clean separation between domain models, controllers, and Swing views.',
      ],
      tech: ['Java', 'Java Swing', 'OOP', 'MVC', 'File I/O'],
      c: '#f59e0b',
      iconKey: 'book',
      live: null,
      github: 'https://github.com/sshihabb007/SHIHAB-SmartBook',
    },
    {
      id: 'prj-aiub-grading',
      title: 'AIUB Grading System',
      cat: 'desktop',
      desc: 'High-efficiency C++ academic grading engine utilizing dynamic heap structures and precision floating-point algorithms to compute university-scale CGPA transcripts.',
      highlights: [
        'Dynamic Struct & Class Models: Allocates student course profiles dynamically at runtime.',
        'Precision CGPA Math: Implements AIUB letter-grade thresholds and weighted credit-hour conversions.',
        'Optimized Memory Footprint: Pure C++ implementation with clean heap lifecycle management.',
      ],
      tech: ['C++', 'Data Structures', 'Algorithms', 'OOP'],
      c: '#0284c7',
      iconKey: 'graduation',
      live: null,
      github: 'https://github.com/sshihabb007/AIUB-Grading-System-C-',
    },
    {
      id: 'prj-aspnet-demo',
      title: 'ASP.NET Projects & UI Architecture',
      cat: 'fullstack',
      desc: 'Modular repository of C# controllers, session management patterns, and decoupled HTML UI mappings built for rapid ASP.NET full-stack prototyping.',
      highlights: [
        'Decoupled C# Controllers: Clean session state and request routing patterns avoiding tight coupling.',
        'Modular HTML Templates: Reusable layout structures accelerating enterprise ASP.NET deployments.',
      ],
      tech: ['ASP.NET', 'C#', 'HTML5', 'CSS3'],
      c: '#6366f1',
      iconKey: 'code',
      live: null,
      github: 'https://github.com/sshihabb007/ASP.NET-projects-HTML-demo',
    },
    {
      id: 'prj-budget-care',
      title: 'Budget Shop & Care Connects',
      cat: 'wordpress',
      desc: 'Production WordPress e-commerce and service portals featuring custom Bootstrap themes, tailored PHP plugins, and Bangladeshi payment gateways (bKash, Rocket, Bank Transfer).',
      highlights: [
        'Local Payment Gateways: Real-time checkout handling for bKash, Rocket, and direct bank transfers.',
        'Custom Bootstrap Themes: Mobile-responsive storefronts tuned for high-concurrency traffic.',
        'Tailored PHP Plugins: Extended WordPress commerce workflows with custom order verification.',
      ],
      tech: ['WordPress', 'PHP', 'Bootstrap', 'bKash / Rocket', 'WooCommerce'],
      c: '#ec4899',
      iconKey: 'cart',
      live: null,
      github: 'https://github.com/sshihabb007',
    },
    {
      id: 'prj-pricevisible',
      title: 'Pricevisible',
      cat: 'fullstack',
      desc: 'PHP-based web application engineered for transparent product pricing visibility, structured catalog comparison, and clean server-side rendering.',
      highlights: [
        'Server-Side PHP Engine: Lightweight, fast-rendering catalog and price lookup architecture.',
        'Structured Data Presentation: Clear comparison layouts optimized for shopper decision-making.',
      ],
      tech: ['PHP', 'MySQL', 'HTML5', 'CSS3', 'JavaScript'],
      c: '#db2777',
      iconKey: 'tag',
      live: null,
      github: 'https://github.com/sshihabb007/Pricevisible',
    },
    {
      id: 'prj-site-auditor',
      title: 'Shihab Site Auditor Pro',
      cat: 'tools',
      desc: 'Client-side Technical SEO and web page auditing suite inspecting heading hierarchies, keyword density, metadata completeness, and actionable optimization scores.',
      highlights: [
        'Deep DOM Inspection: Evaluates H1–H6 structure, meta tags, canonical links, alt attributes, and keyword density.',
        'Actionable SEO Reports: Generates prioritized checklists for immediate on-page ranking improvements.',
        'Zero-Database Privacy: Executes 100% in pure JavaScript without storing audited URLs externally.',
      ],
      tech: ['JavaScript', 'Technical SEO', 'DOM API', 'HTML5', 'CSS3'],
      c: '#10b981',
      iconKey: 'audit',
      live: null,
      github: 'https://github.com/sshihabb007/Shihab-Site-Auditor-pro',
    },
    {
      id: 'prj-site-analytics',
      title: 'SITE-ANALYTICS-BY-SHIHAB',
      cat: 'tools',
      desc: 'Zero-overhead self-hosted web analytics engine written in pure PHP and normalized MySQL for visitor geolocation, session tracking, and unique impression metrics.',
      highlights: [
        'IP & Geo Metadata: Resolves visitor regions and referrer sources with minimal request latency.',
        'Unique Session Estimation: Accurately separates unique visitors from repeat pageviews.',
        'Normalized MySQL Storage: Compact relational tables built for high-write traffic.',
      ],
      tech: ['PHP', 'MySQL', 'Analytics', 'JavaScript'],
      c: '#06b6d4',
      iconKey: 'chart',
      live: null,
      github: 'https://github.com/sshihabb007/SITE-ANALYTICS-BY-SHIHAB',
    },
    {
      id: 'prj-gphotos-npm',
      title: 'google-photos-album-url-fetch',
      cat: 'tools',
      desc: 'Node.js & Puppeteer utility package published for programmatically extracting high-resolution CDN image URLs from shared Google Photos albums.',
      highlights: [
        'Headless Browser Extraction: Automates unauthenticated album traversal via Puppeteer.',
        'High-Res CDN Resolution: Parses direct image URIs ready for galleries and static site generators.',
        'Semantic NPM Packaging: Structured CLI/module interface with clean versioned releases.',
      ],
      tech: ['Node.js', 'NPM Package', 'Puppeteer', 'JavaScript'],
      c: '#22c55e',
      iconKey: 'photo',
      live: null,
      github: 'https://github.com/sshihabb007/google-photos-album-image-url-fetch',
    },
    {
      id: 'prj-pc-power',
      title: 'PC Power & Electric Bill Calculator',
      cat: 'tools',
      desc: 'Interactive hardware TDP wattage estimator and residential electricity consumption calculator hosted as a responsive Progressive Web App.',
      highlights: [
        'Real-Time Wattage Matrix: Instantaneous PSU load updates across CPU, GPU, RAM, and storage selections.',
        'Hardware TDP Database: Curated energy ratings across hundreds of desktop components.',
        'Live Bundled Tool: Available directly inside this portfolio to launch and test interactively.',
      ],
      tech: ['JavaScript', 'HTML5', 'CSS3', 'PWA'],
      c: '#eab308',
      iconKey: 'bolt',
      live: '/power-calculator/index.html',
      github: 'https://github.com/sshihabb007/PC-Power-Calculator',
    },
    {
      id: 'prj-tax-calc',
      title: 'Multi-Tier Income Tax Calculator',
      cat: 'tools',
      desc: 'Precision financial web application mapping multi-slab marginal tax brackets, rebates, and exemptions into instant liability breakdowns.',
      highlights: [
        'Tiered Slab Engine: Computes progressive marginal tax liabilities accurately across income brackets.',
        'Strict Input Validation: Prevents malformed entries prior to financial computation.',
        'Live Bundled Tool: Hosted directly inside this portfolio for instant interactive calculation.',
      ],
      tech: ['JavaScript', 'HTML5', 'CSS3', 'Finance'],
      c: '#3b82f6',
      iconKey: 'calculator',
      live: '/tax-calculator/index.html',
      github: 'https://github.com/sshihabb007/TAX-Calculator',
    },
  ],

  tools: [
    {
      id: 'tool-adv-calc',
      title: 'Advanced Scientific Calculator',
      category: 'calculators',
      categoryLabel: 'Scientific & Math',
      subtitle: 'Interactive Web App · Expression History & Trigonometry',
      desc: 'Full-featured scientific calculator supporting trigonometric, logarithmic, factorial, power, memory registers, and keyboard-driven expression evaluation.',
      url: '/advanced-calculator/index.html',
      accent: '#2563eb',
      tags: ['JavaScript', 'Math Engine', 'Keyboard Shortcuts'],
    },
    {
      id: 'tool-audio-text',
      title: 'Audio to Text AI Transcriber',
      category: 'ai_media',
      categoryLabel: 'AI & Media Suite',
      subtitle: 'Speech Recognition · Live Dictation & Export',
      desc: 'Browser-native real-time speech-to-text transcription studio with multi-language dictation, live waveform feedback, copy, and transcript download.',
      url: '/audio-to-text/index.html',
      accent: '#8b5cf6',
      tags: ['Web Speech API', 'AI Dictation', 'Real-Time'],
    },
    {
      id: 'tool-compressor',
      title: 'Image & Audio Converter / Compressor',
      category: 'ai_media',
      categoryLabel: 'AI & Media Suite',
      subtitle: 'Client-Side Media Processing · Zero Server Upload',
      desc: 'Privacy-first in-browser media studio to compress, resize, and convert images and audio files locally with instant before/after size metrics.',
      url: '/compressor/index.html',
      accent: '#ec4899',
      tags: ['Canvas & WebAudio', 'Compression', '100% Local'],
    },
    {
      id: 'tool-universal-dl',
      title: 'Universal Video & Audio Downloader UI',
      category: 'ai_media',
      categoryLabel: 'AI & Media Suite',
      subtitle: 'Multi-Platform Stream Inspector & Format Selector',
      desc: 'Streamlined media extraction interface supporting URL parsing, quality/bitrate selection, and audio/video format workflows.',
      url: '/universal-downloader/index.html',
      accent: '#f43f5e',
      tags: ['Media Streams', 'Format Parser', 'Web Utility'],
    },
    {
      id: 'tool-tax',
      title: 'Bangladesh Income Tax Calculator',
      category: 'finance_utility',
      categoryLabel: 'Finance & Utility',
      subtitle: 'Multi-Tier Slab Breakdown & Investment Rebates',
      desc: 'Calculates progressive income tax slabs, tax-free thresholds, allowable exemptions, and net payable tax with clear visual summaries.',
      url: '/tax-calculator/index.html',
      accent: '#10b981',
      tags: ['Tax Slabs', 'Financial Tool', 'Instant Breakdown'],
    },
    {
      id: 'tool-currency',
      title: 'Real-Time Currency Converter',
      category: 'finance_utility',
      categoryLabel: 'Finance & Utility',
      subtitle: 'Global FX Rates · Instant Multi-Currency Swap',
      desc: 'Fast foreign-exchange converter featuring live exchange rate lookups, instant base/target currency swap, and clean precision formatting.',
      url: '/currency-converter/index.html',
      accent: '#06b6d4',
      tags: ['FX API', 'Finance', 'Multi-Currency'],
    },
    {
      id: 'tool-power',
      title: 'Electric Bill & PC Power Calculator',
      category: 'calculators',
      categoryLabel: 'Scientific & Math',
      subtitle: 'Appliance kWh Costing & Hardware TDP Estimator',
      desc: 'Computes monthly kWh electricity consumption, tariff bills, and desktop PC component wattage requirements in real time.',
      url: '/power-calculator/index.html',
      accent: '#f59e0b',
      tags: ['Energy & TDP', 'Tariff Slabs', 'PWA'],
    },
    {
      id: 'tool-land',
      title: 'BD Land Measurement Calculator',
      category: 'calculators',
      categoryLabel: 'Scientific & Math',
      subtitle: 'Decimal, Katha, Bigha, Acre & Sq.Ft Converter',
      desc: 'Precision land area survey calculator converting seamlessly between square feet, square meters, Decimal (Shotok), Katha, Bigha, and Acres.',
      url: '/land-calculator/index.html',
      accent: '#16a34a',
      tags: ['Land Survey', 'BD Units', 'Area Geometry'],
    },
    {
      id: 'tool-qr',
      title: 'QR Code Generator Pro',
      category: 'finance_utility',
      categoryLabel: 'Finance & Utility',
      subtitle: 'Custom Colors, Sizes & High-Res PNG Export',
      desc: 'Generates scannable QR codes for URLs, Wi-Fi credentials, vCards, and plain text with customizable foreground/background palettes and instant download.',
      url: '/qr-generator/index.html',
      accent: '#6366f1',
      tags: ['QR Matrix', 'PNG Download', 'Custom Styling'],
    },
    {
      id: 'tool-bmi',
      title: 'BMI & Health Metrics Calculator',
      category: 'calculators',
      categoryLabel: 'Scientific & Math',
      subtitle: 'Metric & Imperial Units · WHO Category Gauge',
      desc: 'Evaluates Body Mass Index across cm/kg and ft-in/lb inputs with healthy weight range guidance and instant category classification.',
      url: '/bmi-calculator/index.html',
      accent: '#0ea5e9',
      tags: ['Health Metrics', 'Metric / Imperial', 'Interactive UI'],
    },
    {
      id: 'tool-age',
      title: 'Age Calculator Pro',
      category: 'calculators',
      categoryLabel: 'Scientific & Math',
      subtitle: 'Exact Years, Months, Days & Next Birthday Countdown',
      desc: 'Computes exact chronological age down to days, total weeks/hours lived, and a live countdown to your upcoming birthday.',
      url: '/age-calculator/index.html',
      accent: '#a855f7',
      tags: ['Date Math', 'Countdown', 'Calendar Utility'],
    },
  ],

  certifications: [
    {
      id: 'cert-gemini-edu',
      title: 'Gemini Certified Educator',
      org: 'Google for Education',
      date: 'Verified Credential · Generative AI & Gemini',
      desc: 'Validates specialized expertise in integrating Google Gemini generative AI across educational environments, covering intelligent instructional design, content generation, and ethical AI-assisted pedagogy.',
      tags: ['GEMINI AI', 'PROMPT CRAFTING', 'GENERATIVE AI'],
      c: '#8b5cf6',
      iconType: 'gemini',
      verifyUrl: 'https://edu.google.accredible.com/profile/mehedihasanshihab922213/wallet',
    },
    {
      id: 'cert-gemini-fac',
      title: 'Gemini Certified Faculty',
      org: 'Google for Education',
      date: 'Verified Credential · Higher Ed & Research',
      desc: 'Recognizes professional competency in applying Gemini AI for higher education curriculum planning, academic research acceleration, instructional design, and responsible AI implementation.',
      tags: ['HIGHER ED', 'ACADEMIC RESEARCH', 'ETHICAL AI'],
      c: '#f59e0b',
      iconType: 'faculty',
      verifyUrl: 'https://edu.google.accredible.com/profile/mehedihasanshihab922213/wallet',
    },
    {
      id: 'cert-gemini-stu',
      title: 'Gemini Certified University Student',
      org: 'Google for Education',
      date: 'Verified Credential · Multimodal AI & Learning',
      desc: 'Validates foundational mastery of Gemini multimodal reasoning, active AI-augmented study workflows, analytical synthesis, and digital research techniques.',
      tags: ['MULTIMODAL AI', 'ACTIVE LEARNING', 'AI RESEARCH'],
      c: '#10b981',
      iconType: 'student',
      verifyUrl: 'https://edu.google.accredible.com/profile/mehedihasanshihab922213/wallet',
    },
    {
      id: 'cert-gce-l2',
      title: 'Google Certified Educator Level 2',
      org: 'Google for Education',
      date: 'Advanced Certified · Accredible Verified',
      desc: 'Certifies advanced mastery in integrating transformative educational technologies, designing customized digital curricula, and optimizing collaborative academic workflows across institutional environments.',
      tags: ['ADVANCED EDTECH', 'CURRICULUM DESIGN', 'COLLABORATION'],
      c: '#2563eb',
      iconType: 'google',
      verifyUrl: 'https://edu.google.accredible.com/profile/mehedihasanshihab922213/wallet',
    },
    {
      id: 'cert-gce-l1',
      title: 'Google Certified Educator Level 1',
      org: 'Google for Education',
      date: 'Verified Credential · Accredible Verified',
      desc: 'Demonstrates fundamental pedagogical proficiency in leveraging Google Workspace for Education and digital learning tools to enrich teaching, streamline collaboration, and enhance learning outcomes.',
      tags: ['GOOGLE WORKSPACE', 'EDTECH', 'PEDAGOGY'],
      c: '#0ea5e9',
      iconType: 'google',
      verifyUrl: 'https://edu.google.accredible.com/profile/mehedihasanshihab922213/wallet',
    },
  ],

  contact: {
    email: 'sshihabb007@gmail.com',
    phone: '+8801521213853',
    whatsapp: '+880 1521-213853',
    location: 'Gazipur-1704 / Banani, Dhaka, Bangladesh',
    linkedinUrl: 'https://www.linkedin.com/in/mehedi-hasan-shihab',
    githubUrl: 'https://github.com/sshihabb007',
    facebookUrl: 'https://www.facebook.com/sshihabb007/',
    walletUrl: 'https://edu.google.accredible.com/profile/mehedihasanshihab922213/wallet',
    references: [
      {
        id: 'ref-tabin',
        name: 'Dr. Khandaker Tabin Hasan',
        role: 'Professor & Head of Graduate Program, CS & Dept. of MIS',
        dept: 'Faculty of Science and Technology',
        institution: 'American International University-Bangladesh (AIUB)',
        email: 'tabin@aiub.edu',
      },
      {
        id: 'ref-hasan',
        name: 'Dr. S. M. Hasan Mahmud',
        role: 'Assistant Professor',
        dept: 'Faculty of Science and Technology',
        institution: 'American International University-Bangladesh (AIUB) / DIU',
        email: 'hasan.swe@aiub.edu',
      },
    ],
  },
};

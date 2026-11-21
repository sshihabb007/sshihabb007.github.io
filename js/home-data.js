/* ==========================================================================
   Mehedi Hasan Shihab — Homepage Structured Catalog Data (shihabCV v6)
   Contains full Technical Skills (44), All 31 Projects (including latest v5
   flagship releases), and All 11 Bundled Interactive Web Tools.
   ========================================================================== */
(function () {
  window.SHIHAB_HOME_DATA = {
    skillTabs: [
      { key: 'all', label: 'All' },
      { key: 'programming', label: 'Programming', color: '#3B82F6' },
      { key: 'web', label: 'Web & Full-Stack', color: '#10B981' },
      { key: 'ai', label: 'AI & Agents', color: '#A855F7' },
      { key: 'database', label: 'Databases & CRM', color: '#F59E0B' },
      { key: 'design', label: 'Design & Media', color: '#0EA5E9' },
      { key: 'tools', label: 'Tools & Security', color: '#EC4899' }
    ],

    skills: [
      // Programming
      { id: 'sk-js', name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/javascript/javascript-original.svg', cat: 'programming', c: '#F59E0B' },
      { id: 'sk-ts', name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/typescript/typescript-original.svg', cat: 'programming', c: '#3B82F6' },
      { id: 'sk-py', name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/python/python-original.svg', cat: 'programming', c: '#3776AB' },
      { id: 'sk-cs', name: 'C# (.NET)', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/csharp/csharp-original.svg', cat: 'programming', c: '#A855F7' },
      { id: 'sk-php', name: 'PHP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/php/php-original.svg', cat: 'programming', c: '#777BB4' },
      { id: 'sk-java', name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/java/java-original.svg', cat: 'programming', c: '#ED8B00' },
      { id: 'sk-cpp', name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/cplusplus/cplusplus-original.svg', cat: 'programming', c: '#00599C' },
      { id: 'sk-c', name: 'C', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/c/c-original.svg', cat: 'programming', c: '#64748B' },
      // Web & Full-Stack
      { id: 'sk-react', name: 'React.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/react/react-original.svg', cat: 'web', c: '#0EA5E9' },
      { id: 'sk-next', name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/nextjs/nextjs-original.svg', cat: 'web', c: '#3B82F6', invertDark: true },
      { id: 'sk-node', name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/nodejs/nodejs-original.svg', cat: 'web', c: '#10B981' },
      { id: 'sk-wp', name: 'WordPress', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/wordpress/wordpress-plain.svg', cat: 'web', c: '#21759B', invertDark: true },
      { id: 'sk-laravel', name: 'Laravel', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/laravel/laravel-original.svg', cat: 'web', c: '#EF4444' },
      { id: 'sk-aspnet', name: 'ASP.NET', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/dotnetcore/dotnetcore-original.svg', cat: 'web', c: '#A855F7' },
      { id: 'sk-html', name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/html5/html5-original.svg', cat: 'web', c: '#E34F26' },
      { id: 'sk-css', name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/css3/css3-original.svg', cat: 'web', c: '#1572B6' },
      { id: 'sk-tw', name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/tailwindcss/tailwindcss-original.svg', cat: 'web', c: '#06B6D4' },
      { id: 'sk-bs', name: 'Bootstrap', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/bootstrap/bootstrap-original.svg', cat: 'web', c: '#7952B3' },
      { id: 'sk-jq', name: 'AJAX & jQuery', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/jquery/jquery-original.svg', cat: 'web', c: '#0769AD' },
      // AI & Agents
      { id: 'sk-gemini', name: 'Gemini Live API', icon: 'asset/gemini-sparkle.svg', cat: 'ai', c: '#A855F7' },
      { id: 'sk-vertex', name: 'Google Vertex AI', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/googlecloud/googlecloud-original.svg', cat: 'ai', c: '#3B82F6' },
      { id: 'sk-openclaw', name: 'OpenClaw Agents', icon: '', cat: 'ai', c: '#EC4899', badgeText: 'OC' },
      { id: 'sk-rasa', name: 'Rasa NLU', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/tensorflow/tensorflow-original.svg', cat: 'ai', c: '#F59E0B' },
      { id: 'sk-llm', name: 'LLM Training', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/pytorch/pytorch-original.svg', cat: 'ai', c: '#EF4444', badgeText: 'LLM' },
      { id: 'sk-prompt', name: 'Prompt Crafting', icon: '', cat: 'ai', c: '#10B981', badgeText: 'PE' },
      { id: 'sk-auto', name: 'AI Automation', icon: '', cat: 'ai', c: '#F59E0B', badgeText: 'AI' },
      // Databases & CRM
      { id: 'sk-pg', name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/postgresql/postgresql-original.svg', cat: 'database', c: '#3B82F6' },
      { id: 'sk-mysql', name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/mysql/mysql-original.svg', cat: 'database', c: '#4479A1' },
      { id: 'sk-oracle', name: 'Oracle PL/SQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/oracle/oracle-original.svg', cat: 'database', c: '#EF4444' },
      { id: 'sk-mssql', name: 'SQL Server', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/microsoftsqlserver/microsoftsqlserver-plain.svg', cat: 'database', c: '#CC2927' },
      { id: 'sk-mongo', name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/mongodb/mongodb-original.svg', cat: 'database', c: '#10B981' },
      { id: 'sk-crm', name: 'Enterprise CRM', icon: '', cat: 'database', c: '#3B82F6', badgeText: 'CRM' },
      // Design & Media
      { id: 'sk-ps', name: 'Photoshop', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/photoshop/photoshop-original.svg', cat: 'design', c: '#0EA5E9' },
      { id: 'sk-ai', name: 'Illustrator', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/illustrator/illustrator-original.svg', cat: 'design', c: '#F59E0B' },
      { id: 'sk-figma', name: 'Figma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/figma/figma-original.svg', cat: 'design', c: '#EC4899' },
      { id: 'sk-canva', name: 'Canva', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/canva/canva-original.svg', cat: 'design', c: '#06B6D4' },
      { id: 'sk-capcut', name: 'CapCut', icon: '', cat: 'design', c: '#0EA5E9', badgeText: 'CC' },
      { id: 'sk-filmora', name: 'Filmora', icon: '', cat: 'design', c: '#10B981', badgeText: 'FM' },
      // Tools & Security
      { id: 'sk-git', name: 'Git & GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/github/github-original.svg', cat: 'tools', c: '#A855F7', invertDark: true },
      { id: 'sk-vscode', name: 'VS Code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/vscode/vscode-original.svg', cat: 'tools', c: '#3B82F6' },
      { id: 'sk-sec', name: 'Cybersecurity', icon: '', cat: 'tools', c: '#10B981', badgeText: 'SEC' },
      { id: 'sk-seo', name: 'Technical SEO', icon: '', cat: 'tools', c: '#F59E0B', badgeText: 'SEO' },
      { id: 'sk-pm', name: 'Project Mgmt', icon: '', cat: 'tools', c: '#A855F7', badgeText: 'PM' },
      { id: 'sk-dm', name: 'Digital Marketing', icon: '', cat: 'tools', c: '#EC4899', badgeText: 'DM' }
    ],

    projectTabs: [
      { key: 'all', label: 'All' },
      { key: 'desktop', label: 'Desktop & Systems' },
      { key: 'ai', label: 'AI & Agents' },
      { key: 'fullstack', label: 'Full-Stack & CRM' },
      { key: 'wordpress', label: 'WordPress' },
      { key: 'security', label: 'Cybersecurity' },
      { key: 'tools', label: 'Tools & SEO' }
    ],

    projectCatLabels: {
      desktop: 'Desktop & Core Systems',
      ai: 'AI & Autonomous Agents',
      fullstack: 'Full-Stack & Enterprise Web',
      wordpress: 'WordPress Ecosystem',
      security: 'Cybersecurity & Forensics',
      tools: 'Web Tools & Analytics'
    },

    projects: [
      {
        id: 'prj-mhs-idm',
        title: 'MHS Download Manager (v1.0.7)',
        cat: 'desktop',
        flagship: true,
        desc: 'Clean-room Windows x64 download accelerator and 14-browser Manifest V3 extension suite featuring a 1–128 sparse NTFS segment engine, pure C# lossless MP4/WebM/MKV muxer, BitTorrent/Debrid, DoH/VPN kill-switch, LAN QR dashboard, CLI, and 15-tool MCP server.',
        highlights: [
          '1–128 Sparse Dynamic Segment Engine: Pre-allocates unified NTFS sparse .mhs.part files with 4096-byte aligned dynamic halving, TTFB stall preemption, ETag + 64-byte resume overlap check, FTP/FTPS, and CRC32/SHA-512 checksums.',
          '14-Browser Capture & Pure C# Lossless Muxer: Auto-registers Native Messaging across 9 Chromium and 5 Firefox browsers with outside-corner Download Video pill, Stream Sniffer, InnerTube HD/4K resolver, and built-in MP4/WebM/MKV muxing.',
          'BitTorrent, Media Suite & Debrid Cloud: Full BitTorrent/Magnet client (BEP-3/9/10/15/19), managed yt-dlp/gallery-dl helpers, Real-Debrid/AllDebrid/Premiumize unlocking, and Zip-Slip-safe archive extraction.',
          'Privacy, Remote Web UI & Automation: DNS-over-HTTPS, SOCKS5/PAC relay, VPN Kill-Switch, DPAPI vault, LAN QR Remote Dashboard (:8463), --cli, --headless daemon, and 15-tool --mcp JSON-RPC server.'
        ],
        tech: ['C# (.NET 4.8)', 'Manifest V3', 'Windows x64', 'BitTorrent', 'MCP Server', 'Lossless Muxer'],
        c: '#3B82F6',
        iconKey: 'download',
        live: null,
        github: 'https://github.com/sshihabb007/MHS-DOWNLOAD-MANAGER',
        extraLinks: [{ label: 'Download v1.0.7', url: 'https://github.com/sshihabb007/MHS-DOWNLOAD-MANAGER/releases/latest' }]
      },
      {
        id: 'prj-driverplus',
        title: 'Driver+ (v1.0.1)',
        cat: 'desktop',
        flagship: true,
        desc: 'Clean-room 64-bit Windows 10/11 official WHQL hardware driver updater (432 KB portable, zero telemetry) with 4-stage SHA-1 & WinVerifyTrust verification, 14 Game Runtimes & Event ID 1000 Crash DLL Doctor, Rescue Center, and Windows 11 HVCI blocker auditor.',
        highlights: [
          'Native 64-Bit PnP & Ghost Inventory: Single-pass present and unplugged device enumeration via SetupAPI and CfgMgr32 with 4-part OEM SUBSYS specificity ranking and anti-downgrade guard.',
          '4-Stage Cryptographic WHQL Gate: Enforces strict Microsoft HTTPS allowlists, mandatory 40-hex SHA-1 CAB digest verification, WinVerifyTrust Authenticode checks, and atomic DiInstallDriverW installation.',
          '14 Game Runtimes & Event ID 1000 Crash DLL Doctor: Audits Visual C++ 2010–2022, DirectX, .NET 8/9, OpenAL, PhysX, and OpenJDK, mapping faulting crash DLLs to official winget packages.',
          'Rescue Center & 6-Card Fix Toolbox: System Restore checkpoints, Zip-Slip-guarded .zip + .sha256 DriverStore backups, air-gapped JSON profiles, HVCI Memory Integrity auditor, and 60fps WPF UI.'
        ],
        tech: ['C#', 'PE32+ x64', 'Win32 P/Invoke', 'DirectX WPF', 'WHQL Signed', 'HVCI Audit'],
        c: '#A855F7',
        iconKey: 'chip',
        live: null,
        github: 'https://github.com/sshihabb007/DriverPlus',
        extraLinks: [{ label: 'Download v1.0.1', url: 'https://github.com/sshihabb007/DriverPlus/releases/latest' }]
      },
      {
        id: 'prj-vsc',
        title: 'Video Speed Controller — VSC (v1.0.2)',
        cat: 'desktop',
        flagship: true,
        desc: 'Lightweight Chrome & Brave Manifest V3 HTML5 video/audio speed controller (0.07×–16.00×) with a visual per-site Controller Positioning Studio, 16:9 Live Preview, playback-rate conflict arbiter, Shadow DOM isolation, and minimal storage-only privacy permission.',
        highlights: [
          'Per-Site Positioning Studio (No Custom CSS): Independent placement rules for Global, YouTube, Facebook, Instagram, X, or custom /regex/ patterns using 8 perimeter anchors, pixel nudges, and 16:9 Live Preview.',
          '0.07× to 16.00× Precision Control: Smart 1.00× snapping, hover inline controls, mouse-wheel stepping, double-click preferred speed toggle, and GPU translate3d drag repositioning.',
          'Speed Arbiter & Intent Classifier: Dedicated YouTube, Facebook, Netflix, and generic player handlers defeat hostile site rate-resets without breaking legitimate user seeks.',
          'Custom Key Chords & Bookmarks: Customizable shortcuts (X/C/S/D/Z/G/V/M/J + Ctrl/Alt/Shift/Meta chords) and timestamp markers backed by automated unit and live Chrome/Brave E2E tests.'
        ],
        tech: ['JavaScript', 'Manifest V3', 'Shadow DOM', 'esbuild', 'Privacy-First', 'HTML5 Media'],
        c: '#EC4899',
        iconKey: 'speed',
        live: null,
        github: 'https://github.com/sshihabb007/VSC',
        extraLinks: [{ label: 'Download v1.0.2', url: 'https://github.com/sshihabb007/VSC/releases/latest' }]
      },
      {
        id: 'prj-master-vpn',
        title: 'MASTER VPN PRO (v1.3.1)',
        cat: 'desktop',
        flagship: true,
        desc: 'Open-source multi-platform VPN & privacy shield across Windows (~310 KB portable), Chrome/Brave MV3, and signed Android 8–14+ APK featuring 70+ country relays, interactive 3D Fibonacci Globe, MS-SSTP/IKEv2/WireGuard/OpenVPN/Proxy support, DPAPI vault, and Kill-Switch.',
        highlights: [
          'Unified Dark Bento UI & 3D Fibonacci Globe: Interactive 3D/Shield/Orbit/2D dashboard aggregating 70+ country open relays alongside custom private server imports.',
          'Multi-Protocol Layer-3 & Proxy Tunnels: Supports native MS-SSTP, IKEv2/IPsec, L2TP, WireGuard .conf, OpenVPN .ovpn, Android VpnService, and fail-closed multi-proxy Chromium PAC + WebRTC shield.',
          'Parallel Direct-IP 1-RTT Gateway Race: 28-way TCP + 18-way SSTP probing on Windows (16-thread on Android) for fastest auto-connect and 1-click dynamic IP rotation.',
          'Hardened Privacy & Diagnostics: Split-tunneling (routes/domains/apps), tunnel-scoped Secure DNS, Kill-Switch Watchdog, DPAPI vault, Cloudflare speed test, and GeoIP leak audit.'
        ],
        tech: ['C# / WPF', 'Manifest V3', 'Android APK', 'MS-SSTP / IKEv2', 'WireGuard', 'Security'],
        c: '#10B981',
        iconKey: 'shield',
        live: null,
        github: 'https://github.com/sshihabb007/MASTER-VPN-PRO',
        extraLinks: [{ label: 'Download v1.3.1', url: 'https://github.com/sshihabb007/MASTER-VPN-PRO/releases/latest' }]
      },
      {
        id: 'prj-gemini-ielts',
        title: 'AI English Teaching Platform by Gemini',
        cat: 'ai',
        desc: 'Real-time English test practice application featuring fully automated Speaking, Reading, and Writing test simulations powered by Google Gemini Live API and Vertex AI.',
        highlights: [
          'Real-time Voice Chat: Implements WebSockets (via Node.js and a PHP proxy) to stream bidirectional audio with the Gemini Live API.',
          'Automated Assessment: Grades text and spoken simulated tasks dynamically using official language test band descriptors.',
          'Speech Integration: Full utilization of browser SpeechRecognition and SpeechSynthesis APIs to replicate live examiner interactions.',
          'Tech Stack: Node.js WebSocket proxies, asynchronous PHP backends, OAuth2 authentication, React UI, and Express endpoints.'
        ],
        tech: ['React', 'Node.js', 'WebSockets', 'Vertex AI', 'Gemini Live API', 'PHP'],
        c: '#A855F7',
        iconKey: 'ai-voice',
        live: 'https://aielts.com.au/',
        github: null
      },
      {
        id: 'prj-openclaw',
        title: 'Agentic AI OpenClaw',
        cat: 'ai',
        desc: 'Autonomous agent platform powered by Agentic AI and OpenClaw for zero-touch email management, dynamic calendar scheduling, and continuous multi-step workflow automation.',
        highlights: [
          'Email Automation: Autonomous reading, drafting, triaging, and managing of professional emails using context-aware AI.',
          'Calendar Management: Goal-oriented agents scheduling, rescheduling, and resolving calendar conflicts dynamically.',
          'Agentic AI Orchestration: Built on the OpenClaw framework to orchestrate multi-step tool-calling pipelines.'
        ],
        tech: ['Python', 'Agentic AI', 'OpenClaw', 'LLM Orchestration', 'Automation'],
        c: '#EC4899',
        iconKey: 'agent',
        live: null,
        github: 'https://github.com/sshihabb007/AgenticAI-OpenClaw'
      },
      {
        id: 'prj-mhs-crm',
        title: 'MHS Enterprise CRM (Zoho-Class)',
        cat: 'fullstack',
        desc: 'Full-featured enterprise Customer Relationship Management platform modeled on Zoho CRM, engineered with Next.js and PostgreSQL featuring complete sales pipelines and workflow automation.',
        highlights: [
          'Core CRM Modules: Leads, Contacts, Accounts, Deals (Kanban & stages), Tasks, Calls, Meetings, Products, Quotes, and Invoices.',
          'Workflow Engine: Rule-based triggers, field updates, automated task assignment, and conversion pipelines.',
          'Relational Architecture: Normalized PostgreSQL schema with role-based access control, audit logs, and analytics dashboards.'
        ],
        tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'CRM'],
        c: '#3B82F6',
        iconKey: 'crm',
        live: null,
        github: 'https://github.com/sshihabb007/MHS-CRM'
      },
      {
        id: 'prj-silversprig',
        title: 'SilverSprig Aged Care Platform',
        cat: 'wordpress',
        desc: 'South Australian registered aged care provider platform built with WordPress and Elementor, featuring custom Nodemailer Gmail API integration for secure, automated care inquiry routing.',
        highlights: [
          'Accessible WordPress & Elementor Build: Warm, mobile-first architecture tailored to South Australian aged care seekers and families.',
          'Nodemailer & Gmail API Microservice: Authenticated OAuth2 Node.js email dispatch eliminating silent inquiry drops.',
          'Structured Service Directories: Clear pathways covering daily living, health & wellbeing, and person-centred care routines.'
        ],
        tech: ['WordPress', 'Elementor', 'Node.js', 'Nodemailer', 'Gmail API'],
        c: '#10B981',
        iconKey: 'healthcare',
        live: 'https://silversprig.com.au/',
        github: null,
        extraLinks: [{ label: 'Explore Services', url: 'https://silversprig.com.au/services/' }]
      },
      {
        id: 'prj-locus',
        title: 'Locus Services — Malware Recovery',
        cat: 'security',
        desc: 'Cybersecurity remediation, custom frontend development (JavaScript, HTML, Tailwind CSS), HubSpot CRM integration, and deep forensic recovery from extensive malware infections.',
        highlights: [
          'Removed Disguised File Manager Backdoors: Excised rogue remote file managers across plugin and theme directories.',
          'Eradicated Obfuscated PHP Droppers: Wiped hidden payload generators and restored clean core integrity.',
          'Purged Cloaked Spam Injections: Removed pre_get_posts cloaking hooks, cleaned 19,000+ spam posts, and integrated HubSpot CRM.'
        ],
        tech: ['Cybersecurity', 'WordPress', 'JavaScript', 'Tailwind CSS', 'HubSpot CRM', 'PHP'],
        c: '#EF4444',
        iconKey: 'shield',
        live: 'https://locusservices.com.au/',
        github: null
      },
      {
        id: 'prj-themis',
        title: 'Themis Family Lawyers — Build & Security',
        cat: 'security',
        desc: 'Developed the complete Australian family law firm website and executed critical incident recovery, eliminating injected backend malware and unauthorized admin accounts.',
        highlights: [
          'Complete Law Firm Platform: Responsive, authoritative web presence tailored for family law clients.',
          'Rogue Admin Eradication: Audited MySQL user and capabilities tables to eliminate unauthorized administrator accounts.',
          'Backend Hardening: Stripped injected PHP backdoors and enforced strict file and authentication controls.'
        ],
        tech: ['WordPress', 'Cybersecurity', 'Malware Recovery', 'PHP'],
        c: '#F59E0B',
        iconKey: 'shield',
        live: 'https://themisfamilylawyers.com.au/',
        github: null
      },
      {
        id: 'prj-hypex',
        title: 'Hypex Web Platform & Subnetworks',
        cat: 'wordpress',
        desc: 'Dynamic WordPress platform featuring deep theme customization, custom PHP plugin development, and interconnected subsites including Axing UK and Hypex Blog.',
        highlights: [
          'Bespoke Theme Engineering: Cohesive corporate identity across primary and regional UK domains.',
          'Custom Plugin Development: Tailored PHP plugins and WordPress core hooks for specialized workflows.',
          'Multi-Domain Subnetwork: Deployed and synchronized Axing UK and Hypex Blog alongside the flagship site.'
        ],
        tech: ['WordPress', 'PHP', 'Plugin Development', 'Multi-Site'],
        c: '#0EA5E9',
        iconKey: 'network',
        live: 'https://hypex.co.uk/',
        github: null,
        extraLinks: [
          { label: 'Axing UK', url: 'https://axing.uk/' },
          { label: 'Hypex Blog', url: 'https://blog.hypex.co.uk/' }
        ]
      },
      {
        id: 'prj-beri',
        title: 'BERI — Bangladesh Education & Research Institute',
        cat: 'wordpress',
        desc: 'Architected and actively maintain the official institutional web presence for BERI, deploying custom UI features and robust WordPress integrations.',
        highlights: [
          'Complete Institutional CMS: Structured academic programs, research initiatives, and responsive layouts.',
          'Custom UI & Media Assets: Tailored visual design aligned with BERI institutional standards.',
          'Hardened PHP Infrastructure: Fast rendering and reliable inquiry handling.'
        ],
        tech: ['WordPress', 'PHP', 'Web Design', 'CSS3', 'JavaScript'],
        c: '#3B82F6',
        iconKey: 'network',
        live: 'https://www.beri.com.bd/',
        github: null
      },
      {
        id: 'prj-mac',
        title: 'MAC Technology Australia',
        cat: 'wordpress',
        desc: 'Engineered and visually designed the official corporate website for MAC Technology Australia, implementing robust WordPress structures and responsive UI components.',
        highlights: [
          'Corporate Service Architecture: Structured enterprise IT consulting catalog and conversion funnels.',
          'Custom UI Engineering: Responsive design components tuned for Australian enterprise IT positioning.',
          'Performance & Security: Fast page delivery and hardened client inquiry workflows.'
        ],
        tech: ['WordPress', 'PHP', 'Web Design', 'SEO'],
        c: '#06B6D4',
        iconKey: 'network',
        live: 'https://mactechnology.com.au/',
        github: null
      },
      {
        id: 'prj-react-phone',
        title: 'ReactJs Online SmartPhone Shop',
        cat: 'fullstack',
        desc: 'Modern, responsive smartphone e-commerce storefront built using React.js for fast Virtual DOM catalog browsing, brand filtering, and real-time cart interactions.',
        highlights: [
          'Component-Driven Catalog: Reusable product cards, specifications views, and interactive cart state.',
          'Zero-Reload Filtering: Instant smartphone search and brand sorting across desktop and mobile.'
        ],
        tech: ['React', 'JavaScript', 'CSS3', 'E-Commerce'],
        c: '#0EA5E9',
        iconKey: 'cart',
        live: null,
        github: 'https://github.com/sshihabb007/ReactJs---Online-SmartPhone-Shop'
      },
      {
        id: 'prj-mern-shop',
        title: 'MERN E-Commerce Website',
        cat: 'fullstack',
        desc: 'Full-stack MERN e-commerce application featuring product cataloging, brand filtering, RESTful inventory APIs, and reactive shopping cart logic.',
        highlights: [
          'End-to-End MERN Stack: Decoupled React SPA communicating with secure Express/Node.js REST endpoints.',
          'Indexed MongoDB Schemas: Fast multi-attribute product queries and persistent cart management.'
        ],
        tech: ['MongoDB', 'Express', 'React', 'Node.js', 'MERN Stack'],
        c: '#10B981',
        iconKey: 'cart',
        live: null,
        github: 'https://github.com/sshihabb007/MERN-WEBSITE-E-COMMERCE'
      },
      {
        id: 'prj-laravel-shop',
        title: 'Modern Online Device Shop',
        cat: 'fullstack',
        desc: 'Modern electronics e-commerce platform rebuilt with Laravel MVC for dynamic routing, role-protected authentication, database migrations, and inventory management.',
        highlights: [
          'Laravel MVC Architecture: Clean separation of controllers, Eloquent models, middleware, and Blade views.',
          'Role-Protected Auth & Admin CRUD: Guarded checkout flows and complete administrative product control.'
        ],
        tech: ['Laravel', 'PHP', 'MySQL', 'Tailwind CSS', 'E-Commerce'],
        c: '#EC4899',
        iconKey: 'cart',
        live: null,
        github: 'https://github.com/sshihabb007/MODERN-ONLINE-DEVICE-SHOP'
      },
      {
        id: 'prj-wai-rasa',
        title: 'WAI APAC Awards Rasa Chatbot',
        cat: 'ai',
        desc: 'Conversational AI assistant built with Python, Rasa NLU, and TensorFlow to guide applicants through the Women in AI (WAI) APAC Awards.',
        highlights: [
          'Rich Intent Coverage: Answers deadlines, eligibility, judging criteria, fees, and regional APAC rules.',
          'Custom NLU & Dialogue Pipeline: CountVectorsFeaturizer, DIETClassifier, TEDPolicy, and FallbackClassifier.'
        ],
        tech: ['Python', 'Rasa', 'TensorFlow', 'Scikit-Learn', 'NLP'],
        c: '#F59E0B',
        iconKey: 'bot',
        live: null,
        github: 'https://github.com/sshihabb007/AI-CHATBOT-PROJECT'
      },
      {
        id: 'prj-aiub-forum',
        title: 'AIUB Online Forum',
        cat: 'fullstack',
        desc: 'Social community and academic discussion platform built with ASP.NET enabling registered students to post, like, comment, report, and interact seamlessly.',
        highlights: [
          'Role-Based Auth & Profiles: Secure registration, session handling, and student profiles.',
          'Threaded Social Feed: Real-time likes, nested comments, user reporting, and admin moderation.'
        ],
        tech: ['ASP.NET', 'C#', 'SQL Server', 'Web Development'],
        c: '#A855F7',
        iconKey: 'code',
        live: null,
        github: 'https://github.com/sshihabb007/AIUB-Online-Forum-ASP.NET-'
      },
      {
        id: 'prj-php-phone',
        title: 'Online Smartphone Shop (PHP & AJAX)',
        cat: 'fullstack',
        desc: 'Dynamic e-commerce marketplace powered by PHP, JavaScript, AJAX, and jQuery where customers purchase smartphones securely and admins control full inventory.',
        highlights: [
          'Asynchronous AJAX Filtering: Smooth catalog updates without full page reloads.',
          'Full Admin Dashboard: Complete CRUD controls for products, orders, and pricing.'
        ],
        tech: ['PHP', 'JavaScript', 'AJAX', 'jQuery', 'MySQL'],
        c: '#3B82F6',
        iconKey: 'cart',
        live: null,
        github: 'https://github.com/sshihabb007/Online-Smartphone-Shop-PhP-JAVASCRIPT-AJAX-Jquery-CSS-'
      },
      {
        id: 'prj-hospital',
        title: 'Hospital Management System',
        cat: 'desktop',
        desc: 'Robust C# desktop application backed by Oracle 10g with custom PL/SQL triggers, stored procedures, and functions for an end-to-end hospital database ecosystem.',
        highlights: [
          'Oracle PL/SQL Engine: Custom triggers, stored procedures, and functions enforcing clinical data integrity.',
          'Patient & Billing Workflows: Admission, ward allocation, medical records, and concurrent billing.'
        ],
        tech: ['C#', 'Oracle PL/SQL', 'Desktop App', 'Database Management'],
        c: '#EF4444',
        iconKey: 'hospital',
        live: null,
        github: 'https://github.com/sshihabb007/Hospital-Management-System-by-Oracle-10G-and-PLSQL'
      },
      {
        id: 'prj-inventory',
        title: 'Inventory Management System',
        cat: 'desktop',
        desc: 'Localized C# desktop application streamlining daily goods transactions, supplier tracking, stock alerts, and administrative inventory reporting.',
        highlights: [
          'Fast WinForms Workflow: Keyboard-friendly daily transaction logging and supplier ledgers.',
          'Automated Reporting: Real-time stock thresholds and margin summaries.'
        ],
        tech: ['C#', '.NET', 'Desktop App', 'Utility'],
        c: '#A855F7',
        iconKey: 'code',
        live: null,
        github: 'https://github.com/sshihabb007/Inventory_Management_System_C-'
      },
      {
        id: 'prj-smartbook',
        title: 'SHIHAB-SmartBook',
        cat: 'desktop',
        desc: 'Core Java desktop directory and smart contact book application built with clean OOP/MVC design, Swing UI, and persistent local file I/O.',
        highlights: [
          'Persistent File I/O: Structured local record engine for fast reading, searching, and sorting.',
          'Java Swing MVC: Clean separation between domain models, controllers, and views.'
        ],
        tech: ['Java', 'Java Swing', 'OOP', 'Application'],
        c: '#F59E0B',
        iconKey: 'code',
        live: null,
        github: 'https://github.com/sshihabb007/SHIHAB-SmartBook'
      },
      {
        id: 'prj-aiub-grading',
        title: 'AIUB Grading System',
        cat: 'desktop',
        desc: 'High-efficiency C++ academic grading engine utilizing dynamic data structures and precision floating-point algorithms to compute AIUB CGPA transcripts.',
        highlights: [
          'Precision CGPA Computation: Maps AIUB letter-grade thresholds and weighted credit-hour calculations.',
          'Dynamic C++ Structures: Clean memory footprint and structured student transcript summaries.'
        ],
        tech: ['C++', 'Algorithms', 'Education'],
        c: '#3B82F6',
        iconKey: 'code',
        live: null,
        github: 'https://github.com/sshihabb007/AIUB-Grading-System-C-'
      },
      {
        id: 'prj-aspnet-demo',
        title: 'ASP.NET Projects & HTML UI Demo',
        cat: 'fullstack',
        desc: 'Modular repository of C# classes, ASP.NET session management patterns, and decoupled HTML UI demonstrations for rapid full-stack prototyping.',
        highlights: [
          'Decoupled Controllers: Reusable C# request routing and session state architecture.',
          'Modular UI Templates: Structured HTML views for enterprise ASP.NET workflows.'
        ],
        tech: ['ASP.NET', 'C#', 'HTML5'],
        c: '#EC4899',
        iconKey: 'code',
        live: null,
        github: 'https://github.com/sshihabb007/ASP.NET-projects-HTML-demo'
      },
      {
        id: 'prj-budget-care',
        title: 'Budget Shop & Care Connects',
        cat: 'wordpress',
        desc: 'Production WordPress tech and e-commerce websites integrating Bangladeshi payment gateways including bKash, Rocket, and direct Bank Transfers.',
        highlights: [
          'Local Payment Gateways: Real-time checkout verification for bKash, Rocket, and bank transfers.',
          'Custom Bootstrap & PHP Extensions: Responsive storefronts engineered for reliable commerce.'
        ],
        tech: ['WordPress', 'PHP', 'Bootstrap', 'Payment Gateways'],
        c: '#10B981',
        iconKey: 'cart',
        live: null,
        github: 'https://github.com/sshihabb007'
      },
      {
        id: 'prj-pricevisible',
        title: 'Pricevisible',
        cat: 'fullstack',
        desc: 'PHP-based web application engineered for transparent product pricing visibility, structured catalog comparison, and lightweight server-side rendering.',
        highlights: [
          'Server-Side PHP Engine: Fast catalog price lookups and structured comparison views.'
        ],
        tech: ['PHP', 'MySQL', 'HTML5', 'CSS3'],
        c: '#EC4899',
        iconKey: 'cart',
        live: null,
        github: 'https://github.com/sshihabb007/Pricevisible'
      },
      {
        id: 'prj-site-auditor',
        title: 'Shihab Site Auditor Pro',
        cat: 'tools',
        desc: 'Advanced client-side Technical SEO and web page auditing suite analyzing heading hierarchy, metadata completeness, keyword density, and actionable ranking fixes.',
        highlights: [
          'Deep DOM Auditing: Checks H1–H6 hierarchy, meta/canonical tags, alt text, and keyword distribution.',
          'Privacy-First Execution: Runs purely in JavaScript without externally storing audited URLs.'
        ],
        tech: ['JavaScript', 'Technical SEO', 'Web Tool'],
        c: '#F59E0B',
        iconKey: 'chart',
        live: null,
        github: 'https://github.com/sshihabb007/Shihab-Site-Auditor-pro'
      },
      {
        id: 'prj-site-analytics',
        title: 'SITE-ANALYTICS-BY-SHIHAB',
        cat: 'tools',
        desc: 'Custom self-hosted PHP web analytics engine for tracking unique impressions, visitor geolocation, referrer metrics, and session performance.',
        highlights: [
          'Zero-Overhead Tracking: Lightweight PHP & MySQL event logging with visitor geo/referrer breakdowns.'
        ],
        tech: ['PHP', 'MySQL', 'Analytics'],
        c: '#EC4899',
        iconKey: 'chart',
        live: null,
        github: 'https://github.com/sshihabb007/SITE-ANALYTICS-BY-SHIHAB'
      },
      {
        id: 'prj-gphotos-npm',
        title: 'google-photos-album-url-fetch',
        cat: 'tools',
        desc: 'Node.js NPM utility package for programmatically extracting high-resolution CDN image URLs from shared Google Photos albums.',
        highlights: [
          'Automated Album Traversal: Extracts direct image CDN URLs cleanly for galleries and static sites.'
        ],
        tech: ['Node.js', 'NPM', 'API', 'JavaScript'],
        c: '#10B981',
        iconKey: 'code',
        live: null,
        github: 'https://github.com/sshihabb007/google-photos-album-image-url-fetch'
      },
      {
        id: 'prj-pc-power',
        title: 'PC Power & Electric Bill Calculator',
        cat: 'tools',
        desc: 'Interactive hardware TDP wattage estimator and Bangladesh 6-slab / global residential electricity bill calculator hosted as a bundled PWA.',
        highlights: [
          'BD 6-Slab & Global Tariff Engine: Itemized progressive electricity slabs + demand charge + 5% VAT.',
          'Smart UPS Sizing: Recommends UPS VA rating and estimated runtime from real hardware wattage.'
        ],
        tech: ['HTML5', 'JavaScript', 'Calculator', 'PWA'],
        c: '#F59E0B',
        iconKey: 'bolt',
        live: './power-calculator/',
        github: 'https://github.com/sshihabb007/PC-Power-Calculator'
      },
      {
        id: 'prj-tax-calc',
        title: 'NBR Bangladesh Income Tax Calculator',
        cat: 'tools',
        desc: 'Multi-step financial web application modeled on NBR Bangladesh e-Return schedules (Income Tax Act, 2023) with progressive slabs and investment rebate optimization.',
        highlights: [
          '5-Step e-Return Schedules: IT-11GA profile, Schedule 1 salary, Schedule 5 investment credits, IT-10BB & IT-10B wealth reconciliation.',
          'Auto-Maximize Tax Rebate: Instant lakh/crore BDT calculation with live bundled web tool.'
        ],
        tech: ['HTML5', 'JavaScript', 'Finance', 'PWA'],
        c: '#3B82F6',
        iconKey: 'calculator',
        live: './tax-calculator/',
        github: 'https://github.com/sshihabb007/TAX-Calculator'
      }
    ],

    toolTabs: [
      { key: 'all', label: 'All Tools' },
      { key: 'calculators', label: 'Scientific & Math' },
      { key: 'ai_media', label: 'AI & Media Suite' },
      { key: 'finance_utility', label: 'Finance & Utility' }
    ],

    tools: [
      {
        id: 'tool-adv-calc',
        title: 'Advanced Scientific Calculator',
        category: 'calculators',
        categoryLabel: 'Scientific & Math',
        subtitle: '64-Digit BigNumber · Algebra & Calculus CAS',
        desc: 'Self-hosted textbook math engine uniting MathQuill v2 live equation typesetting, 64-digit BigNumber arithmetic, exact rational fractions, and symbolic calculus (d/dx, integrals, solve).',
        url: './advanced-calculator/',
        accent: '#3B82F6',
        tags: ['MathQuill + CAS', '64-Digit', 'Offline PWA']
      },
      {
        id: 'tool-audio-text',
        title: 'ScribeAI — Audio to Text',
        category: 'ai_media',
        categoryLabel: 'AI & Media Suite',
        subtitle: 'Local WebGPU Whisper · Gemini & Groq AI',
        desc: 'Multi-engine AI audio transcription studio for MP3, WAV, and M4A files — run 100% on-device Whisper in a Web Worker or switch to BYO-key Gemini 2.5 Flash-Lite or Groq Whisper V3 Turbo.',
        url: './audio-to-text/',
        accent: '#A855F7',
        tags: ['WebGPU Whisper', 'Gemini / Groq', '100% Local']
      },
      {
        id: 'tool-compressor',
        title: 'Image & Audio Converter',
        category: 'ai_media',
        categoryLabel: 'AI & Media Suite',
        subtitle: 'Batch Compressor & FFmpeg.wasm Studio',
        desc: 'Zero-upload browser media workstation: batch-compress & convert PNG/JPG/WebP images via Canvas, or extract and trim MP3, AAC, WAV, and OGG audio from videos using FFmpeg.wasm.',
        url: './compressor/',
        accent: '#EC4899',
        tags: ['FFmpeg.wasm', 'WaveSurfer v7', 'Zero Upload']
      },
      {
        id: 'tool-universal-dl',
        title: 'Universal Downloader',
        category: 'ai_media',
        categoryLabel: 'AI & Media Suite',
        subtitle: 'Lossless Video, Slide & 320 kbps MP3 Extractor',
        desc: 'Ad-free stream extractor for TikTok, YouTube, Instagram Reels, Twitter/X, and Facebook powered by platform-aware routing, Cloudflare Worker proxy, and 6 Cobalt v10 failover nodes.',
        url: './universal-downloader/',
        accent: '#3B82F6',
        tags: ['Cobalt v10', '320 kbps MP3', 'Multi-Node']
      },
      {
        id: 'tool-tax',
        title: 'NBR Bangladesh e-Return Tax Tool',
        category: 'finance_utility',
        categoryLabel: 'Finance & Utility',
        subtitle: 'AY 2025–2026 Income Tax Estimator',
        desc: '5-step wizard modeled on NBR Bangladesh e-Return schedules under the Income Tax Act, 2023 covering progressive slabs, investment rebates, lifestyle expenditure, and net wealth reconciliation.',
        url: './tax-calculator/',
        accent: '#10B981',
        tags: ['AY 2025–2026', 'BD Finance', 'Offline PWA']
      },
      {
        id: 'tool-currency',
        title: 'Currency Converter Pro',
        category: 'finance_utility',
        categoryLabel: 'Finance & Utility',
        subtitle: '160+ Global Currencies · Live Rates',
        desc: 'Real-time currency converter supporting USD, EUR, GBP, BDT, INR, and 160+ global currencies via ExchangeRate-API v6 with an embedded 45-currency offline fallback table.',
        url: './currency-converter/',
        accent: '#0EA5E9',
        tags: ['160+ Currencies', 'Live FX API', 'Offline Fallback']
      },
      {
        id: 'tool-power',
        title: 'PC Power Calculator Pro',
        category: 'calculators',
        categoryLabel: 'Scientific & Math',
        subtitle: 'Electricity Bill Estimator & UPS Advisor',
        desc: 'Estimates monthly PC energy consumption (kWh) and electricity bills across Bangladesh’s 6-slab tiered tariff or global flat rates, paired with a real-time UPS capacity & thermal advisor.',
        url: './power-calculator/',
        accent: '#F59E0B',
        tags: ['BD Tariff Slabs', 'UPS Advisor', 'Hardware TDP']
      },
      {
        id: 'tool-land',
        title: 'Land Calculator Pro',
        category: 'calculators',
        categoryLabel: 'Scientific & Math',
        subtitle: 'Bangladesh Land Measurement Suite',
        desc: 'Bidirectional 8-unit land converter for Bangladesh & South Asia (Decimal, Katha, Bigha, Acre, Hectare, Sq.Ft, Sq.Links) with Gunter’s Chain survey calculator and Land Terms Wiki.',
        url: './land-calculator/',
        accent: '#10B981',
        tags: ['8 Live Units', 'Gunter’s Chain', 'BD Survey']
      },
      {
        id: 'tool-qr',
        title: 'QR Generator Pro',
        category: 'finance_utility',
        categoryLabel: 'Finance & Utility',
        subtitle: '14-Type Custom Logo & Vector QR Studio',
        desc: 'Custom QR code studio supporting 14 payload types (URL, WiFi, vCard, Event, Bitcoin), 2-stop gradients, custom dot/eye geometry, embedded logos, and PNG/SVG/PDF/EPS export.',
        url: './qr-generator/',
        accent: '#3B82F6',
        tags: ['PNG/SVG/PDF/EPS', 'Custom Logo', '14 Types']
      },
      {
        id: 'tool-bmi',
        title: 'BMI Calculator Pro',
        category: 'calculators',
        categoryLabel: 'Scientific & Math',
        subtitle: 'Body Mass Index Gauge & Ideal Weight',
        desc: 'Interactive Metric & Imperial Body Mass Index calculator featuring an animated 4-zone color needle gauge, healthy ideal weight targets, personalized guidance, and local 5-entry history.',
        url: './bmi-calculator/',
        accent: '#F59E0B',
        tags: ['Metric / Imperial', 'Visual Gauge', 'History Log']
      },
      {
        id: 'tool-age',
        title: 'Age Calculator Pro',
        category: 'calculators',
        categoryLabel: 'Scientific & Math',
        subtitle: 'Exact Age, Generation, Zodiac & Milestones',
        desc: 'Instant chronological age and life-milestone analyzer computing exact years, months, and days, next birthday countdown, generational cohort, Western & Chinese zodiacs, and life statistics.',
        url: './age-calculator/',
        accent: '#EC4899',
        tags: ['Date Math', 'Milestones', 'Offline PWA']
      }
    ]
  };
})();

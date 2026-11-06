# Mehedi Hasan Shihab — Interactive 3D & Multi-Mode Developer Portfolio

[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite 6](https://img.shields.io/badge/Vite-6.4-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Three.js WebGL](https://img.shields.io/badge/Three.js-0.174%20%7C%20GLSL-000000?logo=threedotjs&logoColor=white)](https://threejs.org/)
[![Animation Modes](https://img.shields.io/badge/Animation%20Modes-10%20Live%20Themes-3b82f6)](#10-interactive-animation-modes)
[![Google Certified](https://img.shields.io/badge/Google%20%26%20Gemini-5x%20Verified-10b981?logo=google&logoColor=white)](https://edu.google.accredible.com/profile/mehedihasanshihab922213/wallet)

Official interactive 3D developer portfolio of **Mehedi Hasan Shihab** — **Senior Software Engineer** at [Bangladesh Education and Research Institute (BERI)](https://www.beri.com.bd/), **Remote Web Developer** at [MAC Technology Australia Pty Ltd.](https://mactechnology.com.au/), Full-Stack & Google Gemini / Agentic AI Engineer, Cybersecurity Malware Recovery Specialist, and 5× Google for Education & Gemini Certified Educator.

---

## Table of Contents

1. [Overview & Key Highlights](#overview--key-highlights)
2. [10 Interactive Animation Modes](#10-interactive-animation-modes)
3. [Section-by-Section UI & Micro-Interactions](#section-by-section-ui--micro-interactions)
4. [Complete Portfolio Content Inventory](#complete-portfolio-content-inventory)
   - [Academic Journey (4 Degrees)](#academic-journey-4-degrees)
   - [Professional Experience (3 Roles)](#professional-experience-3-roles)
   - [Core Engineering Services (6 Offerings)](#core-engineering-services-6-offerings)
   - [Technical Arsenal (44 Skills & Git Breakdown)](#technical-arsenal-44-skills--git-breakdown)
   - [Featured Engineering Projects (28 Projects)](#featured-engineering-projects-28-projects)
   - [Bundled Live Web Tools (11 Standalone Apps)](#bundled-live-web-tools-11-standalone-apps)
   - [Google & Gemini Certifications (5 Verified Credentials)](#google--gemini-certifications-5-verified-credentials)
   - [Contact Channels & Academic References](#contact-channels--academic-references)
5. [Tech Stack & Performance Architecture](#tech-stack--performance-architecture)
6. [Repository Structure](#repository-structure)
7. [Getting Started & Commands](#getting-started--commands)
8. [Customization & Deployment](#customization--deployment)
9. [Author & Links](#author--links)

---

## Overview & Key Highlights

- **Triple-Scene Three.js WebGL Engine + Hand-Drawn SVG Mode**:
  - **Hero 3D Rig (`createHeroScene`)**: Portrait-anchored 3D WebGL scene with text-column collision avoidance (`AVOID_GLSL`), pointer sway damping, and click-triggered shader effects.
  - **Ambient Full-Viewport Backdrop (`createNetworkScene`)**: Scroll-reactive 3D background with smooth per-section color tinting (`#education` → `#contact`) and automatic 2D `<canvas>` constellation fallback when WebGL is unavailable.
  - **Tools 3D DNA Double-Helix (`createPublicationScene`)**: 220-node dual-strand GLSL double-helix with connecting rungs and cursor repulsion running behind the Live Web Tools showcase.
  - **10 Switchable Live Themes**: Instant mode switching via the expandable Hero dock (`AnimPicker`) or mobile navbar selector, persisted in `localStorage` with zero Flash of Unstyled Content (FOUC).
- **Dark & Light Theme Engine**: Supports Dark and Light palettes across WebGL shaders and CSS design tokens (`ayanBase.css` + `tokensBridge.css`), plus dedicated custom typography and surface palettes for `Code`, `Wild Fire`, and `Sketch` modes.
- **Complete Career & Product Showcase**: Unifies **4** academic milestones, **44** technical skills, **6** engineering services, **3** industry roles, **28** production & open-source projects, **11** self-hosted interactive web tools (playable in-page or full-screen), **5** Accredible-verified Google/Gemini credentials, and **2** academic references.

---

## 10 Interactive Animation Modes

Each mode dynamically lazy-loads its own Three.js shader chunk (`src/three/modes/*.ts`) and synchronizes `[data-animation-mode="<id>"]` on `<html>` to update typography, surface colors, card glows, and SVG overlays:

| # | Mode ID | Label | Visual & Shader Mechanics | Theme & Special UI Details |
| :- | :------ | :---- | :------------------------ | :------------------------- |
| 1 | `galaxy` | **Galaxy** | Orbiting stardust spiral, constellation icosahedrons, shooting comets, and **4 wireframe-grid 3D planets** (`Earth`, `Mars`, `Jupiter`, `Neptune`) orbiting the portrait. | Default cosmic blue/cyan (`Syne` + `DM Sans`) in Dark & Light modes. |
| 2 | `neural` | **Neural** | 3D spherical living synapse network around the portrait with traveling neural action-potential pulses + ambient flowing neural wave threads. | Displays animated `.neural-hero-brain` SVG watermark behind Hero headline. |
| 3 | `code` | **Code** | Multi-column falling glyph/code streams with depth fog and cursor illumination. | Crimson/obsidian terminal theme (`#ff3b57` / `#10090d`), `JetBrains Mono` typography, and custom spinning `#19f58b` **Cyber Crosshair** cursor (`CyberCursor`). |
| 4 | `waves` | **Waves** | Undulating 3D FBM particle ocean with cresting foam highlights and pointer wave wakes. | Deep ocean blue/teal palette with smooth additive/normal theme blending. |
| 5 | `warp` | **Warp** | Starfield hyperspace streaks radiating from the portrait focal point with scroll-accelerated velocity. | High-contrast starlight trails adapting between dark space and daylight sky. |
| 6 | `tunnel` | **Tunnel** | Concentric neon light rings steering interactively toward the cursor position. | Perspective ring depth cues with responsive camera sway. |
| 7 | `pulse` | **Pulse** | Isometric dot-matrix grid propagating concentric shockwave ripples automatically and on click. | Crisp geometric grid with radial wave height/brightness shaders. |
| 8 | `thunder` | **Thunderstorm** | Volumetric slanted rain (`2,100` hero / `1,000` ambient drops), storm clouds, sheet flashes, and branching **procedural lightning bolts** (auto-strikes + **click anywhere in Hero to summon lightning**). | Atmospheric storm lighting with screen-illumination flashes. |
| 9 | `wildfire` | **Wild Fire** | Rising turbulent ember plumes, heat shimmer, and **click-to-ignite** fire bursts (`stormfx` particle physics). | Volcanic ember palette (`#f04b24` / `#100d11`) with smoked slate cards. |
| 10 | `sketch` | **Sketch** | Disables WebGL in favor of a **25-doodle hand-drawn SVG paper backdrop** (`SketchBackdrop`), Hero notebook margin illustrations, and a 18-step pencil-hatch photo reveal (`sketchPencilPass`). | Warm `#fffdf7` paper theme, `Kalam` hand-lettered headings, header crayon doodle, and automatic light-paper lock. |

---

## Section-by-Section UI & Micro-Interactions

- **Header & Navigation (`Navbar.tsx`)**:
  - `SHIHAB` gradient wordmark (with animated crayon doodle in `Sketch` mode).
  - Scroll-spy active section tracking with a smoothly gliding, glowing `.nav-indicator` bar.
  - Responsive mobile drawer with integrated `<AnimMobileDropdown />` mode switcher and Dark/Light toggle.
- **Hero (`Hero.tsx`)**:
  - Cursor-tracked radial spotlight (`--hx`, `--hy`), floating ambient blobs, word-by-word bio reveal, and live `TypedText` subtitle caret.
  - Circular `310×310` portrait framed by `.hero-aura`, 3 orbiting spark particles (`.hero-orbit`), dual counter-rotating dashed rings (`.ring1`, `.ring2`), and 3D cursor tilt (`--rx`, `--ry`).
  - Expandable bottom-right `AnimPicker` radio dock with keyboard arrow navigation (`←` `→` `↑` `↓`) and animated count-up stats bar (`28+ Notable Projects`, `7+ Years Exp.`, `5 Google Certs`).
- **Education (`Education.tsx`)**:
  - Scroll-driven vertical `.edu-rail` (`--fill`) lighting up `.edu-dot` and `.edu-connector` nodes as each degree enters view.
  - Interactive `<EduScoreDial>` SVG circular gauges animating both stroke arc and tabular numeric score (`3.77`, `3.65`, `4.90`, `5.00`) with percentage badges (`94%`, `91%`, `98%`, `100%`).
- **Skills (`Skills.tsx`)**:
  - 2D `ResizeObserver`-tracked gliding `.pf-pill` category tabs (`All`, `Programming`, `Web & Full-Stack`, `AI & Agents`, `Databases & CRM`, `Design & Media`, `Tools & Security`).
  - Web Animations API **FLIP** layout transitions when filtering across all **44** skill tiles, paired with Git language distribution bars and personal traits/spoken languages cards.
- **Services (`Services.tsx`)**:
  - Drifting `.svc-aurora` background blobs, 3D cursor-tilting service cards with rotating conic gradient borders (`@property --sa`), and multi-shape animated `<ServiceIcon>` SVGs.
- **Work Experience (`Experience.tsx`)**:
  - Scroll-synced `.exp-rail` with glowing lead spark, animated chevron bullets, deterministic hue-tinted tech chips (`hashTechHue`), and interactive `<ExpWebsiteChip>` links featuring a 3D spinning globe and floating typewriter domain tooltip.
- **Projects (`Projects.tsx`)**:
  - Category filter bar with live counts across **28** projects, 3D tilt cards, hover `.proj-peek` summary overlays, and pointer-origin button `.rip-wave` ripples.
  - **Circular Clip-Path Reveal Modal** (`pmReveal` / `pmUnreveal` anchored to exact click coordinates `--ox`, `--oy`) with scroll progress bar, `01 / 28` counter, directional slide transitions, and `←` / `→` / `Esc` keyboard navigation.
- **Interactive Web Tools (`ToolsSection.tsx`)**:
  - Backed by the 3D `createPublicationScene` DNA double-helix canvas, 2D gliding filter tabs, **Quick Preview** embedded sandbox iframe modal, and **Launch Live Tool** full-tab opener.
- **Certifications (`Certifications.tsx`)**:
  - Verified Google for Education Accredible Wallet banner + 5 conic-ring `.cert-card` credentials with spinning `.cert-seal` badges and direct issuer verification links.
- **Contact & References (`Contact.tsx`)**:
  - 6 interactive `.contact-card` channels (`Email`, `Phone`, `WhatsApp`, `Location`, `LinkedIn`, `GitHub`) with conic `.cc-ring` borders and hover sheen.
  - Live `Send a Message` form (`mailto:sshihabb007@gmail.com`) with `0 / 3 ready` top progress bar (`.cf-progress`), animated `.cf-tick` checkmarks, honeypot spam guard, and an **18-particle `.cf-burst` confetti explosion** on send, followed by 2 AIUB Academic Reference cards.

---

## Complete Portfolio Content Inventory

### Academic Journey (4 Degrees)

| Period | Degree | Institution | Score |
| :----- | :----- | :---------- | :---- |
| `2021 – 2022` | **M.Sc. in Computer Science** | [American International University-Bangladesh (AIUB)](https://www.aiub.edu/) | **CGPA: 3.77 / 4.00** (`94%`) |
| `2014 – 2019` | **B.Sc. in Computer Science & Engineering** | [American International University-Bangladesh (AIUB)](https://www.aiub.edu/) | **CGPA: 3.65 / 4.00** (`91%`) |
| `2012 – 2014` | **Higher Secondary Certificate (Science)** | Safiuddin Sarkar Academy & College (SSAC), Gazipur | **GPA: 4.90 / 5.00** (`98%`) |
| `2010 – 2012` | **Secondary School Certificate (Science)** | Safiuddin Sarkar Academy & College (SSAC), Gazipur | **GPA: 5.00 / 5.00** (`100%`) |

### Professional Experience (3 Roles)

1. **Senior Software Engineer** — [Bangladesh Education and Research Institute (BERI)](https://www.beri.com.bd/) *(Mar 2022 – Present · Banani, Dhaka)*
   - Full-stack platform architecture (`beri.com.bd`), **AI English Teaching Platform** (`aielts.com.au`) powered by Google Gemini Live API & Vertex AI with Node.js WebSockets and PHP backends, custom analytics tools, and institutional media production.
2. **Web Developer (Remote)** — [MAC Technology Australia Pty Ltd.](https://mactechnology.com.au/) *(Nov 2022 – Present · Nailsworth, SA, Australia)*
   - Corporate & South Australian aged-care platforms (`mactechnology.com.au`, `silversprig.com.au`) with OAuth2 Gmail API & Nodemailer microservices; UK multi-site WordPress subnetwork (`hypex.co.uk`, `axing.uk`, `blog.hypex.co.uk`); forensic malware recovery & server hardening (`locusservices.com.au`, `themisfamilylawyers.com.au`).
3. **Officer, IT** — **i - Global Services** *(Sep 2019 – Mar 2020 · Mirpur-10, Dhaka)*
   - Corporate web development, enterprise network/workstation IT support, and brand graphics in Adobe Photoshop & Illustrator.

### Core Engineering Services (6 Offerings)

1. **Full-Stack Web Development** — React, Next.js, Node.js, Express, PHP/Laravel, ASP.NET.
2. **AI, Gemini Live & Agentic Systems** — Real-time bidirectional voice AI (Gemini Live + Vertex AI), OpenClaw autonomous workflow agents, Rasa NLU chatbots, LLM training.
3. **WordPress Ecosystems & Plugins** — Custom themes, bespoke PHP plugins, multi-site networks, WooCommerce, bKash/Rocket & international gateways.
4. **Cybersecurity & Malware Recovery** — Deep forensic cleanup of PHP droppers, disguised file managers, rogue admins, and SEO spam hooks with full server hardening.
5. **Enterprise CRM & Database Systems** — Zoho-class CRM workflows, PostgreSQL, Oracle 10g PL/SQL triggers/procedures, SQL Server, MySQL.
6. **UI/UX Design, Media & Technical SEO** — Figma, Photoshop, Illustrator, promotional video editing (CapCut, Filmora), technical site auditing, and analytics.

### Technical Arsenal (44 Skills & Git Breakdown)

- **Programming (`8`)**: JavaScript, TypeScript, Python, C#, PHP, Java, C++, C.
- **Web & Full-Stack (`11`)**: React.js, Next.js, Node.js, WordPress, Laravel, ASP.NET, HTML5, CSS3, Tailwind CSS, Bootstrap, AJAX & jQuery.
- **AI & Agents (`7`)**: Gemini Live API, Google Vertex AI, OpenClaw Agents, Rasa NLU, LLM Training, Prompt Crafting, AI Automation.
- **Databases & CRM (`6`)**: PostgreSQL, MySQL, Oracle PL/SQL, SQL Server, MongoDB, Enterprise CRM.
- **Design & Media (`6`)**: Photoshop, Illustrator, Figma, Canva, CapCut, Filmora.
- **Tools, Security & Strategy (`6`)**: Git & GitHub, VS Code, Cybersecurity, Technical SEO, Project Management, Digital Marketing.
- **Git Language Distribution**: JavaScript (`30.71%`), CSS (`27.00%`), HTML (`17.02%`), C# (`15.17%`), PHP (`5.83%`), Java (`4.28%`).
- **Spoken Languages**: English *(Excellent Written & Oral Competence)*, Bengali *(Native Speaker)*.

### Featured Engineering Projects (28 Projects)

| # | Project | Category | Core Stack | Links |
| :- | :------ | :------- | :--------- | :---- |
| 1 | **AI English Teaching Platform by Gemini** | AI & Agents | React, Node.js, WebSockets, Vertex AI, Gemini Live API, PHP | [Live](http://aielts.com.au/) |
| 2 | **Agentic AI OpenClaw** | AI & Agents | Python, Agentic AI, OpenClaw, LLM Orchestration | [GitHub](https://github.com/sshihabb007/AgenticAI-OpenClaw) |
| 3 | **MHS Enterprise CRM (Zoho-Class)** | Full-Stack & CRM | Next.js, TypeScript, PostgreSQL, Prisma, Tailwind CSS | [GitHub](https://github.com/sshihabb007/MHS-CRM) |
| 4 | **SilverSprig Aged Care Platform** | WordPress | WordPress, Elementor, Node.js, Nodemailer, Gmail API | [Live](https://silversprig.com.au/) |
| 5 | **Locus Services — Malware Recovery** | Cybersecurity | Malware Forensics, WordPress, PHP, MySQL, Hardening | [Live](https://locusservices.com.au/) |
| 6 | **Themis Family Lawyers — Build & Security** | Cybersecurity | WordPress, Incident Response, PHP, Security Hardening | [Live](https://themisfamilylawyers.com.au/) |
| 7 | **Hypex Web Platform & Subnetworks** | WordPress | WordPress, Custom PHP Plugins, Multi-Site | [Hypex](https://hypex.co.uk/) · [Axing](https://axing.uk/) · [Blog](https://blog.hypex.co.uk/) |
| 8 | **BERI Bangladesh Official Platform** | WordPress | WordPress, PHP, CSS3, JavaScript | [Live](https://www.beri.com.bd/) |
| 9 | **MAC Technology Australia** | WordPress | WordPress, PHP, Responsive UI, SEO | [Live](https://mactechnology.com.au/) |
| 10 | **MHS Download Manager** | Desktop & Core | Python, Multi-Threading, HTTP Byte-Range Streams, Browser Ext | [GitHub](https://github.com/sshihabb007/MHS-DOWNLOAD-MANAGER) |
| 11 | **MERN E-Commerce Website** | Full-Stack & CRM | MongoDB, Express, React, Node.js, REST API | [GitHub](https://github.com/sshihabb007/MERN-WEBSITE-E-COMMERCE) |
| 12 | **Modern Online Device Shop** | Full-Stack & CRM | Laravel, PHP, MySQL, Tailwind CSS, MVC | [GitHub](https://github.com/sshihabb007/MODERN-ONLINE-DEVICE-SHOP) |
| 13 | **ReactJs Online SmartPhone Shop** | Full-Stack & CRM | React, JavaScript, CSS3, SPA | [GitHub](https://github.com/sshihabb007/ReactJs---Online-SmartPhone-Shop) |
| 14 | **WAI APAC Awards Rasa Chatbot** | AI & Agents | Python, Rasa, TensorFlow, Scikit-Learn, NLP | [GitHub](https://github.com/sshihabb007/AI-CHATBOT-PROJECT) |
| 15 | **AIUB Online Forum** | Full-Stack & CRM | ASP.NET, C#, SQL Server, HTML5, CSS3 | [GitHub](https://github.com/sshihabb007/AIUB-Online-Forum-ASP.NET-) |
| 16 | **Online Smartphone Shop (PHP & AJAX)** | Full-Stack & CRM | PHP, JavaScript, AJAX, jQuery, MySQL | [GitHub](https://github.com/sshihabb007/Online-Smartphone-Shop-PhP-JAVASCRIPT-AJAX-Jquery-CSS-) |
| 17 | **Hospital Management System** | Desktop & Core | C#, Oracle 10g, PL/SQL, Windows Forms | [GitHub](https://github.com/sshihabb007/Hospital-Management-System-by-Oracle-10G-and-PLSQL) |
| 18 | **Inventory Management System** | Desktop & Core | C#, .NET, Windows Forms, SQL | [GitHub](https://github.com/sshihabb007/Inventory_Management_System_C-) |
| 19 | **SHIHAB-SmartBook** | Desktop & Core | Java, Java Swing, OOP, MVC, File I/O | [GitHub](https://github.com/sshihabb007/SHIHAB-SmartBook) |
| 20 | **AIUB Grading System** | Desktop & Core | C++, Data Structures, Algorithms, OOP | [GitHub](https://github.com/sshihabb007/AIUB-Grading-System-C-) |
| 21 | **ASP.NET Projects & UI Architecture** | Full-Stack & CRM | ASP.NET, C#, HTML5, CSS3 | [GitHub](https://github.com/sshihabb007/ASP.NET-projects-HTML-demo) |
| 22 | **Budget Shop & Care Connects** | WordPress | WordPress, PHP, Bootstrap, bKash / Rocket, WooCommerce | [GitHub](https://github.com/sshihabb007) |
| 23 | **Pricevisible** | Full-Stack & CRM | PHP, MySQL, HTML5, CSS3, JavaScript | [GitHub](https://github.com/sshihabb007/Pricevisible) |
| 24 | **Shihab Site Auditor Pro** | Tools & SEO | JavaScript, Technical SEO, DOM API | [GitHub](https://github.com/sshihabb007/Shihab-Site-Auditor-pro) |
| 25 | **SITE-ANALYTICS-BY-SHIHAB** | Tools & SEO | PHP, MySQL, Analytics, JavaScript | [GitHub](https://github.com/sshihabb007/SITE-ANALYTICS-BY-SHIHAB) |
| 26 | **google-photos-album-url-fetch** | Tools & SEO | Node.js, NPM Package, Puppeteer | [GitHub](https://github.com/sshihabb007/google-photos-album-image-url-fetch) |
| 27 | **PC Power & Electric Bill Calculator** | Tools & SEO | JavaScript, HTML5, CSS3, PWA | [Bundled Source](public/power-calculator/index.html) · [GitHub](https://github.com/sshihabb007/PC-Power-Calculator) |
| 28 | **Multi-Tier Income Tax Calculator** | Tools & SEO | JavaScript, HTML5, CSS3, Finance | [Bundled Source](public/tax-calculator/index.html) · [GitHub](https://github.com/sshihabb007/TAX-Calculator) |

### Bundled Live Web Tools (11 Standalone Apps)

All 11 web tools are shipped directly inside `public/` with zero external backend dependencies and can be previewed inside the portfolio modal or opened full-screen:

| # | Tool Name | Category | Public Route | Highlights |
| :- | :-------- | :------- | :----------- | :--------- |
| 1 | **Advanced Scientific Calculator** | Scientific & Math | `/advanced-calculator/index.html` | Trigonometry, logarithms, factorials, memory registers, expression history & keyboard shortcuts. |
| 2 | **Audio to Text AI Transcriber** | AI & Media Suite | `/audio-to-text/index.html` | Real-time Web Speech API dictation, waveform feedback, copy & transcript export. |
| 3 | **Image & Audio Converter / Compressor** | AI & Media Suite | `/compressor/index.html` | 100% client-side Canvas & WebAudio media compression/conversion with before/after metrics. |
| 4 | **Universal Video & Audio Downloader UI** | AI & Media Suite | `/universal-downloader/index.html` | Multi-platform stream URL parser, quality/bitrate selector & format workflow UI. |
| 5 | **Bangladesh Income Tax Calculator** | Finance & Utility | `/tax-calculator/index.html` | Multi-tier marginal tax slabs, exemptions, investment rebates & net liability summary. |
| 6 | **Real-Time Currency Converter** | Finance & Utility | `/currency-converter/index.html` | Global FX rate lookups, instant base/target currency swap & precision formatting. |
| 7 | **Electric Bill & PC Power Calculator** | Scientific & Math | `/power-calculator/index.html` | Monthly residential kWh tariff calculator & desktop CPU/GPU/PSU TDP wattage estimator. |
| 8 | **BD Land Measurement Calculator** | Scientific & Math | `/land-calculator/index.html` | Converts Sq.Ft, Sq.M, Decimal (Shotok), Katha, Bigha & Acres for Bangladesh land surveys. |
| 9 | **QR Code Generator Pro** | Finance & Utility | `/qr-generator/index.html` | Custom foreground/background colors, sizing & high-res PNG export for URLs, Wi-Fi & vCards. |
| 10 | **BMI & Health Metrics Calculator** | Scientific & Math | `/bmi-calculator/index.html` | Metric (`cm/kg`) & Imperial (`ft-in/lb`) inputs with WHO category gauge & healthy weight range. |
| 11 | **Age Calculator Pro** | Scientific & Math | `/age-calculator/index.html` | Exact chronological age (years, months, days, hours) plus live next-birthday countdown. |

### Google & Gemini Certifications (5 Verified Credentials)

All 5 credentials are officially verifiable via Google for Education's Accredible Wallet:  
👉 **[Verify on Google Accredible Wallet](https://edu.google.accredible.com/profile/mehedihasanshihab922213/wallet)**

1. **Gemini Certified Educator** — *Google for Education* (`Generative AI & Gemini · Prompt Crafting · Ethical Pedagogy`)
2. **Gemini Certified Faculty** — *Google for Education* (`Higher Ed & Academic Research · Curriculum Design`)
3. **Gemini Certified University Student** — *Google for Education* (`Multimodal AI · Active Learning & Research`)
4. **Google Certified Educator Level 2** — *Google for Education* (`Advanced EdTech · Digital Curriculum Architecture`)
5. **Google Certified Educator Level 1** — *Google for Education* (`Google Workspace for Education · Collaborative Workflows`)

### Contact Channels & Academic References

- **Direct Contact**:
  - **Email**: [sshihabb007@gmail.com](mailto:sshihabb007@gmail.com)
  - **Phone / WhatsApp**: `+880 1521-213853` ([WhatsApp Direct](https://wa.me/8801521213853))
  - **Location**: Gazipur-1704 / Banani, Dhaka, Bangladesh
- **Academic References**:
  - **Dr. Khandaker Tabin Hasan** — Professor & Head of Graduate Program, CS & Dept. of MIS, Faculty of Science and Technology, AIUB (`tabin@aiub.edu`)
  - **Dr. S. M. Hasan Mahmud** — Assistant Professor, Faculty of Science and Technology, AIUB / DIU (`hasan.swe@aiub.edu`)

---

## Tech Stack & Performance Architecture

- **Frontend**: React `19.0` + TypeScript `5.7` (strict mode)
- **Build Tooling**: Vite `6.4` with ES module code-splitting (`manualChunks` / dynamic `import()` per 3D mode)
- **3D & Shaders**: Three.js `0.174` with custom GLSL vertex/fragment shaders, `DisposableBag` GPU geometry/material lifecycle cleanup, and `ThemePalette` smooth color interpolation
- **Styling & Typography**: Custom CSS property architecture (`ayanBase.css` + `tokensBridge.css`) using `Syne`, `Plus Jakarta Sans`, `DM Sans`, `JetBrains Mono`, and `Kalam`
- **Built-in Runtime Optimizations**:
  - **Persistent WebGL Contexts**: Switching between the 9 WebGL modes crossfades shaders inside the existing `WebGLRenderer` instances without tearing down or recreating GPU contexts.
  - **Viewport & Visibility Throttling**: `IntersectionObserver` and `visibilitychange` listeners pause `requestAnimationFrame` loops automatically when the Hero canvas scrolls out of view or the browser tab is backgrounded.
  - **Idle Hydration**: WebGL scenes initialize via `requestIdleCallback` (`onIdle`) so first paint and LCP text remain instantaneous.
  - **Accessibility & Motion**: Honors `prefers-reduced-motion: reduce` across smooth scrolling, stat counters, score dials, and WebGL loops.

---

## Repository Structure

```text
PortF/
├── public/
│   ├── asset/                        # Portrait (Shihab.jpg), CV (shihabCV.pdf), favicon & institution crests
│   ├── advanced-calculator/          # Standalone Tool #1: Advanced Scientific Calculator
│   ├── age-calculator/               # Standalone Tool #2: Age Calculator Pro
│   ├── audio-to-text/                # Standalone Tool #3: Audio to Text AI Transcriber
│   ├── bmi-calculator/               # Standalone Tool #4: BMI & Health Metrics Calculator
│   ├── compressor/                   # Standalone Tool #5: Image & Audio Converter / Compressor
│   ├── currency-converter/           # Standalone Tool #6: Real-Time Currency Converter
│   ├── land-calculator/              # Standalone Tool #7: BD Land Measurement Calculator
│   ├── power-calculator/             # Standalone Tool #8: Electric Bill & PC Power Calculator
│   ├── qr-generator/                 # Standalone Tool #9: QR Code Generator Pro
│   ├── tax-calculator/               # Standalone Tool #10: Bangladesh Income Tax Calculator
│   └── universal-downloader/         # Standalone Tool #11: Universal Video & Audio Downloader UI
├── src/
│   ├── components/
│   │   ├── BackgroundCanvas.tsx      # NetworkBackground, 2D fallback, SketchBackdrop & CyberCursor
│   │   ├── Certifications.tsx        # Accredible Wallet banner & 5 conic-ring certification cards
│   │   ├── Contact.tsx               # Contact cards, live validation form, confetti burst & references
│   │   ├── Education.tsx             # Scroll-filled timeline rail & animated SVG GPA/CGPA score dials
│   │   ├── Experience.tsx            # Career timeline rail, 3D spinning-globe website chips & tech pills
│   │   ├── Footer.tsx                # Copyright footer & floating ScrollToTop button
│   │   ├── Hero.tsx                  # 3D HeroScene, neural brain SVG, sketch doodles, avatar tilt & AnimPicker
│   │   ├── Icons.tsx                 # 10 AnimationIcons, 17 multi-shape ServiceIcons, brand & UI SVGs
│   │   ├── Navbar.tsx                # Sticky header, scroll-spy indicator, mobile menu & mode dropdown
│   │   ├── Projects.tsx              # 2D gliding filter bar, 28 project cards & circular reveal modal
│   │   ├── SectionHeader.tsx         # Shared section headings & IntersectionObserver useReveal hook
│   │   ├── Services.tsx              # Aurora blobs & 6 3D-tilting conic-border service cards
│   │   ├── Skills.tsx                # FLIP-animated 44-skill grid, Git language bars & traits cards
│   │   └── ToolsSection.tsx          # 3D DNA helix backdrop, 11 web tool cards & Quick Preview modal
│   ├── data/
│   │   └── portfolioData.ts          # Single source of truth for all typed portfolio content
│   ├── styles/
│   │   ├── ayanBase.css              # Core 10-mode theme tokens, keyframes & component animations
│   │   └── tokensBridge.css          # Dynamic secondary surface/shadow variable mappings & modal layout
│   ├── three/
│   │   ├── modes/                    # 10 lazy-loaded modes (galaxy, neural, code, waves, warp, tunnel, pulse, thunder, wildfire, sketch) + shared dust/stormfx
│   │   ├── animationStore.ts         # External store syncing mode state, localStorage & <html data-animation-mode>
│   │   ├── createHeroScene.ts        # Portrait-anchored Hero WebGL scene & mode crossfader
│   │   ├── createNetworkScene.ts     # Full-viewport section-tinted ambient WebGL controller
│   │   ├── createPublicationScene.ts # 3D interactive DNA double-helix scene for Live Web Tools
│   │   └── util.ts                   # Shaders (AVOID_GLSL, NOISE_GLSL), DisposableBag, ThemePalette & math helpers
│   ├── utils/
│   │   ├── scroll.ts                 # Smooth cubic-eased anchor scrolling, WebGL probe & theme observer
│   │   └── techColor.ts              # Deterministic FNV-1a hue hashing for technology badges
│   ├── App.tsx                       # Root application shell & Dark/Light state synchronization
│   └── main.tsx                      # React 19 root mount & stylesheet entry
├── index.html                        # SEO/OpenGraph tags, JSON-LD Person schema, Google Fonts & zero-FOUC init script
├── package.json                      # Scripts & pinned React 19 / Three.js / Vite 6 dependencies
├── tsconfig.json                     # Strict TypeScript compiler configuration
└── vite.config.ts                    # Vite bundler & chunking configuration
```

---

## Getting Started & Commands

### Prerequisites

- **Node.js**: `v18.18+` or `v20+` / `v22+` recommended
- **npm**: `v9+`

### Installation & Local Development

```bash
# 1. Clone the repository
git clone https://github.com/sshihabb007/Shihab-Portfolio-2.git
cd Shihab-Portfolio-2

# 2. Install dependencies
npm install

# 3. Start the Vite development server (http://localhost:5173)
npm run dev
```

### Type-Check & Production Build

```bash
# Run strict TypeScript check (tsc -b) and build optimized dist/ bundle
npm run build

# Locally preview the production build
npm run preview
```

---

## Customization & Deployment

- **Updating Portfolio Content**: Edit [`src/data/portfolioData.ts`](src/data/portfolioData.ts) to add or modify projects, skills, certifications, experience entries, web tools, or contact links—all UI counts, filter tabs, and modals update automatically.
- **Replacing Resume or Portrait**: Drop updated files into `public/asset/` (`shihabCV.pdf`, `Shihab.jpg`, `fav.png`) or update their paths in `PORTFOLIO_DATA.hero`.
- **Changing Default Animation Mode**: Update `DEFAULT_ANIMATION_MODE` in [`src/three/animationStore.ts`](src/three/animationStore.ts) and the fallback string in [`index.html`](index.html) (`'galaxy'`, `'neural'`, `'code'`, `'waves'`, `'warp'`, `'tunnel'`, `'pulse'`, `'thunder'`, `'wildfire'`, or `'sketch'`).
- **Static Hosting Deployment (Vercel / Netlify / Cloudflare Pages / GitHub Pages)**:
  - **Build command**: `npm run build`
  - **Publish directory**: `dist`
  - All 11 bundled tools inside `public/` are copied automatically to `dist/` at their root-relative paths.

---

## Author & Links

**Mehedi Hasan Shihab**  
*Senior Software Engineer · Full-Stack & AI Developer · Cybersecurity Specialist*

- **GitHub**: [github.com/sshihabb007](https://github.com/sshihabb007)
- **LinkedIn**: [linkedin.com/in/mehedi-hasan-shihab](https://www.linkedin.com/in/mehedi-hasan-shihab)
- **Facebook**: [facebook.com/sshihabb007](https://www.facebook.com/sshihabb007/)
- **Google Accredible Wallet**: [edu.google.accredible.com/profile/mehedihasanshihab922213/wallet](https://edu.google.accredible.com/profile/mehedihasanshihab922213/wallet)
- **Email**: [sshihabb007@gmail.com](mailto:sshihabb007@gmail.com)

---

© Mehedi Hasan Shihab. All rights reserved.

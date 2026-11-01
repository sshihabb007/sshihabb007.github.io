# Mehedi Hasan Shihab — Interactive 3D Developer Portfolio

Official developer portfolio of **Mehedi Hasan Shihab** — Senior Software Engineer at **Bangladesh Education and Research Institute (BERI)**, Remote Web Developer at **MAC Technology Australia Pty Ltd.**, Full-Stack & Google Gemini / Agentic AI Developer, and Google for Education Certified Educator.

---

## Key Highlights

- **Dual Synchronized Three.js WebGL Engine (`10` Switchable Modes)**:
  - Interactive Hero scene (`createHeroScene`) + full-viewport ambient background (`createNetworkScene`) with automatic 2D `<canvas>` constellation fallback and section-reactive color tinting.
  - **10 real-time GLSL shader modes**: `Galaxy`, `Neural`, `Code` (with `#19f58b` Cyber Crosshair reticle & HUD breach overlays), `Waves`, `Warp`, `Tunnel`, `Vortex`, `Pulse`, `Thunderstorm` (click-to-strike lightning), and `Wild Fire` (click-to-ignite embers).
- **Dark & Light Theme System**: Zero-FOUC theme initialization persisted in `localStorage` with smooth glassmorphic surfaces (`Syne`, `Plus Jakarta Sans`, `DM Sans`, and `JetBrains Mono`).
- **Complete Career & Engineering Showcase**:
  - **Education (`4` Milestones)**: Animated SVG circular CGPA/GPA dials (`M.Sc. in CS — AIUB 3.77/4.00`, `B.Sc. in CSE — AIUB 3.65/4.00`, `HSC — SSAC 4.90/5.00`, `SSC — SSAC 5.00/5.00`).
  - **Technical Arsenal (`44` Skills)**: Sliding pill category filter, Web Animations API **FLIP** layout transitions, Git language distribution, personal traits, research interests, and language proficiency.
  - **Services (`6` Core Offerings)**: 3D cursor-tilting cards with rotating conic borders (`@property --sa`).
  - **Work Experience (`3` Roles)**: Scroll-filling timeline rail, live pulse indicators, and spinning-globe domain-typing website chips.
  - **Featured Projects (`28` Projects)**: Category filtering, glowing vector emblems, ripple triggers, and a **Circular Clip-Path Reveal Modal** with `01 / 28` counter and `←` / `→` / `Esc` keyboard navigation.
  - **Live Web Tools (`11` Bundled Apps)**: Standalone interactive tools (`Advanced Scientific Calculator`, `Audio to Text AI`, `Image & Audio Compressor`, `Universal Downloader`, `BD Income Tax Calculator`, `Real-Time Currency Converter`, `Electric Bill & PC Power Calculator`, `BD Land Measurement Calculator`, `QR Code Generator Pro`, `BMI Health Calculator`, `Age Calculator Pro`) with in-page **Quick Preview** sandbox modals and full-tab launch.
  - **Verified Credentials (`5` Google & Gemini Certifications)**: Linked directly to the official Google for Education Accredible Wallet.
  - **Interactive Contact & Academic References**: Live `0 / 3 ready` validation progress bar, 18-piece confetti burst, and academic references.

---

## Tech Stack

- **Framework**: React 19 + TypeScript 5.8
- **Bundler**: Vite 6
- **3D & Shaders**: Three.js (`three`) + custom GLSL vertex/fragment shaders
- **Styling**: Custom CSS Custom Properties (`ayanBase.css` + `tokensBridge.css`)

---

## Getting Started

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Type-check and build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## Project Structure

```text
Shihab-Portfolio/
├── public/                  # Portrait, CV PDF, icons & 11 standalone live web tools
├── src/
│   ├── components/          # Modular React UI sections, modals & SVG icon system
│   ├── data/
│   │   └── portfolioData.ts # Complete typed dataset (Hero, Education, Skills, Projects, Tools, Certs, Contact)
│   ├── styles/              # Core design tokens, responsive rules & animations
│   ├── three/               # Dual Three.js WebGL controllers & 10 lazy-loaded shader modes
│   ├── utils/               # Smooth scroll physics, WebGL capability check & deterministic tech colors
│   ├── App.tsx              # Root layout & theme state
│   └── main.tsx             # Application entry point
├── index.html               # SEO metadata, JSON-LD Person schema & zero-FOUC theme script
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Author

**Mehedi Hasan Shihab**
- **Email**: [sshihabb007@gmail.com](mailto:sshihabb007@gmail.com)
- **GitHub**: [github.com/sshihabb007](https://github.com/sshihabb007)
- **LinkedIn**: [linkedin.com/in/mehedi-hasan-shihab](https://www.linkedin.com/in/mehedi-hasan-shihab)
- **Accredible Wallet**: [Google for Education Verified Credentials](https://edu.google.accredible.com/profile/mehedihasanshihab922213/wallet)

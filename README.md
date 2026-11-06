# Mehedi Hasan Shihab — Interactive 3D & 10-Mode Portfolio (HTML + Tailwind CSS + Vanilla JS)

Official interactive developer & AI engineering portfolio of **Mehedi Hasan Shihab** (`sshihabb007`), built with **pure HTML5, Tailwind CSS, Vanilla JavaScript, and Three.js WebGL** — zero build step required.

---

## Key Highlights

- **Zero-Build HTML + Tailwind CSS + Vanilla JS**: Runs directly over XAMPP (`http://localhost/REA/HTML%20TAILWINDCSS%20JS/`), any static HTTP server (`npx serve .`), GitHub Pages, or direct `index.html` open.
- **10 Live Switchable Animation Modes**:
  1. **Galaxy** — Spiral nebula, starfield, and 4 orbiting wireframe planets
  2. **Neural** — Synaptic network with traveling signal pulses + glowing Hero neural brain watermark
  3. **Code** — Digital matrix rain + neon `#19f58b` `CyberCursor` crosshair
  4. **Waves** — 3D ocean surface waves + smooth wave rings around the Hero portrait
  5. **Warp** — Radial hyperspace starlight warp tunnel
  6. **Tunnel** — Geometric wireframe portal fly-through
  7. **Pulse** — Concentric sonar shockwaves radiating across 3D space
  8. **Thunder** — Atmospheric auto-lightning + click-anywhere interactive lightning strikes
  9. **Wildfire** — Rising glowing embers + click-to-ignite fire bursts
  10. **Sketch** — Hand-drawn graph-paper notebook theme with 25-doodle `SketchBackdrop`, Hero pencil doodles, crayon header doodle, and `sketchPencilPass` portrait reveal
- **3 Persistent Three.js WebGL Controllers**:
  - `createNetworkScene` — Global viewport 3D background morphing seamlessly across all 9 WebGL modes with zero context churn (plus automatic 2D `<canvas>` constellation fallback)
  - `createHeroScene` — Geodesic wireframe icosahedron + cursor-reactive particle rings framing the `310×310` Hero portrait
  - `createPublicationScene` — 3D DNA double-helix with glowing base-pair rungs behind the `#tools` section
- **Complete Portfolio Sections**:
  - **Navbar**: `SHIHAB` wordmark, 9 scroll-spy links with gliding `.nav-indicator`, Dark/Light toggle, and mobile animation & navigation drawers
  - **Hero (`#home`)**: Typewriter subtitle, word-by-word animated bio, CV download (`./asset/shihabCV.pdf`), 7 social links, 3D-tilting portrait, expandable `AnimPicker` radio dock, and animated stat counters (`28+`, `7+`, `5`)
  - **Education (`#education`)**: Scroll-filled timeline rail, 4 degree cards (`AIUB` M.Sc. `3.77/4.00`, `AIUB` B.Sc. `3.65/4.00`, `SSAC` HSC `4.90/5.00`, `SSAC` SSC `5.00/5.00`), and animated SVG circular GPA dials (`94%`, `91%`, `98%`, `100%`)
  - **Technical Skills (`#skills`)**: 7-category 2D gliding filter bar, 44-skill grid with Web Animations API **FLIP** layout transitions, Git language distribution bar, and spoken languages
  - **Services (`#services`)**: 6 3D-tilting service cards with rotating conic borders and custom SVG icons
  - **Experience (`#experience`)**: Scroll-spark timeline rail, 3 engineering roles (`BERI`, `MAC Technology Australia`, `i - Global Services`), 3D spinning-globe website chips with typewriter hostname tooltips, and FNV-1a hue-hashed stack pills
  - **Projects (`#projects`)**: 28 projects across 6 categories, 2D gliding filter pill, button ripples, and **Circular Clip-Path Reveal Modal** (`pmReveal` / `pmUnreveal`) with scroll progress bar and `←` / `→` / `Esc` keyboard navigation
  - **Live Web Tools (`#tools`)**: 11 bundled standalone client-side utilities (`advanced-calculator`, `age-calculator`, `audio-to-text`, `bmi-calculator`, `compressor`, `currency-converter`, `land-calculator`, `power-calculator`, `qr-generator`, `tax-calculator`, `universal-downloader`) with **Quick Preview** sandbox iframe modal and **Launch Live Tool** full-tab mode
  - **Certifications (`#certifications`)**: Verified Google for Education Accredible Wallet banner + 5 official credential cards
  - **Contact (`#contact`)**: 6 interactive contact cards, live `0 / 3 ready` message form validation with 18-particle confetti burst (`mailto:sshihabb007@gmail.com`), and 2 Academic Reference cards

---

## Project Structure

```text
HTML TAILWINDCSS JS/
├── index.html                 # Main semantic HTML5 + Tailwind CSS entry point
├── tailwind.config.js         # Tailwind CSS theme & token configuration
├── css/
│   ├── portfolio-base.css     # Core design tokens, 10 animation mode themes & keyframes
│   ├── portfolio-bridge.css   # Component animations, timelines, picker dock & responsive rules
│   └── style.css              # Shared stylesheet preserved for the 11 standalone web tools
├── js/
│   ├── vendor/
│   │   └── three.min.js       # Bundled Three.js (r174) WebGL engine
│   ├── portfolio-data.js      # All portfolio content, 28 projects, 44 skills & 11 tools
│   ├── portfolio-icons.js     # SVG icon, illustration & Sketch/Neural doodle library
│   ├── portfolio-three.js     # Vanilla JS 3D WebGL scene controllers & animation mode store
│   ├── portfolio-app.js       # Interactive UI controller, FLIP filters, modals & scroll spy
│   └── ...                    # Shared scripts preserved for the 11 standalone web tools
├── asset/                     # Portrait, CV PDF, AIUB & SSAC crests, Gemini icon, favicon
└── <11 tool directories>/     # Standalone bundled client-side web utilities
```

---

## Running Locally

1. **Clone the `tailwind` Branch**:
   ```bash
   git clone -b tailwind https://github.com/sshihabb007/Shihab-Portfolio-2.git
   cd Shihab-Portfolio-2
   ```
2. **Via Static Dev Server**:
   ```bash
   npx serve .
   ```
3. **Via XAMPP / Apache**:
   Place the folder inside `htdocs/` and open it on `http://localhost/...`.
4. **Direct Browser Open**:
   Open `index.html` directly in any modern browser — all scripts and assets use relative `./` paths with classic `defer` loading so there are zero CORS module errors even over `file://`.


// tools/tools.js — Interactive catalog, search/filtering, URL state sync, and accessible
// specification modal for the Tools & Software Suite page by Mehedi Hasan Shihab (sshihabb007).

(function sshihabb007_initToolsModule() {
  'use strict';

  const mehedi_toolsCatalog = {
    'mhs-download-manager': {
      id: 'mhs-download-manager',
      title: 'MHS Download Manager',
      subtitle: 'High-Speed Windows x64 Download Accelerator, Smart Browser Stream Sniffer & Lossless Media Muxer',
      group: 'flagship',
      category: 'flagship',
      categoryLabel: 'Flagship Software',
      icon: 'fas fa-bolt',
      accent: 'blue',
      version: 'v1.0.7',
      license: 'MIT License',
      runtime: 'Windows 10/11 x64 · Chrome/Brave/Edge/Opera/Firefox MV3',
      overview:
        'Clean-room, open-source Windows x64 download accelerator (mdm.exe) paired with a Manifest V3 Chromium and Firefox browser extension suite. Engineered in pure C# (.NET Framework 4.8) and vanilla JavaScript with zero external NuGet packages, zero third-party DLLs, and a built-in lossless ISO-BMFF/Matroska container muxer that requires no external ffmpeg.exe installation.',
      specs: [
        { label: 'Platforms', value: 'Windows 10 / 11 (x64 Setup & Portable) + 14 Browsers (9 Chromium, 5 Firefox)' },
        { label: 'Core Engine', value: 'Pure C# (.NET Framework 4.8 csc.exe) · 1–128 Sparse NTFS Segments' },
        { label: 'Protocols & Media', value: 'HTTP/HTTPS, FTP/FTPS, BitTorrent/Magnet (BEP-3/9/10/15/19), HLS, InnerTube HD/4K' },
        { label: 'Security & Privacy', value: 'DoH, SOCKS5/PAC Relay, VPN Kill-Switch, Windows DPAPI Vault, SHA-256 Updater' }
      ],
      capabilities: [
        {
          lead: '1–128 Sparse Dynamic Segment Engine',
          detail: 'Pre-allocates unified NTFS sparse .mhs.part files (FSCTL_SET_SPARSE) with 4096-byte page-aligned dynamic halving, Connection 1 reuse, TTFB stall preemption, RFC 9110 ETag + 64-byte resume overlap checks, multi-segment FTP/FTPS, and CRC32/MD5/SHA-1/SHA-256/SHA-512 checksum verification.'
        },
        {
          lead: '14-Browser Capture & Pure C# Lossless Muxer',
          detail: 'Auto-registers Native Messaging across 9 Chromium + 5 Firefox browsers over an authenticated loopback bridge (127.0.0.1:45779). Features an outside-corner Download Video pill, MHS STREAM SNIFFER, DNR inline & POST form capture, EME DRM respect, InnerTube HD/4K resolver, and pure C# MP4/WebM/MKV muxing.'
        },
        {
          lead: 'BitTorrent, Media Suite & Debrid Cloud',
          detail: 'Includes a full BitTorrent & Magnet client (.torrent creator, UDP trackers, WebSeeds, IP blocklists), managed yt-dlp/ffmpeg/gallery-dl helpers, Real-Debrid / AllDebrid / Premiumize unlockers, Google Drive/Docs export, and Zip-Slip/bomb-safe archive extraction.'
        },
        {
          lead: 'Privacy, Kill-Switch & DPAPI Vault',
          detail: 'Encrypted DNS-over-HTTPS (Cloudflare, Google, Quad9, AdGuard, NextDNS, Custom), authenticated local SOCKS5 & WinHTTP PAC relay, strict Network Adapter / VPN Kill-Switch with netwatch auto-resume, Windows DPAPI credential storage, and Mark-of-the-Web tagging.'
        },
        {
          lead: 'LAN Remote QR Web UI, CLI, Headless & 15-Tool MCP Server',
          detail: 'Mobile-responsive LAN dashboard (:8463) with 8-digit pairing and ISO/IEC 18004 QR codes, Sun–Sat queue scheduler, RSS 2.0/Atom auto-downloader, 5 themes + .toml custom themes, 28 languages, crash watchdog, --headless daemon, full --cli, and a 15-tool --mcp JSON-RPC 2.0 stdio server.'
        },
        {
          lead: 'Fail-Closed GitHub Releases Auto-Updater',
          detail: 'Checks GitHub Releases with REST + web fallback, alerts via tray, themed dialog, and browser extension banner, verifies SHA256SUMS.txt before applying silent upgrades for both Setup and Portable editions.'
        }
      ],
      downloads: [
        {
          label: 'Setup Installer (x64)',
          meta: 'MHS-Download-Manager-Setup-1.0.7-x64.exe',
          url: 'https://github.com/sshihabb007/MHS-DOWNLOAD-MANAGER/releases/download/v1.0.7/MHS-Download-Manager-Setup-1.0.7-x64.exe'
        },
        {
          label: 'Portable Executable (x64)',
          meta: 'MHS-Download-Manager-Portable-1.0.7-x64.exe',
          url: 'https://github.com/sshihabb007/MHS-DOWNLOAD-MANAGER/releases/download/v1.0.7/MHS-Download-Manager-Portable-1.0.7-x64.exe'
        },
        {
          label: 'Browser Extension Archive',
          meta: 'MHS-Browser-Extension-1.0.7.zip (MV3)',
          url: 'https://github.com/sshihabb007/MHS-DOWNLOAD-MANAGER/releases/download/v1.0.7/MHS-Browser-Extension-1.0.7.zip'
        },
        {
          label: 'All Releases & SHA-256 Sums',
          meta: 'v1.0.7 → v1.0.0 on GitHub Releases',
          url: 'https://github.com/sshihabb007/MHS-DOWNLOAD-MANAGER/releases/latest'
        }
      ],
      snippetLabel: 'CLI & Automation Examples',
      snippet: 'mdm.exe /d <URL> /p <LocalPath> /n\nmdm.exe --cli get <URL>\nmdm.exe --cli status --json\nmdm.exe --headless\nmdm.exe --mcp',
      primaryAction: {
        label: 'Download v1.0.7',
        icon: 'fas fa-download',
        url: 'https://github.com/sshihabb007/MHS-DOWNLOAD-MANAGER/releases/latest',
        external: true
      },
      secondaryAction: {
        label: 'GitHub Repository',
        icon: 'fab fa-github',
        url: 'https://github.com/sshihabb007/MHS-DOWNLOAD-MANAGER',
        external: true
      }
    },

    'driverplus': {
      id: 'driverplus',
      title: 'Driver+',
      subtitle: 'Clean-Room Native 64-Bit Official WHQL Driver Updater, Game Runtime Doctor, Rescue Center & HVCI Auditor',
      group: 'flagship',
      category: 'flagship',
      categoryLabel: 'Flagship Software',
      icon: 'fas fa-microchip',
      accent: 'purple',
      version: 'v1.0.1',
      license: 'MIT License',
      runtime: 'Windows 10 / 11 Native PE32+ x86_64 · 432 KB Portable',
      overview:
        'Clean-room, native 64-bit (PE32+) Windows hardware and driver management suite built with zero third-party NuGet dependencies, zero background resident bloatware, and zero telemetry. Every update candidate comes exclusively from local Windows Update Agent (Microsoft.Update.Session) and the live Microsoft Update Catalog, verified against 40-hex SHA-1 CAB digests and WinVerifyTrust Authenticode signatures before calling newdev.dll!DiInstallDriverW.',
      specs: [
        { label: 'Platform & Architecture', value: 'Windows 10 / 11 (x64) · Native PE32+ x86_64 · Zero WOW64 Thunking' },
        { label: 'Measured Footprint', value: '432.0 KB Portable EXE / 530.5 KB Setup Wizard · 42.3 MB Warm RAM · 2.75 s Scan' },
        { label: 'Supply-Chain Trust', value: 'Microsoft WUA + Update Catalog · HTTPS Allowlist · SHA-1 CAB + WinVerifyTrust' },
        { label: 'Hardening & Privilege', value: 'asInvoker Least-Privilege (UAC on install only) · ASLR · DEP · PerMonitorV2 DPI' }
      ],
      capabilities: [
        {
          lead: 'Single-Pass Present & Unplugged Ghost Inventory',
          detail: 'Enumerates live and disconnected PnP devnodes via native 64-bit SetupAPI and CfgMgr32, ranking exact 4-part OEM SUBSYS hardware IDs above generic silicon IDs while blocking foreign-OEM cross-pollination and accidental downgrades.'
        },
        {
          lead: '4-Stage Cryptographic WHQL Update Gate',
          detail: 'Enforces strict *.windowsupdate.com / *.microsoft.com HTTPS redirect validation (1.5 GiB ceiling), 40-hex SHA-1 CAB digest checks, WinVerifyTrust Authenticode verification on .cat/.sys files, and atomic installation via newdev.dll!DiInstallDriverW.'
        },
        {
          lead: '14 Game Runtimes & Event ID 1000 Crash DLL Doctor',
          detail: 'Audits Visual C++ 2010–2022 (x86/x64), DirectX End-User, .NET 4.8+ & .NET Desktop 8/9, OpenAL, NVIDIA PhysX, and OpenJDK, and maps Windows Application Event ID 1000 faulting DLLs directly to official winget and vendor installers.'
        },
        {
          lead: 'Rescue Center, Rollback & Air-Gapped Offline Profiles',
          detail: 'Creates System Restore checkpoints (srclient.dll), exports Zip-Slip-guarded DriverStore .zip backups with .sha256 sidecars, supports 1-click DiRollbackDriver, and exports/imports portable .json hardware profiles for offline PCs.'
        },
        {
          lead: '6-Card Hardware Fix Toolbox & Windows 11 HVCI Auditor',
          detail: 'Includes Fix No Sound (CoreAudio), Device Error Code 1–52 & HRESULT Doctor, USB/HID Ghost Cleaner, Network & DNS Refresh, Display Mode Reset, and a Windows 11 Memory Integrity (HVCI) blocker auditor.'
        },
        {
          lead: '60fps DirectX WPF UI, Crash-Safe Game Boost & Web Telemetry Portal',
          detail: 'Hardware-accelerated dark glassmorphic desktop UI with tray mode, pre-boost snapshot recovery (PowrProf), Direct3D fullscreen focus guard, and an optional 127.0.0.1 loopback telemetry portal hardened with CSP nonces and 256-bit CSRF tokens.'
        }
      ],
      downloads: [
        {
          label: 'Latest GitHub Release (v1.0.1)',
          meta: 'DriverPlus Setup Wizard & Portable x64 EXE',
          url: 'https://github.com/sshihabb007/DriverPlus/releases/latest'
        },
        {
          label: 'Source Repository & Docs',
          meta: '16-suite TDD tests, spec.md & interactive architecture',
          url: 'https://github.com/sshihabb007/DriverPlus'
        }
      ],
      snippetLabel: 'CLI & Verification Modes',
      snippet: 'DriverPlus.exe --self-test\nDriverPlus.exe --scan-json scan.json\nDriverPlus.exe --scan-json scan.json --offline\nDriverPlus.exe --serve-ui --port 17890\nDriverPlus-Setup-1.0.1-x64.exe --silent',
      primaryAction: {
        label: 'Download v1.0.1',
        icon: 'fas fa-download',
        url: 'https://github.com/sshihabb007/DriverPlus/releases/latest',
        external: true
      },
      secondaryAction: {
        label: 'GitHub Repository',
        icon: 'fab fa-github',
        url: 'https://github.com/sshihabb007/DriverPlus',
        external: true
      }
    },

    'vsc': {
      id: 'vsc',
      title: 'Video Speed Controller (VSC)',
      subtitle: 'Lightweight Manifest V3 HTML5 Video & Audio Speed Controller for Chrome & Brave',
      group: 'flagship',
      category: 'flagship',
      categoryLabel: 'Flagship Extension',
      icon: 'fas fa-tachometer-alt',
      accent: 'pink',
      version: 'v1.0.2',
      license: 'MIT License',
      runtime: 'Chrome & Brave (Chromium 111+) · Manifest V3',
      overview:
        'Precision HTML5 <video> and <audio> playback speed controller engineered for minimal runtime overhead, Shadow DOM isolation, SPA navigation resilience, intelligent playback-rate arbitration, and live per-platform / site-wise controller positioning — with zero custom CSS required and strictly minimal “storage” permission.',
      specs: [
        { label: 'Browsers & Standard', value: 'Google Chrome & Brave Browser (Chromium 111+) · Manifest V3' },
        { label: 'Permissions & Privacy', value: '“storage” only · Zero analytics · Zero external network calls' },
        { label: 'Speed Range & Precision', value: '0.07× to 16.00× continuous control with smart 1.00× snapping' },
        { label: 'Rendering Architecture', value: 'Shadow DOM + shared constructable CSSStyleSheet · GPU translate3d drag' }
      ],
      capabilities: [
        {
          lead: 'Per-Platform & Site-Wise Positioning Studio (No Custom CSS)',
          detail: 'Configure independent overlay positions for Global Default, YouTube, Facebook, Instagram, X (Twitter), or any custom domain / regex rule. Anchor to 8 corners/edges, nudge in 1px/5px/10px/25px increments, or enter exact Offset X/Y pixels with a real-time 16:9 Live Preview Stage.'
        },
        {
          lead: 'Popup Quick Site Positioning & Live Tab Sync',
          detail: 'Switch anchor points or nudge offsets directly from the toolbar popup and watch open video tabs update live without reloading, or drag the badge temporarily over any video during playback.'
        },
        {
          lead: 'Speed Arbiter & Intent Classifier',
          detail: 'Dedicated site handlers (YouTube, Facebook, Netflix, and generic HTML5 players) detect hostile player playback-rate resets without interfering with legitimate seeks and suppress false feedback loops.'
        },
        {
          lead: 'Shadow DOM Isolation & Fullscreen-Aware Anchoring',
          detail: 'Backed by a single shared constructable CSSStyleSheet, ResizeObserver, and MutationObserver so overlays remain cleanly anchored inside responsive and fullscreen players without mutating host layout.'
        },
        {
          lead: 'Full Keyboard Shortcuts, Mouse Wheel & Timestamp Markers',
          detail: 'Default keys X (-0.1×), C (+0.1×), S/D (rewind/advance 5s), Z (reset 1.0×), G (toggle 1.6×), V (hide/show), and M/J (bookmark/jump timestamps) — all customizable with Ctrl/Alt/Shift/Meta chords plus Pause, Mute, and Volume controls.'
        }
      ],
      downloads: [
        {
          label: 'Pre-Built Extension Release (v1.0.2)',
          meta: 'VideoSpeedController-v1.0.2.zip (Load Unpacked)',
          url: 'https://github.com/sshihabb007/VSC/releases/latest'
        },
        {
          label: 'Source Code & Build Pipeline',
          meta: 'esbuild bundler + unit & live Chrome/Brave E2E tests',
          url: 'https://github.com/sshihabb007/VSC'
        }
      ],
      snippetLabel: 'Default Keyboard Shortcuts',
      snippet: 'X / C  → Decrease / Increase speed (±0.1×)\nS / D  → Rewind / Advance (5s)\nZ / G  → Reset to 1.0× / Toggle preferred 1.6×\nV      → Show / Hide controller overlay\nM / J  → Set / Jump to timestamp marker',
      primaryAction: {
        label: 'Download v1.0.2',
        icon: 'fas fa-download',
        url: 'https://github.com/sshihabb007/VSC/releases/latest',
        external: true
      },
      secondaryAction: {
        label: 'GitHub Repository',
        icon: 'fab fa-github',
        url: 'https://github.com/sshihabb007/VSC',
        external: true
      }
    },

    'master-vpn-pro': {
      id: 'master-vpn-pro',
      title: 'MASTER VPN PRO',
      subtitle: 'Open-Source Multi-Platform VPN & Privacy Shield for Windows, Chrome/Brave & Android',
      group: 'flagship',
      category: 'flagship',
      categoryLabel: 'Flagship Suite',
      icon: 'fas fa-shield-alt',
      accent: 'green',
      version: 'v1.3.1',
      license: 'MIT License',
      runtime: 'Windows 10/11 · Chrome & Brave MV3 · Android 8.0–14+ APK',
      overview:
        'Unified open-source multi-platform VPN and privacy shield spanning Windows Desktop (Setup & ~310 KB AnyCPU Portable), Chrome & Brave Manifest V3 Extension (.zip & signed .crx3), and Android 8.0–14+ Signed APK (com.shihab.shieldvpn). Connects to 70+ country open relay feeds and user-owned private servers with zero telemetry, zero ads, and zero resident background services when closed.',
      specs: [
        { label: 'Platforms', value: 'Windows 10/11 (x64/ARM64/x86) · Chrome & Brave MV3 · Android 8.0–14+ APK' },
        { label: 'Supported Protocols', value: 'MS-SSTP, IKEv2/IPsec (MOBIKE), L2TP, PPTP, WireGuard (.conf), OpenVPN (.ovpn), HTTP/HTTPS/SOCKS5' },
        { label: 'Gateway Discovery', value: '70+ Countries · Parallel Direct-IP 1-RTT Race (28-way TCP / 18-way SSTP / 16-thread Android)' },
        { label: 'Security Guarantees', value: 'Windows DPAPI Secret Store · Origin-Locked 127.0.0.1:38195 Bridge · Tunnel-Scoped Secure DNS · Kill-Switch' }
      ],
      capabilities: [
        {
          lead: 'Unified Dark Bento UI & 3D Fibonacci Globe Across 3 Platforms',
          detail: 'Interactive 3D / Shield / Orbit / 2D globe visualization paired with a 70+ country relay aggregator (VPN Gate Academic Pool & open proxy/IPsec feeds across Americas, EMEA, and Asia & Oceania) plus custom private server imports.'
        },
        {
          lead: 'Native Kernel/OS Layer-3 Tunnels & Fail-Closed Browser PAC',
          detail: 'Uses native Win32 rasapi32.dll / isolated .pbk MS-SSTP & IKEv2 tunnels on Windows, Android VpnService & Android 11+ Ikev2VpnProfile on mobile, and fail-closed multi-proxy Chromium PAC + WebRTC leak blocking in the browser extension.'
        },
        {
          lead: 'Parallel Direct-IP 1-RTT Lowest-Latency Gateway Race',
          detail: 'Probes gateways in parallel directly by IP (eliminating DNS inflation) for fast auto-connect, complemented by 1-click Dynamic IP Rotation across unvisited country gateways and 1-click .ovpn profile export.'
        },
        {
          lead: 'Split-Tunneling, Tunnel-Scoped Secure DNS & Kill-Switch',
          detail: 'Supports route split-tunneling on Windows, per-domain PAC bypass in browsers, and per-app exclusions (addDisallowedApplication) on Android; applies Cloudflare 1.1.1.1, AdGuard AdBlock, Quad9, or Google DNS strictly to the virtual interface without overwriting physical adapters.'
        },
        {
          lead: 'Zero Plaintext Secrets & Dual-Stack Leak Auditing',
          detail: 'Encrypts Windows credentials via DPAPI and runs authenticated proxies through an ephemeral loopback bridge (127.0.0.1:0). Built-in Cloudflare HTTPS speed benchmark and dual-stack GeoIP/ASN leak verifier alert immediately if observed egress country mismatches.'
        }
      ],
      downloads: [
        {
          label: 'Windows Setup Wizard',
          meta: 'MASTER-VPN-PRO-Setup-1.3.1.exe',
          url: 'https://github.com/sshihabb007/MASTER-VPN-PRO/releases/download/v1.3.1/MASTER-VPN-PRO-Setup-1.3.1.exe'
        },
        {
          label: 'Windows Portable (~310 KB)',
          meta: 'MASTER-VPN-PRO-Portable-1.3.1.exe (AnyCPU)',
          url: 'https://github.com/sshihabb007/MASTER-VPN-PRO/releases/download/v1.3.1/MASTER-VPN-PRO-Portable-1.3.1.exe'
        },
        {
          label: 'Chrome & Brave Extension',
          meta: 'MASTER-VPN-PRO-Browser-Extension-1.3.1.zip',
          url: 'https://github.com/sshihabb007/MASTER-VPN-PRO/releases/download/v1.3.1/MASTER-VPN-PRO-Browser-Extension-1.3.1.zip'
        },
        {
          label: 'Android Signed APK (8.0–14+)',
          meta: 'MASTER-VPN-PRO-Android-1.3.1.apk',
          url: 'https://github.com/sshihabb007/MASTER-VPN-PRO/releases/download/v1.3.1/MASTER-VPN-PRO-Android-1.3.1.apk'
        }
      ],
      snippetLabel: 'Windows Desktop CLI Automation',
      snippet: '.\\MasterVpnPro.exe --status\n.\\MasterVpnPro.exe --connect-auto\n.\\MasterVpnPro.exe --disconnect\n.\\MasterVpnPro.exe --minimized\n.\\MasterVpnPro.exe --self-test',
      primaryAction: {
        label: 'Download v1.3.1',
        icon: 'fas fa-download',
        url: 'https://github.com/sshihabb007/MASTER-VPN-PRO/releases/latest',
        external: true
      },
      secondaryAction: {
        label: 'GitHub Repository',
        icon: 'fab fa-github',
        url: 'https://github.com/sshihabb007/MASTER-VPN-PRO',
        external: true
      }
    },

    'tax-calculator': {
      id: 'tax-calculator',
      title: 'NBR Bangladesh e-Return Tax Tool',
      subtitle: 'Assessment Year 2025–2026 Income Tax Estimator, Schedule 1/5, IT-10BB/IT-10B & Rebate Optimizer',
      group: 'web',
      category: 'finance',
      categoryLabel: 'Finance & Bangladesh',
      icon: 'fas fa-calculator',
      accent: 'green',
      runtime: '100% Client-Side · Offline PWA',
      overview:
        'A guided 5-step Bangladesh Income Tax estimator modeled directly on NBR e-Return schedules under the Income Tax Act, 2023 (Assessment Year 2025–2026). All figures are computed locally in your browser with en-IN lakh/crore BDT formatting and zero server uploads.',
      specs: [
        { label: 'Assessment Year', value: 'Bangladesh AY 2025–2026 (Income Tax Act, 2023)' },
        { label: 'Forms Covered', value: 'IT-11GA Profile · Schedule 1 · Schedule 5 · IT-10BB · IT-10B' },
        { label: 'Privacy & Execution', value: '100% Client-Side Vanilla JS · Zero data leaves your browser' },
        { label: 'Key Optimizer', value: 'Dynamic 1-click Auto-Maximize Tax Rebate calculator' }
      ],
      capabilities: [
        {
          lead: 'Step 1 — Profile Configuration [Form IT-11GA]',
          detail: 'Handles taxpayer category exemptions (General 3.5L, Female/Senior 65+ 4.0L, Physically Challenged/Third Gender 4.75L, Gazetted War-Wounded Freedom Fighter 5.0L BDT), disabled dependent additions (+50K / +1L), Resident progressive vs. Non-Resident flat 25%, and City Corporation minimum tax rules (5,000 / 4,000 / 3,000 BDT).'
        },
        {
          lead: 'Step 2 — Schedule 1 Employment Income',
          detail: 'Captures 12 salary and benefit components (Basic Pay, Allowances, Arrears, Gratuity/Pension, Perquisites, Share Schemes, Accommodation, Transport, Employer RPF, and more) and automatically applies the statutory 1/3rd exemption capped at 4,50,000 BDT.'
        },
        {
          lead: 'Step 3 — Schedule 5 Investment Tax Credit',
          detail: 'Supports 6 eligible investment classes including Life Insurance, DPS (capped at 60,000 BDT), Approved Bonds/Mutual Funds, BD Stock Exchange listed securities, Zakat Fund, and Benevolent Insurance—calculating credit as min(3% taxable income, 15% eligible investment, 10,00,000 BDT).'
        },
        {
          lead: 'Step 4 & 5 — Form IT-10BB, Wealth Surcharge & IT-10B Reconciler',
          detail: 'Tracks 8 lifestyle expense lines, calculates progressive slabs (5% to 25%), computes Net Wealth Surcharges (10%–35% above 4 Cr, plus multi-car or >8,000 sq ft city property rule), deducts Advance Tax/TDS, reconciles year-end net wealth, and provides a 1-click Tax Rebate Optimizer.'
        }
      ],
      primaryAction: {
        label: 'Launch Tax Calculator',
        icon: 'fas fa-arrow-right',
        url: '../tax-calculator/',
        external: false
      }
    },

    'land-calculator': {
      id: 'land-calculator',
      title: 'Land Calculator Pro',
      subtitle: 'Bangladesh Land Measurement Converter, Gunter’s Chain Calculator & Visual Scale Comparator',
      group: 'web',
      category: 'finance',
      categoryLabel: 'Finance & Bangladesh',
      icon: 'fas fa-map-marked-alt',
      accent: 'green',
      runtime: '100% Client-Side · Offline PWA',
      overview:
        'Comprehensive bidirectional land measurement tool tailored for Bangladesh and South Asia. Edit any of 8 land units to synchronize all others in real time, switch between official Standard and Regional Bigha/Katha definitions, calculate areas directly in Gunter’s Chain links, and consult the built-in Land Terms Wiki.',
      specs: [
        { label: 'Synchronized Units', value: 'Shotangsho (Decimal), Katha, Bigha, Acre, Hectare, Sq Meter, Sq Feet, Sq Links' },
        { label: 'Regional Standards', value: 'BD Standard (33 Dec Bigha / 1.65 Katha) & Regional (52 Dec Bigha / 2.6 Katha)' },
        { label: 'Survey Tools', value: 'Gunter’s Chain (Length × Width in Links / 1000) + Tennis Court Area Visualizer' },
        { label: 'Runtime', value: '100% Client-Side JS + Alpine.js 3 · Instant 4-decimal precision' }
      ],
      capabilities: [
        {
          lead: '8-Unit Bidirectional Master Converter',
          detail: 'Type into any field—Decimal (Shotangsho), Katha, Bigha, Acre, Hectare, Square Meter, Square Feet, or Square Links—and every other unit recalculates simultaneously to 4 decimal places.'
        },
        {
          lead: 'Standard vs. Regional Bigha Toggle',
          detail: 'Seamlessly toggles between Bangladesh’s official Standard Bigha (33 Decimal; 1 Katha = 1.65 Decimal) and customary Regional Bigha (52 Decimal; 1 Katha = 2.6 Decimal) while preserving your active input.'
        },
        {
          lead: 'Human-Readable Breakdown & Area Visualizer',
          detail: 'Automatically decomposes large plots into Acre, Bigha, Katha, and Decimal components and renders a scaled visual comparison against a standard Tennis Court (2,808 Sq Ft).'
        },
        {
          lead: 'Gunter’s Chain Calculator & Land Terms Wiki',
          detail: 'Converts surveyor Length × Width measurements in Gunter’s Links directly into Decimals alongside a quick reference table and collapsible guides explaining RS Khatian, SA Khatian, and Mouza.'
        }
      ],
      primaryAction: {
        label: 'Launch Land Calculator',
        icon: 'fas fa-arrow-right',
        url: '../land-calculator/',
        external: false
      }
    },

    'currency-converter': {
      id: 'currency-converter',
      title: 'Currency Converter Pro',
      subtitle: 'Real-Time 160+ Global Currency Converter with Live Rates & Offline Fallback',
      group: 'web',
      category: 'finance',
      categoryLabel: 'Finance & Bangladesh',
      icon: 'fas fa-money-bill-wave',
      accent: 'blue',
      runtime: 'Live ExchangeRate-API v6 + Offline Fallback',
      overview:
        'Fast global currency converter covering USD, EUR, GBP, BDT, INR, and 160+ world currencies. Pulls live exchange rates via ExchangeRate-API v6 with an automatic 45-currency offline fallback table so conversions continue seamlessly even without connectivity.',
      specs: [
        { label: 'Coverage', value: '160+ Global Currencies (14 Popular Priority + Alphabetical Country List)' },
        { label: 'Live Rate Source', value: 'ExchangeRate-API v6 (USD base) with live/offline source indicator' },
        { label: 'Resilience', value: 'Built-in 45-currency offline reference rate fallback table' },
        { label: 'Interaction', value: 'Instant keystroke recalculation + animated 180° currency swap' }
      ],
      capabilities: [
        {
          lead: 'Smart Popular & Country-Mapped Selectors',
          detail: 'Surfaces 14 frequently used currencies (USD, EUR, GBP, BDT, INR, JPY, AUD, CAD, CHF, CNY, HKD, NZD, AED, SAR) at the top followed by 160+ currencies labeled cleanly as “Country - CODE”.'
        },
        {
          lead: 'Live Unit Rate & Localized Output',
          detail: 'Displays both the converted 2-decimal localized total and the 4-decimal unit rate (1 FROM = X.XXXX TO) as you type.'
        },
        {
          lead: 'Graceful Offline Fallback',
          detail: 'Automatically switches to an embedded 45-currency reference rate table and clearly labels the rate status if the network is unavailable.'
        }
      ],
      primaryAction: {
        label: 'Launch Currency Converter',
        icon: 'fas fa-arrow-right',
        url: '../currency-converter/',
        external: false
      }
    },

    'audio-to-text': {
      id: 'audio-to-text',
      title: 'ScribeAI — Audio to Text',
      subtitle: 'Multi-Engine AI Transcription: 100% On-Device WebGPU/WASM Whisper, Google Gemini & Groq Whisper V3',
      group: 'web',
      category: 'media-ai',
      categoryLabel: 'Media & AI',
      icon: 'fas fa-microphone',
      accent: 'purple',
      runtime: 'Local Browser AI (WebGPU/WASM) + Optional BYO-Key Cloud',
      overview:
        'Flexible browser-based audio transcription studio for MP3, M4A, and WAV files (up to 2 GB). Choose between 100% local on-device Whisper inference in a dedicated Web Worker or bring-your-own API keys for Google Gemini 2.5 Flash-Lite and Groq Whisper Large V3 Turbo.',
      specs: [
        { label: 'Supported Audio', value: 'MP3, M4A, WAV & browser-decodable audio/* formats (up to 2 GB UI limit)' },
        { label: 'Local AI Engine', value: '@huggingface/transformers v3 · onnx-community/whisper-base.en (WebGPU / WASM)' },
        { label: 'Cloud BYO-Key Engines', value: 'Google Gemini (gemini-2.5-flash-lite) & Groq (whisper-large-v3-turbo, ≤25 MB)' },
        { label: 'Privacy Model', value: 'Local mode runs 100% offline in browser; API keys stored only in localStorage' }
      ],
      capabilities: [
        {
          lead: '100% On-Device Local Whisper Mode',
          detail: 'Runs onnx-community/whisper-base.en inside an ES module Web Worker with WebGPU acceleration (automatic WASM fallback), decoding 16 kHz audio via Web Audio API and streaming live 30-second transcribed chunks.'
        },
        {
          lead: 'Google Gemini Long-Audio Resumable Upload',
          detail: 'Uploads large audio files via Gemini’s resumable File API, polls processing state automatically, and generates clean transcriptions using gemini-2.5-flash-lite.'
        },
        {
          lead: 'Groq Whisper V3 Turbo Speed Mode',
          detail: 'Direct browser-to-Groq transcription with whisper-large-v3-turbo for ultra-fast speech-to-text on clips up to 25 MB.'
        },
        {
          lead: 'Live Progress Tracking & One-Click Copy',
          detail: 'Visual progress bar reports model downloads, uploads, or chunk percentages in real time alongside a 1-click Copy Text action.'
        }
      ],
      primaryAction: {
        label: 'Launch ScribeAI',
        icon: 'fas fa-arrow-right',
        url: '../audio-to-text/',
        external: false
      }
    },

    'compressor': {
      id: 'compressor',
      title: 'Image & Audio Converter',
      subtitle: 'Local Client-Side Image Compressor, Batch Converter & FFmpeg.wasm Video-to-Audio Extractor',
      group: 'web',
      category: 'media-ai',
      categoryLabel: 'Media & AI',
      icon: 'fas fa-image',
      accent: 'purple',
      runtime: '100% Client-Side · HTML5 Canvas + FFmpeg.wasm',
      overview:
        'Private, zero-upload media workstation right inside the browser. Compress and batch-convert images (PNG, JPG, WebP) with side-by-side preview using HTML5 Canvas, or extract and trim MP3, AAC, WAV, and OGG audio from audio/video files (MP4, MOV, WebM, TS) using FFmpeg.wasm and an interactive WaveSurfer.js waveform editor.',
      specs: [
        { label: 'Image Formats', value: 'Input: PNG, JPG, WebP · Output: JPEG, PNG, WebP (Single & Multi-File Batch)' },
        { label: 'Audio / Video Formats', value: 'Input: MP3, WAV, AAC, M4A, MP4, WebM, MOV, TS (up to 200 MB) · Output: MP3, AAC, WAV, OGG' },
        { label: 'Engines', value: 'HTML5 Canvas API · FFmpeg.wasm (@ffmpeg/ffmpeg 0.11.6) · WaveSurfer.js v7' },
        { label: 'Privacy', value: '100% local processing via Cross-Origin Isolation (SharedArrayBuffer) — zero server uploads' }
      ],
      capabilities: [
        {
          lead: 'Interactive Image Compression & Batch Export',
          detail: 'Adjust compression quality (0–100%) with debounced live rendering, optionally cap dimensions at 2000px preserving aspect ratio, compare Original vs. Converted sizes/resolutions side by side, and download single or batch outputs.'
        },
        {
          lead: 'WaveSurfer.js v7 Visual Audio Waveform Editor',
          detail: 'Inspect extracted or uploaded audio visually with click-to-seek playback, Play/Pause preview, and live HH:MM:SS timecodes before converting.'
        },
        {
          lead: 'Granular FFmpeg.wasm Encoding Controls',
          detail: 'Configure Trim Start (-ss) & End (-to), Bitrate (64k–320k), VBR Qscale (0–9), Sample Rate (44.1 / 48 kHz), and Mono/Stereo channels with live percentage progress tracking.'
        }
      ],
      primaryAction: {
        label: 'Launch Converter',
        icon: 'fas fa-arrow-right',
        url: '../compressor/',
        external: false
      }
    },

    'universal-downloader': {
      id: 'universal-downloader',
      title: 'Universal Downloader',
      subtitle: 'Ad-Free Lossless Video, Image Slideshow & 320 kbps MP3 Stream Extractor',
      group: 'web',
      category: 'media-ai',
      categoryLabel: 'Media & AI',
      icon: 'fas fa-download',
      accent: 'blue',
      runtime: 'Client Frontend + Cloudflare Worker & Multi-Instance Failover',
      overview:
        'Clean, ad-free web media stream extractor built for extracting original-quality videos, multi-image slideshows, and 320 kbps MP3 audio from TikTok, YouTube, Instagram, Twitter/X, Facebook, and more using smart platform routing and automatic multi-instance failover.',
      specs: [
        { label: 'Supported Platforms', value: 'TikTok, YouTube, Instagram Reels/Posts, Twitter/X, Facebook & Cobalt-supported hosts' },
        { label: 'Output Modes', value: 'Video / Image Galleries (up to 1080p auto) & Audio-Only (MP3 320 kbps)' },
        { label: 'Routing Pipeline', value: 'TikWM API (TikTok HD no-watermark) · Personal Cloudflare Worker + 6 Cobalt v10 Failover Nodes' },
        { label: 'UI Features', value: 'Live monospace extraction terminal, inline HTML5 preview & slide gallery saver' }
      ],
      capabilities: [
        {
          lead: 'Platform-Aware Smart Extraction & Failover',
          detail: 'Automatically routes TikTok links through TikWM for HD watermark-free videos and photo slideshows, while routing YouTube, Instagram, Twitter/X, and other links through a dedicated Cloudflare Worker proxy with automatic failover across 6 Cobalt v10 instances.'
        },
        {
          lead: 'Single-Asset Preview & Multi-Slide Gallery Saver',
          detail: 'Previews extracted video directly in an inline HTML5 player with thumbnail poster and renders multi-photo/video carousels in a responsive grid with per-item Save buttons.'
        },
        {
          lead: '1-Click Clipboard Paste & Live Status Terminal',
          detail: 'Quick-paste button pulls URLs from clipboard (with prompt fallback) and displays transparent step-by-step extraction logs and progress bars.'
        }
      ],
      primaryAction: {
        label: 'Launch Downloader',
        icon: 'fas fa-arrow-right',
        url: '../universal-downloader/',
        external: false
      }
    },

    'advanced-calculator': {
      id: 'advanced-calculator',
      title: 'Advanced Scientific Calculator',
      subtitle: '64-Digit BigNumber Scientific, Symbolic Algebra & Calculus Engine with MathQuill Typesetting',
      group: 'web',
      category: 'calculators',
      categoryLabel: 'Calculators & Health',
      icon: 'fas fa-square-root-alt',
      accent: 'blue',
      runtime: '100% Client-Side · Self-Hosted Offline PWA',
      overview:
        'High-precision computational calculator combining interactive MathQuill v2 textbook typesetting, 64-digit BigNumber arithmetic (math.js), exact rational fraction mode, and symbolic differentiation, integration, and equation solving via Nerdamer — 100% self-hosted for offline use.',
      specs: [
        { label: 'Precision Engine', value: 'math.js BigNumber (64-digit internal precision) + exact rational fractions' },
        { label: 'Symbolic CAS', value: 'Nerdamer (Core, Algebra, Calculus, Solve) — derive(), diff(), integrate(), solve()' },
        { label: 'Math Input', value: 'MathQuill v2 live LaTeX-style equation editor + full keyboard & touch pads' },
        { label: 'Modes & Memory', value: 'DECIMAL / EXACT (FRACTION) · RAD / DEG · Ans & Store (variable x)' }
      ],
      capabilities: [
        {
          lead: 'Live Textbook Math Typesetting',
          detail: 'Uses MathQuill v2 to render stacked fractions, powers, roots, and calculus expressions cleanly as you type, evaluating results in real time with automatic parenthesis closing.'
        },
        {
          lead: 'Exact Fraction & 64-Digit BigNumber Arithmetic',
          detail: 'Toggle instantly between 14-significant-digit floating display (backed by 64-digit BigNumber precision) and exact simplified rational fractions.'
        },
        {
          lead: 'Symbolic Calculus & Collapsible Scientific Pad',
          detail: 'Supports sin/cos/tan (RAD/DEG with zero-snap), log/ln, π, e, √, x^y, factorials, variables x/y, derivatives (d/dx), integrals (∫), and algebraic solve().'
        }
      ],
      primaryAction: {
        label: 'Launch Scientific Calculator',
        icon: 'fas fa-arrow-right',
        url: '../advanced-calculator/',
        external: false
      }
    },

    'power-calculator': {
      id: 'power-calculator',
      title: 'PC Power Calculator Pro',
      subtitle: 'PC Wattage, Bangladesh Tiered / Global Electricity Bill Estimator & UPS Sizing Advisor',
      group: 'web',
      category: 'calculators',
      categoryLabel: 'Calculators & Health',
      icon: 'fas fa-plug',
      accent: 'orange',
      runtime: '100% Client-Side · Offline PWA',
      overview:
        'Dedicated PC energy analytics and UPS advisor that estimates monthly electricity consumption (kWh) and cost from CPU, GPU, peripherals, monitor wattage, and daily runtime — supporting both Bangladesh’s 6-slab progressive electricity tariff (with demand charge & 5% VAT) and custom global flat rates.',
      specs: [
        { label: 'Tariff Modes', value: 'Bangladesh 6-Slab Tiered Tariff (5.26–14.61 BDT + 42 BDT Demand + 5% VAT) & Global Flat Rate' },
        { label: 'Inputs', value: 'CPU (W), GPU (W), Others/Peripherals (W), Monitor (W) & Daily Runtime Slider (1–24 h)' },
        { label: 'UPS Formula', value: 'Required VA = (Watts / 0.7 PF) × 1.25 headroom → 650VA / 1200VA / 2000VA Online' },
        { label: 'Diagnostics', value: 'Itemized slab bill, backup-time estimate, PSU Load Factor & UPS Thermal Stress bars' }
      ],
      capabilities: [
        {
          lead: 'Bangladesh Tiered Slab & Global Electricity Costing',
          detail: 'Computes exact monthly kWh and itemized progressive tariff slabs (0–75 through 600+ units) plus fixed demand charge and 5% VAT, or switches to any custom flat kWh currency rate.'
        },
        {
          lead: 'Professional UPS Sizing & Backup Advisor',
          detail: 'Calculates safe VA capacity using a 0.7 power factor and 25% safety margin, recommends the ideal UPS tier (650VA Standard, 1200VA Pro, or 2000VA Online UPS), and estimates runtime backup minutes.'
        },
        {
          lead: 'PSU Load Factor & Thermal Stress Gauges',
          detail: 'Visualizes live PSU utilization and UPS thermal stress indicators alongside practical power-saving tips (undervolting, pure sine wave UPS, monitor standby draw).'
        }
      ],
      primaryAction: {
        label: 'Launch Power Calculator',
        icon: 'fas fa-arrow-right',
        url: '../power-calculator/',
        external: false
      }
    },

    'age-calculator': {
      id: 'age-calculator',
      title: 'Age Calculator Pro',
      subtitle: 'Exact Chronological Age, Generation, Western & Chinese Zodiac, Birthday Countdown & Life Stats',
      group: 'web',
      category: 'calculators',
      categoryLabel: 'Calculators & Health',
      icon: 'fas fa-calendar-alt',
      accent: 'pink',
      runtime: '100% Client-Side · Offline PWA',
      overview:
        'Interactive chronological age and life-milestone calculator that converts your Date of Birth into exact years, months, and days, life-journey progress, generation cohort, Western & Chinese zodiac signs, next birthday countdown, and shareable life statistics.',
      specs: [
        { label: 'Outputs', value: 'Exact Years/Months/Days · Life Journey % (80-yr scale) · Next Birthday Countdown' },
        { label: 'Profile Insights', value: 'Generation Cohort (Silent Gen → Gen Alpha) · Western & Chinese Zodiac · Birth Weekday' },
        { label: 'Life Metrics', value: 'Total Months, Weeks, Days, Hours, Est. Heartbeats & Hours Slept' },
        { label: 'Persistence & Export', value: 'Remembers DOB in localStorage + 1-click Copy Age & Copy All Stats' }
      ],
      capabilities: [
        {
          lead: 'Calendar-Accurate Age & Birthday Countdown',
          detail: 'Accounts for exact month lengths to compute precise years, months, and days, detects your weekday of birth, and counts down exact days to your next birthday.'
        },
        {
          lead: 'Generation & Dual Zodiac Cards',
          detail: 'Identifies your generational cohort alongside Western Zodiac sign and Chinese Zodiac animal with a visual 80-year Life Journey progress bar.'
        },
        {
          lead: 'Life in Numbers & Instant Clipboard Export',
          detail: 'Calculates total months, weeks, days, hours, estimated heartbeats, and hours slept, saving your DOB locally for instant return visits and 1-click stats copying.'
        }
      ],
      primaryAction: {
        label: 'Launch Age Calculator',
        icon: 'fas fa-arrow-right',
        url: '../age-calculator/',
        external: false
      }
    },

    'bmi-calculator': {
      id: 'bmi-calculator',
      title: 'BMI Calculator Pro',
      subtitle: 'Interactive Metric & Imperial Body Mass Index Gauge, Ideal Weight Range & History Log',
      group: 'web',
      category: 'calculators',
      categoryLabel: 'Calculators & Health',
      icon: 'fas fa-weight',
      accent: 'orange',
      runtime: '100% Client-Side · Offline PWA',
      overview:
        'Responsive Body Mass Index calculator supporting both Metric (kg + cm or ft/in) and Imperial (lbs + ft/in) units. Features an animated 4-zone color gauge needle, ideal healthy weight targets, personalized gain/lose/maintain action guidance, and local 5-entry history tracking.',
      specs: [
        { label: 'Unit Systems', value: 'Metric (kg + cm / ft & in) & Imperial (lbs + ft & in)' },
        { label: 'BMI Zones', value: 'Underweight (<18.5) · Healthy (18.5–24.9) · Overweight (25.0–29.9) · Obese (≥30.0)' },
        { label: 'Health Guidance', value: 'Ideal weight range for height + exact weight delta Action Plan' },
        { label: 'History & Sharing', value: 'LocalStorage 5-entry history log + Clear All + 1-click Copy Stats' }
      ],
      capabilities: [
        {
          lead: 'Flexible Metric & Imperial Conversion',
          detail: 'Lets Metric users enter height in centimeters or feet & inches seamlessly alongside standard Imperial pounds and feet/inches calculations.'
        },
        {
          lead: 'Animated 4-Zone Gauge & Action Plan',
          detail: 'Plots your 1-decimal BMI score on a 4-color linear meter and calculates the exact weight delta needed to reach or maintain the 18.5–24.9 healthy zone.'
        },
        {
          lead: 'Local Progress History & Clipboard Copy',
          detail: 'Save up to 5 recent BMI snapshots privately in browser localStorage and copy formatted summary stats in one click.'
        }
      ],
      primaryAction: {
        label: 'Launch BMI Calculator',
        icon: 'fas fa-arrow-right',
        url: '../bmi-calculator/',
        external: false
      }
    },

    'qr-generator': {
      id: 'qr-generator',
      title: 'QR Generator Pro',
      subtitle: '14-Type Custom QR Studio with Gradients, Logos, Center Text Badges & PNG/SVG/PDF/EPS Export',
      group: 'web',
      category: 'utilities',
      categoryLabel: 'Utilities',
      icon: 'fas fa-qrcode',
      accent: 'blue',
      runtime: '100% Client-Side · Error Correction Level H',
      overview:
        'Full-featured custom QR code studio supporting 14 structured payload formats (URL, WiFi, WhatsApp, vCard, Event, Bitcoin, and more), 2-stop color gradients, custom dot/eye shapes, embedded logos or center text badges, high-resolution scaling up to 2000×2000 px, and print-ready vector/raster exports.',
      specs: [
        { label: '14 Payload Types', value: 'URL, Text, Email, Phone/WhatsApp, SMS, vCard 3.0, MeCard, Geo Location, WiFi, Facebook, X, YouTube, VEVENT, Bitcoin' },
        { label: 'Design Controls', value: 'Solid/Gradient FG, Custom Eye Colors, 6 Dot Shapes, 4 Eye Frames, 2 Eye Balls, 0–50px Padding' },
        { label: 'Branding Overlays', value: 'Custom image upload, 6 social preset icons, or toggleable SVG Center Text Badge' },
        { label: 'Export Formats', value: 'PNG, SVG, PDF (jsPDF) & EPS (PostScript 3.0) from 100px to 2000px · ECC Level H' }
      ],
      capabilities: [
        {
          lead: '14 Structured QR Content Encoders',
          detail: 'Generates standards-compliant payloads for URLs, WiFi (WPA/WEP/Open with special-character escaping), WhatsApp chats, vCard 3.0 contacts, calendar VEVENTs, geo coordinates, SMS, email, social profiles, and Bitcoin URIs.'
        },
        {
          lead: 'Deep Visual & Logo Customization',
          detail: 'Style foregrounds with 2-stop linear gradients, pick from 6 body dot styles and 4 corner eye frames, embed your own uploaded logo or 6 preset brand icons, or add a crisp customizable SVG center text badge.'
        },
        {
          lead: 'Print-Ready Vector & High-Res Exports',
          detail: 'Maintains Level H error correction for logo scannability and exports directly in the browser to PNG, SVG, PDF, or EPS at resolutions up to 2000×2000 px with auto-sanitized filenames.'
        }
      ],
      primaryAction: {
        label: 'Launch QR Generator',
        icon: 'fas fa-arrow-right',
        url: '../qr-generator/',
        external: false
      }
    }
  };

  // DOM References
  const shihab_searchInput = document.getElementById('shihab_tools_search');
  const shihab_searchClear = document.getElementById('shihab_search_clear');
  const shihab_searchKbd = document.getElementById('shihab_search_kbd');
  const shihab_filterBtns = Array.from(document.querySelectorAll('.shihab_filter_btn'));
  const shihab_cards = Array.from(document.querySelectorAll('[data-tool-id]'));
  const shihab_flagshipSection = document.getElementById('shihab_featured_projects');
  const shihab_webSection = document.getElementById('shihab_web_tools');
  const shihab_flagshipCount = document.getElementById('shihab_flagship_count');
  const shihab_webCount = document.getElementById('shihab_web_count');
  const shihab_resultsLive = document.getElementById('shihab_results_live');
  const shihab_emptyState = document.getElementById('shihab_empty_state');
  const shihab_resetFiltersBtn = document.getElementById('shihab_reset_filters');

  // Modal References
  const shihab_modal = document.getElementById('shihab_detail_modal');
  const shihab_modalClose = document.getElementById('shihab_modal_close');
  const shihab_modalIcon = document.getElementById('shihab_modal_icon');
  const shihab_modalTitle = document.getElementById('shihab_modal_title');
  const shihab_modalSubtitle = document.getElementById('shihab_modal_subtitle');
  const shihab_modalBadges = document.getElementById('shihab_modal_badges');
  const shihab_modalOverview = document.getElementById('shihab_modal_overview');
  const shihab_modalSpecs = document.getElementById('shihab_modal_specs');
  const shihab_modalCapabilities = document.getElementById('shihab_modal_capabilities');
  const shihab_modalDownloadsWrap = document.getElementById('shihab_modal_downloads_wrap');
  const shihab_modalDownloads = document.getElementById('shihab_modal_downloads');
  const shihab_modalSnippetWrap = document.getElementById('shihab_modal_snippet_wrap');
  const shihab_modalSnippetLabel = document.getElementById('shihab_modal_snippet_label');
  const shihab_modalSnippet = document.getElementById('shihab_modal_snippet');
  const shihab_modalActions = document.getElementById('shihab_modal_actions');
  const shihab_copyLinkBtn = document.getElementById('shihab_copy_item_link');
  const shihab_copyStatus = document.getElementById('shihab_copy_status');

  let shihab_activeCategory = 'all';
  let shihab_searchQuery = '';
  let shihab_activeModalId = null;
  let shihab_lastFocusedTrigger = null;
  let shihab_copyTimer = null;
  let shihab_backdropPointerDown = false;

  function mehedi_getCatalogItem(itemId) {
    if (!itemId || !Object.prototype.hasOwnProperty.call(mehedi_toolsCatalog, itemId)) {
      return null;
    }
    return mehedi_toolsCatalog[itemId];
  }

  // Build search index combining card text + full catalog specifications
  const shihab_searchIndex = new Map();
  shihab_cards.forEach((card) => {
    const id = card.getAttribute('data-tool-id');
    const item = mehedi_getCatalogItem(id);
    const parts = [card.textContent || ''];
    if (item) {
      parts.push(item.title, item.subtitle, item.overview, item.runtime, item.categoryLabel);
      (item.specs || []).forEach((s) => parts.push(s.label, s.value));
      (item.capabilities || []).forEach((c) => parts.push(c.lead, c.detail));
    }
    shihab_searchIndex.set(id, parts.join(' ').toLowerCase());
  });

  function mehedi_syncThemeMeta() {
    const isLight = document.body.classList.contains('light-mode');
    document.documentElement.style.colorScheme = isLight ? 'light' : 'dark';
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', isLight ? '#F2EFE9' : '#070B14');
    }
  }

  function mehedi_syncUrlParams() {
    const params = new URLSearchParams();
    if (shihab_activeCategory && shihab_activeCategory !== 'all') {
      params.set('cat', shihab_activeCategory);
    }
    if (shihab_searchQuery.trim()) {
      params.set('q', shihab_searchQuery.trim());
    }
    if (shihab_activeModalId) {
      params.set('item', shihab_activeModalId);
    }
    const queryStr = params.toString();
    const hashStr = window.location.hash || '';
    const nextUrl = queryStr
      ? `${window.location.pathname}?${queryStr}${hashStr}`
      : `${window.location.pathname}${hashStr}`;
    try {
      window.history.replaceState(null, '', nextUrl);
    } catch (e) {
      // Ignore History API restrictions in sandboxed/file origins
    }
  }

  function mehedi_applyFilters(shouldSyncUrl) {
    const normalizedQuery = shihab_searchQuery.trim().toLowerCase();
    let visibleFlagship = 0;
    let visibleWeb = 0;

    shihab_cards.forEach((card) => {
      const id = card.getAttribute('data-tool-id');
      const cardCategory = card.getAttribute('data-category');
      const cardGroup = card.getAttribute('data-group');

      const matchesCategory =
        shihab_activeCategory === 'all' || cardCategory === shihab_activeCategory;
      const matchesQuery =
        !normalizedQuery || (shihab_searchIndex.get(id) || '').includes(normalizedQuery);
      const isVisible = matchesCategory && matchesQuery;

      card.hidden = !isVisible;
      if (isVisible) {
        if (cardGroup === 'flagship') visibleFlagship += 1;
        else visibleWeb += 1;
      }
    });

    const totalVisible = visibleFlagship + visibleWeb;
    const totalCount = shihab_cards.length;

    if (shihab_flagshipSection) shihab_flagshipSection.hidden = visibleFlagship === 0;
    if (shihab_webSection) shihab_webSection.hidden = visibleWeb === 0;
    if (shihab_flagshipCount) {
      shihab_flagshipCount.textContent = `${visibleFlagship} ${visibleFlagship === 1 ? 'project' : 'projects'}`;
    }
    if (shihab_webCount) {
      shihab_webCount.textContent = `${visibleWeb} ${visibleWeb === 1 ? 'tool' : 'tools'}`;
    }
    if (shihab_emptyState) {
      shihab_emptyState.hidden = totalVisible > 0;
    }

    if (shihab_resultsLive) {
      shihab_resultsLive.textContent = `Showing ${totalVisible} of ${totalCount} tools`;
    }

    if (shihab_searchClear) {
      shihab_searchClear.hidden = !shihab_searchQuery;
    }
    if (shihab_searchKbd) {
      shihab_searchKbd.hidden = Boolean(shihab_searchQuery);
    }

    shihab_filterBtns.forEach((btn) => {
      const isActive = btn.getAttribute('data-filter') === shihab_activeCategory;
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    if (shouldSyncUrl) {
      mehedi_syncUrlParams();
    }
  }

  function mehedi_createIcon(className) {
    const icon = document.createElement('i');
    icon.className = className;
    icon.setAttribute('aria-hidden', 'true');
    return icon;
  }

  function mehedi_openDetailModal(itemId, triggerEl) {
    const item = mehedi_getCatalogItem(itemId);
    if (!item || !shihab_modal) return;

    shihab_activeModalId = itemId;
    shihab_lastFocusedTrigger = triggerEl || document.activeElement;

    // Header icon & titles
    shihab_modalIcon.className = `shihab_icon_badge shihab_icon_${item.accent || 'blue'}`;
    shihab_modalIcon.replaceChildren(mehedi_createIcon(item.icon));
    shihab_modalTitle.textContent = item.title;
    shihab_modalSubtitle.textContent = item.subtitle;

    // Badges
    const badgeNodes = [];
    const catPill = document.createElement('span');
    catPill.className = 'shihab_runtime_pill';
    catPill.textContent = item.categoryLabel;
    badgeNodes.push(catPill);

    if (item.version) {
      const verPill = document.createElement('span');
      verPill.className = 'shihab_version_pill';
      verPill.textContent = item.version;
      badgeNodes.push(verPill);
    }
    if (item.license) {
      const licPill = document.createElement('span');
      licPill.className = 'shihab_license_pill';
      licPill.textContent = item.license;
      badgeNodes.push(licPill);
    }
    if (item.runtime) {
      const rtPill = document.createElement('span');
      rtPill.className = 'shihab_runtime_pill';
      rtPill.textContent = item.runtime;
      badgeNodes.push(rtPill);
    }
    shihab_modalBadges.replaceChildren(...badgeNodes);

    // Overview
    shihab_modalOverview.textContent = item.overview;

    // Specs Grid
    const specNodes = (item.specs || []).map((spec) => {
      const box = document.createElement('div');
      box.className = 'shihab_spec_item';
      const lbl = document.createElement('div');
      lbl.className = 'shihab_spec_label';
      lbl.textContent = spec.label;
      const val = document.createElement('div');
      val.className = 'shihab_spec_value';
      val.textContent = spec.value;
      box.append(lbl, val);
      return box;
    });
    shihab_modalSpecs.replaceChildren(...specNodes);

    // Capabilities List
    const capNodes = (item.capabilities || []).map((cap) => {
      const li = document.createElement('li');
      const check = mehedi_createIcon('fas fa-check-circle');
      const wrap = document.createElement('div');
      const strong = document.createElement('strong');
      strong.textContent = `${cap.lead}: `;
      const span = document.createElement('span');
      span.textContent = cap.detail;
      wrap.append(strong, span);
      li.append(check, wrap);
      return li;
    });
    shihab_modalCapabilities.replaceChildren(...capNodes);

    // Downloads (Flagship Projects)
    if (item.downloads && item.downloads.length > 0) {
      shihab_modalDownloadsWrap.hidden = false;
      const dlNodes = item.downloads.map((dl) => {
        const a = document.createElement('a');
        a.className = 'shihab_download_tile';
        a.href = dl.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        const span = document.createElement('span');
        const titleNode = document.createTextNode(dl.label);
        const small = document.createElement('small');
        small.textContent = dl.meta;
        span.append(titleNode, small);
        a.append(span, mehedi_createIcon('fas fa-arrow-up-right-from-square'));
        return a;
      });
      shihab_modalDownloads.replaceChildren(...dlNodes);
    } else {
      shihab_modalDownloadsWrap.hidden = true;
      shihab_modalDownloads.replaceChildren();
    }

    // CLI / Shortcut Snippet
    if (item.snippet) {
      shihab_modalSnippetWrap.hidden = false;
      shihab_modalSnippetLabel.textContent = item.snippetLabel || 'Quick Reference';
      shihab_modalSnippet.textContent = item.snippet;
    } else {
      shihab_modalSnippetWrap.hidden = true;
      shihab_modalSnippet.textContent = '';
    }

    // Footer Actions
    const actionNodes = [];
    if (item.primaryAction) {
      const primaryLink = document.createElement('a');
      primaryLink.className = 'btn btn-primary shihab_action_btn';
      primaryLink.href = item.primaryAction.url;
      if (item.primaryAction.external) {
        primaryLink.target = '_blank';
        primaryLink.rel = 'noopener noreferrer';
      }
      primaryLink.append(mehedi_createIcon(item.primaryAction.icon), document.createTextNode(item.primaryAction.label));
      actionNodes.push(primaryLink);
    }
    if (item.secondaryAction) {
      const secondaryLink = document.createElement('a');
      secondaryLink.className = 'btn btn-outline shihab_action_btn';
      secondaryLink.href = item.secondaryAction.url;
      if (item.secondaryAction.external) {
        secondaryLink.target = '_blank';
        secondaryLink.rel = 'noopener noreferrer';
      }
      secondaryLink.append(mehedi_createIcon(item.secondaryAction.icon), document.createTextNode(item.secondaryAction.label));
      actionNodes.push(secondaryLink);
    }
    shihab_modalActions.replaceChildren(...actionNodes);

    if (shihab_copyStatus) {
      shihab_copyStatus.textContent = '';
      shihab_copyStatus.classList.remove('shihab_copy_error');
    }

    if (typeof shihab_modal.showModal === 'function') {
      if (!shihab_modal.open) shihab_modal.showModal();
    } else {
      shihab_modal.setAttribute('open', '');
    }

    mehedi_syncUrlParams();

    const modalBody = shihab_modal.querySelector('.shihab_modal_body');
    if (modalBody) modalBody.scrollTop = 0;
    if (shihab_modalClose) shihab_modalClose.focus({ preventScroll: true });
    window.requestAnimationFrame(() => {
      if (modalBody) modalBody.scrollTop = 0;
    });
  }

  function mehedi_closeDetailModal() {
    if (!shihab_modal) return;
    const closedItemId = shihab_activeModalId;
    if (typeof shihab_modal.close === 'function' && shihab_modal.open) {
      shihab_modal.close();
    } else {
      shihab_modal.removeAttribute('open');
    }
    shihab_activeModalId = null;
    mehedi_syncUrlParams();

    let focusTarget = shihab_lastFocusedTrigger;
    if ((!focusTarget || focusTarget === document.body) && closedItemId) {
      const fallbackBtn = document.querySelector(`[data-open-detail="${closedItemId}"]`);
      if (fallbackBtn && !fallbackBtn.closest('[hidden]')) {
        focusTarget = fallbackBtn;
      }
    }
    if (focusTarget && typeof focusTarget.focus === 'function') {
      focusTarget.focus();
    }
    shihab_lastFocusedTrigger = null;
  }

  // Event Wiring: Search & Filters
  if (shihab_searchInput) {
    shihab_searchInput.addEventListener('input', (e) => {
      shihab_searchQuery = e.target.value;
      mehedi_applyFilters(true);
    });
  }

  if (shihab_searchClear) {
    shihab_searchClear.addEventListener('click', () => {
      shihab_searchQuery = '';
      if (shihab_searchInput) {
        shihab_searchInput.value = '';
        shihab_searchInput.focus();
      }
      mehedi_applyFilters(true);
    });
  }

  shihab_filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      shihab_activeCategory = btn.getAttribute('data-filter') || 'all';
      mehedi_applyFilters(true);
    });
  });

  if (shihab_resetFiltersBtn) {
    shihab_resetFiltersBtn.addEventListener('click', () => {
      shihab_activeCategory = 'all';
      shihab_searchQuery = '';
      if (shihab_searchInput) {
        shihab_searchInput.value = '';
        shihab_searchInput.focus();
      }
      mehedi_applyFilters(true);
    });
  }

  // Event Wiring: Detail Modal Triggers
  document.addEventListener('click', (e) => {
    const detailBtn = e.target.closest('[data-open-detail]');
    if (detailBtn) {
      const itemId = detailBtn.getAttribute('data-open-detail');
      mehedi_openDetailModal(itemId, detailBtn);
    }
  });

  if (shihab_modalClose) {
    shihab_modalClose.addEventListener('click', mehedi_closeDetailModal);
  }

  if (shihab_modal) {
    // Only close on backdrop click if pointer interaction began on the backdrop (protects text selection)
    shihab_modal.addEventListener('pointerdown', (e) => {
      shihab_backdropPointerDown = e.target === shihab_modal;
    });
    shihab_modal.addEventListener('click', (e) => {
      if (shihab_backdropPointerDown && e.target === shihab_modal) {
        mehedi_closeDetailModal();
      }
      shihab_backdropPointerDown = false;
    });
    // Sync URL and restore focus on native Escape cancel
    shihab_modal.addEventListener('cancel', (e) => {
      e.preventDefault();
      mehedi_closeDetailModal();
    });
  }

  if (shihab_copyLinkBtn) {
    shihab_copyLinkBtn.addEventListener('click', async () => {
      const shareUrl = window.location.href;
      if (shihab_copyTimer) window.clearTimeout(shihab_copyTimer);
      try {
        await navigator.clipboard.writeText(shareUrl);
        if (shihab_copyStatus) {
          shihab_copyStatus.classList.remove('shihab_copy_error');
          shihab_copyStatus.textContent = 'Direct link copied';
        }
      } catch (err) {
        if (shihab_copyStatus) {
          shihab_copyStatus.classList.add('shihab_copy_error');
          shihab_copyStatus.textContent = 'Copy unavailable — copy the URL from your address bar';
        }
      }
      shihab_copyTimer = window.setTimeout(() => {
        if (shihab_copyStatus) {
          shihab_copyStatus.textContent = '';
          shihab_copyStatus.classList.remove('shihab_copy_error');
        }
      }, 3200);
    });
  }

  // '/' Shortcut to focus Search Input
  document.addEventListener('keydown', (e) => {
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
    if (shihab_modal && shihab_modal.open) return;
    const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return;
    if (shihab_searchInput) {
      e.preventDefault();
      shihab_searchInput.focus();
    }
  });

  // Sync theme color-scheme & meta theme-color with body.light-mode
  mehedi_syncThemeMeta();
  const shihab_themeObserver = new MutationObserver(mehedi_syncThemeMeta);
  shihab_themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  // Restore initial state from URL query parameters (?cat=...&q=...&item=...)
  const shihab_initialParams = new URLSearchParams(window.location.search);
  const shihab_initialCat = shihab_initialParams.get('cat');
  const shihab_validCats = new Set(shihab_filterBtns.map((b) => b.getAttribute('data-filter')));
  if (shihab_initialCat && shihab_validCats.has(shihab_initialCat)) {
    shihab_activeCategory = shihab_initialCat;
  }
  const shihab_initialQuery = shihab_initialParams.get('q');
  if (shihab_initialQuery) {
    shihab_searchQuery = shihab_initialQuery;
    if (shihab_searchInput) shihab_searchInput.value = shihab_initialQuery;
  }
  mehedi_applyFilters(false);

  const shihab_initialItem = shihab_initialParams.get('item');
  if (mehedi_getCatalogItem(shihab_initialItem)) {
    mehedi_openDetailModal(shihab_initialItem, null);
  }
})();

/* ==========================================================================
   Mehedi Hasan Shihab — Interactive 3D & 10-Mode Portfolio Application
   Pure HTML5 + Tailwind CSS + Vanilla JavaScript Edition
   ========================================================================== */
(function () {
  const DATA = window.PORTFOLIO_DATA;
  const Icons = window.PortfolioIcons;
  const Engine = window.PortfolioEngine;

  if (!DATA || !Icons || !Engine) {
    console.error('[PortfolioApp] Missing required data, icons, or 3D engine scripts.');
    return;
  }

  const {
    ANIMATION_MODES,
    getAnimationMode,
    setAnimationMode,
    subscribeAnimationMode,
    createHeroScene,
    createNetworkScene,
    createPublicationScene,
    hasWebGL,
    onIdle,
    scrollToSection,
    scrollToTop,
    bindHashAnchorClicks,
    hashTechHue,
  } = Engine;

  /* --------------------------------------------------------------------------
     Utilities
  -------------------------------------------------------------------------- */
  function esc(val) {
    return String(val ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  const prefersReduced = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const pad2 = (n) => String(n).padStart(2, '0');

  function renderSectionHeader(label, title, sub) {
    return `
      <div data-reveal="root" class="reveal section-header-wrap text-center">
        <div class="section-label">
          <span class="inline-block w-2 h-2 rounded-full" style="background: var(--section-title-color)"></span>
          ${esc(label)}
        </div>
        <h2
          class="section-heading section-title font-bold uppercase"
          style="line-height: 1.2; margin-bottom: 16px; color: var(--section-title-color); letter-spacing: 0.05em;"
        >
          ${esc(title)}
        </h2>
        <div class="mx-auto rounded-[10px]" style="width: 50px; height: 4px; background: var(--accent)"></div>
        ${
          sub
            ? `<p class="mx-auto mt-4 max-w-[620px] text-[0.96rem] leading-[1.7]" style="color: var(--muted)">${esc(sub)}</p>`
            : ''
        }
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     Shared IntersectionObserver Reveal Controller
  -------------------------------------------------------------------------- */
  let revealObserver = null;

  function initRevealObserver() {
    if (typeof IntersectionObserver === 'undefined') {
      document.querySelectorAll('[data-reveal], .reveal').forEach((el) => {
        el.classList.add('visible', 'vis');
      });
      return;
    }

    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          const isRoot = el.hasAttribute('data-reveal');
          if (isRoot) {
            if (entry.isIntersecting) {
              el.classList.add('visible', 'vis');
            } else {
              el.classList.remove('visible');
            }
          } else if (entry.isIntersecting) {
            el.classList.add('visible', 'vis');
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px -20px 0px' }
    );

    refreshReveals();
  }

  function refreshReveals(scope) {
    const root = scope || document;
    const targets = root.querySelectorAll('[data-reveal], .reveal');
    if (!revealObserver) {
      targets.forEach((el) => el.classList.add('visible', 'vis'));
      return;
    }
    targets.forEach((el) => revealObserver.observe(el));
  }

  /* --------------------------------------------------------------------------
     Shared 2D Gliding Filter Pill Helper (.pf-bar / .pf-pill)
  -------------------------------------------------------------------------- */
  function setupFilterPill(barEl) {
    if (!barEl) return () => {};
    let pillEl = barEl.querySelector('.pf-pill');
    if (!pillEl) {
      pillEl = document.createElement('span');
      pillEl.className = 'pf-pill';
      pillEl.setAttribute('aria-hidden', 'true');
      barEl.prepend(pillEl);
    }

    const sync = () => {
      const activeBtn = barEl.querySelector('.filter-tab.active');
      if (activeBtn && pillEl) {
        pillEl.style.width = `${activeBtn.offsetWidth}px`;
        pillEl.style.height = `${activeBtn.offsetHeight}px`;
        pillEl.style.transform = `translate(${activeBtn.offsetLeft}px, ${activeBtn.offsetTop}px)`;
      }
    };

    sync();
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(sync);
      ro.observe(barEl);
      barEl.querySelectorAll('.filter-tab').forEach((btn) => ro.observe(btn));
    }
    document.fonts?.ready?.then(sync).catch(() => {});
    return sync;
  }

  /* --------------------------------------------------------------------------
     Shared Button Ripple Wave (.rip / .rip-wave)
  -------------------------------------------------------------------------- */
  function triggerButtonRipple(e) {
    const btn = e.currentTarget;
    const rip = btn.querySelector(':scope > .rip');
    if (!rip) return;
    const r = btn.getBoundingClientRect();
    const d = Math.max(r.width, r.height) * 2.2;
    const wave = document.createElement('span');
    wave.className = 'rip-wave';
    wave.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
    rip.appendChild(wave);
    wave.addEventListener('animationend', () => wave.remove());
  }

  /* --------------------------------------------------------------------------
     1. Persistent Background Scene, 2D Fallback & CyberCursor
  -------------------------------------------------------------------------- */
  function create2DConstellationFallback(host) {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
    host.innerHTML = '';
    host.appendChild(canvas);

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return () => {};

    let nodes = [];
    let isDark = document.documentElement.classList.contains('dark');
    const mo = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains('dark');
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const makeNode = (w, h) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.35 + Math.random() * 0.4;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        w,
        h,
      };
    };

    const rebuild = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const count = Math.max(
        Math.min(Math.floor((window.innerWidth * window.innerHeight) / 12000), 80),
        40
      );
      nodes = Array.from({ length: count }, () => makeNode(canvas.width, canvas.height));
    };

    let raf = 0;
    let prev = performance.now();
    let hidden = false;

    const tick = (now) => {
      if (hidden) return;
      const dt = now - prev;
      prev = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const fill = isDark ? '#94a3b8' : '#2563eb';
      const rgb = isDark ? '148, 163, 184' : '37, 99, 235';
      const baseAlpha = isDark ? 0.3 : 0.45;
      let f = dt / 16.66;
      if (f > 3) f = 1;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx * f;
        n.y += n.vy * f;
        if (n.x < 0) {
          n.x = 0;
          n.vx *= -1;
        } else if (n.x > n.w) {
          n.x = n.w;
          n.vx *= -1;
        }
        if (n.y < 0) {
          n.y = 0;
          n.vy *= -1;
        } else if (n.y > n.h) {
          n.y = n.h;
          n.vy *= -1;
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 19600) {
            const dist = Math.sqrt(d2);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${rgb}, ${(1 - dist / 140) * baseAlpha})`;
            ctx.lineWidth = isDark ? 0.8 : 1.2;
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = fill;
        ctx.globalAlpha = baseAlpha;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    const onVis = () => {
      if (document.hidden) {
        hidden = true;
        cancelAnimationFrame(raf);
      } else {
        hidden = false;
        prev = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('resize', rebuild);
    rebuild();
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', rebuild);
      document.removeEventListener('visibilitychange', onVis);
      cancelAnimationFrame(raf);
      mo.disconnect();
      canvas.remove();
    };
  }

  function initBackgroundAndCursor() {
    const bgRoot = document.getElementById('bg-root');
    const cursorRoot = document.getElementById('cyber-cursor-root');
    if (!bgRoot) return;

    let useFallback = !hasWebGL();
    let currentSketchState = null;
    let cancelIdleMount = null;
    let disposeBg = null;

    function syncBackground(mode) {
      const isSketch = mode === 'sketch';
      if (currentSketchState === isSketch) return;
      currentSketchState = isSketch;

      if (cancelIdleMount) {
        cancelIdleMount();
        cancelIdleMount = null;
      }
      if (disposeBg) {
        disposeBg();
        disposeBg = null;
      }

      if (isSketch) {
        bgRoot.innerHTML = Icons.sketchBackdropSvg();
        return;
      }

      if (useFallback) {
        disposeBg = create2DConstellationFallback(bgRoot);
        return;
      }

      bgRoot.innerHTML = `<div id="network-webgl-host" aria-hidden="true" style="position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden;"></div>`;
      const webglHost = document.getElementById('network-webgl-host');
      cancelIdleMount = onIdle(() => {
        if (!webglHost || !webglHost.isConnected) return;
        try {
          disposeBg = createNetworkScene(webglHost);
        } catch (err) {
          console.warn('[NetworkBackground] Falling back to 2D canvas:', err);
          useFallback = true;
          disposeBg = create2DConstellationFallback(bgRoot);
        }
      }, 200);
    }

    // CyberCursor for 'code' mode on fine pointers
    const finePointer =
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    let cursorCleanup = null;

    function syncCyberCursor(mode) {
      if (!cursorRoot) return;
      const shouldBeActive = mode === 'code' && finePointer;
      if (!shouldBeActive) {
        if (cursorCleanup) {
          cursorCleanup();
          cursorCleanup = null;
        }
        cursorRoot.innerHTML = '';
        return;
      }
      if (cursorCleanup) return;

      cursorRoot.innerHTML = `<div id="cyber-xhair-el" class="cyber-xhair" aria-hidden="true">${Icons.cyberCursorSvg()}</div>`;
      const el = document.getElementById('cyber-xhair-el');
      const html = document.documentElement;
      html.classList.add('cyber-cursor');

      const onMove = (e) => {
        if (e.pointerType !== 'touch' && el) {
          el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
          el.style.opacity = '1';
        }
      };
      const onDown = () => el?.classList.add('is-down');
      const onUp = () => el?.classList.remove('is-down');
      const onLeave = () => {
        if (el) el.style.opacity = '0';
      };

      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerdown', onDown, { passive: true });
      window.addEventListener('pointerup', onUp, { passive: true });
      window.addEventListener('pointercancel', onUp, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);

      cursorCleanup = () => {
        html.classList.remove('cyber-cursor');
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerdown', onDown);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
        document.documentElement.removeEventListener('pointerleave', onLeave);
      };
    }

    const initialMode = getAnimationMode();
    syncBackground(initialMode);
    syncCyberCursor(initialMode);

    subscribeAnimationMode((nextMode) => {
      syncBackground(nextMode);
      syncCyberCursor(nextMode);
    });
  }

  /* --------------------------------------------------------------------------
     2. Navbar, Theme Toggle, Scroll-Spy & Mobile Animation Switcher
  -------------------------------------------------------------------------- */
  const NAV_ITEMS = [
    { id: 'home', label: 'ABOUT' },
    { id: 'education', label: 'EDUCATION' },
    { id: 'skills', label: 'SKILLS' },
    { id: 'services', label: 'SERVICES' },
    { id: 'experience', label: 'EXPERIENCE' },
    { id: 'projects', label: 'PROJECTS' },
    { id: 'tools', label: 'TOOLS' },
    { id: 'certifications', label: 'CERTIFICATIONS' },
    { id: 'contact', label: 'CONTACT' },
  ];

  function initNavbar() {
    const navEl = document.getElementById('site-navbar');
    if (!navEl) return;

    let isDark = document.documentElement.classList.contains('dark');
    let activeId = 'home';
    let menuOpen = false;
    let animDdOpen = false;
    let animMenuTop = 76;
    const webglSupported = hasWebGL();

    function setTheme(nextDark) {
      isDark = nextDark;
      document.documentElement.classList.toggle('dark', isDark);
      try {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      } catch {
        /* ignore */
      }
      updateNavbarUI();
    }

    function renderNavbarShell() {
      const mode = getAnimationMode();
      navEl.innerHTML = `
        <div class="w-full max-w-[1360px] mx-auto flex items-center gap-2">
          <div class="shrink-0 flex items-center">
            <span
              id="nav-wordmark"
              class="font-syne font-extrabold text-[1.15rem] cursor-pointer whitespace-nowrap tracking-[0.12em]"
              style="background: linear-gradient(to right, #8b5cf6, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
            >
              ${esc(DATA.hero.wordmark)}
            </span>
            <span id="nav-sketch-doodle-slot">${mode === 'sketch' ? Icons.sketchHeaderDoodleSvg() : ''}</span>
          </div>

          <div
            id="desktop-nav-links"
            class="desktop-nav flex-1 flex justify-center items-center relative"
            style="gap: clamp(4px, 1.2vw, 22px)"
          >
            <span id="nav-indicator" class="nav-indicator" aria-hidden="true"></span>
            ${NAV_ITEMS.map(
              (item) => `
                <span
                  data-text="${esc(item.label)}"
                  data-nav-id="${esc(item.id)}"
                  class="nav-link${activeId === item.id ? ' active-link' : ''}"
                >${esc(item.label)}</span>
              `
            ).join('')}
          </div>

          <div class="shrink-0 flex justify-end items-center ml-auto">
            ${
              webglSupported
                ? `
              <div id="mobile-anim-dd" class="anim-dd" data-open="false">
                <button
                  id="mobile-anim-btn"
                  type="button"
                  class="anim-dd__btn"
                  aria-haspopup="listbox"
                  aria-expanded="false"
                  aria-label="Change animation theme"
                  title="Animation theme"
                >
                  <span id="mobile-anim-cur-icon">${Icons.animationIcon(mode, 19)}</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="anim-dd__chev">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <div id="mobile-anim-menu" class="anim-dd__menu" role="listbox" aria-label="Animation theme" style="top: ${animMenuTop}px">
                  ${ANIMATION_MODES.map(
                    (m, k) => `
                    <button
                      type="button"
                      role="option"
                      data-mobile-mode="${esc(m.id)}"
                      aria-selected="${m.id === mode}"
                      class="anim-dd__item${m.id === mode ? ' is-active' : ''}"
                      style="--k: ${k}"
                    >
                      <span class="anim-dd__item-icon">${Icons.animationIcon(m.id, 17)}</span>
                      <span class="anim-dd__item-label">${esc(m.label)}</span>
                    </button>
                  `
                  ).join('')}
                </div>
              </div>
            `
                : ''
            }

            <button
              id="theme-toggle-btn"
              type="button"
              class="bg-transparent border-0 cursor-pointer flex items-center justify-center mr-1.5"
              style="color: var(--text); ${mode === 'sketch' ? 'display:none;' : ''}"
              aria-label="${isDark ? 'Switch to light mode' : 'Switch to dark mode'}"
              title="${isDark ? 'Switch to light mode' : 'Switch to dark mode'}"
            >
              ${isDark ? Icons.sunIcon(20) : Icons.moonIcon(20)}
            </button>

            <button
              id="mobile-burger-btn"
              type="button"
              class="mobile-burger bg-transparent border-0 cursor-pointer p-1"
              style="display: none; color: var(--text)"
              aria-label="Open navigation menu"
              aria-expanded="false"
            >
              ${Icons.menuIcon(24)}
            </button>
          </div>
        </div>

        <div id="mobile-nav-drawer" style="display: none"></div>
      `;
    }

    function syncIndicator() {
      const ind = document.getElementById('nav-indicator');
      const desktopNav = document.getElementById('desktop-nav-links');
      const target = desktopNav?.querySelector(`[data-nav-id="${activeId}"]`);
      if (ind && target) {
        ind.style.transform = `translateX(${target.offsetLeft}px)`;
        ind.style.width = `${target.offsetWidth}px`;
        ind.style.opacity = '1';
      }
    }

    function renderMobileDrawer() {
      const drawer = document.getElementById('mobile-nav-drawer');
      const burger = document.getElementById('mobile-burger-btn');
      if (!drawer || !burger) return;

      burger.setAttribute('aria-expanded', String(menuOpen));
      burger.setAttribute(
        'aria-label',
        menuOpen ? 'Close navigation menu' : 'Open navigation menu'
      );
      burger.innerHTML = menuOpen ? Icons.closeIcon(24) : Icons.menuIcon(24);

      if (!menuOpen) {
        drawer.style.display = 'none';
        drawer.innerHTML = '';
        return;
      }

      const mode = getAnimationMode();
      const accentActive = mode === 'sketch' || mode === 'wildfire' || mode === 'code';

      drawer.style.cssText =
        'margin:8px 16px 0;border-radius:16px;padding:12px;background:var(--surface);border:1px solid var(--border);box-shadow:0 16px 40px rgba(0,0,0,0.2);display:grid;grid-template-columns:1fr 1fr;gap:8px;';

      drawer.innerHTML = NAV_ITEMS.map((item) => {
        const active = activeId === item.id;
        const color = active ? (accentActive ? 'var(--accent)' : '#ff3333') : 'var(--text)';
        const bg = active
          ? accentActive
            ? 'color-mix(in srgb, var(--accent) 8%, transparent)'
            : 'rgba(255, 51, 51, .05)'
          : 'var(--surface2)';
        const border = active
          ? accentActive
            ? '1px solid color-mix(in srgb, var(--accent) 34%, transparent)'
            : '1px solid rgba(255, 51, 51, .2)'
          : '1px solid transparent';
        return `
          <div
            data-drawer-nav="${esc(item.id)}"
            class="flex items-center justify-center py-2.5 px-1 rounded-[10px] font-syne font-bold text-xs tracking-[0.05em] cursor-pointer transition-all duration-200 text-center"
            style="color:${color};background:${bg};border:${border};"
          >
            ${esc(item.label)}
          </div>
        `;
      }).join('');

      drawer.querySelectorAll('[data-drawer-nav]').forEach((el) => {
        el.addEventListener('click', () => {
          const id = el.getAttribute('data-drawer-nav');
          if (id) handleNavClick(id);
        });
      });
    }

    function updateNavbarUI() {
      const mode = getAnimationMode();
      const doodleSlot = document.getElementById('nav-sketch-doodle-slot');
      if (doodleSlot) {
        doodleSlot.innerHTML = mode === 'sketch' ? Icons.sketchHeaderDoodleSvg() : '';
      }

      const themeBtn = document.getElementById('theme-toggle-btn');
      if (themeBtn) {
        themeBtn.style.display = mode === 'sketch' ? 'none' : 'flex';
        themeBtn.setAttribute(
          'aria-label',
          isDark ? 'Switch to light mode' : 'Switch to dark mode'
        );
        themeBtn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        themeBtn.innerHTML = isDark ? Icons.sunIcon(20) : Icons.moonIcon(20);
      }

      document.querySelectorAll('#desktop-nav-links .nav-link').forEach((link) => {
        const id = link.getAttribute('data-nav-id');
        link.classList.toggle('active-link', id === activeId);
      });

      const mobileDd = document.getElementById('mobile-anim-dd');
      const mobileBtn = document.getElementById('mobile-anim-btn');
      const mobileCurIcon = document.getElementById('mobile-anim-cur-icon');
      const mobileMenu = document.getElementById('mobile-anim-menu');
      if (mobileDd && mobileBtn && mobileCurIcon && mobileMenu) {
        mobileDd.setAttribute('data-open', String(animDdOpen));
        mobileBtn.setAttribute('aria-expanded', String(animDdOpen));
        mobileCurIcon.innerHTML = Icons.animationIcon(mode, 19);
        mobileMenu.style.top = `${animMenuTop}px`;
        mobileMenu.querySelectorAll('[data-mobile-mode]').forEach((opt) => {
          const mId = opt.getAttribute('data-mobile-mode');
          const isAct = mId === mode;
          opt.classList.toggle('is-active', isAct);
          opt.setAttribute('aria-selected', String(isAct));
        });
      }

      renderMobileDrawer();
      syncIndicator();
    }

    function handleNavClick(id) {
      menuOpen = false;
      activeId = id;
      updateNavbarUI();
      if (id === 'home') {
        scrollToTop();
      } else {
        scrollToSection(id);
      }
    }

    renderNavbarShell();

    document.getElementById('nav-wordmark')?.addEventListener('click', () => handleNavClick('home'));
    document.querySelectorAll('#desktop-nav-links .nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        const id = link.getAttribute('data-nav-id');
        if (id) handleNavClick(id);
      });
    });

    document.getElementById('theme-toggle-btn')?.addEventListener('click', () => {
      setTheme(!isDark);
    });

    document.getElementById('mobile-burger-btn')?.addEventListener('click', () => {
      if (!menuOpen) {
        animDdOpen = false;
      }
      menuOpen = !menuOpen;
      updateNavbarUI();
    });

    const mobileBtn = document.getElementById('mobile-anim-btn');
    const mobileDd = document.getElementById('mobile-anim-dd');
    if (mobileBtn && mobileDd) {
      mobileBtn.addEventListener('click', () => {
        if (!animDdOpen) {
          const bottom = mobileBtn.getBoundingClientRect().bottom || 56;
          animMenuTop = Math.round(bottom) + 14;
          menuOpen = false;
        }
        animDdOpen = !animDdOpen;
        updateNavbarUI();
      });

      mobileDd.querySelectorAll('[data-mobile-mode]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const mId = btn.getAttribute('data-mobile-mode');
          if (mId) setAnimationMode(mId);
          animDdOpen = false;
          updateNavbarUI();
        });
      });

      document.addEventListener('pointerdown', (e) => {
        if (animDdOpen && !mobileDd.contains(e.target)) {
          animDdOpen = false;
          updateNavbarUI();
        }
      });
      document.addEventListener('keydown', (e) => {
        if (animDdOpen && e.key === 'Escape') {
          animDdOpen = false;
          updateNavbarUI();
        }
      });
    }

    const onScroll = () => {
      const scrolled = window.scrollY > 60;
      navEl.style.background = scrolled ? 'var(--nav-bg)' : 'var(--nav-bg-unscrolled)';
      navEl.style.boxShadow = scrolled ? '0 4px 30px rgba(0,0,0,0.05)' : 'none';
      navEl.style.borderBottom = scrolled ? '1px solid var(--border)' : 'none';

      if (animDdOpen) {
        animDdOpen = false;
      }

      let nextActive = activeId;
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight / 3) {
          nextActive = item.id;
        }
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) {
        nextActive = NAV_ITEMS[NAV_ITEMS.length - 1].id;
      }

      if (nextActive !== activeId) {
        activeId = nextActive;
        updateNavbarUI();
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const desktopNav = document.getElementById('desktop-nav-links');
    if (desktopNav && typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(syncIndicator);
      ro.observe(desktopNav);
    }
    document.fonts?.ready?.then(syncIndicator).catch(() => {});

    subscribeAnimationMode(() => {
      updateNavbarUI();
    });
  }

  /* --------------------------------------------------------------------------
     3. Hero Section, 3D HeroScene, TypedText, AnimPicker & StatCounters
  -------------------------------------------------------------------------- */
  function formatSocialHref(platform, raw) {
    const s = String(raw || '').trim();
    if (platform === 'phone') return s.startsWith('tel:') ? s : `tel:${s.replace(/[^+\d]/g, '')}`;
    if (platform === 'email') return s.startsWith('mailto:') ? s : `mailto:${s}`;
    if (platform === 'whatsapp') {
      if (s.startsWith('http://') || s.startsWith('https://')) return s;
      return `https://wa.me/${s.replace(/[^\d]/g, '')}`;
    }
    if (/^(https?:|mailto:|tel:)/i.test(s)) return s;
    return `https://${s}`;
  }

  function formatSocialLabel(platform) {
    switch (platform) {
      case 'phone':
        return 'Call Phone';
      case 'email':
        return 'Email Me';
      case 'whatsapp':
        return 'WhatsApp';
      case 'linkedin':
        return 'LinkedIn';
      case 'github':
        return 'GitHub';
      case 'facebook':
        return 'Facebook';
      case 'accredible':
        return 'Google Credentials';
      default:
        return platform.charAt(0).toUpperCase() + platform.slice(1);
    }
  }

  function initHero() {
    const sec = document.getElementById('home');
    if (!sec) return;
    const { hero } = DATA;
    const webglSupported = hasWebGL();
    const initialMode = getAnimationMode();
    const initialMeta = ANIMATION_MODES.find((m) => m.id === initialMode) || ANIMATION_MODES[0];

    let wordIdx = 0;
    const bioLinesHtml = hero.bio
      .split(/\r?\n/)
      .map((line, li, arr) => {
        const mb = li < arr.length - 1 ? (line.trim() === '' ? 12 : 8) : 0;
        const inner = line
          ? line
              .split(' ')
              .map(
                (word) =>
                  `<span class="hero-word" style="--w:${wordIdx++}">${esc(word)}</span>`
              )
              .join(' ')
          : '&nbsp;';
        return `<p class="hero-bio-line" style="margin:0;margin-bottom:${mb}px;">${inner}</p>`;
      })
      .join('');

    sec.innerHTML = `
      <div class="hero-spot" aria-hidden="true"></div>
      <div class="blob" style="width:520px;height:520px;background:#2563eb;top:-120px;right:-120px;"></div>
      <div class="blob" style="width:380px;height:380px;background:#0ea5e9;bottom:-60px;left:3%;"></div>
      <div class="blob" style="width:280px;height:280px;background:#14b8a6;top:30%;left:42%;"></div>

      <div id="hero-scene-host" aria-hidden="true" style="position:absolute;inset:0;z-index:1;pointer-events:none;overflow:hidden;"></div>

      <div class="neural-hero-brain" aria-hidden="true">
        ${Icons.neuralBrainSvg()}
      </div>

      <div class="sketch-hero-doodles" aria-hidden="true">
        ${Icons.sketchHeroDoodlesSvg()}
      </div>

      <div
        class="hero-grid max-w-[1360px] mx-auto w-full grid grid-cols-2 gap-12 items-center relative z-[2]"
      >
        <div>
          <h1
            class="hero-title font-bold leading-[1.15] mb-[18px] tracking-[0.01em]"
            style="animation: fadeUp .6s .25s ease both; opacity: 0;"
          >
            <span class="hero-hi">Hi, I'm</span><br />
            <span class="grad-text hero-name">${esc(hero.name)}</span>
          </h1>

          <p
            class="font-syne font-semibold text-[1.2rem] mb-4 tracking-[0.02em]"
            style="color: var(--accent); animation: fadeUp .6s .4s ease both; opacity: 0;"
          >
            <span class="hero-typed">
              <span class="hero-typed-ghost" aria-hidden="true">${esc(hero.subtitle)}</span>
              <span class="hero-typed-live" aria-label="${esc(hero.subtitle)}">
                <span id="hero-typed-text"></span><i id="hero-typed-caret" class="hero-caret"></i>
              </span>
            </span>
          </p>

          <div
            class="hero-bio font-syne font-medium text-[1.06rem] leading-[1.75] max-w-[540px] mb-7 tracking-[0.01em]"
            style="color: var(--text)"
          >
            ${bioLinesHtml}
          </div>

          <div class="hero-cta-group" style="animation: fadeUp .6s .7s ease both; opacity: 0;">
            <a
              href="${esc(hero.resumeLink)}"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary hero-btn-cv"
            >
              ${Icons.downloadIcon(16)}
              <span>${esc(hero.resumeButtonText)}</span>
            </a>

            <a
              href="#contact"
              id="hero-contact-btn"
              class="btn-outline hero-btn-contact"
            >
              <span>Contact Me</span>
            </a>
          </div>

          <div class="hero-social-group" style="animation: fadeUp .6s .85s ease both; opacity: 0;">
            ${hero.socialLinks
              .map((item, idx) => {
                const href = formatSocialHref(item.platform, item.url);
                const label = formatSocialLabel(item.platform);
                const external = href.startsWith('http');
                return `
                  <a
                    href="${esc(href)}"
                    ${external ? 'target="_blank" rel="noopener noreferrer"' : ''}
                    aria-label="${esc(label)}"
                    data-label="${esc(label)}"
                    data-cat="${esc(item.platform)}"
                    class="social-icon hero-social-icon"
                    style="--i: ${idx}"
                  >
                    ${Icons.socialIcon(item.platform, 18)}
                  </a>
                `;
              })
              .join('')}
          </div>
        </div>

        <div
          class="hero-avatar flex justify-center -mt-10"
          style="animation: fadeUp .6s .3s ease both; opacity: 0;"
        >
          <div id="hero-avatar-wrap" class="animate-float hero-avatar-wrapper relative">
            <span class="hero-aura" aria-hidden="true"></span>
            <span class="hero-orbit" aria-hidden="true"><i></i><i></i><i></i></span>
            <div class="ring1"></div>
            <div class="ring2"></div>
            <div
              class="hero-avatar-inner rounded-full overflow-hidden flex items-center justify-center"
              style="box-shadow: var(--card-glow-hover); border: 4px solid var(--accent); background: var(--surface);"
            >
              <img
                src="${esc(hero.avatarUrl)}"
                alt="${esc(hero.name)}"
                width="310"
                height="310"
                fetchpriority="high"
                class="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>

      ${
        webglSupported
          ? `
        <div id="hero-anim-picker" class="anim-picker" data-open="false">
          <div class="anim-picker__panel">
            <button
              id="hero-anim-head"
              type="button"
              class="anim-picker__head"
              aria-expanded="false"
              aria-controls="anim-picker-list"
              aria-label="Animation theme: ${esc(initialMeta.label)}. Change"
            >
              <span id="hero-anim-cur" class="anim-picker__cur">
                ${Icons.animationIcon(initialMode, 19)}
              </span>
              <span class="anim-picker__caption">
                <span class="anim-picker__caption-title">Animation</span>
                <span id="hero-anim-label" class="anim-picker__caption-value">${esc(initialMeta.label)}</span>
              </span>
              <svg class="anim-picker__chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>

            <div
              id="anim-picker-list"
              class="anim-picker__list"
              role="radiogroup"
              aria-label="Animation theme"
              aria-hidden="true"
            >
              <div class="anim-picker__inner">
                ${ANIMATION_MODES.map(
                  (m, k) => `
                  <button
                    type="button"
                    role="radio"
                    aria-checked="${m.id === initialMode}"
                    tabindex="-1"
                    data-mode="${esc(m.id)}"
                    data-tip="${esc(m.label)}"
                    aria-label="${esc(m.label)} — ${esc(m.blurb)}"
                    class="anim-opt${m.id === initialMode ? ' is-active' : ''}"
                    style="--k: ${k}"
                  >
                    ${Icons.animationIcon(m.id, 20)}
                  </button>
                `
                ).join('')}
              </div>
            </div>
          </div>
        </div>
      `
          : ''
      }

      <div
        class="hero-stats-container absolute bottom-0 left-0 right-0 z-[2] py-2.5 px-6 border-t backdrop-blur-md"
        style="background: var(--surface2); border-color: var(--border);"
      >
        <span class="hero-stats-line" aria-hidden="true"></span>
        <div
          class="hero-stats max-w-[1100px] mx-auto grid gap-10"
          style="grid-template-columns: repeat(${hero.stats.length}, 1fr);"
        >
          ${hero.stats
            .map(
              (st, idx) => `
            <div class="hero-stat text-center flex flex-col gap-1" style="--i: ${idx}">
              <div
                data-stat-value="${esc(st.value)}"
                class="grad-text hero-stats-value font-syne font-extrabold"
              >${esc(st.value)}</div>
              <div class="hero-stats-label font-medium opacity-75" style="color: var(--text)">
                ${esc(st.label)}
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `;

    // Contact CTA smooth scroll
    document.getElementById('hero-contact-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToSection('contact');
    });

    // Pointer spotlight + 3D avatar tilt
    const avatarWrap = document.getElementById('hero-avatar-wrap');
    sec.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const rect = sec.getBoundingClientRect();
      sec.style.setProperty('--hx', `${e.clientX - rect.left}px`);
      sec.style.setProperty('--hy', `${e.clientY - rect.top}px`);
      if (avatarWrap) {
        const r = avatarWrap.getBoundingClientRect();
        const nx = Math.max(
          -1,
          Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2))
        );
        const ny = Math.max(
          -1,
          Math.min(1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2))
        );
        avatarWrap.style.setProperty('--ry', `${(nx * 9).toFixed(2)}deg`);
        avatarWrap.style.setProperty('--rx', `${(-ny * 7).toFixed(2)}deg`);
      }
    });
    sec.addEventListener('pointerleave', () => {
      avatarWrap?.style.setProperty('--rx', '0deg');
      avatarWrap?.style.setProperty('--ry', '0deg');
    });

    // TypedText subtitle animation
    const typedEl = document.getElementById('hero-typed-text');
    const caretEl = document.getElementById('hero-typed-caret');
    const fullSubtitle = hero.subtitle;
    if (typedEl && caretEl) {
      if (prefersReduced()) {
        typedEl.textContent = fullSubtitle;
        caretEl.classList.add('is-done');
      } else {
        let cur = 0;
        window.setTimeout(() => {
          const iv = window.setInterval(() => {
            cur += 1;
            typedEl.textContent = fullSubtitle.slice(0, cur);
            if (cur >= fullSubtitle.length) {
              window.clearInterval(iv);
              caretEl.classList.add('is-done');
            }
          }, 34);
        }, 650);
      }
    }

    // StatCounter count-up animations
    sec.querySelectorAll('[data-stat-value]').forEach((statEl) => {
      const raw = statEl.getAttribute('data-stat-value') || '';
      const m = raw.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
      if (!m || prefersReduced()) {
        statEl.textContent = raw;
        return;
      }
      const prefix = m[1];
      const target = parseFloat(m[2]);
      const decimals = m[2].includes('.') ? m[2].split('.')[1].length : 0;
      const suffix = m[3];
      statEl.textContent = `${prefix}0${suffix}`;
      window.setTimeout(() => {
        const t0 = performance.now();
        const step = (now) => {
          const k = Math.min((now - t0) / 1400, 1);
          const eased = 1 - Math.pow(1 - k, 3);
          statEl.textContent = `${prefix}${(target * eased).toFixed(decimals)}${suffix}`;
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }, 900);
    });

    // HeroScene 3D WebGL mount
    const heroSceneHost = document.getElementById('hero-scene-host');
    if (heroSceneHost && webglSupported) {
      onIdle(() => {
        try {
          createHeroScene(heroSceneHost, '.hero-avatar-wrapper');
        } catch (err) {
          console.warn('[HeroScene] disabled:', err);
        }
      });
    }

    // Desktop AnimPicker Dock
    const picker = document.getElementById('hero-anim-picker');
    const pickerHead = document.getElementById('hero-anim-head');
    const pickerList = document.getElementById('anim-picker-list');
    if (picker && pickerHead && pickerList) {
      let pickerOpen = false;
      let autoCloseTimer = 0;

      const syncPickerUI = () => {
        const mode = getAnimationMode();
        const meta = ANIMATION_MODES.find((x) => x.id === mode) || ANIMATION_MODES[0];
        picker.setAttribute('data-open', String(pickerOpen));
        pickerHead.setAttribute('aria-expanded', String(pickerOpen));
        pickerHead.setAttribute(
          'aria-label',
          pickerOpen ? 'Close animation themes' : `Animation theme: ${meta.label}. Change`
        );
        pickerList.setAttribute('aria-hidden', String(!pickerOpen));

        const curIcon = document.getElementById('hero-anim-cur');
        const curLabel = document.getElementById('hero-anim-label');
        if (curIcon) curIcon.innerHTML = Icons.animationIcon(mode, 19);
        if (curLabel) curLabel.textContent = meta.label;

        pickerList.querySelectorAll('.anim-opt').forEach((btn) => {
          const id = btn.getAttribute('data-mode');
          const active = id === mode;
          btn.classList.toggle('is-active', active);
          btn.setAttribute('aria-checked', String(active));
          btn.setAttribute('tabindex', pickerOpen && active ? '0' : '-1');
        });
      };

      pickerHead.addEventListener('click', () => {
        window.clearTimeout(autoCloseTimer);
        pickerOpen = !pickerOpen;
        syncPickerUI();
      });

      pickerList.querySelectorAll('.anim-opt').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-mode');
          if (id) setAnimationMode(id);
          window.clearTimeout(autoCloseTimer);
          autoCloseTimer = window.setTimeout(() => {
            pickerOpen = false;
            syncPickerUI();
          }, 260);
        });
      });

      pickerList.addEventListener('keydown', (e) => {
        if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)) return;
        e.preventDefault();
        const curMode = getAnimationMode();
        const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
        const nextIdx =
          (ANIMATION_MODES.findIndex((m) => m.id === curMode) + dir + ANIMATION_MODES.length) %
          ANIMATION_MODES.length;
        const next = ANIMATION_MODES[nextIdx];
        setAnimationMode(next.id);
        pickerList.querySelector(`[data-mode="${next.id}"]`)?.focus();
      });

      document.addEventListener('pointerdown', (e) => {
        if (pickerOpen && !picker.contains(e.target)) {
          pickerOpen = false;
          syncPickerUI();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (pickerOpen && e.key === 'Escape') {
          pickerOpen = false;
          syncPickerUI();
        }
      });

      subscribeAnimationMode(() => syncPickerUI());
    }
  }

  /* --------------------------------------------------------------------------
     4. Education Section, Scroll Rail & Animated SVG GPA Dials
  -------------------------------------------------------------------------- */
  function renderEduDialHtml(item, idx) {
    const match = item.cgpa.match(/([\d.]+)\s*\/\s*([\d.]+)/);
    if (!match) {
      return `<span class="tech-badge" style="background:transparent;border:1.5px solid ${esc(item.tc)};color:${esc(item.tc)};font-size:.84rem;padding:6px 16px;font-weight:700;border-radius:9999px;">${esc(item.cgpa)}</span>`;
    }
    const rawValStr = match[1];
    const val = parseFloat(rawValStr);
    const max = parseFloat(match[2]);
    const decimals = rawValStr.includes('.') ? rawValStr.split('.')[1].length : 0;
    const label = (item.cgpa.split(':')[0] || 'GPA').trim();
    const pct = (val / max) * 100;
    const roundedPct = Math.round(pct);
    const circ = 2 * Math.PI * 24;
    const zeroStr = decimals > 0 ? (0).toFixed(decimals) : '0';
    const gradId = `eg-dial-${idx}`;

    return `
      <div
        class="edu-grade"
        data-edu-dial="true"
        data-val="${val}"
        data-max="${max}"
        data-decimals="${decimals}"
        data-pct="${pct}"
        style="--gc: ${esc(item.tc)}; --gb: ${esc(item.bc)};"
      >
        <div class="edu-dial">
          <svg class="edu-dial-svg" width="52" height="52" viewBox="0 0 52 52" aria-hidden="true">
            <defs>
              <linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" style="stop-color: color-mix(in srgb, ${esc(item.tc)} 55%, white)" />
                <stop offset="100%" style="stop-color: ${esc(item.tc)}" />
              </linearGradient>
            </defs>
            <circle cx="26" cy="26" r="24" stroke="var(--border)" stroke-width="4" fill="none" opacity="0.55" />
            <circle
              class="edu-dial-arc"
              cx="26"
              cy="26"
              r="24"
              stroke="url(#${gradId})"
              stroke-width="4"
              fill="none"
              stroke-dasharray="${circ}"
              stroke-dashoffset="${circ}"
              stroke-linecap="round"
              style="transition: stroke-dashoffset 1.5s cubic-bezier(0.34, 1.2, 0.64, 1)"
            />
            <g
              class="edu-dial-cap-group"
              style="transform-origin:26px 26px;transform:rotate(0deg);transition:transform 1.5s cubic-bezier(0.34, 1.2, 0.64, 1);opacity:0;"
            >
              <circle class="edu-dial-cap" cx="50" cy="26" r="2.6" fill="#fff" />
            </g>
          </svg>
          <span class="edu-dial-val">${zeroStr}</span>
        </div>
        <div class="edu-grade-text">
          <span class="edu-grade-label">${esc(label)}</span>
          <span class="edu-grade-sub">
            out of ${max.toFixed(2)}
            <b>${roundedPct}%</b>
          </span>
        </div>
      </div>
    `;
  }

  function initEducation() {
    const sec = document.getElementById('education');
    if (!sec) return;

    sec.innerHTML = `
      <div class="max-w-[1360px] mx-auto">
        ${renderSectionHeader('Academic Journey', 'Education')}
        <div id="edu-list-el" class="edu-list max-w-[1060px] mx-auto flex flex-col gap-6">
          <span class="edu-rail" aria-hidden="true"></span>
          ${DATA.education
            .map((item, idx) => {
              const delay = idx * 150;
              const years = item.yr.match(/\b(?:19|20)\d{2}\b/g);
              const endYear = years ? years[years.length - 1] : '';
              return `
                <div
                  data-reveal="root"
                  class="reveal edu-item"
                  style="transition-delay:${delay}ms;--d:${delay};"
                >
                  <span class="edu-connector" aria-hidden="true"></span>
                  <span class="edu-dot" aria-hidden="true"></span>

                  <div
                    class="card edu-card edu-card-x relative overflow-hidden"
                    style="padding: 34px 44px"
                  >
                    <span class="edu-orbit" aria-hidden="true"></span>
                    ${endYear ? `<span class="edu-year" aria-hidden="true">${esc(endYear)}</span>` : ''}

                    <div class="edu-card-content flex flex-wrap items-center gap-8">
                      <div class="edu-logo-wrap">
                        <span class="edu-ring" aria-hidden="true"></span>
                        <span class="edu-pulse" aria-hidden="true"></span>
                        <div
                          class="edu-logo rounded-full flex items-center justify-center shrink-0 overflow-hidden"
                          style="width:104px;height:104px;background:#ffffff;padding:12px;box-shadow:0 8px 24px rgba(0,0,0,0.12);border:2px solid var(--border);"
                        >
                          <img
                            src="${esc(item.img)}"
                            alt="${esc(item.inst)}"
                            width="80"
                            height="80"
                            loading="lazy"
                            decoding="async"
                            class="w-full h-full object-contain"
                          />
                        </div>
                      </div>

                      <div class="edu-text flex-1 min-w-[260px]">
                        <div
                          class="edu-title font-syne font-bold text-[1.42rem] mb-2 leading-[1.3] tracking-[0.01em]"
                          style="color: var(--text)"
                        >
                          ${esc(item.deg)}
                        </div>

                        <div class="flex items-center gap-2 mb-2">
                          ${
                            item.instUrl
                              ? `<a
                                  class="edu-school text-[1.02rem] font-semibold tracking-[0.01em] transition-colors duration-200 hover:text-[var(--accent)]"
                                  href="${esc(item.instUrl)}"
                                  target="_blank"
                                  rel="noreferrer"
                                  style="color: var(--text)"
                                >${esc(item.inst)}</a>`
                              : `<div class="edu-school text-[1.02rem] font-semibold tracking-[0.01em]" style="color: var(--text)">${esc(item.inst)}</div>`
                          }
                        </div>

                        <div class="edu-meta flex items-center flex-wrap gap-5 mt-1">
                          <div class="edu-date text-[0.9rem] font-medium" style="color: var(--muted)">
                            ${esc(item.yr)}
                          </div>
                          ${renderEduDialHtml(item, idx)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              `;
            })
            .join('')}
        </div>
      </div>
    `;

    // 3D pointer tilt on edu cards
    sec.querySelectorAll('.edu-card-x').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
        card.style.setProperty('--rx', `${((0.5 - (e.clientY - r.top) / r.height) * 3).toFixed(2)}deg`);
        card.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width - 0.5) * 4).toFixed(2)}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });

    // Animated GPA Score Dials
    sec.querySelectorAll('[data-edu-dial="true"]').forEach((dialEl) => {
      const val = parseFloat(dialEl.getAttribute('data-val') || '0');
      const decimals = parseInt(dialEl.getAttribute('data-decimals') || '0', 10);
      const pct = parseFloat(dialEl.getAttribute('data-pct') || '0');
      const circ = 2 * Math.PI * 24;
      const targetOffset = circ - (pct / 100) * circ;
      const finalFormatted = decimals > 0 ? val.toFixed(decimals) : String(val);
      const zeroFormatted = decimals > 0 ? (0).toFixed(decimals) : '0';

      const arcEl = dialEl.querySelector('.edu-dial-arc');
      const capGroup = dialEl.querySelector('.edu-dial-cap-group');
      const valEl = dialEl.querySelector('.edu-dial-val');

      dialEl.addEventListener('mouseenter', () => dialEl.classList.add('is-hover'));
      dialEl.addEventListener('mouseleave', () => dialEl.classList.remove('is-hover'));

      let cleanupAnim = null;

      const setArcState = (offset) => {
        if (arcEl) arcEl.setAttribute('stroke-dashoffset', String(offset));
        const progress = circ > 0 ? Math.min(Math.max(1 - offset / circ, 0), 1) : 0;
        if (capGroup) {
          capGroup.style.transform = `rotate(${progress * 360}deg)`;
          capGroup.style.opacity = progress > 0.02 ? '1' : '0';
        }
      };

      const startAnim = () => {
        if (prefersReduced()) {
          setArcState(targetOffset);
          if (valEl) valEl.textContent = finalFormatted;
          return () => {};
        }

        setArcState(circ);
        if (valEl) valEl.textContent = zeroFormatted;
        const timer = window.setTimeout(() => {
          setArcState(targetOffset);
        }, 150);

        const t0 = performance.now();
        let raf = 0;
        const tick = (now) => {
          const elapsed = Math.max(0, now - t0);
          const p = Math.min(elapsed / 1200, 1);
          const eased = (1 - Math.pow(1 - p, 3)) * val;
          if (p < 1) {
            if (valEl) {
              valEl.textContent = decimals > 0 ? eased.toFixed(decimals) : String(Math.round(eased));
            }
            raf = requestAnimationFrame(tick);
          } else if (valEl) {
            valEl.textContent = finalFormatted;
          }
        };
        raf = requestAnimationFrame(tick);

        return () => {
          window.clearTimeout(timer);
          cancelAnimationFrame(raf);
        };
      };

      if (typeof IntersectionObserver === 'undefined') {
        startAnim();
      } else {
        const io = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              cleanupAnim?.();
              cleanupAnim = startAnim();
            } else {
              cleanupAnim?.();
              setArcState(circ);
              if (valEl) valEl.textContent = zeroFormatted;
            }
          },
          { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
        );
        io.observe(dialEl);
      }

      window.addEventListener('hashchange', () => {
        if (window.location.hash === '#education') {
          cleanupAnim?.();
          cleanupAnim = startAnim();
        }
      });
    });

    // Scroll-driven Education Timeline Rail
    const listEl = document.getElementById('edu-list-el');
    if (listEl) {
      const reduced = prefersReduced();
      let raf = 0;
      const updateRail = () => {
        raf = 0;
        const rect = listEl.getBoundingClientRect();
        const triggerY = window.innerHeight * 0.62;
        const firstDot = listEl.querySelector('.edu-dot');
        const railTop = firstDot
          ? firstDot.getBoundingClientRect().top + firstDot.offsetHeight / 2 - rect.top
          : 0;
        const fill = reduced
          ? rect.height
          : Math.min(
              Math.max(triggerY - rect.top - railTop, 0),
              Math.max(rect.height - railTop, 0)
            );
        listEl.style.setProperty('--rail-top', `${railTop}px`);
        listEl.style.setProperty('--fill', `${fill}px`);

        listEl.querySelectorAll('.edu-item').forEach((itemEl) => {
          const dot = itemEl.querySelector('.edu-dot');
          if (!dot) return;
          const dr = dot.getBoundingClientRect();
          itemEl.classList.toggle('reached', reduced || dr.top + dr.height / 2 < triggerY);
        });
      };

      const schedule = () => {
        if (!raf) raf = requestAnimationFrame(updateRail);
      };

      updateRail();
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule);
      if (typeof ResizeObserver !== 'undefined') {
        new ResizeObserver(schedule).observe(listEl);
      }
    }
  }

  /* --------------------------------------------------------------------------
     5. Technical Skills Section, FLIP Layout Grid & Git Insights
  -------------------------------------------------------------------------- */
  const SKILL_TABS = [
    { key: 'all', label: 'All' },
    { key: 'programming', label: 'Programming', color: '#3b82f6' },
    { key: 'web', label: 'Web & Full-Stack', color: '#14b8a6' },
    { key: 'ai', label: 'AI & Agents', color: '#a855f7' },
    { key: 'database', label: 'Databases & CRM', color: '#f59e0b' },
    { key: 'design', label: 'Design & Media', color: '#38bdf8' },
    { key: 'tools', label: 'Tools & Security', color: '#ec4899' },
  ];

  const SKILL_CAT_COLORS = {
    programming: '#3b82f6',
    web: '#14b8a6',
    ai: '#a855f7',
    database: '#f59e0b',
    design: '#38bdf8',
    tools: '#ec4899',
  };

  function initSkills() {
    const sec = document.getElementById('skills');
    if (!sec) return;

    let currentCat = 'all';
    const brokenIcons = new Set();
    const skills = DATA.skills;
    const countFor = (k) => (k === 'all' ? skills.length : skills.filter((s) => s.cat === k).length);

    sec.innerHTML = `
      <div class="max-w-[1360px] mx-auto">
        ${renderSectionHeader('Technical Skills', 'My Tech Stack')}

        <div class="skills-filter">
          <div id="skills-pf-bar" class="pf-bar">
            ${SKILL_TABS.map(
              (t) => `
                <button
                  type="button"
                  data-skill-tab="${esc(t.key)}"
                  class="filter-tab${t.key === currentCat ? ' active' : ''}"
                >
                  ${
                    t.key !== 'all'
                      ? `<i class="skills-dot" style="background:${t.color}" aria-hidden="true"></i>`
                      : ''
                  }
                  ${esc(t.label)}
                  <span class="pf-count">${countFor(t.key)}</span>
                </button>
              `
            ).join('')}
          </div>
        </div>

        <div id="skills-stage" data-reveal="root" class="reveal skills-live">
          <div id="skills-grid-el" class="skills-grid">
            <span class="skills-sweep" aria-hidden="true"></span>
            <span id="skills-spot-el" class="skills-spot" aria-hidden="true"></span>
          </div>
        </div>

        <div
          data-reveal="root"
          class="reveal skills-insights-grid mt-8 grid gap-[22px]"
          style="grid-template-columns: 1fr 1.15fr;"
        >
          <div class="card edu-card py-6 px-7">
            <div class="flex items-center justify-between mb-3.5">
              <span class="text-[0.76rem] font-bold uppercase tracking-[0.12em]" style="color: var(--accent)">
                Most Used Languages (Git)
              </span>
              <span class="mono text-xs" style="color: var(--muted)">6 Languages</span>
            </div>

            <div class="flex h-2.5 rounded-full overflow-hidden gap-0.5 mb-[18px]" style="background: var(--surface2)">
              ${DATA.gitLanguages
                .map(
                  (lang) => `
                  <div
                    title="${esc(lang.name)}: ${lang.percent}%"
                    class="rounded-full"
                    style="width:${lang.percent}%;background:${esc(lang.color)};"
                  ></div>
                `
                )
                .join('')}
            </div>

            <div class="grid grid-cols-2 gap-x-4 gap-y-2.5">
              ${DATA.gitLanguages
                .map(
                  (lang) => `
                  <div class="flex items-center justify-between text-[0.84rem]">
                    <span class="inline-flex items-center gap-2 font-semibold" style="color: var(--text)">
                      <span class="inline-block w-[9px] h-[9px] rounded-full" style="background:${esc(lang.color)}"></span>
                      ${esc(lang.name)}
                    </span>
                    <span class="mono text-[0.78rem]" style="color: var(--muted)">${lang.percent.toFixed(2)}%</span>
                  </div>
                `
                )
                .join('')}
            </div>
          </div>

          <div class="card edu-card py-6 px-7 flex flex-col gap-3.5">
            <div>
              <div class="text-[0.76rem] font-bold uppercase tracking-[0.12em] mb-2.5" style="color: var(--accent)">
                Personal Summary &amp; Research Interests
              </div>
              <div class="flex flex-wrap gap-[7px]">
                ${[...DATA.personalTraits, ...DATA.interests.slice(0, 4)]
                  .map(
                    (item) => `
                    <span
                      class="text-[0.74rem] font-semibold py-1 px-[11px] rounded-full"
                      style="background:color-mix(in srgb, var(--accent) 9%, var(--surface2));border:1px solid color-mix(in srgb, var(--accent) 22%, var(--border));color:var(--text);"
                    >${esc(item)}</span>
                  `
                  )
                  .join('')}
              </div>
            </div>

            <div
              class="pt-3 flex flex-wrap items-center justify-between gap-2.5"
              style="border-top: 1px solid var(--border)"
            >
              <span class="text-[0.78rem] font-bold" style="color: var(--text)">Language Proficiency:</span>
              <div class="flex flex-wrap gap-2">
                ${DATA.spokenLanguages
                  .map(
                    (sp) => `
                    <span
                      class="text-[0.76rem] font-semibold py-1 px-[11px] rounded-full"
                      style="color:var(--accent);background:color-mix(in srgb, var(--accent) 12%, transparent);"
                    >${esc(sp.language)} — ${esc(sp.level)}</span>
                  `
                  )
                  .join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const barEl = document.getElementById('skills-pf-bar');
    const stageEl = document.getElementById('skills-stage');
    const gridEl = document.getElementById('skills-grid-el');
    const spotEl = document.getElementById('skills-spot-el');
    const syncPill = setupFilterPill(barEl);

    function renderFallbackBadge(sk, catColor) {
      const clr = sk.c || catColor;
      const text = sk.badgeText || sk.name.slice(0, 2).toUpperCase();
      return `<span class="skill-icon syne" style="width:40px;height:40px;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;font-weight:800;font-size:.82rem;letter-spacing:.03em;color:${esc(clr)};background:color-mix(in srgb, ${esc(clr)} 14%, var(--surface2));border:1px solid color-mix(in srgb, ${esc(clr)} 32%, transparent);">${esc(text)}</span>`;
    }

    function renderSkillTiles(animateFlip) {
      if (!gridEl) return;
      const prevRects = new Map();
      if (animateFlip) {
        gridEl.querySelectorAll('.skill-tile').forEach((tile) => {
          const k = tile.getAttribute('data-k');
          if (k) prevRects.set(k, tile.getBoundingClientRect());
        });
      }

      gridEl.querySelectorAll('.skill-tile').forEach((t) => t.remove());

      const filtered =
        currentCat === 'all' ? skills : skills.filter((s) => s.cat === currentCat);

      const frag = document.createDocumentFragment();
      filtered.forEach((sk, idx) => {
        const catColor = SKILL_CAT_COLORS[sk.cat] || sk.c || '#38bdf8';
        const tabLabel = SKILL_TABS.find((t) => t.key === sk.cat)?.label || sk.cat;
        const tile = document.createElement('div');
        tile.className = 'skill-card skill-tile';
        tile.setAttribute('data-k', sk.name);
        tile.style.setProperty('--i', String(idx));
        tile.style.setProperty('--d', String(Math.min(idx, 30) * 38));
        tile.style.setProperty('--cat', catColor);

        const iconMarkup =
          sk.icon && !brokenIcons.has(sk.id)
            ? `<img src="${esc(sk.icon)}" alt="${esc(sk.name)}" width="40" height="40" class="skill-icon" loading="lazy" decoding="async" data-sk-id="${esc(sk.id)}" />`
            : renderFallbackBadge(sk, catColor);

        tile.innerHTML = `
          <span class="skill-cat" aria-hidden="true" title="${esc(tabLabel)}"></span>
          ${iconMarkup}
          <span class="skill-label">${esc(sk.name)}</span>
        `;

        const imgEl = tile.querySelector('img.skill-icon');
        if (imgEl) {
          imgEl.addEventListener('error', () => {
            brokenIcons.add(sk.id);
            imgEl.outerHTML = renderFallbackBadge(sk, catColor);
          });
        }

        tile.addEventListener('pointermove', (e) => {
          if (e.pointerType !== 'mouse') return;
          const r = tile.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width;
          const ny = (e.clientY - r.top) / r.height;
          tile.style.setProperty('--mx', `${e.clientX - r.left}px`);
          tile.style.setProperty('--my', `${e.clientY - r.top}px`);
          tile.style.setProperty('--rx', `${((0.5 - ny) * 14).toFixed(2)}deg`);
          tile.style.setProperty('--ry', `${((nx - 0.5) * 16).toFixed(2)}deg`);
        });
        tile.addEventListener('pointerleave', () => {
          tile.style.setProperty('--rx', '0deg');
          tile.style.setProperty('--ry', '0deg');
        });

        frag.appendChild(tile);
      });

      gridEl.appendChild(frag);

      if (animateFlip && prevRects.size > 0 && typeof Element.prototype.animate === 'function') {
        gridEl.querySelectorAll('.skill-tile').forEach((tile) => {
          const k = tile.getAttribute('data-k');
          const prev = k ? prevRects.get(k) : null;
          if (!prev) return;
          const next = tile.getBoundingClientRect();
          const dx = prev.left - next.left;
          const dy = prev.top - next.top;
          if (dx || dy) {
            tile.animate([{ translate: `${dx}px ${dy}px` }, { translate: '0 0' }], {
              duration: 480,
              easing: 'cubic-bezier(.2,.8,.2,1)',
            });
          }
        });
      }
    }

    renderSkillTiles(false);

    barEl?.querySelectorAll('[data-skill-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nextCat = btn.getAttribute('data-skill-tab') || 'all';
        if (nextCat === currentCat) return;
        currentCat = nextCat;
        barEl.querySelectorAll('[data-skill-tab]').forEach((b) => {
          b.classList.toggle('active', b.getAttribute('data-skill-tab') === currentCat);
        });
        syncPill();
        renderSkillTiles(true);
      });
    });

    stageEl?.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse' || !gridEl || !spotEl) return;
      const r = gridEl.getBoundingClientRect();
      spotEl.style.transform = `translate3d(${e.clientX - r.left - 170}px, ${e.clientY - r.top - 170}px, 0)`;
      spotEl.style.opacity = '1';
    });
    stageEl?.addEventListener('pointerleave', () => {
      if (spotEl) spotEl.style.opacity = '0';
    });
  }

  /* --------------------------------------------------------------------------
     6. Services Section
  -------------------------------------------------------------------------- */
  function initServices() {
    const sec = document.getElementById('services');
    if (!sec) return;

    sec.innerHTML = `
      <div class="svc-aurora" aria-hidden="true">
        <span class="svc-blob svc-blob--a"></span>
        <span class="svc-blob svc-blob--b"></span>
        <span class="svc-blob svc-blob--c"></span>
      </div>

      <div class="svc-wrap">
        ${renderSectionHeader('What I Offer', 'Services')}

        <p class="svc-lead">
          From the first idea to a live, secure, and scalable product — here is how I help
          organizations engineer full-stack platforms, AI systems, and enterprise infrastructure.
        </p>

        <div data-reveal="root" class="svc-grid">
          ${DATA.services
            .map(
              (svc, idx) => `
              <article
                class="svc-card"
                style="--c: ${esc(svc.c || 'var(--accent)')}; --i: ${idx};"
              >
                <span class="svc-num" aria-hidden="true">${esc(svc.n || pad2(idx + 1))}</span>
                <div class="svc-icon">
                  <span class="svc-icon-pulse" aria-hidden="true"></span>
                  ${Icons.serviceIcon(svc.icon, 28, svc.c, 'svc-icon-svg')}
                </div>
                <h3 class="svc-title">${esc(svc.title)}</h3>
                <p class="svc-desc">${esc(svc.desc)}</p>
                <a href="#contact" class="svc-link">
                  <span>Discuss this service</span>
                  ${Icons.arrowRightIcon(16)}
                </a>
                <span class="svc-bar" aria-hidden="true"></span>
              </article>
            `
            )
            .join('')}
        </div>

        <div class="svc-cta">
          <div class="svc-cta-text">
            <strong>Have a project in mind?</strong>
            <span>
              Tell me what you need — I'll reply with an architecture plan, timeline, and clear
              next step.
            </span>
          </div>
          <a href="#contact" class="svc-cta-btn">
            <span>Let's work together</span>
            ${Icons.arrowRightIcon(16)}
          </a>
        </div>
      </div>
    `;

    sec.querySelectorAll('.svc-card').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        const r = card.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width;
        const ny = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
        card.style.setProperty('--rx', `${((0.5 - ny) * 7).toFixed(2)}deg`);
        card.style.setProperty('--ry', `${((nx - 0.5) * 9).toFixed(2)}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* --------------------------------------------------------------------------
     7. Experience Section, Scroll Spark Rail & Typewriter Website Chips
  -------------------------------------------------------------------------- */
  function renderExpWebsiteChip(url) {
    let host = '';
    try {
      host = new URL(url).hostname.replace(/^www\./, '');
    } catch {
      host = String(url).replace(/^https?:\/\/(www\.)?/, '').split('/')[0] || url;
    }

    return `
      <a
        href="${esc(url)}"
        target="_blank"
        rel="noopener noreferrer"
        class="exp-site"
        data-exp-host="${esc(host)}"
        title="Visit ${esc(host)}"
        aria-label="Visit website: ${esc(host)}"
      >
        <span class="exp-site-ico" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
            <circle cx="12" cy="12" r="9" />
            <ellipse class="exp-globe-m exp-globe-m1" cx="12" cy="12" rx="4.2" ry="9" />
            <ellipse class="exp-globe-m exp-globe-m2" cx="12" cy="12" rx="4.2" ry="9" />
            <path d="M3.4 9h17.2M3.4 15h17.2" />
          </svg>
          <i class="exp-site-live"></i>
        </span>
        <span class="exp-site-label">Website</span>
        <span class="exp-site-host" aria-hidden="true">
          <span class="exp-site-host-text"></span><i class="exp-site-caret"></i>
        </span>
      </a>
    `;
  }

  function renderResponsibilityBullet(raw) {
    const urls = [];
    const urlRe = /(https?:\/\/[^\s,)]+)/g;
    const parts = String(raw).split(urlRe);
    const html = parts
      .map((part) => {
        if (/^https?:\/\//i.test(part)) {
          const cleanUrl = part.replace(/\.$/, '');
          if (!urls.includes(cleanUrl)) urls.push(cleanUrl);
          const cleanHost = cleanUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
          const trailingDot = part.endsWith('.') ? '.' : '';
          return `<a href="${esc(cleanUrl)}" target="_blank" rel="noopener noreferrer" style="color:var(--accent);font-weight:600;text-decoration:underline;text-underline-offset:3px;">${esc(cleanHost)}</a>${trailingDot}`;
        }
        return esc(part);
      })
      .join('');

    const chips =
      urls.length > 0
        ? `<span class="exp-resp-links">${urls.map((u) => renderExpWebsiteChip(u)).join('')}</span>`
        : '';

    return `${html}${chips}`;
  }

  function initExperience() {
    const sec = document.getElementById('experience');
    if (!sec) return;

    sec.innerHTML = `
      <div class="max-w-[1360px] mx-auto">
        ${renderSectionHeader('Career', 'Experience')}

        <div data-reveal="root" class="reveal">
          <div
            id="exp-list-wrap"
            class="exp-list-wrap max-w-[1120px] mx-auto flex flex-col gap-9 relative"
          >
            <span class="exp-rail" aria-hidden="true"></span>
            ${DATA.experience
              .map(
                (exp, idx) => `
                <div
                  data-reveal="root"
                  class="exp-card-container relative"
                  style="--i: ${idx}"
                >
                  <span class="exp-connector" aria-hidden="true"></span>
                  <div
                    style="position:absolute;left:0;top:8px;"
                    class="timeline-dot ${idx === 0 ? 'active' : ''} exp-timeline-dot"
                  ></div>

                  <div class="card edu-card exp-card">
                    <span class="exp-ring" aria-hidden="true"></span>

                    <div class="flex flex-wrap gap-4 justify-between items-start mb-[18px]">
                      <div>
                        <h3 class="exp-title font-bold">${esc(exp.role)}</h3>
                        <div class="flex items-center flex-wrap gap-2.5 mt-1.5">
                          ${
                            exp.url
                              ? `<a href="${esc(exp.url)}" target="_blank" rel="noopener noreferrer" class="exp-company font-syne font-bold inline-block" style="color: var(--accent)">${esc(exp.company)}</a>`
                              : `<span class="exp-company font-syne font-bold inline-block" style="color: var(--accent)">${esc(exp.company)}</span>`
                          }
                          ${exp.url ? renderExpWebsiteChip(exp.url) : ''}
                        </div>
                      </div>

                      <span
                        class="exp-date rounded-full font-bold"
                        style="border:1px solid var(--border);color:var(--text);background:var(--surface2);"
                      >
                        ${esc(exp.date)}
                      </span>
                    </div>

                    ${
                      exp.location
                        ? `<div class="exp-location flex items-center gap-1.5 opacity-75 mb-6" style="color: var(--text)">
                            ${Icons.mapPinIcon(16)} ${esc(exp.location)}
                          </div>`
                        : ''
                    }

                    <ul class="exp-list list-none flex flex-col">
                      ${exp.desc
                        .map(
                          (bullet, bi) => `
                          <li
                            class="exp-li flex gap-3 items-start font-medium leading-[1.65] tracking-[0.01em] opacity-90"
                            style="color: var(--text); --k: ${bi};"
                          >
                            <span class="exp-bullet" aria-hidden="true">
                              <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round">
                                <path d="m9 6 6 6-6 6" />
                              </svg>
                            </span>
                            <span class="flex-1">${renderResponsibilityBullet(bullet)}</span>
                          </li>
                        `
                        )
                        .join('')}
                    </ul>

                    ${
                      exp.tech && exp.tech.length > 0
                        ? `
                        <div class="exp-stack">
                          <div class="exp-stack-title"><span>Tech stack</span></div>
                          <div class="exp-stack-list">
                            ${exp.tech
                              .map(
                                (tech, ti) => `
                                <span
                                  class="exp-chip"
                                  style="--t: ${ti}; --h: ${hashTechHue(tech)};"
                                >
                                  <i aria-hidden="true"></i>
                                  ${esc(tech)}
                                </span>
                              `
                              )
                              .join('')}
                          </div>
                        </div>
                      `
                        : ''
                    }
                  </div>
                </div>
              `
              )
              .join('')}
          </div>
        </div>
      </div>
    `;

    // 3D pointer tilt on experience cards
    sec.querySelectorAll('.exp-card').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
        card.style.setProperty('--rx', `${((0.5 - (e.clientY - r.top) / r.height) * 2.4).toFixed(2)}deg`);
        card.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width - 0.5) * 3).toFixed(2)}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });

    // Typewriter hostname tooltips on .exp-site chips
    sec.querySelectorAll('.exp-site[data-exp-host]').forEach((chip) => {
      const host = chip.getAttribute('data-exp-host') || '';
      const textEl = chip.querySelector('.exp-site-host-text');
      if (!textEl) return;
      let timer = 0;

      const startTyping = () => {
        window.clearInterval(timer);
        if (prefersReduced()) {
          textEl.textContent = host;
          return;
        }
        let idx = 0;
        textEl.textContent = '';
        timer = window.setInterval(() => {
          idx += 1;
          textEl.textContent = host.slice(0, idx);
          if (idx >= host.length) window.clearInterval(timer);
        }, 36);
      };

      const stopTyping = () => {
        window.clearInterval(timer);
        textEl.textContent = '';
      };

      chip.addEventListener('mouseenter', startTyping);
      chip.addEventListener('mouseleave', stopTyping);
      chip.addEventListener('focus', startTyping);
      chip.addEventListener('blur', stopTyping);
    });

    // Scroll-driven Experience Rail & Spark
    const listWrap = document.getElementById('exp-list-wrap');
    if (listWrap) {
      const reduced = prefersReduced();
      let raf = 0;
      const updateRail = () => {
        raf = 0;
        const r = listWrap.getBoundingClientRect();
        const triggerY = window.innerHeight * 0.62;
        const fill = reduced
          ? r.height
          : Math.min(Math.max(triggerY - r.top - 19, 0), Math.max(r.height - 19, 0));
        listWrap.style.setProperty('--fill', `${fill}px`);
        listWrap.querySelectorAll('.exp-card-container').forEach((cardEl) => {
          const dot = cardEl.querySelector('.exp-timeline-dot');
          if (!dot) return;
          const dr = dot.getBoundingClientRect();
          cardEl.classList.toggle('reached', reduced || dr.top + dr.height / 2 < triggerY);
        });
      };

      const schedule = () => {
        if (!raf) raf = requestAnimationFrame(updateRail);
      };

      updateRail();
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule);
      if (typeof ResizeObserver !== 'undefined') {
        new ResizeObserver(schedule).observe(listWrap);
      }
    }
  }

  /* --------------------------------------------------------------------------
     8. Projects Section & Circular Clip-Path Reveal Modal (pmReveal/pmUnreveal)
  -------------------------------------------------------------------------- */
  const PROJECT_TABS = [
    { key: 'all', label: 'All' },
    { key: 'ai', label: 'AI & Agents' },
    { key: 'fullstack', label: 'Full-Stack & CRM' },
    { key: 'wordpress', label: 'WordPress' },
    { key: 'security', label: 'Cybersecurity' },
    { key: 'desktop', label: 'Desktop & Core' },
    { key: 'tools', label: 'Tools & SEO' },
  ];

  const PROJECT_CAT_LABELS = {
    ai: 'AI & Autonomous Agents',
    fullstack: 'Full-Stack & Enterprise Web',
    wordpress: 'WordPress Ecosystem',
    security: 'Cybersecurity & Forensics',
    desktop: 'Desktop & Core Systems',
    tools: 'Web Tools & Analytics',
  };

  function initProjects() {
    const sec = document.getElementById('projects');
    const modalRoot = document.getElementById('project-modal-root');
    if (!sec || !modalRoot) return;

    const projects = DATA.projects;
    let currentCat = 'all';
    let selectedProj = null;
    let isClosing = false;
    let closeTimer = 0;
    let modalOrigin = { x: '50%', y: '50%' };
    let slideDir = 'none';

    const countFor = (k) =>
      k === 'all' ? projects.length : projects.filter((p) => p.cat === k).length;

    const getFiltered = () =>
      currentCat === 'all' ? projects : projects.filter((p) => p.cat === currentCat);

    const getModalPool = () => {
      const f = getFiltered();
      return selectedProj && f.some((p) => p.id === selectedProj.id) ? f : projects;
    };

    sec.innerHTML = `
      <div class="max-w-[1360px] mx-auto">
        ${renderSectionHeader('Portfolio', 'Projects')}

        <div
          data-reveal="root"
          class="reveal project-filter-wrap flex justify-center mb-9"
        >
          <div id="projects-pf-bar" class="pf-bar">
            ${PROJECT_TABS.map(
              (t) => `
                <button
                  type="button"
                  data-proj-tab="${esc(t.key)}"
                  class="filter-tab${t.key === currentCat ? ' active' : ''}"
                >
                  ${esc(t.label)}
                  <span class="pf-count">${countFor(t.key)}</span>
                </button>
              `
            ).join('')}
          </div>
        </div>

        <div
          id="projects-grid-el"
          data-reveal="root"
          class="reveal project-grid grid gap-7 items-stretch"
          style="grid-template-columns: repeat(auto-fill, minmax(min(100%, 360px), 1fr));"
        ></div>
      </div>
    `;

    const barEl = document.getElementById('projects-pf-bar');
    const gridEl = document.getElementById('projects-grid-el');
    const syncPill = setupFilterPill(barEl);

    function renderModalContentBody(proj, dir) {
      return `
        <div class="pm-content pm-dir-${esc(dir)}">
          <div
            class="pm-banner"
            style="${
              proj.img
                ? ''
                : `background: linear-gradient(135deg, ${esc(proj.c)}33, ${esc(proj.c)}12, var(--surface2));`
            }"
          >
            ${
              proj.img
                ? `<img class="pm-banner-img" src="${esc(proj.img)}" alt="${esc(proj.title)}" />`
                : `<div class="pm-banner-icon">
                    <div
                      class="flex items-center justify-center rounded-[26px]"
                      style="width:96px;height:96px;background:color-mix(in srgb, var(--surface) 92%, transparent);border:1.5px solid ${esc(proj.c)}55;box-shadow:0 18px 40px -12px ${esc(proj.c)}66;"
                    >
                      ${Icons.projectIllustration(proj.iconKey, proj.c, 52)}
                    </div>
                  </div>`
            }
            <div class="pm-banner-fade"></div>
            <span class="pm-banner-cat">${esc(PROJECT_CAT_LABELS[proj.cat] || proj.cat)}</span>
          </div>

          <div class="pm-head relative" style="padding: 8px 28px 28px">
            <h2
              class="text-[1.75rem] font-bold mb-3.5 leading-[1.25] tracking-[0.02em]"
              style="color: var(--text)"
            >
              ${esc(proj.title)}
            </h2>

            <div class="pm-meta">
              <span>Stack: <b>${proj.tech.length} technologies</b></span>
              ${
                proj.live
                  ? `<span class="pm-meta-live"><i aria-hidden="true"></i> Live Production</span>`
                  : ''
              }
            </div>

            <p
              class="leading-[1.8] mb-[22px] text-[0.96rem] opacity-90"
              style="color: var(--text)"
            >
              ${esc(proj.desc)}
            </p>

            ${
              proj.highlights && proj.highlights.length > 0
                ? `
                <div class="mb-6">
                  <div
                    class="text-[0.76rem] font-bold uppercase tracking-[0.12em] mb-3"
                    style="color: var(--accent)"
                  >
                    Key Features &amp; Engineering Highlights
                  </div>
                  <ul class="list-none p-0 m-0 flex flex-col gap-2.5">
                    ${proj.highlights
                      .map(
                        (hl) => `
                        <li
                          class="relative pl-[18px] text-[0.9rem] leading-[1.65] opacity-90"
                          style="color: var(--text)"
                        >
                          <span
                            aria-hidden="true"
                            style="position:absolute;left:2px;top:.58em;width:6px;height:6px;border-radius:50%;background:${esc(proj.c)};"
                          ></span>
                          ${esc(hl)}
                        </li>
                      `
                      )
                      .join('')}
                  </ul>
                </div>
              `
                : ''
            }

            <div class="flex flex-wrap gap-[7px] mb-[26px]">
              ${proj.tech.map((t) => `<span class="tech-badge">${esc(t)}</span>`).join('')}
            </div>

            <div class="flex gap-3 flex-wrap">
              ${
                proj.live
                  ? `<a href="${esc(proj.live)}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="background:#10b981;border-color:#10b981;">
                      ${Icons.externalLinkIcon(15)} Visit Live Platform
                    </a>`
                  : ''
              }
              ${
                proj.github
                  ? `<a href="${esc(proj.github)}" target="_blank" rel="noopener noreferrer" class="btn-outline">
                      ${Icons.socialIcon('github', 16)} Source Code
                    </a>`
                  : ''
              }
              ${(proj.extraLinks || [])
                .map(
                  (xl) => `
                  <a href="${esc(xl.url)}" target="_blank" rel="noopener noreferrer" class="btn-primary proj-download">
                    ${Icons.externalLinkIcon(14)} ${esc(xl.label)}
                  </a>
                `
                )
                .join('')}
            </div>
          </div>
        </div>
      `;
    }

    function openProjectModal(proj, e) {
      window.clearTimeout(closeTimer);
      isClosing = false;
      slideDir = 'none';
      selectedProj = proj;
      if (e && (e.clientX || e.clientY)) {
        modalOrigin = { x: `${e.clientX}px`, y: `${e.clientY}px` };
      } else {
        modalOrigin = { x: '50%', y: '50%' };
      }
      document.body.style.overflow = 'hidden';

      const pool = getModalPool();
      const selIdx = pool.findIndex((p) => p.id === proj.id);

      modalRoot.innerHTML = `
        <div
          id="pm-backdrop"
          class="modal-bg"
          style="--ox: ${modalOrigin.x}; --oy: ${modalOrigin.y};"
        >
          <div
            id="pm-panel-el"
            role="dialog"
            aria-modal="true"
            aria-label="${esc(proj.title)}"
            class="card hide-scrollbar pm-panel flex flex-col rounded-3xl overflow-y-auto"
            style="max-width:920px;width:96%;max-height:92vh;overscroll-behavior:contain;"
          >
            <div class="pm-progress" aria-hidden="true">
              <span id="pm-progress-bar"></span>
            </div>

            <div class="pm-toolbar">
              <div class="pm-toolbar-in">
                <span id="pm-counter-el" class="pm-counter">
                  ${pad2(selIdx + 1)} <i>/</i> ${pad2(pool.length)}
                </span>

                <div class="pm-toolbar-btns">
                  ${
                    pool.length > 1
                      ? `
                      <button type="button" id="pm-prev-btn" class="pm-iconbtn" aria-label="Previous project" title="Previous project (←)">
                        ${Icons.chevronLeftIcon(18)}
                      </button>
                      <button type="button" id="pm-next-btn" class="pm-iconbtn" aria-label="Next project" title="Next project (→)">
                        ${Icons.chevronRightIcon(18)}
                      </button>
                    `
                      : ''
                  }
                  <button type="button" id="pm-close-btn" class="pm-iconbtn pm-close" aria-label="Close project details" title="Close (Esc)">
                    ${Icons.closeIcon(18)}
                  </button>
                </div>
              </div>
            </div>

            <div id="pm-body-slot">
              ${renderModalContentBody(proj, slideDir)}
            </div>
          </div>
        </div>
      `;

      const backdrop = document.getElementById('pm-backdrop');
      const panel = document.getElementById('pm-panel-el');
      const progressBar = document.getElementById('pm-progress-bar');

      backdrop?.addEventListener('click', () => closeProjectModal());
      panel?.addEventListener('click', (ev) => ev.stopPropagation());
      backdrop?.addEventListener(
        'wheel',
        (ev) => {
          if (ev.target === backdrop) {
            panel?.scrollBy({ top: ev.deltaY, behavior: 'auto' });
          }
        },
        { passive: true }
      );
      panel?.addEventListener('scroll', () => {
        if (!panel || !progressBar) return;
        const max = panel.scrollHeight - panel.clientHeight;
        progressBar.style.transform = `scaleX(${max > 0 ? Math.min(1, panel.scrollTop / max) : 0})`;
      });

      document.getElementById('pm-prev-btn')?.addEventListener('click', () => stepProject(-1));
      document.getElementById('pm-next-btn')?.addEventListener('click', () => stepProject(1));
      document.getElementById('pm-close-btn')?.addEventListener('click', () => closeProjectModal());
    }

    function stepProject(delta) {
      if (!selectedProj || isClosing) return;
      const pool = getModalPool();
      if (pool.length < 2) return;
      const curIdx = pool.findIndex((p) => p.id === selectedProj.id);
      if (curIdx === -1) return;
      const nextIdx = (curIdx + delta + pool.length) % pool.length;
      selectedProj = pool[nextIdx];
      slideDir = delta === 1 ? 'next' : 'prev';

      const counterEl = document.getElementById('pm-counter-el');
      const bodySlot = document.getElementById('pm-body-slot');
      const panel = document.getElementById('pm-panel-el');
      const progressBar = document.getElementById('pm-progress-bar');

      if (counterEl) {
        counterEl.innerHTML = `${pad2(nextIdx + 1)} <i>/</i> ${pad2(pool.length)}`;
      }
      if (bodySlot) {
        bodySlot.innerHTML = renderModalContentBody(selectedProj, slideDir);
      }
      if (panel) {
        panel.setAttribute('aria-label', selectedProj.title);
        panel.scrollTo({ top: 0 });
      }
      if (progressBar) {
        progressBar.style.transform = 'scaleX(0)';
      }
    }

    function closeProjectModal() {
      if (!selectedProj || isClosing) return;
      isClosing = true;
      document.getElementById('pm-backdrop')?.classList.add('closing');
      document.getElementById('pm-panel-el')?.classList.add('closing');
      closeTimer = window.setTimeout(() => {
        selectedProj = null;
        isClosing = false;
        modalRoot.innerHTML = '';
        document.body.style.overflow = '';
      }, 460);
    }

    window.addEventListener('keydown', (e) => {
      if (!selectedProj) return;
      if (e.key === 'Escape') closeProjectModal();
      else if (e.key === 'ArrowRight') stepProject(1);
      else if (e.key === 'ArrowLeft') stepProject(-1);
    });

    function renderProjectGrid() {
      if (!gridEl) return;
      const filtered = getFiltered();

      gridEl.innerHTML = filtered
        .map((proj, idx) => {
          const compactBadge = proj.tech.length > 4;
          const badgeStyle = compactBadge ? 'padding:4px 9px;font-size:.69rem;' : '';
          return `
            <div
              class="project-card flex flex-col"
              data-proj-id="${esc(proj.id)}"
              style="--i: ${idx}"
            >
              <div
                class="proj-media flex items-center justify-center overflow-hidden relative cursor-pointer"
                data-open-proj="${esc(proj.id)}"
                style="height:215px;background:linear-gradient(135deg, ${esc(proj.c)}26 0%, ${esc(proj.c)}0d 55%, var(--surface2) 100%);color:#1e293b;"
              >
                ${
                  proj.img
                    ? `<img class="proj-img w-full h-full object-cover" src="${esc(proj.img)}" alt="${esc(proj.title)}" width="400" height="215" loading="lazy" />`
                    : `
                      <div aria-hidden="true" style="position:absolute;inset:0;background-image:radial-gradient(${esc(proj.c)}33 1px, transparent 1px);background-size:18px 18px;opacity:0.55;"></div>
                      <div
                        class="flex items-center justify-center relative z-[1] rounded-3xl"
                        style="width:88px;height:88px;background:color-mix(in srgb, var(--surface) 90%, transparent);border:1.5px solid ${esc(proj.c)}4d;box-shadow:0 16px 38px -10px ${esc(proj.c)}59;"
                      >
                        ${Icons.projectIllustration(proj.iconKey, proj.c, 46)}
                      </div>
                    `
                }
                <span class="proj-cat">${esc(PROJECT_CAT_LABELS[proj.cat] || proj.cat)}</span>
                <span class="proj-overlay" aria-hidden="true">
                  <span class="proj-peek">${Icons.eyePeekIcon()} View details</span>
                </span>
              </div>

              <div class="flex flex-col flex-1" style="padding: 24px 26px">
                <h3
                  class="proj-title font-syne font-bold text-[1.16rem] mb-2.5 leading-[1.35] tracking-[0.01em]"
                >
                  <span>${esc(proj.title)}</span>
                </h3>

                <p
                  class="text-[0.86rem] leading-[1.65] mb-4 overflow-hidden"
                  style="color:var(--muted);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;"
                >
                  ${esc(proj.desc)}
                </p>

                <div class="flex flex-wrap gap-1.5 mb-[18px]">
                  ${proj.tech
                    .slice(0, 6)
                    .map(
                      (t, bi) =>
                        `<span class="tech-badge" style="--b:${bi};${badgeStyle}">${esc(t)}</span>`
                    )
                    .join('')}
                  ${
                    proj.tech.length > 6
                      ? `<span class="tech-badge" style="--b:6;padding:4px 9px;font-size:.69rem;">+${proj.tech.length - 6}</span>`
                      : ''
                  }
                </div>

                <div class="proj-actions flex flex-col gap-[9px] mt-auto w-full">
                  <div class="flex flex-wrap gap-[9px] w-full">
                    ${
                      proj.github
                        ? `<a
                            href="${esc(proj.github)}"
                            target="_blank"
                            rel="noreferrer"
                            class="btn-outline proj-gh rip-btn relative justify-center flex-1 text-[0.84rem]"
                            style="padding:8px 14px;"
                          >
                            ${Icons.socialIcon('github', 15)} GitHub
                            <span class="rip" aria-hidden="true"></span>
                          </a>`
                        : ''
                    }

                    <button
                      type="button"
                      data-open-proj="${esc(proj.id)}"
                      class="btn-primary proj-details rip-btn relative justify-center flex-1 text-[0.84rem]"
                      style="padding:8px 14px;"
                    >
                      ${Icons.infoDocIcon()} Details
                      <span class="rip" aria-hidden="true"></span>
                    </button>

                    ${
                      proj.live
                        ? `<a
                            href="${esc(proj.live)}"
                            target="_blank"
                            rel="noreferrer"
                            class="btn-primary proj-live rip-btn relative justify-center flex-1 text-[0.84rem]"
                            style="padding:8px 14px;background:#10b981;border-color:#10b981;"
                          >
                            ${Icons.externalLinkIcon(15)} Live
                            <span class="rip" aria-hidden="true"></span>
                          </a>`
                        : ''
                    }
                  </div>
                </div>
              </div>
            </div>
          `;
        })
        .join('');

      gridEl.querySelectorAll('.project-card').forEach((card) => {
        card.addEventListener('pointermove', (e) => {
          if (e.pointerType !== 'mouse') return;
          const r = card.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width;
          const ny = (e.clientY - r.top) / r.height;
          card.style.setProperty('--mx', `${e.clientX - r.left}px`);
          card.style.setProperty('--my', `${e.clientY - r.top}px`);
          card.style.setProperty('--rx', `${((0.5 - ny) * 6).toFixed(2)}deg`);
          card.style.setProperty('--ry', `${((nx - 0.5) * 8).toFixed(2)}deg`);
        });
        card.addEventListener('pointerleave', () => {
          card.style.setProperty('--rx', '0deg');
          card.style.setProperty('--ry', '0deg');
        });
      });

      gridEl.querySelectorAll('.rip-btn').forEach((btn) => {
        btn.addEventListener('pointerdown', triggerButtonRipple);
      });

      gridEl.querySelectorAll('[data-open-proj]').forEach((trigger) => {
        trigger.addEventListener('click', (e) => {
          const id = trigger.getAttribute('data-open-proj');
          const proj = projects.find((p) => p.id === id);
          if (proj) openProjectModal(proj, e);
        });
      });
    }

    renderProjectGrid();

    barEl?.querySelectorAll('[data-proj-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nextCat = btn.getAttribute('data-proj-tab') || 'all';
        if (nextCat === currentCat) return;
        currentCat = nextCat;
        barEl.querySelectorAll('[data-proj-tab]').forEach((b) => {
          b.classList.toggle('active', b.getAttribute('data-proj-tab') === currentCat);
        });
        syncPill();
        renderProjectGrid();
      });
    });
  }

  /* --------------------------------------------------------------------------
     9. Live Web Tools Section, 3D DNA Helix Canvas & Sandbox Preview Modal
  -------------------------------------------------------------------------- */
  const TOOL_TABS = [
    { key: 'all', label: 'All Tools' },
    { key: 'calculators', label: 'Scientific & Math' },
    { key: 'ai_media', label: 'AI & Media Suite' },
    { key: 'finance_utility', label: 'Finance & Utility' },
  ];

  function initToolsSection() {
    const sec = document.getElementById('tools');
    const toolModalRoot = document.getElementById('tool-modal-root');
    if (!sec || !toolModalRoot) return;

    const tools = DATA.tools;
    let currentCat = 'all';
    let previewTool = null;

    const countFor = (k) =>
      k === 'all' ? tools.length : tools.filter((t) => t.category === k).length;

    sec.innerHTML = `
      <div
        id="tools-helix-host"
        aria-hidden="true"
        style="position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:0;opacity:0.55;"
      ></div>

      <div class="max-w-[1360px] mx-auto relative z-[1]">
        ${renderSectionHeader(
          'Interactive Suite',
          'Live Web Tools',
          '11 standalone client-side utilities engineered by Mehedi Hasan Shihab — run them live right inside your browser'
        )}

        <div data-reveal="root" class="reveal flex justify-center mb-10">
          <div id="tools-pf-bar" class="pf-bar">
            ${TOOL_TABS.map(
              (t) => `
                <button
                  type="button"
                  data-tool-tab="${esc(t.key)}"
                  class="filter-tab${t.key === currentCat ? ' active' : ''}"
                >
                  ${esc(t.label)}
                  <span class="pf-count">${countFor(t.key)}</span>
                </button>
              `
            ).join('')}
          </div>
        </div>

        <div id="tools-grid-el" data-reveal="root" class="pub-grid reveal"></div>
      </div>
    `;

    const helixHost = document.getElementById('tools-helix-host');
    const barEl = document.getElementById('tools-pf-bar');
    const gridEl = document.getElementById('tools-grid-el');
    const syncPill = setupFilterPill(barEl);

    // Persistent 3D DNA Double-Helix Scene across all 9 non-sketch modes
    if (helixHost && hasWebGL()) {
      let helixSketchState = null;
      let cancelHelixIdle = null;
      let disposeHelix = null;

      const syncHelix = (mode) => {
        const isSketch = mode === 'sketch';
        if (helixSketchState === isSketch) return;
        helixSketchState = isSketch;

        if (cancelHelixIdle) {
          cancelHelixIdle();
          cancelHelixIdle = null;
        }
        if (disposeHelix) {
          disposeHelix();
          disposeHelix = null;
        }

        if (isSketch) {
          helixHost.style.display = 'none';
          helixHost.innerHTML = '';
          return;
        }

        helixHost.style.display = 'block';
        cancelHelixIdle = onIdle(() => {
          if (!helixHost.isConnected || getAnimationMode() === 'sketch') return;
          try {
            disposeHelix = createPublicationScene(helixHost);
          } catch (err) {
            console.warn('[ToolsHelixCanvas] disabled:', err);
          }
        }, 600);
      };

      syncHelix(getAnimationMode());
      subscribeAnimationMode((nextMode) => syncHelix(nextMode));
    }

    function openToolPreview(tool) {
      previewTool = tool;
      document.body.style.overflow = 'hidden';

      toolModalRoot.innerHTML = `
        <div id="tool-modal-backdrop" class="modal-bg">
          <div
            id="tool-modal-panel"
            class="card pm-panel flex flex-col overflow-hidden"
            style="width:96%;max-width:1020px;height:88vh;border-radius:22px;"
          >
            <div
              class="flex items-center justify-between gap-3 py-3.5 px-5 border-b"
              style="border-color:var(--border);background:var(--surface);"
            >
              <div class="flex items-center gap-2.5">
                <span class="w-2.5 h-2.5 rounded-full" style="background:${esc(tool.accent)}"></span>
                <span class="syne font-bold text-[0.98rem]">${esc(tool.title)}</span>
              </div>

              <div class="flex items-center gap-2.5">
                <a
                  href="${esc(tool.url)}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn-primary text-[0.78rem]"
                  style="padding:7px 14px;"
                >
                  ${Icons.externalLinkIcon(13)} Open Full Tab
                </a>
                <button
                  type="button"
                  id="tool-modal-close"
                  aria-label="Close tool preview"
                  class="pm-iconbtn pm-close"
                >
                  ${Icons.closeIcon(16)}
                </button>
              </div>
            </div>

            <iframe
              src="${esc(tool.url)}"
              title="${esc(tool.title)}"
              class="flex-1 w-full border-0 bg-white"
            ></iframe>
          </div>
        </div>
      `;

      document.getElementById('tool-modal-backdrop')?.addEventListener('click', closeToolPreview);
      document
        .getElementById('tool-modal-panel')
        ?.addEventListener('click', (e) => e.stopPropagation());
      document.getElementById('tool-modal-close')?.addEventListener('click', closeToolPreview);
    }

    function closeToolPreview() {
      if (!previewTool) return;
      previewTool = null;
      toolModalRoot.innerHTML = '';
      document.body.style.overflow = '';
    }

    window.addEventListener('keydown', (e) => {
      if (previewTool && e.key === 'Escape') closeToolPreview();
    });

    function renderToolCards() {
      if (!gridEl) return;
      const filtered =
        currentCat === 'all' ? tools : tools.filter((t) => t.category === currentCat);

      gridEl.innerHTML = filtered
        .map(
          (tool, idx) => `
          <article
            class="card edu-card pub-card flex flex-col"
            style="padding:28px 30px 24px;color:inherit;--i:${idx};"
          >
            <div class="flex items-center justify-between gap-2.5 mb-4">
              <div
                class="pub-icon flex items-center justify-center shrink-0 font-syne font-extrabold text-[0.86rem]"
                style="width:42px;height:42px;border-radius:12px;background:color-mix(in srgb, ${esc(tool.accent)} 18%, var(--surface2));border:1px solid color-mix(in srgb, ${esc(tool.accent)} 38%, transparent);color:${esc(tool.accent)};"
              >
                ${pad2(idx + 1)}
              </div>
              <span class="pub-read-badge">${esc(tool.categoryLabel)}</span>
            </div>

            <h3
              class="font-syne font-bold text-[1.1rem] mb-1.5 leading-[1.4]"
              style="color: var(--text)"
            >
              ${esc(tool.title)}
            </h3>

            <div class="text-[0.82rem] font-semibold mb-2.5" style="color: ${esc(tool.accent)}">
              ${esc(tool.subtitle)}
            </div>

            <p
              class="text-[0.85rem] leading-[1.65] mb-3.5 overflow-hidden"
              style="color:var(--muted);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;"
            >
              ${esc(tool.desc)}
            </p>

            <div class="flex flex-wrap gap-1.5 mb-4">
              ${tool.tags
                .map(
                  (tg) =>
                    `<span class="tech-badge" style="padding:3px 9px;font-size:.68rem;">${esc(tg)}</span>`
                )
                .join('')}
            </div>

            <div
              class="mt-auto pt-3.5 flex items-center justify-between gap-2.5 flex-wrap"
              style="border-top: 1px solid var(--border)"
            >
              <button
                type="button"
                data-preview-tool="${esc(tool.id)}"
                class="btn-outline cursor-pointer text-[0.78rem]"
                style="padding:7px 14px;"
              >
                Quick Preview
              </button>

              <a
                href="${esc(tool.url)}"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-primary text-[0.78rem]"
                style="padding:7px 15px;"
              >
                <span>Launch Live Tool</span>
                ${Icons.externalLinkIcon(13)}
              </a>
            </div>
          </article>
        `
        )
        .join('');

      gridEl.querySelectorAll('.pub-card').forEach((card) => {
        card.addEventListener('pointermove', (e) => {
          const r = card.getBoundingClientRect();
          card.style.setProperty('--mx', `${e.clientX - r.left}px`);
          card.style.setProperty('--my', `${e.clientY - r.top}px`);
        });
      });

      gridEl.querySelectorAll('[data-preview-tool]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-preview-tool');
          const tool = tools.find((t) => t.id === id);
          if (tool) openToolPreview(tool);
        });
      });
    }

    renderToolCards();

    barEl?.querySelectorAll('[data-tool-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nextCat = btn.getAttribute('data-tool-tab') || 'all';
        if (nextCat === currentCat) return;
        currentCat = nextCat;
        barEl.querySelectorAll('[data-tool-tab]').forEach((b) => {
          b.classList.toggle('active', b.getAttribute('data-tool-tab') === currentCat);
        });
        syncPill();
        renderToolCards();
      });
    });
  }

  /* --------------------------------------------------------------------------
     10. Certifications Section
  -------------------------------------------------------------------------- */
  function initCertifications() {
    const sec = document.getElementById('certifications');
    if (!sec) return;

    sec.innerHTML = `
      <div class="max-w-[1360px] mx-auto">
        ${renderSectionHeader(
          'Achievements',
          'Certifications',
          '5 officially verified Google for Education & Generative AI credentials authenticated via Accredible Wallet'
        )}

        <div
          data-reveal="root"
          class="reveal card mb-7 py-[18px] px-6 flex flex-wrap items-center justify-between gap-4"
          style="background:linear-gradient(135deg, color-mix(in srgb, var(--accent) 10%, var(--surface)), color-mix(in srgb, var(--accent2) 8%, var(--surface)));border-color:color-mix(in srgb, var(--accent) 32%, var(--border));"
        >
          <div class="flex items-center gap-3.5">
            <div
              class="syne font-extrabold text-[0.95rem] text-white flex items-center justify-center shrink-0"
              style="width:46px;height:46px;border-radius:14px;background:linear-gradient(135deg, var(--accent), var(--accent2));"
            >
              MH
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="syne font-bold text-base" style="color: var(--text)">
                  Mehedi Hasan Shihab — Google for Education Verified Profile
                </span>
                <span
                  class="text-[0.7rem] font-bold py-0.5 px-[9px] rounded-full"
                  style="background:rgba(16,185,129,.14);color:#10b981;border:1px solid rgba(16,185,129,.3);"
                >
                  ✓ 5 VERIFIED CREDENTIALS
                </span>
              </div>
              <div class="text-[0.84rem] mt-0.5" style="color: var(--muted)">
                Inspect official digital badges and issuer verification directly on Google Accredible.
              </div>
            </div>
          </div>

          <a
            href="${esc(DATA.contact.walletUrl)}"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-primary text-[0.84rem]"
            style="padding:10px 20px;"
          >
            ${Icons.externalLinkIcon(14)} View Accredible Wallet
          </a>
        </div>

        <div data-reveal="root" class="cert-grid">
          ${DATA.certifications
            .map(
              (cert, idx) => `
              <a
                title="View Certificate"
                href="${esc(cert.verifyUrl)}"
                target="_blank"
                rel="noopener noreferrer"
                class="cert-card cert-card--link"
                style="--i: ${idx}"
              >
                <span class="cert-ring" aria-hidden="true"></span>
                <span class="cert-seal" aria-hidden="true">${Icons.certSealSvg()}</span>

                <div class="cert-icon" style="color: ${esc(cert.c)}">
                  <span class="cert-icon-pulse" aria-hidden="true"></span>
                  <div class="w-9 h-9 flex items-center justify-center">
                    ${Icons.certBrandIcon(cert.iconType)}
                  </div>
                </div>

                <h3 class="cert-title">${esc(cert.title)}</h3>

                <div class="cert-meta">
                  <span class="cert-org">${esc(cert.org)}</span>
                  <span class="cert-dot" aria-hidden="true"></span>
                  <span class="cert-date">${esc(cert.date)}</span>
                </div>

                <p
                  class="text-[0.84rem] leading-[1.62] mt-0.5 mb-1.5 relative z-[1]"
                  style="color: var(--muted)"
                >
                  ${esc(cert.desc)}
                </p>

                <div class="flex flex-wrap gap-1.5 mb-1 relative z-[1]">
                  ${cert.tags
                    .map(
                      (tg) => `
                      <span
                        class="text-[0.68rem] font-bold tracking-[0.04em] py-[3px] px-[9px] rounded-full"
                        style="background:color-mix(in srgb, ${esc(cert.c)} 12%, var(--surface2));color:${esc(cert.c)};border:1px solid color-mix(in srgb, ${esc(cert.c)} 28%, transparent);"
                      >${esc(tg)}</span>
                    `
                    )
                    .join('')}
                </div>

                <span class="cert-link">
                  View certificate ${Icons.certArrowUpRight()}
                </span>

                <span class="cert-bar" aria-hidden="true"></span>
              </a>
            `
            )
            .join('')}
        </div>
      </div>
    `;

    sec.querySelectorAll('.cert-card').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        const rect = card.getBoundingClientRect();
        const rxRatio = (e.clientX - rect.left) / rect.width;
        const ryRatio = (e.clientY - rect.top) / rect.height;
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--my', `${e.clientY - rect.top}px`);
        card.style.setProperty('--rx', `${((0.5 - ryRatio) * 8).toFixed(2)}deg`);
        card.style.setProperty('--ry', `${((rxRatio - 0.5) * 10).toFixed(2)}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* --------------------------------------------------------------------------
     11. Contact Section, Live Validation, Confetti Burst & Academic References
  -------------------------------------------------------------------------- */
  const CONFETTI_COLORS = ['#38bdf8', '#3b82f6', '#a78bfa', '#2dd4bf', '#fbbf24', '#f472b6'];

  function pseudoRand(seed) {
    const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
    return x - Math.floor(x);
  }

  function initContact() {
    const sec = document.getElementById('contact');
    if (!sec) return;
    const { contact } = DATA;

    const cards = [
      {
        key: 'ct-email',
        label: 'Email',
        value: contact.email,
        href: `mailto:${contact.email}`,
        clr: 'var(--mail-color)',
        bg: 'color-mix(in srgb, var(--mail-color) 14%, var(--surface2))',
        ic: 'var(--mail-color)',
        icon: Icons.socialIcon('email', 20),
      },
      {
        key: 'ct-phone',
        label: 'Phone',
        value: contact.phone,
        href: `tel:${contact.phone.replace(/[^+\d]/g, '')}`,
        clr: 'var(--phone-color)',
        bg: 'color-mix(in srgb, var(--phone-color) 14%, var(--surface2))',
        ic: 'var(--phone-color)',
        icon: Icons.socialIcon('phone', 20),
      },
      {
        key: 'ct-wa',
        label: 'WhatsApp',
        value: contact.whatsapp,
        href: `https://wa.me/${contact.whatsapp.replace(/[^\d]/g, '')}`,
        clr: 'var(--wa-color)',
        bg: 'color-mix(in srgb, var(--wa-color) 14%, var(--surface2))',
        ic: 'var(--wa-color)',
        icon: Icons.socialIcon('whatsapp', 20),
      },
      {
        key: 'ct-loc',
        label: 'Location',
        value: contact.location,
        href: null,
        clr: 'var(--pin-color)',
        bg: 'color-mix(in srgb, var(--pin-color) 14%, var(--surface2))',
        ic: 'var(--pin-color)',
        icon: Icons.mapPinIcon(20),
      },
      {
        key: 'ct-li',
        label: 'LinkedIn',
        value: 'linkedin.com/in/mehedi-hasan-shihab',
        href: contact.linkedinUrl,
        clr: '#0A66C2',
        bg: 'color-mix(in srgb, #0A66C2 14%, var(--surface2))',
        ic: '#0A66C2',
        icon: Icons.socialIcon('linkedin', 20),
      },
      {
        key: 'ct-gh',
        label: 'GitHub',
        value: 'github.com/sshihabb007',
        href: contact.githubUrl,
        clr: '#8b5cf6',
        bg: 'color-mix(in srgb, #8b5cf6 14%, var(--surface2))',
        ic: '#8b5cf6',
        icon: Icons.socialIcon('github', 20),
      },
    ];

    sec.innerHTML = `
      <div class="svc-aurora" aria-hidden="true">
        <span class="svc-blob svc-blob--a"></span>
        <span class="svc-blob svc-blob--b"></span>
        <span class="svc-blob svc-blob--c"></span>
      </div>

      <div class="svc-wrap max-w-[1180px] mx-auto">
        ${renderSectionHeader(
          'Get In Touch',
          'Contact Me',
          "Have a full-stack platform, AI solution, or security project in mind? Let's collaborate."
        )}

        <div
          class="contact-grid grid gap-9 items-start"
          style="grid-template-columns: 1fr 1.1fr;"
        >
          <div data-reveal="root" class="reveal contact-left">
            <h3 class="ct-title text-[1.35rem] font-bold mb-3">Let's Connect</h3>
            <p
              class="text-[0.95rem] font-medium leading-[1.7] mb-[22px] opacity-85"
              style="color: var(--text)"
            >
              Open to Senior Software Engineering roles, remote Web &amp; AI development contracts,
              enterprise WordPress &amp; CRM consulting, and emergency cybersecurity recovery.
            </p>

            <div class="flex flex-col gap-3">
              ${cards
                .map((item, idx) => {
                  const inner = `
                    <span class="cc-ring" aria-hidden="true"></span>
                    <div class="flex gap-4 items-center">
                      <div
                        class="cc-icon flex items-center justify-center shrink-0"
                        style="width:42px;height:42px;border-radius:12px;background:${item.bg};color:${item.ic};"
                      >
                        ${item.icon}
                      </div>
                      <div class="overflow-hidden min-w-0 flex-1">
                        <div
                          class="text-[0.7rem] font-normal uppercase tracking-[0.12em] mb-0.5"
                          style="color: var(--contact-label-color)"
                        >
                          ${esc(item.label)}
                        </div>
                        <div
                          class="font-medium text-[0.95rem] tracking-[0.01em] truncate"
                          style="color: ${item.clr}"
                        >
                          ${esc(item.value)}
                        </div>
                      </div>
                      ${
                        item.href
                          ? `<svg class="cc-go" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>`
                          : ''
                      }
                    </div>
                  `;

                  if (item.href) {
                    const ext = item.href.startsWith('http');
                    return `<a
                      href="${esc(item.href)}"
                      ${ext ? 'target="_blank" rel="noopener noreferrer"' : ''}
                      class="card edu-card contact-card block"
                      style="padding:14px 20px;color:inherit;--i:${idx};--cc:${item.clr};"
                    >${inner}</a>`;
                  }
                  return `<div class="card edu-card contact-card" style="padding:14px 20px;--i:${idx};--cc:${item.clr};">${inner}</div>`;
                })
                .join('')}
            </div>
          </div>

          <div data-reveal="root" class="reveal contact-right">
            <div id="contact-form-card" class="card edu-card contact-form-card" style="padding:28px 32px 30px;">
              <div id="cf-progress-el" class="cf-progress" style="--p: 0">
                <span></span>
              </div>

              <div class="flex items-baseline justify-between gap-3 mb-[18px]">
                <h3 class="text-[1.3rem] font-bold m-0">Send a Message</h3>
                <span class="cf-progress-note"><b id="cf-ready-count">0</b> / 3 ready</span>
              </div>

              <form id="portfolio-contact-form" novalidate class="flex flex-col gap-4">
                <input
                  type="text"
                  id="cf-honey"
                  name="website"
                  tabindex="-1"
                  autocomplete="off"
                  aria-hidden="true"
                  style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;"
                />

                <div id="cf-field-name" class="cf-field" style="--f: 0">
                  <div class="cf-label-row">
                    <label for="cf-name-input" class="block text-[0.85rem] mb-1.5 tracking-[0.04em]" style="color: var(--text)">
                      Full Name
                    </label>
                    <span class="cf-tick" aria-hidden="true">${Icons.checkTickSvg()}</span>
                  </div>
                  <input id="cf-name-input" class="input-field" placeholder="Your name" />
                </div>

                <div id="cf-field-email" class="cf-field" style="--f: 1">
                  <div class="cf-label-row">
                    <label for="cf-email-input" class="block text-[0.85rem] mb-1.5 tracking-[0.04em]" style="color: var(--text)">
                      Email Address
                    </label>
                    <span class="cf-tick" aria-hidden="true">${Icons.checkTickSvg()}</span>
                  </div>
                  <input id="cf-email-input" type="email" class="input-field" placeholder="your@email.com" />
                </div>

                <div id="cf-field-subject" class="cf-field" style="--f: 1.5">
                  <div class="cf-label-row">
                    <label for="cf-subject-input" class="block text-[0.85rem] mb-1.5 tracking-[0.04em]" style="color: var(--text)">
                      Subject <span class="opacity-55 text-xs">(optional)</span>
                    </label>
                    <span class="cf-tick" aria-hidden="true">${Icons.checkTickSvg()}</span>
                  </div>
                  <input id="cf-subject-input" class="input-field" placeholder="Project inquiry / Hiring / Collaboration" />
                </div>

                <div id="cf-field-msg" class="cf-field" style="--f: 2">
                  <div class="cf-label-row">
                    <label for="cf-msg-input" class="block text-[0.85rem] mb-1.5 tracking-[0.04em]" style="color: var(--text)">
                      Message
                    </label>
                    <span class="cf-tick" aria-hidden="true">${Icons.checkTickSvg()}</span>
                  </div>
                  <textarea id="cf-msg-input" class="input-field" rows="4" placeholder="Tell me about your project…" style="resize:vertical;"></textarea>
                  <span id="cf-char-count" class="cf-count">0 chars · add a few more words</span>
                </div>

                <div class="cf-send-wrap">
                  <button
                    id="cf-submit-btn"
                    type="submit"
                    class="btn-primary contact-send justify-center"
                    style="--f: 3"
                  >
                    ${Icons.sendIcon(16)}
                    <span>Send Message</span>
                  </button>
                  <span id="cf-burst-slot"></span>
                </div>

                <div id="cf-alert-slot"></div>
              </form>
            </div>
          </div>
        </div>

        <div data-reveal="root" class="reveal mt-12">
          <div
            class="text-[0.76rem] font-bold uppercase tracking-[0.14em] mb-4 text-center"
            style="color: var(--accent)"
          >
            Academic References
          </div>

          <div
            class="grid gap-[18px]"
            style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));"
          >
            ${contact.references
              .map(
                (ref) => `
                <div class="card edu-card py-[22px] px-6 flex flex-col gap-1.5">
                  <div class="syne font-bold text-[1.02rem]" style="color: var(--text)">
                    ${esc(ref.name)}
                  </div>
                  <div class="text-[0.85rem] font-semibold" style="color: var(--accent)">
                    ${esc(ref.role)}
                  </div>
                  <div class="text-[0.83rem]" style="color: var(--muted)">
                    ${esc(ref.dept)} · ${esc(ref.institution)}
                  </div>
                  <a
                    href="mailto:${esc(ref.email)}"
                    class="mono mt-1 text-[0.8rem] font-semibold w-fit"
                    style="color: var(--accent2)"
                  >
                    ✉ ${esc(ref.email)}
                  </a>
                </div>
              `
              )
              .join('')}
          </div>
        </div>
      </div>
    `;

    // 3D pointer tilt on contact cards
    sec.querySelectorAll('.contact-card').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        const rect = card.getBoundingClientRect();
        const rxRatio = (e.clientX - rect.left) / rect.width;
        const ryRatio = (e.clientY - rect.top) / rect.height;
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--my', `${e.clientY - rect.top}px`);
        card.style.setProperty('--rx', `${((0.5 - ryRatio) * 6).toFixed(2)}deg`);
        card.style.setProperty('--ry', `${((rxRatio - 0.5) * 7).toFixed(2)}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });

    const formCard = document.getElementById('contact-form-card');
    formCard?.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const rect = formCard.getBoundingClientRect();
      formCard.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      formCard.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });

    // Live Form Validation & Confetti Submission
    const formEl = document.getElementById('portfolio-contact-form');
    const honeyInput = document.getElementById('cf-honey');
    const nameInput = document.getElementById('cf-name-input');
    const emailInput = document.getElementById('cf-email-input');
    const subjectInput = document.getElementById('cf-subject-input');
    const msgInput = document.getElementById('cf-msg-input');
    const fieldName = document.getElementById('cf-field-name');
    const fieldEmail = document.getElementById('cf-field-email');
    const fieldSubject = document.getElementById('cf-field-subject');
    const fieldMsg = document.getElementById('cf-field-msg');
    const progressEl = document.getElementById('cf-progress-el');
    const readyCountEl = document.getElementById('cf-ready-count');
    const charCountEl = document.getElementById('cf-char-count');
    const submitBtn = document.getElementById('cf-submit-btn');
    const burstSlot = document.getElementById('cf-burst-slot');
    const alertSlot = document.getElementById('cf-alert-slot');

    let triedSubmit = false;
    let status = 'idle'; // 'idle' | 'sending' | 'sent' | 'validation_error' | 'email_error'

    function getValidation() {
      const nameVal = (nameInput?.value || '').trim();
      const emailVal = (emailInput?.value || '').trim();
      const subjectVal = (subjectInput?.value || '').trim();
      const msgVal = (msgInput?.value || '').trim();

      const validName = nameVal.length >= 2;
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
      const validMsg = msgVal.length >= 10;
      const readyCount = [validName, validEmail, validMsg].filter(Boolean).length;

      return {
        nameVal,
        emailVal,
        subjectVal,
        msgVal,
        validName,
        validEmail,
        validMsg,
        readyCount,
      };
    }

    function syncFormUI() {
      const v = getValidation();
      const isSending = status === 'sending';

      if (progressEl) progressEl.style.setProperty('--p', String(v.readyCount / 3));
      if (readyCountEl) readyCountEl.textContent = String(v.readyCount);

      fieldName?.classList.toggle('cf-ok', v.validName);
      fieldName?.classList.toggle('cf-invalid', triedSubmit && !v.validName);

      fieldEmail?.classList.toggle('cf-ok', v.validEmail);
      fieldEmail?.classList.toggle('cf-invalid', triedSubmit && !v.validEmail);

      fieldSubject?.classList.toggle('cf-ok', v.subjectVal.length > 0);

      fieldMsg?.classList.toggle('cf-ok', v.validMsg);
      fieldMsg?.classList.toggle('cf-invalid', triedSubmit && !v.validMsg);

      if (charCountEl) {
        charCountEl.classList.toggle('cf-count--ok', v.validMsg);
        charCountEl.textContent = `${v.msgVal.length} chars${v.validMsg ? '' : ' · add a few more words'}`;
      }

      [nameInput, emailInput, subjectInput, msgInput, submitBtn].forEach((el) => {
        if (el) el.disabled = isSending;
      });

      if (submitBtn) {
        submitBtn.classList.toggle('is-sending', isSending);
        submitBtn.classList.toggle('is-sent', status === 'sent');
        submitBtn.style.opacity = isSending ? '0.85' : '1';
        submitBtn.innerHTML = isSending
          ? `<span class="cf-spinner" aria-hidden="true"></span><span>Sending…</span>`
          : status === 'sent'
            ? `${Icons.sendIcon(16)}<span>Message Sent!</span>`
            : `${Icons.sendIcon(16)}<span>Send Message</span>`;
      }

      if (alertSlot) {
        if (status === 'validation_error') {
          alertSlot.innerHTML = `
            <div class="alert-box alert-warning">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span style="color:var(--text);opacity:0.9;">
                Please complete your name, valid email, and a short message (10+ characters) before sending.
              </span>
            </div>
          `;
        } else if (status === 'email_error') {
          alertSlot.innerHTML = `
            <div class="alert-box alert-warning">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span style="color:var(--text);opacity:0.9;">
                Please enter a valid email address so I can reply to you.
              </span>
            </div>
          `;
        } else if (status === 'sent') {
          alertSlot.innerHTML = `
            <div class="alert-box alert-success">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span style="color:var(--text);opacity:0.95;">
                Email draft opened for <strong>${esc(contact.email)}</strong>! Looking forward to speaking with you.
              </span>
            </div>
          `;
        } else {
          alertSlot.innerHTML = '';
        }
      }
    }

    function spawnConfettiBurst() {
      if (!burstSlot) return;
      const particles = Array.from({ length: 18 }, (_, i) => {
        const angle = (i / 18) * Math.PI * 2 + pseudoRand(i) * 0.3;
        const dist = 70 + pseudoRand(i + 40) * 90;
        const x = `${(Math.cos(angle) * dist).toFixed(2)}px`;
        const y = `${(Math.sin(angle) * dist - 30).toFixed(2)}px`;
        const r = `${Math.round(pseudoRand(i + 80) * 540 - 270)}deg`;
        const c = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
        return `<i style="--x:${x};--y:${y};--r:${r};--c:${c};"></i>`;
      }).join('');

      burstSlot.innerHTML = `<span class="cf-burst" aria-hidden="true">${particles}</span>`;
    }

    [nameInput, emailInput, subjectInput, msgInput].forEach((el) => {
      el?.addEventListener('input', () => {
        if (status === 'validation_error' || status === 'email_error') {
          status = 'idle';
        }
        syncFormUI();
      });
    });

    formEl?.addEventListener('submit', (e) => {
      e.preventDefault();
      if ((honeyInput?.value || '').trim().length > 0 || status === 'sending') return;

      triedSubmit = true;
      const v = getValidation();

      if (!v.nameVal || !v.emailVal || !v.msgVal) {
        status = 'validation_error';
        syncFormUI();
        return;
      }
      if (!v.validEmail) {
        status = 'email_error';
        syncFormUI();
        return;
      }
      if (!v.validName || !v.validMsg) {
        status = 'validation_error';
        syncFormUI();
        return;
      }

      status = 'sending';
      syncFormUI();

      const subjectLine = encodeURIComponent(
        v.subjectVal || `Portfolio Inquiry from ${v.nameVal}`
      );
      const bodyText = encodeURIComponent(
        `Name: ${v.nameVal}\nEmail: ${v.emailVal}\n\nMessage:\n${v.msgVal}`
      );

      window.setTimeout(() => {
        window.location.href = `mailto:${contact.email}?subject=${subjectLine}&body=${bodyText}`;
        status = 'sent';
        triedSubmit = false;
        if (nameInput) nameInput.value = '';
        if (emailInput) emailInput.value = '';
        if (subjectInput) subjectInput.value = '';
        if (msgInput) msgInput.value = '';
        spawnConfettiBurst();
        syncFormUI();
        window.setTimeout(() => {
          status = 'idle';
          syncFormUI();
        }, 5500);
      }, 420);
    });

    syncFormUI();
  }

  /* --------------------------------------------------------------------------
     12. Footer & Floating ScrollToTop Button
  -------------------------------------------------------------------------- */
  function initFooterAndScrollTop() {
    const footerEl = document.getElementById('site-footer');
    if (footerEl) {
      footerEl.innerHTML = `
        <div class="max-w-[1100px] mx-auto flex items-center justify-center">
          <p class="footer-copyright text-[0.9rem] text-center" style="color: var(--text)">
            © ${new Date().getFullYear()} ${esc(DATA.hero.name)}. All rights reserved.
          </p>
        </div>
      `;
    }

    const scrollBtn = document.getElementById('scroll-top-btn');
    if (scrollBtn) {
      scrollBtn.innerHTML = Icons.chevronUpIcon(24);
      scrollBtn.addEventListener('click', () => scrollToTop());
      const syncBtn = () => {
        scrollBtn.classList.toggle('is-visible', window.scrollY > 400);
      };
      window.addEventListener('scroll', syncBtn, { passive: true });
      syncBtn();
    }
  }

  /* --------------------------------------------------------------------------
     Bootstrap Application
  -------------------------------------------------------------------------- */
  function bootstrap() {
    initBackgroundAndCursor();
    initNavbar();
    initHero();
    initEducation();
    initSkills();
    initServices();
    initExperience();
    initProjects();
    initToolsSection();
    initCertifications();
    initContact();
    initFooterAndScrollTop();
    initRevealObserver();
    bindHashAnchorClicks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();


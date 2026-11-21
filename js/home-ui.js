/* ==========================================================================
   Mehedi Hasan Shihab — Homepage Interactive UI Controller (shihabCV v6)
   Progressive enhancement for all 9 sections + 2 accessible modals.
   ========================================================================== */
(function () {
  'use strict';

  const shihab_data = window.SHIHAB_HOME_DATA;
  if (!shihab_data) return;

  const shihab_prefersReduced = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const shihab_pad2 = (n) => String(n).padStart(2, '0');

  function shihab_esc(val) {
    return String(val == null ? '' : val)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function shihab_svgExternal(size) {
    const s = size || 14;
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;
  }

  function shihab_svgGithub(size) {
    const s = size || 15;
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"/></svg>`;
  }

  function shihab_svgInfo(size) {
    const s = size || 15;
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
  }

  function shihab_svgEye() {
    return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>`;
  }

  function shihab_svgChevron(dir) {
    const pts = dir === 'left' ? '15 18 9 12 15 6' : '9 18 15 12 9 6';
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="${pts}"/></svg>`;
  }

  function shihab_svgClose(size) {
    const s = size || 18;
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
  }

  function shihab_svgProjectIcon(key, accent, size) {
    const s = size || 44;
    const a = `width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${shihab_esc(accent)}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"`;
    switch (key) {
      case 'download':
        return `<svg ${a}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
      case 'chip':
        return `<svg ${a}><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></svg>`;
      case 'speed':
        return `<svg ${a}><path d="M12 14l4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/><circle cx="12" cy="14" r="1.5" fill="${shihab_esc(accent)}"/></svg>`;
      case 'shield':
        return `<svg ${a}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`;
      case 'ai-voice':
        return `<svg ${a}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>`;
      case 'agent':
        return `<svg ${a}><circle cx="12" cy="12" r="3"/><circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="M6.7 7.3 9.7 10M17.3 7.3 14.3 10M6.7 16.7 9.7 14M17.3 16.7 14.3 14"/></svg>`;
      case 'crm':
        return `<svg ${a}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>`;
      case 'healthcare':
        return `<svg ${a}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;
      case 'network':
        return `<svg ${a}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
      case 'cart':
        return `<svg ${a}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`;
      case 'bot':
        return `<svg ${a}><rect x="3" y="8" width="18" height="12" rx="3"/><path d="M12 3v5M8 13h.01M16 13h.01M9 17h6"/></svg>`;
      case 'hospital':
        return `<svg ${a}><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M12 8v6M9 11h6M9 21v-3h6v3"/></svg>`;
      case 'bolt':
        return `<svg ${a}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
      case 'calculator':
        return `<svg ${a}><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><path d="M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 18.5h8"/></svg>`;
      case 'chart':
        return `<svg ${a}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`;
      default:
        return `<svg ${a}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;
    }
  }

  /* ------------------------------------------------------------------------
     1. Reveal Observer
     ------------------------------------------------------------------------ */
  function shihab_initReveals() {
    const els = document.querySelectorAll('.shihab_reveal');
    if (!els.length) return;
    if (shihab_prefersReduced() || typeof IntersectionObserver === 'undefined') {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px -24px 0px' }
    );

    els.forEach((el) => io.observe(el));
  }

  /* ------------------------------------------------------------------------
     2. Shared 2D Gliding Filter Pill & Ripple Effect
     ------------------------------------------------------------------------ */
  function shihab_setupFilterPill(barEl) {
    if (!barEl) return function () {};
    let pill = barEl.querySelector('.shihab_pf_pill');
    if (!pill) {
      pill = document.createElement('span');
      pill.className = 'shihab_pf_pill';
      pill.setAttribute('aria-hidden', 'true');
      barEl.prepend(pill);
    }

    const sync = () => {
      const active = barEl.querySelector('.shihab_filter_tab.is-active');
      if (!active || !pill) return;
      pill.style.width = `${active.offsetWidth}px`;
      pill.style.height = `${active.offsetHeight}px`;
      pill.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`;
    };

    requestAnimationFrame(sync);
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(sync);
      ro.observe(barEl);
      barEl.querySelectorAll('.shihab_filter_tab').forEach((b) => ro.observe(b));
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(sync).catch(function () {});
    }
    return sync;
  }

  function shihab_triggerRipple(e) {
    if (shihab_prefersReduced()) return;
    const btn = e.currentTarget;
    const rip = btn.querySelector(':scope > .shihab_rip');
    if (!rip) return;
    const r = btn.getBoundingClientRect();
    const d = Math.max(r.width, r.height) * 2.2;
    const wave = document.createElement('span');
    wave.className = 'shihab_rip_wave';
    wave.style.width = `${d}px`;
    wave.style.height = `${d}px`;
    wave.style.left = `${e.clientX - r.left - d / 2}px`;
    wave.style.top = `${e.clientY - r.top - d / 2}px`;
    rip.appendChild(wave);
    wave.addEventListener('animationend', () => wave.remove());
  }

  function shihab_bindTilt(elements, maxX, maxY) {
    if (shihab_prefersReduced()) return;
    elements.forEach((card) => {
      let rafId = 0;
      let lastX = 0;
      let lastY = 0;
      const apply = () => {
        rafId = 0;
        const r = card.getBoundingClientRect();
        if (!r.width || !r.height) return;
        const nx = (lastX - r.left) / r.width;
        const ny = (lastY - r.top) / r.height;
        card.style.setProperty('--mx', `${lastX - r.left}px`);
        card.style.setProperty('--my', `${lastY - r.top}px`);
        card.style.setProperty('--rx', `${((0.5 - ny) * maxX).toFixed(2)}deg`);
        card.style.setProperty('--ry', `${((nx - 0.5) * maxY).toFixed(2)}deg`);
      };
      card.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        lastX = e.clientX;
        lastY = e.clientY;
        if (!rafId) rafId = requestAnimationFrame(apply);
      });
      card.addEventListener('pointerleave', () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ------------------------------------------------------------------------
     3. Section 1: Hero Interactions (Spotlight, Tilt, Typewriter, Stats)
     ------------------------------------------------------------------------ */
  function shihab_initHero() {
    const sec = document.getElementById('home');
    if (!sec) return;

    const spotEl = sec.querySelector('.shihab_hero_spot');
    const avatarInner = document.getElementById('shihab_hero_avatar_inner');
    if (!shihab_prefersReduced()) {
      let heroRaf = 0;
      let hx = 0;
      let hy = 0;
      const applyHeroPointer = () => {
        heroRaf = 0;
        const rect = sec.getBoundingClientRect();
        const ar = avatarInner ? avatarInner.getBoundingClientRect() : null;
        if (spotEl) {
          spotEl.style.setProperty('--hx', `${hx - rect.left}px`);
          spotEl.style.setProperty('--hy', `${hy - rect.top}px`);
        }
        if (avatarInner && ar) {
          const nx = Math.max(-1, Math.min(1, (hx - (ar.left + ar.width / 2)) / (window.innerWidth / 2)));
          const ny = Math.max(-1, Math.min(1, (hy - (ar.top + ar.height / 2)) / (window.innerHeight / 2)));
          avatarInner.style.setProperty('--ry', `${(nx * 9).toFixed(2)}deg`);
          avatarInner.style.setProperty('--rx', `${(-ny * 7).toFixed(2)}deg`);
        }
      };
      sec.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        hx = e.clientX;
        hy = e.clientY;
        if (!heroRaf) heroRaf = requestAnimationFrame(applyHeroPointer);
      });
      sec.addEventListener('pointerleave', () => {
        if (heroRaf) {
          cancelAnimationFrame(heroRaf);
          heroRaf = 0;
        }
        if (avatarInner) {
          avatarInner.style.setProperty('--rx', '0deg');
          avatarInner.style.setProperty('--ry', '0deg');
        }
      });
    }

    // Typewriter Subtitle
    const typedEl = document.getElementById('shihab_hero_typed_text');
    const caretEl = document.getElementById('shihab_hero_caret');
    if (typedEl && caretEl) {
      const fullText = typedEl.getAttribute('data-full-text') || typedEl.textContent || '';
      if (shihab_prefersReduced()) {
        typedEl.textContent = fullText;
        caretEl.classList.add('is-done');
      } else {
        typedEl.textContent = '';
        let i = 0;
        window.setTimeout(() => {
          const iv = window.setInterval(() => {
            i += 1;
            typedEl.textContent = fullText.slice(0, i);
            if (i >= fullText.length) {
              window.clearInterval(iv);
              caretEl.classList.add('is-done');
            }
          }, 30);
        }, 350);
      }
    }

    // Stat Counter Animation
    sec.querySelectorAll('[data-shihab-stat]').forEach((el) => {
      const raw = el.getAttribute('data-shihab-stat') || '';
      const m = raw.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
      if (!m || shihab_prefersReduced()) {
        el.textContent = raw;
        return;
      }
      const prefix = m[1];
      const target = parseFloat(m[2]);
      const decimals = m[2].includes('.') ? m[2].split('.')[1].length : 0;
      const suffix = m[3];
      el.textContent = `${prefix}0${suffix}`;
      window.setTimeout(() => {
        const t0 = performance.now();
        const tick = (now) => {
          const k = Math.min((now - t0) / 1200, 1);
          const eased = 1 - Math.pow(1 - k, 3);
          el.textContent = `${prefix}${(target * eased).toFixed(decimals)}${suffix}`;
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }, 450);
    });
  }

  /* ------------------------------------------------------------------------
     4. Section 2: Education Scroll Rail & Circular SVG GPA Dials
     ------------------------------------------------------------------------ */
  function shihab_initEducation() {
    const listEl = document.getElementById('shihab_edu_list');
    if (!listEl) return;

    shihab_bindTilt(listEl.querySelectorAll('.shihab_edu_card'), 3, 4);

    // Circular GPA Dials
    listEl.querySelectorAll('[data-shihab-dial]').forEach((dialEl) => {
      const val = parseFloat(dialEl.getAttribute('data-val') || '0');
      const decimals = parseInt(dialEl.getAttribute('data-decimals') || '2', 10);
      const pct = parseFloat(dialEl.getAttribute('data-pct') || '0');
      const circ = 2 * Math.PI * 24;
      const targetOffset = circ - (pct / 100) * circ;
      const arcEl = dialEl.querySelector('.shihab_edu_dial_arc');
      const valEl = dialEl.querySelector('.shihab_edu_dial_val');
      if (!arcEl || !valEl) return;

      const animateDial = () => {
        if (shihab_prefersReduced()) {
          arcEl.setAttribute('stroke-dashoffset', String(targetOffset));
          valEl.textContent = val.toFixed(decimals);
          return;
        }
        arcEl.setAttribute('stroke-dashoffset', String(circ));
        window.setTimeout(() => {
          arcEl.setAttribute('stroke-dashoffset', String(targetOffset));
        }, 120);

        const t0 = performance.now();
        const step = (now) => {
          const p = Math.min((now - t0) / 1100, 1);
          const eased = (1 - Math.pow(1 - p, 3)) * val;
          valEl.textContent = p < 1 ? eased.toFixed(decimals) : val.toFixed(decimals);
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      };

      if (typeof IntersectionObserver === 'undefined') {
        animateDial();
      } else {
        const io = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              animateDial();
              io.unobserve(dialEl);
            }
          },
          { threshold: 0.2 }
        );
        io.observe(dialEl);
      }
    });

    // Scroll-driven vertical timeline rail (batched reads before writes)
    const reduced = shihab_prefersReduced();
    const items = Array.from(listEl.querySelectorAll('.shihab_edu_item')).map((item) => ({
      item,
      dot: item.querySelector('.shihab_edu_dot')
    }));
    const firstItem = items.length ? items[0].item : null;
    let raf = 0;

    const updateRail = (force) => {
      raf = 0;
      const rect = listEl.getBoundingClientRect();
      const vh = window.innerHeight;
      if (!force && !reduced && (rect.bottom < -120 || rect.top > vh + 120)) return;

      // Pass 1: Read all layout metrics before any DOM writes
      const triggerY = vh * 0.65;
      const railTop = firstItem ? firstItem.offsetTop + firstItem.offsetHeight / 2 : 40;
      const fill = reduced
        ? Math.max(rect.height - railTop, 0)
        : Math.min(Math.max(triggerY - rect.top - railTop, 0), Math.max(rect.height - railTop, 0));
      const states = items.map(({ dot }) => {
        if (!dot) return false;
        if (reduced) return true;
        const dr = dot.getBoundingClientRect();
        return dr.top + dr.height / 2 < triggerY;
      });

      // Pass 2: Apply all writes together
      listEl.style.setProperty('--rail-top', `${railTop}px`);
      listEl.style.setProperty('--fill', `${fill}px`);
      items.forEach(({ item }, idx) => {
        item.classList.toggle('is-reached', states[idx]);
      });
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(() => updateRail(false));
    };
    requestAnimationFrame(() => updateRail(true));
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => updateRail(true));
      ro.observe(listEl);
    }
    if (!reduced) {
      window.addEventListener('scroll', schedule, { passive: true });
    }
    window.addEventListener('resize', () => updateRail(true));
  }

  /* ------------------------------------------------------------------------
     5. Section 3: Technical Skills (Gliding Filter Pill + FLIP Grid)
     ------------------------------------------------------------------------ */
  function shihab_initSkills() {
    const barEl = document.getElementById('shihab_skills_pf_bar');
    const gridEl = document.getElementById('shihab_skills_grid');
    const spotEl = document.getElementById('shihab_skills_spot');
    const stageEl = document.getElementById('shihab_skills_stage');
    if (!barEl || !gridEl) return;

    const skills = shihab_data.skills;
    const tabs = shihab_data.skillTabs;
    const brokenIcons = new Set();
    let currentCat = 'all';

    const countFor = (k) => (k === 'all' ? skills.length : skills.filter((s) => s.cat === k).length);

    barEl.innerHTML = tabs
      .map(
        (t) => `
          <button type="button" data-skill-tab="${shihab_esc(t.key)}" class="shihab_filter_tab${t.key === 'all' ? ' is-active' : ''}" aria-pressed="${t.key === 'all'}">
            ${t.key !== 'all' ? `<i class="shihab_skills_dot" style="background:${shihab_esc(t.color)}" aria-hidden="true"></i>` : ''}
            <span>${shihab_esc(t.label)}</span>
            <span class="shihab_pf_count">${countFor(t.key)}</span>
          </button>`
      )
      .join('');

    const syncPill = shihab_setupFilterPill(barEl);

    function makeFallback(sk) {
      const text = sk.badgeText || sk.name.slice(0, 2).toUpperCase();
      return `<span class="shihab_skill_badge_icon" aria-hidden="true">${shihab_esc(text)}</span>`;
    }

    function renderTiles(animateFlip) {
      const prevRects = new Map();
      if (animateFlip && !shihab_prefersReduced()) {
        gridEl.querySelectorAll('.shihab_skill_tile').forEach((tile) => {
          const key = tile.getAttribute('data-k');
          if (key) prevRects.set(key, tile.getBoundingClientRect());
        });
      }

      gridEl.querySelectorAll('.shihab_skill_tile').forEach((t) => t.remove());

      const list = currentCat === 'all' ? skills : skills.filter((s) => s.cat === currentCat);
      const frag = document.createDocumentFragment();

      list.forEach((sk) => {
        const tile = document.createElement('div');
        tile.className = 'shihab_skill_tile';
        tile.setAttribute('data-k', sk.id);
        tile.style.setProperty('--cat', sk.c || 'var(--primary-color)');

        const iconCls = sk.invertDark ? 'shihab_skill_icon shihab_skill_icon--invert_dark' : 'shihab_skill_icon';
        const iconHtml =
          sk.icon && !brokenIcons.has(sk.id)
            ? `<img src="${shihab_esc(sk.icon)}" alt="" width="38" height="38" class="${iconCls}" loading="lazy" decoding="async">`
            : makeFallback(sk);

        tile.innerHTML = `
          <span class="shihab_skill_cat_dot" aria-hidden="true"></span>
          ${iconHtml}
          <span class="shihab_skill_label">${shihab_esc(sk.name)}</span>
        `;

        const img = tile.querySelector('img.shihab_skill_icon');
        if (img) {
          img.addEventListener('error', () => {
            brokenIcons.add(sk.id);
            img.outerHTML = makeFallback(sk);
          });
        }

        frag.appendChild(tile);
      });

      gridEl.appendChild(frag);
      const tiles = Array.from(gridEl.querySelectorAll('.shihab_skill_tile'));
      shihab_bindTilt(tiles, 12, 14);

      if (animateFlip && prevRects.size > 0 && typeof Element.prototype.animate === 'function') {
        // Pass 1: Read all next rects before triggering any animations
        const deltas = [];
        tiles.forEach((tile) => {
          const prev = prevRects.get(tile.getAttribute('data-k'));
          if (!prev) return;
          const next = tile.getBoundingClientRect();
          const dx = prev.left - next.left;
          const dy = prev.top - next.top;
          if (dx || dy) deltas.push({ tile, dx, dy });
        });
        // Pass 2: Launch animations together
        deltas.forEach(({ tile, dx, dy }) => {
          tile.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0, 0)' }], {
            duration: 420,
            easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
          });
        });
      }
    }

    renderTiles(false);

    barEl.querySelectorAll('[data-skill-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nextCat = btn.getAttribute('data-skill-tab') || 'all';
        if (nextCat === currentCat) return;
        currentCat = nextCat;
        barEl.querySelectorAll('[data-skill-tab]').forEach((b) => {
          const active = b.getAttribute('data-skill-tab') === currentCat;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-pressed', String(active));
        });
        syncPill();
        renderTiles(true);
      });
    });

    if (stageEl && spotEl && !shihab_prefersReduced()) {
      let spotRaf = 0;
      let sx = 0;
      let sy = 0;
      const applySpot = () => {
        spotRaf = 0;
        const r = gridEl.getBoundingClientRect();
        spotEl.style.transform = `translate3d(${sx - r.left - 160}px, ${sy - r.top - 160}px, 0)`;
        spotEl.style.opacity = '1';
      };
      stageEl.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        sx = e.clientX;
        sy = e.clientY;
        if (!spotRaf) spotRaf = requestAnimationFrame(applySpot);
      });
      stageEl.addEventListener('pointerleave', () => {
        if (spotRaf) {
          cancelAnimationFrame(spotRaf);
          spotRaf = 0;
        }
        spotEl.style.opacity = '0';
      });
    }
  }

  /* ------------------------------------------------------------------------
     6. Section 4: Services (Tilt + Service Inquiry Subject Pre-fill)
     ------------------------------------------------------------------------ */
  function shihab_initServices() {
    const sec = document.getElementById('services');
    if (!sec) return;
    shihab_bindTilt(sec.querySelectorAll('.shihab_svc_card'), 6, 8);

    sec.querySelectorAll('[data-service-inquiry]').forEach((link) => {
      link.addEventListener('click', () => {
        const svcName = link.getAttribute('data-service-inquiry');
        const subjInput = document.getElementById('shihab_cf_subject');
        if (svcName && subjInput) {
          subjInput.value = `Service Inquiry: ${svcName}`;
          subjInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     7. Section 5: Experience Scroll Rail & Tilt
     ------------------------------------------------------------------------ */
  function shihab_initExperience() {
    const wrap = document.getElementById('shihab_exp_list_wrap');
    if (!wrap) return;

    shihab_bindTilt(wrap.querySelectorAll('.shihab_exp_card'), 2.2, 3);

    const reduced = shihab_prefersReduced();
    const items = Array.from(wrap.querySelectorAll('.shihab_exp_item')).map((item) => ({
      item,
      dot: item.querySelector('.shihab_exp_dot')
    }));
    let raf = 0;

    const updateRail = (force) => {
      raf = 0;
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      if (!force && !reduced && (r.bottom < -120 || r.top > vh + 120)) return;

      // Pass 1: Read layout metrics before writing
      const triggerY = vh * 0.65;
      const fill = reduced
        ? Math.max(r.height - 19, 0)
        : Math.min(Math.max(triggerY - r.top - 19, 0), Math.max(r.height - 19, 0));
      const states = items.map(({ dot }) => {
        if (!dot) return false;
        if (reduced) return true;
        const dr = dot.getBoundingClientRect();
        return dr.top + dr.height / 2 < triggerY;
      });

      // Pass 2: Apply writes together
      wrap.style.setProperty('--fill', `${fill}px`);
      items.forEach(({ item }, idx) => {
        item.classList.toggle('is-reached', states[idx]);
      });
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(() => updateRail(false));
    };
    requestAnimationFrame(() => updateRail(true));
    if (!reduced) {
      window.addEventListener('scroll', schedule, { passive: true });
    }
    window.addEventListener('resize', () => updateRail(true));
  }

  /* ------------------------------------------------------------------------
     8. Focus Trap & Background Inert Helper for Accessible Modals
     ------------------------------------------------------------------------ */
  function shihab_setBackgroundInert(isInert) {
    ['main-content', 'site-header', 'site-footer'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.inert = isInert;
    });
  }

  function shihab_bindFocusTrap(container, onClose) {
    const focusableSel =
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = Array.from(container.querySelectorAll(focusableSel)).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (!container.contains(document.activeElement)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }

  /* ------------------------------------------------------------------------
     9. Section 6: Projects Grid & Accessible Project Details Modal
     ------------------------------------------------------------------------ */
  function shihab_initProjects() {
    const barEl = document.getElementById('shihab_projects_pf_bar');
    const gridEl = document.getElementById('shihab_projects_grid');
    const modalRoot = document.getElementById('shihab_project_modal_root');
    if (!barEl || !gridEl || !modalRoot) return;

    const projects = shihab_data.projects;
    const tabs = shihab_data.projectTabs;
    const catLabels = shihab_data.projectCatLabels;

    let currentCat = 'all';
    let selectedProj = null;
    let lastTriggerEl = null;
    let isClosing = false;
    let closeTimer = 0;
    let unbindTrap = null;

    const countFor = (k) => (k === 'all' ? projects.length : projects.filter((p) => p.cat === k).length);
    const getFiltered = () => (currentCat === 'all' ? projects : projects.filter((p) => p.cat === currentCat));

    barEl.innerHTML = tabs
      .map(
        (t) => `
          <button type="button" data-proj-tab="${shihab_esc(t.key)}" class="shihab_filter_tab${t.key === 'all' ? ' is-active' : ''}" aria-pressed="${t.key === 'all'}">
            <span>${shihab_esc(t.label)}</span>
            <span class="shihab_pf_count">${countFor(t.key)}</span>
          </button>`
      )
      .join('');

    const syncPill = shihab_setupFilterPill(barEl);

    function renderModalBody(proj) {
      return `
        <div class="shihab_pm_banner" style="--pc:${shihab_esc(proj.c)};">
          <div class="shihab_proj_dots" aria-hidden="true"></div>
          <div class="shihab_proj_icon_box" style="--pc:${shihab_esc(proj.c)};width:92px;height:92px;">
            ${shihab_svgProjectIcon(proj.iconKey, proj.c, 48)}
          </div>
          <div class="shihab_pm_banner_fade"></div>
          <span class="shihab_pm_banner_cat">${shihab_esc(catLabels[proj.cat] || proj.cat)}</span>
        </div>

        <div class="shihab_pm_body" style="--pc:${shihab_esc(proj.c)};">
          <h2 id="shihab_pm_title" class="shihab_pm_title">${shihab_esc(proj.title)}</h2>
          <div class="shihab_pm_meta">
            <span>Stack: <b>${proj.tech.length} technologies</b></span>
            ${proj.flagship ? `<span class="shihab_pm_live_chip"><i aria-hidden="true"></i> Flagship Open-Source Release</span>` : ''}
            ${proj.live ? `<span class="shihab_pm_live_chip"><i aria-hidden="true"></i> Live Production</span>` : ''}
          </div>
          <p class="shihab_pm_desc">${shihab_esc(proj.desc)}</p>
          ${
            proj.highlights && proj.highlights.length
              ? `
              <div class="shihab_pm_hl_title">Key Features &amp; Engineering Highlights</div>
              <ul class="shihab_pm_hl_list">
                ${proj.highlights.map((h) => `<li>${shihab_esc(h)}</li>`).join('')}
              </ul>`
              : ''
          }
          <div class="shihab_pm_tags">
            ${proj.tech.map((t) => `<span class="shihab_tech_badge">${shihab_esc(t)}</span>`).join('')}
          </div>
          <div class="shihab_pm_actions">
            ${
              proj.live
                ? `<a href="${shihab_esc(proj.live)}" target="_blank" rel="noopener noreferrer" class="shihab_pill_btn shihab_pill_btn--live shihab_pill_btn--sm">${shihab_svgExternal(14)}<span>Visit Live Platform</span></a>`
                : ''
            }
            ${
              proj.github
                ? `<a href="${shihab_esc(proj.github)}" target="_blank" rel="noopener noreferrer" class="shihab_pill_btn shihab_pill_btn--outline shihab_pill_btn--sm">${shihab_svgGithub(15)}<span>Source Code</span></a>`
                : ''
            }
            ${(proj.extraLinks || [])
              .map(
                (xl) =>
                  `<a href="${shihab_esc(xl.url)}" target="_blank" rel="noopener noreferrer" class="shihab_pill_btn shihab_pill_btn--primary shihab_pill_btn--sm">${shihab_svgExternal(14)}<span>${shihab_esc(xl.label)}</span></a>`
              )
              .join('')}
          </div>
        </div>
      `;
    }

    function openModal(proj, event) {
      window.clearTimeout(closeTimer);
      if (unbindTrap) {
        unbindTrap();
        unbindTrap = null;
      }
      isClosing = false;
      selectedProj = proj;
      lastTriggerEl = event ? event.currentTarget : document.activeElement;

      const ox = event && event.clientX ? `${event.clientX}px` : '50%';
      const oy = event && event.clientY ? `${event.clientY}px` : '50%';

      const pool = getFiltered();
      const idx = Math.max(0, pool.findIndex((p) => p.id === proj.id));

      document.body.style.overflow = 'hidden';
      shihab_setBackgroundInert(true);
      modalRoot.innerHTML = `
        <div id="shihab_pm_backdrop" class="shihab_modal_backdrop" style="--ox:${ox};--oy:${oy};">
          <div id="shihab_pm_panel" class="shihab_pm_panel" role="dialog" aria-modal="true" aria-labelledby="shihab_pm_title">
            <div class="shihab_pm_progress" aria-hidden="true"><span id="shihab_pm_progress_bar"></span></div>
            <div class="shihab_pm_toolbar">
              <div class="shihab_pm_toolbar_in">
                <span id="shihab_pm_counter" class="shihab_pm_counter">${shihab_pad2(idx + 1)} / ${shihab_pad2(pool.length)}</span>
                <div class="shihab_pm_toolbar_btns">
                  ${
                    pool.length > 1
                      ? `<button type="button" id="shihab_pm_prev" class="shihab_pm_iconbtn" aria-label="Previous project" title="Previous (Left Arrow)">${shihab_svgChevron('left')}</button>
                         <button type="button" id="shihab_pm_next" class="shihab_pm_iconbtn" aria-label="Next project" title="Next (Right Arrow)">${shihab_svgChevron('right')}</button>`
                      : ''
                  }
                  <button type="button" id="shihab_pm_close" class="shihab_pm_iconbtn shihab_pm_iconbtn--close" aria-label="Close project details" title="Close (Esc)">${shihab_svgClose(18)}</button>
                </div>
              </div>
            </div>
            <div id="shihab_pm_slot">${renderModalBody(proj)}</div>
          </div>
        </div>
      `;

      const backdrop = document.getElementById('shihab_pm_backdrop');
      const panel = document.getElementById('shihab_pm_panel');
      const progress = document.getElementById('shihab_pm_progress_bar');
      const closeBtn = document.getElementById('shihab_pm_close');

      backdrop.addEventListener('click', closeModal);
      panel.addEventListener('click', (ev) => ev.stopPropagation());
      panel.addEventListener(
        'scroll',
        () => {
          const max = panel.scrollHeight - panel.clientHeight;
          if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(1, panel.scrollTop / max) : 0})`;
        },
        { passive: true }
      );

      const prevBtn = document.getElementById('shihab_pm_prev');
      const nextBtn = document.getElementById('shihab_pm_next');
      if (prevBtn) prevBtn.addEventListener('click', () => stepModal(-1));
      if (nextBtn) nextBtn.addEventListener('click', () => stepModal(1));
      if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
        closeBtn.focus();
      }

      unbindTrap = shihab_bindFocusTrap(panel, closeModal);
    }

    function stepModal(delta) {
      if (!selectedProj || isClosing) return;
      const pool = getFiltered();
      if (pool.length < 2) return;
      const cur = pool.findIndex((p) => p.id === selectedProj.id);
      const nextIdx = (cur + delta + pool.length) % pool.length;
      selectedProj = pool[nextIdx];

      const counter = document.getElementById('shihab_pm_counter');
      const slot = document.getElementById('shihab_pm_slot');
      const panel = document.getElementById('shihab_pm_panel');
      const progress = document.getElementById('shihab_pm_progress_bar');

      if (counter) counter.textContent = `${shihab_pad2(nextIdx + 1)} / ${shihab_pad2(pool.length)}`;
      if (slot) slot.innerHTML = renderModalBody(selectedProj);
      if (panel) {
        panel.scrollTo({ top: 0 });
        if (!panel.contains(document.activeElement)) {
          const closeBtn = document.getElementById('shihab_pm_close');
          if (closeBtn) closeBtn.focus();
        }
      }
      if (progress) progress.style.transform = 'scaleX(0)';
    }

    function closeModal() {
      if (!selectedProj || isClosing) return;
      isClosing = true;
      if (unbindTrap) {
        unbindTrap();
        unbindTrap = null;
      }
      const backdrop = document.getElementById('shihab_pm_backdrop');
      if (backdrop) backdrop.classList.add('is-closing');
      const delay = shihab_prefersReduced() ? 0 : 340;
      closeTimer = window.setTimeout(() => {
        selectedProj = null;
        isClosing = false;
        modalRoot.innerHTML = '';
        document.body.style.overflow = '';
        shihab_setBackgroundInert(false);
        if (lastTriggerEl && typeof lastTriggerEl.focus === 'function') {
          lastTriggerEl.focus();
        }
      }, delay);
    }

    window.addEventListener('keydown', (e) => {
      if (!selectedProj) return;
      if (e.key === 'ArrowRight') stepModal(1);
      else if (e.key === 'ArrowLeft') stepModal(-1);
    });

    function renderGrid() {
      const list = getFiltered();
      gridEl.innerHTML = list
        .map((proj) => {
          const shownTags = proj.tech.slice(0, 5);
          const extraCount = proj.tech.length - shownTags.length;
          return `
            <article class="shihab_project_card" data-proj-id="${shihab_esc(proj.id)}">
              <button type="button" class="shihab_proj_media" data-open-proj="${shihab_esc(proj.id)}" aria-label="View details for ${shihab_esc(proj.title)}" style="--pc:${shihab_esc(proj.c)};">
                <div class="shihab_proj_dots" aria-hidden="true"></div>
                <div class="shihab_proj_icon_box" style="--pc:${shihab_esc(proj.c)};">
                  ${shihab_svgProjectIcon(proj.iconKey, proj.c, 42)}
                </div>
                <span class="shihab_proj_cat">${shihab_esc(catLabels[proj.cat] || proj.cat)}</span>
                ${proj.flagship ? '<span class="shihab_proj_flagship_pill">Flagship</span>' : ''}
                <span class="shihab_proj_overlay" aria-hidden="true">
                  <span class="shihab_proj_peek">${shihab_svgEye()} View details</span>
                </span>
              </button>

              <div class="shihab_proj_body">
                <h3 class="shihab_proj_title"><span>${shihab_esc(proj.title)}</span></h3>
                <p class="shihab_proj_desc">${shihab_esc(proj.desc)}</p>
                <div class="shihab_proj_tags">
                  ${shownTags.map((t) => `<span class="shihab_tech_badge">${shihab_esc(t)}</span>`).join('')}
                  ${extraCount > 0 ? `<span class="shihab_tech_badge">+${extraCount}</span>` : ''}
                </div>
                <div class="shihab_proj_actions">
                  ${
                    proj.github
                      ? `<a href="${shihab_esc(proj.github)}" target="_blank" rel="noopener noreferrer" class="shihab_pill_btn shihab_pill_btn--outline shihab_pill_btn--sm shihab_rip_btn">${shihab_svgGithub(15)}<span>GitHub</span><span class="shihab_rip" aria-hidden="true"></span></a>`
                      : ''
                  }
                  <button type="button" data-open-proj="${shihab_esc(proj.id)}" class="shihab_pill_btn shihab_pill_btn--primary shihab_pill_btn--sm shihab_rip_btn">${shihab_svgInfo(15)}<span>Details</span><span class="shihab_rip" aria-hidden="true"></span></button>
                  ${
                    proj.live
                      ? `<a href="${shihab_esc(proj.live)}" target="_blank" rel="noopener noreferrer" class="shihab_pill_btn shihab_pill_btn--live shihab_pill_btn--sm shihab_rip_btn">${shihab_svgExternal(14)}<span>Live</span><span class="shihab_rip" aria-hidden="true"></span></a>`
                      : ''
                  }
                </div>
              </div>
            </article>
          `;
        })
        .join('');

      shihab_bindTilt(gridEl.querySelectorAll('.shihab_project_card'), 5, 7);
      gridEl.querySelectorAll('.shihab_rip_btn').forEach((b) => b.addEventListener('pointerdown', shihab_triggerRipple));
      gridEl.querySelectorAll('[data-open-proj]').forEach((trigger) => {
        trigger.addEventListener('click', (e) => {
          const id = trigger.getAttribute('data-open-proj');
          const found = projects.find((p) => p.id === id);
          if (found) openModal(found, e);
        });
      });
    }

    renderGrid();

    barEl.querySelectorAll('[data-proj-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nextCat = btn.getAttribute('data-proj-tab') || 'all';
        if (nextCat === currentCat) return;
        currentCat = nextCat;
        barEl.querySelectorAll('[data-proj-tab]').forEach((b) => {
          const active = b.getAttribute('data-proj-tab') === currentCat;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-pressed', String(active));
        });
        syncPill();
        renderGrid();
      });
    });
  }

  /* ------------------------------------------------------------------------
     10. Section 7: Live Web Tools Grid & Live Iframe Sandbox Modal
     ------------------------------------------------------------------------ */
  function shihab_initTools() {
    const barEl = document.getElementById('shihab_tools_pf_bar');
    const gridEl = document.getElementById('shihab_tools_grid');
    const modalRoot = document.getElementById('shihab_tool_modal_root');
    if (!barEl || !gridEl || !modalRoot) return;

    const tools = shihab_data.tools;
    const tabs = shihab_data.toolTabs;
    let currentCat = 'all';
    let activeTool = null;
    let lastTriggerEl = null;
    let unbindTrap = null;
    let unbindIframeEsc = null;

    const countFor = (k) => (k === 'all' ? tools.length : tools.filter((t) => t.category === k).length);

    barEl.innerHTML = tabs
      .map(
        (t) => `
          <button type="button" data-tool-tab="${shihab_esc(t.key)}" class="shihab_filter_tab${t.key === 'all' ? ' is-active' : ''}" aria-pressed="${t.key === 'all'}">
            <span>${shihab_esc(t.label)}</span>
            <span class="shihab_pf_count">${countFor(t.key)}</span>
          </button>`
      )
      .join('');

    const syncPill = shihab_setupFilterPill(barEl);

    function openPreview(tool, triggerEl) {
      if (unbindTrap) {
        unbindTrap();
        unbindTrap = null;
      }
      if (unbindIframeEsc) {
        unbindIframeEsc();
        unbindIframeEsc = null;
      }
      activeTool = tool;
      lastTriggerEl = triggerEl || document.activeElement;
      document.body.style.overflow = 'hidden';
      shihab_setBackgroundInert(true);

      modalRoot.innerHTML = `
        <div id="shihab_tool_backdrop" class="shihab_modal_backdrop">
          <div id="shihab_tool_panel" class="shihab_tool_modal_panel" role="dialog" aria-modal="true" aria-labelledby="shihab_tool_modal_heading">
            <div class="shihab_tool_modal_head">
              <div class="shihab_tool_modal_title_wrap">
                <span class="shihab_tool_modal_dot" style="background:${shihab_esc(tool.accent)}" aria-hidden="true"></span>
                <span id="shihab_tool_modal_heading" class="shihab_tool_modal_title">${shihab_esc(tool.title)}</span>
              </div>
              <div class="shihab_tool_modal_controls">
                <a href="${shihab_esc(tool.url)}" target="_blank" rel="noopener noreferrer" class="shihab_pill_btn shihab_pill_btn--primary shihab_pill_btn--sm">
                  ${shihab_svgExternal(13)}<span>Open Full Tab</span>
                </a>
                <button type="button" id="shihab_tool_close" class="shihab_pm_iconbtn shihab_pm_iconbtn--close" aria-label="Close tool preview">
                  ${shihab_svgClose(16)}
                </button>
              </div>
            </div>
            <iframe id="shihab_tool_iframe" src="${shihab_esc(tool.url)}" title="${shihab_esc(tool.title)}" class="shihab_tool_iframe"></iframe>
          </div>
        </div>
      `;

      const backdrop = document.getElementById('shihab_tool_backdrop');
      const panel = document.getElementById('shihab_tool_panel');
      const closeBtn = document.getElementById('shihab_tool_close');
      const iframe = document.getElementById('shihab_tool_iframe');

      backdrop.addEventListener('click', closePreview);
      panel.addEventListener('click', (e) => e.stopPropagation());
      closeBtn.addEventListener('click', closePreview);
      closeBtn.focus();

      if (iframe) {
        const onIframeLoad = () => {
          if (unbindIframeEsc) {
            unbindIframeEsc();
            unbindIframeEsc = null;
          }
          try {
            const win = iframe.contentWindow;
            if (!win) return;
            const onIframeKey = (ev) => {
              if (ev.key === 'Escape') {
                ev.preventDefault();
                closePreview();
              }
            };
            win.addEventListener('keydown', onIframeKey);
            unbindIframeEsc = () => {
              try {
                win.removeEventListener('keydown', onIframeKey);
              } catch (err) {
                /* cross-origin or detached */
              }
            };
          } catch (err) {
            /* ignore cross-origin iframe restriction */
          }
        };
        iframe.addEventListener('load', onIframeLoad);
      }

      unbindTrap = shihab_bindFocusTrap(panel, closePreview);
    }

    function closePreview() {
      if (!activeTool) return;
      if (unbindTrap) {
        unbindTrap();
        unbindTrap = null;
      }
      if (unbindIframeEsc) {
        unbindIframeEsc();
        unbindIframeEsc = null;
      }
      activeTool = null;
      modalRoot.innerHTML = '';
      document.body.style.overflow = '';
      shihab_setBackgroundInert(false);
      if (lastTriggerEl && typeof lastTriggerEl.focus === 'function') {
        lastTriggerEl.focus();
      }
    }

    function renderCards() {
      const list = currentCat === 'all' ? tools : tools.filter((t) => t.category === currentCat);
      gridEl.innerHTML = list
        .map(
          (tool, idx) => `
            <article class="shihab_card shihab_pub_card" style="--tc:${shihab_esc(tool.accent)};">
              <div class="shihab_pub_top">
                <div class="shihab_pub_idx">${shihab_pad2(idx + 1)}</div>
                <span class="shihab_pub_cat">${shihab_esc(tool.categoryLabel)}</span>
              </div>
              <h3 class="shihab_pub_title">${shihab_esc(tool.title)}</h3>
              <div class="shihab_pub_sub">${shihab_esc(tool.subtitle)}</div>
              <p class="shihab_pub_desc">${shihab_esc(tool.desc)}</p>
              <div class="shihab_pub_tags">
                ${tool.tags.map((tg) => `<span class="shihab_tech_badge">${shihab_esc(tg)}</span>`).join('')}
              </div>
              <div class="shihab_pub_actions">
                <button type="button" data-preview-tool="${shihab_esc(tool.id)}" class="shihab_pill_btn shihab_pill_btn--outline shihab_pill_btn--sm">
                  Quick Preview
                </button>
                <a href="${shihab_esc(tool.url)}" target="_blank" rel="noopener noreferrer" class="shihab_pill_btn shihab_pill_btn--primary shihab_pill_btn--sm">
                  <span>Launch Live Tool</span>${shihab_svgExternal(13)}
                </a>
              </div>
            </article>
          `
        )
        .join('');

      if (!shihab_prefersReduced()) {
        gridEl.querySelectorAll('.shihab_pub_card').forEach((card) => {
          let cardRaf = 0;
          let cx = 0;
          let cy = 0;
          const applyGlow = () => {
            cardRaf = 0;
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${cx - r.left}px`);
            card.style.setProperty('--my', `${cy - r.top}px`);
          };
          card.addEventListener('pointermove', (e) => {
            if (e.pointerType !== 'mouse') return;
            cx = e.clientX;
            cy = e.clientY;
            if (!cardRaf) cardRaf = requestAnimationFrame(applyGlow);
          });
        });
      }

      gridEl.querySelectorAll('[data-preview-tool]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-preview-tool');
          const tool = tools.find((t) => t.id === id);
          if (tool) openPreview(tool, btn);
        });
      });
    }

    renderCards();

    barEl.querySelectorAll('[data-tool-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nextCat = btn.getAttribute('data-tool-tab') || 'all';
        if (nextCat === currentCat) return;
        currentCat = nextCat;
        barEl.querySelectorAll('[data-tool-tab]').forEach((b) => {
          const active = b.getAttribute('data-tool-tab') === currentCat;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-pressed', String(active));
        });
        syncPill();
        renderCards();
      });
    });
  }

  /* ------------------------------------------------------------------------
     11. Section 8: Certifications Tilt
     ------------------------------------------------------------------------ */
  function shihab_initCertifications() {
    const sec = document.getElementById('certifications');
    if (!sec) return;
    shihab_bindTilt(sec.querySelectorAll('.shihab_cert_card'), 6, 7);
  }

  /* ------------------------------------------------------------------------
     12. Section 9: Contact Form Validation, Confetti & Mailto Dispatch
     ------------------------------------------------------------------------ */
  function shihab_initContact() {
    const form = document.getElementById('shihab_contact_form');
    if (!form) return;

    const honey = document.getElementById('shihab_cf_honey');
    const nameIn = document.getElementById('shihab_cf_name');
    const emailIn = document.getElementById('shihab_cf_email');
    const subjIn = document.getElementById('shihab_cf_subject');
    const msgIn = document.getElementById('shihab_cf_msg');

    const fName = document.getElementById('shihab_cf_field_name');
    const fEmail = document.getElementById('shihab_cf_field_email');
    const fSubj = document.getElementById('shihab_cf_field_subject');
    const fMsg = document.getElementById('shihab_cf_field_msg');

    const progEl = document.getElementById('shihab_cf_progress');
    const readyEl = document.getElementById('shihab_cf_ready_count');
    const charEl = document.getElementById('shihab_cf_char_count');
    const submitBtn = document.getElementById('shihab_cf_submit');
    const burstSlot = document.getElementById('shihab_cf_burst_slot');
    const alertSlot = document.getElementById('shihab_cf_alert_slot');

    const confettiColors = ['#3B82F6', '#A855F7', '#10B981', '#F59E0B', '#EC4899', '#0EA5E9'];
    let triedSubmit = false;
    let status = 'idle';

    function validate() {
      const nameVal = (nameIn.value || '').trim();
      const emailVal = (emailIn.value || '').trim();
      const subjVal = (subjIn.value || '').trim();
      const msgVal = (msgIn.value || '').trim();

      const validName = nameVal.length >= 2;
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
      const validMsg = msgVal.length >= 10;
      const readyCount = [validName, validEmail, validMsg].filter(Boolean).length;

      return { nameVal, emailVal, subjVal, msgVal, validName, validEmail, validMsg, readyCount };
    }

    function showAlert(kind, text) {
      if (!alertSlot) return;
      alertSlot.innerHTML = '';
      if (!kind) return;
      const box = document.createElement('div');
      box.className = `shihab_cf_alert ${kind === 'ok' ? 'shihab_cf_alert--ok' : 'shihab_cf_alert--warn'}`;
      box.setAttribute('role', 'status');
      box.textContent = text;
      alertSlot.appendChild(box);
    }

    function syncUI() {
      const v = validate();
      if (progEl) progEl.style.setProperty('--p', String(v.readyCount / 3));
      if (readyEl) readyEl.textContent = String(v.readyCount);

      if (fName) {
        const bad = triedSubmit && !v.validName;
        fName.classList.toggle('is-ok', v.validName);
        fName.classList.toggle('is-invalid', bad);
        if (nameIn) nameIn.setAttribute('aria-invalid', String(bad));
      }
      if (fEmail) {
        const bad = triedSubmit && !v.validEmail;
        fEmail.classList.toggle('is-ok', v.validEmail);
        fEmail.classList.toggle('is-invalid', bad);
        if (emailIn) emailIn.setAttribute('aria-invalid', String(bad));
      }
      if (fSubj) {
        fSubj.classList.toggle('is-ok', v.subjVal.length > 0);
      }
      if (fMsg) {
        const bad = triedSubmit && !v.validMsg;
        fMsg.classList.toggle('is-ok', v.validMsg);
        fMsg.classList.toggle('is-invalid', bad);
        if (msgIn) msgIn.setAttribute('aria-invalid', String(bad));
      }
      if (charEl) {
        charEl.classList.toggle('is-ok', v.validMsg);
        charEl.textContent = `${v.msgVal.length} chars${v.validMsg ? ' · ready' : ' · add a few more words'}`;
      }
    }

    function spawnBurst() {
      if (!burstSlot || shihab_prefersReduced()) return;
      const parts = Array.from({ length: 16 }, (_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const dist = 64 + ((i * 23) % 60);
        const x = `${(Math.cos(angle) * dist).toFixed(1)}px`;
        const y = `${(Math.sin(angle) * dist - 22).toFixed(1)}px`;
        const r = `${(i * 47) % 360}deg`;
        const c = confettiColors[i % confettiColors.length];
        return `<i style="--x:${x};--y:${y};--r:${r};--c:${c};"></i>`;
      }).join('');
      burstSlot.innerHTML = `<span class="shihab_cf_burst" aria-hidden="true">${parts}</span>`;
      window.setTimeout(() => {
        burstSlot.innerHTML = '';
      }, 1100);
    }

    [nameIn, emailIn, subjIn, msgIn].forEach((input) => {
      if (!input) return;
      input.addEventListener('input', () => {
        if (status === 'error' || status === 'sent') {
          status = 'idle';
          showAlert(null, '');
        }
        syncUI();
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (honey && honey.value.trim().length > 0) return;

      triedSubmit = true;
      const v = validate();
      syncUI();

      if (!v.validName || !v.validEmail || !v.validMsg) {
        status = 'error';
        if (!v.validEmail && v.emailVal.length > 0) {
          showAlert('warn', 'Please enter a valid email address so Mehedi can reply to you.');
        } else {
          showAlert('warn', 'Please complete your name (2+ chars), a valid email, and a message (10+ characters).');
        }
        if (!v.validName && nameIn) nameIn.focus();
        else if (!v.validEmail && emailIn) emailIn.focus();
        else if (!v.validMsg && msgIn) msgIn.focus();
        return;
      }

      const subject = encodeURIComponent(v.subjVal || `Portfolio Inquiry from ${v.nameVal}`);
      const body = encodeURIComponent(`Name: ${v.nameVal}\nEmail: ${v.emailVal}\n\nMessage:\n${v.msgVal}`);

      status = 'sent';
      if (submitBtn) submitBtn.disabled = true;
      showAlert('ok', 'Opening email draft for sshihabb007@gmail.com — thank you for reaching out!');
      spawnBurst();

      window.setTimeout(() => {
        window.location.href = `mailto:sshihabb007@gmail.com?subject=${subject}&body=${body}`;
        triedSubmit = false;
        form.reset();
        syncUI();
        if (submitBtn) submitBtn.disabled = false;
      }, 320);
    });

    syncUI();
  }

  /* ------------------------------------------------------------------------
     Boot All Sections
     ------------------------------------------------------------------------ */
  function shihab_bootHomepage() {
    shihab_initReveals();
    shihab_initHero();
    shihab_initEducation();
    shihab_initSkills();
    shihab_initServices();
    shihab_initExperience();
    shihab_initProjects();
    shihab_initTools();
    shihab_initCertifications();
    shihab_initContact();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', shihab_bootHomepage);
  } else {
    shihab_bootHomepage();
  }
})();

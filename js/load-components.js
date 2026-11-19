// js/load-components.js

async function loadSiteComponents() {
    const headerPlaceholder = document.getElementById('site-header');
    const footerPlaceholder = document.getElementById('site-footer');

    // Default basePath logic based on path depth
    const shihab_rawPath = window.location.pathname.toLowerCase();
    const shihab_normPath = shihab_rawPath.replace(/\/index\.html$/, '/');
    const shihab_toolDirs = [
        'tools',
        'compressor',
        'audio-to-text',
        'tax-calculator',
        'power-calculator',
        'age-calculator',
        'bmi-calculator',
        'universal-downloader',
        'advanced-calculator',
        'currency-converter',
        'land-calculator',
        'qr-generator'
    ];
    const shihab_matchesDir = (dir) =>
        shihab_normPath.includes(`/${dir}/`) || shihab_normPath.endsWith(`/${dir}`);

    let basePath = './';
    if (headerPlaceholder && headerPlaceholder.getAttribute('data-basepath')) {
        basePath = headerPlaceholder.getAttribute('data-basepath');
    } else if (shihab_normPath.includes('/front/') || shihab_toolDirs.some(shihab_matchesDir)) {
        basePath = '../';
    }

    try {
        const cacheBuster = '?v=2.8';
        if (headerPlaceholder) {
            const res = await fetch(basePath + 'components/header.html' + cacheBuster);
            if (res.ok) {
                let html = await res.text();
                html = html.replace(/\{\{basePath\}\}/g, basePath);
                headerPlaceholder.outerHTML = html;
            }
        }
        if (footerPlaceholder) {
            const res = await fetch(basePath + 'components/footer.html' + cacheBuster);
            if (res.ok) {
                let html = await res.text();
                html = html.replace(/\{\{basePath\}\}/g, basePath);
                footerPlaceholder.outerHTML = html;
            }
        }
    } catch (e) {
        console.error('Failed to load site components', e);
    }

    // Remove any duplicate color switcher / back-to-top elements that were hardcoded on old pages
    // BEFORE initializing theme & back-to-top listeners so listeners attach to the surviving elements.
    const allPalettes = document.querySelectorAll('.color-switcher-container');
    if (allPalettes.length > 1) {
        for (let i = 1; i < allPalettes.length; i++) {
            allPalettes[i].remove();
        }
    }
    const allBackTops = document.querySelectorAll('#back-to-top');
    if (allBackTops.length > 1) {
        for (let i = 1; i < allBackTops.length; i++) {
            allBackTops[i].remove();
        }
    }

    // Re-initialize theme toggle, color palette, and back-to-top after header is inserted into the DOM
    if (typeof window.mehedi_initTheme === 'function') {
        window.mehedi_initTheme();
    } else if (typeof mehedi_initTheme === 'function') {
        mehedi_initTheme();
    }

    // Highlight active navigation link based on normalized path
    const shihab_isToolsRoute = shihab_toolDirs.some(shihab_matchesDir);
    const shihab_isToolsHub = shihab_matchesDir('tools');
    let shihab_homeResolvedPath = '/';
    try {
        shihab_homeResolvedPath = new URL(basePath, window.location.href).pathname.toLowerCase().replace(/\/index\.html$/, '/');
    } catch (e) {
        shihab_homeResolvedPath = '/';
    }

    if (shihab_isToolsRoute) {
        const shihab_toolsLink = document.querySelector('.shihab_nav_tools_link');
        if (shihab_toolsLink) {
            shihab_toolsLink.classList.add('active');
            if (shihab_isToolsHub) {
                shihab_toolsLink.setAttribute('aria-current', 'page');
            }
        }
    } else if (shihab_normPath.includes('/front/projects')) {
        const shihab_projLink = document.querySelector('.nav-links a[href*="front/projects"]');
        if (shihab_projLink) {
            shihab_projLink.classList.add('active');
            shihab_projLink.setAttribute('aria-current', 'page');
        }
    } else if (shihab_normPath === shihab_homeResolvedPath) {
        const shihab_homeLink = document.querySelector('.nav-links > a:first-child');
        if (shihab_homeLink) {
            shihab_homeLink.classList.add('active');
            shihab_homeLink.setAttribute('aria-current', 'page');
        }
    }

    // Initialize nav dropdown toggle for touch, click, hover, and keyboard interaction
    const navDropdown = document.querySelector('.nav-dropdown');
    if (navDropdown) {
        const toggleBtn = navDropdown.querySelector('.nav-dropdown-toggle');
        const shihab_closeDropdown = (restoreFocus, dismissHover) => {
            const wasActive = navDropdown.classList.contains('active');
            navDropdown.classList.remove('active');
            if (dismissHover) {
                navDropdown.classList.add('shihab_dropdown_dismissed');
            } else {
                navDropdown.classList.remove('shihab_dropdown_dismissed');
            }
            if (toggleBtn) {
                toggleBtn.setAttribute('aria-expanded', 'false');
                if (restoreFocus && wasActive) toggleBtn.focus();
            }
        };
        navDropdown.addEventListener('mouseleave', () => {
            navDropdown.classList.remove('shihab_dropdown_dismissed');
        });
        navDropdown.addEventListener('focusout', (e) => {
            if (e.relatedTarget && !navDropdown.contains(e.relatedTarget)) {
                shihab_closeDropdown(false, false);
            }
        });
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const isCurrentlyOpen = navDropdown.classList.contains('active');
                if (isCurrentlyOpen) {
                    shihab_closeDropdown(false, navDropdown.matches(':hover'));
                } else {
                    navDropdown.classList.remove('shihab_dropdown_dismissed');
                    navDropdown.classList.add('active');
                    toggleBtn.setAttribute('aria-expanded', 'true');
                }
            });
        }
        document.addEventListener('click', (e) => {
            if (!navDropdown.contains(e.target)) {
                shihab_closeDropdown(false, false);
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const isOpenOrHovered =
                    navDropdown.classList.contains('active') || navDropdown.matches(':hover');
                if (isOpenOrHovered) {
                    shihab_closeDropdown(true, navDropdown.matches(':hover'));
                }
            }
        });
    }

    // PWA Install Popup Logic
    let deferredPrompt;
    
    function showInstallPopup() {
        if (document.getElementById('sshihabb007-pwa-popup')) return;
        
        const popup = document.createElement('div');
        popup.id = 'sshihabb007-pwa-popup';
        popup.style.cssText = `
            position: fixed;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--bg-card, #1f2937);
            border: 1px solid var(--border-color, #374151);
            color: var(--text-main, #f9fafb);
            padding: 6px 14px;
            border-radius: 50px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            gap: 8px;
            z-index: 9999;
            font-family: inherit;
            font-size: 0.75rem;
            cursor: pointer;
            transition: all 0.3s ease;
            animation: slideUpFade 0.5s ease-out;
        `;
        
        if (!document.getElementById('pwa-popup-style')) {
            const style = document.createElement('style');
            style.id = 'pwa-popup-style';
            style.innerHTML = `
                @keyframes slideUpFade {
                    from { opacity: 0; transform: translate(-50%, 20px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
                #sshihabb007-pwa-popup:hover {
                    transform: translateX(-50%) translateY(-2px);
                    box-shadow: 0 12px 30px rgba(0,0,0,0.6);
                    border-color: var(--primary-color, #6366f1);
                }
            `;
            document.head.appendChild(style);
        }
        
        popup.innerHTML = `
            <i class="fas fa-download" style="color: var(--primary-color, #6366f1); font-size: 0.85rem;"></i>
            <span style="font-weight: 700;">Install App</span>
            <button id="pwa-popup-close" aria-label="Close install prompt" style="background:none; border:none; color: var(--text-muted, #9ca3af); cursor: pointer; margin-left: 2px; font-size: 0.85rem; padding: 2px"><i class="fas fa-times"></i></button>
        `;
        
        document.body.appendChild(popup);
        
        popup.addEventListener('click', async (e) => {
            if(e.target.closest('#pwa-popup-close')) {
                popup.style.opacity = '0';
                setTimeout(() => popup.remove(), 300);
                return;
            }
            
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    popup.remove();
                }
                deferredPrompt = null;
            } else {
                alert("To install this app:\n\n- On iOS: Tap the Share button and select 'Add to Home Screen'\n- On Android/Chrome: Use the browser menu to 'Install App' or 'Add to Home screen'");
            }
        });
    }

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallPopup();
    });
    
    // Check iOS fallback
    const isIos = () => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /iphone|ipad|ipod/.test( userAgent );
    };
    const isStandalone = () => ('standalone' in window.navigator) && (window.navigator.standalone);
    
    if (isIos() && !isStandalone()) {
        setTimeout(showInstallPopup, 1000);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSiteComponents);
} else {
    loadSiteComponents();
}

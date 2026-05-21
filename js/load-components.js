// js/load-components.js

async function loadSiteComponents() {
    const headerPlaceholder = document.getElementById('site-header');
    const footerPlaceholder = document.getElementById('site-footer');

    // Default basePath logic based on path depth
    let basePath = './';
    if (headerPlaceholder && headerPlaceholder.getAttribute('data-basepath')) {
        basePath = headerPlaceholder.getAttribute('data-basepath');
    } else {
        const path = window.location.pathname;
        if (path.includes('/front/') || path.includes('/compressor/') || path.includes('/audio-to-text/') || path.includes('/tax-calculator/') || path.includes('/power-calculator/') || path.includes('/age-calculator/') || path.includes('/bmi-calculator/') || path.includes('/universal-downloader/')) {
            basePath = '../';
        }
    }

    try {
        const cacheBuster = '?v=' + new Date().getTime();
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
        console.error('Failed to load footer', e);
    }

    // Initialize the theme toggle for the newly loaded header
    const themeBtn = document.getElementById('sshihabb007-theme-toggle');
    if (themeBtn) {
        const currentTheme = localStorage.getItem('mehedi_theme');
        if (currentTheme === 'light') {
            const icon = themeBtn.querySelector('i');
            if (icon) icon.classList.replace('fa-moon', 'fa-sun');
        }
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            const icon = themeBtn.querySelector('i');
            if (icon) {
                if (isLight) {
                    icon.classList.replace('fa-moon', 'fa-sun');
                } else {
                    icon.classList.replace('fa-sun', 'fa-moon');
                }
            }
            localStorage.setItem('mehedi_theme', isLight ? 'light' : 'dark');
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
            <button id="pwa-popup-close" style="background:none; border:none; color: var(--text-muted, #9ca3af); cursor: pointer; margin-left: 2px; font-size: 0.85rem; padding: 2px"><i class="fas fa-times"></i></button>
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

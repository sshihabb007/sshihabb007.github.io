let mehedi_paletteOutsideClickBound = false;
let mehedi_scrollListenerBound = false;

window.mehedi_initTheme = function() {
    const shihab_themeBtns = [document.getElementById('sshihabb007-theme-toggle')].filter(Boolean);
    const sshihabb007_currentTheme = localStorage.getItem('mehedi_theme');
    const sshihabb007_currentColor = localStorage.getItem('mehedi_color');

    // Default is dark. If light mode is stored, apply it.
    if (sshihabb007_currentTheme === 'light') {
        document.body.classList.add('light-mode');
        shihab_themeBtns.forEach(btn => {
            const icon = btn.querySelector('i');
            if (icon) icon.classList.replace('fa-moon', 'fa-sun');
        });
    }

    shihab_themeBtns.forEach(btn => {
        if (btn.hasAttribute('data-theme-initialized')) return;
        btn.setAttribute('data-theme-initialized', 'true');
        btn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');

            shihab_themeBtns.forEach(b => {
                const icon = b.querySelector('i');
                if (icon) {
                    if (isLight) {
                        icon.classList.replace('fa-moon', 'fa-sun');
                    } else {
                        icon.classList.replace('fa-sun', 'fa-moon');
                    }
                }
            });

            localStorage.setItem('mehedi_theme', isLight ? 'light' : 'dark');
        });
    });

    // Color Switcher Logic
    const paletteToggle = document.getElementById('palette-toggle');
    const colorPalette = document.getElementById('color-palette');
    const colorBtns = document.querySelectorAll('.color-btn');

    if (paletteToggle && colorPalette && !paletteToggle.hasAttribute('data-palette-initialized')) {
        paletteToggle.setAttribute('data-palette-initialized', 'true');
        paletteToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (colorPalette.style.display === 'none' || colorPalette.style.display === '') {
                colorPalette.style.display = 'flex';
            } else {
                colorPalette.style.display = 'none';
            }
        });
    }

    if (!mehedi_paletteOutsideClickBound) {
        mehedi_paletteOutsideClickBound = true;
        document.addEventListener('click', (e) => {
            const activePalette = document.getElementById('color-palette');
            if (activePalette && !e.target.closest('.color-switcher-container')) {
                activePalette.style.display = 'none';
            }
        });
    }

    if (colorBtns.length > 0) {
        const applyColor = (colorHex) => {
            if (!colorHex || colorHex === 'default') {
                document.body.style.removeProperty('--primary-color');
                document.body.style.removeProperty('--text-main');
                document.body.style.removeProperty('--cursor-color');
            } else {
                document.body.style.setProperty('--primary-color', colorHex);
                document.body.style.setProperty('--text-main', colorHex);
                document.body.style.setProperty('--cursor-color', colorHex);
            }
            localStorage.setItem('mehedi_color', colorHex || 'default');

            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            const activeBtn = Array.from(document.querySelectorAll('.color-btn')).find(b => b.getAttribute('data-color') === (colorHex || 'default'));
            if (activeBtn) activeBtn.classList.add('active');
        };

        if (sshihabb007_currentColor) {
            applyColor(sshihabb007_currentColor);
        }

        colorBtns.forEach(btn => {
            if (btn.hasAttribute('data-color-initialized')) return;
            btn.setAttribute('data-color-initialized', 'true');
            btn.addEventListener('click', () => {
                applyColor(btn.getAttribute('data-color'));
            });
        });
    }

    // Back to Top Logic (supports async header injection)
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn && !backToTopBtn.hasAttribute('data-backtotop-initialized')) {
        backToTopBtn.setAttribute('data-backtotop-initialized', 'true');
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        }
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    if (!mehedi_scrollListenerBound) {
        mehedi_scrollListenerBound = true;
        window.addEventListener('scroll', () => {
            const btn = document.getElementById('back-to-top');
            if (!btn) return;
            if (window.scrollY > 300) {
                btn.classList.add('show');
            } else {
                btn.classList.remove('show');
            }
        }, { passive: true });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.mehedi_initTheme === 'function') {
        window.mehedi_initTheme();
    }

    // Custom Cursor Logic
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");

    if (cursorDot && cursorOutline) {
        window.addEventListener("mousemove", function (e) {
            const posX = e.clientX;
            const posY = e.clientY;

            // Move the dot instantly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Move the outline (the CSS transition handles the lag)
            cursorOutline.style.left = `${posX}px`;
            cursorOutline.style.top = `${posY}px`;

            // Add scaling effect when hovering over links
            const targets = e.target.closest('a, button, .pill, .project-row, .data-row');
            if (targets) {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorOutline.style.backgroundColor = 'rgba(128, 128, 128, 0.2)';
                cursorDot.style.opacity = '0';
            } else {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.backgroundColor = 'transparent';
                cursorDot.style.opacity = '1';
            }
        });
    }
});

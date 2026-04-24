const mehedi_initTheme = () => {
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

    if (paletteToggle && colorPalette) {
        paletteToggle.addEventListener('click', () => {
            if (colorPalette.style.display === 'none' || colorPalette.style.display === '') {
                colorPalette.style.display = 'flex';
            } else {
                colorPalette.style.display = 'none';
            }
        });

        // Close palette when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.color-switcher-container')) {
                colorPalette.style.display = 'none';
            }
        });
    }

    if (colorBtns.length > 0) {
        const applyColor = (colorHex) => {
            if (colorHex === 'default') {
                document.body.style.removeProperty('--primary-color');
                document.body.style.removeProperty('--text-main');
                document.body.style.removeProperty('--cursor-color');
            } else {
                document.body.style.setProperty('--primary-color', colorHex);
                document.body.style.setProperty('--text-main', colorHex);
                document.body.style.setProperty('--cursor-color', colorHex);
            }
            localStorage.setItem('mehedi_color', colorHex);
            
            colorBtns.forEach(b => b.classList.remove('active'));
            const activeBtn = Array.from(colorBtns).find(b => b.getAttribute('data-color') === colorHex);
            if (activeBtn) activeBtn.classList.add('active');
        };

        if (sshihabb007_currentColor) {
            applyColor(sshihabb007_currentColor);
        }

        colorBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                applyColor(btn.getAttribute('data-color'));
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    mehedi_initTheme();

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

    // Back to Top Logic
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

const mehedi_initTheme = () => {
    const shihab_themeBtn = document.getElementById('sshihabb007-theme-toggle');
    if (!shihab_themeBtn) return;
    
    const mehedi_themeIcon = shihab_themeBtn.querySelector('i');
    const sshihabb007_currentTheme = localStorage.getItem('mehedi_theme');
    
    // Default is dark. If light mode is stored, apply it.
    if (sshihabb007_currentTheme === 'light') {
        document.body.classList.add('light-mode');
        mehedi_themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    shihab_themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        
        if (document.body.classList.contains('light-mode')) {
            localStorage.setItem('mehedi_theme', 'light');
            mehedi_themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            localStorage.setItem('mehedi_theme', 'dark');
            mehedi_themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    });
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
                cursorOutline.style.backgroundColor = 'rgba(0, 89, 156, 0.1)';
                cursorDot.style.opacity = '0';
            } else {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.backgroundColor = 'transparent';
                cursorDot.style.opacity = '1';
            }
        });
    }
});

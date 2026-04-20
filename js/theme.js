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

document.addEventListener('DOMContentLoaded', mehedi_initTheme);

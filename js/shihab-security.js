// Security and Anti-Copy Script by Mehedi Hasan Shihab (sshihabb007)
document.addEventListener('DOMContentLoaded', () => {
    const mehedi_security_warning = "%c Stop! This site is protected and belongs to Mehedi Hasan Shihab (sshihabb007). Unauthorized copying is prohibited.";
    const shihab_console_style = "color: red; font-size: 24px; font-weight: bold; background: #070B14; padding: 10px; border: 2px solid red;";
    console.log(mehedi_security_warning, shihab_console_style);

    // Disable Right Click
    document.addEventListener('contextmenu', (mehedi_event) => {
        mehedi_event.preventDefault();
        console.warn("Right-click is disabled on sshihabb007's portfolio.");
    });

    // Disable common dev tools shortcuts
    document.addEventListener('keydown', (shihab_event) => {
        // F12
        if (shihab_event.key === 'F12') {
            shihab_event.preventDefault();
        }
        // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        if (shihab_event.ctrlKey && (shihab_event.key === 'u' || shihab_event.key === 'U' || 
            (shihab_event.shiftKey && (shihab_event.key === 'i' || shihab_event.key === 'I' || shihab_event.key === 'j' || shihab_event.key === 'J')))) {
            shihab_event.preventDefault();
            console.warn("Developer tools access is restricted by Mehedi.");
        }
    });

    // Append watermark on copy
    document.addEventListener('copy', (sshihabb007_event) => {
        const mehedi_selection = document.getSelection();
        const shihab_watermark = "\n\n--- \nCopied from the portfolio of Mehedi Hasan Shihab \nGitHub: https://github.com/sshihabb007";
        
        if(mehedi_selection !== null && mehedi_selection.toString().length > 0) {
            sshihabb007_event.clipboardData.setData('text/plain', mehedi_selection.toString() + shihab_watermark);
            sshihabb007_event.preventDefault();
        }
    });
});

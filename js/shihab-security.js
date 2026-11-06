// Security and Anti-Copy Script by Mehedi Hasan Shihab (sshihabb007)

// ==========================================
// CONFIGURATION
// Change to 'false' to easily enable right-click and inspect element for development
const ENABLE_SECURITY_PROTECTION = false;
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    const mehedi_security_warning = "%c Stop! This site is protected and belongs to Mehedi Hasan Shihab (sshihabb007). Unauthorized copying is prohibited.";
    const shihab_console_style = "color: red; font-size: 24px; font-weight: bold; background: #070B14; padding: 10px; border: 2px solid red;";
    console.log(mehedi_security_warning, shihab_console_style);

    if (ENABLE_SECURITY_PROTECTION) {
        // Disable Right Click (Except for input/textarea to allow paste)
        document.addEventListener('contextmenu', (mehedi_event) => {
            const tag = mehedi_event.target.tagName.toLowerCase();
            if (tag === 'input' || tag === 'textarea' || tag === 'select') {
                return; // Allow context menu for copy/paste in form fields
            }
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
    }

    // Copy feature is fully enabled to allow copy/paste functionality without watermarks

});

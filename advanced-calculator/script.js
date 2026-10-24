/**
 * Advanced Scientific Calculator Logic
 * Developer: Mehedi Hasan Shihab
 */

// Initialize MathQuill
const MQ = MathQuill.getInterface(2);

// Global Scope Variables
let Shihab_mathField;
let sshihabb007_isExactFormat = false;
let Mehedi_isRadians = true;

class AetherCalc {
    constructor() {
        this.history = [];
        this.variables = { x: 0, y: 0, Ans: 0, ans: 0 };
        this.precision = 64;
        
        // Math.js configuration
        math.config({
            number: 'BigNumber',
            precision: this.precision
        });

        // Constants
        this.constants = {
            'c': { val: 299792458, name: 'Speed of Light', unit: 'm/s' },
            'G': { val: 6.67430e-11, name: 'Gravitational Const', unit: 'm³/kg·s²' },
            'h': { val: 6.62607015e-34, name: 'Planck Const', unit: 'J·s' },
            'e_charge': { val: 1.602176634e-19, name: 'Elementary Charge', unit: 'C' },
            'm_e': { val: 9.1093837015e-31, name: 'Electron Mass', unit: 'kg' },
            'N_A': { val: 6.02214076e23, name: 'Avogadro Const', unit: 'mol⁻¹' },
            'k_B': { val: 1.380649e-23, name: 'Boltzmann Const', unit: 'J/K' },
            'R': { val: 8.314462618, name: 'Gas Const', unit: 'J/(mol·K)' },
        };
    }

    latexToMathJS(rawText) {
        let expr = rawText;
        // Basic replacements for Math.js compatibility
        expr = expr.replace(/\\cdot/g, '*');
        expr = expr.replace(/\\times/g, '*');
        expr = expr.replace(/\\div/g, '/');
        expr = expr.replace(/\\pi/g, 'pi ');
        expr = expr.replace(/\\left/g, '');
        expr = expr.replace(/\\right/g, '');
        expr = expr.replace(/\\operatorname\{([^}]*)\}\s*\*?/g, '$1');

        // Convert MathQuill BuiltInOpNames exported by .text() like \s*i*n *( -> sin(
        expr = expr.replace(/\\([a-zA-Z](?:\*[a-zA-Z])*)\s*\*?/g, (_, chars) => chars.replace(/\*/g, ''));

        // Collapse multi-letter function/variable names that MathQuill .text() splits with '*'
        const knownWords = [
            'integrate', 'derive', 'arcsin', 'arccos', 'arctan',
            'solve', 'diff', 'sqrt', 'asin', 'acos', 'atan',
            'sinh', 'cosh', 'tanh', 'sec', 'csc', 'cot',
            'sin', 'cos', 'tan', 'log', 'ln', 'exp', 'abs',
            'Ans', 'ans'
        ];
        for (const word of knownWords) {
            const starred = word.split('').join('\\*');
            if (word !== 'Ans' && word !== 'ans') {
                const fnRegex = new RegExp(starred + '\\s*\\*?\\s*(?=\\()', 'g');
                expr = expr.replace(fnRegex, word);
            } else {
                const varRegex = new RegExp(starred, 'g');
                expr = expr.replace(varRegex, word);
            }
        }

        expr = expr.replace(/\barcsin\b/g, 'asin')
                   .replace(/\barccos\b/g, 'acos')
                   .replace(/\barctan\b/g, 'atan');
        expr = expr.replace(/\bpi\s+(?=[0-9a-zA-Z(])/g, 'pi*');

        // Auto-close any unclosed parentheses for seamless live evaluation
        const openParens = (expr.match(/\(/g) || []).length;
        const closeParens = (expr.match(/\)/g) || []).length;
        if (openParens > closeParens) {
            expr += ')'.repeat(openParens - closeParens);
        }

        return expr.trim();
    }

    evaluate(exprStr) {
        try {
            let expr = this.latexToMathJS(exprStr);

            // Check if it's a symbolic Nerdamer calculus/algebra command
            if (
                expr.startsWith('derive(') ||
                expr.startsWith('diff(') ||
                expr.startsWith('integrate(') ||
                expr.startsWith('solve(') ||
                /\b(?:derive|diff|integrate|solve)\s*\(/.test(expr)
            ) {
                // Nerdamer uses diff(...) for differentiation, not derive(...)
                const nerdamerExpr = expr.replace(/\bderive\s*\(/g, 'diff(');
                let res = nerdamer(nerdamerExpr).evaluate();
                let ans = sshihabb007_isExactFormat ? res.text('fractions') : res.text('decimals');
                const numParsed = Number(ans);
                if (!Number.isNaN(numParsed) && Number.isFinite(numParsed)) {
                    this.variables.Ans = numParsed;
                    this.variables.ans = numParsed;
                }
                return ans;
            }

            // Build evaluation scope with Ans/ans, ln/log, and RAD/DEG trigonometric functions
            const snapZero = (v) => {
                try {
                    return math.smaller(math.abs(v), math.bignumber('1e-50')) ? math.bignumber(0) : v;
                } catch (_) {
                    return v;
                }
            };
            const degToRad = (x) => math.divide(math.multiply(math.bignumber(x), math.pi), math.bignumber(180));
            const radToDeg = (x) => math.divide(math.multiply(math.bignumber(x), math.bignumber(180)), math.pi);

            const evalScope = {
                ...this.variables,
                ans: this.variables.Ans,
                Ans: this.variables.Ans,
                ln: (x) => math.log(x),
                log: (x, base) => base !== undefined ? math.log(x, base) : math.log10(x),
                sin: (x) => snapZero(Mehedi_isRadians ? math.sin(x) : math.sin(degToRad(x))),
                cos: (x) => snapZero(Mehedi_isRadians ? math.cos(x) : math.cos(degToRad(x))),
                tan: (x) => snapZero(Mehedi_isRadians ? math.tan(x) : math.tan(degToRad(x))),
                sec: (x) => Mehedi_isRadians ? math.sec(x) : math.sec(degToRad(x)),
                csc: (x) => Mehedi_isRadians ? math.csc(x) : math.csc(degToRad(x)),
                cot: (x) => snapZero(Mehedi_isRadians ? math.cot(x) : math.cot(degToRad(x))),
                asin: (x) => Mehedi_isRadians ? math.asin(x) : radToDeg(math.asin(x)),
                acos: (x) => Mehedi_isRadians ? math.acos(x) : radToDeg(math.acos(x)),
                atan: (x) => Mehedi_isRadians ? math.atan(x) : radToDeg(math.atan(x))
            };

            // Evaluate with Math.js
            let result = math.evaluate(expr, evalScope);
            this.variables.Ans = result;
            this.variables.ans = result;

            // Format result (Exact Fraction vs Decimal)
            if (sshihabb007_isExactFormat) {
                try {
                    const numVal = typeof result === 'number' ? result : math.number(result);
                    if (typeof numVal === 'number' && Number.isFinite(numVal) && !Number.isInteger(numVal)) {
                        const frac = math.fraction(numVal);
                        if (Number(frac.d) !== 1) {
                            return math.format(frac, { fraction: 'ratio' });
                        }
                    }
                } catch (_) {
                    // Fallback to standard formatting if fraction conversion is not applicable
                }
            }

            let formatted = math.format(result, { precision: 14 });
            return formatted;
        } catch (e) {
            throw new Error("Invalid Expression");
        }
    }
}

const Mehedi_calcEngine = new AetherCalc();

const Shihab_liveResult = document.getElementById('shihab_liveResult');
const sshihabb007_errorBox = document.getElementById('sshihabb007_errorBox');

// API Hook for Agentic IDE
window.shihab_calculate = function(str) {
    try {
        return Mehedi_calcEngine.evaluate(str);
    } catch(e) {
        return "Error: " + e.message;
    }
};

document.addEventListener('DOMContentLoaded', () => {

    // 1. Initialize MathQuill Input
    const mathInputSpan = document.getElementById('mehedi_mathInput');
    Shihab_mathField = MQ.MathField(mathInputSpan, {
        spaceBehavesLikeTab: true,
        substituteTextarea: function() {
            const ta = document.createElement('textarea');
            ta.setAttribute('autocapitalize', 'off');
            ta.setAttribute('autocomplete', 'off');
            ta.setAttribute('autocorrect', 'off');
            ta.setAttribute('spellcheck', 'false');
            ta.setAttribute('inputmode', 'none'); // Disables virtual keyboard
            return ta;
        },
        handlers: {
            edit: function() {
                Shihab_updateLiveResult();
            },
            enter: function() {
                Shihab_commitCalculation();
            }
        }
    });

    // Fallback: Force inputmode="none" on the generated textarea just in case
    const mehedi_mqTextarea = mathInputSpan.querySelector('textarea');
    if (mehedi_mqTextarea) {
        mehedi_mqTextarea.setAttribute('inputmode', 'none');
    }

    // 3. Keypad Bindings
    document.querySelectorAll('.calc-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const cmd = e.currentTarget.getAttribute('data-cmd');
            if(!cmd) return;
            
            sshihabb007_handleKeypad(cmd);
        });
    });

    // 5. Format & Radian Toggles
    document.getElementById('shihab_formatBtn').addEventListener('click', (e) => {
        sshihabb007_isExactFormat = !sshihabb007_isExactFormat;
        e.currentTarget.textContent = sshihabb007_isExactFormat ? "EXACT (FRACTION)" : "DECIMAL";
        Shihab_updateLiveResult();
    });

    document.getElementById('shihab_degRadBtn').addEventListener('click', (e) => {
        Mehedi_isRadians = !Mehedi_isRadians;
        e.currentTarget.textContent = Mehedi_isRadians ? "RAD" : "DEG";
        Shihab_updateLiveResult();
    });

    // 6. Toggle Scientific Pad
    const shihab_toggleSciBtn = document.getElementById('shihab_toggleScientificBtn');
    const mehedi_sciPad = document.getElementById('mehedi_advancedMathPad');
    const shihab_sciIcon = document.getElementById('shihab_scientificIcon');

    if (shihab_toggleSciBtn && mehedi_sciPad) {
        shihab_toggleSciBtn.addEventListener('click', () => {
            if (mehedi_sciPad.classList.contains('hidden')) {
                mehedi_sciPad.classList.remove('hidden');
                mehedi_sciPad.classList.add('grid');
                shihab_sciIcon.classList.remove('fa-chevron-down');
                shihab_sciIcon.classList.add('fa-chevron-up');
                shihab_toggleSciBtn.classList.add('border-primary', 'text-primary');
            } else {
                mehedi_sciPad.classList.add('hidden');
                mehedi_sciPad.classList.remove('grid');
                shihab_sciIcon.classList.add('fa-chevron-down');
                shihab_sciIcon.classList.remove('fa-chevron-up');
                shihab_toggleSciBtn.classList.remove('border-primary', 'text-primary');
            }
        });
    }

    // 7. Global Keyboard Numpad & Math Expression Support
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey || e.altKey) return;

        const isMqFocused = document.activeElement && (document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT');
        
        // Map physical keys to calculator commands
        const key = e.key;
        let cmd = '';
        if (key >= '0' && key <= '9') cmd = key;
        else if (key === '.') cmd = '.';
        else if (key === '+') cmd = '+';
        else if (key === '-') cmd = '-';
        else if (key === '*') cmd = '*';
        else if (key === '/') cmd = '/';
        else if (key === '(') cmd = '(';
        else if (key === ')') cmd = ')';
        else if (key === '^') cmd = '^';
        else if (key === '%') cmd = '%';
        else if (key === '!') cmd = '!';
        else if (key === 'Enter' || key === '=') cmd = '=';
        else if (key === 'Backspace') cmd = 'backspace';
        else if (key === 'Escape') cmd = 'clear';
        else if (key.length === 1 && /[a-zA-Z]/.test(key)) {
            const letterBtn = document.querySelector(`.calc-btn[data-cmd="${key}"]`);
            if (letterBtn) {
                letterBtn.style.transform = 'scale(0.95)';
                letterBtn.style.backgroundColor = 'var(--primary-color)';
                letterBtn.style.color = '#fff';
                setTimeout(() => {
                    letterBtn.style.transform = '';
                    letterBtn.style.backgroundColor = '';
                    letterBtn.style.color = '';
                }, 150);
            }
            if (!isMqFocused) {
                e.preventDefault();
                Shihab_mathField.focus();
                Shihab_mathField.write(key);
            }
            return;
        }

        if (cmd) {
            const btn = document.querySelector(`.calc-btn[data-cmd="${cmd}"]`);
            if (btn) {
                // Animate the on-screen button
                btn.style.transform = 'scale(0.95)';
                btn.style.backgroundColor = 'var(--primary-color)';
                btn.style.color = '#fff';
                setTimeout(() => {
                    btn.style.transform = '';
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                }, 150);
            }
            
            // If the math input isn't focused, force focus and handle the key so it works globally
            if (!isMqFocused) {
                e.preventDefault();
                Shihab_mathField.focus();
                sshihabb007_handleKeypad(cmd);
            } else if (key === 'Escape') {
                // Escape clears field even if focused
                e.preventDefault();
                sshihabb007_handleKeypad('clear');
            }
        }
    }, true);

    // Focus field on load
    Shihab_mathField.focus();
});

// Keypad Handler
function sshihabb007_handleKeypad(cmd) {
    switch(cmd) {
        case 'clear':
            Shihab_mathField.latex('');
            break;
        case 'backspace':
            Shihab_mathField.keystroke('Backspace');
            break;
        case '=':
            Shihab_commitCalculation();
            break;
        case 'store': {
            const rawText = Shihab_mathField.text();
            if (rawText.trim()) {
                try {
                    Mehedi_calcEngine.evaluate(rawText);
                } catch (_) {
                    // Use existing Ans if expression is incomplete
                }
            }
            const storedVal = Mehedi_calcEngine.variables.Ans;
            Mehedi_calcEngine.variables.x = storedVal;
            Mehedi_calcEngine.variables.ans = storedVal;
            const storeBtn = document.querySelector('.calc-btn[data-cmd="store"]');
            if (storeBtn) {
                const origText = storeBtn.textContent;
                storeBtn.textContent = 'Stored (x)';
                storeBtn.style.color = 'var(--primary-color)';
                setTimeout(() => {
                    storeBtn.textContent = origText;
                    storeBtn.style.color = '';
                }, 1200);
            }
            break;
        }
        case 'ans':
            Shihab_mathField.write('Ans');
            break;
        case 'sin':
        case 'cos':
        case 'tan':
        case 'log':
        case 'ln':
            Shihab_mathField.cmd(cmd);
            Shihab_mathField.cmd('(');
            break;
        case 'sqrt':
            Shihab_mathField.cmd('\\sqrt');
            break;
        case '^':
            Shihab_mathField.cmd('^');
            break;
        case 'pi':
            Shihab_mathField.write('\\pi');
            break;
        case 'derive':
            Shihab_mathField.write('derive(');
            break;
        case 'integrate':
            Shihab_mathField.write('integrate(');
            break;
        default:
            Shihab_mathField.write(cmd);
            break;
    }
    Shihab_mathField.focus();
}

let Mehedi_lastValidResult = '0';

// Live Result Evaluation
function Shihab_updateLiveResult() {
    const rawText = Shihab_mathField.text();
    if (!rawText.trim()) {
        Shihab_liveResult.textContent = '0';
        sshihabb007_errorBox.style.opacity = '0';
        Mehedi_lastValidResult = '0';
        return;
    }

    try {
        let result = Mehedi_calcEngine.evaluate(rawText);
        Shihab_liveResult.textContent = "= " + result;
        Mehedi_lastValidResult = "= " + result;
        sshihabb007_errorBox.style.opacity = '0';
    } catch (e) {
        // Keep the total number always visible even if expression is temporarily invalid
        Shihab_liveResult.textContent = Mehedi_lastValidResult;
        sshihabb007_errorBox.style.opacity = '0';
    }
}

// Commit to History
function Shihab_commitCalculation() {
    const rawText = Shihab_mathField.text();
    if (!rawText.trim()) return;

    try {
        let result = Mehedi_calcEngine.evaluate(rawText);
        // Clear field for next input with the result
        Shihab_mathField.latex(result.toString());
    } catch (e) {
        // Just flash error box
        sshihabb007_errorBox.style.opacity = '1';
        setTimeout(() => sshihabb007_errorBox.style.opacity = '0', 2000);
    }
}

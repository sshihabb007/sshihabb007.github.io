// Currency Converter Pro Logic - By Mehedi Hasan Shihab (sshihabb007)

const sshihabb007_API_KEY = '33a012bbc92a1bbdd4b387b0';
const mehedi_amountInput = document.getElementById('mehedi_amount');
const shihab_fromSelect = document.getElementById('shihab_fromCurrency');
const shihab_toSelect = document.getElementById('shihab_toCurrency');
const mehedi_resultText = document.getElementById('mehedi_resultText');
const sshihabb007_rateText = document.getElementById('sshihabb007_rateText');
const mehedi_swapBtn = document.getElementById('mehedi_swapBtn');

let shihab_exchangeRates = {};

// 1. Fetch initial rates
async function mehedi_init() {
    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${sshihabb007_API_KEY}/latest/USD`);
        const data = await response.json();
        
        if (data.result === "success") {
            shihab_exchangeRates = data.conversion_rates;
            sshihabb007_populateDropdowns(Object.keys(shihab_exchangeRates));
            shihab_calculate(); // Run initial calculation
        } else {
            sshihabb007_rateText.innerText = "Error loading rates from API.";
        }
    } catch (error) {
        sshihabb007_rateText.innerText = "Error loading rates. Please try again.";
    }
}

// 2. Fill the select menus
function sshihabb007_populateDropdowns(codes) {
    // Top 10 most traded currencies to bring to top of list
    const topCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'HKD', 'NZD', 'BDT', 'INR'];
    
    // Sort array so top currencies appear first
    codes.sort((a, b) => {
        const aIsTop = topCurrencies.includes(a);
        const bIsTop = topCurrencies.includes(b);
        if (aIsTop && !bIsTop) return -1;
        if (!aIsTop && bIsTop) return 1;
        return a.localeCompare(b);
    });

    // Map of currency code -> primary country name for "Country - CODE" format
    const currencyCountryMap = {
        AED:'UAE', AFN:'Afghanistan', ALL:'Albania', AMD:'Armenia', ANG:'Netherlands Antilles',
        AOA:'Angola', ARS:'Argentina', AUD:'Australia', AWG:'Aruba', AZN:'Azerbaijan',
        BAM:'Bosnia & Herzegovina', BBD:'Barbados', BDT:'Bangladesh', BGN:'Bulgaria',
        BHD:'Bahrain', BIF:'Burundi', BMD:'Bermuda', BND:'Brunei', BOB:'Bolivia',
        BRL:'Brazil', BSD:'Bahamas', BTN:'Bhutan', BWP:'Botswana', BYN:'Belarus',
        BZD:'Belize', CAD:'Canada', CDF:'Congo', CHF:'Switzerland', CLP:'Chile',
        CNY:'China', COP:'Colombia', CRC:'Costa Rica', CUP:'Cuba', CVE:'Cape Verde',
        CZK:'Czech Republic', DJF:'Djibouti', DKK:'Denmark', DOP:'Dominican Republic',
        DZD:'Algeria', EGP:'Egypt', ERN:'Eritrea', ETB:'Ethiopia', EUR:'Eurozone',
        FJD:'Fiji', FKP:'Falkland Islands', FOK:'Faroe Islands', GBP:'United Kingdom',
        GEL:'Georgia', GGP:'Guernsey', GHS:'Ghana', GIP:'Gibraltar', GMD:'Gambia',
        GNF:'Guinea', GTQ:'Guatemala', GYD:'Guyana', HKD:'Hong Kong', HNL:'Honduras',
        HRK:'Croatia', HTG:'Haiti', HUF:'Hungary', IDR:'Indonesia', ILS:'Israel',
        IMP:'Isle of Man', INR:'India', IQD:'Iraq', IRR:'Iran', ISK:'Iceland',
        JEP:'Jersey', JMD:'Jamaica', JOD:'Jordan', JPY:'Japan', KES:'Kenya',
        KGS:'Kyrgyzstan', KHR:'Cambodia', KID:'Kiribati', KMF:'Comoros', KRW:'South Korea',
        KWD:'Kuwait', KYD:'Cayman Islands', KZT:'Kazakhstan', LAK:'Laos', LBP:'Lebanon',
        LKR:'Sri Lanka', LRD:'Liberia', LSL:'Lesotho', LYD:'Libya', MAD:'Morocco',
        MDL:'Moldova', MGA:'Madagascar', MKD:'North Macedonia', MMK:'Myanmar', MNT:'Mongolia',
        MOP:'Macao', MRU:'Mauritania', MUR:'Mauritius', MVR:'Maldives', MWK:'Malawi',
        MXN:'Mexico', MYR:'Malaysia', MZN:'Mozambique', NAD:'Namibia', NGN:'Nigeria',
        NIO:'Nicaragua', NOK:'Norway', NPR:'Nepal', NZD:'New Zealand', OMR:'Oman',
        PAB:'Panama', PEN:'Peru', PGK:'Papua New Guinea', PHP:'Philippines', PKR:'Pakistan',
        PLN:'Poland', PYG:'Paraguay', QAR:'Qatar', RON:'Romania', RSD:'Serbia',
        RUB:'Russia', RWF:'Rwanda', SAR:'Saudi Arabia', SBD:'Solomon Islands',
        SCR:'Seychelles', SDG:'Sudan', SEK:'Sweden', SGD:'Singapore', SHP:'Saint Helena',
        SLE:'Sierra Leone', SLL:'Sierra Leone', SOS:'Somalia', SRD:'Suriname',
        SSP:'South Sudan', STN:'São Tomé & Príncipe', SYP:'Syria', SZL:'Eswatini',
        THB:'Thailand', TJS:'Tajikistan', TMT:'Turkmenistan', TND:'Tunisia', TOP:'Tonga',
        TRY:'Turkey', TTD:'Trinidad & Tobago', TVD:'Tuvalu', TWD:'Taiwan', TZS:'Tanzania',
        UAH:'Ukraine', UGX:'Uganda', USD:'United States', UYU:'Uruguay', UZS:'Uzbekistan',
        VES:'Venezuela', VND:'Vietnam', VUV:'Vanuatu', WST:'Samoa', XAF:'Central Africa',
        XCD:'East Caribbean', XDR:'IMF', XOF:'West Africa', XPF:'French Polynesia',
        YER:'Yemen', ZAR:'South Africa', ZMW:'Zambia', ZWL:'Zimbabwe'
    };

    // Helper to get "Country - CODE" label (e.g. "Australia - AUD")
    const getCurrencyName = (code) => {
        const country = currencyCountryMap[code] || code;
        return `${country} - ${code}`;
    };

    codes.forEach(code => {
        const displayName = getCurrencyName(code);
        const option1 = new Option(displayName, code);
        const option2 = new Option(displayName, code);
        shihab_fromSelect.add(option1);
        shihab_toSelect.add(option2);
    });

    // Set defaults
    shihab_fromSelect.value = "USD";
    shihab_toSelect.value = "BDT";
}

// 3. The Math logic
function shihab_calculate() {
    const amount = mehedi_amountInput.value;
    const from = shihab_fromSelect.value;
    const to = shihab_toSelect.value;

    if (amount === "" || amount <= 0) {
        mehedi_resultText.innerText = "0.00";
        return;
    }

    // Formula: (Amount / FromRate) * ToRate
    const rateA = shihab_exchangeRates[from];
    const rateB = shihab_exchangeRates[to];
    
    if (!rateA || !rateB) return;

    const convertedAmount = (amount / rateA) * rateB;

    mehedi_resultText.innerText = `${convertedAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${to}`;
    sshihabb007_rateText.innerText = `1 ${from} = ${(rateB / rateA).toFixed(4)} ${to}`;
}

// 4. Event Listeners
mehedi_amountInput.addEventListener('input', shihab_calculate);
shihab_fromSelect.addEventListener('change', shihab_calculate);
shihab_toSelect.addEventListener('change', shihab_calculate);

mehedi_swapBtn.addEventListener('click', () => {
    const temp = shihab_fromSelect.value;
    shihab_fromSelect.value = shihab_toSelect.value;
    shihab_toSelect.value = temp;
    shihab_calculate();
});

// Initialize the app
mehedi_init();

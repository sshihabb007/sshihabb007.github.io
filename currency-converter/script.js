// Currency Converter Pro Logic - By Mehedi Hasan Shihab (sshihabb007)

const sshihabb007_API_KEY = '33a012bbc92a1bbdd4b387b0';
const mehedi_amountInput = document.getElementById('mehedi_amount');
const shihab_fromSelect = document.getElementById('shihab_fromCurrency');
const shihab_toSelect = document.getElementById('shihab_toCurrency');
const mehedi_resultText = document.getElementById('mehedi_resultText');
const sshihabb007_rateText = document.getElementById('sshihabb007_rateText');
const mehedi_lastUpdated = document.getElementById('mehedi_lastUpdated');
const mehedi_swapBtn = document.getElementById('mehedi_swapBtn');

// Offline / Fallback reference rates (Base: USD)
const shihab_fallbackRates = {
    USD: 1, EUR: 0.92, GBP: 0.79, BDT: 120.0, INR: 84.0,
    JPY: 152.5, AUD: 1.53, CAD: 1.39, CHF: 0.87, CNY: 7.12,
    HKD: 7.77, NZD: 1.67, AED: 3.6725, SAR: 3.75, MYR: 4.38,
    SGD: 1.32, PKR: 277.8, LKR: 293.0, NPR: 134.4, THB: 33.7,
    IDR: 15700, PHP: 58.1, VND: 25300, KRW: 1380, TRY: 34.3,
    RUB: 96.5, BRL: 5.75, MXN: 20.1, ZAR: 17.6, EGP: 48.7,
    KWD: 0.307, QAR: 3.64, OMR: 0.385, BHD: 0.376, SEK: 10.6,
    NOK: 10.9, DKK: 6.88, PLN: 4.01, CZK: 23.4, HUF: 374.0,
    ILS: 3.74, TWD: 32.1, NGN: 1640, KES: 129.0, MAD: 9.9
};

let shihab_exchangeRates = {};

// 1. Fetch initial rates with offline fallback
async function mehedi_init() {
    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${sshihabb007_API_KEY}/latest/USD`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        if (data && data.result === "success" && data.conversion_rates) {
            shihab_exchangeRates = data.conversion_rates;
            sshihabb007_populateDropdowns(Object.keys(shihab_exchangeRates));
            if (mehedi_lastUpdated) mehedi_lastUpdated.innerText = "Live market exchange rates";
            shihab_calculate();
            return;
        }
        throw new Error("Invalid API payload");
    } catch (error) {
        shihab_exchangeRates = { ...shihab_fallbackRates };
        sshihabb007_populateDropdowns(Object.keys(shihab_exchangeRates));
        if (mehedi_lastUpdated) mehedi_lastUpdated.innerText = "(Offline reference rates)";
        shihab_calculate();
    }
}

// 2. Fill the select menus
function sshihabb007_populateDropdowns(codes) {
    // Priority currencies to display at top of list in exact priority order
    const topCurrencies = ['USD', 'EUR', 'GBP', 'BDT', 'INR', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'HKD', 'NZD', 'AED', 'SAR'];

    // Sort array so top currencies appear first in their defined priority order, then alphabetically
    codes.sort((a, b) => {
        const indexA = topCurrencies.indexOf(a);
        const indexB = topCurrencies.indexOf(b);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
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

    shihab_fromSelect.innerHTML = '';
    shihab_toSelect.innerHTML = '';

    const topGroup1 = document.createElement('optgroup');
    topGroup1.label = 'Popular Currencies';
    const otherGroup1 = document.createElement('optgroup');
    otherGroup1.label = 'All Currencies';

    const topGroup2 = document.createElement('optgroup');
    topGroup2.label = 'Popular Currencies';
    const otherGroup2 = document.createElement('optgroup');
    otherGroup2.label = 'All Currencies';

    codes.forEach(code => {
        const displayName = getCurrencyName(code);
        const option1 = new Option(displayName, code);
        const option2 = new Option(displayName, code);
        if (topCurrencies.includes(code)) {
            topGroup1.appendChild(option1);
            topGroup2.appendChild(option2);
        } else {
            otherGroup1.appendChild(option1);
            otherGroup2.appendChild(option2);
        }
    });

    shihab_fromSelect.appendChild(topGroup1);
    shihab_fromSelect.appendChild(otherGroup1);
    shihab_toSelect.appendChild(topGroup2);
    shihab_toSelect.appendChild(otherGroup2);

    // Set defaults
    shihab_fromSelect.value = "USD";
    shihab_toSelect.value = "BDT";
}

// 3. The Math logic
function shihab_calculate() {
    const amountRaw = mehedi_amountInput.value;
    const amount = parseFloat(amountRaw);
    const from = shihab_fromSelect.value;
    const to = shihab_toSelect.value;

    const rateA = shihab_exchangeRates[from];
    const rateB = shihab_exchangeRates[to];

    if (!rateA || !rateB) return;

    const unitRate = rateB / rateA;
    sshihabb007_rateText.innerText = `1 ${from} = ${unitRate.toFixed(4)} ${to}`;

    if (amountRaw === "" || isNaN(amount) || amount <= 0) {
        mehedi_resultText.innerText = `0.00 ${to}`;
        return;
    }

    // Formula: (Amount / FromRate) * ToRate
    const convertedAmount = (amount / rateA) * rateB;

    mehedi_resultText.innerText = `${convertedAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${to}`;
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

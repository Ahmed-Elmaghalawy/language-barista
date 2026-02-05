let currentData = null;
let currentLang = 'ar';
const synth = window.speechSynthesis;

// Simple word mapping helper (can be expanded)
// In a real app, this might come from the JSON or a dictionary API
const wordMap = {
    // English -> Arabic (Sample)
    "morning": "صباح",
    "good": "الخير",
    "evening": "مساء",
    "welcome": "مرحباً",
    "help": "مساعدتك",
    "order": "تطلب",
    "hot": "حاراً",
    "iced": "بارداً",
    "milk": "بالحليب",
    "sugar": "سكراً",
    "coffee": "قهوة",
    "drink": "مشروب",
    "enjoy": "استمتع",
    "thanks": "شكراً",
    // English -> French (Sample)
    "bonjour": "morning",
    "bonsoir": "evening",
    "bienvenue": "welcome",
    "aider": "help",
    "commander": "order",
    "chaud": "hot",
    "glacé": "iced",
    "lait": "milk",
    "sucre": "sugar"
};

async function changeLanguage(lang) {
    currentLang = lang;
    try {
        const response = await fetch(`./data/${lang}.json`);
        currentData = await response.json();
        updateUI();
    } catch (error) {
        console.error('Error loading language:', error);
    }
}

function updateUI() {
    if (!currentData) return;

    // Update Buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.getAttribute('data-target') === currentLang) {
            btn.classList.add('bg-blue-600', 'text-white', 'shadow-md');
            btn.classList.remove('text-slate-600', 'hover:bg-slate-50');
        } else {
            btn.classList.remove('bg-blue-600', 'text-white', 'shadow-md');
            btn.classList.add('text-slate-600', 'hover:bg-slate-50');
        }
    });

    const header = document.getElementById('target-header');
    header.textContent = `${currentData.ui.language_name} Phrase`;

    const body = document.getElementById('sheet-body');
    body.innerHTML = '';

    let rowIndex = 1;

    // Flatten all categories into one sheet
    Object.keys(currentData.phrases).forEach(catId => {
        const category = currentData.phrases[catId];
        category.items.forEach(item => {
            const row = document.createElement('tr');
            row.className = "border-b border-slate-100 row-hover transition-colors";

            // Index
            const tdIndex = document.createElement('td');
            tdIndex.className = "px-6 py-4 text-sm text-slate-400 font-medium";
            tdIndex.textContent = rowIndex++;

            // Category
            const tdCat = document.createElement('td');
            tdCat.className = "px-6 py-4";
            tdCat.innerHTML = `<span class="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">${category.title}</span>`;

            // English
            const tdEn = document.createElement('td');
            tdEn.className = "px-6 py-4 text-slate-900 font-medium";
            tdEn.appendChild(wrapWords(item.english, 'en-US', 'en', rowIndex));

            // Target
            const tdTr = document.createElement('td');
            tdTr.className = `px-6 py-4 font-semibold text-blue-600 ${currentData.ui.dir === 'rtl' ? 'text-right' : 'text-left'}`;
            tdTr.dir = currentData.ui.dir;
            tdTr.appendChild(wrapWords(item.translation, currentData.ui.language_code, 'tr', rowIndex));

            // Action
            const tdAction = document.createElement('td');
            tdAction.className = "px-6 py-4 text-center";
            tdAction.innerHTML = `
                <button onclick="speakFull('${item.translation.replace(/'/g, "\\'")}', '${currentData.ui.language_code}')" 
                        class="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                </button>
            `;

            row.appendChild(tdIndex);
            row.appendChild(tdCat);
            row.appendChild(tdEn);
            row.appendChild(tdTr);
            row.appendChild(tdAction);
            body.appendChild(row);
        });
    });
}

/**
 * Wraps each word in a span for individual interaction
 */
function wrapWords(text, langCode, type, rowId) {
    const container = document.createElement('div');
    const words = text.split(/(\s+)/); // Keep spaces

    words.forEach(word => {
        if (word.trim().length > 0) {
            const span = document.createElement('span');
            span.className = "word-span rounded px-0.5";
            span.textContent = word;
            span.onclick = (e) => {
                e.stopPropagation();
                handleWordClick(word, langCode, type, rowId, span);
            };
            container.appendChild(span);
        } else {
            container.appendChild(document.createTextNode(word));
        }
    });

    return container;
}

function handleWordClick(word, langCode, type, rowId, element) {
    // 1. Speak word
    speakFull(word, langCode);

    // 2. Visual highlight
    document.querySelectorAll('.word-span').forEach(s => s.classList.remove('highlight-word'));
    element.classList.add('highlight-word');
}

function speakFull(text, lang) {
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    synth.speak(utterance);
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    changeLanguage('en'); // Default to English initially
});

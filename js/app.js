let languages = ['fr', 'ru', 'hi', 'ar', 'es']; // Order for fetching
let langData = {};
const synth = window.speechSynthesis;

async function loadAllData() {
    try {
        const promises = languages.map(lang =>
            fetch(`./data/${lang}.json`).then(res => res.json())
        );
        const results = await Promise.all(promises);

        languages.forEach((lang, index) => {
            langData[lang] = results[index];
        });

        renderCompactSheet();
        setupColumnToggles();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function renderCompactSheet() {
    const body = document.getElementById('sheet-body');
    body.innerHTML = '';

    const reference = langData['ar'];
    if (!reference) return;

    let rowIndex = 1;

    Object.keys(reference.phrases).forEach(catId => {
        const category = reference.phrases[catId];

        const headerRow = document.createElement('tr');
        headerRow.className = "bg-gray-200 dark:bg-gray-800 text-[10px] font-bold uppercase tracking-tighter text-gray-500 sticky z-10";
        headerRow.innerHTML = `
            <td colspan="7" class="px-3 py-1 border-b border-gray-200 dark:border-gray-700">
                <span class="mr-2">${category.icon}</span>${category.title}
            </td>
        `;
        body.appendChild(headerRow);

        category.items.forEach((item, itemIndex) => {
            const row = document.createElement('tr');
            row.className = "hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors border-b border-gray-100 dark:border-gray-800/50";

            // 1. Index (Sticky)
            const tdIndex = document.createElement('td');
            tdIndex.className = "sticky left-0 bg-white dark:bg-gray-950 px-3 py-2 text-[10px] text-gray-400 border-r border-gray-100 dark:border-gray-800 z-10";
            tdIndex.textContent = rowIndex++;

            // 2. English (Col 1)
            const tdEn = createCell(item.english, 'en-US', 'col-1 sticky left-10 bg-white dark:bg-gray-950 border-r z-10 font-bold');

            // 3. French (Col 2)
            const tdFr = createCell(langData['fr'].phrases[catId].items[itemIndex].translation, 'fr-FR', 'col-2');

            // 4. Spanish (Col 3)
            const tdEs = createCell(langData['es'].phrases[catId].items[itemIndex].translation, 'es-ES', 'col-3');

            // 5. Russian (Col 4)
            const tdRu = createCell(langData['ru'].phrases[catId].items[itemIndex].translation, 'ru-RU', 'col-4');

            // 6. Hindi (Col 5 - Hinglish)
            const tdHi = createCell(langData['hi'].phrases[catId].items[itemIndex].translation, 'hi-IN', 'col-5');

            // 7. Arabic (Col 6)
            const tdAr = createCell(item.translation, 'ar-SA', 'col-6 text-right', 'rtl');

            row.appendChild(tdIndex);
            row.appendChild(tdEn);
            row.appendChild(tdFr);
            row.appendChild(tdEs);
            row.appendChild(tdRu);
            row.appendChild(tdHi);
            row.appendChild(tdAr);
            body.appendChild(row);
        });
    });
}

function createCell(text, langCode, extraClasses = '', dir = 'ltr') {
    const td = document.createElement('td');
    td.className = `px-3 py-2 text-[11px] text-gray-700 dark:text-gray-300 ${extraClasses}`;
    if (dir === 'rtl') {
        td.dir = 'rtl';
    }

    const wrapper = document.createElement('div');
    wrapper.className = "flex items-center gap-1.5";
    if (dir === 'rtl') wrapper.className += " justify-end";

    // Small speaker icon for full play
    const speaker = document.createElement('button');
    speaker.className = "text-gray-300 dark:text-gray-600 hover:text-blue-500 transition-colors shrink-0";
    speaker.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
    speaker.onclick = (e) => {
        e.stopPropagation();
        speak(text, langCode);
    };

    const wordsContainer = wrapWords(text, langCode);

    if (dir === 'rtl') {
        wrapper.appendChild(wordsContainer);
        wrapper.appendChild(speaker);
    } else {
        wrapper.appendChild(speaker);
        wrapper.appendChild(wordsContainer);
    }

    td.appendChild(wrapper);
    return td;
}

function wrapWords(text, langCode) {
    const container = document.createElement('div');
    container.className = "flex flex-wrap gap-x-0.5 leading-tight";

    const words = text.split(' ');
    words.forEach(word => {
        const span = document.createElement('span');
        span.className = "word-span hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-all";
        span.textContent = word;
        span.onclick = (e) => {
            e.stopPropagation();
            speak(word, langCode);
            document.querySelectorAll('.word-span').forEach(s => s.classList.remove('highlight-word'));
            span.classList.add('highlight-word');
        };
        container.appendChild(span);
    });

    return container;
}

function speak(text, lang) {
    if (!text) return;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    synth.speak(utterance);
}

// UI Controllers
const themeToggle = document.getElementById('theme-toggle');
themeToggle.onclick = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('minimal-theme', isDark ? 'dark' : 'light');
};

const colSettingsBtn = document.getElementById('col-settings-btn');
const colModal = document.getElementById('col-modal');
colSettingsBtn.onclick = (e) => {
    e.stopPropagation();
    colModal.classList.toggle('hidden');
};

document.body.onclick = () => colModal.classList.add('hidden');
colModal.onclick = (e) => e.stopPropagation();

function setupColumnToggles() {
    const STORAGE_KEY_PREFIX = 'vocatabs-col-';

    document.querySelectorAll('.col-toggle').forEach(input => {
        const colNum = input.dataset.col;
        
        input.onchange = () => {
            const elements = document.querySelectorAll(`.col-${colNum}`);
            elements.forEach(el => {
                if (input.checked) el.classList.remove('column-hidden');
                else el.classList.add('column-hidden');
            });
            localStorage.setItem(`${STORAGE_KEY_PREFIX}${colNum}`, input.checked);
        };

        // Load saved state
        const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}${colNum}`);
        if (saved !== null) {
            input.checked = (saved === 'true');
            // Apply initial state
            const elements = document.querySelectorAll(`.col-${colNum}`);
            elements.forEach(el => {
                if (input.checked) el.classList.remove('column-hidden');
                else el.classList.add('column-hidden');
            });
        }
    });
}

if (localStorage.getItem('minimal-theme') === 'dark' ||
    (!('minimal-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
}

document.addEventListener('DOMContentLoaded', loadAllData);

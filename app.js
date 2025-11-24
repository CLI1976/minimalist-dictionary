// ========================================
// 基礎字典數據 (擴充版)
// ========================================
const basicDict = {
    'hello': ['你好', '您好', '哈囉', '喂'],
    'world': ['世界', '全球'],
    'computer': ['電腦', '計算機'],
    'dictionary': ['字典', '辭典'],
    'language': ['語言', '語文'],
    'translate': ['翻譯', '轉譯'],
    'love': ['愛', '熱愛', '喜愛'],
    'book': ['書', '書籍', '著作'],
    'time': ['時間', '時刻', '時代'],
    'friend': ['朋友', '好友'],
    'thank': ['感謝', '謝謝'],
    'please': ['請', '拜託'],
    'welcome': ['歡迎', '歡迎光臨'],
    'yes': ['是', '對', '好'],
    'no': ['不', '否', '不是'],
    'cat': ['貓', '貓咪'],
    'dog': ['狗', '犬'],
    'car': ['汽車', '轎車'],
};

// ========================================
// DOM Elements
// ========================================
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultContainer = document.getElementById('resultContainer');
const wordTitle = document.getElementById('wordTitle');
const translations = document.getElementById('translations');
const pronounceBtn = document.getElementById('pronounceBtn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const welcomeMessage = document.getElementById('welcomeMessage');

// ========================================
// State
// ========================================
let currentWord = '';
let currentAudioUrl = null;

// ========================================
// Event Listeners
// ========================================
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

pronounceBtn.addEventListener('click', pronounceWord);

// ========================================
// Main Search Function
// ========================================
async function handleSearch() {
    const word = searchInput.value.trim().toLowerCase();

    if (!word) {
        showError('請輸入單字');
        return;
    }

    currentWord = word;
    showLoading();
    hideError();
    hideWelcome();

    try {
        const result = await fetchTranslation(word);
        displayResult(word, result);
    } catch (err) {
        showError('查詢失敗，請稍後再試');
        console.error('Search error:', err);
    }
}

// ========================================
// Fetch Translation
// ========================================
async function fetchTranslation(word) {
    // 方法1: 嘗試從後端 API 獲取（Yahoo + Cambridge）
    try {
        const apiUrl = `https://web-production-0d0e6.up.railway.app/api/translate?word=${encodeURIComponent(word)}`;
        const response = await fetch(apiUrl);

        if (response.ok) {
            const data = await response.json();

            // 儲存音檔 URL
            currentAudioUrl = data.audio_url || null;
            console.log('Audio URL:', currentAudioUrl);

            // 返回完整的 data 物件
            if (data.definitions && data.definitions.length > 0) {
                return data;
            }
        }
    } catch (error) {
        console.log('API 查詢失敗，使用內建字典:', error.message);
        currentAudioUrl = null;
    }

    // 方法2: 使用內建字典（轉換為新格式）
    if (basicDict[word]) {
        currentAudioUrl = null;
        return {
            word: word,
            phonetics: {},
            definitions: [{
                pos: '翻譯',
                meanings: basicDict[word],
                examples: []
            }],
            source: '內建字典'
        };
    }

    // 方法3: 所有方法都失敗
    currentAudioUrl = null;
    return {
        word: word,
        phonetics: {},
        definitions: [{
            pos: '提示',
            meanings: [
                `❌ 未找到「${word}」的翻譯`,
                '💡 建議：',
                '1. 確認後端服務器是否運行',
                '2. 檢查單字拼寫',
                '3. 嘗試其他單字'
            ],
            examples: []
        }]
    };
}

// ========================================
// Display Results
// ========================================
function displayResult(word, data) {
    hideLoading();
    showResultContainer();

    // 顯示單字標題和音標
    let titleHTML = word.charAt(0).toUpperCase() + word.slice(1);

    // 添加音標（如果有）
    if (data.phonetics && data.phonetics.kk) {
        titleHTML += `<span class="phonetics">KK [${data.phonetics.kk}]</span>`;
    }

    wordTitle.innerHTML = titleHTML;

    // 清空翻譯區域
    translations.innerHTML = '';

    // 處理新格式（Yahoo + Cambridge）
    if (data.definitions && data.definitions.length > 0) {
        // 按詞性顯示翻譯
        data.definitions.forEach(def => {
            // 創建定義區塊
            const groupDiv = document.createElement('div');
            groupDiv.className = 'definition-group';

            // 詞性標籤
            const posTag = document.createElement('div');
            posTag.className = 'pos-tag';
            posTag.textContent = def.pos;
            groupDiv.appendChild(posTag);

            // 意思列表
            if (def.meanings && def.meanings.length > 0) {
                const meaningList = document.createElement('div');
                meaningList.className = 'meaning-list';

                def.meanings.forEach(meaning => {
                    const meaningDiv = document.createElement('div');
                    meaningDiv.className = 'meaning-item';
                    meaningDiv.textContent = meaning;
                    meaningList.appendChild(meaningDiv);
                });

                groupDiv.appendChild(meaningList);
            }

            // 例句列表
            if (def.examples && def.examples.length > 0) {
                const exampleList = document.createElement('div');
                exampleList.className = 'example-list';

                def.examples.forEach(example => {
                    const exampleDiv = document.createElement('div');
                    exampleDiv.className = 'example-sentence';
                    exampleDiv.textContent = example;
                    exampleList.appendChild(exampleDiv);
                });

                groupDiv.appendChild(exampleList);
            }

            translations.appendChild(groupDiv);
        });
    }

    // 顯示來源標註
    if (data.source) {
        const sourceTag = document.createElement('div');
        sourceTag.className = 'source-tag';
        sourceTag.textContent = `資料來源：${data.source}`;
        translations.appendChild(sourceTag);
    }
}

// ========================================
// Text-to-Speech Pronunciation (雙重備援)
// ========================================
function pronounceWord() {
    if (!currentWord) return;

    // 優先方案：使用真實美式音檔（音質最佳）
    if (currentAudioUrl) {
        console.log('使用真實音檔:', currentAudioUrl);

        const audio = new Audio(currentAudioUrl);

        // 視覺反饋
        pronounceBtn.style.transform = 'scale(0.9)';

        // 播放完成後恢復按鈕
        audio.onended = () => {
            pronounceBtn.style.transform = '';
        };

        // 播放錯誤時回退到 Web Speech API
        audio.onerror = () => {
            console.log('音檔載入失敗，改用 Web Speech API');
            pronounceBtn.style.transform = '';
            speakWithWebAPI();
        };

        audio.play().catch(error => {
            console.log('音檔播放失敗:', error);
            speakWithWebAPI();
        });
    }
    // 備案：使用 Web Speech API（合成語音）
    else {
        console.log('使用 Web Speech API');
        speakWithWebAPI();
    }
}

// Web Speech API 發音函數
function speakWithWebAPI() {
    if ('speechSynthesis' in window) {
        // 停止當前播放
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(currentWord);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1;

        // 視覺反饋
        pronounceBtn.style.transform = 'scale(0.9)';

        utterance.onend = () => {
            pronounceBtn.style.transform = '';
        };

        window.speechSynthesis.speak(utterance);
    } else {
        showError('您的瀏覽器不支援語音功能');
    }
}

// ========================================
// UI Helper Functions
// ========================================
function showLoading() {
    loading.classList.remove('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function showResultContainer() {
    resultContainer.classList.remove('hidden');
}

function hideResultContainer() {
    resultContainer.classList.add('hidden');
}

function showError(message) {
    error.textContent = message;
    error.classList.remove('hidden');
    setTimeout(() => {
        error.classList.add('hidden');
    }, 3000);
}

function hideError() {
    error.classList.add('hidden');
}

function showWelcome() {
    welcomeMessage.classList.remove('hidden');
}

function hideWelcome() {
    welcomeMessage.classList.add('hidden');
}

// ========================================
// Initialize
// ========================================
searchInput.focus();

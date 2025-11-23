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
    'sorry': ['抱歉', '對不起', '很遺憾'],
    'help': ['幫助', '協助', '救助'],
    'good': ['好', '良好', '優秀'],
    'bad': ['壞', '不好', '糟糕'],
    'beautiful': ['美麗', '漂亮', '美好'],
    'happy': ['快樂', '高興', '幸福'],
    'sad': ['悲傷', '難過', '傷心'],
    'water': ['水', '水分'],
    'food': ['食物', '食品'],
    'home': ['家', '家庭', '住所'],
    'school': ['學校', '學院'],
    'work': ['工作', '職業', '勞動'],
    'play': ['玩', '遊戲', '演奏'],
    'music': ['音樂', '樂曲'],
    'art': ['藝術', '美術'],
    'science': ['科學', '自然科學'],
    'cat': ['貓', '貓咪'],
    'dog': ['狗', '犬'],
    'car': ['汽車', '轎車'],
    'phone': ['電話', '手機'],
    'today': ['今天', '今日'],
    'tomorrow': ['明天', '明日'],
    'yesterday': ['昨天', '昨日'],
    'morning': ['早晨', '上午'],
    'night': ['夜晚', '晚上'],
    'day': ['白天', '日子'],
    'sun': ['太陽', '陽光'],
    'moon': ['月亮', '月球'],
    'star': ['星星', '恆星'],
    'sky': ['天空', '天'],
    'sea': ['海', '海洋'],
    'mountain': ['山', '山脈'],
    'river': ['河', '河流'],
    'tree': ['樹', '樹木'],
    'flower': ['花', '花朵'],
    'rain': ['雨', '下雨'],
    'snow': ['雪', '下雪'],
    'wind': ['風', '風力'],
    'hot': ['熱', '炎熱'],
    'cold': ['冷', '寒冷'],
    'big': ['大', '巨大'],
    'small': ['小', '微小'],
    'new': ['新的', '新穎'],
    'old': ['舊的', '古老'],
    'young': ['年輕', '青春'],
    'man': ['男人', '男性'],
    'woman': ['女人', '女性'],
    'boy': ['男孩', '少年'],
    'girl': ['女孩', '少女'],
    'father': ['父親', '爸爸'],
    'mother': ['母親', '媽媽'],
    'son': ['兒子'],
    'daughter': ['女兒'],
    'brother': ['兄弟', '哥哥/弟弟'],
    'sister': ['姐妹', '姐姐/妹妹'],
    'family': ['家庭', '家族'],
    'eat': ['吃', '進食'],
    'drink': ['喝', '飲用'],
    'sleep': ['睡覺', '休息'],
    'walk': ['走', '步行'],
    'run': ['跑', '奔跑'],
    'read': ['讀', '閱讀'],
    'write': ['寫', '書寫'],
    'speak': ['說', '講話'],
    'listen': ['聽', '傾聽'],
    'see': ['看見', '看到'],
    'watch': ['觀看', '注視'],
    'study': ['學習', '研究'],
    'teach': ['教', '教導'],
    'learn': ['學', '學習'],
    'know': ['知道', '了解'],
    'understand': ['理解', '明白'],
    'think': ['想', '思考'],
    'feel': ['感覺', '感受'],
    'believe': ['相信', '信任'],
    'hope': ['希望', '期望'],
    'want': ['想要', '需要'],
    'need': ['需要', '必須'],
    'like': ['喜歡', '愛好'],
    'red': ['紅色', '紅的'],
    'blue': ['藍色', '藍的'],
    'green': ['綠色', '綠的'],
    'yellow': ['黃色', '黃的'],
    'black': ['黑色', '黑的'],
    'white': ['白色', '白的'],
    'orange': ['橙色', '橘色'],
    'purple': ['紫色', '紫的'],
    'one': ['一', '壹'],
    'two': ['二', '貳', '兩'],
    'three': ['三', '參'],
    'four': ['四', '肆'],
    'five': ['五', '伍'],
    'six': ['六', '陸'],
    'seven': ['七', '柒'],
    'eight': ['八', '捌'],
    'nine': ['九', '玖'],
    'ten': ['十', '拾'],
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
    // 方法1: 嘗試從後端 API 獲取（Cambridge Dictionary）
    try {
        const apiUrl = `http://localhost:5000/api/translate?word=${encodeURIComponent(word)}`;
        const response = await fetch(apiUrl);

        if (response.ok) {
            const data = await response.json();

            // 儲存音檔 URL
            currentAudioUrl = data.audio_url || null;
            console.log('Audio URL:', currentAudioUrl);

            if (data.translations && data.translations.length > 0) {
                return data.translations;
            }
        }
    } catch (error) {
        console.log('API 查詢失敗，使用內建字典:', error.message);
        currentAudioUrl = null;
    }

    // 方法2: 使用內建字典
    if (basicDict[word]) {
        currentAudioUrl = null;
        return basicDict[word];
    }

    // 方法3: 所有方法都失敗
    currentAudioUrl = null;
    return [
        `❌ 未找到「${word}」的翻譯`,
        '💡 提示：',
        '1. 確認後端服務器是否運行',
        '2. 檢查單字拼寫',
        '3. 嘗試其他單字'
    ];
}

// ========================================
// Display Results
// ========================================
function displayResult(word, translationList) {
    hideLoading();
    showResultContainer();

    wordTitle.textContent = word.charAt(0).toUpperCase() + word.slice(1);

    translations.innerHTML = '';

    translationList.forEach((translation, index) => {
        const span = document.createElement('span');
        span.className = index === 0 ? 'translation-item translation-primary' : 'translation-item';
        span.textContent = translation;
        translations.appendChild(span);
    });
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

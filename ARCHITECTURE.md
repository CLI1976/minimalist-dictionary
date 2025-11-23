# 極簡字典 - 技術架構說明

## 📂 專案結構

```
minimalist-dictionary/
│
├── index.html          # 前端：網頁結構
├── style.css           # 前端：視覺設計
├── app.js              # 前端：互動邏輯（含雙重備援發音）
│
└── backend/
    ├── server.py       # 後端：API 服務器（翻譯 + 音檔）
    ├── requirements.txt # 後端：Python 依賴
    └── README.md       # 後端：使用說明
```

## 🏗️ 完整架構圖（含音檔系統）

```
┌───────────────────────────────────────────────────────────────────┐
│                         瀏覽器                                      │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │  前端 Web App                                             │     │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐               │     │
│  │  │index.html│  │ style.css│  │  app.js  │               │     │
│  │  └──────────┘  └──────────┘  └──────────┘               │     │
│  │       │              │         │                          │     │
│  │       └──────────────┴─────────┘                          │     │
│  │                      │                                    │     │
│  │           ┌──────────┴──────────┐                         │     │
│  │           ▼                     ▼                         │     │
│  │    fetch 翻譯 API          點擊發音按鈕                    │     │
│  │           │                     │                         │     │
│  │           │              ┌──────┴──────┐                  │     │
│  │           │              ▼             ▼                  │     │
│  │           │      有音檔URL？     無音檔URL                 │     │
│  │           │              │             │                  │     │
│  │           │              ▼             ▼                  │     │
│  │           │      播放真實音檔    Web Speech API            │     │
│  └───────────┼──────────────────────────────────────────────┘     │
└───────────────┼────────────────────────────────────────────────┘
                │
                ▼ HTTP GET (localhost:5000/api/translate?word=hello)
                │
┌───────────────┴──────────────────────────────────────────────────┐
│                   Python 後端服務器 (Flask)                       │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │  server.py - translate()                                │     │
│  │  ┌─────────────────────────────────────────────────┐   │     │
│  │  │  1. fetch_cambridge(word)    ← 抓取翻譯         │   │     │
│  │  │  2. fetch_audio_url(word)    ← 抓取音檔URL      │   │     │
│  │  └─────────────────────────────────────────────────┘   │     │
│  └─────────┬──────────────────────┬────────────────────────┘     │
└────────────┼──────────────────────┼──────────────────────────────┘
             │                      │
             │ 爬取翻譯              │ 爬取音檔
             │                      │
             ▼                      ▼
┌──────────────────────┐  ┌──────────────────────────┐
│ Cambridge (中英版)    │  │ Cambridge (英文版)        │
│ /english-chinese-     │  │ /english/hello           │
│  traditional/hello    │  │                          │
│                       │  │ <source type="audio/     │
│ <span class="trans">  │  │  mpeg" src="/us_pron/    │
│   苦的</span>         │  │  .../hello.mp3">         │
└───────────┬───────────┘  └──────────┬───────────────┘
            │                         │
            │ 解析翻譯                 │ 提取音檔URL
            │                         │
            ▼                         ▼
       ["苦的", "怨恨的", ...]    "https://.../us_pron/.../hello.mp3"
            │                         │
            └─────────┬───────────────┘
                      │
                      ▼ 返回 JSON
            {
              "word": "hello",
              "translations": ["你好", "您好", ...],
              "audio_url": "https://.../hello.mp3"
            }
                      │
                      ▼
              前端接收並顯示翻譯
              儲存 audio_url 備用
```

## 🎯 各部分功能說明

### 1️⃣ **index.html** - 網頁結構

**作用**：定義頁面的 HTML 骨架

**主要元素**：
- 📖 頁面標題和 logo
- 🔍 搜尋輸入框
- 🔊 發音按鈕
- 📋 翻譯結果顯示區域
- ⏳ 載入動畫
- ❌ 錯誤訊息區

**關鍵代碼片段**：
```html
<!-- 搜尋框 -->
<input type="text" id="searchInput" placeholder="輸入英文單字...">
<button id="searchBtn">搜尋</button>

<!-- 結果區域 -->
<div id="resultContainer">
  <h2 id="wordTitle"></h2>
  <div id="translations"></div>
</div>
```

---

### 2️⃣ **style.css** - 視覺設計

**作用**：定義所有視覺樣式和動畫

**設計特色**：
- 🎨 極簡風格配色
- 🌈 紫色漸層主題
- ✨ 流暢的動畫效果
- 📱 響應式佈局

**關鍵技術**：
```css
/* CSS 變數 */
:root {
  --color-primary: #4F46E5;
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 動畫 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

### 3️⃣ **app.js** - 前端邏輯（核心！）

**作用**：處理使用者互動、資料請求和雙重備援發音

**主要功能**：

#### A. 查詢單字並呼叫後端 API（含音檔）
```javascript
async function fetchTranslation(word) {
  // 方法1: 呼叫後端 API（重點！）
  const response = await fetch(
    `http://localhost:5000/api/translate?word=${word}`
  );
  const data = await response.json();
  
  // 儲存音檔 URL（新增！）
  currentAudioUrl = data.audio_url || null;
  
  return data.translations;
  
  // 方法2: API 失敗時使用內建字典
  if (basicDict[word]) {
    currentAudioUrl = null;  // 內建字典無音檔
    return basicDict[word];
  }
}
```

#### B. 雙重備援發音系統（新增！）
```javascript
function pronounceWord() {
  // 優先：使用真實美式音檔
  if (currentAudioUrl) {
    const audio = new Audio(currentAudioUrl);
    audio.onerror = () => speakWithWebAPI();  // 失敗時備援
    audio.play().catch(() => speakWithWebAPI());
  } 
  // 備案：使用 Web Speech API
  else {
    speakWithWebAPI();
  }
}

function speakWithWebAPI() {
  const utterance = new SpeechSynthesisUtterance(currentWord);
  utterance.lang = 'en-US';
  window.speechSynthesis.speak(utterance);
}
```

#### C. 顯示翻譯結果
```javascript
function displayResult(word, translations) {
  translations.forEach(translation => {
    const span = document.createElement('span');
    span.textContent = translation;
    document.getElementById('translations').appendChild(span);
  });
}
```

---

### 4️⃣ **server.py** - 後端 API 服務器（關鍵！）

**作用**：作為 CORS 代理，抓取 Cambridge Dictionary 翻譯和美式音檔

#### 為什麼需要後端？

❌ **問題**：前端直接請求 Cambridge Dictionary 會被 CORS 阻擋

```javascript
// ❌ 這樣會失敗（CORS 錯誤）
fetch('https://dictionary.cambridge.org/...')
```

```
Error: Access to fetch at 'https://dictionary.cambridge.org/...' 
from origin 'file://' has been blocked by CORS policy
```

✅ **解決方案**：透過 Python 後端作為代理

```
前端 → 後端 (localhost:5000) → Cambridge Dictionary
      ✅ 同源請求              ✅ 服務器端請求（無 CORS 限制）
```

#### server.py 主要功能

**1. 提供 API 端點（含音檔）**
```python
@app.route('/api/translate', methods=['GET'])
def translate():
    word = request.args.get('word')  # 接收前端傳來的單字
    translations = fetch_cambridge(word)  # 抓取翻譯
    audio_url = fetch_audio_url(word)    # 抓取音檔URL（新增！）
    
    return jsonify({
        'word': word,
        'translations': translations,
        'audio_url': audio_url  # 返回音檔URL
    })
```

**2. 爬取 Cambridge Dictionary 翻譯**
```python
def fetch_cambridge(word):
    url = f'https://dictionary.cambridge.org/dictionary/english-chinese-traditional/{word}'
    response = requests.get(url)  # 服務器端請求，無 CORS 限制
    
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # 解析 HTML，提取翻譯
    translations = []
    
    # 方法1: 抓取 <a class="Ref"><span>怨恨的</span></a>
    ref_links = soup.find_all('a', class_='Ref')
    for link in ref_links:
        text = link.get_text(strip=True)
        if is_valid_translation(text):
            translations.append(text)
    
    # 方法2: 抓取 <span class="trans">苦的</span>
    trans_spans = soup.find_all('span', class_='trans')
    for span in trans_spans:
        text = span.get_text(strip=True)
        if is_valid_translation(text):
            translations.append(text)
    
    # 方法3: 抓取 <span class="dtrans">有苦味的</span>
    dtrans_spans = soup.find_all('span', class_='dtrans')
    for span in dtrans_spans:
        text = span.get_text(strip=True)
        if is_valid_translation(text):
            translations.append(text)
    
    return translations
```

**3. 過濾和清理翻譯**
```python
def is_valid_translation(text):
    # 只保留中文
    if not re.search(r'[\u4e00-\u9fff]', text):
        return False
    
    # 過濾例句（含句號、問號等）
    if re.search(r'[。？！；]', text):
        return False
    
    # 過濾過長文本（超過 15 字符）
    if len(text) > 15:
        return False
    
    return True
```

**4. 抓取美式音檔 URL（新增！）**
```python
def fetch_audio_url(word):
    # 請求英文版頁面（有音檔）
    url = f'https://dictionary.cambridge.org/dictionary/english/{word}'
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # 尋找音檔 <source> 標籤
    audio_sources = soup.find_all('source', {'type': 'audio/mpeg'})
    
    # 過濾美式發音（/us_pron/）
    for source in audio_sources:
        src = source.get('src', '')
        if '/us_pron/' in src:  # 只要美式，不要英式
            # 補全完整 URL
            if src.startswith('//'):
                return 'https:' + src
            elif src.startswith('/'):
                return 'https://dictionary.cambridge.org' + src
            return src
    
    return None  # 找不到返回 None
```

**5. 處理 CORS**
```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 允許前端跨域請求
```

---

## 🔄 完整請求流程

### 以查詢 "bitter" 為例

**步驟 1**：使用者在 `index.html` 輸入 "bitter" 並按 Enter

**步驟 2**：`app.js` 監聽事件，呼叫 `handleSearch()`

**步驟 3**：`app.js` 發送 fetch 請求到後端
```javascript
fetch('http://localhost:5000/api/translate?word=bitter')
```

**步驟 4**：`server.py` 接收請求，呼叫 `fetch_cambridge('bitter')`

**步驟 5**：`server.py` 向 Cambridge Dictionary 發送請求
```python
requests.get('https://dictionary.cambridge.org/dictionary/english-chinese-traditional/bitter')
```

**步驟 6**：Cambridge 返回 HTML 網頁

**步驟 7**：`server.py` 使用 BeautifulSoup 解析 HTML
- 找到 `<a class="Ref"><span>怨恨的</span></a>` → 提取「怨恨的」
- 找到 `<span class="trans">苦的</span>` → 提取「苦的」
- 找到 `<span class="dtrans">有苦味的</span>` → 提取「有苦味的」
- 過濾例句、清理括號、去重

**步驟 8**：`server.py` 返回 JSON 給前端
```json
{
  "word": "bitter",
  "translations": ["怨恨的", "無法釋懷的", "苦的", "有苦味的", ...]
}
```

**步驟 9**：`app.js` 接收 JSON，呼叫 `displayResult()`

**步驟 10**：`app.js` 將翻譯顯示在網頁上
```javascript
translations.forEach(translation => {
  const span = document.createElement('span');
  span.className = 'translation-item';
  span.textContent = translation;  // "怨恨的", "苦的", ...
  element.appendChild(span);
});
```

**步驟 11**：使用者看到結果！ 🎉

---

## 💡 總結

### 前端 (index.html + style.css + app.js)
- 📱 **使用者介面**：顯示、互動、視覺效果
- 🎤 **發音功能**：使用 Web Speech API
- 📡 **API 請求**：向後端請求翻譯資料

### 後端 (server.py)
- 🌉 **CORS 代理**：突破瀏覽器跨域限制
- 🕷️ **網頁爬蟲**：抓取 Cambridge Dictionary 內容
- 🔍 **HTML 解析**：提取精準的繁體中文翻譯
- 🧹 **資料清理**：過濾例句、去重、格式化

### 為什麼不能只用前端？

因為**瀏覽器安全限制（CORS）**，前端無法直接訪問其他網站的資料。必須透過後端服務器作為中介。

這就是為什麼需要啟動 `server.py` 後端才能查詢任意單字！ 🚀

---

## 🎤 雙重備援發音系統

### 系統架構

```
使用者點擊 🔊
       ↓
檢查 currentAudioUrl
       │
   ┌───┴───┐
   ▼       ▼
 有URL   無URL
   │       │
   ▼       ▼
真實音檔  Web Speech
(優先)    (備案)
   │       │
   ▼       ▼
播放成功？
   │
YES─NO
 │   │
 ✓   ▼
    回退到
   Web Speech
```

### 為什麼是雙重備援？

| 方案 | 優點 | 缺點 | 適用場景 |
|------|------|------|---------|
| **真實音檔**<br>(Cambridge) | ⭐⭐⭐⭐⭐ 音質<br>⭐⭐⭐⭐⭐ 準確 | 需網路<br>約30KB流量 | 有網路時 |
| **Web Speech API**<br>(合成語音) | ⭐⭐⭐⭐⭐ 可靠<br>零流量<br>即時生成 | ⭐⭐⭐ 音質<br>合成感較重 | 離線/備援 |

### 技術實現重點

#### 1. 狀態管理
```javascript
let currentAudioUrl = null;  // 儲存音檔URL
```

#### 2. API 回應包含音檔
```json
{
  "word": "hello",
  "translations": ["你好", "您好"],
  "audio_url": "https://dictionary.cambridge.org/media/english/us_pron/.../hello.mp3"
}
```

#### 3. 智慧發音選擇
```javascript
if (currentAudioUrl) {
  // 優先：真實音檔
  const audio = new Audio(currentAudioUrl);
  audio.onerror = () => speakWithWebAPI();  // 失敗自動切換
  audio.play();
} else {
  // 備案：合成語音
  speakWithWebAPI();
}
```

#### 4. 為什麼抓取英文版而非中英版？

Cambridge Dictionary 有兩個版本：
- **英文版** (`/dictionary/english/hello`) → ✅ 有音檔
- **中英版** (`/dictionary/english-chinese-traditional/hello`) → ❌ 音檔較少

**解決方案**：
- 翻譯：從**中英版**抓取（確保繁體中文）
- 音檔：從**英文版**抓取（確保有美式發音）

#### 5. 美式 vs 英式音檔

```python
# 過濾條件：只要美式發音
if '/us_pron/' in src:  # ✅ 美式
    return src
# 排除英式發音
if '/uk_pron/' in src:  # ❌ 英式，跳過
    continue
```

### 使用體驗流程

**場景 1: 查詢常見單字（最佳）**
```
查詢 "hello" → 後端返回音檔URL → 播放真實美式發音 ✅
音質: ⭐⭐⭐⭐⭐
```

**場景 2: 音檔載入失敗（自動備援）**
```
查詢 "world" → 音檔URL有效 → 網路問題載入失敗 → 自動切換合成語音 ✅
音質: ⭐⭐⭐（仍可使用）
```

**場景 3: 使用內建字典（合成語音）**
```
查詢 "cat" → 內建字典 → currentAudioUrl = null → 直接使用合成語音 ✅
音質: ⭐⭐⭐
```

**場景 4: Cambridge 無音檔（罕見）**
```
查詢生僻單字 → 後端找不到音檔 → audio_url = null → 使用合成語音 ✅
音質: ⭐⭐⭐
```

### 總結

✨ **永遠有發音**：真實音檔失敗時自動回退<br>
⚡ **最佳體驗**：優先使用專業錄音<br>
🛡️ **可靠穩定**：雙層保護機制<br>
🎯 **美式英語**：專注於美式發音（US）

這就是為什麼您的字典發音永遠不會失敗！ 🚀

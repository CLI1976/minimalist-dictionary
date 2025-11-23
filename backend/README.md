# 極簡字典 - 後端服務器使用指南

## 🎯 功能說明

這個 Python 後端服務器作為 CORS 代理，抓取 Cambridge Dictionary 的繁體中文翻譯，讓前端可以直接顯示查詢結果。

## 📦 安裝步驟

### 1. 安裝 Python 依賴

```powershell
cd C:\Users\xray\.gemini\antigravity\scratch\minimalist-dictionary\backend
pip install -r requirements.txt
```

### 2. 啟動服務器

```powershell
python server.py
```

服務器會在 `http://localhost:5000` 運行

## 🔌 API 端點

### 查詢翻譯
```
GET /api/translate?word={單字}
```

**範例**：
```
http://localhost:5000/api/translate?word=hello
```

**回應**：
```json
{
  "word": "hello",
  "translations": ["喂", "你好", "哈囉"],
  "source": "Cambridge Dictionary"
}
```

### 健康檢查
```
GET /api/health
```

## 🚀 使用流程

1. **啟動後端服務器**（在一個終端機視窗）
   ```powershell
   cd C:\Users\xray\.gemini\antigravity\scratch\minimalist-dictionary\backend
   python server.py
   ```

2. **開啟字典網頁**（在瀏覽器）
   ```
   file:///C:/Users/xray/.gemini/antigravity/scratch/minimalist-dictionary/index.html
   ```

3. **輸入單字查詢** - 現在任何單字都能直接顯示翻譯！

## 🔧 疑難排解

### 問題：API 查詢失敗

**檢查項目**：
1. 後端服務器是否正在運行？
2. 瀏覽器 Console 是否有 CORS 錯誤？
3. Cambridge Dictionary 網站是否可訪問？

### 問題：找不到翻譯

**原因**：
- 單字拼寫錯誤
- Cambridge Dictionary 沒有該單字的中文翻譯
- 網路連線問題

**解決方式**：
- 會自動回退到內建字典（100+ 常用單字）

## 💡 優勢

✅ **真實翻譯**：從 Cambridge Dictionary 抓取權威翻譯  
✅ **直接顯示**：不需另開視窗，結果直接顯示在極簡網頁  
✅ **智慧備援**：API 失敗時自動使用內建字典  
✅ **繁體中文**：確保所有翻譯都是繁體中文

## 🛠️ 技術架構

```
前端 (app.js)
    ↓ fetch
後端 (server.py) ← Flask + BeautifulSoup
    ↓ requests
Cambridge Dictionary
    ↓ 解析 HTML
回傳繁體中文翻譯
```

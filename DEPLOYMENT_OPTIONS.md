# 極簡字典 - 雲端部署選項比較

## 📋 部署需求

您的後端需要的是：
- ✅ 支援 **Python** 運行環境
- ✅ 支援 **Flask** Web 框架
- ✅ 允許安裝 **pip** 套件（BeautifulSoup、requests 等）
- ✅ 可以處理 **HTTP 請求**
- ✅ 提供**公開 URL**（讓手機訪問）
- ✅ 支援持續運行（或按需啟動）

## 🌐 雲端平台完整比較

### 1️⃣ Railway ⭐ 推薦

**為什麼推薦**：
- ✅ **最簡單**：Git push 即部署
- ✅ **免費額度**：500 小時/月（足夠個人使用）
- ✅ **支援 Python**：原生支援 Flask
- ✅ **自動偵測**：自動識別 requirements.txt
- ✅ **提供 HTTPS**：自動生成安全網址

**免費方案**：
- 💰 每月 $5 免費額度
- ⏰ 500 小時運行時間
- 💾 1GB RAM
- 🌐 自動提供域名

**部署步驟**：
1. 註冊 Railway
2. 連接 GitHub 倉庫
3. 選擇專案目錄
4. 自動部署！

**缺點**：
- ⚠️ 免費額度用完需付費
- ⚠️ 閒置可能自動休眠

---

### 2️⃣ Render ⭐ 次選

**特點**：
- ✅ **完全免費方案**（有限制）
- ✅ **支援 Python**
- ✅ **簡單部署**
- ✅ **自動 SSL**

**免費方案**：
- 💰 完全免費（永久）
- ⏰ 閒置 15 分鐘後休眠
- 🐢 休眠後重啟需 30-60 秒
- 💾 512MB RAM

**優缺點**：
- ✅ 永久免費
- ⚠️ 冷啟動較慢
- ⚠️ 性能較低

---

### 3️⃣ Google Firebase / Google Cloud Run

**Firebase（❌ 不太適合）**：
```
Firebase 主要服務：
├── Hosting ✅ 適合：靜態網站（index.html）
├── Functions ⚠️ 小問題：Node.js 優先，Python 支援有限
├── Firestore ❌ 不適合：資料庫服務
└── Cloud Run ✅ 完美：可運行 Python Flask
```

**Google Cloud Run（✅ 推薦）**：
- ✅ **完美支援**：Docker 容器，支援任何語言
- ✅ **按需計費**：只在使用時收費
- ✅ **免費額度**：每月 200 萬次請求免費
- ✅ **自動擴展**：流量大時自動擴展

**免費方案**：
- 💰 每月 $300 新用戶免費額度（3個月）
- 📊 200 萬次請求/月（永久免費）
- ⏰ 36 萬 GB-秒/月
- 💾 2,000,000 次請求

**部署需求**：
1. 需要創建 `Dockerfile`
2. 需要 Google Cloud 帳號
3. 需要安裝 `gcloud` CLI

**複雜度**：⭐⭐⭐⭐（較複雜）

---

### 4️⃣ Microsoft Azure

**Azure App Service（✅ 可用）**：
- ✅ **原生支援 Python**
- ✅ **免費方案**（F1）
- ✅ **整合 VS Code**
- ✅ **企業級穩定**

**免費方案（F1）**：
- 💰 完全免費
- 💾 1GB 磁碟空間
- ⏰ 60 分鐘/天 CPU 時間（有限制）
- 🌐 共用域名

**Azure Container Instances（✅ 推薦）**：
- ✅ **支援 Docker**
- ✅ **按秒計費**
- ✅ **彈性擴展**

**免費額度**：
- 💰 新用戶 $200 免費額度（30天）
- 📊 第一年多項服務免費

**複雜度**：⭐⭐⭐⭐（較複雜）

**Azure Functions（⚠️ 有限制）**：
- ⚠️ 主要為 Serverless
- ⚠️ 有執行時間限制（5-10分鐘）
- ⚠️ 不適合長時間運行的爬蟲

---

### 5️⃣ Vercel（❌ 不適合）

**限制**：
- ❌ **只支援 Node.js** Serverless Functions
- ❌ 不支援 Python Flask（除非改寫）
- ✅ 適合：Next.js、靜態網站

**如果要用 Vercel**：
需要改用：
- Next.js API Routes（改寫為 JavaScript/TypeScript）
- 或 Vercel 的 Python Functions（有限制）

---

### 6️⃣ Heroku（⚠️ 已取消免費方案）

**狀況**：
- ❌ **2022年11月起不再提供免費方案**
- 💰 最低 $7/月（Eco Dynos）
- ✅ 仍然很穩定可靠

---

## 📊 完整比較表

| 平台 | Python支援 | 免費方案 | 複雜度 | 冷啟動 | 推薦度 |
|------|----------|---------|--------|-------|-------|
| **Railway** | ✅ 完美 | ✅ $5/月額度 | ⭐ 簡單 | ⚡ 快 | ⭐⭐⭐⭐⭐ |
| **Render** | ✅ 完美 | ✅ 永久免費 | ⭐⭐ 中等 | 🐢 慢 | ⭐⭐⭐⭐ |
| **Google Cloud Run** | ✅ 完美 | ✅ 200萬次/月 | ⭐⭐⭐⭐ 複雜 | ⚡ 快 | ⭐⭐⭐⭐ |
| **Azure App Service** | ✅ 完美 | ✅ F1 免費 | ⭐⭐⭐ 中等 | ⚡ 快 | ⭐⭐⭐ |
| **Firebase Hosting** | ❌ 靜態only | ✅ 免費 | ⭐ 簡單 | - | ❌ |
| **Vercel** | ❌ 需改寫 | ✅ 免費 | ⭐⭐⭐ | ⚡ 快 | ❌ |
| **Heroku** | ✅ 完美 | ❌ 付費only | ⭐ 簡單 | ⚡ 快 | ⭐⭐ |

---

## 🎯 我的具體建議

### 方案 A：最簡單（初學者）
**選擇：Railway**

**理由**：
1. ✅ 最簡單的部署流程
2. ✅ Git push 即部署
3. ✅ 免費額度充足
4. ✅ 不需要 Docker 知識

**適合**：想快速上線測試

---

### 方案 B：永久免費（預算有限）
**選擇：Render**

**理由**：
1. ✅ 完全免費
2. ✅ 不用擔心額度
3. ⚠️ 接受冷啟動延遲

**適合**：低頻使用、預算為零

---

### 方案 C：企業級（學習目的）
**選擇：Google Cloud Run 或 Azure App Service**

**理由**：
1. ✅ 學習雲端技術
2. ✅ 履歷加分
3. ✅ 未來可擴展
4. ⚠️ 設定較複雜

**適合**：想深入學習雲端技術

---

## 🚀 Railway 部署教學（推薦）

### 準備工作

1. **創建 GitHub 倉庫**（如果還沒有）
2. **註冊 Railway**（https://railway.app）
3. **添加必要檔案**

需要新增的檔案：

**`runtime.txt`**（指定 Python 版本）：
```
python-3.11.0
```

**`Procfile`**（告訴 Railway 如何啟動）：
```
web: python backend/server.py
```

**修改 `server.py` 最後一行**：
```python
if __name__ == '__main__':
    # 從環境變數讀取 PORT
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
```

### 部署步驟

1. **Push 到 GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的帳號/minimalist-dictionary.git
git push -u origin main
```

2. **在 Railway 創建專案**
   - 登入 Railway
   - 點擊 "New Project"
   - 選擇 "Deploy from GitHub repo"
   - 選擇你的倉庫

3. **配置設定**
   - Root Directory: `backend/`（如果後端在子目錄）
   - Railway 會自動偵測 Python

4. **獲取 URL**
   - 部署成功後，Railway 會提供一個網址
   - 例如：`https://minimalist-dictionary-production.up.railway.app`

5. **更新前端**
```javascript
// app.js
const apiUrl = `https://minimalist-dictionary-production.up.railway.app/api/translate?word=${word}`;
```

---

## 💰 成本估算

### 個人使用（每天查詢 100 次）

| 平台 | 月成本 |
|------|-------|
| Railway | $0（免費額度內）|
| Render | $0 |
| Google Cloud Run | $0（遠低於免費額度）|
| Azure | $0（F1 方案）|

### 中度使用（每天查詢 1000 次）

| 平台 | 月成本 |
|------|-------|
| Railway | $0-5 |
| Render | $0（但可能變慢）|
| Google Cloud Run | $0 |
| Azure | 可能超出 F1 限制 |

---

## ❓ 常見問題

### Q: 可以混合使用嗎？
A: 可以！例如：
- 前端：Firebase Hosting（免費、快速）
- 後端：Railway（Python API）

### Q: 哪個最省錢？
A: **Render**（永久免費）或 **Google Cloud Run**（免費額度超大）

### Q: 哪個最簡單？
A: **Railway**（一鍵部署）

### Q: 學習價值最高？
A: **Google Cloud Run** 或 **Azure**（企業常用）

---

## 📚 下一步

選好平台後，我可以協助您：

1. ✅ 準備部署檔案（Dockerfile、Procfile 等）
2. ✅ 設定環境變數
3. ✅ 完整部署教學
4. ✅ 測試和驗證

告訴我您想用哪個平台，我會提供詳細的逐步教學！ 🚀

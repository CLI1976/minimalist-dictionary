# 極簡字典 - Railway 部署完整教學

## 🎯 概述

這份教學將帶您一步步將極簡字典部署到 Railway，讓您可以在任何地方（包括手機）使用。

**預計時間**：15-20 分鐘  
**難度**：⭐⭐（簡單）  
**費用**：免費（Railway 提供每月 $5 免費額度）

---

## 📋 準備清單

### ✅ 您需要準備

1. **GitHub 帳號**（免費）
   - 如果沒有，請到 https://github.com 註冊

2. **Railway 帳號**（免費）
   - 如果沒有，請到 https://railway.app 註冊
   - 可以用 GitHub 帳號直接登入

3. **Git 已安裝**
   - 檢查：在終端機執行 `git --version`
   - 如果沒有，下載：https://git-scm.com/downloads

4. **專案檔案**
   - 就是您目前的 `minimalist-dictionary` 資料夾

---

## 📁 必要檔案檢查

我已經為您準備好所有必要檔案，請確認以下檔案存在：

```
minimalist-dictionary/
├── Procfile              ✅ (新增) - 告訴 Railway 如何啟動
├── runtime.txt           ✅ (新增) - 指定 Python 版本
├── railway.json          ✅ (新增) - Railway 配置（可選）
├── index.html            ✅ 
├── style.css             ✅ 
├── app.js                ✅ (稍後需修改 API URL)
└── backend/
    ├── server.py         ✅ (已修改支援 Railway)
    └── requirements.txt  ✅ 
```

---

## 🚀 部署步驟

### 步驟 1：創建 GitHub 倉庫

#### 1.1 在 GitHub 創建新倉庫

1. 登入 GitHub
2. 點擊右上角 `+` → `New repository`
3. 填寫資訊：
   - **Repository name**: `minimalist-dictionary`
   - **Description**: `極簡英中字典 - 支援任意單字查詢和美式發音`
   - **Public** 或 **Private**（都可以）
   - ✅ **不要**勾選 "Initialize with README"
4. 點擊 `Create repository`

#### 1.2 初始化本地 Git（如果還沒有）

打開終端機，切換到專案目錄：

```powershell
cd C:\Users\xray\.gemini\antigravity\scratch\minimalist-dictionary
```

初始化 Git 倉庫：

```powershell
git init
```

#### 1.3 添加所有檔案

```powershell
git add .
```

#### 1.4 提交

```powershell
git commit -m "Initial commit: 極簡字典完整功能"
```

#### 1.5 連接到 GitHub

將下面的 URL 替換為您的 GitHub 倉庫 URL：

```powershell
git remote add origin https://github.com/您的帳號/minimalist-dictionary.git
```

#### 1.6 推送到 GitHub

```powershell
# 如果是第一次 push，可能需要設定分支
git branch -M main
git push -u origin main
```

如果遇到認證問題，GitHub 現在需要使用 **Personal Access Token**：
1. 到 GitHub Settings → Developer settings → Personal access tokens
2. 生成新 token（勾選 `repo` 權限）
3. 複製 token（只會顯示一次）
4. 在 push 時用 token 作為密碼

---

### 步驟 2：在 Railway 部署

#### 2.1 登入 Railway

1. 前往 https://railway.app
2. 點擊 `Login` 或 `Start a New Project`
3. 選擇用 **GitHub 登入**（推薦）

#### 2.2 創建新專案

1. 登入後，點擊 `New Project`
2. 選擇 `Deploy from GitHub repo`

#### 2.3 授權 Railway 訪問 GitHub

1. 如果是第一次，會要求授權
2. 點擊 `Configure GitHub App`
3. 選擇授權所有倉庫或只授權 `minimalist-dictionary`

#### 2.4 選擇倉庫

1. 在列表中找到 `minimalist-dictionary`
2. 點擊倉庫名稱

#### 2.5 配置部署設定

Railway 會自動偵測 Python 專案，但我們需要確認：

1. **Root Directory**（根目錄）：
   - 保持空白或設為 `/`
   - Railway 會自動找到 `backend/` 資料夾

2. **Build Command**（構建命令）：
   - Railway 會自動執行 `pip install -r backend/requirements.txt`

3. **Start Command**（啟動命令）：
   - Railway 會讀取 `Procfile`
   - 應該顯示：`cd backend && python server.py`

#### 2.6 開始部署

1. 點擊 `Deploy`
2. Railway 會開始構建和部署
3. 您可以看到即時日誌

**部署過程**（約 2-3 分鐘）：
```
✓ Cloning repository
✓ Installing Python 3.11.0
✓ Installing dependencies from requirements.txt
✓ Starting application
✓ Deployment successful
```

#### 2.7 獲取部署 URL

1. 部署成功後，點擊 `Settings` 標籤
2. 找到 `Domains` 區塊
3. 點擊 `Generate Domain`
4. Railway 會自動生成一個 URL，例如：
   ```
   https://minimalist-dictionary-production.up.railway.app
   ```
5. **複製這個 URL**（稍後需要用到）

#### 2.8 測試後端 API

在瀏覽器中測試：
```
https://您的Railway網址/api/health
```

應該看到：
```json
{
  "status": "ok",
  "message": "極簡字典 API 運行中"
}
```

再測試翻譯 API：
```
https://您的Railway網址/api/translate?word=hello
```

應該看到：
```json
{
  "word": "hello",
  "translations": ["你好", "您好", "哈囉"],
  "audio_url": "https://dictionary.cambridge.org/media/english/us_pron/.../hello.mp3",
  "source": "Cambridge Dictionary"
}
```

---

### 步驟 3：更新前端連接到 Railway

#### 3.1 修改 app.js

找到 `app.js` 中的這一行：

```javascript
const apiUrl = `http://localhost:5000/api/translate?word=${encodeURIComponent(word)}`;
```

改為（使用您的 Railway URL）：

```javascript
const apiUrl = `https://minimalist-dictionary-production.up.railway.app/api/translate?word=${encodeURIComponent(word)}`;
```

> ⚠️ **重要**：記得把 URL 改成您自己的 Railway 網址！

#### 3.2 保存並測試

1. 保存 `app.js`
2. 在瀏覽器中開啟 `index.html`
3. 測試查詢單字（例如 "hello"）
4. 點擊發音按鈕測試音檔

---

### 步驟 4：部署前端到 GitHub Pages（可選）

如果您想讓前端也有一個固定網址：

#### 4.1 提交更新

```powershell
git add app.js
git commit -m "Update API URL to Railway"
git push
```

#### 4.2 啟用 GitHub Pages

1. 到 GitHub 倉庫頁面
2. 點擊 `Settings`
3. 左側選單選擇 `Pages`
4. 在 `Source` 選擇 `main` 分支
5. 資料夾選擇 `/ (root)`
6. 點擊 `Save`

#### 4.3 獲取網址

1. 幾分鐘後，GitHub Pages 會顯示網址
2. 通常是：`https://您的帳號.github.io/minimalist-dictionary/`
3. 現在您可以在任何裝置上使用這個網址！

---

## 📱 在手機上使用

### 方法 1：直接訪問 GitHub Pages

在手機瀏覽器輸入：
```
https://您的帳號.github.io/minimalist-dictionary/
```

### 方法 2：添加到主畫面（PWA）

**iOS（Safari）**：
1. 開啟字典網址
2. 點擊分享按鈕
3. 選擇「加入主畫面」
4. 完成！現在有一個字典 App 圖示了

**Android（Chrome）**：
1. 開啟字典網址
2. 點擊選單（三個點）
3. 選擇「新增至主畫面」
4. 完成！

---

## 🔧 維護和更新

### 如何更新代碼？

1. **修改代碼**
2. **提交到 Git**：
   ```powershell
   git add .
   git commit -m "更新說明"
   git push
   ```
3. **Railway 自動部署**：
   - Railway 會自動偵測 GitHub 更新
   - 自動重新部署
   - 無需手動操作！

### 查看部署日誌

1. 登入 Railway
2. 選擇您的專案
3. 點擊 `Deployments` 標籤
4. 查看每次部署的日誌

---

## 💰 費用和限制

### Railway 免費方案

- 💰 **每月 $5 免費額度**
- ⏰ **500 小時執行時間**
- 💾 **512MB RAM**
- 🌐 **100GB 流量**

### 個人使用估算

假設每天使用 1 小時：
- 每月約 30 小時
- 遠低於 500 小時限制
- **完全免費** ✅

### 如果超出免費額度

- Railway 會發email通知
- 可以升級到付費方案（$5/月起）
- 或等下月額度重置

---

## 🐛 故障排除

### 問題 1：部署失敗

**檢查**：
1. Railway 部署日誌中的錯誤訊息
2. 確認 `requirements.txt` 無誤
3. 確認 Python 版本正確

**解決**：
```powershell
# 重新推送
git add .
git commit -m "Fix deployment"
git push
```

### 問題 2：API 返回 404

**檢查**：
1. Railway URL 是否正確
2. 路徑是否包含 `/api/translate`
3. Railway 服務是否運行中

**解決**：
- 到 Railway 控制台檢查服務狀態
- 點擊 `Restart` 重啟服務

### 問題 3：CORS 錯誤

**錯誤訊息**：
```
Access to fetch at 'https://...' has been blocked by CORS policy
```

**解決**：
確認 `server.py` 中有：
```python
from flask_cors import CORS
CORS(app)
```

### 問題 4：音檔無法播放

**檢查**：
1. 瀏覽器 Console 中的音檔 URL
2. 嘗試直接訪問音檔 URL
3. 確認網路連線

**可能原因**：
- Cambridge 網站暫時無法訪問
- 會自動回退到 Web Speech API

---

## ✅ 驗證清單

部署完成後，請逐一檢查：

- [ ] Railway 服務狀態為 "Active"
- [ ] 訪問 `/api/health` 返回正常
- [ ] 訪問 `/api/translate?word=hello` 返回翻譯
- [ ] 前端可以查詢單字
- [ ] 發音功能正常
- [ ] 在手機瀏覽器中可以訪問
- [ ] 音檔播放正常

---

## 🎉 完成！

恭喜！您的極簡字典現在已經部署到雲端了！

**您現在可以**：
- ✅ 在任何裝置上使用
- ✅ 分享給朋友使用
- ✅ 隨時隨地查詢單字
- ✅ 享受真實美式發音

**下一步建議**：
1. 添加更多功能（例如查詢歷史）
2. 優化樣式（深色模式）
3. 加入更多字典來源
4. 建立使用統計

---

## 📞 需要幫助？

如果遇到任何問題：
1. 檢查 Railway 部署日誌
2. 查看瀏覽器 Console 錯誤
3. 參考本文件的「故障排除」區塊
4. 隨時向我提問！

祝您使用愉快！ 🚀

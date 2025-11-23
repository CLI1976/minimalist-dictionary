# 極簡字典 Minimalist Dictionary

英中字典 Web 應用，支援任意單字查詢、繁體中文翻譯和美式發音。

## 部署到 Railway

此專案已配置好可直接部署到 Railway。

### 環境需求
- Python 3.11
- Flask 3.0.0

### 啟動命令
```
python backend/server.py
```

## API 端點

- `GET /api/health` - 健康檢查
- `GET /api/translate?word={單字}` - 查詢翻譯和音檔

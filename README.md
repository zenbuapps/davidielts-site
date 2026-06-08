# Ace Your IELTS 雅思衝刺班網站

這是一套多頁靜態網站，可以直接用瀏覽器開啟 `public/index.html` 預覽。

## 頁面（位於 `public/`）

- `index.html`：首頁
- `courses.html`：完整課程資源
- `team.html`：顧問團隊
- `results.html`：學員回饋
- `enroll.html`：報名資訊與報名表單

## 結構

- `public/`：對外發佈的網站內容（Cloudflare 只服務這個資料夾）
- `public/css/styles.css`：依區塊整理的共享樣式，方便後續轉 Greenshift
- `public/js/main.js`：手機選單、課程 tabs、靜態表單互動
- `public/assets/images/`：客戶素材與壓縮後頁面圖片
- `public/assets/generated/`：AI 生成首頁主視覺
- `reference/`：參考頁、規範與 QA 截圖留存（不發佈）

## 部署（Cloudflare Workers 靜態資源）

- 設定檔：`wrangler.jsonc`（Worker 名稱 `davidielts-site`，自訂網域 `davidielts.com` / `www.davidielts.com`）
- 與 GitHub 同步：透過 Cloudflare **Workers Builds**，推送到 `main` 即自動部署。
- 本機手動部署：`CLOUDFLARE_ACCOUNT_ID=<account> npx wrangler deploy`

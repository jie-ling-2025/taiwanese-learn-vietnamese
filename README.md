# 台灣人學越南語

獨立的 Vite／React 網站，以繁體中文提示練習照顧情境中的越南語。教材唯讀載入原網站目前提供的核准資料；載入失敗時不顯示快取或其他教材。

## 本機預覽

```powershell
npm ci
npm run dev
```

終端機會顯示本機預覽網址。每張越南語句卡都可嘗試使用瀏覽器／裝置的 `vi-VN` 語音播放。若沒有越南語語音，請在 Windows 語音設定安裝越南語語音後重新整理。

## 密碼保護與 GitHub Pages

部署建置使用 PageCrypt。請在**新 GitHub 儲存庫**設定 Repository secret `SITE_PASSWORD`，內容填入與舊網站相同的密碼；Secret 不會在不同儲存庫間共用。不要把密碼寫入原始碼、提交檔案或貼在對話中。

啟用 GitHub Pages 的 GitHub Actions 部署來源後，推送 `main` 分支會觸發 `.github/workflows/deploy-pages.yml`。網站 base path 預設為 `/taiwanese-learn-vietnamese/`。


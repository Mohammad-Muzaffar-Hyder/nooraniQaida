# Noorani Qaida

Noorani Qaida (Indian edition) as a page-turning web app. It has all 27 takhtis with English and Hinglish reading help, quizzes and tajweed colours. It can be installed on Android and iPhone, and works offline.

## One-time setup: GitHub and Vercel

1. Create a new repository on GitHub, such as `noorani-qaida`. Leave it empty, with no README.
2. Upload this folder to the repository. Either:
   - In the terminal:
     ```bash
     cd noorani-qaida
     git init
     git add .
     git commit -m "Noorani Qaida web app"
     git branch -M main
     git remote add origin https://github.com/<you>/noorani-qaida.git
     git push -u origin main
     ```
   - Or on github.com, click **Add file → Upload files** and drag in everything from this folder.
3. On vercel.com, click **Add New… → Project**, choose the repository, and click **Deploy**. The settings come from `vercel.json`, so nothing needs changing.

From then on, every push to `main` deploys automatically, usually within a minute.

## Updating later

Edit the files in `src/`, then:
```bash
node scripts/check.mjs   # catches mistakes before they go live
git add . && git commit -m "Fix Takhti 12 word" && git push
```
`CLAUDE.md` explains how the project is organised and how to edit each kind of content. Claude reads it automatically if you open this folder with Claude.

People who installed the app get the update the next time they open it online. They see a **Refresh** prompt.

## Installing on a phone

- **Android (Chrome):** open the site and tap **Install app** on the cover or in Settings. Chrome's own menu **⋮ → Add to Home screen** also works.
- **iPhone / iPad (Safari):** tap **Install app**, which shows the steps. In short: **Share → Add to Home Screen → Add**.

Open it once while online, and after that it works without internet.

Developed by **m2hxa**.

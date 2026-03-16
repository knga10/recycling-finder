# ♻️ Can I Recycle This? — Deploy Guide

A searchable directory of Australian household recycling and take-back programs,
with AI-powered search, public submissions, admin review, and automated status checks.

---

## Before you start — what you'll need

- A free [GitHub](https://github.com) account
- A free [Vercel](https://vercel.com) account (sign up with your GitHub account — easiest)
- An [Anthropic API key](https://console.anthropic.com) (you'll need to add a small amount of credit — searches cost fractions of a cent each)

---

## Step 1 — Get the code onto GitHub

1. Go to [github.com](https://github.com) and sign in
2. Click the **+** button (top right) → **New repository**
3. Name it `recycling-finder`, set it to **Public**, click **Create repository**
4. On the next screen, click **uploading an existing file**
5. Upload ALL files from this folder, keeping the folder structure:
   ```
   index.html
   vite.config.js
   package.json
   vercel.json
   .gitignore
   src/
     main.jsx
     App.jsx
   api/
     claude.js
   ```
6. Click **Commit changes**

---

## Step 2 — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New… → Project**
3. Find your `recycling-finder` repo and click **Import**
4. Vercel will auto-detect it as a Vite project — leave all settings as-is
5. Click **Deploy**
6. Wait ~60 seconds — Vercel builds and deploys automatically

Your app is now live! But search won't work yet — you need to add your API key.

---

## Step 3 — Add your Anthropic API key

This keeps your key secure on Vercel's servers (never exposed to users).

1. In Vercel, open your project dashboard
2. Go to **Settings → Environment Variables**
3. Click **Add New**
4. Set:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your key (starts with `sk-ant-...`)
   - **Environment:** tick all three (Production, Preview, Development)
5. Click **Save**
6. Go to **Deployments** tab → click the three dots on your latest deployment → **Redeploy**

Search will now work.

---

## Step 4 — Change the admin password (important!)

Before sharing publicly, update the admin password:

1. Open `src/App.jsx` in GitHub (click the file → pencil icon to edit)
2. Find line: `const ADMIN_PASSWORD = "recycle2026";`
3. Change `recycle2026` to your own password
4. Click **Commit changes**
5. Vercel will automatically redeploy within ~60 seconds

---

## Your live URL

Vercel gives you a URL like: `https://recycling-finder-abc123.vercel.app`

You can also add a custom domain in Vercel under **Settings → Domains**.

---

## How the app works

| Feature | Detail |
|---|---|
| **Search** | Claude matches natural language queries against all programs |
| **Add Program** | Anyone can submit — goes live immediately, flagged Unverified |
| **Admin panel** | Password-protected; verify/remove submissions, re-check program status |
| **Auto status check** | On load, programs not checked in 7 days are sent to Claude for an active/inactive assessment |
| **Storage** | Programs saved in each user's browser localStorage |

---

## Updating programs

To add or edit seed programs permanently (for all users), edit the `SEED_PROGRAMS` array
in `src/App.jsx` directly in GitHub. Vercel will redeploy automatically.

---

## Costs

- **Vercel:** Free tier is more than enough for this app
- **Anthropic API:** Each search costs ~$0.001–0.003 AUD. Status checks on load cost slightly more.
  Monitor usage at [console.anthropic.com](https://console.anthropic.com)

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

## 🌐 URL Scraper

The app includes a built-in scraper tool (🌐 Scraper tab) that lets you paste URLs of recycling
program pages. For each URL it:

1. Fetches the page server-side (no CORS issues)
2. Strips HTML noise down to readable text
3. Sends it to Claude to extract: company, program name, items accepted, cost, reward, how to participate, and what happens to waste
4. Shows you a preview so you can review before adding to the database

All scraped programs are marked **Unverified** and appear in the Admin panel for review.

**Tips:**
- Link directly to the recycling/sustainability page, not the homepage
- Search Google for `"[brand] recycling program Australia"` to find the right pages
- You can paste up to ~20 URLs at once



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

---

## Feedback tab + Email notifications setup

This version adds:
- A **💬 Feedback** tab with 3 user survey questions
- Responses saved to Google Sheets automatically
- Email notifications via Resend:
  - Every 5 new feedback responses → email to kngaproduct2@gmail.com
  - When 5+ programs are unreviewed → email (max once per 24h)

### Step A — Google Sheet setup

1. Open your sheet: https://docs.google.com/spreadsheets/d/1IALtYp9ifx_rfwrbWJOCldLiEv6kgM43C8UAxNn6OtQ/edit
2. Rename Sheet1 tab to **Sheet1** (keep as-is if already named that)
3. Add these headers in Row 1, columns A–F:
   `Timestamp | Search usefulness | Features wanted | Recommend barrier | Status | Notes`
4. For Status column (E): select the column → Data → Data validation → Dropdown → add: `Pending, Reviewed, Backlog`

### Step B — Google Service Account (so the app can write to your Sheet)

1. Go to https://console.cloud.google.com
2. Create a new project (or use existing)
3. Enable **Google Sheets API**: APIs & Services → Enable APIs → search "Google Sheets API" → Enable
4. Create a service account: APIs & Services → Credentials → Create Credentials → Service Account
   - Name it `recycling-finder`, click Create, skip optional steps, Done
5. Click the service account → Keys tab → Add Key → JSON → download the file
6. Open the JSON file — copy the entire contents
7. Share your Google Sheet with the service account email (looks like `recycling-finder@your-project.iam.gserviceaccount.com`) — give it **Editor** access

### Step C — Add environment variables to Vercel

In your Vercel project → Settings → Environment Variables, add these 4 vars:

| Name | Value |
|---|---|
| `ANTHROPIC_API_KEY` | your existing Claude key |
| `RESEND_API_KEY` | re_bXFQDnsM_DiUBkSdRPCa1PPpKG4gNPRwD |
| `GOOGLE_SHEET_ID` | 1IALtYp9ifx_rfwrbWJOCldLiEv6kgM43C8UAxNn6OtQ |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | paste the entire contents of the JSON file downloaded in Step B |
| `APP_URL` | your Vercel app URL e.g. https://recycling-finder.vercel.app |

Then **redeploy** from the Deployments tab.

### Step D — Verify Resend sender

Resend's free tier sends from `onboarding@resend.dev` by default — no DNS setup needed.
To send from your own domain later, add it under Resend → Domains.

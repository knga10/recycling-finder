# ♻️ Can I Recycle This? — Australia

A searchable directory of Australian household recycling and take-back programs. Users type in any item — a frying pan, old mascara, AA batteries, worn-out sneakers — and the app finds which companies will take it back, what it costs, whether there's a reward, and where to drop it off.

---

## What it does

- **AI-powered search** — natural language queries matched against the program database using Claude. Typing "old pan" finds cookware programs; "dead phone" finds electronics recyclers.
- **Program cards** — each result shows items accepted, cost, any reward or discount, what happens to the waste, how to participate, a link to the program website, and a "Find drop-off locations" button where available.
- **Coverage badges** — every program is tagged as Nationwide, Selected locations, or Mail-in so users know upfront whether it's accessible to them.
- **Public submissions** — anyone can submit a new program via the Add tab. Submissions go live immediately and are flagged Unverified for admin review.
- **URL scraper** — paste a list of URLs pointing to recycling program pages; Claude fetches each page, extracts the program details, and lets you add them to the database in bulk.
- **Auto status checks** — on load, any program not checked in the last 7 days is sent to Claude to assess whether it's still active. Possibly inactive programs are flagged with a warning banner.
- **Feedback tab** — three survey questions embedded in the app. Responses are written to a Google Sheet automatically, with a Status column (Pending / Reviewed / Backlog) for actioning.
- **Email notifications** — automated alerts sent via Resend:
  - Every 5 new feedback responses → email to the admin
  - When 5 or more programs are unreviewed → email to the admin (max once per 24 hours)
- **Admin panel** — password-protected dashboard showing pending submissions, flagged inactive programs, and all programs. Verify or remove entries with one click.

---

## How it was built

The app is a single-page React application built with Vite and deployed on Vercel.

**Frontend**
- React with hooks for all state management
- `localStorage` for persistent program data across sessions
- Inline CSS-in-JS styling — no external UI library
- Google Fonts (Syne + DM Sans)

**Backend — Vercel Serverless Functions**
Three API routes handle all server-side logic:

- `/api/claude` — proxies requests to the Anthropic API so the API key is never exposed to the browser. Used for search matching, status checks, and scraper extraction.
- `/api/fetch-url` — fetches external URLs server-side (bypassing browser CORS restrictions) for the scraper feature. Strips HTML noise down to readable text before passing to Claude.
- `/api/notify` — handles feedback submissions and notification emails. Writes rows to Google Sheets via the Sheets API (authenticated via OAuth refresh token), then calls Resend to send email alerts when thresholds are hit.

**Third-party services**
- **Anthropic Claude API** — powers search, status checks, and URL scraping
- **Google Sheets API** — stores feedback responses
- **Resend** — sends notification emails
- **Google OAuth** — authenticates the app to write to Google Sheets without a service account

**Data**
The program database is seeded with 13 verified Australian recycling programs covering cookware, electronics, clothing, beauty, batteries, pharmaceuticals, beverage containers, and hard-to-recycle household items. Programs are stored in localStorage and can be extended via the submission form, URL scraper, or by editing the `SEED_PROGRAMS` array in `src/App.jsx`.

---

## Project structure

```
recycling-app/
├── api/
│   ├── claude.js          # Anthropic API proxy
│   ├── fetch-url.js       # Server-side URL fetcher for scraper
│   └── notify.js          # Google Sheets writer + Resend email notifications
├── src/
│   ├── App.jsx            # Main React app — all views and logic
│   └── main.jsx           # React entry point
├── index.html             # HTML shell
├── vite.config.js         # Vite build config
├── vercel.json            # Vercel routing (SPA fallback)
└── package.json
```

---

## Environment variables required

Set these in Vercel under Settings → Environment Variables:

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Claude API access |
| `RESEND_API_KEY` | Email notifications |
| `GOOGLE_SHEET_ID` | ID of the feedback Google Sheet |
| `GOOGLE_CLIENT_ID` | OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | OAuth client secret |
| `GOOGLE_REFRESH_TOKEN` | OAuth refresh token for Sheets access |
| `APP_URL` | Your live Vercel URL (used in email links) |

---

## Use case

Built to make it easier for Australians to find responsible ways to dispose of household items that don't belong in general waste or kerbside recycling. The goal is a community-maintained, always-current directory — anyone can submit a program they know about, and the admin can verify and curate the database over time.

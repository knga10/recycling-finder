// Force Node.js runtime (not Edge) — ensures req.body is parsed automatically
export const config = { runtime: 'nodejs' }

export default async function handler(req, res) {
  console.log('[notify] invoked — method:', req.method)

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Safely parse body — Vercel Node runtime auto-parses JSON but guard anyway
  let body = req.body
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch (e) {
      console.error('[notify] body parse error:', e.message)
      return res.status(400).json({ error: 'Invalid JSON body' })
    }
  }
  if (!body || typeof body !== 'object') {
    console.error('[notify] no body received, typeof:', typeof body)
    return res.status(400).json({ error: 'Empty body' })
  }

  console.log('[notify] body keys:', Object.keys(body))

  const { type, data } = body

  // Check env vars are present
  const envCheck = {
    hasClientId:     !!process.env.GOOGLE_CLIENT_ID,
    hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    hasRefreshToken: !!process.env.GOOGLE_REFRESH_TOKEN,
    hasSheetId:      !!process.env.GOOGLE_SHEET_ID,
    hasResendKey:    !!process.env.RESEND_API_KEY,
  }
  console.log('[notify] env check:', JSON.stringify(envCheck))

  const missingEnv = Object.entries(envCheck).filter(([, v]) => !v).map(([k]) => k)
  if (missingEnv.length > 0) {
    console.error('[notify] missing env vars:', missingEnv)
    return res.status(500).json({ error: 'Missing env vars', missing: missingEnv })
  }

  if (type === 'feedback') {
    const { searchUsefulness, featuresWanted, recommendBarrier, timestamp } = data || {}

    // Step 1: Get OAuth token
    console.log('[notify] fetching OAuth token…')
    let token
    try {
      token = await getAccessToken()
      console.log('[notify] token OK, length:', token?.length)
    } catch (err) {
      console.error('[notify] OAuth FAILED:', err.message)
      return res.status(500).json({ error: 'OAuth failed', detail: err.message })
    }

    // Step 2: Append to Sheet
    const row = [
      timestamp || new Date().toISOString(),
      searchUsefulness || '',
      Array.isArray(featuresWanted) ? featuresWanted.join(', ') : (featuresWanted || ''),
      recommendBarrier || '',
      'Pending',
      ''
    ]
    console.log('[notify] appending row:', JSON.stringify(row))

    const sheetResult = await appendToSheet(row, token)
    console.log('[notify] sheet result:', JSON.stringify(sheetResult))

    if (!sheetResult.ok) {
      return res.status(500).json({ error: 'Sheet write failed', detail: sheetResult.error })
    }

    // Step 3: Check count and maybe send email
    const countResult = await getSheetRowCount(token)
    console.log('[notify] row count:', JSON.stringify(countResult))

    if (countResult.ok && countResult.count > 0 && countResult.count % 5 === 0) {
      console.log('[notify] sending feedback email, count:', countResult.count)
      const emailResult = await sendEmail({
        to: 'kngaproduct2@gmail.com',
        subject: `♻️ Recycling Finder — ${countResult.count} feedback responses received`,
        html: feedbackEmailHtml(countResult.count),
      })
      console.log('[notify] email result:', JSON.stringify(emailResult))
    }

    return res.status(200).json({ ok: true, rowCount: countResult.count })
  }

  if (type === 'program_review_check') {
    const { unverifiedCount, lastNotifiedAt } = data || {}
    const hoursSince = lastNotifiedAt
      ? (Date.now() - new Date(lastNotifiedAt).getTime()) / 3600000
      : Infinity

    console.log('[notify] program check — unverified:', unverifiedCount, 'hoursSince:', hoursSince)

    if (unverifiedCount >= 5 && hoursSince > 24) {
      let token
      try { token = await getAccessToken() } catch (err) {
        return res.status(500).json({ error: 'OAuth failed', detail: err.message })
      }
      const emailResult = await sendEmail({
        to: 'kngaproduct2@gmail.com',
        subject: `♻️ Recycling Finder — ${unverifiedCount} programs waiting for review`,
        html: programReviewEmailHtml(unverifiedCount),
      })
      console.log('[notify] program review email:', JSON.stringify(emailResult))
      return res.status(200).json({ ok: true, sent: true })
    }

    return res.status(200).json({ ok: true, sent: false })
  }

  console.error('[notify] unknown type:', type)
  return res.status(400).json({ error: 'Unknown type', received: type })
}

// ── Google OAuth (refresh token) ───────────────────────────────────────────

async function getAccessToken() {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      grant_type:    'refresh_token',
    }),
  })

  const data = await res.json()
  console.log('[notify] OAuth status:', res.status, '— has token:', !!data.access_token, '— error:', data.error || 'none')

  if (!data.access_token) {
    throw new Error(`OAuth error: ${data.error} — ${data.error_description}`)
  }
  return data.access_token
}

// ── Google Sheets ──────────────────────────────────────────────────────────

async function appendToSheet(row, token) {
  try {
    const sheetId = process.env.GOOGLE_SHEET_ID
    const range = encodeURIComponent('Sheet1!A:F')
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values: [row] }),
    })

    const text = await response.text()
    console.log('[notify] sheets status:', response.status, '— response:', text.slice(0, 400))

    if (!response.ok) return { ok: false, error: text }
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err.message }
  }
}

async function getSheetRowCount(token) {
  try {
    const sheetId = process.env.GOOGLE_SHEET_ID
    const range = encodeURIComponent('Sheet1!A:A')
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await response.json()
    const count = Math.max((data.values?.length || 1) - 1, 0)
    return { ok: true, count }
  } catch (err) {
    return { ok: false, error: err.message, count: 0 }
  }
}

// ── Resend Email ───────────────────────────────────────────────────────────

async function sendEmail({ to, subject, html }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Recycling Finder <onboarding@resend.dev>',
      to,
      subject,
      html,
    }),
  })
  return res.json()
}

// ── Email templates ────────────────────────────────────────────────────────

function feedbackEmailHtml(count) {
  const sheetUrl = `https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEET_ID}/edit`
  return `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#f7f5f0;border-radius:16px">
      <div style="font-size:2rem;margin-bottom:12px">♻️</div>
      <h2 style="color:#2d6a2d;margin:0 0 8px">New feedback milestone</h2>
      <p style="color:#374151;margin:0 0 20px">Your Recycling Finder has received <strong>${count} feedback responses</strong> — time to review!</p>
      <a href="${sheetUrl}" style="display:inline-block;background:#2d6a2d;color:#fff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:600">Open Google Sheet →</a>
      <p style="color:#9ca3af;font-size:0.8rem;margin-top:24px">You'll receive another notification after every 5 new responses.</p>
    </div>`
}

function programReviewEmailHtml(count) {
  const appUrl = process.env.APP_URL || 'https://your-app.vercel.app'
  return `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#f7f5f0;border-radius:16px">
      <div style="font-size:2rem;margin-bottom:12px">🛡️</div>
      <h2 style="color:#e65100;margin:0 0 8px">Programs waiting for review</h2>
      <p style="color:#374151;margin:0 0 20px">There are <strong>${count} unverified programs</strong> in your Recycling Finder database waiting for your attention.</p>
      <a href="${appUrl}" style="display:inline-block;background:#2d6a2d;color:#fff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:600">Open Admin Panel →</a>
      <p style="color:#9ca3af;font-size:0.8rem;margin-top:24px">This notification won't repeat for 24 hours.</p>
    </div>`
}

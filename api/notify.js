export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { type, data } = req.body
  // type: 'feedback' | 'program_review_check'

  if (type === 'feedback') {
    const { searchUsefulness, featuresWanted, recommendBarrier, timestamp } = data

    // 1. Append to Google Sheet
    const sheetResult = await appendToSheet([
      timestamp || new Date().toISOString(),
      searchUsefulness || '',
      Array.isArray(featuresWanted) ? featuresWanted.join(', ') : (featuresWanted || ''),
      recommendBarrier || '',
      'Pending',
      ''
    ])

    if (!sheetResult.ok) {
      return res.status(500).json({ error: 'Failed to write to sheet', detail: sheetResult.error })
    }

    // 2. Check if we should send a feedback notification
    // Get current row count to see if we've hit a multiple of 5
    const countResult = await getSheetRowCount()
    if (countResult.ok && countResult.count % 5 === 0) {
      await sendEmail({
        to: 'kngaproduct2@gmail.com',
        subject: `♻️ Recycling Finder — ${countResult.count} feedback responses received`,
        html: feedbackEmailHtml(countResult.count),
      })
    }

    return res.status(200).json({ ok: true })
  }

  if (type === 'program_review_check') {
    // Called from the app when unverified program count hits 5+
    const { unverifiedCount, lastNotifiedAt } = data

    // Only send if 5+ unreviewed AND haven't notified in last 24h
    const hoursSinceLastNotify = lastNotifiedAt
      ? (Date.now() - new Date(lastNotifiedAt).getTime()) / (1000 * 60 * 60)
      : Infinity

    if (unverifiedCount >= 5 && hoursSinceLastNotify > 24) {
      await sendEmail({
        to: 'kngaproduct2@gmail.com',
        subject: `♻️ Recycling Finder — ${unverifiedCount} programs waiting for review`,
        html: programReviewEmailHtml(unverifiedCount),
      })
      return res.status(200).json({ ok: true, sent: true })
    }

    return res.status(200).json({ ok: true, sent: false })
  }

  return res.status(400).json({ error: 'Unknown type' })
}

// ── Google Sheets ──────────────────────────────────────────────────────────

async function getAccessToken() {
  const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }

  const header = { alg: 'RS256', typ: 'JWT' }
  const encode = (obj) => btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')

  const signingInput = `${encode(header)}.${encode(payload)}`

  // Sign with RS256 using Web Crypto
  const pemKey = serviceAccount.private_key
  const pemBody = pemKey.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\n/g, '')
  const binaryKey = Uint8Array.from(atob(pemBody), c => c.charCodeAt(0))

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8', binaryKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign']
  )

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(signingInput)
  )

  const jwt = `${signingInput}.${btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')}`

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  })

  const tokenData = await tokenRes.json()
  return tokenData.access_token
}

async function appendToSheet(row) {
  try {
    const token = await getAccessToken()
    const sheetId = process.env.GOOGLE_SHEET_ID
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A:F:append?valueInputOption=USER_ENTERED`

    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [row] }),
    })

    if (!response.ok) {
      const err = await response.text()
      return { ok: false, error: err }
    }
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err.message }
  }
}

async function getSheetRowCount() {
  try {
    const token = await getAccessToken()
    const sheetId = process.env.GOOGLE_SHEET_ID
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A:A`

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await response.json()
    // Subtract 1 for header row
    const count = (data.values?.length || 1) - 1
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

function feedbackEmailHtml(count) {
  const sheetUrl = `https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEET_ID}/edit`
  return `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#f7f5f0;border-radius:16px">
      <div style="font-size:2rem;margin-bottom:12px">♻️</div>
      <h2 style="color:#2d6a2d;margin:0 0 8px">New feedback milestone</h2>
      <p style="color:#374151;margin:0 0 20px">Your Recycling Finder has received <strong>${count} feedback responses</strong> — time to review!</p>
      <a href="${sheetUrl}" style="display:inline-block;background:#2d6a2d;color:#fff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:600">Open Google Sheet →</a>
      <p style="color:#9ca3af;font-size:0.8rem;margin-top:24px">You'll get another notification after every 5 new unreviewed responses.</p>
    </div>`
}

function programReviewEmailHtml(count) {
  return `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#f7f5f0;border-radius:16px">
      <div style="font-size:2rem;margin-bottom:12px">🛡️</div>
      <h2 style="color:#e65100;margin:0 0 8px">Programs waiting for review</h2>
      <p style="color:#374151;margin:0 0 20px">There are <strong>${count} unverified programs</strong> in your Recycling Finder database that need your attention.</p>
      <a href="${process.env.APP_URL || 'https://your-app.vercel.app'}/#admin" style="display:inline-block;background:#2d6a2d;color:#fff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:600">Open Admin Panel →</a>
      <p style="color:#9ca3af;font-size:0.8rem;margin-top:24px">This notification won't repeat for 24 hours unless new programs are added.</p>
    </div>`
}

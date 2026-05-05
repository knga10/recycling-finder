export const config = { runtime: 'nodejs' }

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz71tGRDQc4FjvdohmFEHy-LOJdbYr3qw0nu4VjbL-Mc5U2JvhEr6jEG32SaR3q6AM/exec'
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1IALtYp9ifx_rfwrbWJOCldLiEv6kgM43C8UAxNn6OtQ/edit'
const APP_URL = 'https://recycling-finder.vercel.app'

export default async function handler(req, res) {
  console.log('[notify] invoked —', req.method)

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let body = req.body
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch {
      return res.status(400).json({ error: 'Invalid JSON body' })
    }
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Empty body' })
  }

  const { type, data } = body
  console.log('[notify] type:', type)

  // ── Feedback submission ────────────────────────────────────────────────
  if (type === 'feedback') {
    const { searchUsefulness, featuresWanted, recommendBarrier, timestamp } = data || {}

    // Write row to Google Sheet via Apps Script (no OAuth needed)
    let rowCount = 0
    try {
      const scriptRes = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        redirect: 'follow',
        headers: { 'Content-Type': 'text/plain' }, // Apps Script reads postData.contents
        body: JSON.stringify({
          timestamp: timestamp || new Date().toISOString(),
          searchUsefulness: searchUsefulness || '',
          featuresWanted: Array.isArray(featuresWanted) ? featuresWanted.join(', ') : (featuresWanted || ''),
          recommendBarrier: recommendBarrier || '',
        }),
      })
      const scriptData = await scriptRes.json().catch(() => ({}))
      rowCount = scriptData.rowCount || 0
      console.log('[notify] sheet write ok, rowCount:', rowCount)
    } catch (err) {
      console.error('[notify] sheet write failed:', err.message)
      // Non-fatal — still return 200 to user
    }

    // Send milestone email every 5 responses
    if (rowCount > 0 && rowCount % 5 === 0) {
      try {
        await sendEmail({
          to: 'kngaproduct2@gmail.com',
          subject: `♻️ Recycling Finder — ${rowCount} feedback responses received`,
          html: feedbackEmailHtml(rowCount),
        })
        console.log('[notify] milestone email sent for count:', rowCount)
      } catch (err) {
        console.error('[notify] milestone email failed:', err.message)
      }
    }

    return res.status(200).json({ ok: true, rowCount })
  }

  // ── Program review check ───────────────────────────────────────────────
  if (type === 'program_review_check') {
    const { unverifiedCount, lastNotifiedAt } = data || {}
    const hoursSince = lastNotifiedAt
      ? (Date.now() - new Date(lastNotifiedAt).getTime()) / 3600000
      : Infinity

    console.log('[notify] program check — unverified:', unverifiedCount, 'hoursSince:', hoursSince)

    if (unverifiedCount >= 5 && hoursSince > 24) {
      try {
        await sendEmail({
          to: 'kngaproduct2@gmail.com',
          subject: `♻️ Recycling Finder — ${unverifiedCount} programs waiting for review`,
          html: programReviewEmailHtml(unverifiedCount),
        })
        console.log('[notify] program review email sent')
        return res.status(200).json({ ok: true, sent: true })
      } catch (err) {
        console.error('[notify] email failed:', err.message)
        return res.status(500).json({ error: err.message })
      }
    }

    return res.status(200).json({ ok: true, sent: false })
  }

  return res.status(400).json({ error: 'Unknown type', received: type })
}

// ── Resend email ───────────────────────────────────────────────────────────

async function sendEmail({ to, subject, html }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: 'Recycling Finder <onboarding@resend.dev>', to, subject, html }),
  })
  const result = await res.json()
  console.log('[notify] email result:', JSON.stringify(result))
  return result
}

// ── Email templates ────────────────────────────────────────────────────────

function feedbackEmailHtml(count) {
  return `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#f7f5f0;border-radius:16px">
      <div style="font-size:2rem;margin-bottom:12px">♻️</div>
      <h2 style="color:#2d6a2d;margin:0 0 8px">New feedback milestone</h2>
      <p style="color:#374151;margin:0 0 20px">Your Recycling Finder has received <strong>${count} feedback responses</strong> — time to review!</p>
      <a href="${SHEET_URL}" style="display:inline-block;background:#2d6a2d;color:#fff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:600">Open Google Sheet →</a>
      <p style="color:#9ca3af;font-size:0.8rem;margin-top:24px">You'll receive another notification after every 5 new responses.</p>
    </div>`
}

function programReviewEmailHtml(count) {
  return `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#f7f5f0;border-radius:16px">
      <div style="font-size:2rem;margin-bottom:12px">🛡️</div>
      <h2 style="color:#e65100;margin:0 0 8px">Programs waiting for review</h2>
      <p style="color:#374151;margin:0 0 20px">There are <strong>${count} unverified programs</strong> in your Recycling Finder database waiting for your attention.</p>
      <a href="${APP_URL}" style="display:inline-block;background:#2d6a2d;color:#fff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:600">Open Admin Panel →</a>
      <p style="color:#9ca3af;font-size:0.8rem;margin-top:24px">This notification won't repeat for 24 hours.</p>
    </div>`
}

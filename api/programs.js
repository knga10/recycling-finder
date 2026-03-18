// Force Node.js runtime
export const config = { runtime: 'nodejs' }

const KV_URL = process.env.RECYCLING_FINDER_STORAGE_KV_REST_API_URL
const KV_TOKEN = process.env.RECYCLING_FINDER_STORAGE_KV_REST_API_TOKEN
const PROGRAMS_KEY = 'programs'

// ── Upstash Redis REST API helpers ─────────────────────────────────────────

async function kvGet(key) {
  const res = await fetch(`${KV_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
  })
  const data = await res.json()
  return data.result ? JSON.parse(data.result) : null
}

async function kvSet(key, value) {
  const res = await fetch(`${KV_URL}/set/${key}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(JSON.stringify(value)),
  })
  return res.json()
}

// ── Handler ────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  console.log('[programs] invoked —', req.method)

  if (!KV_URL || !KV_TOKEN) {
    console.error('[programs] missing KV env vars')
    return res.status(500).json({ error: 'KV not configured' })
  }

  // GET — return all programs
  if (req.method === 'GET') {
    try {
      const programs = await kvGet(PROGRAMS_KEY)
      return res.status(200).json({ programs: programs || [] })
    } catch (err) {
      console.error('[programs] GET error:', err.message)
      return res.status(500).json({ error: err.message })
    }
  }

  // POST — write programs (full replace) or single add/update/remove
  if (req.method === 'POST') {
    let body = req.body
    if (typeof body === 'string') {
      try { body = JSON.parse(body) } catch {
        return res.status(400).json({ error: 'Invalid JSON' })
      }
    }

    const { action, programs, program } = body

    try {
      // action: 'seed' — write full array (used on first load)
      if (action === 'seed') {
        await kvSet(PROGRAMS_KEY, programs)
        console.log('[programs] seeded', programs.length, 'programs')
        return res.status(200).json({ ok: true })
      }

      // action: 'add' — append a single program
      if (action === 'add') {
        const current = await kvGet(PROGRAMS_KEY) || []
        const updated = [...current, program]
        await kvSet(PROGRAMS_KEY, updated)
        console.log('[programs] added:', program.company)
        return res.status(200).json({ ok: true, count: updated.length })
      }

      // action: 'update' — replace one program by id
      if (action === 'update') {
        const current = await kvGet(PROGRAMS_KEY) || []
        const updated = current.map(p => p.id === program.id ? program : p)
        await kvSet(PROGRAMS_KEY, updated)
        console.log('[programs] updated:', program.id)
        return res.status(200).json({ ok: true })
      }

      // action: 'remove' — delete one program by id
      if (action === 'remove') {
        const current = await kvGet(PROGRAMS_KEY) || []
        const updated = current.filter(p => p.id !== program.id)
        await kvSet(PROGRAMS_KEY, updated)
        console.log('[programs] removed:', program.id)
        return res.status(200).json({ ok: true })
      }

      // action: 'replace' — full replace (used when bulk updating)
      if (action === 'replace') {
        await kvSet(PROGRAMS_KEY, programs)
        console.log('[programs] replaced all —', programs.length, 'programs')
        return res.status(200).json({ ok: true })
      }

      return res.status(400).json({ error: 'Unknown action' })
    } catch (err) {
      console.error('[programs] POST error:', err.message)
      return res.status(500).json({ error: err.message })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

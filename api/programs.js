export const config = { runtime: 'nodejs' }

const KV_URL = process.env.RECYCLING_FINDER_STORAGE_KV_REST_API_URL
const KV_TOKEN = process.env.RECYCLING_FINDER_STORAGE_KV_REST_API_TOKEN
const PROGRAMS_KEY = 'programs'

async function kvGet(key) {
  const res = await fetch(`${KV_URL}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
  })
  const data = await res.json()
  console.log('[programs] kvGet status:', res.status, 'result type:', typeof data.result)

  if (!data.result) return []

  // Upstash returns the value as stored — if we stored JSON.stringify(array), it comes back as string
  let value = data.result
  if (typeof value === 'string') {
    try { value = JSON.parse(value) } catch { return [] }
  }
  // Handle double-encoding just in case
  if (typeof value === 'string') {
    try { value = JSON.parse(value) } catch { return [] }
  }
  if (!Array.isArray(value)) {
    console.error('[programs] kvGet: not an array after parse:', typeof value)
    return []
  }
  console.log('[programs] kvGet: returning', value.length, 'programs')
  return value
}

async function kvSet(key, value) {
  // Upstash REST: POST /set/key with body as the value
  // We store as a JSON string
  const res = await fetch(`${KV_URL}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(JSON.stringify(value)),
  })
  const result = await res.json()
  console.log('[programs] kvSet:', res.status, JSON.stringify(result))
  return result
}

export default async function handler(req, res) {
  console.log('[programs] invoked —', req.method)
  console.log('[programs] env check — hasUrl:', !!KV_URL, 'hasToken:', !!KV_TOKEN)

  if (!KV_URL || !KV_TOKEN) {
    return res.status(500).json({ error: 'KV not configured', hasUrl: !!KV_URL, hasToken: !!KV_TOKEN })
  }

  if (req.method === 'GET') {
    try {
      const programs = await kvGet(PROGRAMS_KEY)
      return res.status(200).json({ programs })
    } catch (err) {
      console.error('[programs] GET error:', err.message)
      return res.status(500).json({ error: err.message, programs: [] })
    }
  }

  if (req.method === 'POST') {
    let body = req.body
    if (typeof body === 'string') {
      try { body = JSON.parse(body) } catch {
        return res.status(400).json({ error: 'Invalid JSON' })
      }
    }

    const { action, programs, program } = body
    console.log('[programs] action:', action)

    try {
      if (action === 'seed') {
        await kvSet(PROGRAMS_KEY, programs)
        return res.status(200).json({ ok: true, count: programs.length })
      }

      if (action === 'add') {
        const current = await kvGet(PROGRAMS_KEY)
        const updated = [...current, program]
        await kvSet(PROGRAMS_KEY, updated)
        return res.status(200).json({ ok: true, count: updated.length })
      }

      if (action === 'replace') {
        await kvSet(PROGRAMS_KEY, programs)
        return res.status(200).json({ ok: true, count: programs.length })
      }

      if (action === 'update') {
        const current = await kvGet(PROGRAMS_KEY)
        const updated = current.map(p => p.id === program.id ? program : p)
        await kvSet(PROGRAMS_KEY, updated)
        return res.status(200).json({ ok: true })
      }

      if (action === 'remove') {
        const current = await kvGet(PROGRAMS_KEY)
        const updated = current.filter(p => p.id !== program.id)
        await kvSet(PROGRAMS_KEY, updated)
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

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { url } = req.body
  if (!url) return res.status(400).json({ error: 'URL required' })

  // Basic URL validation
  let parsed
  try {
    parsed = new URL(url)
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Invalid protocol')
  } catch {
    return res.status(400).json({ error: 'Invalid URL' })
  }

  try {
    const response = await fetch(parsed.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RecyclingFinder/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-AU,en;q=0.9',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(10000), // 10s timeout
    })

    if (!response.ok) {
      return res.status(200).json({ error: `Site returned ${response.status}`, html: null })
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('text/html')) {
      return res.status(200).json({ error: 'URL does not point to an HTML page', html: null })
    }

    let html = await response.text()

    // Strip scripts, styles, nav, footer to reduce token count
    html = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[\s\S]*?<\/nav>/gi, '')
      .replace(/<footer[\s\S]*?<\/footer>/gi, '')
      .replace(/<header[\s\S]*?<\/header>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<[^>]+>/g, ' ')       // strip remaining tags
      .replace(/\s{2,}/g, ' ')        // collapse whitespace
      .trim()
      .slice(0, 12000)                // cap at ~3k tokens

    return res.status(200).json({ html, url: parsed.toString() })
  } catch (err) {
    const msg = err.name === 'TimeoutError' ? 'Request timed out (10s)' : `Fetch failed: ${err.message}`
    return res.status(200).json({ error: msg, html: null })
  }
}

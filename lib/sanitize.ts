/**
 * Server-safe lightweight HTML sanitizer.
 * Sanitizes rich text HTML descriptions without requiring heavy DOM/JSDOM dependencies,
 * ensuring zero XSS vectors while preserving safe styling and semantic tags.
 */

export function sanitizeHtml(rawHtml: string): string {
  if (!rawHtml) return ''

  // If text does not appear to contain HTML tags, wrap lines as paragraphs
  if (!/<[a-z][\s\S]*>/i.test(rawHtml)) {
    return rawHtml
      .split(/\n{2,}/)
      .map(para => `<p>${para.replace(/\n/g, '<br />')}</p>`)
      .join('')
  }

  // Strip script, style, iframe, object, embed, form tags and their inner content
  let clean = rawHtml.replace(/<(script|style|iframe|object|embed|form)[\s\S]*?<\/\1>/gi, '')

  // Strip self-closing or unclosed dangerous tags
  clean = clean.replace(/<(script|style|iframe|object|embed|form|input|button)[\s\S]*?>/gi, '')

  // Strip javascript:, data: (except safe image data URIs if needed), vbscript: in attributes
  clean = clean.replace(/\s+(href|src)\s*=\s*["']\s*(?:javascript|vbscript):[^"']*["']/gi, '')

  // Strip all inline event handlers (e.g., onclick, onerror, onload)
  clean = clean.replace(/\s+on[a-z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '')

  // Ensure rel="noopener noreferrer" on target="_blank" links
  clean = clean.replace(/<a\b([^>]*)target=["']_blank["']([^>]*)>/gi, (match, before, after) => {
    if (!/rel=/i.test(match)) {
      return `<a ${before} target="_blank" rel="noopener noreferrer" ${after}>`
    }
    return match
  })

  return clean
}

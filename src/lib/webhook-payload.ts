export const MAX_WEBHOOK_BYTES = 200_000

const REDACTED_HEADERS = new Set([
  'authorization',
  'cookie',
  'set-cookie',
  'proxy-authorization',
])

export type WebhookPayload = {
  method: string
  receivedAt: string
  query: Record<string, string>
  headers: Record<string, string>
  body: unknown
}

export function parseWebhookBody(
  rawBody: string,
  contentType: string | null,
): unknown {
  if (!rawBody) {
    return null
  }

  const type = (contentType ?? '').toLowerCase()

  if (type.includes('application/x-www-form-urlencoded')) {
    return Object.fromEntries(new URLSearchParams(rawBody))
  }

  const looksLikeJson = /^\s*[[{]/.test(rawBody)

  if (type.includes('json') || looksLikeJson) {
    try {
      return JSON.parse(rawBody)
    } catch {
      return rawBody
    }
  }

  return rawBody
}

export function pickHeaders(headers: Headers): Record<string, string> {
  const picked: Record<string, string> = {}

  headers.forEach((value, key) => {
    if (!REDACTED_HEADERS.has(key.toLowerCase())) {
      picked[key.toLowerCase()] = value
    }
  })

  return picked
}

export function buildWebhookPayload({
  method,
  url,
  headers,
  rawBody,
  now = new Date(),
}: {
  method: string
  url: string
  headers: Headers
  rawBody: string
  now?: Date
}): WebhookPayload {
  return {
    method: method.toUpperCase(),
    receivedAt: now.toISOString(),
    query: Object.fromEntries(new URL(url).searchParams),
    headers: pickHeaders(headers),
    body: parseWebhookBody(rawBody, headers.get('content-type')),
  }
}

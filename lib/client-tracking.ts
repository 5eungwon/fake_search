export function attribution() {
  const params = new URLSearchParams(window.location.search)
  return { source: params.get('utm_source') || 'direct', campaign: params.get('utm_campaign') || 'default', variant: params.get('utm_content') || 'default' }
}
export function track(event: string, placement?: string) {
  fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event, placement, ...attribution() }), keepalive: true }).catch(() => {})
}

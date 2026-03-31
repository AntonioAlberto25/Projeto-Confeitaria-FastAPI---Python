const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function fetchHealth(): Promise<{ status: string; service: string }> {
  const res = await fetch(`${API_URL}/health`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Backend unreachable')
  return res.json()
}

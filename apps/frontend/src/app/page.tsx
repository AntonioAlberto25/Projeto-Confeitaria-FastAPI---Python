import { fetchHealth } from '../lib/api'

export default async function HomePage() {
  let backendStatus: string
  let serviceName: string

  try {
    const data = await fetchHealth()
    backendStatus = data.status
    serviceName = data.service
  } catch {
    backendStatus = 'unreachable'
    serviceName = '—'
  }

  const isOk = backendStatus === 'ok'

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: '480px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎂 Gestão Confeitaria</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Scaffold monorepo — integração frontend ↔ backend</p>

      <div
        style={{
          border: `2px solid ${isOk ? '#22c55e' : '#ef4444'}`,
          borderRadius: '8px',
          padding: '1rem 1.5rem',
          background: isOk ? '#f0fdf4' : '#fef2f2',
        }}
      >
        <p style={{ margin: 0, fontWeight: 600 }}>
          Backend:{' '}
          <span style={{ color: isOk ? '#16a34a' : '#dc2626' }}>
            {isOk ? '✅ online' : '❌ offline'}
          </span>
        </p>
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#555' }}>
          status: <code>{backendStatus}</code> &nbsp;|&nbsp; service: <code>{serviceName}</code>
        </p>
      </div>
    </main>
  )
}

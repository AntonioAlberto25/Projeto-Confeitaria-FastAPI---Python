// Componente unificado de Status Badge — Stitch "The Icing" color mapping

export type StatusType = 'pendente' | 'producao' | 'em_producao' | 'concluido' | 'cancelado'

interface StatusBadgeProps {
  status: string
  className?: string
}

const statusMap: Record<string, { label: string; className: string }> = {
  pendente:    { label: 'Pendente',      className: 'badge badge-pendente' },
  producao:    { label: 'Em Produção',   className: 'badge badge-producao' },
  em_producao: { label: 'Em Produção',   className: 'badge badge-producao' },
  concluido:   { label: 'Concluído',     className: 'badge badge-concluido' },
  cancelado:   { label: 'Cancelado',     className: 'badge badge-cancelado' },
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const key = status.toLowerCase().replace(/\s/g, '_')
  const config = statusMap[key] ?? { label: status, className: 'badge badge-pendente' }

  return (
    <span className={`${config.className} ${className}`}>
      {config.label}
    </span>
  )
}

export function getStatusClass(status: string): string {
  const key = status.toLowerCase().replace(/\s/g, '_')
  return statusMap[key]?.className ?? 'badge badge-pendente'
}

// Signature Component do Stitch: "Doughnut Progress Ring"
// Para indicadores de nível de estoque

interface DonutProgressProps {
  value: number       // 0-100
  level?: 'normal' | 'low' | 'critical'
  size?: number       // px
  strokeWidth?: number
  label?: string
  sublabel?: string
}

const levelColors = {
  normal:   { stroke: '#6e6436', text: '#6e6436', bg: 'rgba(110,100,54,0.08)' },  // tertiary
  low:      { stroke: '#795f4a', text: '#795f4a', bg: 'rgba(121,95,74,0.08)' },   // secondary
  critical: { stroke: '#b33938', text: '#b33938', bg: 'rgba(179,57,56,0.08)' },   // error
}

export function DonutProgress({
  value,
  level = 'normal',
  size = 64,
  strokeWidth = 6,
  label,
  sublabel,
}: DonutProgressProps) {
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(value, 100) / 100) * circumference
  const colors = levelColors[level]

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.bg}
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </svg>
        {/* Center value */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: size * 0.22, color: colors.text }}
        >
          {Math.round(value)}%
        </div>
      </div>
      {label && (
        <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.7rem', color: 'var(--on-surface-variant)', fontWeight: 500 }}>
          {label}
        </span>
      )}
      {sublabel && (
        <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.65rem', color: 'var(--on-surface-variant)', opacity: 0.6 }}>
          {sublabel}
        </span>
      )}
    </div>
  )
}

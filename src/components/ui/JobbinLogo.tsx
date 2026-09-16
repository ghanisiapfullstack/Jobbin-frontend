interface JobbinLogoProps {
  compact?: boolean
  size?: 'sm' | 'md' | 'lg'
  inverse?: boolean
  className?: string
}

const SIZE_CLASSES = {
  sm: 'h-7',
  md: 'h-10',
  lg: 'h-16',
}

export default function JobbinLogo({
  compact = false,
  size = 'md',
  inverse = false,
  className = '',
}: JobbinLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} aria-label="Jobbin">
      <svg
        viewBox="0 0 48 48"
        className={`${SIZE_CLASSES[size]} w-auto shrink-0`}
        role="img"
        aria-hidden="true"
      >
        <rect
          x="3"
          y="3"
          width="38"
          height="38"
          fill={inverse ? '#FFD600' : '#1a1a1a'}
          stroke={inverse ? '#FFD600' : '#1a1a1a'}
          strokeWidth="4"
        />
        <path
          d="M29.5 12v17.5c0 6.2-3.7 9.5-9.5 9.5-4.4 0-7.6-2.2-9-6.2l6.1-2.3c.6 1.8 1.5 2.8 3 2.8 1.8 0 2.8-1.2 2.8-3.8V18h-6v-6h12.6Z"
          fill={inverse ? '#1a1a1a' : '#FFD600'}
        />
        <path d="M38 7v8M34 11h8" stroke={inverse ? '#1a1a1a' : '#FFD600'} strokeWidth="2.5" />
      </svg>
      {!compact && (
        <span className={`font-black tracking-[-0.03em] ${
          size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-lg' : 'text-2xl'
        } ${inverse ? 'text-primary' : 'text-dark'}`}>
          JOBBIN
        </span>
      )}
    </span>
  )
}

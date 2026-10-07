import type { ComponentType } from 'react'
import type { TooltipRenderProps } from 'react-joyride'
import type { LucideProps } from 'lucide-react'

// Extra per-step data attached via Step.data: an icon and whether the step is
// a centered "hero" step (welcome / closing).
export interface TourStepData {
  icon?: ComponentType<LucideProps>
  hero?: boolean
}

export default function TourTooltip({
  index,
  size,
  step,
  isLastStep,
  backProps,
  primaryProps,
  skipProps,
  tooltipProps,
}: TooltipRenderProps) {
  const data = (step.data ?? {}) as TourStepData
  const Icon = data.icon
  const isHero = Boolean(data.hero)
  const stepNumber = index + 1

  return (
    <div
      {...tooltipProps}
      className={`border-2 border-dark bg-white shadow-neo-lg ${isHero ? 'w-[21rem] max-w-[90vw] text-center' : 'w-80 max-w-[90vw]'}`}
      style={{ fontFamily: 'Space Grotesk, sans-serif', borderRadius: 0 }}
    >
      {/* Header strip */}
      <div className={`flex items-center gap-2 border-b-2 border-dark bg-primary px-4 py-2.5 ${isHero ? 'justify-center' : ''}`}>
        {Icon && (
          <span className="flex h-7 w-7 shrink-0 items-center justify-center border-2 border-dark bg-white">
            <Icon size={16} strokeWidth={2.8} aria-hidden="true" />
          </span>
        )}
        <span className="border-2 border-dark bg-white px-2 py-0.5 text-[11px] font-black tabular-nums">
          {stepNumber}/{size}
        </span>
      </div>

      {/* Body */}
      <div className={`px-4 ${isHero ? 'py-6' : 'py-4'}`}>
        {step.title && (
          <h3 className={`font-black leading-tight text-dark ${isHero ? 'text-xl' : 'text-base'}`}>
            {step.title}
          </h3>
        )}
        <p className="mt-2 text-sm font-medium leading-relaxed text-dark/80">{step.content}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 border-t-2 border-dark px-4 py-3">
        <button
          {...skipProps}
          type="button"
          className="text-xs font-black text-dark/55 underline decoration-2 underline-offset-2 hover:text-dark"
        >
          Lewati
        </button>
        <div className="flex items-center gap-2">
          {index > 0 && (
            <button
              {...backProps}
              type="button"
              className="min-h-9 border-2 border-dark bg-white px-3 text-xs font-black shadow-neo-sm transition-transform hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              Kembali
            </button>
          )}
          <button
            {...primaryProps}
            type="button"
            className="min-h-9 border-2 border-dark bg-primary px-4 text-xs font-black shadow-neo-sm transition-transform hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            {isLastStep ? 'Selesai' : 'Lanjut'}
          </button>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useId, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface NeoDialogProps {
  open: boolean
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
  className?: string
}

export default function NeoDialog({
  open,
  title,
  description,
  onClose,
  children,
  className = '',
}: NeoDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  if (!open) return null

  return (
    <dialog
      ref={dialogRef}
      className={`neo-dialog card-neo w-[calc(100%-2rem)] max-w-lg max-h-[90vh] overflow-y-auto ${className}`}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 id={titleId} className="text-xl font-black text-dark">{title}</h2>
          {description && (
            <p id={descriptionId} className="text-sm text-dark/65 mt-1 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="icon-button shrink-0 hover:bg-rejected"
          aria-label="Close dialog"
        >
          <X size={18} strokeWidth={3} />
        </button>
      </div>
      {children}
    </dialog>
  )
}

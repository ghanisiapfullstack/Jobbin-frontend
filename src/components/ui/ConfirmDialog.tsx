import { AlertTriangle } from 'lucide-react'
import NeoDialog from './NeoDialog'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  busy?: boolean
  onCancel: () => void
  onConfirm: () => void | Promise<void>
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Delete',
  busy = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <NeoDialog open={open} onClose={onCancel} title={title} description={description}>
      <div className="mb-5 flex items-start gap-3 border-2 border-dark bg-rejected/55 p-3">
        <AlertTriangle size={22} className="mt-0.5 shrink-0" strokeWidth={2.5} aria-hidden="true" />
        <p className="text-sm font-bold">This action cannot be undone.</p>
      </div>
      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        <button type="button" onClick={onCancel} disabled={busy} className="btn-outline flex-1 disabled:cursor-not-allowed disabled:opacity-60">Cancel</button>
        <button type="button" onClick={() => void onConfirm()} disabled={busy} className="btn-danger flex-1 disabled:cursor-not-allowed disabled:opacity-60">
          {busy ? 'Deleting...' : confirmLabel}
        </button>
      </div>
    </NeoDialog>
  )
}

import { statusLabel, type Status } from '../../data/types'

export function StatusTag({ status }: { status: Status }) {
  return (
    <span className="meta inline-flex items-center gap-2">
      <span className="status-dot" data-status={status} aria-hidden="true" />
      {statusLabel[status]}
    </span>
  )
}

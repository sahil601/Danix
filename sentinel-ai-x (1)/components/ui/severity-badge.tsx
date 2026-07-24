'use client'

import { cn } from '@/lib/utils'
import type { Severity } from '@/lib/types'

interface SeverityBadgeProps {
  severity: Severity | string
  className?: string
  size?: 'sm' | 'md'
}

const severityConfig: Record<string, { label: string; className: string }> = {
  critical: { label: 'Critical', className: 'bg-red-500/15 text-red-400 border-red-500/25 ring-red-500/10' },
  high: { label: 'High', className: 'bg-orange-500/15 text-orange-400 border-orange-500/25 ring-orange-500/10' },
  medium: { label: 'Medium', className: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25 ring-yellow-500/10' },
  low: { label: 'Low', className: 'bg-blue-500/15 text-blue-400 border-blue-500/25 ring-blue-500/10' },
  info: { label: 'Info', className: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/25 ring-zinc-500/10' },
}

export function SeverityBadge({ severity, className, size = 'sm' }: SeverityBadgeProps) {
  const config = severityConfig[severity?.toLowerCase()] ?? severityConfig.info

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
        config.className,
        className
      )}
    >
      <span
        className={cn(
          'rounded-full',
          size === 'sm' ? 'size-1.5' : 'size-2',
          severity === 'critical' && 'bg-red-400',
          severity === 'high' && 'bg-orange-400',
          severity === 'medium' && 'bg-yellow-400',
          severity === 'low' && 'bg-blue-400',
          severity === 'info' && 'bg-zinc-400',
        )}
      />
      {config.label}
    </span>
  )
}

export function RiskScore({ score, className }: { score: number; className?: string }) {
  const color =
    score >= 80 ? 'text-red-400' :
    score >= 60 ? 'text-orange-400' :
    score >= 40 ? 'text-yellow-400' :
    'text-green-400'

  const bgColor =
    score >= 80 ? 'bg-red-500/10 border-red-500/20' :
    score >= 60 ? 'bg-orange-500/10 border-orange-500/20' :
    score >= 40 ? 'bg-yellow-500/10 border-yellow-500/20' :
    'bg-green-500/10 border-green-500/20'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-bold tabular-nums',
        bgColor,
        color,
        className
      )}
    >
      {score}
    </span>
  )
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const config: Record<string, string> = {
    active: 'bg-green-500/10 text-green-400 border-green-500/20',
    running: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    completed: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    paused: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    queued: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    archived: 'bg-zinc-700/30 text-zinc-500 border-zinc-700/40',
    failed: 'bg-red-500/10 text-red-400 border-red-500/20',
    open: 'bg-red-500/10 text-red-400 border-red-500/20',
    'in-progress': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    remediated: 'bg-green-500/10 text-green-400 border-green-500/20',
    accepted: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium capitalize',
        config[status] ?? config.archived,
        className
      )}
    >
      {status.replace('-', ' ')}
    </span>
  )
}

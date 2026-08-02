'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Activity, ChevronUp } from 'lucide-react'

interface StatusItem {
  label: string
  value: string
  status: 'online' | 'offline' | 'warning' | 'neutral'
}

const BASE_STATUS: StatusItem[] = [
  { label: 'Backend', value: 'Online', status: 'online' },
  { label: 'Database', value: 'Online', status: 'online' },
  { label: 'LLM', value: 'Online', status: 'online' },
  { label: 'Knowledge Base', value: '98.2%', status: 'online' },
  { label: 'API Latency', value: '42ms', status: 'online' },
  { label: 'Version', value: 'v2.4.1', status: 'neutral' },
]

const STATUS_DOT: Record<string, string> = {
  online: 'bg-green-400',
  offline: 'bg-red-400',
  warning: 'bg-yellow-400',
  neutral: 'bg-zinc-500',
}

const STATUS_TEXT: Record<string, string> = {
  online: 'text-green-400',
  offline: 'text-red-400',
  warning: 'text-yellow-400',
  neutral: 'text-muted-foreground',
}

export function AppFooter() {
  const [latency, setLatency] = useState(42)
  const [expanded, setExpanded] = useState(false)

  // Simulate latency fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(38 + Math.random() * 18))
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const statusItems: StatusItem[] = BASE_STATUS.map((item) =>
    item.label === 'API Latency'
      ? { ...item, value: `${latency}ms`, status: latency > 100 ? 'warning' : 'online' }
      : item
  )

  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-1.5">
        {/* Status items */}
        <div className="flex items-center gap-4 overflow-x-auto">
          {statusItems.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-[10px] flex-shrink-0">
              <span className="text-muted-foreground/60">{item.label}:</span>
              <div className="flex items-center gap-1">
                {item.status !== 'neutral' && (
                  <span className={cn(
                    'size-1.5 rounded-full',
                    STATUS_DOT[item.status],
                    item.status === 'online' && 'animate-pulse'
                  )} />
                )}
                <span className={STATUS_TEXT[item.status]}>{item.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Activity className="size-3 text-primary" />
            <span className="text-primary font-medium">4</span>
            <span>bg jobs</span>
          </div>
          <button
            onClick={() => setExpanded((e) => !e)}
            className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronUp className={cn('size-3 transition-transform', expanded && 'rotate-180')} />
          </button>
        </div>
      </div>

      {/* Expanded system detail */}
      {expanded && (
        <div className="border-t border-border/50 px-4 py-2.5 bg-zinc-900/30">
          <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 max-w-xl">
            {[
              { label: 'CPU Usage', value: '34%', bar: 34, color: 'bg-primary' },
              { label: 'Memory', value: '61%', bar: 61, color: 'bg-yellow-500' },
              { label: 'Background Jobs', value: '4 running', bar: null, color: '' },
              { label: 'Knowledge Index', value: '98.2% complete', bar: 98.2, color: 'bg-green-500' },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground w-28 flex-shrink-0">{row.label}</span>
                {row.bar !== null ? (
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full bg-zinc-800">
                      <div className={cn('h-1 rounded-full', row.color)} style={{ width: `${row.bar}%` }} />
                    </div>
                    <span className="text-[10px] text-foreground font-mono w-14 text-right">{row.value}</span>
                  </div>
                ) : (
                  <span className="text-[10px] text-foreground">{row.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </footer>
  )
}

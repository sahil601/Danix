'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ScanLine,
  AlertTriangle,
  FileText,
  Server,
  Bot,
  FolderKanban,
  Activity,
  Download,
} from 'lucide-react'
import { ACTIVITY_FEED } from '@/lib/data'
import { fetchActivityFeed } from '@/lib/api'
import { cn } from '@/lib/utils'

const ACTIVITY_ICONS: Record<string, { icon: typeof Activity; color: string; bg: string }> = {
  scan_completed: { icon: ScanLine, color: 'text-green-400', bg: 'bg-green-500/10' },
  finding_critical: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
  finding_high: { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  report_generated: { icon: FileText, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  asset_added: { icon: Server, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  scan_started: { icon: ScanLine, color: 'text-primary', bg: 'bg-primary/10' },
  project_created: { icon: FolderKanban, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ai_chat: { icon: Bot, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
}

interface ActivityDrawerProps {
  open: boolean
  onClose: () => void
}

export function ActivityDrawer({ open, onClose }: ActivityDrawerProps) {
  const [activityFeed, setActivityFeed] = useState(ACTIVITY_FEED)

  useEffect(() => {
    fetchActivityFeed().then(res => setActivityFeed(res.activity_feed || res)).catch(() => {})
  }, [])

  const EXTENDED_FEED = [
    ...activityFeed,
    { id: 'act-8', type: 'ai_chat', message: 'AI conversation: Prioritize FinTrust vulnerabilities', time: '4h ago', user: 'JD', severity: null },
    { id: 'act-9', type: 'project_created', message: 'Project "RetailMax API Penetration Test" created', time: '6h ago', user: 'SK', severity: null },
    { id: 'act-10', type: 'scan_started', message: 'Quick scan launched on medhealth.io', time: '8h ago', user: 'MP', severity: null },
    { id: 'act-11', type: 'finding_high', message: 'High severity: Missing HSTS on banking portal', time: '10h ago', user: 'ReconAgent', severity: 'high' },
    { id: 'act-12', type: 'report_generated', message: 'HIPAA compliance report generated for MedHealth', time: '1d ago', user: 'LK', severity: null },
  ]

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-80 flex flex-col border-l border-border bg-card shadow-2xl shadow-black/50"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
              <div className="flex items-center gap-2">
                <Activity className="size-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Recent Activity</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 rounded-lg border border-border px-2 py-1 text-[10px] text-muted-foreground hover:text-foreground hover:border-zinc-600 transition-colors">
                  <Download className="size-3" /> Export
                </button>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Filter chips */}
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border overflow-x-auto">
              {['All', 'Scans', 'Findings', 'Reports', 'AI', 'Projects'].map((f) => (
                <button
                  key={f}
                  className={cn(
                    'flex-shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors',
                    f === 'All' ? 'bg-primary text-white' : 'bg-zinc-800 text-muted-foreground hover:text-foreground'
                  )}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Feed */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[18px] top-2 bottom-2 w-px bg-border" />

                <div className="space-y-4">
                  {EXTENDED_FEED.map((item, i) => {
                    const cfg = ACTIVITY_ICONS[item.type] ?? { icon: Activity, color: 'text-zinc-400', bg: 'bg-zinc-700/40' }
                    const Icon = cfg.icon
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-start gap-3 relative"
                      >
                        <div className={cn('flex size-9 flex-shrink-0 items-center justify-center rounded-full relative z-10', cfg.bg)}>
                          <Icon className={cn('size-3.5', cfg.color)} />
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <p className="text-xs text-foreground leading-relaxed">{item.message}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-muted-foreground">{item.time}</span>
                            <span className="size-1 rounded-full bg-zinc-700" />
                            <span className="text-[10px] text-muted-foreground">{item.user}</span>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border px-4 py-3">
              <button className="w-full text-xs text-center text-muted-foreground hover:text-primary transition-colors">
                Load more activity
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

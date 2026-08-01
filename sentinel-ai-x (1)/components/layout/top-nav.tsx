'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Bell,
  Command,
  Menu,
  ChevronRight,
  X,
  AlertTriangle,
  Info,
  CheckCircle,
  Zap,
  Activity,
  Keyboard,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { NOTIFICATIONS } from '@/lib/data'
import { fetchNotifications } from '@/lib/api'

const BREADCRUMB_MAP: Record<string, string> = {
  dashboard: 'Dashboard',
  projects: 'Projects',
  assets: 'Assets',
  scans: 'Scans',
  findings: 'Findings',
  'attack-surface': 'Attack Surface',
  'ai-chat': 'AI Chat',
  'knowledge-base': 'Knowledge Base',
  reports: 'Reports',
  history: 'History',
  settings: 'Settings',
}

interface TopNavProps {
  onMenuClick?: () => void
  onCommandOpen?: () => void
  onActivityOpen?: () => void
  onShortcutsOpen?: () => void
}

export function TopNav({ onMenuClick, onCommandOpen, onActivityOpen, onShortcutsOpen }: TopNavProps) {
  const pathname = usePathname()
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchFocus, setSearchFocus] = useState(false)
  const [notifications, setNotifications] = useState(NOTIFICATIONS)

  useEffect(() => {
    fetchNotifications().then(res => setNotifications(res.notifications || res)).catch(() => {})
  }, [])

  const segments = pathname.split('/').filter(Boolean)
  const unreadCount = notifications.filter((n: any) => !n.read).length

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onCommandOpen?.()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCommandOpen])

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/90 backdrop-blur-md px-4">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
      >
        <Menu className="size-5" />
      </button>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground min-w-0 flex-1">
        <span className="text-xs font-medium text-muted-foreground/60">Danix</span>
        {segments.map((seg, i) => (
          <span key={seg} className="flex items-center gap-1 min-w-0">
            <ChevronRight className="size-3 flex-shrink-0" />
            <span
              className={cn(
                'truncate text-xs',
                i === segments.length - 1
                  ? 'font-semibold text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              {BREADCRUMB_MAP[seg] ?? seg}
            </span>
          </span>
        ))}
      </nav>

      {/* Search */}
      <button
        onClick={onCommandOpen}
        className={cn(
          'hidden md:flex items-center gap-2 rounded-lg border bg-card px-3 py-1.5 text-sm text-muted-foreground',
          'hover:border-zinc-600 hover:text-foreground transition-all duration-200',
          'min-w-[180px] max-w-[260px]'
        )}
      >
        <Search className="size-3.5 flex-shrink-0" />
        <span className="flex-1 text-left text-xs">Search everything...</span>
        <kbd className="flex items-center gap-0.5 rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">
          <Command className="size-2.5" />K
        </kbd>
      </button>

      {/* Notification Bell */}
      <div className="relative">
        <button
          onClick={() => setNotifOpen(!notifOpen)}
          className="relative rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <Bell className="size-4.5" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>

        <AnimatePresence>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-border bg-card shadow-2xl shadow-black/50"
              >
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold">Notifications</p>
                    <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
                  </div>
                  <button className="text-xs text-primary hover:underline">Mark all read</button>
                </div>
                <div className="max-h-[380px] overflow-y-auto">
                  {notifications.map((n: any) => {
                    const Icon =
                      n.type === 'critical' ? AlertTriangle :
                      n.type === 'success' ? CheckCircle :
                      n.type === 'warning' ? AlertTriangle :
                      Info
                    const iconColor =
                      n.type === 'critical' ? 'text-red-400' :
                      n.type === 'success' ? 'text-green-400' :
                      n.type === 'warning' ? 'text-yellow-400' :
                      'text-blue-400'

                    return (
                      <div
                        key={n.id}
                        className={cn(
                          'flex gap-3 px-4 py-3 hover:bg-accent/50 transition-colors cursor-pointer border-b border-border/50 last:border-0',
                          !n.read && 'bg-primary/5'
                        )}
                      >
                        <div className={cn('mt-0.5 flex-shrink-0', iconColor)}>
                          <Icon className="size-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground">{n.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
                          <p className="text-[10px] text-muted-foreground/60 mt-1">{n.time}</p>
                        </div>
                        {!n.read && (
                          <div className="mt-1.5 size-1.5 rounded-full bg-primary flex-shrink-0" />
                        )}
                      </div>
                    )
                  })}
                </div>
                <div className="border-t border-border px-4 py-2.5">
                  <button className="w-full text-xs text-center text-muted-foreground hover:text-foreground transition-colors">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Activity Feed */}
      <button
        onClick={onActivityOpen}
        className="hidden md:flex rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        title="Recent Activity"
      >
        <Activity className="size-4" />
      </button>

      {/* Keyboard Shortcuts */}
      <button
        onClick={onShortcutsOpen}
        className="hidden md:flex rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        title="Keyboard Shortcuts (?)"
      >
        <Keyboard className="size-4" />
      </button>

      {/* Quick scan button */}
      <button
        className="hidden sm:flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90 transition-colors"
      >
        <Zap className="size-3" />
        New Scan
      </button>
    </header>
  )
}

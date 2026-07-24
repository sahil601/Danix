'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  FolderKanban,
  Server,
  ScanLine,
  Globe,
  Bot,
  BookOpen,
  FileText,
  History,
  Settings,
  Shield,
  ChevronDown,
  X,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderKanban, badge: 5 },
  { href: '/assets', label: 'Assets', icon: Server, badge: 142 },
  { href: '/scans', label: 'Scans', icon: ScanLine },
  { href: '/attack-surface', label: 'Attack Surface', icon: Globe },
  { href: '/ai-chat', label: 'AI Chat', icon: Bot, badge: 'new' },
  { href: '/knowledge-base', label: 'Knowledge Base', icon: BookOpen },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/history', label: 'History', icon: History },
  { href: '/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  open?: boolean
  onClose?: () => void
  mobile?: boolean
}

export function Sidebar({ open = true, onClose, mobile = false }: SidebarProps) {
  const pathname = usePathname()

  const content = (
    <div className="flex h-full flex-col glass-sidebar">
      {/* Logo */}
      <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary">
            <Shield className="size-4 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold text-foreground tracking-tight">SentinelAI</span>
            <span className="text-[10px] font-semibold text-primary uppercase tracking-widest">X Platform</span>
          </div>
        </Link>
        {mobile && (
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Workspace Selector */}
      <div className="px-3 py-3">
        <button className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm hover:bg-sidebar-accent transition-colors group">
          <div className="flex size-6 items-center justify-center rounded bg-blue-500/20 text-xs font-bold text-blue-400">A</div>
          <div className="flex-1 text-left">
            <div className="text-xs font-semibold text-foreground">Acme Corp</div>
            <div className="text-[10px] text-muted-foreground">Enterprise Workspace</div>
          </div>
          <ChevronDown className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-3">
        <div className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={mobile ? onClose : undefined}
                className={cn(
                  'group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
                )}
              >
                {isActive && (
                  <div className="absolute left-0 h-6 w-0.5 rounded-r-full bg-primary" />
                )}
                <Icon className={cn('size-4 flex-shrink-0', isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground')} />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={cn(
                      'ml-auto rounded-md px-1.5 py-0.5 text-[10px] font-semibold',
                      typeof item.badge === 'string'
                        ? 'bg-primary/20 text-primary'
                        : 'bg-zinc-700/60 text-zinc-400'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Quick Action */}
      <div className="border-t border-sidebar-border p-3">
        <Link
          href="/scans?new=true"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
        >
          <Zap className="size-3.5" />
          New Scan
        </Link>
      </div>

      {/* User Profile */}
      <div className="border-t border-sidebar-border p-3">
        <button className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-sm hover:bg-sidebar-accent transition-colors group">
          <div className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-xs font-bold text-white flex-shrink-0">
            JD
          </div>
          <div className="flex-1 text-left overflow-hidden">
            <div className="text-xs font-semibold text-foreground truncate">John Doe</div>
            <div className="text-[10px] text-muted-foreground truncate">Lead Analyst</div>
          </div>
          <Settings className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </div>
  )

  if (mobile) {
    return (
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    )
  }

  return (
    <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col border-r border-sidebar-border h-screen sticky top-0">
      {content}
    </aside>
  )
}

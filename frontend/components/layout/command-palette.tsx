'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
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
  Zap,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const COMMANDS = [
  { id: 'nav-dashboard', label: 'Go to Dashboard', href: '/dashboard', icon: LayoutDashboard, category: 'Navigation', shortcut: 'G D' },
  { id: 'nav-projects', label: 'Go to Projects', href: '/projects', icon: FolderKanban, category: 'Navigation', shortcut: 'G P' },
  { id: 'nav-assets', label: 'Go to Assets', href: '/assets', icon: Server, category: 'Navigation', shortcut: 'G A' },
  { id: 'nav-scans', label: 'Go to Scans', href: '/scans', icon: ScanLine, category: 'Navigation', shortcut: 'G S' },
  { id: 'nav-attack', label: 'Go to Attack Surface', href: '/attack-surface', icon: Globe, category: 'Navigation' },
  { id: 'nav-ai', label: 'Open AI Chat', href: '/ai-chat', icon: Bot, category: 'Navigation', shortcut: 'G I' },
  { id: 'nav-kb', label: 'Knowledge Base', href: '/knowledge-base', icon: BookOpen, category: 'Navigation' },
  { id: 'nav-reports', label: 'Go to Reports', href: '/reports', icon: FileText, category: 'Navigation' },
  { id: 'nav-history', label: 'Go to History', href: '/history', icon: History, category: 'Navigation' },
  { id: 'nav-settings', label: 'Go to Settings', href: '/settings', icon: Settings, category: 'Navigation' },
  { id: 'action-scan', label: 'Start New Scan', href: '/scans?new=true', icon: Zap, category: 'Actions' },
  { id: 'action-project', label: 'Create New Project', href: '/projects?new=true', icon: FolderKanban, category: 'Actions' },
  { id: 'action-report', label: 'Generate Report', href: '/reports?new=true', icon: FileText, category: 'Actions' },
]

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()

  const filtered = query
    ? COMMANDS.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : COMMANDS

  const grouped = filtered.reduce<Record<string, typeof COMMANDS>>((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = []
    acc[cmd.category].push(cmd)
    return acc
  }, {})

  const flat = filtered

  const execute = useCallback((cmd: (typeof COMMANDS)[0]) => {
    router.push(cmd.href)
    onClose()
    setQuery('')
  }, [router, onClose])

  useEffect(() => {
    if (!open) {
      setQuery('')
      setSelectedIndex(0)
    }
  }, [open])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, flat.length - 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)) }
      if (e.key === 'Enter' && flat[selectedIndex]) { execute(flat[selectedIndex]) }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, flat, selectedIndex, execute, onClose])

  useEffect(() => { setSelectedIndex(0) }, [query])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/70"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Search className="size-4 text-muted-foreground flex-shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages, actions, and more..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              <kbd className="flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto p-2">
              {flat.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No results for &quot;{query}&quot;
                </div>
              ) : (
                Object.entries(grouped).map(([category, cmds]) => (
                  <div key={category} className="mb-2">
                    <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                      {category}
                    </p>
                    {cmds.map((cmd) => {
                      const Icon = cmd.icon
                      const globalIndex = flat.indexOf(cmd)
                      const isSelected = globalIndex === selectedIndex

                      return (
                        <button
                          key={cmd.id}
                          onClick={() => execute(cmd)}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                          className={cn(
                            'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                            isSelected
                              ? 'bg-primary/15 text-foreground'
                              : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
                          )}
                        >
                          <Icon className="size-4 flex-shrink-0" />
                          <span className="flex-1 text-left">{cmd.label}</span>
                          {cmd.shortcut && (
                            <kbd className="text-[10px] text-muted-foreground/60 font-mono">{cmd.shortcut}</kbd>
                          )}
                          <ArrowRight className={cn('size-3.5 transition-opacity', isSelected ? 'opacity-100' : 'opacity-0')} />
                        </button>
                      )
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 border-t border-border px-4 py-2.5">
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <kbd className="rounded border border-border bg-muted px-1 font-mono">↑↓</kbd>navigate
              </span>
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <kbd className="rounded border border-border bg-muted px-1 font-mono">↵</kbd>select
              </span>
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <kbd className="rounded border border-border bg-muted px-1 font-mono">esc</kbd>close
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

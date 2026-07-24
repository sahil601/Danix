'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Command, Keyboard } from 'lucide-react'

const SHORTCUTS = [
  {
    category: 'Navigation',
    items: [
      { keys: ['G', 'D'], label: 'Go to Dashboard' },
      { keys: ['G', 'P'], label: 'Go to Projects' },
      { keys: ['G', 'A'], label: 'Go to Assets' },
      { keys: ['G', 'S'], label: 'Go to Scans' },
      { keys: ['G', 'I'], label: 'Open AI Chat' },
      { keys: ['G', 'F'], label: 'Go to Findings' },
    ],
  },
  {
    category: 'Global',
    items: [
      { keys: ['⌘', 'K'], label: 'Open Command Palette' },
      { keys: ['?'], label: 'Show Keyboard Shortcuts' },
      { keys: ['⌘', '/'], label: 'Toggle Sidebar' },
      { keys: ['Esc'], label: 'Close Modals / Dismiss' },
    ],
  },
  {
    category: 'Actions',
    items: [
      { keys: ['⌘', 'N'], label: 'New Scan' },
      { keys: ['⌘', 'Shift', 'R'], label: 'Generate Report' },
      { keys: ['⌘', 'Shift', 'P'], label: 'New Project' },
    ],
  },
  {
    category: 'Table / List',
    items: [
      { keys: ['↑', '↓'], label: 'Navigate rows' },
      { keys: ['↵'], label: 'Select / Expand row' },
      { keys: ['⌘', 'F'], label: 'Search' },
      { keys: ['⌘', 'A'], label: 'Select all' },
    ],
  },
]

interface KeyboardShortcutsProps {
  open: boolean
  onClose: () => void
}

export function KeyboardShortcutsModal({ open, onClose }: KeyboardShortcutsProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
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
            className="relative z-10 w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/70"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/15">
                  <Keyboard className="size-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Keyboard Shortcuts</h2>
                  <p className="text-xs text-muted-foreground">Speed up your workflow</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors rounded-lg p-1 hover:bg-accent"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Shortcuts grid */}
            <div className="overflow-y-auto max-h-[calc(80vh-72px)] p-6">
              <div className="grid gap-6 sm:grid-cols-2">
                {SHORTCUTS.map((section) => (
                  <div key={section.category}>
                    <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      {section.category}
                    </h3>
                    <div className="space-y-2">
                      {section.items.map((item) => (
                        <div key={item.label} className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-accent/50 transition-colors">
                          <span className="text-xs text-muted-foreground">{item.label}</span>
                          <div className="flex items-center gap-1">
                            {item.keys.map((key, ki) => (
                              <span key={ki} className="flex items-center">
                                {ki > 0 && <span className="text-muted-foreground/40 mx-1 text-[10px]">+</span>}
                                <kbd className="flex items-center justify-center rounded border border-border bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-foreground min-w-[22px]">
                                  {key === '⌘' ? <Command className="size-2.5" /> : key}
                                </kbd>
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

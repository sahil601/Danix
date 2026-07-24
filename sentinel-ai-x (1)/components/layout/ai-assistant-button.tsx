'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, X, Zap, FileText, MessageSquare, Search } from 'lucide-react'

const QUICK_ACTIONS = [
  { icon: Search, label: 'Explain a finding', href: '/ai-chat?q=explain-finding' },
  { icon: Zap, label: 'Prioritize vulnerabilities', href: '/ai-chat?q=prioritize' },
  { icon: FileText, label: 'Generate report', href: '/reports?new=true' },
  { icon: MessageSquare, label: 'Open AI Chat', href: '/ai-chat' },
]

export function AIAssistantButton() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/60 w-56"
          >
            <div className="border-b border-border px-4 py-3">
              <p className="text-xs font-semibold text-foreground">AI Assistant</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">What can I help you with?</p>
            </div>
            <div className="p-2 space-y-0.5">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon
                return (
                  <button
                    key={action.label}
                    onClick={() => { router.push(action.href); setOpen(false) }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                  >
                    <Icon className="size-3.5 flex-shrink-0 text-primary" />
                    {action.label}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="flex size-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="size-5 text-white" />
            </motion.span>
          ) : (
            <motion.span key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <Bot className="size-5 text-white" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}

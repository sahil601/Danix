'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from './sidebar'
import { TopNav } from './top-nav'
import { CommandPalette } from './command-palette'
import { AIAssistantButton } from './ai-assistant-button'
import { AppFooter } from './app-footer'
import { ActivityDrawer } from './activity-drawer'
import { KeyboardShortcutsModal } from './keyboard-shortcuts'
import { ToastProvider } from '@/components/ui/toast'
import { motion } from 'framer-motion'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [activityOpen, setActivityOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Keyboard shortcut: ? for shortcuts modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === '?') setShortcutsOpen(true)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  if (!mounted) return null

  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Mobile Sidebar */}
        <Sidebar
          mobile
          open={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopNav
            onMenuClick={() => setMobileSidebarOpen(true)}
            onCommandOpen={() => setCommandOpen(true)}
            onActivityOpen={() => setActivityOpen(true)}
            onShortcutsOpen={() => setShortcutsOpen(true)}
          />

          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto"
          >
            {children}
            <AppFooter />
          </motion.main>
        </div>
      </div>

      {/* Global overlays */}
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
      <ActivityDrawer open={activityOpen} onClose={() => setActivityOpen(false)} />
      <KeyboardShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      <AIAssistantButton />
    </ToastProvider>
  )
}

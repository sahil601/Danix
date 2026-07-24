'use client'

import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, AlertTriangle, Info, XCircle, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'action'

export interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
  action?: { label: string; onClick: () => void }
}

interface ToastContextValue {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  warning: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  action: Zap,
}

const STYLES = {
  success: { icon: 'text-green-400', border: 'border-green-500/20', bg: 'bg-green-500/5' },
  error: { icon: 'text-red-400', border: 'border-red-500/20', bg: 'bg-red-500/5' },
  warning: { icon: 'text-yellow-400', border: 'border-yellow-500/20', bg: 'bg-yellow-500/5' },
  info: { icon: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/5' },
  action: { icon: 'text-primary', border: 'border-primary/20', bg: 'bg-primary/5' },
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const Icon = ICONS[toast.type]
  const style = STYLES[toast.type]

  useEffect(() => {
    const duration = toast.duration ?? 4000
    const timer = setTimeout(() => onRemove(toast.id), duration)
    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onRemove])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 48, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 48, scale: 0.95 }}
      transition={{ type: 'spring', damping: 30, stiffness: 350 }}
      className={cn(
        'flex items-start gap-3 w-80 rounded-xl border bg-card shadow-xl shadow-black/40 p-4',
        style.border, style.bg
      )}
    >
      <Icon className={cn('size-4 flex-shrink-0 mt-0.5', style.icon)} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{toast.title}</p>
        {toast.description && (
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{toast.description}</p>
        )}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className={cn('mt-2 text-xs font-semibold hover:underline', style.icon)}
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="size-3.5" />
      </button>
    </motion.div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev.slice(-4), { ...toast, id }])
  }, [])

  const success = useCallback((title: string, description?: string) => addToast({ type: 'success', title, description }), [addToast])
  const error = useCallback((title: string, description?: string) => addToast({ type: 'error', title, description }), [addToast])
  const warning = useCallback((title: string, description?: string) => addToast({ type: 'warning', title, description }), [addToast])
  const info = useCallback((title: string, description?: string) => addToast({ type: 'info', title, description }), [addToast])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9998] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              <ToastItem toast={toast} onRemove={removeToast} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

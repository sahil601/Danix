'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bot, Sparkles, RefreshCw, AlertTriangle, ShieldCheck, TrendingUp, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

const SUMMARY_POINTS = [
  { icon: AlertTriangle, color: 'text-red-400 bg-red-500/10', text: '14 critical findings require immediate attention across 3 active projects.' },
  { icon: ShieldCheck, color: 'text-blue-400 bg-blue-500/10', text: '12 assets scanned today. AI recommends patching Apache on api-gw.acme.com before addressing SMB misconfiguration.' },
  { icon: TrendingUp, color: 'text-orange-400 bg-orange-500/10', text: 'Risk score has increased by 3pts this week. Two high-risk paths to domain admin identified in FinTrust network.' },
  { icon: Clock, color: 'text-green-400 bg-green-500/10', text: 'Estimated 6 hours of remediation to close all critical findings. Addressing top 3 issues reduces risk score from 78 → 52.' },
]

function StreamingText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(startTimer)
  }, [delay])

  useEffect(() => {
    if (!started) return
    setDisplayed('')
    let i = 0
    const interval = setInterval(() => {
      if (i >= text.length) { clearInterval(interval); return }
      setDisplayed(text.slice(0, i + 1))
      i++
    }, 12)
    return () => clearInterval(interval)
  }, [text, started])

  return <span>{displayed}{displayed.length < text.length && started && <span className="animate-pulse">▋</span>}</span>
}

export function AIExecutiveSummary() {
  const [refreshing, setRefreshing] = useState(false)
  const [key, setKey] = useState(0)

  const handleRefresh = () => {
    setRefreshing(true)
    setKey((k) => k + 1)
    setTimeout(() => setRefreshing(false), 1200)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-primary/15">
            <Sparkles className="size-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">AI Executive Summary</h3>
            <p className="text-[10px] text-muted-foreground" suppressHydrationWarning>Generated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[10px] text-green-400">
            <span className="size-1.5 rounded-full bg-green-400 animate-pulse" />
            AI Online
          </div>
          <button
            onClick={handleRefresh}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <RefreshCw className={cn('size-3.5', refreshing && 'animate-spin')} />
          </button>
        </div>
      </div>

      <div key={key} className="space-y-3">
        {SUMMARY_POINTS.map((point, i) => {
          const Icon = point.icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="flex items-start gap-3 rounded-lg bg-zinc-900/50 border border-border/50 p-3"
            >
              <div className={cn('flex size-6 flex-shrink-0 items-center justify-center rounded-lg mt-0.5', point.color.split(' ')[1])}>
                <Icon className={cn('size-3.5', point.color.split(' ')[0])} />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <StreamingText text={point.text} delay={300 + i * 400} />
              </p>
            </motion.div>
          )
        })}
      </div>

      <div className="mt-4 flex items-center gap-2 text-[10px] text-muted-foreground border-t border-border/50 pt-3">
        <Bot className="size-3 text-primary" />
        <span>Powered by Danix AI Engine · Ollama / AGY Intelligence · Context: All active assessments</span>
      </div>
    </motion.div>
  )
}

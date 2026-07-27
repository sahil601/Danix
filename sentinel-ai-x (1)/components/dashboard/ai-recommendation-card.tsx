'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bot, Clock, TrendingDown, Zap, ChevronRight, AlertTriangle, AlertCircle } from 'lucide-react'
import { AI_RECOMMENDATIONS } from '@/lib/data'
import { fetchRecommendations } from '@/lib/api'
import { cn } from '@/lib/utils'

const ENHANCED_RECS = [
  {
    id: 'rec-1',
    priority: 'immediate',
    title: 'Patch RCE Vulnerability on api-gw.acme.com',
    description: 'CVE-2021-44228 is actively exploited in the wild. Immediate patching required.',
    impact: 'critical',
    fixTime: '2h',
    riskReduction: '26pts',
    action: 'View Finding',
  },
  {
    id: 'rec-2',
    priority: 'high',
    title: 'Rotate Exposed AWS Credentials',
    description: 'Active AWS keys found in public repo. Rotate and audit CloudTrail logs immediately.',
    impact: 'high',
    fixTime: '30min',
    riskReduction: '8pts',
    action: 'Rotate Keys',
  },
  {
    id: 'rec-3',
    priority: 'medium',
    title: 'Upgrade TLS Configuration on Legacy Systems',
    description: 'Disable TLS 1.0/1.1 across legacy servers. Enable TLS 1.3 where possible.',
    impact: 'medium',
    fixTime: '4h',
    riskReduction: '5pts',
    action: 'View Guide',
  },
  {
    id: 'rec-4',
    priority: 'medium',
    title: 'Implement WAF Rules for SQL Injection',
    description: 'Deploy WAF rules to block SQL injection while root cause is remediated.',
    impact: 'medium',
    fixTime: '1h',
    riskReduction: '4pts',
    action: 'Configure WAF',
  },
]

const PRIORITY_CONFIG: Record<string, { icon: typeof AlertTriangle; iconColor: string; badge: string; badgeText: string }> = {
  immediate: { icon: AlertTriangle, iconColor: 'text-red-400', badge: 'bg-red-500/15 text-red-400 border-red-500/25', badgeText: 'Immediate' },
  high: { icon: AlertCircle, iconColor: 'text-orange-400', badge: 'bg-orange-500/15 text-orange-400 border-orange-500/25', badgeText: 'High' },
  medium: { icon: AlertCircle, iconColor: 'text-yellow-400', badge: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25', badgeText: 'Medium' },
}

export function AIRecommendationCard() {
  const [recommendations, setRecommendations] = useState(ENHANCED_RECS)

  useEffect(() => {
    fetchRecommendations().then(res => setRecommendations(res.recommendations || res)).catch(() => {})
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="rounded-xl border border-border bg-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bot className="size-4 text-primary" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">AI Recommendations</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Prioritized by impact &amp; exploitability</p>
          </div>
        </div>
        <span className="text-[10px] text-muted-foreground">{recommendations.length} actions</span>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec: any, i: number) => {
          const cfg = PRIORITY_CONFIG[rec.priority?.toLowerCase()] || PRIORITY_CONFIG['medium']
          const PriorityIcon = cfg.icon

          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              className="group rounded-lg border border-border bg-zinc-900/30 p-3 hover:border-zinc-600 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <PriorityIcon className={cn('size-3.5 mt-0.5 flex-shrink-0', cfg.iconColor)} />
                  <p className="text-xs font-semibold text-foreground leading-tight">{rec.title}</p>
                </div>
                <span className={cn('flex-shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold', cfg.badge)}>
                  {cfg.badgeText}
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed ml-5 mb-3">{rec.description}</p>

              <div className="flex items-center justify-between ml-5">
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="size-3" /> {rec.fixTime}
                  </span>
                  <span className="flex items-center gap-1 text-green-400">
                    <TrendingDown className="size-3" /> -{rec.riskReduction}
                  </span>
                </div>
                <button className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary hover:bg-primary/20 transition-colors opacity-0 group-hover:opacity-100">
                  {rec.action} <ChevronRight className="size-3" />
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

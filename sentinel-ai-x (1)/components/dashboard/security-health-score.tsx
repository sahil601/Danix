'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { TrendingDown, TrendingUp, Minus, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

function CircularProgress({ value, size = 140 }: { value: number; size?: number }) {
  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => setDisplayed(value), 100)
    return () => clearTimeout(timeout)
  }, [value])

  const strokeDashoffset = circumference - (displayed / 100) * circumference

  const color =
    value >= 80 ? '#22C55E' :
    value >= 60 ? '#3B82F6' :
    value >= 40 ? '#F59E0B' :
    '#EF4444'

  const grade =
    value >= 80 ? 'A' :
    value >= 70 ? 'B' :
    value >= 60 ? 'C' :
    value >= 50 ? 'D' : 'F'

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#27272A"
          strokeWidth={10}
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-bold text-foreground tabular-nums"
          style={{ color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {value}
        </motion.span>
        <span className="text-xs font-bold text-muted-foreground">/ 100</span>
        <span className="text-xs font-semibold mt-0.5" style={{ color }}>Grade {grade}</span>
      </div>
    </div>
  )
}

const SCORE_ITEMS = [
  { label: 'Vulnerability Management', score: 68, max: 100 },
  { label: 'Asset Coverage', score: 82, max: 100 },
  { label: 'Patch Compliance', score: 71, max: 100 },
  { label: 'Incident Response', score: 65, max: 100 },
]

export function SecurityHealthScore() {
  const overallScore = 72

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-xl border border-border bg-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Security Health Score</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Organization-wide security posture</p>
        </div>
        <Shield className="size-4 text-primary" />
      </div>

      <div className="flex items-center gap-6">
        <CircularProgress value={overallScore} />

        <div className="flex-1 space-y-3">
          {SCORE_ITEMS.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-muted-foreground truncate max-w-[130px]">{item.label}</span>
                <span className="text-[11px] font-semibold text-foreground ml-2">{item.score}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-zinc-800">
                <motion.div
                  className={cn(
                    'h-1.5 rounded-full',
                    item.score >= 80 ? 'bg-green-500' :
                    item.score >= 60 ? 'bg-primary' :
                    item.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.score / item.max) * 100}%` }}
                  transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trend */}
      <div className="mt-4 flex items-center gap-4 pt-4 border-t border-border">
        <div className="flex items-center gap-1.5 text-xs">
          <div className="flex items-center gap-1 text-red-400">
            <TrendingDown className="size-3.5" />
            <span className="font-semibold">-3pts</span>
          </div>
          <span className="text-muted-foreground">vs last week</span>
        </div>
        <div className="h-3 w-px bg-border" />
        <div className="flex items-center gap-1.5 text-xs">
          <span className="font-semibold text-orange-400">HIGH</span>
          <span className="text-muted-foreground">Organization Risk (78)</span>
        </div>
      </div>
    </motion.div>
  )
}

'use client'

import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: number | string
  change?: number
  changeLabel?: string
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
  className?: string
  delay?: number
  suffix?: string
  animate?: boolean
}

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString() + suffix)

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.2, ease: 'easeOut' })
    return controls.stop
  }, [value, count])

  return <motion.span>{rounded}</motion.span>
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconColor = 'text-primary',
  iconBg = 'bg-primary/10',
  className,
  delay = 0,
  suffix = '',
  animate: shouldAnimate = true,
}: MetricCardProps) {
  const isPositiveChange = change !== undefined && change > 0
  const isNegativeChange = change !== undefined && change < 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className={cn(
        'group relative overflow-hidden rounded-xl border border-border bg-card p-5',
        'hover:border-zinc-600 transition-all duration-200',
        className
      )}
    >
      {/* Subtle gradient hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider truncate">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold text-foreground tabular-nums">
            {shouldAnimate && typeof value === 'number' ? (
              <AnimatedCounter value={value} suffix={suffix} />
            ) : (
              `${value}${suffix}`
            )}
          </p>
          {change !== undefined && (
            <p
              className={cn(
                'mt-1 text-xs font-medium',
                isPositiveChange && 'text-green-400',
                isNegativeChange && 'text-red-400',
                !isPositiveChange && !isNegativeChange && 'text-muted-foreground'
              )}
            >
              {isPositiveChange && '+'}
              {change}
              {changeLabel ? ` ${changeLabel}` : '% from last week'}
            </p>
          )}
        </div>
        <div className={cn('flex-shrink-0 rounded-lg p-2.5', iconBg)}>
          <Icon className={cn('size-5', iconColor)} />
        </div>
      </div>
    </motion.div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Cpu, MemoryStick, Database, Bot, Zap, BookOpen, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

function useAnimatedValue(base: number, variance: number) {
  const [value, setValue] = useState(base)
  useEffect(() => {
    const interval = setInterval(() => {
      setValue(Math.min(100, Math.max(0, base + (Math.random() - 0.5) * variance * 2)))
    }, 2000)
    return () => clearInterval(interval)
  }, [base, variance])
  return Math.round(value)
}

function GaugeBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
      <motion.div
        className={cn('h-1.5 rounded-full', color)}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />
    </div>
  )
}

export function LiveSystemStatus() {
  const cpu = useAnimatedValue(34, 8)
  const ram = useAnimatedValue(61, 6)
  const dbLatency = useAnimatedValue(12, 5)
  const llmTokens = useAnimatedValue(847, 100)

  const STATUS_ITEMS = [
    {
      icon: Cpu,
      label: 'CPU',
      value: `${cpu}%`,
      bar: cpu,
      barColor: cpu > 80 ? 'bg-red-500' : cpu > 60 ? 'bg-yellow-500' : 'bg-primary',
      status: cpu > 80 ? 'high' : 'normal',
    },
    {
      icon: MemoryStick,
      label: 'RAM',
      value: `${ram}%`,
      bar: ram,
      barColor: ram > 80 ? 'bg-red-500' : ram > 60 ? 'bg-yellow-500' : 'bg-green-500',
      status: ram > 80 ? 'high' : 'normal',
    },
    {
      icon: Database,
      label: 'Database',
      value: `${Math.round(dbLatency)}ms`,
      bar: Math.min(100, dbLatency * 2),
      barColor: 'bg-cyan-500',
      status: 'online',
    },
    {
      icon: Bot,
      label: 'LLM',
      value: 'Online',
      bar: 100,
      barColor: 'bg-emerald-500',
      status: 'online',
    },
    {
      icon: Zap,
      label: 'BG Jobs',
      value: '4 running',
      bar: 40,
      barColor: 'bg-purple-500',
      status: 'normal',
    },
    {
      icon: BookOpen,
      label: 'Knowledge Index',
      value: '98.2%',
      bar: 98.2,
      barColor: 'bg-green-500',
      status: 'online',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="rounded-xl border border-border bg-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="size-4 text-muted-foreground" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">Live System Status</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Real-time infrastructure health</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-green-400">
          <span className="size-1.5 rounded-full bg-green-400 animate-pulse" />
          All systems nominal
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {STATUS_ITEMS.map((item, i) => {
          const Icon = item.icon
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-lg border border-border/50 bg-zinc-900/30 p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Icon className="size-3.5 text-muted-foreground" />
                  <span className="text-[11px] text-muted-foreground">{item.label}</span>
                </div>
                <span className={cn(
                  'text-[11px] font-semibold',
                  item.status === 'online' ? 'text-green-400' :
                  item.status === 'high' ? 'text-red-400' : 'text-foreground'
                )}>
                  {item.value}
                </span>
              </div>
              <GaugeBar value={item.bar} color={item.barColor} />
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

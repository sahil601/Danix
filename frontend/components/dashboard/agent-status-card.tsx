'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bot, Cpu, Activity, Clock, CheckCircle2, Loader2, Pause } from 'lucide-react'
import { cn } from '@/lib/utils'

const AGENTS = [
  { name: 'Supervisor', status: 'active' as const, tasks: 3, time: '2s ago', exec: '1.2s', role: 'Orchestrates all agents and manages workflow' },
  { name: 'Planner', status: 'active' as const, tasks: 1, time: '5s ago', exec: '0.8s', role: 'Decomposes tasks into execution steps' },
  { name: 'Recon', status: 'running' as const, tasks: 2, time: '1s ago', exec: '14.3s', role: 'Network discovery and asset enumeration' },
  { name: 'Network', status: 'running' as const, tasks: 1, time: '3s ago', exec: '8.7s', role: 'Port scanning and service detection' },
  { name: 'Web', status: 'idle' as const, tasks: 0, time: '12s ago', exec: '—', role: 'Web application vulnerability analysis' },
  { name: 'Reasoning', status: 'active' as const, tasks: 1, time: '4s ago', exec: '2.1s', role: 'CVE analysis and risk scoring' },
  { name: 'Reporting', status: 'idle' as const, tasks: 0, time: '8s ago', exec: '—', role: 'Report generation and formatting' },
]

const STATUS_CONFIG = {
  active: { dot: 'bg-green-400', text: 'text-green-400', label: 'Active', icon: CheckCircle2 },
  running: { dot: 'bg-blue-400 animate-pulse', text: 'text-blue-400', label: 'Running', icon: Loader2 },
  idle: { dot: 'bg-zinc-600', text: 'text-zinc-500', label: 'Idle', icon: Pause },
  error: { dot: 'bg-red-400', text: 'text-red-400', label: 'Error', icon: Activity },
}

export function AgentStatusCard() {
  const [selectedAgent, setSelectedAgent] = useState<typeof AGENTS[0] | null>(null)
  const [tick, setTick] = useState(0)

  // Animate exec times for running agents
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  const running = AGENTS.filter((a) => a.status === 'running').length
  const active = AGENTS.filter((a) => a.status === 'active').length

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-xl border border-border bg-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bot className="size-4 text-primary" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">Agent Status</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {running} running · {active} active · {AGENTS.length - running - active} idle
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Cpu className="size-3" />
          <span>{(running * 14 + active * 4)}% CPU</span>
        </div>
      </div>

      <div className="space-y-1">
        {AGENTS.map((agent, i) => {
          const cfg = STATUS_CONFIG[agent.status]
          const StatusIcon = cfg.icon
          const isSelected = selectedAgent?.name === agent.name

          return (
            <motion.button
              key={agent.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedAgent(isSelected ? null : agent)}
              className={cn(
                'w-full flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-left',
                isSelected ? 'bg-primary/10 border border-primary/20' : 'hover:bg-accent/50'
              )}
            >
              {/* Status dot */}
              <span className={cn('size-2 rounded-full flex-shrink-0', cfg.dot)} />

              {/* Name */}
              <span className="flex-1 text-xs font-medium text-foreground">{agent.name}</span>

              {/* Tasks badge */}
              {agent.tasks > 0 && (
                <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                  {agent.tasks} tasks
                </span>
              )}

              {/* Exec time */}
              <div className="flex items-center gap-1 text-[10px]">
                <Clock className="size-2.5 text-muted-foreground" />
                <span className={cn('font-mono', agent.status === 'running' ? 'text-blue-400' : 'text-muted-foreground')}>
                  {agent.status === 'running'
                    ? `${(parseFloat(agent.exec) + tick * 0.1).toFixed(1)}s`
                    : agent.exec}
                </span>
              </div>

              {/* Status icon */}
              <StatusIcon className={cn(
                'size-3.5 flex-shrink-0',
                cfg.text,
                agent.status === 'running' && 'animate-spin'
              )} />
            </motion.button>
          )
        })}
      </div>

      {/* Selected agent detail */}
      {selectedAgent && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="mt-3 rounded-lg border border-border/50 bg-zinc-900/50 p-3"
        >
          <p className="text-xs font-semibold text-foreground mb-1">{selectedAgent.name} Agent</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{selectedAgent.role}</p>
          <p className="text-[10px] text-muted-foreground mt-1.5">Last heartbeat: {selectedAgent.time}</p>
        </motion.div>
      )}
    </motion.div>
  )
}

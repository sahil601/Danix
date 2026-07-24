'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  ScanLine,
  Bot,
  FileText,
  Clock,
  CheckCircle2,
  PauseCircle,
  Filter,
  ChevronRight,
  Calendar,
  FolderKanban,
  Download,
  RefreshCw,
  TrendingUp,
  Activity,
} from 'lucide-react'
import { DEMO_PROJECTS, HISTORY_ITEMS } from '@/lib/data'
import { StatusBadge } from '@/components/ui/severity-badge'
import { cn } from '@/lib/utils'

/* ── Full history data ────────────────────────────────────────────────────── */
const FULL_HISTORY = [
  { id: 'h-1', type: 'scan', name: 'Acme External Full Scan', date: '2025-07-19', time: '14:32', status: 'completed', project: 'prj-1', meta: '47 findings · 23 assets · 2h 14m' },
  { id: 'h-2', type: 'report', name: 'Acme Corp Executive Summary v1.2', date: '2025-07-19', time: '16:00', status: 'completed', project: 'prj-1', meta: 'PDF · 2.4 MB · v1.2' },
  { id: 'h-3', type: 'ai_chat', name: 'Conversation: Explain RCE findings', date: '2025-07-18', time: '11:45', status: 'completed', project: 'prj-1', meta: '8 messages · 4 min' },
  { id: 'h-4', type: 'scan', name: 'FinTrust API Discovery', date: '2025-07-19', time: '13:10', status: 'running', project: 'prj-2', meta: '18 findings · 14 assets · ongoing' },
  { id: 'h-5', type: 'scan', name: 'MedHealth Cloud Inventory', date: '2025-07-17', time: '08:48', status: 'completed', project: 'prj-3', meta: '12 findings · 89 assets · 48m' },
  { id: 'h-6', type: 'ai_chat', name: 'Conversation: Prioritize FinTrust findings', date: '2025-07-16', time: '15:30', status: 'completed', project: 'prj-2', meta: '12 messages · 7 min' },
  { id: 'h-7', type: 'scan', name: 'RetailMax API Endpoints', date: '2025-07-15', time: '15:20', status: 'paused', project: 'prj-4', meta: '8 findings · 5 assets · 32m' },
  { id: 'h-8', type: 'report', name: 'MedHealth HIPAA Compliance Report', date: '2025-07-01', time: '09:00', status: 'completed', project: 'prj-3', meta: 'PDF · 5.7 MB · v2.0' },
  { id: 'h-9', type: 'ai_chat', name: 'Conversation: HIPAA compliance analysis', date: '2025-06-30', time: '14:20', status: 'completed', project: 'prj-3', meta: '21 messages · 11 min' },
  { id: 'h-10', type: 'scan', name: 'Acme Web App Scan', date: '2025-07-10', time: '08:00', status: 'completed', project: 'prj-1', meta: '34 findings · 8 assets · 1h 10m' },
  { id: 'h-11', type: 'report', name: 'RetailMax API Assessment', date: '2025-07-16', time: '11:30', status: 'completed', project: 'prj-4', meta: 'JSON · 1.2 MB · v1.0' },
  { id: 'h-12', type: 'ai_chat', name: 'Conversation: Network segmentation review', date: '2025-07-14', time: '09:15', status: 'completed', project: 'prj-5', meta: '6 messages · 3 min' },
]

const TYPE_CONFIG: Record<string, { icon: React.ElementType; label: string; color: string; bg: string }> = {
  scan: { icon: ScanLine, label: 'Scan', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  ai_chat: { icon: Bot, label: 'AI Chat', color: 'text-green-400', bg: 'bg-green-500/10' },
  report: { icon: FileText, label: 'Report', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
}

/* ── Group by date ────────────────────────────────────────────────────────── */
function groupByDate(items: typeof FULL_HISTORY) {
  const groups: Record<string, typeof FULL_HISTORY> = {}
  items.forEach((item) => {
    if (!groups[item.date]) groups[item.date] = []
    groups[item.date].push(item)
  })
  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a))
}

function formatDate(date: string) {
  const d = new Date(date)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export default function HistoryPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [projectFilter, setProjectFilter] = useState('all')

  const filtered = FULL_HISTORY.filter((item) => {
    const matchSearch = !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.meta.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'all' || item.type === typeFilter
    const matchProject = projectFilter === 'all' || item.project === projectFilter
    return matchSearch && matchType && matchProject
  })

  const grouped = groupByDate(filtered)

  const stats = {
    scans: FULL_HISTORY.filter((h) => h.type === 'scan').length,
    chats: FULL_HISTORY.filter((h) => h.type === 'ai_chat').length,
    reports: FULL_HISTORY.filter((h) => h.type === 'report').length,
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">History</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {FULL_HISTORY.length} events · all platforms
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-zinc-600 transition-colors self-start sm:self-auto">
          <Download className="size-4" />
          Export Log
        </button>
      </div>

      {/* Activity chart — last 14 days */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Activity — Last 14 Days</h2>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-blue-500 inline-block" /> Scans</span>
            <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-green-500 inline-block" /> AI Chats</span>
            <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-yellow-500 inline-block" /> Reports</span>
          </div>
        </div>
        <div className="flex items-end gap-1.5 h-20">
          {[
            { scans: 2, chats: 1, reports: 0, day: 'Jul 7' },
            { scans: 0, chats: 0, reports: 0, day: 'Jul 8' },
            { scans: 1, chats: 2, reports: 0, day: 'Jul 9' },
            { scans: 3, chats: 0, reports: 0, day: 'Jul 10' },
            { scans: 0, chats: 1, reports: 0, day: 'Jul 11' },
            { scans: 0, chats: 0, reports: 0, day: 'Jul 12' },
            { scans: 0, chats: 0, reports: 0, day: 'Jul 13' },
            { scans: 1, chats: 0, reports: 1, day: 'Jul 14' },
            { scans: 1, chats: 1, reports: 0, day: 'Jul 15' },
            { scans: 0, chats: 0, reports: 1, day: 'Jul 16' },
            { scans: 1, chats: 1, reports: 0, day: 'Jul 17' },
            { scans: 2, chats: 0, reports: 0, day: 'Jul 18' },
            { scans: 2, chats: 1, reports: 1, day: 'Jul 19' },
            { scans: 0, chats: 0, reports: 0, day: 'Jul 20' },
          ].map((d, i) => {
            const total = d.scans + d.chats + d.reports
            const maxTotal = 4
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group cursor-default">
                <div className="flex flex-col-reverse gap-0.5 w-full" style={{ height: `${(total / maxTotal) * 72}px` }}>
                  {d.reports > 0 && <div className="rounded-sm bg-yellow-500/70 group-hover:bg-yellow-500 transition-colors" style={{ height: `${(d.reports / maxTotal) * 72}px` }} />}
                  {d.chats > 0 && <div className="rounded-sm bg-green-500/70 group-hover:bg-green-500 transition-colors" style={{ height: `${(d.chats / maxTotal) * 72}px` }} />}
                  {d.scans > 0 && <div className="rounded-sm bg-blue-500/70 group-hover:bg-blue-500 transition-colors" style={{ height: `${(d.scans / maxTotal) * 72}px` }} />}
                  {total === 0 && <div className="rounded-sm bg-zinc-800 h-1 w-full" />}
                </div>
                <span className="text-[8px] text-muted-foreground/60 mt-1 hidden sm:block">{d.day.split(' ')[1]}</span>
              </div>
            )
          })}
        </div>
        <div className="flex items-center justify-between mt-1 text-[10px] text-muted-foreground">
          <span>Jul 7</span><span>Jul 20</span>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Scans', value: stats.scans, icon: ScanLine, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'AI Chats', value: stats.chats, icon: Bot, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Reports', value: stats.reports, icon: FileText, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl border border-border bg-card p-4 flex items-center gap-3"
            >
              <div className={cn('flex size-9 items-center justify-center rounded-lg', stat.bg)}>
                <Icon className={cn('size-5', stat.color)} />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search history..."
            className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Type filter */}
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
          {(['all', 'scan', 'ai_chat', 'report'] as const).map((type) => {
            const cfg = type !== 'all' ? TYPE_CONFIG[type] : null
            return (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors',
                  typeFilter === type ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {cfg && <cfg.icon className="size-3" />}
                {type === 'ai_chat' ? 'AI Chat' : type}
              </button>
            )
          })}
        </div>

        {/* Project filter */}
        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground outline-none focus:border-primary transition-colors"
        >
          <option value="all">All Projects</option>
          {DEMO_PROJECTS.map((p) => (
            <option key={p.id} value={p.id}>{p.client}</option>
          ))}
        </select>

        {/* Date range */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            defaultValue="2025-07-01"
            className="rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground outline-none focus:border-primary transition-colors"
          />
          <span className="text-xs text-muted-foreground">to</span>
          <input
            type="date"
            defaultValue="2025-07-20"
            className="rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {grouped.map(([date, items], groupIdx) => (
          <div key={date}>
            {/* Date header */}
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="size-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm font-semibold text-foreground">{formatDate(date)}</span>
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">{items.length} events</span>
            </div>

            {/* Items */}
            <div className="relative pl-6">
              {/* Vertical line */}
              <div className="absolute left-2.5 top-0 bottom-0 w-px bg-border" />

              <div className="space-y-3">
                {items.map((item, i) => {
                  const cfg = TYPE_CONFIG[item.type]
                  const Icon = cfg.icon
                  const project = DEMO_PROJECTS.find((p) => p.id === item.project)

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: groupIdx * 0.05 + i * 0.03 }}
                      className="relative flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:border-zinc-600 transition-all group cursor-pointer"
                    >
                      {/* Timeline dot */}
                      <div className={cn('absolute -left-[19px] flex size-4 items-center justify-center rounded-full border-2 border-background', cfg.bg)}>
                        <span className={cn('size-1.5 rounded-full', cfg.color.replace('text-', 'bg-'))} />
                      </div>

                      {/* Icon */}
                      <div className={cn('flex size-8 flex-shrink-0 items-center justify-center rounded-lg', cfg.bg)}>
                        <Icon className={cn('size-4', cfg.color)} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-foreground truncate">{item.name}</span>
                          <StatusBadge status={item.status} />
                        </div>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="size-3" /> {item.time}
                          </span>
                          <span className="text-xs text-muted-foreground">{item.meta}</span>
                          {project && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <FolderKanban className="size-3" /> {project.client}
                            </span>
                          )}
                        </div>
                      </div>

                      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                        <ChevronRight className="size-4" />
                      </button>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center">
            <Clock className="size-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium text-foreground">No history found</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

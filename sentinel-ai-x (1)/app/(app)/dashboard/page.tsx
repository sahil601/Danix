'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Activity,
  Server,
  FolderKanban,
  ScanLine,
  FileText,
  Bot,
  Globe,
  Cpu,
  Database,
  Zap,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Brain,
} from 'lucide-react'
import Link from 'next/link'
import { MetricCard } from '@/components/ui/metric-card'
import { SeverityBadge, StatusBadge } from '@/components/ui/severity-badge'
import { RiskTrendChart, SeverityPieChart, ScanTimelineChart } from '@/components/dashboard/dashboard-charts'
import { SecurityHealthScore } from '@/components/dashboard/security-health-score'
import { AIExecutiveSummary } from '@/components/dashboard/ai-executive-summary'
import { AgentStatusCard } from '@/components/dashboard/agent-status-card'
import { AIRecommendationCard } from '@/components/dashboard/ai-recommendation-card'
import { LiveSystemStatus } from '@/components/dashboard/live-system-status'
import {
  DEMO_PROJECTS,
  DEMO_FINDINGS,
  ACTIVITY_FEED,
  AGENT_STATUS,
  SYSTEM_STATUS,
  AI_RECOMMENDATIONS,
} from '@/lib/data'
import { fetchProjects, fetchFindings, fetchActivityFeed } from '@/lib/api'

const METRICS = (data: any) => [
  { title: 'Critical Vulnerabilities', value: data?.findings_count || 0, change: 0, icon: AlertTriangle, iconColor: 'text-red-400', iconBg: 'bg-red-500/10' },
  { title: 'Total Findings', value: data?.findings_count || 0, change: 0, icon: AlertCircle, iconColor: 'text-yellow-400', iconBg: 'bg-yellow-500/10' },
  { title: 'Live Hosts', value: data?.assets_count || 0, change: 0, icon: Server, iconColor: 'text-green-400', iconBg: 'bg-green-500/10' },
  { title: 'Active Projects', value: data?.projects_count || 0, change: 0, icon: FolderKanban, iconColor: 'text-purple-400', iconBg: 'bg-purple-500/10' },
  { title: 'Scans Run', value: data?.scans_count || 0, change: 0, icon: ScanLine, iconColor: 'text-primary', iconBg: 'bg-primary/10' },
  { title: 'Reports Generated', value: 0, change: 0, icon: FileText, iconColor: 'text-zinc-400', iconBg: 'bg-zinc-500/10' },
]

const QUICK_ACTIONS = [
  { label: 'New Scan', icon: ScanLine, href: '/scans?new=true', desc: 'Start a security scan', color: 'text-primary bg-primary/10 hover:bg-primary/20' },
  { label: 'Generate Report', icon: FileText, href: '/reports?new=true', desc: 'Create a report', color: 'text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20' },
  { label: 'AI Chat', icon: Bot, href: '/ai-chat', desc: 'Ask the AI assistant', color: 'text-green-400 bg-green-500/10 hover:bg-green-500/20' },
  { label: 'Knowledge Base', icon: Brain, href: '/knowledge-base', desc: 'Browse security intel', color: 'text-purple-400 bg-purple-500/10 hover:bg-purple-500/20' },
]

export default function DashboardPage() {
  const [projects, setProjects] = useState(DEMO_PROJECTS)
  const [findings, setFindings] = useState(DEMO_FINDINGS)
  const [activityFeed, setActivityFeed] = useState(ACTIVITY_FEED)
  const [overviewData, setOverviewData] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    import('@/lib/api').then(({ fetchProjects, fetchFindings, fetchActivityFeed, fetchDashboardOverview }) => {
      fetchProjects().then(res => setProjects(res.projects || res)).catch(() => {})
      fetchFindings().then(res => setFindings(res.findings || res)).catch(() => {})
      fetchActivityFeed().then(res => setActivityFeed((res as any).activityFeed || res)).catch(() => {})
      fetchDashboardOverview().then(res => setOverviewData(res)).catch(() => {})
      setLoading(false)
    })
  }, [])

  return (
    <div className="space-y-6 p-6">
      {/* Hero Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl border border-border bg-card p-6"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex size-2 rounded-full bg-green-400" />
              <span className="text-xs font-medium text-green-400">All systems operational</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Good morning, John</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              You have <span className="text-red-400 font-semibold">14 critical</span> vulnerabilities requiring attention across 3 active projects.
            </p>

            {/* Scores row */}
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Organization Risk:</span>
                <span className="text-lg font-bold text-orange-400">HIGH (78)</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Security Score:</span>
                <span className="text-lg font-bold text-primary">72/100</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">AI Health:</span>
                <span className="text-xs font-semibold text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="size-3" /> Optimal
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 lg:flex lg:gap-2">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className={`flex flex-col items-center gap-1.5 rounded-xl p-3 text-center transition-colors ${action.color}`}
                >
                  <Icon className="size-5" />
                  <span className="text-xs font-semibold whitespace-nowrap">{action.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {METRICS(overviewData).map((metric, i) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            icon={metric.icon}
            iconColor={metric.iconColor}
            iconBg={metric.iconBg}
            delay={i * 0.04}
            suffix={(metric as any).suffix}
          />
        ))}
      </div>

      {/* AI Executive Summary + Security Health Score */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AIExecutiveSummary />
        </div>
        <SecurityHealthScore />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RiskTrendChart />
        </div>
        <SeverityPieChart />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ScanTimelineChart />

        <AIRecommendationCard />
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Latest platform events</p>
            </div>
            <Link href="/history" className="text-xs text-primary hover:underline flex items-center gap-0.5">
              View all <ChevronRight className="size-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {activityFeed.slice(0, 6).map((item: any) => (
              <div key={item.id} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {item.severity === 'critical' ? (
                    <span className="flex size-6 items-center justify-center rounded-full bg-red-500/10"><AlertTriangle className="size-3 text-red-400" /></span>
                  ) : item.severity === 'high' ? (
                    <span className="flex size-6 items-center justify-center rounded-full bg-orange-500/10"><AlertTriangle className="size-3 text-orange-400" /></span>
                  ) : (
                    <span className="flex size-6 items-center justify-center rounded-full bg-zinc-700/50"><Activity className="size-3 text-zinc-400" /></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground leading-relaxed">{item.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.time} · {item.user}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Status + System Status (enhanced) */}
        <div className="space-y-4">
          <AgentStatusCard />
          <LiveSystemStatus />
        </div>
      </div>
    </div>
  )
}

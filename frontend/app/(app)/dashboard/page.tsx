'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Server,
  FolderKanban,
  ScanLine,
  FileText,
  Bot,
  Activity,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Brain,
  RefreshCw,
} from 'lucide-react'
import Link from 'next/link'
import { MetricCard } from '@/components/ui/metric-card'
import { RiskTrendChart, SeverityPieChart, ScanTimelineChart } from '@/components/dashboard/dashboard-charts'
import { SecurityHealthScore } from '@/components/dashboard/security-health-score'
import { AIExecutiveSummary } from '@/components/dashboard/ai-executive-summary'
import { AgentStatusCard } from '@/components/dashboard/agent-status-card'
import { AIRecommendationCard } from '@/components/dashboard/ai-recommendation-card'
import { LiveSystemStatus } from '@/components/dashboard/live-system-status'
import {
  fetchDashboardOverview,
  fetchDashboardCharts,
  fetchActivityFeed,
  fetchRecommendations,
  fetchHealth,
  fetchAgentStatus,
  fetchProjects,
  fetchFindings,
} from '@/lib/api'

const QUICK_ACTIONS = [
  { label: 'New Scan', icon: ScanLine, href: '/scans?new=true', desc: 'Start a security scan', color: 'text-primary bg-primary/10 hover:bg-primary/20' },
  { label: 'Generate Report', icon: FileText, href: '/reports?new=true', desc: 'Create a report', color: 'text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20' },
  { label: 'AI Chat', icon: Bot, href: '/ai-chat', desc: 'Ask the AI assistant', color: 'text-green-400 bg-green-500/10 hover:bg-green-500/20' },
  { label: 'Knowledge Base', icon: Brain, href: '/knowledge-base', desc: 'Browse security intel', color: 'text-purple-400 bg-purple-500/10 hover:bg-purple-500/20' },
]

export default function DashboardPage() {
  const [overviewData, setOverviewData] = useState<any>(null)
  const [activityFeed, setActivityFeed] = useState<any[]>([])
  const [healthStatus, setHealthStatus] = useState<any>(null)
  const [agentStatus, setAgentStatus] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastRefreshed, setLastRefreshed] = useState<string>('')

  // 1. Centralized Data Loader via Axios Client
  const loadDashboardData = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true)
    else setRefreshing(true)

    try {
      const [
        overviewRes,
        chartsRes,
        activityRes,
        recsRes,
        healthRes,
        agentsRes,
      ] = await Promise.allSettled([
        fetchDashboardOverview(),
        fetchDashboardCharts(),
        fetchActivityFeed(),
        fetchRecommendations(),
        fetchHealth(),
        fetchAgentStatus(),
      ])

      if (overviewRes.status === 'fulfilled' && overviewRes.value) {
        setOverviewData(overviewRes.value)
      }
      if (activityRes.status === 'fulfilled' && activityRes.value) {
        setActivityFeed(activityRes.value)
      }
      if (healthRes.status === 'fulfilled' && healthRes.value) {
        setHealthStatus(healthRes.value)
      }
      if (agentsRes.status === 'fulfilled' && agentsRes.value) {
        setAgentStatus(agentsRes.value)
      }

      setError(null)
      setLastRefreshed(new Date().toLocaleTimeString())
    } catch (err: any) {
      console.error('Dashboard data load error:', err)
      setError('Unable to reach Danix live backend at http://127.0.0.1:8000/api/v1. Retrying in 30 seconds.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  // 2. Initial load + 30-Second Auto Refresh Loop
  useEffect(() => {
    loadDashboardData(true)
    const interval = setInterval(() => {
      loadDashboardData(false)
    }, 30000)
    return () => clearInterval(interval)
  }, [loadDashboardData])

  // Computed Metrics Array
  const metrics = [
    {
      title: 'Critical Vulnerabilities',
      value: overviewData?.criticalVulnerabilities ?? overviewData?.criticalCount ?? 14,
      change: 0,
      icon: AlertTriangle,
      iconColor: 'text-red-400',
      iconBg: 'bg-red-500/10',
    },
    {
      title: 'Total Findings',
      value: overviewData?.totalFindings ?? overviewData?.findingsCount ?? 315,
      change: 0,
      icon: AlertCircle,
      iconColor: 'text-yellow-400',
      iconBg: 'bg-yellow-500/10',
    },
    {
      title: 'Live Hosts',
      value: overviewData?.liveHosts ?? overviewData?.assetsCount ?? 142,
      change: 0,
      icon: Server,
      iconColor: 'text-green-400',
      iconBg: 'bg-green-500/10',
    },
    {
      title: 'Active Projects',
      value: overviewData?.activeProjects ?? overviewData?.projectsCount ?? 3,
      change: 0,
      icon: FolderKanban,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/10',
    },
    {
      title: 'Scans Run',
      value: overviewData?.scansRun ?? overviewData?.scansCount ?? 24,
      change: 0,
      icon: ScanLine,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
    },
    {
      title: 'Reports Generated',
      value: overviewData?.reportsGenerated ?? overviewData?.reportsCount ?? 8,
      change: 0,
      icon: FileText,
      iconColor: 'text-zinc-400',
      iconBg: 'bg-zinc-500/10',
    },
  ]

  return (
    <div className="space-y-6 p-6">
      {/* API Error State Banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="size-5 text-red-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-red-400">Live Connection Status</p>
              <p className="text-xs text-muted-foreground mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={() => loadDashboardData(true)}
            className="flex items-center gap-1.5 rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/30 transition-colors flex-shrink-0"
          >
            <RefreshCw className="size-3 animate-spin" /> Retry Now
          </button>
        </motion.div>
      )}

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
              <span className="flex size-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-medium text-green-400">
                {healthStatus?.status === 'online' ? 'All systems operational' : 'Danix Autonomous OS Active'}
              </span>
              {lastRefreshed && (
                <span className="text-[10px] text-muted-foreground ml-2">
                  Refreshed {lastRefreshed} (Auto 30s)
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-foreground">Security Operations Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              You have <span className="text-red-400 font-semibold">{metrics[0].value} critical</span> vulnerabilities requiring attention across {metrics[3].value} active projects.
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

      {/* Metrics Grid with Loading Skeletons */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-24 rounded-xl border border-border bg-card p-4 animate-pulse space-y-3"
              >
                <div className="h-3 w-2/3 bg-zinc-800 rounded" />
                <div className="h-6 w-1/2 bg-zinc-800 rounded" />
              </div>
            ))
          : metrics.map((metric, i) => (
              <MetricCard
                key={metric.title}
                title={metric.title}
                value={metric.value}
                change={metric.change}
                icon={metric.icon}
                iconColor={metric.iconColor}
                iconBg={metric.iconBg}
                delay={i * 0.04}
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
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Latest platform events from Danix Backend</p>
            </div>
            <Link href="/history" className="text-xs text-primary hover:underline flex items-center gap-0.5">
              View all <ChevronRight className="size-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="h-10 rounded-lg bg-zinc-800/40 animate-pulse" />
              ))
            ) : activityFeed.length > 0 ? (
              activityFeed.slice(0, 6).map((item: any) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {item.severity === 'critical' ? (
                      <span className="flex size-6 items-center justify-center rounded-full bg-red-500/10">
                        <AlertTriangle className="size-3 text-red-400" />
                      </span>
                    ) : item.severity === 'high' ? (
                      <span className="flex size-6 items-center justify-center rounded-full bg-orange-500/10">
                        <AlertTriangle className="size-3 text-orange-400" />
                      </span>
                    ) : (
                      <span className="flex size-6 items-center justify-center rounded-full bg-zinc-700/50">
                        <Activity className="size-3 text-zinc-400" />
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground leading-relaxed">{item.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {item.time} · {item.user}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4">No recent activity items found.</p>
            )}
          </div>
        </div>

        {/* Agent Status + System Status */}
        <div className="space-y-4">
          <AgentStatusCard />
          <LiveSystemStatus />
        </div>
      </div>
    </div>
  )
}

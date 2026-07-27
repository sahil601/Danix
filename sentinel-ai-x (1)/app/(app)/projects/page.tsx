'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Users,
  Server,
  Calendar,
  Archive,
  Edit,
  Trash2,
  ChevronRight,
  FolderKanban,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ScanLine,
  FileText,
  Activity,
  Shield,
  Bot,
  Zap,
  Target,
  BarChart2,
} from 'lucide-react'
import { DEMO_PROJECTS } from '@/lib/data'
import { fetchProjects } from '@/lib/api'
import { SeverityBadge, RiskScore, StatusBadge } from '@/components/ui/severity-badge'
import { cn } from '@/lib/utils'

type FilterStatus = 'all' | 'active' | 'completed' | 'paused' | 'archived'

export default function ProjectsPage() {
  const [projects, setProjects] = useState(DEMO_PROJECTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects().then((res: any) => {
      // Handle the fact that our backend returns a dictionary containing 'projects' array
      // Some properties in UI mock (like riskScore, updatedAt, members) need to be mapped from backend fields
      const rawProjects = res.projects || res || []
      const mappedProjects = rawProjects.map((p: any) => ({
        ...p,
        riskScore: p.riskScore || p.risk_score || 0,
        updatedAt: p.updatedAt || p.updated_at || p.created_at || 'Just now',
        members: p.members ? (typeof p.members === 'string' ? JSON.parse(p.members) : p.members) : [],
        tags: p.tags ? (typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags) : [],
        findings: p.findings || { critical: 0, high: 0, medium: 0, low: 0 },
        assets: p.assets || 0
      }))
      setProjects(mappedProjects)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const [filter, setFilter] = useState<FilterStatus>('all')
  const [search, setSearch] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  const filtered = projects.filter((p) => {
    const matchFilter = filter === 'all' || p.status === filter
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const tabs: { label: string; value: FilterStatus; count: number }[] = [
    { label: 'All', value: 'all', count: projects.length },
    { label: 'Active', value: 'active', count: projects.filter((p) => p.status === 'active').length },
    { label: 'Completed', value: 'completed', count: projects.filter((p) => p.status === 'completed').length },
    { label: 'Paused', value: 'paused', count: projects.filter((p) => p.status === 'paused').length },
    { label: 'Archived', value: 'archived', count: projects.filter((p) => p.status === 'archived').length },
  ]

  const totalFindings = projects.reduce((sum, p) => sum + p.findings.critical + p.findings.high + p.findings.medium + p.findings.low, 0)
  const totalAssets = projects.reduce((sum, p) => sum + p.assets, 0)
  const avgRisk = Math.round(projects.reduce((sum, p) => sum + p.riskScore, 0) / projects.length)
  const criticalCount = projects.reduce((sum, p) => sum + p.findings.critical, 0)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {projects.length} projects · {projects.filter((p) => p.status === 'active').length} active
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors self-start sm:self-auto"
        >
          <Plus className="size-4" />
          New Project
        </button>
      </div>

      {/* KPI Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Assets', value: totalAssets.toLocaleString(), icon: Server, color: 'text-blue-400', bg: 'bg-blue-500/10', trend: '+12% this month' },
          { label: 'Total Findings', value: totalFindings.toLocaleString(), icon: Target, color: 'text-orange-400', bg: 'bg-orange-500/10', trend: `${criticalCount} critical` },
          { label: 'Avg Risk Score', value: avgRisk.toString(), icon: BarChart2, color: avgRisk >= 70 ? 'text-red-400' : avgRisk >= 50 ? 'text-orange-400' : 'text-yellow-400', bg: avgRisk >= 70 ? 'bg-red-500/10' : 'bg-orange-500/10', trend: 'Across all projects' },
          { label: 'Active Projects', value: projects.filter((p) => p.status === 'active').length.toString(), icon: Activity, color: 'text-green-400', bg: 'bg-green-500/10', trend: `${projects.filter((p) => p.status === 'completed').length} completed` },
        ].map((kpi, i) => {
          const Icon = kpi.icon
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={cn('flex size-8 items-center justify-center rounded-lg', kpi.bg)}>
                  <Icon className={cn('size-4', kpi.color)} />
                </div>
                <span className="text-[10px] text-muted-foreground">{kpi.trend}</span>
              </div>
              <p className={cn('text-2xl font-bold', kpi.color)}>{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{kpi.label}</p>
            </motion.div>
          )
        })}
      </div>

      {/* AI Portfolio Insight */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
        <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/15">
          <Bot className="size-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-primary">AI Portfolio Analysis</span>
            <span className="text-[10px] text-muted-foreground">Updated just now</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">FinTrust Bank Red Team</strong> has the highest risk score (91) with 8 critical findings pending remediation — prioritize immediately.{' '}
            <strong className="text-foreground">MedHealth</strong> is the only completed project and is now eligible for final compliance sign-off.{' '}
            Across all active projects, <strong className="text-foreground">13 critical vulnerabilities</strong> require attention before next sprint.
          </p>
        </div>
        <button className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-primary/90 transition-colors flex-shrink-0">
          <Zap className="size-3" /> Ask AI
        </button>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                filter === tab.value
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
              <span className={cn('rounded px-1 py-0.5 text-[10px]', filter === tab.value ? 'bg-white/20' : 'bg-zinc-700/60 text-zinc-400')}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Filter className="size-3.5" />
          Filters
        </button>
      </div>

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20">
          <FolderKanban className="size-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No projects found</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ delay: i * 0.05, duration: 0.2 }}
                className="group relative rounded-xl border border-border bg-card p-5 hover:border-zinc-600 transition-all duration-200"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <StatusBadge status={project.status} />
                      <RiskScore score={project.riskScore} />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground mt-1.5 leading-tight">{project.name}</h3>
                    <p className="text-xs text-muted-foreground">{project.client}</p>
                  </div>
                  <div className="relative flex-shrink-0">
                    <button
                      onClick={() => setDropdownOpen(dropdownOpen === project.id ? null : project.id)}
                      className="rounded-lg p-1.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-accent hover:text-foreground transition-all"
                    >
                      <MoreHorizontal className="size-4" />
                    </button>
                    <AnimatePresence>
                      {dropdownOpen === project.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(null)} />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -4 }}
                            className="absolute right-0 top-full z-20 mt-1 w-36 rounded-lg border border-border bg-card shadow-xl"
                          >
                            {[
                              { icon: Edit, label: 'Edit' },
                              { icon: Archive, label: 'Archive' },
                              { icon: Trash2, label: 'Delete', danger: true },
                            ].map((action) => (
                              <button
                                key={action.label}
                                className={cn(
                                  'flex w-full items-center gap-2 px-3 py-2 text-xs transition-colors first:rounded-t-lg last:rounded-b-lg',
                                  action.danger
                                    ? 'text-red-400 hover:bg-red-500/10'
                                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                )}
                              >
                                <action.icon className="size-3.5" />
                                {action.label}
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-muted-foreground">Progress</span>
                    <span className="text-xs font-semibold text-foreground">{project.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-zinc-800">
                    <div
                      className={cn(
                        'h-1.5 rounded-full transition-all',
                        project.progress === 100 ? 'bg-green-500' : 'bg-primary'
                      )}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Findings badges */}
                <div className="flex gap-1.5 mb-4 flex-wrap">
                  {project.findings.critical > 0 && (
                    <span className="flex items-center gap-1 rounded-md bg-red-500/10 border border-red-500/20 px-2 py-0.5 text-[10px] font-semibold text-red-400">
                      <AlertTriangle className="size-2.5" /> {project.findings.critical} Critical
                    </span>
                  )}
                  {project.findings.high > 0 && (
                    <span className="flex items-center gap-1 rounded-md bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 text-[10px] font-semibold text-orange-400">
                      {project.findings.high} High
                    </span>
                  )}
                  {project.findings.medium > 0 && (
                    <span className="flex items-center gap-1 rounded-md bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 text-[10px] font-semibold text-yellow-400">
                      {project.findings.medium} Med
                    </span>
                  )}
                </div>

                {/* Quick Stats row */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="rounded-lg bg-zinc-900/50 border border-border/50 p-2 text-center">
                    <p className="text-sm font-bold text-foreground">{project.assets}</p>
                    <p className="text-[10px] text-muted-foreground">Assets</p>
                  </div>
                  <div className="rounded-lg bg-zinc-900/50 border border-border/50 p-2 text-center">
                    <p className="text-sm font-bold text-foreground">
                      {project.findings.critical + project.findings.high + project.findings.medium + project.findings.low}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Findings</p>
                  </div>
                  <div className="rounded-lg bg-zinc-900/50 border border-border/50 p-2 text-center">
                    <p className={cn('text-sm font-bold',
                      project.riskScore >= 80 ? 'text-red-400' :
                      project.riskScore >= 60 ? 'text-orange-400' :
                      project.riskScore >= 40 ? 'text-yellow-400' : 'text-green-400'
                    )}>{project.riskScore}</p>
                    <p className="text-[10px] text-muted-foreground">Risk</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="size-3" />{Array.isArray(project.members) ? project.members.length : 0} members</span>
                    <span className="flex items-center gap-1"><Calendar className="size-3" />{project.updatedAt}</span>
                  </div>
                  <div className="flex -space-x-1.5">
                    {(Array.isArray(project.members) ? project.members : []).slice(0, 3).map((m: any) => (
                      <div key={m} className="flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800 ring-2 ring-card text-[9px] font-bold text-white">
                        {m}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {(Array.isArray(project.tags) ? project.tags : []).map((tag: any) => (
                    <span key={tag} className="rounded-md bg-zinc-800/60 px-1.5 py-0.5 text-[10px] text-zinc-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create Project Dialog */}
      <AnimatePresence>
        {createOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCreateOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl"
            >
              <div className="border-b border-border px-6 py-4">
                <h2 className="text-base font-semibold text-foreground">Create New Project</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Set up a new security assessment project</p>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { label: 'Project Name', placeholder: 'e.g. Acme Corp External Assessment' },
                  { label: 'Client Name', placeholder: 'e.g. Acme Corporation' },
                  { label: 'Description', placeholder: 'Brief project description...' },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{field.label}</label>
                    <input
                      placeholder={field.placeholder}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
                <button onClick={() => setCreateOpen(false)} className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cancel
                </button>
                <button onClick={() => setCreateOpen(false)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
                  Create Project
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

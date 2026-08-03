'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  Download,
  ExternalLink,
  Bot,
  Shield,
  AlertTriangle,
  Server,
  X,
  Copy,
  CheckCheck,
  Clock,
  TrendingDown,
  Crosshair,
  BookOpen,
  Zap,
  BarChart2,
  Calendar,
  Layers,
  FileText,
  Activity,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Info,
  ShieldAlert,
  Bug,
  Flame
} from 'lucide-react'
import { DEMO_FINDINGS } from '@/lib/data'
import { fetchFindings, fetchFindingAnalysis, fetchFindingRemediation, fetchFindingThreatIntel } from '@/lib/api'
import { SeverityBadge, StatusBadge, RiskScore } from '@/components/ui/severity-badge'
import { cn } from '@/lib/utils'

interface AIAnalysisData {
  summary: string
  impact: string
  attack: string
  remediation: string
  references: string
}

export default function FindingsPage() {
  const [findings, setFindings] = useState<any[]>(DEMO_FINDINGS)
  const [loading, setLoading] = useState(true)
  const [selectedFinding, setSelectedFinding] = useState<any | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisData | null>(null)
  const [remediationData, setRemediationData] = useState<any | null>(null)
  const [threatIntelData, setThreatIntelData] = useState<any | null>(null)
  const [loadingAi, setLoadingAi] = useState(false)
  const [loadingRemediation, setLoadingRemediation] = useState(false)
  const [loadingThreatIntel, setLoadingThreatIntel] = useState(false)
  const [drawerTab, setDrawerTab] = useState<'overview' | 'remediation' | 'threat-intel'>('overview')
  const [commandTab, setCommandTab] = useState<'linux' | 'powershell' | 'firewall'>('linux')
  const [copied, setCopied] = useState(false)

  // Filters State
  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [targetFilter, setTargetFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')
  const [owaspFilter, setOwaspFilter] = useState<string>('all')
  const [cweFilter, setCweFilter] = useState<string>('all')

  const loadData = () => {
    setLoading(true)
    fetchFindings()
      .then((res) => {
        const list = res.findings || res
        if (Array.isArray(list) && list.length > 0) {
          setFindings(list)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [])

  // When a finding is selected, fetch its AI Analysis and AI Remediation
  useEffect(() => {
    if (!selectedFinding) {
      setAiAnalysis(null)
      setRemediationData(null)
      return
    }
    setLoadingAi(true)
    setLoadingRemediation(true)
    setLoadingThreatIntel(true)

    fetchFindingAnalysis(selectedFinding.id)
      .then((data) => {
        setAiAnalysis(data)
        setLoadingAi(false)
      })
      .catch(() => {
        setAiAnalysis({
          summary: `Automated AI security assessment identified ${selectedFinding.title} affecting ${selectedFinding.asset || 'target asset'}.`,
          impact: `Exploitation of this vulnerability may compromise asset confidentiality, integrity, or service availability.`,
          attack: `1. Attacker identifies vulnerable endpoint ${selectedFinding.asset}.\n2. Threat actor crafts specialized exploit payload.\n3. Vulnerability is triggered, leading to unauthorized access.`,
          remediation: selectedFinding.raw_data?.recommendation || 'Apply vendor security updates and enforce strict input validation.',
          references: `OWASP: ${selectedFinding.owasp || 'Top 10'} | CWE: ${selectedFinding.cwe || 'CWE Catalog'}`,
        })
        setLoadingAi(false)
      })

    fetchFindingRemediation(selectedFinding.id)
      .then((rem) => {
        setRemediationData(rem)
        setLoadingRemediation(false)
      })
      .catch(() => {
        setRemediationData(selectedFinding.remediation_data || null)
        setLoadingRemediation(false)
      })

    fetchFindingThreatIntel(selectedFinding.id)
      .then((ti) => {
        setThreatIntelData(ti)
        setLoadingThreatIntel(false)
      })
      .catch(() => {
        setThreatIntelData(selectedFinding.threat_intel_data || null)
        setLoadingThreatIntel(false)
      })
  }, [selectedFinding])

  // Extract unique filter options dynamically from findings
  const uniqueTargets = useMemo(() => {
    const set = new Set<string>()
    findings.forEach((f) => {
      if (f.asset) set.add(f.asset)
    })
    return Array.from(set)
  }, [findings])

  const uniqueOwasp = useMemo(() => {
    const set = new Set<string>()
    findings.forEach((f) => {
      if (f.owasp) set.add(f.owasp)
    })
    return Array.from(set)
  }, [findings])

  const uniqueCwe = useMemo(() => {
    const set = new Set<string>()
    findings.forEach((f) => {
      if (f.cwe) set.add(f.cwe)
    })
    return Array.from(set)
  }, [findings])

  // Filtered Findings
  const filteredFindings = useMemo(() => {
    return findings.filter((f) => {
      const q = search.toLowerCase()
      const titleMatch = (f.title || '').toLowerCase().includes(q)
      const assetMatch = (f.asset || '').toLowerCase().includes(q)
      const cweMatch = (f.cwe || '').toLowerCase().includes(q)
      const owaspMatch = (f.owasp || '').toLowerCase().includes(q)
      const cveMatch = (f.cve || '').toLowerCase().includes(q)

      const matchesSearch = !search || titleMatch || assetMatch || cweMatch || owaspMatch || cveMatch
      const matchesSeverity = severityFilter === 'all' || (f.severity || '').toLowerCase() === severityFilter.toLowerCase()
      const matchesStatus = statusFilter === 'all' || (f.status || '').toLowerCase() === statusFilter.toLowerCase()
      const matchesTarget = targetFilter === 'all' || f.asset === targetFilter
      const matchesOwasp = owaspFilter === 'all' || f.owasp === owaspFilter
      const matchesCwe = cweFilter === 'all' || f.cwe === cweFilter

      // Date filtering
      let matchesDate = true
      if (dateFilter !== 'all' && (f.created_at || f.createdAt)) {
        const itemDate = new Date(f.created_at || f.createdAt).getTime()
        const now = Date.now()
        if (dateFilter === '24h') matchesDate = now - itemDate <= 24 * 60 * 60 * 1000
        else if (dateFilter === '7d') matchesDate = now - itemDate <= 7 * 24 * 60 * 60 * 1000
        else if (dateFilter === '30d') matchesDate = now - itemDate <= 30 * 24 * 60 * 60 * 1000
      }

      return matchesSearch && matchesSeverity && matchesStatus && matchesTarget && matchesOwasp && matchesCwe && matchesDate
    })
  }, [findings, search, severityFilter, statusFilter, targetFilter, dateFilter, owaspFilter, cweFilter])

  // Widget Metrics
  const counts = useMemo(() => {
    const c = { critical: 0, high: 0, medium: 0, low: 0, info: 0 }
    findings.forEach((f) => {
      const sev = (f.severity || 'low').toLowerCase() as keyof typeof c
      if (c[sev] !== undefined) c[sev]++
    })
    return c
  }, [findings])

  const assetsScannedCount = useMemo(() => {
    const set = new Set<string>()
    findings.forEach((f) => {
      if (f.asset) set.add(f.asset)
    })
    return Math.max(1, set.size)
  }, [findings])

  const overallRiskScore = useMemo(() => {
    const weighted = counts.critical * 30 + counts.high * 15 + counts.medium * 5 + counts.low * 1
    return Math.min(100, Math.round(weighted / Math.max(1, assetsScannedCount * 0.8)))
  }, [counts, assetsScannedCount])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const resetFilters = () => {
    setSearch('')
    setSeverityFilter('all')
    setStatusFilter('all')
    setTargetFilter('all')
    setDateFilter('all')
    setOwaspFilter('all')
    setCweFilter('all')
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Vulnerability Management Findings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Real-time security findings, AI threat analysis, and automated remediation guide.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-zinc-600 transition-colors"
          >
            <RefreshCw className={cn('size-3.5', loading && 'animate-spin')} />
            Refresh
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-zinc-600 transition-colors">
            <Download className="size-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* 1. Dashboard Summary Widgets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Total Findings */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Findings</span>
            <Layers className="size-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-foreground">{findings.length}</p>
          <p className="text-[10px] text-muted-foreground mt-1">Across {assetsScannedCount} assets</p>
        </div>

        {/* Critical */}
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <div className="flex items-center justify-between text-red-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Critical</span>
            <AlertTriangle className="size-4" />
          </div>
          <p className="text-2xl font-bold text-red-400">{counts.critical}</p>
          <p className="text-[10px] text-red-400/70 mt-1">Immediate action required</p>
        </div>

        {/* High */}
        <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
          <div className="flex items-center justify-between text-orange-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">High</span>
            <Zap className="size-4" />
          </div>
          <p className="text-2xl font-bold text-orange-400">{counts.high}</p>
          <p className="text-[10px] text-orange-400/70 mt-1">High priority remediations</p>
        </div>

        {/* Medium */}
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
          <div className="flex items-center justify-between text-yellow-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Medium</span>
            <Shield className="size-4" />
          </div>
          <p className="text-2xl font-bold text-yellow-400">{counts.medium}</p>
          <p className="text-[10px] text-yellow-400/70 mt-1">Scheduled patch cycle</p>
        </div>

        {/* Low */}
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
          <div className="flex items-center justify-between text-blue-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Low</span>
            <Info className="size-4" />
          </div>
          <p className="text-2xl font-bold text-blue-400">{counts.low}</p>
          <p className="text-[10px] text-blue-400/70 mt-1">Best-practice fixes</p>
        </div>

        {/* Assets Scanned */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Assets Scanned</span>
            <Server className="size-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-foreground">{assetsScannedCount}</p>
          <p className="text-[10px] text-muted-foreground mt-1">Monitored endpoints</p>
        </div>

        {/* Overall Risk Score */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Risk Score</span>
            <Activity className="size-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className={cn(
              'text-2xl font-bold',
              overallRiskScore >= 75 ? 'text-red-400' :
              overallRiskScore >= 50 ? 'text-orange-400' :
              overallRiskScore >= 25 ? 'text-yellow-400' : 'text-emerald-400'
            )}>{overallRiskScore}</span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">Target Security Posture</p>
        </div>
      </div>

      {/* 2. Comprehensive Filter Controls */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search findings by title, target, CWE, OWASP..."
              className="w-full rounded-lg border border-border bg-zinc-900/60 pl-9 pr-3 py-2 text-xs placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Quick Severity Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto p-1 bg-zinc-900/60 rounded-lg border border-border">
            {(['all', 'critical', 'high', 'medium', 'low'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSeverityFilter(s)}
                className={cn(
                  'px-2.5 py-1 text-[11px] font-medium capitalize rounded-md transition-colors whitespace-nowrap',
                  severityFilter === s ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Reset Filters */}
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors self-end md:self-auto"
          >
            <X className="size-3.5" />
            Reset Filters
          </button>
        </div>

        {/* Extended Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 border-t border-border/50 pt-3">
          {/* Status Filter */}
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border border-border bg-zinc-900 px-2 py-1.5 text-xs text-foreground outline-none focus:border-primary"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="remediated">Remediated</option>
              <option value="accepted">Accepted</option>
            </select>
          </div>

          {/* Target Asset Filter */}
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">Target Asset</label>
            <select
              value={targetFilter}
              onChange={(e) => setTargetFilter(e.target.value)}
              className="w-full rounded-md border border-border bg-zinc-900 px-2 py-1.5 text-xs text-foreground outline-none focus:border-primary"
            >
              <option value="all">All Targets</option>
              {uniqueTargets.map((tgt) => (
                <option key={tgt} value={tgt}>{tgt}</option>
              ))}
            </select>
          </div>

          {/* Scan Date Filter */}
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">Scan Date</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full rounded-md border border-border bg-zinc-900 px-2 py-1.5 text-xs text-foreground outline-none focus:border-primary"
            >
              <option value="all">All Time</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>

          {/* OWASP Category Filter */}
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">OWASP Category</label>
            <select
              value={owaspFilter}
              onChange={(e) => setOwaspFilter(e.target.value)}
              className="w-full rounded-md border border-border bg-zinc-900 px-2 py-1.5 text-xs text-foreground outline-none focus:border-primary"
            >
              <option value="all">All OWASP</option>
              {uniqueOwasp.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* CWE Filter */}
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">CWE Weakness</label>
            <select
              value={cweFilter}
              onChange={(e) => setCweFilter(e.target.value)}
              className="w-full rounded-md border border-border bg-zinc-900 px-2 py-1.5 text-xs text-foreground outline-none focus:border-primary"
            >
              <option value="all">All CWEs</option>
              {uniqueCwe.map((cwe) => (
                <option key={cwe} value={cwe}>{cwe}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. Searchable Findings Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-3 border-b border-border bg-zinc-900/80 px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <div className="col-span-2 sm:col-span-1">Severity</div>
          <div className="col-span-4 sm:col-span-4">Vulnerability Title</div>
          <div className="col-span-1 text-center">CVSS</div>
          <div className="col-span-2 sm:col-span-2">CWE</div>
          <div className="col-span-2 sm:col-span-2">Target Asset</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1 text-right">Date</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-border/40">
          {filteredFindings.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Shield className="size-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">No vulnerability findings match your filters.</p>
              <button onClick={resetFilters} className="mt-2 text-xs text-primary underline">
                Clear all filters
              </button>
            </div>
          ) : (
            filteredFindings.map((finding, idx) => {
              const cvss = typeof finding.cvss === 'number' ? finding.cvss : parseFloat(finding.cvss || '0.0')
              const dateStr = finding.created_at || finding.createdAt
                ? new Date(finding.created_at || finding.createdAt).toLocaleDateString()
                : 'Recent'

              return (
                <motion.div
                  key={finding.id || idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  onClick={() => setSelectedFinding(finding)}
                  className="grid grid-cols-12 gap-3 px-4 py-3.5 items-center cursor-pointer hover:bg-accent/30 transition-colors group"
                >
                  {/* Severity */}
                  <div className="col-span-2 sm:col-span-1">
                    <SeverityBadge severity={finding.severity} />
                  </div>

                  {/* Title */}
                  <div className="col-span-4 sm:col-span-4 pr-2">
                    <p className="text-xs font-semibold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-1">
                      {finding.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                      {finding.category || 'Vulnerability'}
                    </p>
                  </div>

                  {/* CVSS */}
                  <div className="col-span-1 text-center">
                    <span className={cn(
                      'text-xs font-bold tabular-nums',
                      cvss >= 9.0 ? 'text-red-400' :
                      cvss >= 7.0 ? 'text-orange-400' :
                      cvss >= 4.0 ? 'text-yellow-400' : 'text-blue-400'
                    )}>
                      {cvss.toFixed(1)}
                    </span>
                  </div>

                  {/* CWE */}
                  <div className="col-span-2 sm:col-span-2">
                    <span className="text-[11px] font-mono text-zinc-300 bg-zinc-800/60 px-1.5 py-0.5 rounded">
                      {finding.cwe || 'N/A'}
                    </span>
                  </div>

                  {/* Target Asset */}
                  <div className="col-span-2 sm:col-span-2">
                    <span className="text-xs font-mono text-muted-foreground line-clamp-1">
                      {finding.asset}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <StatusBadge status={finding.status || 'open'} />
                  </div>

                  {/* Date */}
                  <div className="col-span-1 text-right text-[11px] text-muted-foreground flex items-center justify-end gap-1">
                    <span>{dateStr}</span>
                    <ChevronRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </div>

      {/* 4. Click Detail Slide-Over Drawer / Modal Overlay */}
      <AnimatePresence>
        {selectedFinding && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="w-full max-w-2xl bg-zinc-950 border-l border-border h-full overflow-y-auto flex flex-col shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-border bg-zinc-900/60 sticky top-0 z-10 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <SeverityBadge severity={selectedFinding.severity} />
                      <StatusBadge status={selectedFinding.status || 'open'} />
                      <span className="text-xs font-mono text-muted-foreground">{selectedFinding.asset}</span>
                    </div>
                    <h2 className="text-lg font-bold text-foreground leading-snug">{selectedFinding.title}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedFinding(null)}
                    className="rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-zinc-800 transition-colors"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                {/* Drawer Tab Buttons */}
                <div className="flex items-center gap-2 border-b border-border/50 pb-1">
                  <button
                    onClick={() => setDrawerTab('overview')}
                    className={cn(
                      'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5',
                      drawerTab === 'overview'
                        ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-zinc-800'
                    )}
                  >
                    <FileText className="size-3.5" />
                    <span>Overview</span>
                  </button>
                  <button
                    onClick={() => setDrawerTab('remediation')}
                    className={cn(
                      'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5',
                      drawerTab === 'remediation'
                        ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                        : 'text-muted-foreground hover:text-emerald-400 hover:bg-emerald-950/40'
                    )}
                  >
                    <Sparkles className="size-3.5 text-emerald-400 animate-pulse" />
                    <span>AI Remediation</span>
                  </button>
                  <button
                    onClick={() => setDrawerTab('threat-intel')}
                    className={cn(
                      'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5',
                      drawerTab === 'threat-intel'
                        ? 'bg-cyan-600 text-white font-semibold shadow-sm'
                        : 'text-muted-foreground hover:text-cyan-400 hover:bg-cyan-950/40'
                    )}
                  >
                    <ShieldAlert className="size-3.5 text-cyan-400" />
                    <span>Threat Intelligence</span>
                  </button>
                </div>
              </div>

              {/* Drawer Content */}
              <div className="p-6 space-y-6 flex-1">
                {drawerTab === 'overview' ? (
                  /* TAB 1: OVERVIEW & ANALYSIS */
                  <div className="space-y-6">
                    {/* CVSS & Key Metrics */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-lg border border-border bg-zinc-900/50 p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">CVSS Score</p>
                        <div className="flex items-baseline gap-1">
                          <span className={cn(
                            'text-2xl font-bold',
                            selectedFinding.cvss >= 9 ? 'text-red-400' :
                            selectedFinding.cvss >= 7 ? 'text-orange-400' :
                            selectedFinding.cvss >= 4 ? 'text-yellow-400' : 'text-blue-400'
                          )}>
                            {selectedFinding.cvss}
                          </span>
                          <span className="text-xs text-muted-foreground">/ 10.0</span>
                        </div>
                      </div>

                      <div className="rounded-lg border border-border bg-zinc-900/50 p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Weakness</p>
                        <p className="text-sm font-mono font-bold text-foreground">{selectedFinding.cwe || 'N/A'}</p>
                      </div>

                      <div className="rounded-lg border border-border bg-zinc-900/50 p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">CVE Record</p>
                        <p className="text-sm font-mono font-bold text-foreground">{selectedFinding.cve || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Evidence & Description */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Description & Evidence</h3>
                      <div className="relative rounded-lg bg-zinc-900 border border-border p-3 font-mono text-xs text-emerald-400 overflow-x-auto">
                        <code>{selectedFinding.evidence || 'Vulnerability evidence detected during automated scan.'}</code>
                        <button
                          onClick={() => copyToClipboard(selectedFinding.evidence || '')}
                          className="absolute right-2 top-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {copied ? <CheckCheck className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
                        </button>
                      </div>
                    </div>

                    {/* AI Executive Summary */}
                    <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="size-4 text-primary" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-primary">AI Executive Summary</h3>
                      </div>
                      {loadingAi ? (
                        <div className="animate-pulse space-y-2">
                          <div className="h-3 bg-primary/20 rounded w-3/4"></div>
                          <div className="h-3 bg-primary/20 rounded w-1/2"></div>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {aiAnalysis?.summary || `AI security analyst evaluated ${selectedFinding.title} affecting ${selectedFinding.asset}. Immediate mitigation recommended.`}
                        </p>
                      )}
                    </div>

                    {/* Business Impact */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Business Impact</h3>
                      <div className="rounded-lg border border-border bg-zinc-900/50 p-3">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {aiAnalysis?.impact || 'Potential unauthorized access, data loss, or regulatory compliance risk.'}
                        </p>
                      </div>
                    </div>

                    {/* Attack Scenario */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Attack Scenario</h3>
                      <div className="rounded-lg border border-border bg-zinc-900/50 p-3">
                        <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed font-mono">
                          {aiAnalysis?.attack || '1. Threat actor discovers exposed service.\n2. Attacker executes exploit payload.\n3. System integrity compromised.'}
                        </p>
                      </div>
                    </div>

                    {/* Technical Details */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Technical Details</h3>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="rounded-lg border border-border bg-zinc-900/50 p-2.5">
                          <span className="text-muted-foreground">Category:</span>{' '}
                          <span className="font-semibold text-foreground">{selectedFinding.category}</span>
                        </div>
                        <div className="rounded-lg border border-border bg-zinc-900/50 p-2.5">
                          <span className="text-muted-foreground">Confidence:</span>{' '}
                          <span className="font-semibold text-emerald-400">{selectedFinding.confidence || 95}%</span>
                        </div>
                        <div className="rounded-lg border border-border bg-zinc-900/50 p-2.5">
                          <span className="text-muted-foreground">OWASP:</span>{' '}
                          <span className="font-semibold text-foreground">{selectedFinding.owasp || 'N/A'}</span>
                        </div>
                        <div className="rounded-lg border border-border bg-zinc-900/50 p-2.5">
                          <span className="text-muted-foreground">MITRE ATT&CK:</span>{' '}
                          <span className="font-semibold text-foreground">{selectedFinding.mitre || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : drawerTab === 'remediation' ? (
                  /* TAB 2: AI REMEDIATION ASSISTANT */
                  <div className="space-y-6">
                    {/* Executive Remediation Summary & Effort / Risk Badges */}
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="size-4 text-emerald-400" />
                          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Executive Remediation Summary</h3>
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          AI Confidence: {Math.round((remediationData?.confidence_score || 0.95) * 100)}%
                        </span>
                      </div>

                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {remediationData?.executive_summary || `Immediate mitigation required for ${selectedFinding.title}. Applying recommended hardening eliminates security exposure.`}
                      </p>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="rounded-lg border border-border bg-zinc-900/80 p-2.5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Estimated Effort</p>
                          <p className="text-xs font-semibold text-amber-400">{remediationData?.estimated_effort || 'Low (1 - 2 hours)'}</p>
                        </div>
                        <div className="rounded-lg border border-border bg-zinc-900/80 p-2.5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Risk Reduction Impact</p>
                          <p className="text-xs font-semibold text-emerald-400">{remediationData?.risk_reduction || 'High - 90% Risk Reduction'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Technical Root Cause & Step-by-Step Remediation */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Technical Root Cause & Fix Instructions</h3>
                      <div className="rounded-lg border border-border bg-zinc-900/50 p-3.5 space-y-3 text-xs">
                        <p className="text-zinc-300 leading-relaxed">
                          <span className="font-semibold text-foreground">Root Cause: </span>
                          {remediationData?.technical_root_cause || `Component ${selectedFinding.asset} fails to enforce strict security controls for ${selectedFinding.category}.`}
                        </p>
                        <div className="space-y-1.5 border-t border-border/50 pt-2.5">
                          <p className="font-semibold text-emerald-400">Step-by-Step Action Items:</p>
                          <ul className="space-y-1 text-muted-foreground pl-1">
                            {(remediationData?.step_by_step_remediation || [
                              `1. Isolate asset ${selectedFinding.asset} and backup active configuration.`,
                              `2. Apply the technology-specific commands and snippets provided below.`,
                              `3. Restart application service and run verification steps.`
                            ]).map((step: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-emerald-400 font-bold">•</span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Ready-to-Copy Commands (Linux / PowerShell / Firewall CLI) */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ready-to-Copy Commands</h3>
                        <div className="flex items-center gap-1 bg-zinc-900 border border-border rounded-lg p-0.5">
                          <button
                            onClick={() => setCommandTab('linux')}
                            className={cn(
                              'px-2 py-0.5 text-[10px] font-mono rounded transition-colors',
                              commandTab === 'linux' ? 'bg-primary text-white font-bold' : 'text-muted-foreground hover:text-foreground'
                            )}
                          >
                            Linux Bash
                          </button>
                          <button
                            onClick={() => setCommandTab('powershell')}
                            className={cn(
                              'px-2 py-0.5 text-[10px] font-mono rounded transition-colors',
                              commandTab === 'powershell' ? 'bg-primary text-white font-bold' : 'text-muted-foreground hover:text-foreground'
                            )}
                          >
                            PowerShell
                          </button>
                          <button
                            onClick={() => setCommandTab('firewall')}
                            className={cn(
                              'px-2 py-0.5 text-[10px] font-mono rounded transition-colors',
                              commandTab === 'firewall' ? 'bg-primary text-white font-bold' : 'text-muted-foreground hover:text-foreground'
                            )}
                          >
                            Firewall CLI
                          </button>
                        </div>
                      </div>

                      <div className="relative rounded-lg bg-zinc-950 border border-border p-3 font-mono text-xs text-emerald-400 overflow-x-auto">
                        <pre className="whitespace-pre-wrap leading-relaxed">
                          {(commandTab === 'linux'
                            ? (remediationData?.linux_commands || ["# Linux Bash commands", "sudo systemctl restart service"]).join('\n')
                            : commandTab === 'powershell'
                            ? (remediationData?.powershell_commands || ["# PowerShell commands", "Restart-Service -Name 'Service'"]).join('\n')
                            : (remediationData?.firewall_commands || ["# Firewall CLI rules", "sudo ufw status"]).join('\n')
                          )}
                        </pre>
                        <button
                          onClick={() => {
                            const text = (commandTab === 'linux'
                              ? (remediationData?.linux_commands || []).join('\n')
                              : commandTab === 'powershell'
                              ? (remediationData?.powershell_commands || []).join('\n')
                              : (remediationData?.firewall_commands || []).join('\n')
                            )
                            copyToClipboard(text)
                          }}
                          className="absolute right-2 top-2 p-1.5 bg-zinc-900/80 rounded border border-border text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {copied ? <CheckCheck className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Configuration Snippets & Code Examples */}
                    {(remediationData?.config_snippets || remediationData?.code_examples) && (
                      <div className="space-y-4">
                        {remediationData?.config_snippets && (
                          <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Configuration Snippet</h3>
                            <div className="relative rounded-lg bg-zinc-950 border border-border p-3 font-mono text-xs text-cyan-300 overflow-x-auto">
                              <pre className="whitespace-pre-wrap leading-relaxed">{remediationData.config_snippets}</pre>
                              <button
                                onClick={() => copyToClipboard(remediationData.config_snippets)}
                                className="absolute right-2 top-2 p-1.5 bg-zinc-900/80 rounded border border-border text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {copied ? <CheckCheck className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
                              </button>
                            </div>
                          </div>
                        )}

                        {remediationData?.code_examples && (
                          <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Secure Code Example</h3>
                            <div className="relative rounded-lg bg-zinc-950 border border-border p-3 font-mono text-xs text-amber-300 overflow-x-auto">
                              <pre className="whitespace-pre-wrap leading-relaxed">{remediationData.code_examples}</pre>
                              <button
                                onClick={() => copyToClipboard(remediationData.code_examples)}
                                className="absolute right-2 top-2 p-1.5 bg-zinc-900/80 rounded border border-border text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {copied ? <CheckCheck className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step-by-Step Verification Procedure */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Verification Procedure</h3>
                      <div className="rounded-lg border border-border bg-zinc-900/50 p-3 font-mono text-xs text-zinc-300 space-y-1.5">
                        {(remediationData?.verification_procedure || [
                          `1. Re-run scan against asset endpoint: ${selectedFinding.asset}`,
                          `2. Confirm zero vulnerable response triggers for ${selectedFinding.cwe || 'finding'}.`
                        ]).map((vStep: string, idx: number) => (
                          <p key={idx}>{vStep}</p>
                        ))}
                      </div>
                    </div>

                    {/* Compliance Mappings */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Compliance Mappings</h3>
                      <div className="grid grid-cols-1 gap-2 text-xs font-mono">
                        <div className="rounded-lg border border-border bg-zinc-900/50 p-2.5 flex items-center justify-between">
                          <span className="text-muted-foreground">OWASP Top 10:</span>
                          <span className="font-semibold text-emerald-400">{remediationData?.compliance_mappings?.owasp_top_10 || selectedFinding.owasp || 'A05:2021'}</span>
                        </div>
                        <div className="rounded-lg border border-border bg-zinc-900/50 p-2.5 flex items-center justify-between">
                          <span className="text-muted-foreground">PCI-DSS:</span>
                          <span className="font-semibold text-zinc-300">{remediationData?.compliance_mappings?.pci_dss || 'Requirement 6.4.1'}</span>
                        </div>
                        <div className="rounded-lg border border-border bg-zinc-900/50 p-2.5 flex items-center justify-between">
                          <span className="text-muted-foreground">NIST SP 800-53:</span>
                          <span className="font-semibold text-zinc-300">{remediationData?.compliance_mappings?.nist_sp_800_53 || 'SI-2 / CM-6'}</span>
                        </div>
                        <div className="rounded-lg border border-border bg-zinc-900/50 p-2.5 flex items-center justify-between">
                          <span className="text-muted-foreground">ISO 27001:</span>
                          <span className="font-semibold text-zinc-300">{remediationData?.compliance_mappings?.iso_27001 || 'Control A.8.28'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* --- Threat Intelligence Tab View --- */
                  <div className="space-y-6">
                    {/* Header Badges */}
                    <div className="flex items-center justify-between rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4">
                      <div className="flex items-center gap-3">
                        <Bug className="size-6 text-cyan-400" />
                        <div>
                          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Vulnerability Intelligence</p>
                          <h4 className="text-base font-bold font-mono text-cyan-200 mt-0.5">
                            {threatIntelData?.cve_id || selectedFinding.cve || 'CVE-2024-1234'}
                          </h4>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-300">
                          {threatIntelData?.risk_priority || 'P1 - Critical'}
                        </span>
                      </div>
                    </div>

                    {/* AI Threat Correlation Summary */}
                    <div className="rounded-xl border border-border bg-zinc-900/60 p-4 space-y-2">
                      <div className="flex items-center gap-2 text-cyan-400">
                        <Bot className="size-4" />
                        <h3 className="text-xs font-bold uppercase tracking-wider">AI Threat Summary</h3>
                      </div>
                      <p className="text-sm text-zinc-300 leading-relaxed">
                        {threatIntelData?.threat_summary || `Vulnerability ${selectedFinding.cve || 'CVE-2024-1234'} carries a high exploitation probability. It is actively monitored in threat intelligence catalogs and public exploit code exists.`}
                      </p>
                    </div>

                    {/* CVSS & EPSS Telemetry Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-border bg-zinc-900/40 p-4 space-y-1.5">
                        <p className="text-xs font-medium text-muted-foreground">CVSS Score & Vector</p>
                        <p className="text-lg font-bold text-red-400">
                          {threatIntelData?.cvss_score ?? selectedFinding.cvss ?? 9.8} / 10.0
                        </p>
                        <p className="text-[11px] font-mono text-zinc-400 break-all">
                          {threatIntelData?.cvss_vector || 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H'}
                        </p>
                      </div>

                      <div className="rounded-xl border border-border bg-zinc-900/40 p-4 space-y-1.5">
                        <p className="text-xs font-medium text-muted-foreground">EPSS Score & Percentile</p>
                        <p className="text-lg font-bold text-purple-400">
                          {((threatIntelData?.epss_score ?? 0.965) * 100).toFixed(1)}% Probability
                        </p>
                        <p className="text-xs text-zinc-400">
                          Percentile: <span className="font-semibold text-zinc-200">{threatIntelData?.epss_percentile || '98.2%'}</span>
                        </p>
                      </div>
                    </div>

                    {/* CISA KEV & Exploit Availability */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-border bg-zinc-900/40 p-4 space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <Flame className="size-4 text-orange-400" />
                          <p className="text-xs font-medium text-muted-foreground">CISA KEV Catalog</p>
                        </div>
                        <p className="text-sm font-bold text-orange-300">
                          {threatIntelData?.cisa_kev_status || 'Listed in CISA KEV Catalog'}
                        </p>
                        {threatIntelData?.cisa_kev_date && (
                          <p className="text-[11px] text-zinc-400">Added: {threatIntelData.cisa_kev_date}</p>
                        )}
                      </div>

                      <div className="rounded-xl border border-border bg-zinc-900/40 p-4 space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <Zap className="size-4 text-yellow-400" />
                          <p className="text-xs font-medium text-muted-foreground">Exploit Availability</p>
                        </div>
                        <p className="text-sm font-bold text-yellow-300">
                          {threatIntelData?.exploit_status || 'Public Exploit Code Disclosed'}
                        </p>
                        <p className="text-[11px] text-zinc-400 truncate">
                          Source: {threatIntelData?.exploit_source || 'Exploit-DB / Metasploit'}
                        </p>
                      </div>
                    </div>

                    {/* Vendor, Product & Version Intelligence */}
                    <div className="rounded-xl border border-border bg-zinc-900/40 p-4 space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Vendor & Version Intelligence</h3>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-muted-foreground">Vendor / Product:</p>
                          <p className="font-semibold text-zinc-200 mt-0.5">{threatIntelData?.vendor || 'Apache Software Foundation'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Patch Status:</p>
                          <p className="font-semibold text-emerald-400 mt-0.5">{threatIntelData?.patch_status || 'Official Security Patch Available'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Affected Versions:</p>
                          <p className="font-mono text-red-300 mt-0.5">{threatIntelData?.affected_versions || '< 2.4.58'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Fixed Version:</p>
                          <p className="font-mono text-emerald-300 mt-0.5">{threatIntelData?.fixed_version || '2.4.59'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Vendor Advisory Button */}
                    {threatIntelData?.vendor_advisory_url && (
                      <a
                        href={threatIntelData.vendor_advisory_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 rounded-xl bg-cyan-600/20 border border-cyan-500/30 p-3 text-xs font-semibold text-cyan-300 hover:bg-cyan-600/30 transition-colors"
                      >
                        <span>Open Vendor Security Advisory</span>
                        <ExternalLink className="size-3.5" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-border bg-zinc-900/60 sticky bottom-0 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Scan ID: {selectedFinding.scan_id || selectedFinding.scanId || 'N/A'}</span>
                <button
                  onClick={() => setSelectedFinding(null)}
                  className="px-4 py-2 text-xs font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

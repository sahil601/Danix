'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  Bot,
  Shield,
  AlertTriangle,
  User,
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
} from 'lucide-react'
import { motion as m2 } from 'framer-motion'
import { DEMO_FINDINGS } from '@/lib/data'
import { SeverityBadge, StatusBadge } from '@/components/ui/severity-badge'
import { cn } from '@/lib/utils'

export default function FindingsPage() {
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [severityFilter, setSeverityFilter] = useState('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filtered = DEMO_FINDINGS.filter((f) => {
    const matchSearch = !search || f.title.toLowerCase().includes(search.toLowerCase()) || f.asset.includes(search)
    const matchSeverity = severityFilter === 'all' || f.severity === severityFilter
    return matchSearch && matchSeverity
  })

  const counts = {
    all: DEMO_FINDINGS.length,
    critical: DEMO_FINDINGS.filter((f) => f.severity === 'critical').length,
    high: DEMO_FINDINGS.filter((f) => f.severity === 'high').length,
    medium: DEMO_FINDINGS.filter((f) => f.severity === 'medium').length,
    low: DEMO_FINDINGS.filter((f) => f.severity === 'low').length,
  }

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const AI_EXPLANATIONS: Record<string, string> = {
    'fnd-1': 'This is a critical Remote Code Execution vulnerability caused by insecure Java object deserialization. When user-controlled data is deserialized without validation, an attacker can supply a crafted payload that executes arbitrary code on the server. The Apache Log4Shell exploit (CVE-2021-44228) is the most notable example of this class of vulnerability.',
    'fnd-2': 'SQL Injection in the authentication endpoint allows an attacker to bypass authentication entirely by injecting SQL syntax. The payload `admin\'--` terminates the SQL query early, commenting out the password check, effectively granting admin access without credentials.',
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Findings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {DEMO_FINDINGS.length} findings · {counts.critical} critical
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-zinc-600 transition-colors self-start sm:self-auto">
          <Download className="size-4" />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search findings..."
            className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
          {(['all', 'critical', 'high', 'medium', 'low'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSeverityFilter(s)}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors',
                severityFilter === s ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {s}
              <span className={cn('rounded px-1 py-0.5 text-[10px]', severityFilter === s ? 'bg-white/20' : 'bg-zinc-700/60 text-zinc-400')}>
                {counts[s as keyof typeof counts]}
              </span>
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Filter className="size-3.5" />
          Filters
        </button>
      </div>

      {/* Findings Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-12 gap-2 border-b border-border bg-zinc-900/50 px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <div className="col-span-1">Severity</div>
          <div className="col-span-4">Title</div>
          <div className="col-span-2">Asset</div>
          <div className="col-span-1">CVSS</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2">Assigned</div>
          <div className="col-span-1"></div>
        </div>

        <div className="divide-y divide-border/50">
          {filtered.map((finding, i) => {
            const isExpanded = expandedId === finding.id
            return (
              <div key={finding.id} className="group">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className={cn(
                    'grid grid-cols-12 gap-2 px-4 py-3 items-center cursor-pointer transition-colors',
                    isExpanded ? 'bg-accent/20' : 'hover:bg-accent/20'
                  )}
                  onClick={() => setExpandedId(isExpanded ? null : finding.id)}
                >
                  <div className="col-span-1">
                    <SeverityBadge severity={finding.severity} />
                  </div>
                  <div className="col-span-4">
                    <p className="text-sm font-medium text-foreground leading-tight line-clamp-1">{finding.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{finding.category}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs font-mono text-muted-foreground line-clamp-1">{finding.asset}</span>
                  </div>
                  <div className="col-span-1">
                    <span className={cn(
                      'text-xs font-bold tabular-nums',
                      finding.cvss >= 9 ? 'text-red-400' :
                      finding.cvss >= 7 ? 'text-orange-400' :
                      finding.cvss >= 4 ? 'text-yellow-400' :
                      'text-blue-400'
                    )}>
                      {finding.cvss.toFixed(1)}
                    </span>
                  </div>
                  <div className="col-span-1">
                    <StatusBadge status={finding.status} />
                  </div>
                  <div className="col-span-2">
                    {finding.assignedTo ? (
                      <div className="flex items-center gap-1.5">
                        <div className="flex size-5 items-center justify-center rounded-full bg-zinc-700 text-[9px] font-bold text-white">
                          {finding.assignedTo}
                        </div>
                        <span className="text-xs text-muted-foreground">{finding.assignedTo}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground/40">Unassigned</span>
                    )}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button className="text-muted-foreground transition-colors">
                      {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                    </button>
                  </div>
                </motion.div>

                {/* Expanded detail */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-border/50 bg-zinc-900/30"
                    >
                        <div className="p-5 space-y-4">
                        {/* Top row: severity meter + stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {/* CVSS Severity Meter */}
                          <div className="col-span-2 sm:col-span-1 rounded-lg border border-border bg-zinc-900/50 p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">CVSS Score</p>
                            <div className="flex items-end gap-2">
                              <span className={cn(
                                'text-2xl font-bold tabular-nums',
                                finding.cvss >= 9 ? 'text-red-400' :
                                finding.cvss >= 7 ? 'text-orange-400' :
                                finding.cvss >= 4 ? 'text-yellow-400' : 'text-blue-400'
                              )}>{finding.cvss.toFixed(1)}</span>
                              <span className="text-xs text-muted-foreground mb-1">/ 10</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-zinc-800 mt-2">
                              <m2.div
                                className={cn('h-1.5 rounded-full',
                                  finding.cvss >= 9 ? 'bg-red-500' :
                                  finding.cvss >= 7 ? 'bg-orange-500' :
                                  finding.cvss >= 4 ? 'bg-yellow-500' : 'bg-blue-500'
                                )}
                                initial={{ width: 0 }}
                                animate={{ width: `${(finding.cvss / 10) * 100}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                              />
                            </div>
                          </div>

                          {/* Confidence */}
                          <div className="rounded-lg border border-border bg-zinc-900/50 p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">AI Confidence</p>
                            <div className="flex items-end gap-1">
                              <span className="text-xl font-bold text-green-400 tabular-nums">{finding.confidence}</span>
                              <span className="text-xs text-muted-foreground mb-0.5">%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-zinc-800 mt-2">
                              <m2.div
                                className="h-1.5 rounded-full bg-green-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${finding.confidence}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                              />
                            </div>
                          </div>

                          {/* Remediation Time */}
                          <div className="rounded-lg border border-border bg-zinc-900/50 p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Est. Fix Time</p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <Clock className="size-4 text-yellow-400" />
                              <span className="text-sm font-bold text-foreground">
                                {finding.severity === 'critical' ? '2h' : finding.severity === 'high' ? '4h' : finding.severity === 'medium' ? '8h' : '1h'}
                              </span>
                            </div>
                          </div>

                          {/* Risk Reduction */}
                          <div className="rounded-lg border border-border bg-zinc-900/50 p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Risk Reduction</p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <TrendingDown className="size-4 text-green-400" />
                              <span className="text-sm font-bold text-foreground">
                                -{finding.severity === 'critical' ? '26' : finding.severity === 'high' ? '12' : finding.severity === 'medium' ? '6' : '2'}pts
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          {/* Evidence */}
                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Evidence</h4>
                            <div className="relative rounded-lg bg-zinc-950 border border-border p-3">
                              <code className="text-xs font-mono text-green-400">{finding.evidence}</code>
                              <button
                                onClick={() => copy(finding.evidence, finding.id + '-ev')}
                                className="absolute right-2 top-2 text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {copiedId === finding.id + '-ev' ? <CheckCheck className="size-3.5 text-green-400" /> : <Copy className="size-3.5" />}
                              </button>
                            </div>
                          </div>

                          {/* References */}
                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">References</h4>
                            <div className="space-y-1.5">
                              {[
                                { label: 'OWASP', value: finding.owasp, icon: Shield },
                                { label: 'MITRE ATT&CK', value: finding.mitre, icon: Crosshair },
                                { label: 'CVE', value: finding.cve, icon: BookOpen },
                                { label: 'CWE', value: finding.cwe, icon: BarChart2 },
                              ].filter((r) => r.value).map((r) => {
                                const RefIcon = r.icon
                                return (
                                  <div key={r.label} className="flex items-center gap-2">
                                    <RefIcon className="size-3 text-muted-foreground" />
                                    <span className="text-[10px] text-muted-foreground w-20">{r.label}:</span>
                                    <span className="flex items-center gap-1 text-xs font-medium text-primary">
                                      {r.value}
                                      <ExternalLink className="size-2.5" />
                                    </span>
                                  </div>
                                )
                              })}
                              <div className="flex items-center gap-2">
                                <BarChart2 className="size-3 text-muted-foreground" />
                                <span className="text-[10px] text-muted-foreground w-20">Confidence:</span>
                                <span className="text-xs font-medium text-green-400">{finding.confidence}%</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* AI Explanation */}
                        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Bot className="size-3.5 text-primary" />
                            <span className="text-xs font-semibold text-primary">AI Explanation</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {AI_EXPLANATIONS[finding.id] ?? `This ${finding.severity} severity finding represents a ${finding.category} vulnerability. The affected asset ${finding.asset} may be susceptible to attack vectors described by ${finding.cwe ?? 'industry-standard weakness catalogues'}. Immediate review and remediation is recommended based on the CVSS score of ${finding.cvss}.`}
                          </p>
                        </div>

                        {/* Recommended Fix */}
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Recommended Fix</h4>
                          <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3">
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {finding.severity === 'critical'
                                ? '1. Immediately patch affected system to latest version. 2. Implement input validation and output encoding. 3. Apply principle of least privilege. 4. Enable security logging and alerting. 5. Conduct post-fix verification scan.'
                                : '1. Review and update the affected configuration. 2. Apply vendor security patches. 3. Implement compensating controls if immediate patching is not possible. 4. Verify the fix with a follow-up scan.'}
                            </p>
                          </div>
                        </div>

                        {/* Risk Timeline */}
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Risk Timeline</h4>
                          <div className="flex items-center gap-0">
                            {[
                              { label: 'Discovery', date: 'Jul 18', color: 'bg-red-400', active: true },
                              { label: 'Triaged', date: 'Jul 19', color: 'bg-orange-400', active: finding.status !== 'open' },
                              { label: 'In Progress', date: finding.status === 'in-progress' || finding.status === 'remediated' ? 'Jul 19' : '—', color: 'bg-yellow-400', active: finding.status === 'in-progress' || finding.status === 'remediated' },
                              { label: 'Resolved', date: finding.status === 'remediated' ? 'Jul 20' : '—', color: 'bg-green-400', active: finding.status === 'remediated' },
                            ].map((step, si, arr) => (
                              <div key={si} className="flex items-center flex-1">
                                <div className="flex flex-col items-center">
                                  <div className={cn('size-3 rounded-full', step.active ? step.color : 'bg-zinc-700')} />
                                  <p className="text-[10px] text-muted-foreground mt-1 whitespace-nowrap">{step.label}</p>
                                  <p className="text-[9px] text-muted-foreground/50">{step.date}</p>
                                </div>
                                {si < arr.length - 1 && (
                                  <div className={cn('flex-1 h-px', step.active ? step.color : 'bg-zinc-700')} />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

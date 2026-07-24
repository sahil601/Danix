'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Download,
  Eye,
  Plus,
  CheckCircle2,
  Loader2,
  X,
  ChevronRight,
  Clock,
  File,
  FileBadge,
  FileCode,
  BookOpen,
  RefreshCw,
  History,
  Sparkles,
  Shield,
} from 'lucide-react'
import { DEMO_REPORTS, DEMO_PROJECTS } from '@/lib/data'
import { StatusBadge } from '@/components/ui/severity-badge'
import { cn } from '@/lib/utils'

/* ── Config ───────────────────────────────────────────────────────────────── */
const REPORT_TYPES = [
  { id: 'executive', label: 'Executive Summary', icon: BookOpen, desc: 'High-level findings for stakeholders', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { id: 'technical', label: 'Technical Report', icon: FileCode, desc: 'Full technical detail with POCs', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
  { id: 'compliance', label: 'Compliance Report', icon: FileBadge, desc: 'Mapped to NIST, ISO, HIPAA', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
]

const REPORT_FORMATS = [
  { id: 'pdf', label: 'PDF', icon: File, desc: 'Printable, shareable' },
  { id: 'html', label: 'HTML', icon: FileCode, desc: 'Interactive web format' },
  { id: 'markdown', label: 'Markdown', icon: FileText, desc: 'Developer-friendly' },
  { id: 'json', label: 'JSON', icon: FileCode, desc: 'Machine-readable data' },
]

const TYPE_ICONS: Record<string, React.ElementType> = {
  executive: BookOpen,
  technical: FileCode,
  compliance: FileBadge,
}

const FORMAT_COLORS: Record<string, string> = {
  pdf: 'bg-red-500/10 text-red-400 border-red-500/20',
  html: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  markdown: 'bg-zinc-700/40 text-zinc-400 border-zinc-600/30',
  json: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export default function ReportsPage() {
  const [wizardOpen, setWizardOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [reportType, setReportType] = useState('executive')
  const [reportFormat, setReportFormat] = useState('pdf')
  const [selectedProject, setSelectedProject] = useState(DEMO_PROJECTS[0].id)
  const [generating, setGenerating] = useState(false)
  const [generatedId, setGeneratedId] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const generate = async () => {
    setGenerating(true)
    await new Promise((r) => setTimeout(r, 2800))
    setGenerating(false)
    setGeneratedId('rpt-new')
    setWizardOpen(false)
  }

  const typeConfig = REPORT_TYPES.find((t) => t.id === reportType)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {DEMO_REPORTS.length} reports · {DEMO_REPORTS.filter((r) => r.status === 'ready').length} ready
          </p>
        </div>
        <button
          onClick={() => { setWizardOpen(true); setStep(1); setGenerating(false); setGeneratedId(null) }}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors self-start sm:self-auto"
        >
          <Plus className="size-4" />
          Generate Report
        </button>
      </div>

      {/* Success banner */}
      <AnimatePresence>
        {generatedId && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center justify-between rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-green-400" />
              <span className="text-sm font-medium text-green-400">Report generated successfully and is ready for download.</span>
            </div>
            <button onClick={() => setGeneratedId(null)} className="text-green-400/60 hover:text-green-400 transition-colors">
              <X className="size-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report type overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {REPORT_TYPES.map((type, i) => {
          const Icon = type.icon
          const count = DEMO_REPORTS.filter((r) => r.type === type.id).length
          return (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={cn('rounded-xl border p-4', type.color)}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className="size-5" />
                <span className="text-lg font-bold">{count}</span>
              </div>
              <p className="text-sm font-semibold">{type.label}</p>
              <p className="text-xs opacity-70 mt-0.5">{type.desc}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Reports list */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">All Reports</h2>
        {DEMO_REPORTS.map((report, i) => {
          const Icon = TYPE_ICONS[report.type] ?? FileText
          const project = DEMO_PROJECTS.find((p) => p.id === report.project)

          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="group rounded-xl border border-border bg-card p-4 hover:border-zinc-600 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  'flex size-10 flex-shrink-0 items-center justify-center rounded-xl',
                  report.status === 'ready' ? 'bg-green-500/10' : 'bg-blue-500/10'
                )}>
                  {report.status === 'generating'
                    ? <Loader2 className="size-5 text-blue-400 animate-spin" />
                    : <Icon className="size-5 text-green-400" />
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{report.title}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={cn('rounded-md border px-1.5 py-0.5 text-[10px] font-medium capitalize', FORMAT_COLORS[report.format] ?? FORMAT_COLORS.json)}>
                          {report.format.toUpperCase()}
                        </span>
                        <span className="text-xs text-muted-foreground capitalize">{report.type} report</span>
                        {project && (
                          <span className="text-xs text-muted-foreground">· {project.client}</span>
                        )}
                      </div>
                    </div>
                    <StatusBadge status={report.status} />
                  </div>

                  {report.status === 'generating' && (
                    <div className="mt-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 rounded-full bg-zinc-800">
                          <motion.div
                            className="h-1 rounded-full bg-blue-500"
                            animate={{ width: ['0%', '100%'] }}
                            transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
                          />
                        </div>
                        <Sparkles className="size-3.5 text-blue-400 animate-pulse" />
                        <span className="text-[10px] text-blue-400">AI generating...</span>
                      </div>
                    </div>
                  )}

                  {report.status === 'ready' && (
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3" /> {report.generatedAt}
                      </div>
                      {report.size && <span className="text-xs text-muted-foreground">{report.size}</span>}
                      {report.version && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <History className="size-3" /> v{report.version}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                {report.status === 'ready' && (
                  <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setPreviewOpen(true)}
                      className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-zinc-600 transition-colors"
                    >
                      <Eye className="size-3.5" /> Preview
                    </button>
                    <button className="flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs text-primary hover:bg-primary/20 transition-colors">
                      <Download className="size-3.5" /> Download
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Version history section */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <History className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Version History</h3>
          <span className="text-xs text-muted-foreground">— Acme Corp Executive Summary</span>
        </div>
        <div className="space-y-3">
          {[
            { version: 'v1.2', date: '2025-07-19 16:00', by: 'JD', changes: 'Added MITRE ATT&CK mapping section, updated exec summary' },
            { version: 'v1.1', date: '2025-07-18 14:30', by: 'SK', changes: 'Incorporated new RCE finding details' },
            { version: 'v1.0', date: '2025-07-17 09:00', by: 'JD', changes: 'Initial report generation' },
          ].map((v, i) => (
            <div key={i} className="flex items-start gap-3 pb-3 border-b border-border/50 last:border-0 last:pb-0">
              <div className="flex size-6 flex-shrink-0 items-center justify-center rounded-md bg-zinc-700/40 text-[10px] font-bold text-zinc-400">
                {v.version}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground">{v.changes}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{v.date} · by {v.by}</p>
              </div>
              <button className="text-[10px] text-primary hover:underline flex-shrink-0">Restore</button>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Report Wizard */}
      <AnimatePresence>
        {wizardOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !generating && setWizardOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    {step === 1 ? 'Select Report Type' : step === 2 ? 'Configure & Generate' : 'Generating Report'}
                  </h2>
                  <div className="flex items-center gap-1.5 mt-1">
                    {[1, 2, 3].map((s) => (
                      <div key={s} className={cn('h-1 rounded-full transition-all', s <= step ? 'bg-primary' : 'bg-zinc-700', s === step ? 'w-6' : 'w-3')} />
                    ))}
                  </div>
                </div>
                {!generating && (
                  <button onClick={() => setWizardOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="size-5" />
                  </button>
                )}
              </div>

              {/* Step 1: Type */}
              {step === 1 && (
                <div className="p-6 space-y-3">
                  {REPORT_TYPES.map((type) => {
                    const Icon = type.icon
                    return (
                      <button
                        key={type.id}
                        onClick={() => setReportType(type.id)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all',
                          reportType === type.id ? 'border-primary bg-primary/10' : 'border-border hover:border-zinc-600'
                        )}
                      >
                        <div className={cn('flex size-10 items-center justify-center rounded-xl', type.color)}>
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <p className={cn('text-sm font-semibold', reportType === type.id ? 'text-primary' : 'text-foreground')}>{type.label}</p>
                          <p className="text-xs text-muted-foreground">{type.desc}</p>
                        </div>
                        {reportType === type.id && <CheckCircle2 className="size-4 text-primary ml-auto" />}
                      </button>
                    )
                  })}
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setStep(2)}
                      className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
                    >
                      Next <ChevronRight className="size-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Config */}
              {step === 2 && (
                <div className="p-6 space-y-5">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Project</label>
                    <select
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                    >
                      {DEMO_PROJECTS.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Output Format</label>
                    <div className="grid grid-cols-4 gap-2">
                      {REPORT_FORMATS.map((fmt) => {
                        const Icon = fmt.icon
                        return (
                          <button
                            key={fmt.id}
                            onClick={() => setReportFormat(fmt.id)}
                            className={cn(
                              'flex flex-col items-center gap-1.5 rounded-lg border p-3 text-xs font-medium transition-all',
                              reportFormat === fmt.id
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border text-muted-foreground hover:border-zinc-600 hover:text-foreground'
                            )}
                          >
                            <Icon className="size-4" />
                            {fmt.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="size-3.5 text-primary" />
                      <span className="text-xs font-semibold text-primary">AI-Powered Generation</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      The report will be generated using GPT-4 analysis of your findings, automatically mapped to {reportType === 'compliance' ? 'NIST CSF, ISO 27001, and HIPAA' : 'OWASP and MITRE ATT&CK'} frameworks.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button onClick={() => setStep(1)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      ← Back
                    </button>
                    <button
                      onClick={generate}
                      className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
                    >
                      <Sparkles className="size-4" />
                      Generate
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Generating */}
              {generating && (
                <div className="p-8 flex flex-col items-center text-center space-y-4">
                  <div className="relative flex size-20 items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                    <motion.div
                      className="absolute inset-0 rounded-full border-t-2 border-primary"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    <Sparkles className="size-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-foreground">Generating Report</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      AI is analyzing {DEMO_PROJECTS.find((p) => p.id === selectedProject)?.name ?? 'project'} findings...
                    </p>
                  </div>
                  <div className="w-full space-y-2">
                    {['Compiling findings data', 'Mapping to frameworks', 'Writing executive summary', 'Finalizing document'].map((step, i) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.7 }}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <CheckCircle2 className="size-3.5 text-green-400 flex-shrink-0" />
                        {step}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-3xl max-h-[85vh] rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <div className="flex items-center gap-3">
                  <Shield className="size-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">Acme Corp Executive Summary</p>
                    <p className="text-xs text-muted-foreground">SentinelAI X · Confidential</p>
                  </div>
                </div>
                <button onClick={() => setPreviewOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="size-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="text-center border-b border-border pb-6">
                  <p className="text-2xl font-bold text-foreground">Executive Security Assessment</p>
                  <p className="text-sm text-muted-foreground mt-1">Acme Corporation · July 2025 · Confidential</p>
                  <div className="mt-4 flex justify-center gap-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-orange-400">78</p>
                      <p className="text-xs text-muted-foreground">Risk Score</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-red-400">14</p>
                      <p className="text-xs text-muted-foreground">Critical</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-foreground">268</p>
                      <p className="text-xs text-muted-foreground">Total Findings</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-2">Executive Summary</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The external security assessment of Acme Corporation identified significant vulnerabilities across the web and API infrastructure. The most critical finding is an unauthenticated Remote Code Execution vulnerability on the primary API gateway (CVE-2021-44228), which if exploited could result in full system compromise. Immediate remediation action is strongly recommended.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-3">Key Findings</h3>
                  <div className="space-y-2">
                    {['Remote Code Execution via Deserialization (CVSS 9.8)', 'SQL Injection in Authentication Endpoint (CVSS 9.1)', 'Stored XSS in User Profile (CVSS 7.5)'].map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className={cn('size-2 rounded-full flex-shrink-0', i === 0 || i === 1 ? 'bg-red-400' : 'bg-orange-400')} />
                        <span className="text-muted-foreground">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="border-t border-border px-6 py-3 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Preview — Full report available for download</p>
                <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90 transition-colors">
                  <Download className="size-3.5" /> Download PDF
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

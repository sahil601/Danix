'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Play,
  Pause,
  X,
  CheckCircle2,
  Clock,
  ScanLine,
  AlertTriangle,
  Server,
  Globe,
  Network,
  Shield,
  ChevronRight,
  Terminal,
  Loader2,
  Zap,
  Brain,
  Bot,
  Activity,
  Cpu,
  Layers,
  BarChart3,
  StopCircle,
  FileText,
} from 'lucide-react'
import { fetchScans, createScan, pauseScan, resumeScan, cancelScan } from '@/lib/api'
import { StatusBadge } from '@/components/ui/severity-badge'
import { ReportModal } from '@/components/ui/report-modal'
import { cn } from '@/lib/utils'

const SCAN_MODULES = [
  { id: 'network', label: 'Network Discovery', icon: Network, desc: 'Port scanning, service detection' },
  { id: 'web', label: 'Web Application', icon: Globe, desc: 'HTTP fuzzing, vulnerability scan' },
  { id: 'ssl', label: 'SSL/TLS Analysis', icon: Shield, desc: 'Certificate & cipher analysis' },
  { id: 'dns', label: 'DNS Enumeration', icon: Server, desc: 'Subdomain, record discovery' },
  { id: 'headers', label: 'HTTP Headers', icon: AlertTriangle, desc: 'Security header analysis' },
  { id: 'whois', label: 'WHOIS Lookup', icon: Globe, desc: 'Domain registration info' },
]

const SCAN_PROFILES = [
  { id: 'quick', label: 'Quick', desc: '~15 min · Basic discovery', time: '15 min' },
  { id: 'normal', label: 'Normal', desc: '~45 min · Balanced coverage', time: '45 min' },
  { id: 'deep', label: 'Deep', desc: '~2 hrs · Full assessment', time: '2 hrs' },
]

// Removed mock logs



export default function ScansPage() {
  const [scans, setScans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadScans = () => {
    fetchScans().then(res => {
      setScans((res as any).scans || res)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => {
    loadScans()
  }, [])

  const [wizardOpen, setWizardOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState('normal')
  const [target, setTarget] = useState('')
  const [targetType, setTargetType] = useState('domain')
  const [selectedModules, setSelectedModules] = useState(['network', 'web', 'ssl', 'dns'])
  const [scanning, setScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [liveLogs, setLiveLogs] = useState<string[]>([])
  const [currentPhase, setCurrentPhase] = useState<string | null>(null)
  const [completedPhases, setCompletedPhases] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [viewingReportId, setViewingReportId] = useState<string | null>(null)
  const [currentScanId, setCurrentScanId] = useState<string | null>(null)

  const toggleModule = (id: string) =>
    setSelectedModules((prev) => prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id])

  const filtered = scans.filter(
    (s) => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.target.includes(search)
  )

  const startScan = async () => {
    try {
      const newScan = await createScan({
        name: `Scan on ${target || 'target'}`,
        target: target || 'example.com',
        target_type: targetType,
        profile: profile,
      })
      setCurrentScanId(newScan.id)
      setScans((prev) => [newScan, ...prev])
      setStep(3)
      setScanProgress(0)
      setLiveLogs([])
      setCurrentPhase(null)
      setCompletedPhases([])
      setScanning(true)
      
      const response = await fetch(`/api/v1/scans/${newScan.id}/stream`)
      if (!response.ok) throw new Error('API Error')
      
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6).trim()
              if (!dataStr || dataStr === '{}') continue
              try {
                const data = JSON.parse(dataStr)
                if (data.log) {
                  setLiveLogs((prev) => [...prev, data.log])
                }
                if (data.node) {
                  setCurrentPhase(data.node)
                  setCompletedPhases((prev) => [...new Set([...prev, data.node])])
                }
                if (data.done || data.error) {
                  setScanProgress(100)
                  setCurrentPhase(null)
                  setScanning(false)
                  loadScans()
                }
              } catch (e) {
                // ignore
              }
            }
          }
        }
      }
    } catch (e) {
      console.error(e)
      setScanning(false)
    }
  }

  const logColor = (line: string) => {
    if (line.includes('CRIT')) return 'text-red-400'
    if (line.includes('WARN')) return 'text-yellow-400'
    if (line.includes('OK')) return 'text-green-400'
    return 'text-zinc-400'
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Scans</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {scans.length} scans · {scans.filter((s) => s.status === 'running').length} running
          </p>
        </div>
        <button
          onClick={() => { setWizardOpen(true); setStep(1); setScanProgress(0); setScanning(false) }}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors self-start sm:self-auto"
        >
          <Plus className="size-4" />
          New Scan
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search scans..."
          className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Scan Cards */}
      <div className="space-y-3">
        {filtered.map((scan, i) => (
          <motion.div
            key={scan.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-border bg-card p-4 hover:border-zinc-600 transition-all"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={cn(
                  'flex size-9 flex-shrink-0 items-center justify-center rounded-lg',
                  scan.status === 'running' ? 'bg-blue-500/10' :
                  scan.status === 'completed' ? 'bg-green-500/10' :
                  scan.status === 'paused' ? 'bg-yellow-500/10' :
                  'bg-zinc-700/40'
                )}>
                  <ScanLine className={cn(
                    'size-4',
                    scan.status === 'running' ? 'text-blue-400 animate-pulse' :
                    scan.status === 'completed' ? 'text-green-400' :
                    scan.status === 'paused' ? 'text-yellow-400' :
                    'text-zinc-400'
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground truncate">{scan.name}</span>
                    <StatusBadge status={scan.status} />
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    <span className="text-xs font-mono text-muted-foreground">{scan.target}</span>
                    <span className="text-xs text-muted-foreground">{scan.profile} scan</span>
                    {scan.duration && <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="size-3" />{scan.duration}</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-center">
                  <p className="text-sm font-bold text-foreground">{scan.findings}</p>
                  <p className="text-[10px] text-muted-foreground">Findings</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-foreground">{scan.assets}</p>
                  <p className="text-[10px] text-muted-foreground">Assets</p>
                </div>
                <div className="flex gap-1.5">
                  {scan.status === 'running' && (
                    <button title="Pause Scan" onClick={() => pauseScan(scan.id).then(loadScans)} className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                      <Pause className="size-3.5" />
                    </button>
                  )}
                  {scan.status === 'paused' && (
                    <button title="Resume Scan" onClick={() => resumeScan(scan.id).then(loadScans)} className="rounded-lg bg-primary/10 p-1.5 text-primary hover:bg-primary/20 transition-colors">
                      <Play className="size-3.5" />
                    </button>
                  )}
                  {['running', 'paused', 'queued'].includes(scan.status) ? (
                    <button title="Cancel Scan" onClick={() => cancelScan(scan.id).then(loadScans)} className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                      <StopCircle className="size-3.5" />
                    </button>
                  ) : (
                    <button title="View Report" onClick={() => setViewingReportId(scan.id)} className="rounded-lg border border-border bg-primary/5 p-1.5 text-primary hover:bg-primary/20 hover:border-primary/30 transition-colors">
                      <FileText className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {scan.status === 'running' && (
              <div className="mt-3">
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] text-muted-foreground">Progress</span>
                  <span className="text-[10px] text-foreground font-medium">{scan.progress}%</span>
                </div>
                <div className="h-1 w-full rounded-full bg-zinc-800">
                  <div className="h-1 rounded-full bg-blue-500 transition-all" style={{ width: `${scan.progress}%` }} />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>



      {/* Scan Wizard Modal */}
      <AnimatePresence>
        {wizardOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !scanning && setWizardOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative z-10 w-full max-w-xl rounded-2xl border border-border bg-card shadow-2xl"
            >
              {/* Wizard header */}
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <div>
                  <h2 className="text-base font-semibold">
                    {step === 1 ? 'Configure Scan Target' : step === 2 ? 'Select Modules & Profile' : scanning ? 'Scan Running...' : 'Scan Complete'}
                  </h2>
                  <div className="flex items-center gap-1.5 mt-1">
                    {[1, 2, 3].map((s) => (
                      <div key={s} className={cn('h-1 rounded-full transition-all', s <= step ? 'bg-primary' : 'bg-zinc-700', s === step ? 'w-6' : 'w-3')} />
                    ))}
                  </div>
                </div>
                {!(step === 3 && !scanning) && (
                  <button onClick={() => setWizardOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="size-5" />
                  </button>
                )}
              </div>

              {/* Step 1: Target */}
              {step === 1 && (
                <div className="p-6 space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">Target</label>
                    <input
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      placeholder="e.g. example.com or 192.168.1.0/24"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">Target Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'domain', label: 'Domain', icon: Globe },
                        { id: 'ip', label: 'IP Address', icon: Server },
                        { id: 'cidr', label: 'CIDR Range', icon: Network },
                      ].map(({ id, label, icon: Icon }) => (
                        <button
                          key={id}
                          onClick={() => setTargetType(id)}
                          className={cn(
                            'flex flex-col items-center gap-1.5 rounded-lg border p-3 text-xs font-medium transition-all',
                            targetType === id
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border text-muted-foreground hover:border-zinc-600 hover:text-foreground'
                          )}
                        >
                          <Icon className="size-4" />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setStep(2)}
                      disabled={!target}
                      className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next <ChevronRight className="size-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Modules & Profile */}
              {step === 2 && (
                <div className="p-6 space-y-5">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Scan Profile</label>
                    <div className="grid grid-cols-3 gap-2">
                      {SCAN_PROFILES.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setProfile(p.id)}
                          className={cn(
                            'flex flex-col gap-1 rounded-lg border p-3 text-left transition-all',
                            profile === p.id
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-zinc-600'
                          )}
                        >
                          <span className={cn('text-sm font-semibold', profile === p.id ? 'text-primary' : 'text-foreground')}>{p.label}</span>
                          <span className="text-[10px] text-muted-foreground">{p.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Modules</label>
                    <div className="grid grid-cols-2 gap-2">
                      {SCAN_MODULES.map((m) => {
                        const Icon = m.icon
                        const active = selectedModules.includes(m.id)
                        return (
                          <button
                            key={m.id}
                            onClick={() => toggleModule(m.id)}
                            className={cn(
                              'flex items-center gap-2.5 rounded-lg border p-3 text-left transition-all',
                              active ? 'border-primary/40 bg-primary/8' : 'border-border hover:border-zinc-600'
                            )}
                          >
                            <Icon className={cn('size-4 flex-shrink-0', active ? 'text-primary' : 'text-muted-foreground')} />
                            <div>
                              <p className={cn('text-xs font-medium', active ? 'text-foreground' : 'text-muted-foreground')}>{m.label}</p>
                              <p className="text-[10px] text-muted-foreground/70">{m.desc}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Execution preview */}
                  <div className="rounded-lg border border-border bg-background p-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Target:</span>
                      <span className="font-mono font-medium text-foreground">{target || 'example.com'}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="text-muted-foreground">Estimated time:</span>
                      <span className="font-medium text-foreground">{SCAN_PROFILES.find((p) => p.id === profile)?.time}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="text-muted-foreground">Modules:</span>
                      <span className="font-medium text-foreground">{selectedModules.length} selected</span>
                    </div>
                    <div className="mt-2 flex items-start gap-1.5 rounded-md bg-yellow-500/10 border border-yellow-500/20 p-2">
                      <AlertTriangle className="size-3.5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <p className="text-[10px] text-yellow-400">Only scan authorized targets. Unauthorized scanning is illegal.</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button onClick={() => setStep(1)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      ← Back
                    </button>
                    <button
                      onClick={startScan}
                      className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
                    >
                      <Zap className="size-4" />
                      Start Scan
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Live Scan */}
              {step === 3 && (
                <div className="p-6 space-y-4">
                  {/* Progress & Phases */}
                  <div className="flex flex-col gap-4 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{scanning ? 'Agent Workflow Active...' : 'Scan Complete!'}</span>
                      <div className="flex items-center gap-2">
                        {scanning ? <Loader2 className="size-4 text-primary animate-spin" /> : <CheckCircle2 className="size-4 text-green-400" />}
                        <span className="text-sm font-bold tabular-nums">{scanProgress}%</span>
                      </div>
                    </div>
                    
                    {/* Agent Workflow Visualizer */}
                    <div className="relative py-4">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-zinc-800" />
                      <div className="space-y-4">
                        {[
                          { id: 'plan', label: 'Planner Agent' },
                          { id: 'recon', label: 'Recon Agent' },
                          { id: 'network_analysis', label: 'Network Analyst' },
                          { id: 'web_analysis', label: 'Web Analyst' },
                          { id: 'reasoning', label: 'Reasoning Engine' },
                          { id: 'report', label: 'Report Writer' }
                        ].map((phase, i) => {
                          const isActive = currentPhase === phase.id;
                          const isCompleted = completedPhases.includes(phase.id);
                          const isPending = !isActive && !isCompleted;
                          
                          return (
                            <div key={phase.id} className="relative flex items-center gap-3">
                              <div className={cn(
                                "flex size-8 flex-shrink-0 items-center justify-center rounded-full border-2 bg-card z-10 transition-colors",
                                isActive ? "border-primary text-primary" :
                                isCompleted ? "border-green-500 text-green-500" :
                                "border-zinc-700 text-zinc-600"
                              )}>
                                {isCompleted ? <CheckCircle2 className="size-4" /> : <Brain className={cn("size-4", isActive && "animate-pulse")} />}
                              </div>
                              <div className="flex-1">
                                <p className={cn(
                                  "text-sm font-medium transition-colors",
                                  isActive ? "text-primary" :
                                  isCompleted ? "text-foreground" :
                                  "text-muted-foreground"
                                )}>{phase.label}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Terminal */}
                  <div className="rounded-lg border border-border bg-zinc-950 font-mono p-4 max-h-52 overflow-y-auto">
                    <div className="flex items-center gap-1.5 mb-3">
                      <Terminal className="size-3.5 text-zinc-500" />
                      <span className="text-[10px] text-zinc-500">SentinelAI Scanner v2.4.1</span>
                    </div>
                    {liveLogs.map((line, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn('text-[11px] leading-relaxed', logColor(line))}
                      >
                        {line}
                      </motion.div>
                    ))}
                    {scanning && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className="text-[11px] text-zinc-400">{'>'}</div>
                        <div className="h-3 w-0.5 bg-zinc-400 animate-pulse" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    {scanning ? (
                      <button
                        onClick={() => setScanning(false)}
                        className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Pause className="size-3.5" /> Pause
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setWizardOpen(false)
                          if (currentScanId) setViewingReportId(currentScanId)
                        }}
                        className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
                      >
                        View Results
                      </button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewingReportId && (
          <ReportModal scanId={viewingReportId} onClose={() => setViewingReportId(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

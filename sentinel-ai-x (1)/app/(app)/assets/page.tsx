'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  Server,
  Globe,
  Cloud,
  X,
  ChevronRight,
  Plus,
  ScanLine,
  Bot,
  Clock,
  Tag,
  Network,
  Info,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Shield,
  Activity,
  User,
  Layers,
  BarChart2,
  Laptop,
  Database,
} from 'lucide-react'
import { DEMO_ASSETS } from '@/lib/data'
import { fetchAssets } from '@/lib/api'
import { RiskScore, StatusBadge } from '@/components/ui/severity-badge'
import { cn } from '@/lib/utils'

export default function AssetsPage() {
  const [assets, setAssets] = useState(DEMO_ASSETS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAssets().then((res: any) => {
      const rawAssets = res.assets || res || []
      const mappedAssets = rawAssets.map((a: any) => ({
        ...a,
        lastScan: a.lastScan || a.last_scan || 'Unknown',
        tags: a.tags ? (typeof a.tags === 'string' ? JSON.parse(a.tags) : a.tags) : []
      }))
      setAssets(mappedAssets)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const [search, setSearch] = useState('')
  const [selectedAsset, setSelectedAsset] = useState<(typeof DEMO_ASSETS)[0] | null>(null)
  const [riskFilter, setRiskFilter] = useState<string>('all')

  const filtered = assets.filter((a) => {
    const matchSearch =
      !search ||
      a.hostname.toLowerCase().includes(search.toLowerCase()) ||
      a.ip.includes(search) ||
      (a.domain ?? '').toLowerCase().includes(search.toLowerCase())
    const matchRisk = riskFilter === 'all' || a.risk === riskFilter
    return matchSearch && matchRisk
  })

  const riskColorClass = (risk: string) => ({
    critical: 'text-red-400',
    high: 'text-orange-400',
    medium: 'text-yellow-400',
    low: 'text-green-400',
  }[risk] ?? 'text-zinc-400')

  const riskDot = (risk: string) => ({
    critical: 'bg-red-400',
    high: 'bg-orange-400',
    medium: 'bg-yellow-400',
    low: 'bg-green-400',
  }[risk] ?? 'bg-zinc-400')

  const riskCounts = ['critical', 'high', 'medium', 'low'].map((r) => ({
    risk: r,
    count: assets.filter((a) => a.risk === r).length,
  }))
  const envCounts = {
    production: assets.filter((a) => a.environment === 'production').length,
    staging: assets.filter((a) => a.environment === 'staging').length,
    development: assets.filter((a) => a.environment === 'development').length,
  }
  const cloudAssets = assets.filter((a) => a.cloud).length
  const serverAssets = assets.filter((a) => !a.cloud).length

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Asset Inventory</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {assets.length} assets tracked · Last updated 2 min ago
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors self-start sm:self-auto">
          <Plus className="size-4" />
          Add Asset
        </button>
      </div>

      {/* Risk Distribution + Asset Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Critical', count: riskCounts[0].count, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', bar: 'bg-red-500' },
          { label: 'High', count: riskCounts[1].count, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', bar: 'bg-orange-500' },
          { label: 'Medium', count: riskCounts[2].count, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', bar: 'bg-yellow-500' },
          { label: 'Low', count: riskCounts[3].count, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', bar: 'bg-green-500' },
        ].map((item, i) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => setRiskFilter(riskFilter === item.label.toLowerCase() ? 'all' : item.label.toLowerCase())}
            className={cn(
              'rounded-xl border p-4 text-left transition-all',
              riskFilter === item.label.toLowerCase()
                ? cn(item.bg, item.border)
                : 'border-border bg-card hover:border-zinc-600'
            )}
          >
            <p className={cn('text-2xl font-bold', item.color)}>{item.count}</p>
            <p className="text-xs text-muted-foreground mt-0.5 mb-2">{item.label} Risk</p>
            <div className="h-1 rounded-full bg-zinc-800">
              <div className={cn('h-1 rounded-full', item.bar)} style={{ width: `${(item.count / assets.length) * 100}%` }} />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Asset type breakdown */}
      <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
          <Cloud className="size-3.5 text-blue-400" /><span>{cloudAssets} Cloud</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
          <Server className="size-3.5 text-zinc-400" /><span>{serverAssets} On-Premise</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
          <Layers className="size-3.5 text-green-400" /><span>{envCounts.production} Production</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
          <BarChart2 className="size-3.5 text-yellow-400" /><span>{envCounts.staging} Staging</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
          <Laptop className="size-3.5 text-muted-foreground" /><span>{envCounts.development} Dev</span>
        </div>
        <p className="ml-auto text-[10px]">Click a risk card to filter</p>
      </div>

      {/* Search + Filter row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by hostname, IP, or domain..."
            className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
          {['all', 'critical', 'high', 'medium', 'low'].map((r) => (
            <button
              key={r}
              onClick={() => setRiskFilter(r)}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors',
                riskFilter === r ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {r}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Filter className="size-3.5" />
          Filters
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-zinc-900/50">
                {['Hostname', 'IP Address', 'Domain / Cloud', 'OS', 'Environment', 'Status', 'Risk', 'Last Scan', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((asset, i) => (
                <motion.tr
                  key={asset.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelectedAsset(asset)}
                  className="border-b border-border/50 hover:bg-accent/30 cursor-pointer transition-colors last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={cn('size-1.5 rounded-full flex-shrink-0', riskDot(asset.risk))} />
                      <span className="text-sm font-medium text-foreground">{asset.hostname}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-mono text-muted-foreground">{asset.ip}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {asset.cloud && <Cloud className="size-3 text-blue-400" />}
                      {asset.domain && <Globe className="size-3 text-zinc-400" />}
                      <span className="text-xs text-muted-foreground">{asset.cloud ?? asset.domain ?? '—'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-muted-foreground">{asset.os ?? '—'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-zinc-800/60 px-2 py-0.5 text-[10px] font-medium capitalize text-zinc-400">
                      {asset.environment}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={asset.status} />
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('text-xs font-semibold capitalize', riskColorClass(asset.risk))}>
                      {asset.risk}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      {asset.lastScan}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedAsset(asset) }}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Asset Detail Drawer */}
      <AnimatePresence>
        {selectedAsset && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAsset(null)}
              className="fixed inset-0 z-40 bg-black/40"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 280 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-border bg-card shadow-2xl overflow-y-auto"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-5 py-4">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">{selectedAsset.hostname}</h2>
                  <p className="text-xs text-muted-foreground font-mono">{selectedAsset.ip}</p>
                </div>
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="p-5 space-y-5">
                {/* Risk & Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Risk Level</p>
                    <p className={cn('text-sm font-bold capitalize', riskColorClass(selectedAsset.risk))}>
                      {selectedAsset.risk}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                    <StatusBadge status={selectedAsset.status} />
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Asset Details</h3>
                  {[
                    { label: 'Owner', value: selectedAsset.owner, icon: Info },
                    { label: 'Environment', value: selectedAsset.environment, icon: Network },
                    { label: 'OS', value: selectedAsset.os ?? 'Unknown', icon: Server },
                    { label: 'Domain', value: selectedAsset.domain ?? 'N/A', icon: Globe },
                    { label: 'Cloud', value: selectedAsset.cloud ?? 'On-premise', icon: Cloud },
                    { label: 'Last Scan', value: selectedAsset.lastScan, icon: Clock },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-center gap-3 py-2 border-b border-border/40 last:border-0">
                      <Icon className="size-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="text-xs text-muted-foreground">{label}</span>
                      <span className="ml-auto text-xs font-medium text-foreground">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAsset.tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 rounded-md bg-zinc-800 px-2 py-1 text-[10px] text-zinc-400">
                        <Tag className="size-2.5" />{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Risk Trend */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Activity className="size-3.5" /> Risk Trend
                  </h3>
                  <div className="flex items-center gap-1.5 h-12">
                    {[30, 45, 38, 62, 55, 70, selectedAsset.risk === 'critical' ? 88 : selectedAsset.risk === 'high' ? 72 : 55].map((v, vi) => (
                      <div key={vi} className="flex-1 flex items-end">
                        <div
                          className={cn(
                            'w-full rounded-t-sm transition-all',
                            v >= 80 ? 'bg-red-500/60' : v >= 60 ? 'bg-orange-500/60' : v >= 40 ? 'bg-yellow-500/60' : 'bg-green-500/60'
                          )}
                          style={{ height: `${(v / 100) * 48}px` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-muted-foreground">
                    <span>Jan</span><span>Jul</span>
                  </div>
                </div>

                {/* Recent Findings */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="size-3.5" /> Recent Findings
                  </h3>
                  <div className="space-y-1.5">
                    {[
                      { title: 'RCE via Deserialization', sev: 'critical' },
                      { title: 'SQL Injection in /login', sev: 'critical' },
                      { title: 'Verbose Error Messages', sev: 'low' },
                    ].filter(() => selectedAsset.risk === 'critical' || selectedAsset.risk === 'high').slice(0, 2).map((f, fi) => (
                      <div key={fi} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
                        <span className={cn('size-1.5 rounded-full flex-shrink-0',
                          f.sev === 'critical' ? 'bg-red-400' : f.sev === 'high' ? 'bg-orange-400' : 'bg-blue-400'
                        )} />
                        <span className="text-xs text-muted-foreground truncate">{f.title}</span>
                      </div>
                    ))}
                    {(selectedAsset.risk === 'medium' || selectedAsset.risk === 'low') && (
                      <p className="text-xs text-muted-foreground/50 text-center py-2">No critical findings on this asset</p>
                    )}
                  </div>
                </div>

                {/* Recent Scans */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                    <ScanLine className="size-3.5" /> Recent Scans
                  </h3>
                  <div className="space-y-1.5">
                    {[
                      { name: 'Full External Scan', date: 'Jul 18', status: 'completed' },
                      { name: 'Quick Port Scan', date: 'Jul 15', status: 'completed' },
                    ].map((scan, si) => (
                      <div key={si} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                        <div>
                          <p className="text-xs font-medium text-foreground">{scan.name}</p>
                          <p className="text-[10px] text-muted-foreground">{scan.date}</p>
                        </div>
                        <span className="text-[10px] text-green-400">{scan.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Recommendations */}
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="size-3.5 text-primary" />
                    <span className="text-xs font-semibold text-primary">AI Recommendation</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {selectedAsset.risk === 'critical'
                      ? 'This asset has critical risk. Immediate patching and isolation review is recommended. Run a deep scan to identify all vulnerabilities.'
                      : selectedAsset.risk === 'high'
                      ? 'High-risk asset. Schedule a targeted vulnerability scan and review all open ports for unnecessary exposure.'
                      : 'Asset is within acceptable risk parameters. Schedule routine scans and monitor for any configuration drift.'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary/90 transition-colors">
                    <ScanLine className="size-3.5" />
                    Scan Asset
                  </button>
                  <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-zinc-600 transition-colors">
                    <Bot className="size-3.5" />
                    Ask AI
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Building2,
  LayoutDashboard,
  Bell,
  Key,
  Brain,
  Server,
  Database,
  Settings2,
  FileText,
  Info,
  Shield,
  Eye,
  EyeOff,
  ChevronRight,
  CheckCircle2,
  Plus,
  Trash2,
  Copy,
  RefreshCw,
  Moon,
  Sun,
  Monitor,
  Zap,
  Globe,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SYSTEM_STATUS } from '@/lib/data'
import { fetchSystemStatus } from '@/lib/api'

/* ── Sidebar sections ─────────────────────────────────────────────────────── */
const SETTINGS_NAV = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'organization', label: 'Organization', icon: Building2 },
  { id: 'workspace', label: 'Workspace', icon: LayoutDashboard },
  { id: 'theme', label: 'Appearance', icon: Sun },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'api-keys', label: 'API Keys', icon: Key },
  { id: 'llm', label: 'LLM Provider', icon: Brain },
  { id: 'ollama', label: 'Ollama Config', icon: Server },
  { id: 'ai-prefs', label: 'AI Preferences', icon: Zap },
  { id: 'knowledge', label: 'Knowledge Sources', icon: Globe },
  { id: 'plugins', label: 'Plugins', icon: Settings2 },
  { id: 'database', label: 'Database', icon: Database },
  { id: 'system', label: 'System', icon: Settings2 },
  { id: 'logs', label: 'Logs', icon: FileText },
  { id: 'about', label: 'About', icon: Info },
]

/* ── Reusable components ──────────────────────────────────────────────────── */
function SettingsRow({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-border/60 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={cn(
        'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
        enabled ? 'bg-primary' : 'bg-zinc-700'
      )}
    >
      <span
        className={cn(
          'inline-block size-3.5 rounded-full bg-white shadow-sm transition-transform',
          enabled ? 'translate-x-4.5' : 'translate-x-0.5'
        )}
      />
    </button>
  )
}

function SectionHeader({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export default function SettingsPage() {
  const [systemStatus, setSystemStatus] = useState(SYSTEM_STATUS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSystemStatus().then(res => {
      setSystemStatus(res.systemStatus || res)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const [activeSection, setActiveSection] = useState('profile')
  const [showKey, setShowKey] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)
  const [notifications, setNotifications] = useState({
    critical: true,
    high: true,
    scanComplete: true,
    reportReady: true,
    agentAlerts: false,
    weeklyDigest: true,
  })
  const [llmProvider, setLlmProvider] = useState('openai')
  const [theme, setTheme] = useState('dark')

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const API_KEYS = [
    { id: 'openai', name: 'OpenAI API Key', value: 'sk-proj-••••••••••••••••••••••••••••••••', active: true },
    { id: 'shodan', name: 'Shodan API Key', value: '••••••••••••••••••••••', active: true },
    { id: 'virustotal', name: 'VirusTotal API Key', value: '••••••••••••••••••••••', active: false },
  ]

  return (
    <div className="flex h-[calc(100vh-3.5rem-2.5rem)] overflow-hidden">
      {/* Settings nav */}
      <aside className="hidden lg:flex w-52 flex-shrink-0 flex-col border-r border-border bg-card/30 p-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 mb-2">Settings</p>
        <div className="space-y-0.5 flex-1 overflow-y-auto">
          {SETTINGS_NAV.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors text-left',
                  activeSection === item.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <Icon className="size-3.5 flex-shrink-0" />
                {item.label}
                {activeSection === item.id && <ChevronRight className="size-3 ml-auto" />}
              </button>
            )
          })}
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl p-6 space-y-1 mx-auto">

          {/* Mobile nav */}
          <div className="lg:hidden mb-6">
            <select
              value={activeSection}
              onChange={(e) => setActiveSection(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            >
              {SETTINGS_NAV.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Profile */}
          {activeSection === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
              <SectionHeader title="Profile" desc="Manage your personal information and account settings." />
              <div className="rounded-xl border border-border bg-card p-5 space-y-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-xl font-bold text-white">
                    JD
                  </div>
                  <div>
                    <p className="text-base font-semibold text-foreground">John Doe</p>
                    <p className="text-xs text-muted-foreground">Lead Security Analyst</p>
                    <button className="mt-1.5 text-xs text-primary hover:underline">Change avatar</button>
                  </div>
                </div>
                <SettingsRow label="Full Name" description="Your display name across the platform">
                  <input
                    defaultValue="John Doe"
                    className="w-48 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                  />
                </SettingsRow>
                <SettingsRow label="Email Address" description="Your login and notification email">
                  <input
                    defaultValue="john.doe@acmecorp.com"
                    className="w-48 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                  />
                </SettingsRow>
                <SettingsRow label="Role" description="Your position within the organization">
                  <select className="w-48 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary transition-colors">
                    <option>Lead Analyst</option>
                    <option>Security Engineer</option>
                    <option>Manager</option>
                    <option>Admin</option>
                  </select>
                </SettingsRow>
                <SettingsRow label="Two-Factor Authentication" description="Protect your account with 2FA">
                  <Toggle enabled={true} onChange={() => {}} />
                </SettingsRow>
              </div>
              <div className="flex justify-end pt-2">
                <button onClick={save} className={cn(
                  'flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold transition-all',
                  saved ? 'bg-green-500/20 text-green-400' : 'bg-primary text-white hover:bg-primary/90'
                )}>
                  {saved && <CheckCircle2 className="size-4" />}
                  {saved ? 'Saved!' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          )}

          {/* Organization */}
          {activeSection === 'organization' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
              <SectionHeader title="Organization" desc="Configure your organization details and branding." />
              <div className="rounded-xl border border-border bg-card p-5 space-y-1">
                <SettingsRow label="Organization Name">
                  <input defaultValue="Acme Corporation" className="w-48 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary transition-colors" />
                </SettingsRow>
                <SettingsRow label="Industry" description="Used for compliance framework recommendations">
                  <select className="w-48 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary transition-colors">
                    <option>Technology</option>
                    <option>Finance</option>
                    <option>Healthcare</option>
                    <option>Government</option>
                    <option>Retail</option>
                  </select>
                </SettingsRow>
                <SettingsRow label="Team Members" description="Users in your organization">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {['JD', 'SK', 'MP', 'AR', 'LK'].map((m) => (
                        <div key={m} className="flex size-7 items-center justify-center rounded-full border-2 border-card bg-zinc-700 text-[10px] font-bold text-white">
                          {m}
                        </div>
                      ))}
                    </div>
                    <button className="flex items-center gap-1 text-xs text-primary hover:underline">
                      <Plus className="size-3" /> Invite
                    </button>
                  </div>
                </SettingsRow>
              </div>
            </motion.div>
          )}

          {/* Theme */}
          {activeSection === 'theme' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
              <SectionHeader title="Appearance" desc="Customize the look and feel of Danix." />
              <div className="rounded-xl border border-border bg-card p-5 space-y-6">
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Theme</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'dark', label: 'Dark', icon: Moon },
                      { id: 'light', label: 'Light', icon: Sun },
                      { id: 'system', label: 'System', icon: Monitor },
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => setTheme(id)}
                        className={cn(
                          'flex flex-col items-center gap-2 rounded-xl border p-4 transition-all',
                          theme === id ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-zinc-600 hover:text-foreground'
                        )}
                      >
                        <Icon className="size-5" />
                        <span className="text-xs font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <SettingsRow label="Compact Density" description="Reduce spacing for more information density">
                  <Toggle enabled={false} onChange={() => {}} />
                </SettingsRow>
                <SettingsRow label="Animations" description="Enable smooth transitions and micro-interactions">
                  <Toggle enabled={true} onChange={() => {}} />
                </SettingsRow>
              </div>
            </motion.div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
              <SectionHeader title="Notifications" desc="Choose what you get notified about." />
              <div className="rounded-xl border border-border bg-card p-5 space-y-1">
                {[
                  { key: 'critical', label: 'Critical Findings', desc: 'Instant alert for critical severity findings' },
                  { key: 'high', label: 'High Severity Findings', desc: 'Notifications for high severity detections' },
                  { key: 'scanComplete', label: 'Scan Completed', desc: 'When a scan finishes running' },
                  { key: 'reportReady', label: 'Report Ready', desc: 'When an AI report is generated' },
                  { key: 'agentAlerts', label: 'Agent Warnings', desc: 'AI agent errors or warnings' },
                  { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Summary of the week\'s activity' },
                ].map(({ key, label, desc }) => (
                  <SettingsRow key={key} label={label} description={desc}>
                    <Toggle
                      enabled={notifications[key as keyof typeof notifications]}
                      onChange={() => setNotifications((n) => ({ ...n, [key]: !n[key as keyof typeof notifications] }))}
                    />
                  </SettingsRow>
                ))}
              </div>
            </motion.div>
          )}

          {/* API Keys */}
          {activeSection === 'api-keys' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <SectionHeader title="API Keys" desc="Manage integration keys for external services." />
              <div className="space-y-3">
                {API_KEYS.map((apiKey) => (
                  <div key={apiKey.id} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-foreground">{apiKey.name}</p>
                      <span className={cn('rounded-md border px-1.5 py-0.5 text-[10px] font-medium', apiKey.active ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-zinc-700/40 border-zinc-600/30 text-zinc-400')}>
                        {apiKey.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono text-muted-foreground">
                        {showKey[apiKey.id] ? 'sk-actual-key-would-show-here' : apiKey.value}
                      </code>
                      <button
                        onClick={() => setShowKey((s) => ({ ...s, [apiKey.id]: !s[apiKey.id] }))}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showKey[apiKey.id] ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <Copy className="size-4" />
                      </button>
                      <button className="text-muted-foreground hover:text-red-400 transition-colors">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="flex items-center gap-2 rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:border-zinc-500 transition-colors w-full justify-center">
                <Plus className="size-4" /> Add API Key
              </button>
            </motion.div>
          )}

          {/* LLM Provider */}
          {activeSection === 'llm' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
              <SectionHeader title="LLM Provider" desc="Choose and configure the AI language model backend." />
              <div className="space-y-3">
                {[
                  { id: 'openai', name: 'OpenAI GPT-4o', desc: 'Cloud-based, highest accuracy', badge: 'Recommended' },
                  { id: 'anthropic', name: 'Anthropic Claude 3.5', desc: 'Cloud-based, strong reasoning', badge: null },
                  { id: 'ollama', name: 'Ollama (Local)', desc: 'Self-hosted, private, offline-capable', badge: 'Privacy' },
                ].map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => setLlmProvider(provider.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all',
                      llmProvider === provider.id ? 'border-primary bg-primary/10' : 'border-border bg-card hover:border-zinc-600'
                    )}
                  >
                    <div className={cn('flex size-9 items-center justify-center rounded-lg', llmProvider === provider.id ? 'bg-primary/20' : 'bg-zinc-700/40')}>
                      <Brain className={cn('size-5', llmProvider === provider.id ? 'text-primary' : 'text-muted-foreground')} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className={cn('text-sm font-semibold', llmProvider === provider.id ? 'text-primary' : 'text-foreground')}>{provider.name}</p>
                        {provider.badge && (
                          <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">{provider.badge}</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{provider.desc}</p>
                    </div>
                    {llmProvider === provider.id && <CheckCircle2 className="size-4 text-primary" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Ollama */}
          {activeSection === 'ollama' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
              <SectionHeader title="Ollama Configuration" desc="Configure the local Ollama LLM server." />
              <div className="rounded-xl border border-border bg-card p-5 space-y-1">
                <SettingsRow label="Ollama Host URL" description="The endpoint where Ollama is running">
                  <input defaultValue="http://localhost:11434" className="w-56 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-mono text-foreground outline-none focus:border-primary transition-colors" />
                </SettingsRow>
                <SettingsRow label="Default Model" description="The model to use for AI analysis">
                  <select className="w-48 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary transition-colors">
                    <option>llama3.2:latest</option>
                    <option>mistral:7b</option>
                    <option>codellama:13b</option>
                    <option>deepseek-coder:6.7b</option>
                  </select>
                </SettingsRow>
                <SettingsRow label="Context Window" description="Maximum tokens per conversation">
                  <input defaultValue="8192" type="number" className="w-32 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary transition-colors" />
                </SettingsRow>
                <SettingsRow label="Keep Alive" description="Keep model loaded in memory">
                  <Toggle enabled={true} onChange={() => {}} />
                </SettingsRow>
                <div className="pt-2">
                  <button className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-zinc-600 transition-colors">
                    <RefreshCw className="size-3.5" /> Test Connection
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* System */}
          {activeSection === 'system' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <SectionHeader title="System" desc="Platform performance and resource monitoring." />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'CPU Usage', value: `${systemStatus.cpu}%`, color: 'text-primary', bar: systemStatus.cpu },
                  { label: 'RAM Usage', value: `${systemStatus.ram}%`, color: 'text-yellow-400', bar: systemStatus.ram },
                  { label: 'Knowledge Index', value: systemStatus.knowledgeIndex, color: 'text-green-400', bar: 98 },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                    <p className={cn('text-xl font-bold', s.color)}>{s.value}</p>
                    <div className="mt-2 h-1 rounded-full bg-zinc-800">
                      <div className={cn('h-1 rounded-full', s.color.replace('text-', 'bg-'))} style={{ width: `${s.bar}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-border bg-card p-5 space-y-1">
                <SettingsRow label="LLM Status" description="Language model API connection">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-green-400">
                    <span className="size-1.5 rounded-full bg-green-400" /> Online
                  </span>
                </SettingsRow>
                <SettingsRow label="Database" description="Primary data store">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-green-400">
                    <span className="size-1.5 rounded-full bg-green-400" /> Online
                  </span>
                </SettingsRow>
                <SettingsRow label="Background Jobs" description="Active processing workers">
                  <span className="text-sm font-semibold text-foreground">{systemStatus.backgroundJobs} active</span>
                </SettingsRow>
                <SettingsRow label="Agent Orchestrator" description="Multi-agent system coordinator">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-green-400">
                    <span className="size-1.5 rounded-full bg-green-400 animate-pulse" /> Running
                  </span>
                </SettingsRow>
              </div>
            </motion.div>
          )}

          {/* About */}
          {activeSection === 'about' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <SectionHeader title="About Danix" desc="Platform version and legal information." />
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-primary">
                    <Shield className="size-7 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">Danix</p>
                    <p className="text-xs text-muted-foreground">AI-Powered Autonomous Vulnerability Assessment & Penetration Testing Platform</p>
                  </div>
                </div>
                <div className="space-y-1">
                  {[
                    { label: 'Version', value: '2.4.1' },
                    { label: 'Build', value: '20250719-stable' },
                    { label: 'License', value: 'Enterprise' },
                    { label: 'AI Engine', value: 'GPT-4o + Local Agents' },
                    { label: 'Database', value: 'PostgreSQL 16' },
                    { label: 'Knowledge Base', value: '200K+ entries' },
                  ].map(({ label, value }) => (
                    <SettingsRow key={label} label={label}>
                      <span className="text-sm text-muted-foreground font-mono">{value}</span>
                    </SettingsRow>
                  ))}
                </div>
                <div className="mt-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3 flex items-start gap-2">
                  <AlertTriangle className="size-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-yellow-400 leading-relaxed">
                    Danix is designed exclusively for authorized security assessments on systems you own or have explicit written permission to test. Unauthorized use is prohibited.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Workspace */}
          {activeSection === 'workspace' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
              <SectionHeader title="Workspace" desc="Configure scan defaults, scheduling, and retention policies." />
              <div className="rounded-xl border border-border bg-card p-5 space-y-1">
                <SettingsRow label="Default Scan Depth" description="Number of recursive levels for web crawling">
                  <select className="w-40 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary transition-colors">
                    <option>3 (Recommended)</option>
                    <option>1 (Fast)</option>
                    <option>5 (Deep)</option>
                    <option>Unlimited</option>
                  </select>
                </SettingsRow>
                <SettingsRow label="Concurrent Scans" description="Maximum scans running simultaneously">
                  <input type="number" defaultValue="3" min="1" max="10" className="w-24 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary transition-colors" />
                </SettingsRow>
                <SettingsRow label="Finding Retention" description="How long to keep historical findings">
                  <select className="w-40 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary transition-colors">
                    <option>90 days</option>
                    <option>30 days</option>
                    <option>180 days</option>
                    <option>1 year</option>
                    <option>Forever</option>
                  </select>
                </SettingsRow>
                <SettingsRow label="Auto-Remediate Low Severity" description="Automatically apply safe fixes for low-risk findings">
                  <Toggle enabled={false} onChange={() => {}} />
                </SettingsRow>
                <SettingsRow label="Scheduled Scans" description="Run scans on a recurring schedule">
                  <Toggle enabled={true} onChange={() => {}} />
                </SettingsRow>
                <SettingsRow label="Schedule Interval" description="How often scheduled scans run">
                  <select className="w-40 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary transition-colors">
                    <option>Weekly</option>
                    <option>Daily</option>
                    <option>Monthly</option>
                  </select>
                </SettingsRow>
              </div>
              <div className="flex justify-end pt-2">
                <button onClick={save} className={cn('flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold transition-all', saved ? 'bg-green-500/20 text-green-400' : 'bg-primary text-white hover:bg-primary/90')}>
                  {saved && <CheckCircle2 className="size-4" />}
                  {saved ? 'Saved!' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          )}

          {/* AI Preferences */}
          {activeSection === 'ai-prefs' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
              <SectionHeader title="AI Preferences" desc="Fine-tune how the AI agents reason, communicate, and escalate." />
              <div className="rounded-xl border border-border bg-card p-5 space-y-1">
                <SettingsRow label="Response Verbosity" description="How detailed the AI explanations should be">
                  <select className="w-40 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary transition-colors">
                    <option>Detailed</option>
                    <option>Concise</option>
                    <option>Executive</option>
                  </select>
                </SettingsRow>
                <SettingsRow label="Auto-Triage Findings" description="AI automatically assigns severity and priority">
                  <Toggle enabled={true} onChange={() => {}} />
                </SettingsRow>
                <SettingsRow label="AI-Generated Remediation" description="Generate step-by-step fix instructions">
                  <Toggle enabled={true} onChange={() => {}} />
                </SettingsRow>
                <SettingsRow label="Proactive Recommendations" description="AI surfaces unprompted security suggestions">
                  <Toggle enabled={true} onChange={() => {}} />
                </SettingsRow>
                <SettingsRow label="AI Thought Streaming" description="Show AI reasoning steps in real time during scans">
                  <Toggle enabled={true} onChange={() => {}} />
                </SettingsRow>
                <SettingsRow label="Confidence Threshold" description="Minimum AI confidence to surface a finding">
                  <div className="flex items-center gap-2">
                    <input type="range" min="50" max="99" defaultValue="75" className="w-28 accent-primary" />
                    <span className="text-xs font-mono text-muted-foreground w-8">75%</span>
                  </div>
                </SettingsRow>
                <SettingsRow label="Max Tool Calls per Scan" description="Limit tool invocations per agent run">
                  <input type="number" defaultValue="50" className="w-24 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary transition-colors" />
                </SettingsRow>
              </div>
              <div className="flex justify-end pt-2">
                <button onClick={save} className={cn('flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold transition-all', saved ? 'bg-green-500/20 text-green-400' : 'bg-primary text-white hover:bg-primary/90')}>
                  {saved && <CheckCircle2 className="size-4" />}
                  {saved ? 'Saved!' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          )}

          {/* Knowledge Sources */}
          {activeSection === 'knowledge' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <SectionHeader title="Knowledge Sources" desc="Manage external CVE feeds, threat intel, and custom knowledge bases." />
              <div className="space-y-3">
                {[
                  { name: 'NVD CVE Feed', status: 'active', lastSync: '2 hours ago', desc: 'National Vulnerability Database' },
                  { name: 'MITRE ATT&CK', status: 'active', lastSync: '1 day ago', desc: 'Adversarial tactics and techniques' },
                  { name: 'OWASP Top 10', status: 'active', lastSync: '7 days ago', desc: 'Web application security risks' },
                  { name: 'ExploitDB', status: 'inactive', lastSync: 'Never', desc: 'Public exploit archive' },
                  { name: 'Custom Knowledge Base', status: 'active', lastSync: '30 min ago', desc: '847 custom entries' },
                ].map((source) => (
                  <div key={source.name} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{source.name}</p>
                      <p className="text-xs text-muted-foreground">{source.desc} · Last sync: {source.lastSync}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="text-xs text-primary hover:underline flex items-center gap-1">
                        <RefreshCw className="size-3" /> Sync
                      </button>
                      <Toggle enabled={source.status === 'active'} onChange={() => {}} />
                    </div>
                  </div>
                ))}
              </div>
              <button className="flex items-center gap-2 rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:border-zinc-500 transition-colors w-full justify-center">
                <Plus className="size-4" /> Add Knowledge Source
              </button>
            </motion.div>
          )}

          {/* Plugins */}
          {activeSection === 'plugins' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <SectionHeader title="Plugins" desc="Extend Danix with community and enterprise plugins." />
              <div className="space-y-3">
                {[
                  { name: 'Jira Integration', version: '1.3.0', status: true, desc: 'Auto-create Jira tickets from findings' },
                  { name: 'Slack Alerts', version: '2.1.1', status: true, desc: 'Send real-time alerts to Slack channels' },
                  { name: 'GitHub Actions', version: '1.0.4', status: false, desc: 'Trigger scans from CI/CD pipelines' },
                  { name: 'PagerDuty', version: '1.1.0', status: false, desc: 'Escalate critical findings to on-call teams' },
                  { name: 'PDF Report Builder', version: '3.0.2', status: true, desc: 'Generate branded PDF security reports' },
                ].map((plugin) => (
                  <div key={plugin.name} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                    <div className="flex items-center gap-3">
                      <div className={cn('flex size-9 items-center justify-center rounded-lg', plugin.status ? 'bg-primary/10' : 'bg-zinc-800')}>
                        <Settings2 className={cn('size-4', plugin.status ? 'text-primary' : 'text-zinc-500')} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">{plugin.name}</p>
                          <span className="text-[10px] font-mono text-muted-foreground">v{plugin.version}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{plugin.desc}</p>
                      </div>
                    </div>
                    <Toggle enabled={plugin.status} onChange={() => {}} />
                  </div>
                ))}
              </div>
              <button className="flex items-center gap-2 rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:border-zinc-500 transition-colors w-full justify-center">
                <Plus className="size-4" /> Browse Plugin Marketplace
              </button>
            </motion.div>
          )}

          {/* Database */}
          {activeSection === 'database' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <SectionHeader title="Database" desc="Connection details and data management." />
              <div className="rounded-xl border border-border bg-card p-5 space-y-1">
                <SettingsRow label="Host" description="Database server address">
                  <code className="text-xs font-mono text-muted-foreground bg-zinc-800 px-2 py-1 rounded">db.danix.internal</code>
                </SettingsRow>
                <SettingsRow label="Port" description="Connection port">
                  <code className="text-xs font-mono text-muted-foreground bg-zinc-800 px-2 py-1 rounded">5432</code>
                </SettingsRow>
                <SettingsRow label="Database Name">
                  <code className="text-xs font-mono text-muted-foreground bg-zinc-800 px-2 py-1 rounded">danix_prod</code>
                </SettingsRow>
                <SettingsRow label="Status" description="Current connection health">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-green-400">
                    <span className="size-1.5 rounded-full bg-green-400 animate-pulse" /> Connected
                  </span>
                </SettingsRow>
                <SettingsRow label="Storage Used" description="Total database size">
                  <span className="text-sm font-semibold text-foreground">4.2 GB / 20 GB</span>
                </SettingsRow>
                <SettingsRow label="Total Records" description="Findings, scans, and assets combined">
                  <span className="text-sm font-semibold text-foreground">2,847,312</span>
                </SettingsRow>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-zinc-500 transition-colors">
                  <RefreshCw className="size-3.5" /> Test Connection
                </button>
                <button className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                  <Trash2 className="size-3.5" /> Purge Old Data
                </button>
              </div>
            </motion.div>
          )}

          {/* Logs */}
          {activeSection === 'logs' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <SectionHeader title="System Logs" desc="Real-time application and agent activity logs." />
              <div className="flex items-center gap-2">
                <select className="rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground outline-none focus:border-primary transition-colors">
                  <option>All Levels</option>
                  <option>INFO</option>
                  <option>WARN</option>
                  <option>ERROR</option>
                  <option>DEBUG</option>
                </select>
                <select className="rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground outline-none focus:border-primary transition-colors">
                  <option>All Services</option>
                  <option>Scanner</option>
                  <option>AI Agent</option>
                  <option>Database</option>
                  <option>API</option>
                </select>
                <button className="ml-auto flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <RefreshCw className="size-3" /> Refresh
                </button>
              </div>
              <div className="rounded-xl border border-border bg-zinc-950 p-4 font-mono text-xs space-y-1.5 max-h-96 overflow-y-auto">
                {[
                  { level: 'INFO', time: '10:32:44', svc: 'scanner', msg: 'Scan job 8fc3a started for acme.com' },
                  { level: 'INFO', time: '10:32:45', svc: 'agent', msg: 'Recon agent initialized, task queue depth: 4' },
                  { level: 'WARN', time: '10:32:50', svc: 'scanner', msg: 'Rate limit detected on port 443, backing off 2s' },
                  { level: 'INFO', time: '10:32:52', svc: 'agent', msg: 'SQL injection vector identified in /login endpoint' },
                  { level: 'ERROR', time: '10:32:58', svc: 'api', msg: 'VirusTotal API key quota exceeded, skipping enrichment' },
                  { level: 'INFO', time: '10:33:01', svc: 'db', msg: 'Inserted 14 new findings, batch commit OK' },
                  { level: 'INFO', time: '10:33:05', svc: 'agent', msg: 'MITRE mapping complete: T1190, T1078, T1133' },
                  { level: 'WARN', time: '10:33:10', svc: 'llm', msg: 'Token usage at 82% of context window, compressing history' },
                  { level: 'INFO', time: '10:33:14', svc: 'scanner', msg: 'Subdomain enumeration complete: 8 new subdomains found' },
                  { level: 'INFO', time: '10:33:22', svc: 'agent', msg: 'Risk score computed: 87/100 (Critical)' },
                ].map((log, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-zinc-600 flex-shrink-0">{log.time}</span>
                    <span className={cn('w-12 flex-shrink-0 font-semibold text-center',
                      log.level === 'ERROR' ? 'text-red-400' :
                      log.level === 'WARN' ? 'text-yellow-400' :
                      log.level === 'INFO' ? 'text-blue-400' : 'text-muted-foreground'
                    )}>{log.level}</span>
                    <span className="text-zinc-500 w-16 flex-shrink-0">[{log.svc}]</span>
                    <span className="text-zinc-300">{log.msg}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

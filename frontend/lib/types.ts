export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info'
export type Status = 'active' | 'completed' | 'paused' | 'archived' | 'queued' | 'running'
export type ScanProfile = 'quick' | 'normal' | 'deep'

export interface Project {
  id: string
  name: string
  client: string
  description: string
  riskScore: number
  assets: number
  members: string[]
  status: 'active' | 'completed' | 'paused' | 'archived'
  progress: number
  createdAt: string
  updatedAt: string
  findings: { critical: number; high: number; medium: number; low: number }
  tags: string[]
}

export interface Asset {
  id: string
  hostname: string
  ip: string
  domain: string | null
  cloud: string | null
  os: string | null
  owner: string
  environment: string
  status: string
  risk: string
  lastScan: string
  tags: string[]
}

export interface Finding {
  id: string
  severity: Severity
  title: string
  category: string
  evidence: string
  confidence: number
  asset: string
  status: 'open' | 'in-progress' | 'remediated' | 'accepted'
  assignedTo: string | null
  cve: string | null
  cwe: string | null
  cvss: number
  owasp: string | null
  mitre: string | null
  project: string
}

export interface Scan {
  id: string
  name: string
  target: string
  targetType: 'domain' | 'ip' | 'cidr'
  profile: ScanProfile
  status: 'queued' | 'running' | 'completed' | 'paused' | 'failed'
  progress: number
  duration: string | null
  findings: number
  assets: number
  startedAt: string | null
  completedAt: string | null
  project: string
}

export interface NavItem {
  href: string
  label: string
  icon: string
  badge?: number | string
}

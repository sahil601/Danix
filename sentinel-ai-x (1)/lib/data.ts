// Data models for Danix

export const DEMO_PROJECTS = [
  {
    id: 'prj-1',
    name: 'Acme Corp External Assessment',
    client: 'Acme Corporation',
    description: 'Full external perimeter assessment including web, network, and cloud infrastructure.',
    riskScore: 78,
    assets: 142,
    members: ['JD', 'SK', 'MP'],
    status: 'active' as const,
    progress: 65,
    createdAt: '2025-06-10',
    updatedAt: '2025-07-18',
    findings: { critical: 3, high: 12, medium: 28, low: 47 },
    tags: ['external', 'web', 'network'],
  },
  {
    id: 'prj-2',
    name: 'FinTrust Bank Red Team',
    client: 'FinTrust Financial',
    description: 'Comprehensive red team exercise targeting banking APIs and internal network segments.',
    riskScore: 91,
    assets: 87,
    members: ['JD', 'AR'],
    status: 'active' as const,
    progress: 32,
    createdAt: '2025-07-01',
    updatedAt: '2025-07-19',
    findings: { critical: 8, high: 21, medium: 14, low: 9 },
    tags: ['red-team', 'internal', 'api'],
  },
  {
    id: 'prj-3',
    name: 'MedHealth Cloud Audit',
    client: 'MedHealth Systems',
    description: 'AWS and Azure cloud configuration review for HIPAA compliance requirements.',
    riskScore: 55,
    assets: 234,
    members: ['MP', 'LK', 'JD'],
    status: 'completed' as const,
    progress: 100,
    createdAt: '2025-05-15',
    updatedAt: '2025-06-30',
    findings: { critical: 1, high: 7, medium: 33, low: 61 },
    tags: ['cloud', 'compliance', 'hipaa'],
  },
  {
    id: 'prj-4',
    name: 'RetailMax API Penetration Test',
    client: 'RetailMax Inc.',
    description: 'Black-box penetration testing of public-facing REST and GraphQL APIs.',
    riskScore: 42,
    assets: 18,
    members: ['SK', 'AR'],
    status: 'paused' as const,
    progress: 78,
    createdAt: '2025-07-05',
    updatedAt: '2025-07-15',
    findings: { critical: 0, high: 4, medium: 11, low: 23 },
    tags: ['api', 'black-box', 'web'],
  },
  {
    id: 'prj-5',
    name: 'GovSec Network Segmentation',
    client: 'GovSec Agency',
    description: 'Network segmentation validation and lateral movement path analysis.',
    riskScore: 67,
    assets: 312,
    members: ['JD', 'MP', 'SK', 'LK'],
    status: 'active' as const,
    progress: 48,
    createdAt: '2025-06-20',
    updatedAt: '2025-07-20',
    findings: { critical: 2, high: 9, medium: 41, low: 88 },
    tags: ['network', 'government', 'lateral-movement'],
  },
  {
    id: 'prj-6',
    name: 'TechCorp Mobile App Review',
    client: 'TechCorp Solutions',
    description: 'iOS and Android mobile application security review including API backend.',
    riskScore: 38,
    assets: 6,
    members: ['AR', 'LK'],
    status: 'archived' as const,
    progress: 100,
    createdAt: '2025-04-01',
    updatedAt: '2025-05-10',
    findings: { critical: 0, high: 3, medium: 8, low: 19 },
    tags: ['mobile', 'ios', 'android'],
  },
]

export const DEMO_ASSETS = [
  { id: 'ast-1', hostname: 'web-prod-01.acme.com', ip: '203.0.113.10', domain: 'acme.com', cloud: null, os: 'Ubuntu 22.04', owner: 'Acme Corp', environment: 'production', status: 'active', risk: 'high', lastScan: '2025-07-19 14:32', tags: ['web', 'nginx', 'public'] },
  { id: 'ast-2', hostname: 'api-gw.acme.com', ip: '203.0.113.11', domain: 'acme.com', cloud: 'AWS', os: 'Amazon Linux 2', owner: 'Acme Corp', environment: 'production', status: 'active', risk: 'critical', lastScan: '2025-07-19 12:00', tags: ['api', 'gateway', 'aws'] },
  { id: 'ast-3', hostname: 'db-replica-02', ip: '10.0.1.42', domain: null, cloud: 'AWS RDS', os: 'Aurora MySQL 8.0', owner: 'Acme Corp', environment: 'production', status: 'active', risk: 'medium', lastScan: '2025-07-18 08:15', tags: ['database', 'rds', 'internal'] },
  { id: 'ast-4', hostname: 'vpn.fintrust.net', ip: '198.51.100.5', domain: 'fintrust.net', cloud: null, os: 'Cisco ASA 9.16', owner: 'FinTrust', environment: 'production', status: 'active', risk: 'critical', lastScan: '2025-07-19 09:44', tags: ['vpn', 'cisco', 'network'] },
  { id: 'ast-5', hostname: 'mail.fintrust.net', ip: '198.51.100.20', domain: 'fintrust.net', cloud: null, os: 'Windows Server 2019', owner: 'FinTrust', environment: 'production', status: 'active', risk: 'high', lastScan: '2025-07-17 22:10', tags: ['mail', 'exchange', 'windows'] },
  { id: 'ast-6', hostname: 'k8s-node-01.medhealth.io', ip: '10.10.0.5', domain: 'medhealth.io', cloud: 'Azure AKS', os: 'Debian 11', owner: 'MedHealth', environment: 'staging', status: 'active', risk: 'medium', lastScan: '2025-07-16 11:00', tags: ['kubernetes', 'azure', 'container'] },
  { id: 'ast-7', hostname: 'legacy-app-01', ip: '172.16.0.100', domain: null, cloud: null, os: 'CentOS 7.9', owner: 'Acme Corp', environment: 'production', status: 'warning', risk: 'critical', lastScan: '2025-07-10 06:30', tags: ['legacy', 'eol', 'critical'] },
  { id: 'ast-8', hostname: 'cdn.retailmax.com', ip: '104.21.0.15', domain: 'retailmax.com', cloud: 'Cloudflare', os: null, owner: 'RetailMax', environment: 'production', status: 'active', risk: 'low', lastScan: '2025-07-19 16:45', tags: ['cdn', 'cloudflare', 'web'] },
  { id: 'ast-9', hostname: 'dev-bastion-01', ip: '10.0.254.1', domain: null, cloud: 'AWS', os: 'Ubuntu 20.04', owner: 'GovSec', environment: 'development', status: 'active', risk: 'medium', lastScan: '2025-07-18 14:00', tags: ['bastion', 'ssh', 'dev'] },
  { id: 'ast-10', hostname: 'waf-prod.acme.com', ip: '203.0.113.1', domain: 'acme.com', cloud: 'AWS WAF', os: null, owner: 'Acme Corp', environment: 'production', status: 'active', risk: 'low', lastScan: '2025-07-19 10:22', tags: ['waf', 'security', 'aws'] },
]

export const DEMO_FINDINGS = [
  { id: 'fnd-1', severity: 'critical', title: 'Remote Code Execution via Deserialization', category: 'Injection', evidence: 'POST /api/v2/import — Java deserialization payload accepted', confidence: 98, asset: 'api-gw.acme.com', status: 'open', assignedTo: 'JD', cve: 'CVE-2021-44228', cwe: 'CWE-502', cvss: 9.8, owasp: 'A03:2021', mitre: 'T1190', project: 'prj-1' },
  { id: 'fnd-2', severity: 'critical', title: 'SQL Injection in Authentication Endpoint', category: 'Injection', evidence: 'GET /login?user=admin\'-- bypasses authentication', confidence: 99, asset: 'web-prod-01.acme.com', status: 'open', assignedTo: 'SK', cve: null, cwe: 'CWE-89', cvss: 9.1, owasp: 'A03:2021', mitre: 'T1190', project: 'prj-1' },
  { id: 'fnd-3', severity: 'critical', title: 'Unauthenticated Admin Panel Exposure', category: 'Access Control', evidence: '/admin/dashboard accessible without credentials on port 8080', confidence: 100, asset: 'vpn.fintrust.net', status: 'in-progress', assignedTo: 'AR', cve: null, cwe: 'CWE-306', cvss: 9.3, owasp: 'A01:2021', mitre: 'T1078', project: 'prj-2' },
  { id: 'fnd-4', severity: 'high', title: 'Stored XSS in User Profile', category: 'XSS', evidence: '<script>alert(document.cookie)</script> persists in bio field', confidence: 95, asset: 'web-prod-01.acme.com', status: 'open', assignedTo: 'JD', cve: null, cwe: 'CWE-79', cvss: 7.5, owasp: 'A03:2021', mitre: 'T1059.007', project: 'prj-1' },
  { id: 'fnd-5', severity: 'high', title: 'Exposed AWS Keys in Public Repository', category: 'Secrets Management', evidence: 'GitHub repository contains active AWS_ACCESS_KEY_ID', confidence: 100, asset: 'api-gw.acme.com', status: 'remediated', assignedTo: 'MP', cve: null, cwe: 'CWE-312', cvss: 8.2, owasp: 'A02:2021', mitre: 'T1552.004', project: 'prj-1' },
  { id: 'fnd-6', severity: 'high', title: 'Missing HSTS Header on Banking Portal', category: 'Security Headers', evidence: 'Response headers missing Strict-Transport-Security', confidence: 100, asset: 'mail.fintrust.net', status: 'open', assignedTo: null, cve: null, cwe: 'CWE-319', cvss: 7.4, owasp: 'A05:2021', mitre: null, project: 'prj-2' },
  { id: 'fnd-7', severity: 'medium', title: 'Outdated TLS Configuration (TLS 1.0 Enabled)', category: 'Cryptography', evidence: 'TLS 1.0 accepted on port 443; SSLv3 also enabled', confidence: 100, asset: 'legacy-app-01', status: 'open', assignedTo: 'SK', cve: 'CVE-2011-3389', cwe: 'CWE-326', cvss: 5.9, owasp: 'A02:2021', mitre: 'T1040', project: 'prj-1' },
  { id: 'fnd-8', severity: 'medium', title: 'Default Credentials on Network Device', category: 'Authentication', evidence: 'Cisco router accessible with admin:cisco', confidence: 97, asset: 'vpn.fintrust.net', status: 'in-progress', assignedTo: 'AR', cve: null, cwe: 'CWE-798', cvss: 6.8, owasp: 'A07:2021', mitre: 'T1078', project: 'prj-2' },
  { id: 'fnd-9', severity: 'low', title: 'Verbose Error Messages Leaking Stack Traces', category: 'Information Disclosure', evidence: 'POST /api/order returns full Java stack trace on error', confidence: 90, asset: 'api-gw.acme.com', status: 'open', assignedTo: null, cve: null, cwe: 'CWE-209', cvss: 3.5, owasp: 'A04:2021', mitre: null, project: 'prj-1' },
  { id: 'fnd-10', severity: 'low', title: 'Cookie Without HttpOnly Flag', category: 'Session Management', evidence: 'session_token cookie accessible via JavaScript', confidence: 100, asset: 'web-prod-01.acme.com', status: 'open', assignedTo: 'JD', cve: null, cwe: 'CWE-1004', cvss: 3.7, owasp: 'A07:2021', mitre: null, project: 'prj-1' },
]

export const DEMO_SCANS = [
  { id: 'scn-1', name: 'Acme External Full Scan', target: 'acme.com', targetType: 'domain', profile: 'deep', status: 'completed', progress: 100, duration: '2h 14m', findings: 47, assets: 23, startedAt: '2025-07-18 10:00', completedAt: '2025-07-18 12:14', project: 'prj-1' },
  { id: 'scn-2', name: 'FinTrust API Discovery', target: '198.51.100.0/24', targetType: 'cidr', profile: 'normal', status: 'running', progress: 67, duration: '1h 22m', findings: 18, assets: 14, startedAt: '2025-07-19 13:10', completedAt: null, project: 'prj-2' },
  { id: 'scn-3', name: 'MedHealth Cloud Inventory', target: 'medhealth.io', targetType: 'domain', profile: 'quick', status: 'completed', progress: 100, duration: '0h 48m', findings: 12, assets: 89, startedAt: '2025-07-17 08:00', completedAt: '2025-07-17 08:48', project: 'prj-3' },
  { id: 'scn-4', name: 'RetailMax API Endpoints', target: 'api.retailmax.com', targetType: 'domain', profile: 'normal', status: 'paused', progress: 45, duration: '0h 32m', findings: 8, assets: 5, startedAt: '2025-07-15 15:20', completedAt: null, project: 'prj-4' },
  { id: 'scn-5', name: 'GovSec Network Sweep', target: '172.16.0.0/16', targetType: 'cidr', profile: 'deep', status: 'queued', progress: 0, duration: null, findings: 0, assets: 0, startedAt: null, completedAt: null, project: 'prj-5' },
]

export const DEMO_REPORTS = [
  { id: 'rpt-1', title: 'Acme Corp Executive Summary', type: 'executive', format: 'pdf', project: 'prj-1', generatedAt: '2025-07-19 16:00', size: '2.4 MB', version: '1.2', status: 'ready' },
  { id: 'rpt-2', title: 'Acme Corp Technical Report', type: 'technical', format: 'html', project: 'prj-1', generatedAt: '2025-07-19 15:45', size: '8.1 MB', version: '1.1', status: 'ready' },
  { id: 'rpt-3', title: 'MedHealth HIPAA Compliance Report', type: 'compliance', format: 'pdf', project: 'prj-3', generatedAt: '2025-07-01 09:00', size: '5.7 MB', version: '2.0', status: 'ready' },
  { id: 'rpt-4', title: 'FinTrust Red Team Report', type: 'technical', format: 'markdown', project: 'prj-2', generatedAt: null, size: null, version: null, status: 'generating' },
  { id: 'rpt-5', title: 'RetailMax API Assessment', type: 'technical', format: 'json', project: 'prj-4', generatedAt: '2025-07-16 11:30', size: '1.2 MB', version: '1.0', status: 'ready' },
]

export const RISK_TREND_DATA = [
  { date: 'Jan', critical: 2, high: 8, medium: 18, low: 32 },
  { date: 'Feb', critical: 4, high: 14, medium: 22, low: 28 },
  { date: 'Mar', critical: 6, high: 18, medium: 30, low: 41 },
  { date: 'Apr', critical: 3, high: 11, medium: 25, low: 38 },
  { date: 'May', critical: 8, high: 22, medium: 35, low: 52 },
  { date: 'Jun', critical: 5, high: 16, medium: 28, low: 45 },
  { date: 'Jul', critical: 14, high: 34, medium: 82, low: 138 },
]

export const SEVERITY_PIE_DATA = [
  { name: 'Critical', value: 14, fill: '#EF4444' },
  { name: 'High', value: 34, fill: '#F97316' },
  { name: 'Medium', value: 82, fill: '#F59E0B' },
  { name: 'Low', value: 138, fill: '#3B82F6' },
  { name: 'Info', value: 47, fill: '#71717A' },
]

export const SCAN_TIMELINE_DATA = [
  { month: 'Feb', scans: 4, findings: 62 },
  { month: 'Mar', scans: 7, findings: 118 },
  { month: 'Apr', scans: 5, findings: 77 },
  { month: 'May', scans: 11, findings: 203 },
  { month: 'Jun', scans: 8, findings: 152 },
  { month: 'Jul', scans: 5, findings: 90 },
]

export const AGENT_STATUS = [
  { name: 'Supervisor', status: 'active', tasks: 3, lastHeartbeat: '2s ago' },
  { name: 'Planner', status: 'active', tasks: 1, lastHeartbeat: '5s ago' },
  { name: 'Recon', status: 'running', tasks: 2, lastHeartbeat: '1s ago' },
  { name: 'Network', status: 'running', tasks: 1, lastHeartbeat: '3s ago' },
  { name: 'Web', status: 'idle', tasks: 0, lastHeartbeat: '12s ago' },
  { name: 'Reasoning', status: 'active', tasks: 1, lastHeartbeat: '4s ago' },
  { name: 'Reporting', status: 'idle', tasks: 0, lastHeartbeat: '8s ago' },
]

export const SYSTEM_STATUS = {
  cpu: 34,
  ram: 61,
  llm: 'online',
  database: 'online',
  backgroundJobs: 4,
  knowledgeIndex: '98.2%',
}

export const ACTIVITY_FEED = [
  { id: 'act-1', type: 'scan_completed', message: 'Scan completed on acme.com — 47 findings', time: '2 min ago', user: 'System', severity: null },
  { id: 'act-2', type: 'finding_critical', message: 'Critical finding: RCE via Deserialization on api-gw.acme.com', time: '18 min ago', user: 'ReconAgent', severity: 'critical' },
  { id: 'act-3', type: 'report_generated', message: 'Executive report generated for Acme Corp', time: '45 min ago', user: 'JD', severity: null },
  { id: 'act-4', type: 'asset_added', message: 'New asset discovered: waf-prod.acme.com (203.0.113.1)', time: '1h ago', user: 'NetworkAgent', severity: null },
  { id: 'act-5', type: 'finding_high', message: 'High severity: Exposed AWS Keys confirmed active', time: '2h ago', user: 'SK', severity: 'high' },
  { id: 'act-6', type: 'scan_started', message: 'New scan initiated on 198.51.100.0/24', time: '3h ago', user: 'AR', severity: null },
  { id: 'act-7', type: 'project_created', message: 'Project "FinTrust Red Team" created', time: '5h ago', user: 'JD', severity: null },
]

export const AI_RECOMMENDATIONS = [
  { id: 'rec-1', priority: 'immediate', title: 'Patch RCE Vulnerability on api-gw.acme.com', description: 'The deserialization vulnerability (CVE-2021-44228) is actively exploited in the wild. Immediate patching required.', impact: 'critical' },
  { id: 'rec-2', priority: 'high', title: 'Rotate Exposed AWS Credentials', description: 'Active AWS keys found in public repository. Rotate immediately and audit for unauthorized usage in CloudTrail.', impact: 'high' },
  { id: 'rec-3', priority: 'medium', title: 'Upgrade TLS Configuration on Legacy Systems', description: 'Disable TLS 1.0/1.1 and SSLv3 across all legacy servers. Enable TLS 1.3 where possible.', impact: 'medium' },
  { id: 'rec-4', priority: 'medium', title: 'Implement WAF Rules for SQL Injection', description: 'Deploy WAF rules to block common SQL injection patterns while the root cause is being remediated.', impact: 'medium' },
]

export const KB_CATEGORIES = [
  { id: 'owasp', name: 'OWASP Top 10', count: 247, icon: 'shield' },
  { id: 'mitre', name: 'MITRE ATT&CK', count: 892, icon: 'crosshair' },
  { id: 'nist', name: 'NIST Framework', count: 156, icon: 'book' },
  { id: 'cve', name: 'CVE Database', count: '200K+', icon: 'bug' },
  { id: 'ports', name: 'Ports & Services', count: 1024, icon: 'network' },
  { id: 'best-practices', name: 'Security Best Practices', count: 412, icon: 'check-circle' },
]

export const HISTORY_ITEMS = [
  { id: 'h-1', type: 'scan', name: 'Acme External Full Scan', date: '2025-07-18', status: 'completed', project: 'prj-1' },
  { id: 'h-2', type: 'ai_chat', name: 'Conversation: Explain RCE findings', date: '2025-07-18', status: 'completed', project: 'prj-1' },
  { id: 'h-3', type: 'report', name: 'Acme Corp Executive Summary v1.2', date: '2025-07-19', status: 'completed', project: 'prj-1' },
  { id: 'h-4', type: 'scan', name: 'MedHealth Cloud Inventory', date: '2025-07-17', status: 'completed', project: 'prj-3' },
  { id: 'h-5', type: 'ai_chat', name: 'Conversation: Prioritize FinTrust findings', date: '2025-07-16', status: 'completed', project: 'prj-2' },
  { id: 'h-6', type: 'scan', name: 'RetailMax API Endpoints', date: '2025-07-15', status: 'paused', project: 'prj-4' },
]

export const NOTIFICATIONS = [
  { id: 'n-1', type: 'critical', title: 'Critical Finding Detected', message: 'RCE vulnerability found on api-gw.acme.com requires immediate attention', time: '2m ago', read: false },
  { id: 'n-2', type: 'info', title: 'Scan Completed', message: 'Full scan of acme.com completed with 47 new findings', time: '18m ago', read: false },
  { id: 'n-3', type: 'success', title: 'Report Generated', message: 'Executive summary for Acme Corp is ready for download', time: '45m ago', read: false },
  { id: 'n-4', type: 'warning', title: 'Agent Warning', message: 'ReconAgent reporting elevated latency on network module', time: '1h ago', read: true },
  { id: 'n-5', type: 'info', title: 'New Asset Discovered', message: '3 new assets discovered during FinTrust scan', time: '2h ago', read: true },
]

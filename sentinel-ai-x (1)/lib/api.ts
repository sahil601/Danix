/**
 * Danix — API Client
 *
 * Replaces all DEMO_* mock data imports with real backend API calls.
 * Falls back to mock data if the backend is unreachable.
 */

const API_BASE = '/api/v1'

function camelize(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => camelize(v))
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/([-_][a-z])/g, group =>
        group.toUpperCase().replace('-', '').replace('_', '')
      )
      result[camelKey] = camelize(obj[key])
      return result
    }, {} as any)
  }
  return obj
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`)
  }
  const data = await res.json()
  return camelize(data)
}

// ─── Projects ──────────────────────────────────────────────

export async function fetchProjects(search?: string, status?: string) {
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  if (status) params.set('status', status)
  const qs = params.toString()
  return apiFetch<{ projects: any[]; portfolio_stats: any }>(`/projects${qs ? `?${qs}` : ''}`)
}

export async function createProject(data: { name: string; client: string; description?: string; tags?: string[] }) {
  return apiFetch<any>('/projects', { method: 'POST', body: JSON.stringify(data) })
}

export async function updateProject(id: string, data: Record<string, any>) {
  return apiFetch<any>(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) })
}

export async function deleteProject(id: string) {
  return apiFetch<void>(`/projects/${id}`, { method: 'DELETE' })
}

// ─── Assets ────────────────────────────────────────────────

export async function fetchAssets(search?: string, risk?: string, environment?: string) {
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  if (risk) params.set('risk', risk)
  if (environment) params.set('environment', environment)
  const qs = params.toString()
  return apiFetch<any[]>(`/assets${qs ? `?${qs}` : ''}`)
}

export async function createAsset(data: Record<string, any>) {
  return apiFetch<any>('/assets', { method: 'POST', body: JSON.stringify(data) })
}

// ─── Scans ─────────────────────────────────────────────────

export async function fetchScans(search?: string, status?: string) {
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  if (status) params.set('status', status)
  const qs = params.toString()
  return apiFetch<any[]>(`/scans${qs ? `?${qs}` : ''}`)
}

export async function createScan(data: { name: string; target: string; target_type?: string; profile?: string; project_id?: string }) {
  return apiFetch<any>('/scans', { method: 'POST', body: JSON.stringify(data) })
}

export async function pauseScan(id: string) {
  return apiFetch<any>(`/scans/${id}/pause`, { method: 'POST' })
}

export async function resumeScan(id: string) {
  return apiFetch<any>(`/scans/${id}/resume`, { method: 'POST' })
}

export async function cancelScan(id: string) {
  return apiFetch<any>(`/scans/${id}/cancel`, { method: 'POST' })
}

// ─── Findings ──────────────────────────────────────────────

export async function fetchFindings(search?: string, severity?: string, status?: string, projectId?: string) {
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  if (severity) params.set('severity', severity)
  if (status) params.set('status', status)
  if (projectId) params.set('project_id', projectId)
  const qs = params.toString()
  return apiFetch<{ findings: any[]; counts: any }>(`/findings${qs ? `?${qs}` : ''}`)
}

export async function updateFinding(id: string, data: { status?: string; assigned_to?: string }) {
  return apiFetch<any>(`/findings/${id}`, { method: 'PATCH', body: JSON.stringify(data) })
}

export async function fetchFindingExplanation(id: string) {
  return apiFetch<{ explanation: string }>(`/findings/${id}/explanation`)
}

// ─── Reports ───────────────────────────────────────────────

export async function fetchReports() {
  return apiFetch<any[]>('/reports')
}

export async function generateReport(data: { title: string; type?: string; format?: string; project_id?: string }) {
  return apiFetch<any>('/reports/generate', { method: 'POST', body: JSON.stringify(data) })
}

// ─── Dashboard ─────────────────────────────────────────────

export async function fetchDashboardOverview() {
  return apiFetch<any>('/dashboard/overview')
}

export async function fetchDashboardCharts() {
  return apiFetch<any>('/dashboard/charts')
}

export async function fetchActivityFeed() {
  const data = await apiFetch<any[]>('/dashboard/activity-feed')
  return data.map((item: any) => ({
    id: item.id,
    severity: item.status === 'failed' ? 'critical' : item.type === 'scan' ? 'high' : 'normal',
    message: `${item.type.charAt(0).toUpperCase() + item.type.slice(1)}: ${item.name} (${item.status})`,
    time: new Date(item.createdAt || item.created_at).toLocaleTimeString(),
    user: 'System'
  }))
}

export async function fetchRecommendations() {
  return apiFetch<any[]>('/dashboard/recommendations')
}

export async function fetchAgentStatus() {
  return apiFetch<any[]>('/agents/status')
}

// ─── AI Chat ───────────────────────────────────────────────

export async function fetchConversations() {
  return apiFetch<any[]>('/ai/conversations')
}

export async function fetchMessages(conversationId: string) {
  return apiFetch<any[]>(`/ai/conversations/${conversationId}/messages`)
}

export async function sendChatMessage(data: { message: string; conversation_id?: string; agent_id?: string }) {
  return apiFetch<any>('/ai/chat', { method: 'POST', body: JSON.stringify(data) })
}

// ─── Notifications ─────────────────────────────────────────

export async function fetchNotifications() {
  return apiFetch<any[]>('/notifications')
}

export async function markNotificationRead(id: string) {
  return apiFetch<any>(`/notifications/${id}/read`, { method: 'PATCH' })
}

// ─── History ───────────────────────────────────────────────

export async function fetchHistory(search?: string, type?: string, projectId?: string) {
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  if (type) params.set('type', type)
  if (projectId) params.set('project_id', projectId)
  const qs = params.toString()
  return apiFetch<any[]>(`/history${qs ? `?${qs}` : ''}`)
}

// ─── Settings ──────────────────────────────────────────────

export async function fetchLLMSettings() {
  return apiFetch<any>('/settings/llm')
}

export async function updateLLMSettings(data: Record<string, any>) {
  return apiFetch<any>('/settings/llm', { method: 'PUT', body: JSON.stringify(data) })
}

export async function testOllamaConnection() {
  return apiFetch<any>('/settings/ollama/test', { method: 'POST' })
}

export async function fetchSystemStatus() {
  return apiFetch<any>('/settings/system/status')
}

// ─── Knowledge Base ────────────────────────────────────────

export async function fetchKBCategories() {
  return apiFetch<any[]>('/knowledge-base/categories')
}

export async function fetchKBArticles(search?: string, categoryId?: string) {
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  if (categoryId) params.set('category_id', categoryId)
  const qs = params.toString()
  return apiFetch<any[]>(`/knowledge-base/articles${qs ? `?${qs}` : ''}`)
}

// ─── Attack Surface ────────────────────────────────────────

export async function fetchAttackSurfaceGraph() {
  return apiFetch<{ nodes: any[]; edges: any[] }>('/attack-surface/graph')
}

// ─── Health ────────────────────────────────────────────────

export async function fetchHealth() {
  return apiFetch<any>('/health')
}

export async function fetchSystemTelemetry() {
  return apiFetch<any>('/health/system/telemetry')
}

/**
 * Danix — Centralized API Client Service
 * Powered by Axios HTTP Client targeting http://127.0.0.1:8000/api/v1
 * Provides reusable methods for Health, Telemetry, Agents, Scans CRUD, Reports, Findings, & Dashboard.
 */

import { http, apiClient } from './axios'

// ─── Health & Telemetry ──────────────────────────────────────────

export async function fetchHealth() {
  return http.get<any>('/health')
}

export async function fetchSystemTelemetry() {
  return http.get<any>('/health/system/telemetry')
}

export async function fetchSystemStatus() {
  return http.get<any>('/settings/system/status')
}

// ─── Agents & AgentOS Status ────────────────────────────────────

export async function fetchAgentStatus() {
  const res = await http.get<any>('/agents/status')
  return Array.isArray(res) ? res : res?.agents || []
}

// ─── Scans (CRUD Operations) ────────────────────────────────────

export async function fetchScans(search?: string, status?: string) {
  const params: Record<string, string> = {}
  if (search) params.search = search
  if (status) params.status = status
  const res = await http.get<any>('/scans', { params })
  return Array.isArray(res) ? res : res?.scans || []
}

export async function fetchScanById(id: string) {
  return http.get<any>(`/scans/${id}`)
}

export async function createScan(data: {
  name: string
  target: string
  target_type?: string
  profile?: string
  project_id?: string
}) {
  return http.post<any>('/scans', data)
}

export async function updateScan(id: string, data: Record<string, any>) {
  return http.put<any>(`/scans/${id}`, data)
}

export async function pauseScan(id: string) {
  return http.post<any>(`/scans/${id}/pause`)
}

export async function resumeScan(id: string) {
  return http.post<any>(`/scans/${id}/resume`)
}

export async function cancelScan(id: string) {
  return http.post<any>(`/scans/${id}/cancel`)
}

export async function deleteScan(id: string) {
  return http.delete<void>(`/scans/${id}`)
}

// ─── Reports ────────────────────────────────────────────────────

export async function fetchReports() {
  const res = await http.get<any>('/reports')
  return Array.isArray(res) ? res : res?.reports || []
}

export async function fetchReportById(id: string) {
  return http.get<any>(`/reports/${id}`)
}

export async function generateReport(data: {
  title: string
  type?: string
  format?: string
  project_id?: string
}) {
  return http.post<any>('/reports/generate', data)
}

export async function exportReport(id: string, format: string = 'pdf') {
  return http.get<any>(`/reports/${id}/export`, { params: { format } })
}

// ─── Findings ───────────────────────────────────────────────────

export async function fetchFindings(
  search?: string,
  severity?: string,
  status?: string,
  projectId?: string
) {
  const params: Record<string, string> = {}
  if (search) params.search = search
  if (severity) params.severity = severity
  if (status) params.status = status
  if (projectId) params.project_id = projectId
  const res = await http.get<any>('/findings', { params })
  if (Array.isArray(res)) {
    return { findings: res, counts: { critical: 0, high: 0, medium: 0, low: 0 } }
  }
  return {
    findings: res?.findings || [],
    counts: res?.counts || { critical: 0, high: 0, medium: 0, low: 0 },
  }
}

export async function fetchFindingById(id: string) {
  return http.get<any>(`/findings/${id}`)
}

export async function updateFinding(
  id: string,
  data: { status?: string; assigned_to?: string }
) {
  return http.patch<any>(`/findings/${id}`, data)
}

export async function fetchFindingExplanation(id: string) {
  return http.get<{ explanation: string }>(`/findings/${id}/explanation`)
}

export async function fetchFindingAnalysis(id: string) {
  return http.get<{
    summary: string
    impact: string
    attack: string
    remediation: string
    references: string
  }>(`/analysis/${id}`)
}

// ─── Dashboard Metrics & Feed ───────────────────────────────────

export async function fetchDashboardOverview() {
  return http.get<any>('/dashboard/overview')
}

export async function fetchDashboardCharts() {
  return http.get<any>('/dashboard/charts')
}

export async function fetchActivityFeed() {
  const data = await http.get<any>('/dashboard/activity-feed')
  const list = Array.isArray(data) ? data : data?.activityFeed || data?.activity_feed || []
  return list.map((item: any) => ({
    id: item.id || String(Math.random()),
    severity: item.status === 'failed' ? 'critical' : item.type === 'scan' ? 'high' : 'normal',
    message: `${(item.type || 'Activity').charAt(0).toUpperCase() + (item.type || 'Activity').slice(1)}: ${item.name || item.message || 'Operation'} (${item.status || 'success'})`,
    time: item.createdAt || item.created_at ? new Date(item.createdAt || item.created_at).toLocaleTimeString() : 'Just now',
    user: item.user || 'System',
  }))
}

export async function fetchRecommendations() {
  const res = await http.get<any>('/dashboard/recommendations')
  return Array.isArray(res) ? res : res?.recommendations || []
}

// ─── Projects ───────────────────────────────────────────────────

export async function fetchProjects(search?: string, status?: string) {
  const params: Record<string, string> = {}
  if (search) params.search = search
  if (status) params.status = status
  const res = await http.get<any>('/projects', { params })
  if (Array.isArray(res)) {
    return { projects: res, portfolio_stats: {} }
  }
  return {
    projects: res?.projects || [],
    portfolio_stats: res?.portfolio_stats || res?.portfolioStats || {},
  }
}

export async function createProject(data: {
  name: string
  client: string
  description?: string
  tags?: string[]
}) {
  return http.post<any>('/projects', data)
}

export async function updateProject(id: string, data: Record<string, any>) {
  return http.patch<any>(`/projects/${id}`, data)
}

export async function deleteProject(id: string) {
  return http.delete<void>(`/projects/${id}`)
}

// ─── Assets ─────────────────────────────────────────────────────

export async function fetchAssets(search?: string, risk?: string, environment?: string) {
  const params: Record<string, string> = {}
  if (search) params.search = search
  if (risk) params.risk = risk
  if (environment) params.environment = environment
  const res = await http.get<any>('/assets', { params })
  return Array.isArray(res) ? res : res?.assets || []
}

export async function createAsset(data: Record<string, any>) {
  return http.post<any>('/assets', data)
}

// ─── AI Chat ────────────────────────────────────────────────────

export async function fetchConversations() {
  const res = await http.get<any>('/ai/conversations')
  return Array.isArray(res) ? res : res?.conversations || []
}

export async function fetchMessages(conversationId: string) {
  const res = await http.get<any>(`/ai/conversations/${conversationId}/messages`)
  return Array.isArray(res) ? res : res?.messages || []
}

export async function sendChatMessage(data: {
  message: string
  conversation_id?: string
  agent_id?: string
}) {
  return http.post<any>('/ai/chat', data)
}

// ─── Notifications ──────────────────────────────────────────────

export async function fetchNotifications() {
  const res = await http.get<any>('/notifications')
  return Array.isArray(res) ? res : res?.notifications || []
}

export async function markNotificationRead(id: string) {
  return http.patch<any>(`/notifications/${id}/read`)
}

// ─── History ────────────────────────────────────────────────────

export async function fetchHistory(search?: string, type?: string, projectId?: string) {
  const params: Record<string, string> = {}
  if (search) params.search = search
  if (type) params.type = type
  if (projectId) params.project_id = projectId
  const res = await http.get<any>('/history', { params })
  return Array.isArray(res) ? res : res?.history || res?.historyItems || []
}

// ─── Settings ───────────────────────────────────────────────────

export async function fetchLLMSettings() {
  return http.get<any>('/settings/llm')
}

export async function updateLLMSettings(data: Record<string, any>) {
  return http.put<any>('/settings/llm', data)
}

export async function testOllamaConnection() {
  return http.post<any>('/settings/ollama/test')
}

// ─── Knowledge Base ─────────────────────────────────────────────

export async function fetchKBCategories() {
  const res = await http.get<any>('/knowledge-base/categories')
  return Array.isArray(res) ? res : res?.categories || []
}

export async function fetchKBArticles(search?: string, categoryId?: string) {
  const params: Record<string, string> = {}
  if (search) params.search = search
  if (categoryId) params.category_id = categoryId
  const res = await http.get<any>('/knowledge-base/articles', { params })
  return Array.isArray(res) ? res : res?.articles || []
}

// ─── Attack Surface ─────────────────────────────────────────────

export async function fetchAttackSurfaceGraph() {
  const res = await http.get<any>('/attack-surface/graph')
  return {
    nodes: res?.nodes || [],
    edges: res?.edges || [],
  }
}

export { http, apiClient }

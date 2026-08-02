'use client'

import { useCallback, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type NodeTypes,
  Handle,
  Position,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { motion } from 'framer-motion'
import { Globe, Server, Shield, Cloud, Cpu, Router, Wifi, Info, ZoomIn, ZoomOut } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ── Custom node ──────────────────────────────────────────────────────────── */
interface AssetNodeData {
  label: string
  type: 'internet' | 'firewall' | 'router' | 'server' | 'cloud' | 'client' | 'service'
  ip?: string
  risk?: 'critical' | 'high' | 'medium' | 'low' | 'safe'
  ports?: string
}

const ICON_MAP = {
  internet: Globe,
  firewall: Shield,
  router: Router,
  server: Server,
  cloud: Cloud,
  client: Cpu,
  service: Wifi,
}

const RISK_COLORS: Record<string, { border: string; bg: string; text: string; dot: string }> = {
  critical: { border: 'border-red-500/60', bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400' },
  high:     { border: 'border-orange-500/60', bg: 'bg-orange-500/10', text: 'text-orange-400', dot: 'bg-orange-400' },
  medium:   { border: 'border-yellow-500/60', bg: 'bg-yellow-500/10', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  low:      { border: 'border-blue-500/40', bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-400' },
  safe:     { border: 'border-green-500/40', bg: 'bg-green-500/10', text: 'text-green-400', dot: 'bg-green-400' },
}

function AssetNode({ data }: { data: AssetNodeData }) {
  const Icon = ICON_MAP[data.type] ?? Server
  const risk = data.risk ?? 'safe'
  const colors = RISK_COLORS[risk]

  return (
    <div className={cn('rounded-xl border bg-card px-4 py-3 shadow-lg min-w-[140px] relative', colors.border)}>
      <Handle type="target" position={Position.Top} style={{ background: '#3B82F6', border: 'none', width: 8, height: 8 }} />
      <div className="flex items-center gap-2">
        <div className={cn('flex size-7 items-center justify-center rounded-lg', colors.bg)}>
          <Icon className={cn('size-3.5', colors.text)} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-foreground leading-tight truncate max-w-[100px]">{data.label}</p>
          {data.ip && <p className="text-[10px] font-mono text-muted-foreground">{data.ip}</p>}
        </div>
        <span className={cn('absolute -top-1 -right-1 size-2.5 rounded-full border-2 border-card', colors.dot)} />
      </div>
      {data.ports && (
        <p className="mt-1.5 text-[10px] text-muted-foreground border-t border-border/50 pt-1.5">{data.ports}</p>
      )}
      <Handle type="source" position={Position.Bottom} style={{ background: '#3B82F6', border: 'none', width: 8, height: 8 }} />
    </div>
  )
}

const nodeTypes: NodeTypes = { asset: AssetNode }

/* ── Initial graph data ───────────────────────────────────────────────────── */
const INITIAL_NODES = [
  { id: 'internet', type: 'asset', position: { x: 400, y: 20 }, data: { label: 'Internet', type: 'internet', risk: 'safe' } },
  { id: 'fw-1', type: 'asset', position: { x: 400, y: 130 }, data: { label: 'Perimeter Firewall', type: 'firewall', ip: '203.0.113.1', risk: 'safe', ports: '80, 443 open' } },
  { id: 'waf-1', type: 'asset', position: { x: 200, y: 260 }, data: { label: 'AWS WAF', type: 'firewall', ip: '203.0.113.2', risk: 'low', ports: '443 only' } },
  { id: 'router-1', type: 'asset', position: { x: 600, y: 260 }, data: { label: 'Core Router', type: 'router', ip: '10.0.0.1', risk: 'medium', ports: 'Multi-subnet' } },
  { id: 'web-1', type: 'asset', position: { x: 80, y: 390 }, data: { label: 'web-prod-01', type: 'server', ip: '203.0.113.10', risk: 'high', ports: '22, 80, 443' } },
  { id: 'api-1', type: 'asset', position: { x: 280, y: 390 }, data: { label: 'api-gw.acme.com', type: 'server', ip: '203.0.113.11', risk: 'critical', ports: '443, 8080' } },
  { id: 'vpn-1', type: 'asset', position: { x: 500, y: 390 }, data: { label: 'vpn.fintrust.net', type: 'server', ip: '198.51.100.5', risk: 'critical', ports: '1194, 443' } },
  { id: 'mail-1', type: 'asset', position: { x: 700, y: 390 }, data: { label: 'mail.fintrust.net', type: 'server', ip: '198.51.100.20', risk: 'high', ports: '25, 465, 993' } },
  { id: 'db-1', type: 'asset', position: { x: 150, y: 520 }, data: { label: 'db-replica-02', type: 'server', ip: '10.0.1.42', risk: 'medium', ports: '3306 internal' } },
  { id: 'k8s-1', type: 'asset', position: { x: 380, y: 520 }, data: { label: 'k8s-node-01', type: 'cloud', ip: '10.10.0.5', risk: 'medium', ports: 'AKS managed' } },
  { id: 'legacy-1', type: 'asset', position: { x: 600, y: 520 }, data: { label: 'legacy-app-01', type: 'server', ip: '172.16.0.100', risk: 'critical', ports: '8080, 22, 23' } },
  { id: 'cdn-1', type: 'asset', position: { x: 50, y: 260 }, data: { label: 'Cloudflare CDN', type: 'cloud', ip: '104.21.0.15', risk: 'safe', ports: 'CDN edge' } },
]

const INITIAL_EDGES = [
  { id: 'e1', source: 'internet', target: 'fw-1', animated: true, style: { stroke: '#3B82F6', strokeWidth: 2 } },
  { id: 'e2', source: 'internet', target: 'cdn-1', style: { stroke: '#22C55E', strokeWidth: 1.5 } },
  { id: 'e3', source: 'fw-1', target: 'waf-1', style: { stroke: '#3B82F6', strokeWidth: 1.5 } },
  { id: 'e4', source: 'fw-1', target: 'router-1', style: { stroke: '#3B82F6', strokeWidth: 1.5 } },
  { id: 'e5', source: 'cdn-1', target: 'waf-1', style: { stroke: '#22C55E', strokeWidth: 1 } },
  { id: 'e6', source: 'waf-1', target: 'web-1', style: { stroke: '#F59E0B', strokeWidth: 1.5 } },
  { id: 'e7', source: 'waf-1', target: 'api-1', animated: true, style: { stroke: '#EF4444', strokeWidth: 2 } },
  { id: 'e8', source: 'router-1', target: 'vpn-1', animated: true, style: { stroke: '#EF4444', strokeWidth: 2 } },
  { id: 'e9', source: 'router-1', target: 'mail-1', style: { stroke: '#F59E0B', strokeWidth: 1.5 } },
  { id: 'e10', source: 'api-1', target: 'db-1', style: { stroke: '#F59E0B', strokeWidth: 1 } },
  { id: 'e11', source: 'api-1', target: 'k8s-1', style: { stroke: '#F59E0B', strokeWidth: 1 } },
  { id: 'e12', source: 'router-1', target: 'legacy-1', animated: true, style: { stroke: '#EF4444', strokeWidth: 2 } },
  { id: 'e13', source: 'web-1', target: 'db-1', style: { stroke: '#71717A', strokeWidth: 1 } },
]

/* ── Legend ───────────────────────────────────────────────────────────────── */
const LEGEND = [
  { color: 'bg-red-400', label: 'Critical' },
  { color: 'bg-orange-400', label: 'High' },
  { color: 'bg-yellow-400', label: 'Medium' },
  { color: 'bg-blue-400', label: 'Low' },
  { color: 'bg-green-400', label: 'Safe' },
]

/* ── Page ─────────────────────────────────────────────────────────────────── */
export default function AttackSurfacePage() {
  const [nodes, , onNodesChange] = useNodesState(INITIAL_NODES as never[])
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES)
  const [selectedNode, setSelectedNode] = useState<AssetNodeData | null>(null)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const stats = {
    critical: INITIAL_NODES.filter((n) => (n.data as AssetNodeData).risk === 'critical').length,
    high: INITIAL_NODES.filter((n) => (n.data as AssetNodeData).risk === 'high').length,
    total: INITIAL_NODES.length,
    edges: INITIAL_EDGES.length,
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem-2.5rem)]">
      {/* Header bar */}
      <div className="flex flex-col gap-3 px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-foreground">Attack Surface</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Interactive topology map · {stats.total} assets · {stats.edges} connections
          </p>
        </div>

        {/* Stats chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { label: 'Critical', value: stats.critical, color: 'bg-red-500/10 text-red-400 border-red-500/20' },
            { label: 'High Risk', value: stats.high, color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
            { label: 'Total Assets', value: stats.total, color: 'bg-zinc-700/40 text-zinc-400 border-zinc-600/30' },
          ].map((chip) => (
            <span key={chip.label} className={cn('flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium', chip.color)}>
              <span className="font-bold">{chip.value}</span> {chip.label}
            </span>
          ))}
        </div>
      </div>

      {/* Graph area */}
      <div className="flex flex-1 overflow-hidden relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node: any) => setSelectedNode(node?.data as AssetNodeData)}
          fitView
          colorMode="dark"
          proOptions={{ hideAttribution: true }}
          style={{ background: '#09090B' }}
        >
          <Background color="#27272A" variant={BackgroundVariant.Dots} gap={20} size={1} />
          <Controls
            style={{ background: '#18181B', border: '1px solid #27272A', borderRadius: 8 }}
            showInteractive={false}
          />
          <MiniMap
            style={{ background: '#111827', border: '1px solid #27272A', borderRadius: 8 }}
            nodeColor={(node) => {
              const d = (node.data as unknown) as AssetNodeData
              if (d.risk === 'critical') return '#EF4444'
              if (d.risk === 'high') return '#F97316'
              if (d.risk === 'medium') return '#F59E0B'
              if (d.risk === 'low') return '#3B82F6'
              return '#22C55E'
            }}
            maskColor="rgba(0,0,0,0.5)"
          />

          {/* Legend overlay */}
          <div className="absolute bottom-4 left-4 z-10 rounded-xl border border-border bg-card/90 backdrop-blur-sm p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Legend</p>
            <div className="space-y-1.5">
              {LEGEND.map((l) => (
                <div key={l.label} className="flex items-center gap-2">
                  <span className={cn('size-2 rounded-full flex-shrink-0', l.color)} />
                  <span className="text-[10px] text-muted-foreground">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </ReactFlow>

        {/* Node detail panel */}
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-4 top-4 z-10 w-64 rounded-xl border border-border bg-card/95 backdrop-blur-sm shadow-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">{selectedNode.label}</h3>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-muted-foreground hover:text-foreground transition-colors text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Type</span>
                <span className="text-foreground capitalize">{selectedNode.type}</span>
              </div>
              {selectedNode.ip && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">IP Address</span>
                  <span className="font-mono text-foreground">{selectedNode.ip}</span>
                </div>
              )}
              {selectedNode.risk && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Risk Level</span>
                  <span className={cn('capitalize font-semibold', RISK_COLORS[selectedNode.risk]?.text)}>
                    {selectedNode.risk}
                  </span>
                </div>
              )}
              {selectedNode.ports && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Ports</span>
                  <span className="text-foreground text-right max-w-[130px] leading-tight">{selectedNode.ports}</span>
                </div>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-border flex gap-2">
              <button className="flex-1 rounded-lg bg-primary/10 py-1.5 text-[11px] font-medium text-primary hover:bg-primary/20 transition-colors">
                View Findings
              </button>
              <button className="flex-1 rounded-lg border border-border py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-zinc-600 transition-colors">
                Scan Asset
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

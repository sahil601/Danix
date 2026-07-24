'use client'

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { motion } from 'framer-motion'
import { RISK_TREND_DATA, SEVERITY_PIE_DATA, SCAN_TIMELINE_DATA } from '@/lib/data'

const TOOLTIP_STYLE = {
  backgroundColor: '#18181B',
  border: '1px solid #27272A',
  borderRadius: '8px',
  color: '#F4F4F5',
  fontSize: '12px',
}

export function RiskTrendChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-xl border border-border bg-card p-5"
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Risk Trend</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Findings severity over time</p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={RISK_TREND_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#71717A' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#71717A' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Area type="monotone" dataKey="critical" stroke="#EF4444" strokeWidth={2} fill="url(#colorCritical)" name="Critical" />
          <Area type="monotone" dataKey="high" stroke="#F97316" strokeWidth={2} fill="url(#colorHigh)" name="High" />
          <Area type="monotone" dataKey="medium" stroke="#F59E0B" strokeWidth={2} fill="url(#colorMedium)" name="Medium" />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export function SeverityPieChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-xl border border-border bg-card p-5"
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Finding Distribution</h3>
        <p className="text-xs text-muted-foreground mt-0.5">315 total findings</p>
      </div>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="50%" height={160}>
          <PieChart>
            <Pie
              data={SEVERITY_PIE_DATA}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
            >
              {SEVERITY_PIE_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip contentStyle={TOOLTIP_STYLE} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col gap-1.5">
          {SEVERITY_PIE_DATA.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <span className="size-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.fill }} />
              <span className="text-xs text-muted-foreground">{entry.name}</span>
              <span className="text-xs font-semibold text-foreground ml-auto pl-2 tabular-nums">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export function ScanTimelineChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="rounded-xl border border-border bg-card p-5"
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Scan Activity</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Scans and findings per month</p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={SCAN_TIMELINE_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#71717A' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#71717A' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Bar dataKey="scans" fill="#3B82F6" radius={[3, 3, 0, 0]} name="Scans" maxBarSize={24} />
          <Bar dataKey="findings" fill="#F59E0B" radius={[3, 3, 0, 0]} name="Findings" maxBarSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText, Download } from 'lucide-react'

export function ReportModal({ scanId, onClose }: { scanId: string, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        className="relative z-10 w-full max-w-5xl h-[85vh] flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-background">
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-primary" />
            <h2 className="text-lg font-semibold">Scan Report</h2>
          </div>
          <div className="flex items-center gap-2">
            <a href={`/api/v1/scans/${scanId}/report`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mr-2">
              <Download className="size-3.5" /> Export
            </a>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="size-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 bg-zinc-950 p-2 overflow-hidden">
          <iframe 
            src={`/api/v1/scans/${scanId}/report`} 
            className="w-full h-full bg-white rounded-lg border-0"
            title="Scan Report"
          />
        </div>
      </motion.div>
    </div>
  )
}

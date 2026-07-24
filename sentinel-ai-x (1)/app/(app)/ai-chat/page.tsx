'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Bot,
  User,
  Paperclip,
  Plus,
  ChevronDown,
  Copy,
  CheckCheck,
  Sparkles,
  Shield,
  AlertTriangle,
  FileText,
  Search,
  Zap,
  MessageSquare,
  Loader2,
  Pin,
  PinOff,
  Download,
  Trash2,
  MoreHorizontal,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ── Types ────────────────────────────────────────────────────────────────── */
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  pinned?: boolean
}

/* ── Agents ───────────────────────────────────────────────────────────────── */
const AGENTS = [
  { id: 'sentinel', label: 'SentinelAI', desc: 'General security assistant', icon: Shield, color: 'text-primary' },
  { id: 'recon', label: 'Recon Agent', desc: 'Network & asset discovery', icon: Search, color: 'text-cyan-400' },
  { id: 'vuln', label: 'Vuln Analyst', desc: 'Finding triage & explanation', icon: AlertTriangle, color: 'text-red-400' },
  { id: 'report', label: 'Report Writer', desc: 'Executive & technical reports', icon: FileText, color: 'text-yellow-400' },
]

/* ── Suggested prompts ────────────────────────────────────────────────────── */
const SUGGESTIONS = [
  { icon: AlertTriangle, text: 'Explain the RCE finding on api-gw.acme.com', color: 'text-red-400 bg-red-500/10 border-red-500/20 hover:bg-red-500/15' },
  { icon: Zap, text: 'Prioritize all critical vulnerabilities by exploitability', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/15' },
  { icon: Shield, text: 'Suggest remediation steps for SQL injection findings', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/15' },
  { icon: FileText, text: 'Summarize the Acme Corp project for an executive report', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20 hover:bg-yellow-500/15' },
  { icon: Search, text: 'What MITRE ATT&CK techniques apply to these findings?', color: 'text-green-400 bg-green-500/10 border-green-500/20 hover:bg-green-500/15' },
  { icon: Sparkles, text: 'Generate a risk prioritization matrix for FinTrust', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/15' },
]

/* ── Demo conversation history ────────────────────────────────────────────── */
const CONVERSATIONS = [
  { id: 'c-1', title: 'Explain RCE findings', date: 'Today', preview: 'The CVE-2021-44228 vulnerability...' },
  { id: 'c-2', title: 'Prioritize FinTrust vulnerabilities', date: 'Yesterday', preview: 'Based on CVSS scores and...' },
  { id: 'c-3', title: 'HIPAA compliance analysis', date: 'Jul 17', preview: 'MedHealth Systems requires...' },
  { id: 'c-4', title: 'Network segmentation review', date: 'Jul 15', preview: 'The lateral movement paths...' },
]

/* ── Canned AI responses ──────────────────────────────────────────────────── */
const AI_RESPONSES: Record<string, string> = {
  default: `**Analysis complete.** Based on your current security posture and the findings across your active projects:

## Key Observations

1. **Critical Attack Vector**: The RCE via deserialization on \`api-gw.acme.com\` (CVE-2021-44228) represents the highest priority threat. This vulnerability is actively exploited in the wild.

2. **Authentication Weaknesses**: SQL injection in the authentication endpoint combined with the unauthenticated admin panel on \`vpn.fintrust.net\` creates a significant compromise risk.

3. **Credential Exposure**: Active AWS keys in a public repository require immediate rotation and CloudTrail audit.

## Recommended Immediate Actions

\`\`\`bash
# 1. Isolate affected service (emergency measure)
kubectl cordon api-gw-node
# 2. Apply Log4j patch
apt-get update && apt-get install -y liblog4j2-java=2.17.1
# 3. Rotate AWS credentials
aws iam update-access-key --access-key-id AKIA... --status Inactive
\`\`\`

## Risk Summary

| Severity | Count | CVSS Avg |
|----------|-------|----------|
| Critical | 3 | 9.4 |
| High | 12 | 7.8 |
| Medium | 28 | 5.2 |
| Low | 47 | 3.1 |

> **Note**: Addressing the 3 critical findings alone would reduce your organization risk score from **78** to approximately **52**.`,

  rce: `## RCE via Deserialization — Detailed Analysis

The vulnerability affects \`api-gw.acme.com\` on endpoint \`POST /api/v2/import\`.

### Root Cause
Java's native serialization mechanism accepts untrusted data without validation. When a crafted Java serialization payload (gadget chain) is submitted, it executes arbitrary code during the deserialization process.

### Exploitation Chain
\`\`\`
Attacker → POST /api/v2/import → Malicious payload (Base64 Java obj) 
→ ObjectInputStream.readObject() → Gadget chain execution → OS command
\`\`\`

### MITRE ATT&CK Mapping
- **T1190** — Exploit Public-Facing Application
- **T1059** — Command and Scripting Interpreter

### Remediation Steps
1. Patch to Log4j 2.17.1+ immediately
2. Implement \`SerialKiller\` library to whitelist deserializable classes
3. Apply JVM flag: \`-Dcom.sun.jndi.rmi.object.trustURLCodebase=false\`
4. Enable RASP (Runtime Application Self-Protection)
5. Verify fix with a follow-up scan to confirm the patch was applied correctly

**Confidence**: 98% · **CVSS**: 9.8 Critical`,
}

/* ── Render markdown-ish content ──────────────────────────────────────────── */
function MessageContent({ content }: { content: string }) {
  const parts = content.split(/(```[\s\S]*?```)/g)
  return (
    <div className="space-y-3 text-sm leading-relaxed text-foreground">
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          const code = part.replace(/```\w*\n?/, '').replace(/```$/, '')
          return (
            <div key={i} className="rounded-lg border border-border bg-zinc-950 overflow-x-auto">
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-border">
                <span className="text-[10px] text-muted-foreground font-mono">bash</span>
              </div>
              <pre className="p-3 text-xs font-mono text-green-400 whitespace-pre-wrap">{code.trim()}</pre>
            </div>
          )
        }
        // Render lines with basic markdown
        return (
          <div key={i} className="space-y-1.5">
            {part.split('\n').map((line, j) => {
              if (!line.trim()) return <div key={j} className="h-1" />
              if (line.startsWith('## ')) return <h3 key={j} className="text-base font-bold text-foreground mt-2">{line.replace('## ', '')}</h3>
              if (line.startsWith('### ')) return <h4 key={j} className="text-sm font-semibold text-foreground">{line.replace('### ', '')}</h4>
              if (line.startsWith('**') && line.endsWith('**')) return <p key={j} className="font-semibold text-foreground">{line.replace(/\*\*/g, '')}</p>
              if (line.startsWith('> ')) return <blockquote key={j} className="border-l-2 border-primary/50 pl-3 text-muted-foreground italic">{line.replace('> ', '')}</blockquote>
              if (line.startsWith('| ') && line.includes('|')) {
                return null // skip table lines inline, handled below
              }
              if (line.match(/^\d+\./)) return <p key={j} className="pl-2 text-sm">{line}</p>
              if (line.startsWith('- ') || line.startsWith('* ')) return <p key={j} className="pl-2 text-sm before:content-['·'] before:mr-2 before:text-primary">{line.slice(2)}</p>
              // bold inline
              const boldified = line.replace(/\*\*(.+?)\*\*/g, (_, m) => `<strong class="font-semibold text-foreground">${m}</strong>`)
              const codeified = boldified.replace(/`(.+?)`/g, (_, m) => `<code class="rounded bg-zinc-800 px-1 py-0.5 font-mono text-xs text-cyan-400">${m}</code>`)
              return <p key={j} dangerouslySetInnerHTML={{ __html: codeified }} />
            })}
          </div>
        )
      })}
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [activeAgent, setActiveAgent] = useState(AGENTS[0])
  const [agentOpen, setAgentOpen] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [showPinned, setShowPinned] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const togglePin = (id: string) => {
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, pinned: !m.pinned } : m))
  }

  const pinnedMessages = messages.filter((m) => m.pinned)

  const exportChat = () => {
    const content = messages.map((m) => `[${m.timestamp}] ${m.role.toUpperCase()}: ${m.content}`).join('\n\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'sentinelai-chat.txt'; a.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = async (text?: string) => {
    const content = text ?? input.trim()
    if (!content) return
    setInput('')

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, userMsg])
    setIsTyping(true)

    await new Promise((r) => setTimeout(r, 1400 + Math.random() * 800))

    const response = content.toLowerCase().includes('rce') || content.toLowerCase().includes('deserialization')
      ? AI_RESPONSES.rce
      : AI_RESPONSES.default

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, aiMsg])
    setIsTyping(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      sendMessage()
    }
  }

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const isEmpty = messages.length === 0

  return (
    <div className="flex h-[calc(100vh-3.5rem-2.5rem)] overflow-hidden">
      {/* Conversation History Sidebar */}
      <aside className="hidden xl:flex w-60 flex-shrink-0 flex-col border-r border-border bg-card/30">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Conversations</span>
          <button
            onClick={() => { setMessages([]); setActiveConversation(null) }}
            className="flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary hover:bg-primary/20 transition-colors"
          >
            <Plus className="size-3" /> New
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {CONVERSATIONS.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConversation(conv.id)}
              className={cn(
                'w-full text-left rounded-lg p-2.5 transition-colors',
                activeConversation === conv.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-accent'
              )}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs font-medium text-foreground truncate max-w-[140px]">{conv.title}</span>
                <span className="text-[10px] text-muted-foreground flex-shrink-0">{conv.date}</span>
              </div>
              <p className="text-[10px] text-muted-foreground truncate">{conv.preview}</p>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Chat */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary/15">
              <Bot className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">AI Security Assistant</p>
              <div className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-green-400" />
                <span className="text-[10px] text-green-400">Online · Context-aware</span>
              </div>
            </div>
          </div>

          {/* Right-side actions */}
          <div className="flex items-center gap-2">
            {pinnedMessages.length > 0 && (
              <button
                onClick={() => setShowPinned((v) => !v)}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors',
                  showPinned ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400' : 'border-border text-muted-foreground hover:text-foreground'
                )}
              >
                <Pin className="size-3.5" />
                {pinnedMessages.length} pinned
              </button>
            )}
            {messages.length > 0 && (
              <button
                onClick={exportChat}
                className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                title="Export conversation"
              >
                <Download className="size-3.5" />
                Export
              </button>
            )}
          </div>

          {/* Agent Selector */}
          <div className="relative">
            <button
              onClick={() => setAgentOpen((o) => !o)}
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:border-zinc-600 transition-colors"
            >
              <activeAgent.icon className={cn('size-3.5', activeAgent.color)} />
              {activeAgent.label}
              <ChevronDown className={cn('size-3.5 text-muted-foreground transition-transform', agentOpen && 'rotate-180')} />
            </button>
            <AnimatePresence>
              {agentOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  className="absolute right-0 mt-1 z-50 w-56 rounded-xl border border-border bg-card shadow-xl overflow-hidden"
                >
                  {AGENTS.map((agent) => {
                    const Icon = agent.icon
                    return (
                      <button
                        key={agent.id}
                        onClick={() => { setActiveAgent(agent); setAgentOpen(false) }}
                        className={cn(
                          'flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-accent',
                          activeAgent.id === agent.id && 'bg-primary/10'
                        )}
                      >
                        <Icon className={cn('size-4 flex-shrink-0', agent.color)} />
                        <div>
                          <p className="text-xs font-medium text-foreground">{agent.label}</p>
                          <p className="text-[10px] text-muted-foreground">{agent.desc}</p>
                        </div>
                      </button>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Pinned messages panel */}
        <AnimatePresence>
          {showPinned && pinnedMessages.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b border-yellow-500/20 bg-yellow-500/5 px-6 py-3 flex-shrink-0"
            >
              <div className="flex items-center gap-2 mb-2">
                <Pin className="size-3.5 text-yellow-400" />
                <span className="text-xs font-semibold text-yellow-400">Pinned Messages</span>
              </div>
              <div className="space-y-1.5 max-h-28 overflow-y-auto">
                {pinnedMessages.map((m) => (
                  <div key={m.id} className="flex items-start gap-2">
                    <span className="text-[10px] text-yellow-400/60 flex-shrink-0 mt-0.5">{m.role === 'assistant' ? 'AI' : 'You'}</span>
                    <p className="text-xs text-muted-foreground line-clamp-1">{m.content.replace(/[#*`]/g, '').slice(0, 120)}</p>
                    <button onClick={() => togglePin(m.id)} className="flex-shrink-0 text-yellow-400/60 hover:text-yellow-400 ml-auto">
                      <PinOff className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {isEmpty ? (
            /* Welcome / Empty State */
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center max-w-2xl mx-auto pt-8"
            >
              <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/15 mb-4">
                <Sparkles className="size-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground text-center">How can I help you?</h2>
              <p className="mt-2 text-sm text-muted-foreground text-center max-w-md">
                Ask me about vulnerabilities, request AI-powered analysis, generate reports, or explore your security posture.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                {SUGGESTIONS.map((s, i) => {
                  const Icon = s.icon
                  return (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.06 }}
                      onClick={() => sendMessage(s.text)}
                      className={cn(
                        'flex items-center gap-2.5 rounded-xl border px-4 py-3 text-left text-xs font-medium transition-colors',
                        s.color
                      )}
                    >
                      <Icon className="size-3.5 flex-shrink-0" />
                      {s.text}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('flex gap-3', msg.role === 'user' && 'flex-row-reverse')}
                >
                  {/* Avatar */}
                  <div className={cn(
                    'flex-shrink-0 flex size-8 items-center justify-center rounded-xl',
                    msg.role === 'assistant' ? 'bg-primary/15' : 'bg-zinc-700'
                  )}>
                    {msg.role === 'assistant'
                      ? <Bot className="size-4 text-primary" />
                      : <User className="size-4 text-zinc-300" />
                    }
                  </div>

                  {/* Bubble */}
                  <div className={cn(
                    'group relative max-w-[80%] rounded-2xl px-4 py-3',
                    msg.role === 'user'
                      ? 'rounded-tr-sm bg-primary text-white'
                      : 'rounded-tl-sm border border-border bg-card'
                  )}>
                    {msg.role === 'assistant'
                      ? <MessageContent content={msg.content} />
                      : <p className="text-sm leading-relaxed">{msg.content}</p>
                    }
                    <div className="flex items-center justify-between mt-2 gap-3">
                      <span className={cn('text-[10px]', msg.role === 'user' ? 'text-white/60' : 'text-muted-foreground')}>
                        {msg.timestamp}
                      </span>
                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => togglePin(msg.id)}
                            title={msg.pinned ? 'Unpin' : 'Pin message'}
                          >
                            {msg.pinned
                              ? <PinOff className="size-3 text-yellow-400" />
                              : <Pin className="size-3 text-muted-foreground hover:text-yellow-400" />
                            }
                          </button>
                          <button onClick={() => copy(msg.content, msg.id)}>
                            {copiedId === msg.id
                              ? <CheckCheck className="size-3 text-green-400" />
                              : <Copy className="size-3 text-muted-foreground hover:text-foreground" />
                            }
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="flex size-8 items-center justify-center rounded-xl bg-primary/15 flex-shrink-0">
                    <Bot className="size-4 text-primary" />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Loader2 className="size-3.5 text-primary animate-spin" />
                      <span className="text-xs text-muted-foreground">Analyzing...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t border-border bg-card/50 px-4 py-4 flex-shrink-0">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-end gap-2 rounded-2xl border border-border bg-card focus-within:border-primary transition-colors px-4 py-3">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about vulnerabilities, generate reports, request analysis..."
                rows={1}
                className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none max-h-40 leading-relaxed"
                style={{ minHeight: '24px' }}
              />
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                  <Paperclip className="size-4" />
                </button>
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isTyping}
                  className="flex size-8 items-center justify-center rounded-xl bg-primary text-white hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="size-3.5" />
                </button>
              </div>
            </div>
            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              AI responses are generated for authorized security assessments only · Press Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

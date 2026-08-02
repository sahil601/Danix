'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Shield,
  Target,
  BookOpen,
  Bug,
  Network,
  CheckCircle2,
  Bookmark,
  Clock,
  TrendingUp,
  Bot,
  ExternalLink,
  ChevronRight,
  Star,
  ArrowRight,
  Hash,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { KB_CATEGORIES } from '@/lib/data'

/* ── Knowledge items ──────────────────────────────────────────────────────── */
const KB_ARTICLES = [
  {
    id: 'kb-1',
    title: 'OWASP A03:2021 — Injection',
    category: 'owasp',
    tags: ['sql', 'nosql', 'xss', 'injection'],
    summary: 'Injection flaws occur when untrusted data is sent to an interpreter as part of a command or query.',
    severity: 'critical',
    views: 8421,
    bookmarked: true,
    updated: 'Jul 2025',
    readTime: '8 min',
  },
  {
    id: 'kb-2',
    title: 'CVE-2021-44228 — Log4Shell (Log4j)',
    category: 'cve',
    tags: ['rce', 'log4j', 'java', 'jndi'],
    summary: 'A critical JNDI injection vulnerability in Apache Log4j 2 allowing unauthenticated RCE.',
    severity: 'critical',
    views: 22157,
    bookmarked: true,
    updated: 'Dec 2021',
    readTime: '12 min',
  },
  {
    id: 'kb-3',
    title: 'MITRE T1190 — Exploit Public-Facing Application',
    category: 'mitre',
    tags: ['initial-access', 'exploitation', 'web'],
    summary: 'Adversaries may attempt to take advantage of a weakness in an Internet-facing host or system.',
    severity: 'high',
    views: 6203,
    bookmarked: false,
    updated: 'Jun 2025',
    readTime: '6 min',
  },
  {
    id: 'kb-4',
    title: 'Port 22 — SSH Security Hardening',
    category: 'ports',
    tags: ['ssh', 'authentication', 'hardening'],
    summary: 'Best practices for securing SSH: key-based auth, fail2ban, port knocking, and protocol version.',
    severity: 'medium',
    views: 4812,
    bookmarked: false,
    updated: 'May 2025',
    readTime: '5 min',
  },
  {
    id: 'kb-5',
    title: 'NIST CSF 2.0 — Identify Function',
    category: 'nist',
    tags: ['framework', 'governance', 'risk'],
    summary: 'The Identify function develops an understanding of cybersecurity risk to systems, assets, and data.',
    severity: 'low',
    views: 3190,
    bookmarked: false,
    updated: 'Mar 2024',
    readTime: '15 min',
  },
  {
    id: 'kb-6',
    title: 'TLS 1.0/1.1 Deprecation — Migration Guide',
    category: 'best-practices',
    tags: ['tls', 'cryptography', 'migration', 'ssl'],
    summary: 'Complete guide to disabling deprecated TLS versions and enabling TLS 1.3 across web infrastructure.',
    severity: 'medium',
    views: 5647,
    bookmarked: true,
    updated: 'Apr 2025',
    readTime: '10 min',
  },
  {
    id: 'kb-7',
    title: 'CWE-89 — SQL Injection',
    category: 'cve',
    tags: ['sqli', 'injection', 'authentication-bypass'],
    summary: 'SQL injection allows attackers to interfere with queries an application makes to its database.',
    severity: 'critical',
    views: 14320,
    bookmarked: false,
    updated: 'Jan 2025',
    readTime: '9 min',
  },
  {
    id: 'kb-8',
    title: 'OWASP A01:2021 — Broken Access Control',
    category: 'owasp',
    tags: ['access-control', 'idor', 'privilege-escalation'],
    summary: 'Access control enforces policy such that users cannot act outside of their intended permissions.',
    severity: 'critical',
    views: 9874,
    bookmarked: false,
    updated: 'Jul 2025',
    readTime: '7 min',
  },
]

const POPULAR = KB_ARTICLES.slice(0, 4)
const RECENT = [KB_ARTICLES[0], KB_ARTICLES[1], KB_ARTICLES[2]]

/* ── Category icon map ────────────────────────────────────────────────────── */
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  owasp: Shield,
  mitre: Target,
  nist: BookOpen,
  cve: Bug,
  ports: Network,
  'best-practices': CheckCircle2,
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: 'text-red-400 bg-red-500/10 border-red-500/20',
  high: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  low: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
}

/* ── AI Summary ───────────────────────────────────────────────────────────── */
const AI_SUMMARY = `Based on your active projects and recent findings, the most relevant knowledge areas are:
**Injection vulnerabilities** (A03:2021) affecting 4 of your assets, **broken access control** patterns in the FinTrust assessment, and **TLS configuration** issues on legacy systems. I recommend reviewing the Log4Shell advisory as it directly maps to your CVE-2021-44228 finding.`

import { fetchKBCategories } from '@/lib/api'
import { useEffect } from 'react'

/* ── Page ─────────────────────────────────────────────────────────────────── */
export default function KnowledgeBasePage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false)
  const [activeArticle, setActiveArticle] = useState<typeof KB_ARTICLES[0] | null>(null)
  const [categories, setCategories] = useState(KB_CATEGORIES)

  useEffect(() => {
    fetchKBCategories().then(res => setCategories(res.categories || res)).catch(() => {})
  }, [])

  const filtered = KB_ARTICLES.filter((a) => {
    const matchSearch = !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.summary.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some((t) => t.includes(search.toLowerCase()))
    const matchCategory = activeCategory === 'all' || a.category === activeCategory
    const matchBookmark = !bookmarkedOnly || a.bookmarked
    return matchSearch && matchCategory && matchBookmark
  })

  return (
    <div className="flex h-[calc(100vh-3.5rem-2.5rem)] overflow-hidden">
      {/* Left sidebar: categories */}
      <aside className="hidden lg:flex w-56 flex-shrink-0 flex-col border-r border-border bg-card/30 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Categories</p>
        <div className="space-y-0.5 flex-1">
          <button
            onClick={() => setActiveCategory('all')}
            className={cn(
              'flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-colors',
              activeCategory === 'all' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            <span>All Articles</span>
            <span className="text-[10px] rounded bg-zinc-700/60 px-1.5 py-0.5">{KB_ARTICLES.length}</span>
          </button>
          {categories.map((cat: any) => {
            const Icon = CATEGORY_ICONS[cat.id] ?? BookOpen
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-colors',
                  activeCategory === cat.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <span className="flex items-center gap-2">
                  <Icon className="size-3.5 flex-shrink-0" />
                  {cat.name}
                </span>
                <span className="text-[10px] rounded bg-zinc-700/60 px-1.5 py-0.5 text-zinc-400">{cat.count}</span>
              </button>
            )
          })}
        </div>

        <div className="mt-4 border-t border-border pt-4 space-y-0.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Quick Access</p>
          <button
            onClick={() => setBookmarkedOnly((b) => !b)}
            className={cn(
              'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors',
              bookmarkedOnly ? 'bg-yellow-500/10 text-yellow-400' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            <Bookmark className="size-3.5" /> Bookmarks
          </button>
          <button className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            <Clock className="size-3.5" /> Recently Viewed
          </button>
          <button className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            <TrendingUp className="size-3.5" /> Most Popular
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Header + Search */}
            <div>
              <h1 className="text-2xl font-bold text-foreground">Knowledge Base</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Security intelligence, CVE database, frameworks, and best practices</p>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search vulnerabilities, CVEs, techniques, ports..."
                className="w-full rounded-xl border border-border bg-card pl-11 pr-4 py-3 text-sm placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* AI Summary */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="size-4 text-primary" />
                <span className="text-xs font-semibold text-primary">AI Context Summary</span>
                <span className="text-[10px] text-muted-foreground ml-auto">Based on active projects</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {AI_SUMMARY.split('**').map((part, i) =>
                  i % 2 === 1 ? <strong key={i} className="text-foreground">{part}</strong> : part
                )}
              </p>
            </div>

            {/* Popular / Recent quick rows (shown when no search) */}
            {!search && activeCategory === 'all' && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <TrendingUp className="size-4 text-muted-foreground" /> Popular Articles
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {POPULAR.map((article, i) => (
                      <motion.button
                        key={article.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => setActiveArticle(article)}
                        className="text-left rounded-xl border border-border bg-card p-4 hover:border-zinc-600 transition-all group"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className={cn('rounded-md border px-1.5 py-0.5 text-[10px] font-medium capitalize', SEVERITY_COLORS[article.severity])}>
                            {article.severity}
                          </span>
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Star className="size-3" /> {article.views.toLocaleString()}
                          </div>
                        </div>
                        <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">{article.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{article.summary}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                    <Clock className="size-4 text-muted-foreground" /> Recently Viewed
                  </h2>
                  <div className="space-y-2">
                    {RECENT.map((article) => (
                      <button
                        key={article.id}
                        onClick={() => setActiveArticle(article)}
                        className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 hover:border-zinc-600 transition-all text-left"
                      >
                        <ArrowRight className="size-3.5 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">{article.title}</p>
                          <p className="text-[10px] text-muted-foreground capitalize">{article.category} · {article.readTime} read</p>
                        </div>
                        <ExternalLink className="size-3.5 text-muted-foreground flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Articles list */}
            <div>
              {(search || activeCategory !== 'all') && (
                <p className="text-xs text-muted-foreground mb-3">{filtered.length} results</p>
              )}
              {(search || activeCategory !== 'all' || bookmarkedOnly) && (
                <div className="space-y-3">
                  {filtered.map((article, i) => (
                    <motion.button
                      key={article.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => setActiveArticle(article)}
                      className="w-full text-left rounded-xl border border-border bg-card p-4 hover:border-zinc-600 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={cn('rounded-md border px-1.5 py-0.5 text-[10px] font-medium capitalize', SEVERITY_COLORS[article.severity])}>
                              {article.severity}
                            </span>
                            <span className="text-[10px] text-muted-foreground capitalize">{article.category}</span>
                          </div>
                          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{article.title}</p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{article.summary}</p>
                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                            {article.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                                <Hash className="size-2.5" />{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                          <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                          {article.bookmarked && <Bookmark className="size-3.5 text-yellow-400 fill-yellow-400" />}
                        </div>
                      </div>
                    </motion.button>
                  ))}

                  {filtered.length === 0 && (
                    <div className="flex flex-col items-center py-16 text-center">
                      <Search className="size-10 text-muted-foreground/40 mb-3" />
                      <p className="text-sm font-medium text-foreground">No articles found</p>
                      <p className="text-xs text-muted-foreground mt-1">Try different keywords or browse categories</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Article detail panel */}
        {activeArticle && (
          <motion.aside
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden xl:flex w-96 flex-shrink-0 flex-col border-l border-border bg-card/50 overflow-y-auto"
          >
            <div className="sticky top-0 flex items-center justify-between px-5 py-4 border-b border-border bg-card z-10">
              <p className="text-xs font-semibold text-foreground truncate max-w-[280px]">{activeArticle.title}</p>
              <button
                onClick={() => setActiveArticle(null)}
                className="text-muted-foreground hover:text-foreground transition-colors text-xs ml-2 flex-shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Meta */}
              <div className="flex flex-wrap gap-2">
                <span className={cn('rounded-md border px-2 py-0.5 text-xs font-medium capitalize', SEVERITY_COLORS[activeArticle.severity])}>
                  {activeArticle.severity}
                </span>
                <span className="rounded-md border border-zinc-700/60 bg-zinc-700/20 px-2 py-0.5 text-xs text-zinc-400 capitalize">
                  {activeArticle.category}
                </span>
                <span className="rounded-md border border-zinc-700/60 bg-zinc-700/20 px-2 py-0.5 text-xs text-zinc-400">
                  {activeArticle.readTime} read
                </span>
              </div>

              {/* Summary */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Overview</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{activeArticle.summary}</p>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {activeArticle.tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-0.5 rounded-md bg-zinc-800 px-2 py-1 text-[10px] text-muted-foreground">
                      <Hash className="size-2.5" />{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border bg-background p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{activeArticle.views.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">Views</p>
                </div>
                <div className="rounded-lg border border-border bg-background p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{activeArticle.updated}</p>
                  <p className="text-[10px] text-muted-foreground">Updated</p>
                </div>
              </div>

              {/* CVSS / Impact metrics (for CVE/OWASP articles) */}
              {(activeArticle.category === 'cve' || activeArticle.category === 'owasp') && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Impact Metrics</h3>
                  <div className="space-y-2">
                    {[
                      { label: 'CVSS Score', value: activeArticle.severity === 'critical' ? '9.8' : activeArticle.severity === 'high' ? '7.5' : '5.3', color: activeArticle.severity === 'critical' ? 'text-red-400' : 'text-orange-400' },
                      { label: 'Attack Vector', value: 'Network', color: 'text-muted-foreground' },
                      { label: 'Privileges Required', value: 'None', color: 'text-muted-foreground' },
                      { label: 'User Interaction', value: activeArticle.category === 'owasp' ? 'Required' : 'None', color: 'text-muted-foreground' },
                    ].map((m) => (
                      <div key={m.label} className="flex items-center justify-between py-1 border-b border-border/40 last:border-0">
                        <span className="text-xs text-muted-foreground">{m.label}</span>
                        <span className={cn('text-xs font-semibold', m.color)}>{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Remediation steps */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Remediation Steps</h3>
                <div className="space-y-1.5">
                  {[
                    'Identify all affected components and versions in your environment',
                    'Apply the latest vendor patch or security update immediately',
                    'Implement compensating controls if patching is not immediately possible',
                    'Verify remediation with a targeted re-scan',
                  ].map((step, si) => (
                    <div key={si} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="flex size-4 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary mt-0.5">{si + 1}</span>
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Articles */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Related Articles</h3>
                <div className="space-y-1.5">
                  {KB_ARTICLES
                    .filter((a) => a.id !== activeArticle.id && a.tags.some((t) => activeArticle.tags.includes(t)))
                    .slice(0, 3)
                    .map((related) => (
                      <button
                        key={related.id}
                        onClick={() => setActiveArticle(related)}
                        className="flex w-full items-center gap-2 rounded-lg border border-border px-3 py-2 text-left hover:border-zinc-600 transition-colors group"
                      >
                        <ArrowRight className="size-3 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
                        <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors truncate">{related.title}</span>
                        <span className={cn('ml-auto rounded px-1 py-0.5 text-[10px] font-medium capitalize flex-shrink-0', SEVERITY_COLORS[related.severity])}>
                          {related.severity}
                        </span>
                      </button>
                    ))
                  }
                  {KB_ARTICLES.filter((a) => a.id !== activeArticle.id && a.tags.some((t) => activeArticle.tags.includes(t))).length === 0 && (
                    <p className="text-[10px] text-muted-foreground/50 text-center py-2">No related articles found</p>
                  )}
                </div>
              </div>

              {/* AI Summary */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="size-3.5 text-primary" />
                  <span className="text-xs font-semibold text-primary">AI Summary</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This article is relevant to {activeArticle.tags[0]} vulnerabilities found in your active projects. Review the remediation steps and map findings to this knowledge entry for comprehensive reporting.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary/90 transition-colors">
                  <ExternalLink className="size-3.5" /> Read Full Article
                </button>
                <button className={cn(
                  'flex items-center justify-center rounded-xl border px-3 py-2 transition-colors',
                  activeArticle.bookmarked
                    ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
                    : 'border-border text-muted-foreground hover:border-zinc-600 hover:text-foreground'
                )}>
                  <Bookmark className={cn('size-4', activeArticle.bookmarked && 'fill-yellow-400')} />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </div>
    </div>
  )
}

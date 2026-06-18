"use client"

import { motion } from "framer-motion"
import { CheckCircle2, ChevronRight, Route } from "lucide-react"
import { explorationPaths, getNode } from "@/lib/history-data"
import { SectionHeading } from "@/components/space-scene"

interface PathsProps {
  activePathId?: string | null
  completedPathIds?: string[]
  onSelectPath: (pathId: string) => void
  visitedNodeIds?: string[]
}

export function ExplorationPaths({
  activePathId,
  completedPathIds = [],
  onSelectPath,
  visitedNodeIds = [],
}: PathsProps) {
  const completedIds = new Set(completedPathIds)
  const visitedIds = new Set(visitedNodeIds)

  return (
    <section id="paths" className="relative mx-auto max-w-7xl px-6 py-20">
      <SectionHeading
        eyebrow="Lộ trình gợi ý"
        title="Những hành trình khám phá"
        description="Chọn một lộ trình để đi theo mạch câu chuyện lịch sử. Mỗi hành trình dẫn bạn qua các ngôi sao liên quan trong bầu trời nhân vật."
      />

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {explorationPaths.map((path, i) => {
          const complete = completedIds.has(path.id)
          const active = activePathId === path.id
          const visitedCount = path.nodeIds.filter((id) => visitedIds.has(id)).length
          return (
            <motion.button
              key={path.id}
              data-path-completed={complete}
              data-path-id={path.id}
              data-path-visited-count={visitedCount}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              onClick={() => onSelectPath(path.id)}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-card p-5 text-left transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_40px_-12px_var(--glow)] ${
                active ? "border-primary/65" : complete ? "border-primary/35" : "border-border"
              }`}
            >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-60"
              style={{ background: "var(--glow)" }}
            />
            <div className="flex items-center justify-between gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                {complete ? <CheckCircle2 className="size-5" /> : <Route className="size-5" />}
              </div>
              {(active || complete) && (
                <span className="rounded-full border border-primary/35 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                  {complete ? "Hoàn tất" : "Đang đi"}
                </span>
              )}
            </div>
            <h3 className="font-heading mt-4 text-lg font-semibold leading-tight text-foreground">
              {path.title}
            </h3>
            <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
              {path.subtitle}
            </p>

            <div className="mt-4 flex -space-x-2">
              {path.nodeIds.slice(0, 4).map((id) => {
                const node = getNode(id)
                return (
                  <span
                    key={id}
                    title={node?.name}
                    className={`inline-flex size-7 items-center justify-center rounded-full border-2 border-card text-[10px] font-semibold ${
                      visitedIds.has(id) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                    }`}
                  >
                    {node?.name.charAt(0)}
                  </span>
                )
              })}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {visitedCount}/{path.nodeIds.length} điểm đã ghé
              </span>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                Khám phá
                <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
            </motion.button>
          )
        })}
      </div>
    </section>
  )
}

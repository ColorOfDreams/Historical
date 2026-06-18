"use client"

import { motion } from "framer-motion"
import { Compass, Sparkles, Star, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Starfield } from "@/components/starfield"

export type Mode = "space" | "constellation"

interface HeroProps {
  mode: Mode
  onModeChange: (mode: Mode) => void
  onExplore: () => void
}

export function Hero({ mode, onModeChange, onExplore }: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden">
      <Starfield count={80} />
      {/* subtle blue glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[40rem] w-[60rem] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--glow), transparent 70%)" }}
      />

      <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col items-center justify-center px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur"
        >
          <Sparkles className="size-3.5 text-primary" />
          Nền tảng khám phá tri thức lịch sử tương tác
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-heading max-w-4xl text-balance text-5xl font-semibold leading-tight tracking-tight md:text-7xl"
        >
          Khám phá lịch sử Việt Nam{" "}
          <span className="text-glow text-primary">theo một cách mới</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground"
        >
          Bước vào không gian lịch sử ba chiều và bầu trời nhân vật dạng chòm sao. Chạm vào từng
          ngôi sao để mở ra câu chuyện về con người, sự kiện và vùng đất của dân tộc.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col items-center gap-6"
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            <ModeButton
              active={mode === "space"}
              onClick={() => onModeChange("space")}
              icon={<Compass className="size-5" />}
              label="Không gian lịch sử 3D"
            />
            <ModeButton
              active={mode === "constellation"}
              onClick={() => onModeChange("constellation")}
              icon={<Star className="size-5" />}
              label="Bầu trời nhân vật"
            />
          </div>

          <Button
            size="lg"
            variant="ghost"
            onClick={onExplore}
            className="group gap-2 text-muted-foreground hover:bg-transparent hover:text-foreground"
          >
            Bắt đầu khám phá
            <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

function ModeButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`group relative flex items-center gap-3 rounded-xl border px-6 py-4 text-left transition-all duration-300 ${
        active
          ? "border-primary/60 bg-primary/10 text-foreground shadow-[0_0_30px_-8px_var(--glow)]"
          : "border-border bg-card/50 text-muted-foreground hover:border-primary/40 hover:text-foreground"
      }`}
    >
      <span
        className={`flex size-10 items-center justify-center rounded-lg transition-colors ${
          active ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/70"
        }`}
      >
        {icon}
      </span>
      <span className="text-base font-medium">{label}</span>
    </button>
  )
}

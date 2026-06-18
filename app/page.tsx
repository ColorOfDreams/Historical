"use client"

import { useMemo, useRef, useState } from "react"
import type React from "react"
import { CheckCircle2, ChevronRight, Compass, MapPinned, Route, Swords, X } from "lucide-react"
import { Hero, type Mode } from "@/components/hero"
import { SpaceScene, type StageId } from "@/components/space-scene"
import { Constellation } from "@/components/constellation"
import { ExplorationPaths } from "@/components/exploration-paths"
import { battleHotspots, battleTimeline, explorationPaths, getNode } from "@/lib/history-data"

const BACH_DANG_STAGE: StageId = "stage-3"
const BACH_DANG_HOTSPOT = "hs-command"

export default function Page() {
  const [mode, setMode] = useState<Mode>("space")
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [activePathId, setActivePathId] = useState<string | null>(null)
  const [completedPathIds, setCompletedPathIds] = useState<string[]>([])
  const [focusedStageId, setFocusedStageId] = useState<StageId>(battleTimeline[0].id)
  const [focusedHotspotId, setFocusedHotspotId] = useState<string | null>(null)
  const [visitedNodeIds, setVisitedNodeIds] = useState<string[]>([])

  const spaceRef = useRef<HTMLDivElement>(null)
  const constellationRef = useRef<HTMLDivElement>(null)
  const pathsRef = useRef<HTMLDivElement>(null)

  const activePath = useMemo(
    () => explorationPaths.find((path) => path.id === activePathId) ?? null,
    [activePathId],
  )
  const activePathIndex = activePath && selectedNode ? activePath.nodeIds.indexOf(selectedNode) : -1
  const selectedNodeName = selectedNode ? getNode(selectedNode)?.name ?? null : null
  const focusedStage = battleTimeline.find((stage) => stage.id === focusedStageId) ?? battleTimeline[0]
  const focusedHotspot = focusedHotspotId ? battleHotspots.find((hotspot) => hotspot.id === focusedHotspotId) : null
  const activePathVisitedCount = activePath
    ? activePath.nodeIds.filter((id) => visitedNodeIds.includes(id)).length
    : 0

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const markVisited = (nodeIds: string[]) => {
    setVisitedNodeIds((current) => Array.from(new Set([...current, ...nodeIds])))
  }

  const handleModeChange = (m: Mode) => {
    setMode(m)
    scrollTo(m === "space" ? spaceRef : constellationRef)
  }

  const handleExplore = () => {
    scrollTo(mode === "space" ? spaceRef : constellationRef)
  }

  const openBattleScene = () => {
    setMode("space")
    setFocusedStageId(BACH_DANG_STAGE)
    setFocusedHotspotId(BACH_DANG_HOTSPOT)
    markVisited(["bach-dang-1288"])
    scrollTo(spaceRef)
  }

  const handleSelectNode = (id: string | null) => {
    setSelectedNode(id)
    if (!id) return

    markVisited([id])
    if (activePath?.nodeIds.includes(id)) {
      setActivePathId(activePath.id)
    }

    if (id === "bach-dang-1288") {
      openBattleScene()
      return
    }

    setMode("constellation")
    scrollTo(constellationRef)
  }

  const handleSelectPath = (pathId: string) => {
    const path = explorationPaths.find((item) => item.id === pathId)
    if (!path) return
    setActivePathId(path.id)
    setCompletedPathIds((current) => current.filter((id) => id !== path.id))
    handleSelectNode(path.nodeIds[0])
  }

  const handleOpenRelatedPath = (pathId: string) => {
    handleSelectPath(pathId)
  }

  const handleAdvancePath = () => {
    if (!activePath) return
    const currentIndex = selectedNode ? activePath.nodeIds.indexOf(selectedNode) : -1
    const nextIndex = currentIndex < 0 ? 0 : currentIndex + 1

    if (nextIndex >= activePath.nodeIds.length) {
      markVisited(activePath.nodeIds)
      setCompletedPathIds((current) => Array.from(new Set([...current, activePath.id])))
      return
    }

    handleSelectNode(activePath.nodeIds[nextIndex])
  }

  const handleCompletePath = () => {
    if (!activePath) return
    markVisited(activePath.nodeIds)
    setCompletedPathIds((current) => Array.from(new Set([...current, activePath.id])))
  }

  const handleResetFlow = () => {
    setActivePathId(null)
    setSelectedNode(null)
    setFocusedHotspotId(null)
  }

  return (
    <main
      data-active-path-id={activePathId ?? ""}
      data-focused-hotspot-id={focusedHotspotId ?? ""}
      data-focused-stage-id={focusedStageId}
      data-mode={mode}
      data-selected-node-id={selectedNode ?? ""}
      className="relative min-h-screen bg-background"
    >
      <Hero mode={mode} onModeChange={handleModeChange} onExplore={handleExplore} />

      <ExplorationBreadcrumb
        activePathTitle={activePath?.title ?? null}
        completed={!!activePath && completedPathIds.includes(activePath.id)}
        currentLabel={
          mode === "space"
            ? focusedHotspot?.title ?? focusedStage.label
            : selectedNodeName ?? "Chòm sao tri thức"
        }
        mode={mode}
        onAdvancePath={handleAdvancePath}
        onCompletePath={handleCompletePath}
        onReset={handleResetFlow}
        pathProgress={activePath ? `${activePathVisitedCount}/${activePath.nodeIds.length}` : null}
        selectedNodeName={selectedNodeName}
      />

      <div ref={spaceRef} className="scroll-mt-6">
        <SpaceScene
          focusHotspotId={focusedHotspotId}
          focusStageId={focusedStageId}
          onHotspotChange={setFocusedHotspotId}
          onStageChange={setFocusedStageId}
        />
      </div>

      <div ref={constellationRef} className="scroll-mt-6">
        <Constellation
          activePathNodeIds={activePath?.nodeIds ?? []}
          onOpenPath={handleOpenRelatedPath}
          onOpenScene={openBattleScene}
          selectedId={selectedNode}
          onSelect={handleSelectNode}
          visitedNodeIds={visitedNodeIds}
        />
      </div>

      <div ref={pathsRef}>
        <ExplorationPaths
          activePathId={activePathId}
          completedPathIds={completedPathIds}
          onSelectPath={handleSelectPath}
          visitedNodeIds={visitedNodeIds}
        />
      </div>

      <footer className="border-t border-border py-10 text-center text-sm text-muted-foreground">
        <p>Sử Việt · Nền tảng khám phá lịch sử tương tác · Dữ liệu mô phỏng</p>
      </footer>
    </main>
  )
}

function ExplorationBreadcrumb({
  activePathTitle,
  completed,
  currentLabel,
  mode,
  onAdvancePath,
  onCompletePath,
  onReset,
  pathProgress,
  selectedNodeName,
}: {
  activePathTitle: string | null
  completed: boolean
  currentLabel: string
  mode: Mode
  onAdvancePath: () => void
  onCompletePath: () => void
  onReset: () => void
  pathProgress: string | null
  selectedNodeName: string | null
}) {
  return (
    <div data-exploration-context className="sticky top-0 z-40 border-b border-border bg-background/82 px-4 py-2 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card/75 px-2.5 py-1 text-foreground">
          <Compass className="size-3.5 text-primary" />
          Ngữ cảnh
        </span>
        <ChevronRight className="size-3.5 opacity-60" />
        <span className="inline-flex items-center gap-1.5">
          {mode === "space" ? <Swords className="size-3.5 text-primary" /> : <MapPinned className="size-3.5 text-primary" />}
          {mode === "space" ? "Cảnh 3D Bạch Đằng" : "Chòm sao lịch sử"}
        </span>
        <ChevronRight className="size-3.5 opacity-60" />
        <span className="font-medium text-foreground">{currentLabel}</span>

        {activePathTitle && (
          <>
            <span className="mx-1 h-4 w-px bg-border" />
            <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-primary">
              {completed ? <CheckCircle2 className="size-3.5" /> : <Route className="size-3.5" />}
              {activePathTitle}
              {pathProgress && <span className="text-primary/75">({pathProgress})</span>}
            </span>
            {!completed && (
              <>
                <button
                  type="button"
                  onClick={onAdvancePath}
                  className="rounded-md border border-border bg-card/75 px-2.5 py-1 text-foreground transition-colors hover:border-primary/50"
                >
                  Điểm kế tiếp
                </button>
                <button
                  type="button"
                  onClick={onCompletePath}
                  className="rounded-md border border-border bg-card/75 px-2.5 py-1 transition-colors hover:border-primary/50 hover:text-foreground"
                >
                  Hoàn tất
                </button>
              </>
            )}
          </>
        )}

        {(activePathTitle || selectedNodeName) && (
          <button
            type="button"
            onClick={onReset}
            className="ml-auto inline-flex items-center gap-1 rounded-md border border-border bg-card/75 px-2.5 py-1 transition-colors hover:border-primary/50 hover:text-foreground"
          >
            <X className="size-3.5" />
            Xóa ngữ cảnh
          </button>
        )}
      </div>
    </div>
  )
}

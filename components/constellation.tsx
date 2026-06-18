"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { KeyboardEvent, PointerEvent, WheelEvent } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowUpRight,
  Crown,
  Landmark,
  MapPin,
  Move,
  RotateCcw,
  Search,
  Swords,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react"
import {
  explorationPaths,
  graphEdges,
  graphNodes,
  getNode,
  kindLabel,
  type GraphEdge,
  type GraphNode,
  type NodeKind,
} from "@/lib/history-data"
import { SectionHeading } from "@/components/space-scene"

const GRAPH_WIDTH = 1000
const GRAPH_HEIGHT = 650

const kindIcon: Record<NodeKind, React.ReactNode> = {
  person: <Crown className="size-3.5" />,
  event: <Swords className="size-3.5" />,
  dynasty: <Landmark className="size-3.5" />,
  place: <MapPin className="size-3.5" />,
}

const kindColor: Record<NodeKind, string> = {
  person: "#d9b760",
  event: "#c77453",
  dynasty: "#74a8c8",
  place: "#75b68f",
}

const kindShapeLabel: Record<NodeKind, string> = {
  person: "circle",
  event: "diamond",
  dynasty: "hexagon",
  place: "pin",
}

interface ViewState {
  x: number
  y: number
  scale: number
}

interface ConstellationProps {
  activePathNodeIds?: string[]
  onOpenPath?: (pathId: string) => void
  onOpenScene?: (nodeId: string) => void
  selectedId: string | null
  onSelect: (id: string | null) => void
  visitedNodeIds?: string[]
}

export function Constellation({
  activePathNodeIds = [],
  onOpenPath,
  onOpenScene,
  selectedId,
  onSelect,
  visitedNodeIds = [],
}: ConstellationProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; originX: number; originY: number } | null>(
    null,
  )
  const [view, setView] = useState<ViewState>({ x: 0, y: 0, scale: 1 })
  const [hoveredEdge, setHoveredEdge] = useState<number | null>(null)
  const selected = selectedId ? getNode(selectedId) : null
  const activePathIds = useMemo(() => new Set(activePathNodeIds), [activePathNodeIds])
  const visitedIds = useMemo(() => new Set(visitedNodeIds), [visitedNodeIds])

  const connectedIds = useMemo(() => {
    const ids = new Set<string>()
    if (!selectedId) return ids
    graphEdges.forEach((edge) => {
      if (edge.from === selectedId) ids.add(edge.to)
      if (edge.to === selectedId) ids.add(edge.from)
    })
    return ids
  }, [selectedId])

  const focusNode = (id: string, nextScale = 1.35) => {
    const node = getNode(id)
    if (!node) return
    const point = toPoint(node)
    const scale = Math.max(nextScale, view.scale)
    setView({
      scale,
      x: 405 - point.x * scale,
      y: 320 - point.y * scale,
    })
  }

  const resetView = () => {
    setView({ x: 0, y: 0, scale: 1 })
    setHoveredEdge(null)
  }

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    root.dataset.constellationHydrated = "true"

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Element
      const nodeButton = target.closest("[data-node-hit-id]") as HTMLElement | null
      const relatedButton = target.closest("[data-related-node-id]") as HTMLElement | null
      const closeButton = target.closest("[data-panel-close]") as HTMLElement | null
      const viewButton = target.closest("[data-view-action]") as HTMLElement | null

      if (nodeButton?.dataset.nodeHitId) {
        event.preventDefault()
        onSelect(nodeButton.dataset.nodeHitId === selectedId ? null : nodeButton.dataset.nodeHitId)
        return
      }
      if (relatedButton?.dataset.relatedNodeId) {
        event.preventDefault()
        onSelect(relatedButton.dataset.relatedNodeId)
        return
      }
      if (closeButton) {
        event.preventDefault()
        onSelect(null)
        return
      }
      if (viewButton?.dataset.viewAction) {
        event.preventDefault()
        const action = viewButton.dataset.viewAction
        if (action === "reset") resetView()
        if (action === "zoom-in") setView((current) => ({ ...current, scale: clamp(current.scale + 0.18, 0.72, 2.4) }))
        if (action === "zoom-out") setView((current) => ({ ...current, scale: clamp(current.scale - 0.18, 0.72, 2.4) }))
      }
    }

    root.addEventListener("click", handleClick)
    return () => root.removeEventListener("click", handleClick)
  }, [onSelect, selectedId])

  useEffect(() => {
    if (selectedId) focusNode(selectedId, 1.2)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId])

  const selectNode = (id: string | null) => {
    onSelect(id)
    if (id) focusNode(id)
  }

  const selectByOffset = (offset: number) => {
    const currentIndex = selectedId ? graphNodes.findIndex((node) => node.id === selectedId) : -1
    const nextIndex = (currentIndex + offset + graphNodes.length) % graphNodes.length
    selectNode(graphNodes[nextIndex].id)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as Element
    if (target.closest("[data-constellation-panel]")) return

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault()
      selectByOffset(1)
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault()
      selectByOffset(-1)
    }
    if (event.key === "Home") {
      event.preventDefault()
      selectNode(graphNodes[0].id)
    }
    if (event.key === "End") {
      event.preventDefault()
      selectNode(graphNodes[graphNodes.length - 1].id)
    }
    if (event.key === "Escape") {
      event.preventDefault()
      onSelect(null)
      resetView()
    }
  }

  const handleWheel = (event: WheelEvent<SVGSVGElement>) => {
    event.preventDefault()
    const direction = event.deltaY > 0 ? -0.12 : 0.12
    const nextScale = clamp(view.scale + direction, 0.72, 2.4)
    setView((current) => ({
      ...current,
      scale: nextScale,
    }))
  }

  const handlePointerDown = (event: PointerEvent<SVGSVGElement>) => {
    if (event.button !== 0) return
    const target = event.target as Element
    if (target.closest("[data-node-id], [data-edge-hover]")) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: view.x,
      originY: view.y,
    }
  }

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    setView((current) => ({
      ...current,
      x: drag.originX + event.clientX - drag.startX,
      y: drag.originY + event.clientY - drag.startY,
    }))
  }

  const handlePointerUp = (event: PointerEvent<SVGSVGElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) dragRef.current = null
  }

  return (
    <section id="constellation" className="relative mx-auto max-w-7xl px-6 py-20">
      <SectionHeading
        eyebrow="Bầu trời nhân vật"
        title="Chòm sao tri thức lịch sử"
        description="Một không gian tri thức có thể di chuyển qua nhân vật, sự kiện, triều đại và địa danh. Chọn một điểm để nhìn thấy các mối liên hệ trực tiếp."
      />

      <div
        ref={rootRef}
        className="relative mt-10 overflow-hidden rounded-3xl border border-border bg-card shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
        onKeyDown={handleKeyDown}
        tabIndex={0}
        aria-label="Bản đồ chòm sao lịch sử. Dùng phím mũi tên để chọn điểm kế tiếp."
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-35"
          style={{
            background:
              "radial-gradient(ellipse at 42% 44%, rgba(116,168,200,0.22), transparent 52%), radial-gradient(ellipse at 75% 70%, rgba(217,183,96,0.12), transparent 42%)",
          }}
        />

        <div className="absolute left-4 top-4 z-20 flex items-center gap-2">
          <IconButton action="reset" label="Reset view" onClick={resetView}>
            <RotateCcw className="size-4" />
          </IconButton>
          <IconButton action="zoom-in" label="Zoom in" onClick={() => setView((current) => ({ ...current, scale: clamp(current.scale + 0.18, 0.72, 2.4) }))}>
            <ZoomIn className="size-4" />
          </IconButton>
          <IconButton action="zoom-out" label="Zoom out" onClick={() => setView((current) => ({ ...current, scale: clamp(current.scale - 0.18, 0.72, 2.4) }))}>
            <ZoomOut className="size-4" />
          </IconButton>
          <IconButton label="Pan enabled" onClick={() => undefined}>
            <Move className="size-4" />
          </IconButton>
        </div>

        <div className="relative h-[44rem]">
          <svg
            data-constellation-map
            ref={svgRef}
            className="absolute inset-0 size-full cursor-grab touch-none active:cursor-grabbing"
            viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
          >
            <defs>
              <pattern id="constellation-grid" width="44" height="44" patternUnits="userSpaceOnUse">
                <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(116,168,200,0.12)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width={GRAPH_WIDTH} height={GRAPH_HEIGHT} fill="url(#constellation-grid)" opacity="0.65" />

            <g transform={`translate(${view.x} ${view.y}) scale(${view.scale})`}>
              {graphEdges.map((edge, index) => (
                <RelationshipEdge
                  key={`${edge.from}-${edge.to}`}
                  edge={edge}
                  highlighted={!!selectedId && (edge.from === selectedId || edge.to === selectedId)}
                  dimmed={!!selectedId && edge.from !== selectedId && edge.to !== selectedId}
                  hovered={hoveredEdge === index}
                  onHover={() => setHoveredEdge(index)}
                  onLeave={() => setHoveredEdge(null)}
                />
              ))}

              {hoveredEdge !== null && <EdgeLabel edge={graphEdges[hoveredEdge]} />}

              {graphNodes.map((node) => {
                const isSelected = node.id === selectedId
                const isConnected = connectedIds.has(node.id)
                const dim = !!selectedId && !isSelected && !isConnected
                return (
                  <GraphNodeMark
                    key={node.id}
                    node={node}
                    selected={isSelected}
                    connected={isConnected}
                    dim={dim}
                    inActivePath={activePathIds.has(node.id)}
                    onSelect={() => selectNode(isSelected ? null : node.id)}
                    visited={visitedIds.has(node.id)}
                  />
                )
              })}
            </g>
          </svg>

          <div className="pointer-events-none absolute inset-0">
            {graphNodes.map((node) => {
              const point = toPoint(node)
              const isSelected = node.id === selectedId
              return (
                <button
                  key={node.id}
                  data-node-hit-id={node.id}
                  type="button"
                  aria-label={`${kindLabel[node.kind]}: ${node.name}`}
                  aria-pressed={isSelected}
                  onClick={() => selectNode(isSelected ? null : node.id)}
                  className="pointer-events-auto absolute size-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/80"
                  style={{
                    left: `${((point.x * view.scale + view.x) / GRAPH_WIDTH) * 100}%`,
                    top: `${((point.y * view.scale + view.y) / GRAPH_HEIGHT) * 100}%`,
                  }}
                />
              )
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5 border-t border-border bg-card/80 px-5 py-3">
          {(Object.keys(kindLabel) as NodeKind[]).map((kind) => (
            <span key={kind} className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <LegendShape kind={kind} />
              {kindLabel[kind]}
            </span>
          ))}
          <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Search className="size-3.5 text-primary" />
            {graphNodes.length} điểm tri thức
          </span>
        </div>

        <AnimatePresence mode="wait">
          {selected && (
            <motion.aside
              key={selected.id}
              data-constellation-panel
              data-selected-node-id={selected.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.24 }}
              className="parchment-texture absolute bottom-20 right-4 top-4 z-30 w-80 overflow-hidden rounded-2xl border border-primary/40 bg-parchment text-parchment-foreground shadow-2xl"
            >
              <SidePanel
                node={selected}
                onClose={() => onSelect(null)}
                onOpenPath={onOpenPath}
                onOpenScene={onOpenScene}
                onSelect={selectNode}
                visited={visitedIds.has(selected.id)}
              />
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

function RelationshipEdge({
  edge,
  highlighted,
  dimmed,
  hovered,
  onHover,
  onLeave,
}: {
  edge: GraphEdge
  highlighted: boolean
  dimmed: boolean
  hovered: boolean
  onHover: () => void
  onLeave: () => void
}) {
  const from = getNode(edge.from)
  const to = getNode(edge.to)
  if (!from || !to) return null
  const a = toPoint(from)
  const b = toPoint(to)

  return (
    <g>
      <line
        x1={a.x}
        y1={a.y}
        x2={b.x}
        y2={b.y}
        stroke={highlighted || hovered ? "#d9b760" : "#74a8c8"}
        strokeWidth={highlighted || hovered ? 2.2 : 1}
        strokeOpacity={dimmed ? 0.1 : highlighted || hovered ? 0.82 : 0.28}
      />
      <line
        data-edge-hover
        data-edge-label={edge.label}
        x1={a.x}
        y1={a.y}
        x2={b.x}
        y2={b.y}
        stroke="#ffffff"
        strokeOpacity={0.001}
        strokeWidth={18}
        pointerEvents="stroke"
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        onPointerEnter={onHover}
        onPointerLeave={onLeave}
      />
    </g>
  )
}

function EdgeLabel({ edge }: { edge: GraphEdge }) {
  const from = getNode(edge.from)
  const to = getNode(edge.to)
  if (!from || !to) return null
  const a = toPoint(from)
  const b = toPoint(to)
  const x = (a.x + b.x) / 2
  const y = (a.y + b.y) / 2
  const width = Math.max(96, edge.label.length * 6.2 + 18)

  return (
    <g pointerEvents="none" transform={`translate(${x} ${y})`}>
      <rect x={-width / 2} y={-15} width={width} height={28} rx={7} fill="#111622" stroke="rgba(217,183,96,0.45)" />
      <text textAnchor="middle" y={4} fill="#f2dfb4" fontSize={12} fontWeight={600}>
        {edge.label}
      </text>
    </g>
  )
}

function GraphNodeMark({
  node,
  selected,
  connected,
  dim,
  inActivePath,
  onSelect,
  visited,
}: {
  node: GraphNode
  selected: boolean
  connected: boolean
  dim: boolean
  inActivePath: boolean
  onSelect: () => void
  visited: boolean
}) {
  const point = toPoint(node)
  const color = kindColor[node.kind]
  const labelLines = splitLabel(node.name)

  return (
    <g
      data-node-id={node.id}
      role="button"
      tabIndex={0}
      aria-label={`${kindLabel[node.kind]}: ${node.name}`}
      aria-pressed={selected}
      transform={`translate(${point.x} ${point.y})`}
      opacity={dim ? 0.22 : 1}
      onClick={(event) => {
        event.stopPropagation()
        onSelect()
      }}
      onPointerDown={(event) => {
        event.stopPropagation()
        onSelect()
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onSelect()
        }
      }}
      className="cursor-pointer outline-none"
    >
      {selected && <circle r={34} fill="none" stroke="#d9b760" strokeOpacity={0.42} strokeWidth={2} />}
      {inActivePath && !selected && (
        <circle r={33} fill="none" stroke="#d9b760" strokeDasharray="4 5" strokeOpacity={0.46} strokeWidth={1.6} />
      )}
      {connected && !selected && <circle r={28} fill="none" stroke={color} strokeOpacity={0.25} strokeWidth={1.5} />}
      <NodeShape kind={node.kind} color={color} selected={selected} />
      {visited && <circle cx={18} cy={-18} r={5.5} fill="#d9b760" stroke="#050914" strokeWidth={2} />}
      <text
        textAnchor="middle"
        y={selected ? 40 : 36}
        fill={selected ? "#f8f3df" : "#dce4e8"}
        fontSize={selected ? 13 : 11}
        fontWeight={selected ? 700 : 600}
        paintOrder="stroke"
        stroke="#050914"
        strokeWidth={4}
        strokeLinejoin="round"
      >
        {labelLines.map((line, index) => (
          <tspan key={line} x={0} dy={index === 0 ? 0 : 14}>
            {line}
          </tspan>
        ))}
      </text>
      <circle
        r={50}
        fill="transparent"
        stroke="transparent"
        pointerEvents="none"
      />
    </g>
  )
}

function NodeShape({ kind, color, selected }: { kind: NodeKind; color: string; selected: boolean }) {
  const stroke = selected ? "#f2dfb4" : "rgba(5,9,20,0.95)"
  const strokeWidth = selected ? 3 : 2

  if (kind === "person") {
    return <circle r={selected ? 17 : 14} fill={color} stroke={stroke} strokeWidth={strokeWidth} />
  }
  if (kind === "event") {
    const r = selected ? 20 : 16
    return <polygon points={`0,-${r} ${r},0 0,${r} -${r},0`} fill={color} stroke={stroke} strokeWidth={strokeWidth} />
  }
  if (kind === "dynasty") {
    const r = selected ? 20 : 16
    const points = Array.from({ length: 6 })
      .map((_, index) => {
        const angle = Math.PI / 6 + (index * Math.PI) / 3
        return `${Math.cos(angle) * r},${Math.sin(angle) * r}`
      })
      .join(" ")
    return <polygon points={points} fill={color} stroke={stroke} strokeWidth={strokeWidth} />
  }
  return (
    <path
      d={selected ? "M0 -21 C12 -21 21 -12 21 0 C21 14 0 27 0 27 C0 27 -21 14 -21 0 C-21 -12 -12 -21 0 -21 Z" : "M0 -17 C10 -17 17 -10 17 0 C17 12 0 23 0 23 C0 23 -17 12 -17 0 C-17 -10 -10 -17 0 -17 Z"}
      fill={color}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  )
}

function LegendShape({ kind }: { kind: NodeKind }) {
  const color = kindColor[kind]
  return (
    <svg width="18" height="18" viewBox="-12 -12 24 24" aria-label={kindShapeLabel[kind]}>
      <NodeShape kind={kind} color={color} selected={false} />
    </svg>
  )
}

function SidePanel({
  node,
  onClose,
  onOpenPath,
  onOpenScene,
  onSelect,
  visited,
}: {
  node: GraphNode
  onClose: () => void
  onOpenPath?: (pathId: string) => void
  onOpenScene?: (nodeId: string) => void
  onSelect: (id: string) => void
  visited: boolean
}) {
  const related = getRelatedGroups(node.id)
  const relatedPath = getPrimaryPathForNode(node.id)
  const canOpenScene = node.id === "bach-dang-1288"

  return (
    <div className="relative flex h-full flex-col">
      <div className="flex items-start justify-between gap-3 border-b border-primary/20 p-5">
        <div>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-background"
            style={{ background: kindColor[node.kind] }}
          >
            {kindIcon[node.kind]}
            {kindLabel[node.kind]}
          </span>
          <h3 className="font-heading mt-2 text-xl font-semibold leading-tight">{node.name}</h3>
          <p className="mt-0.5 text-sm text-parchment-foreground/70">{node.period}</p>
          {visited && <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-primary">Đã ghé trong hành trình</p>}
        </div>
        <button
          data-panel-close
          onClick={onClose}
          aria-label="Đóng bảng thông tin"
          className="shrink-0 rounded-md p-1 text-parchment-foreground/60 hover:bg-parchment-foreground/10 hover:text-parchment-foreground"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <p className="text-sm leading-relaxed text-parchment-foreground/85">{node.summary}</p>

        {(relatedPath || canOpenScene) && (
          <div className="mt-5 flex flex-col gap-2">
            {relatedPath && (
              <button
                type="button"
                data-open-path-id={relatedPath.id}
                onClick={() => onOpenPath?.(relatedPath.id)}
                className="inline-flex items-center justify-between gap-3 rounded-lg border border-parchment-foreground/20 bg-parchment-foreground/5 px-3 py-2 text-left text-sm font-semibold text-parchment-foreground transition-colors hover:border-parchment-foreground/40 hover:bg-parchment-foreground/10"
              >
                <span>Mở hành trình: {relatedPath.title}</span>
                <ArrowUpRight className="size-4 shrink-0 opacity-60" />
              </button>
            )}
            {canOpenScene && (
              <button
                type="button"
                data-open-scene-node-id={node.id}
                onClick={() => onOpenScene?.(node.id)}
                className="inline-flex items-center justify-between gap-3 rounded-lg border border-primary/35 bg-primary/10 px-3 py-2 text-left text-sm font-semibold text-parchment-foreground transition-colors hover:bg-primary/15"
              >
                <span>Vào cảnh 3D Bạch Đằng</span>
                <ArrowUpRight className="size-4 shrink-0 opacity-60" />
              </button>
            )}
          </div>
        )}

        <div className="mt-5 flex flex-col gap-4">
          {related.map((group) => (
            <div key={group.kind}>
              <p className="text-xs font-semibold uppercase tracking-wide text-parchment-foreground/60">
                {kindLabel[group.kind]} liên quan
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {group.nodes.map((target) => (
                  <button
                    key={target.id}
                    data-related-node-id={target.id}
                    onClick={() => onSelect(target.id)}
                    className="group inline-flex max-w-full items-center gap-1 rounded-lg border border-parchment-foreground/20 bg-parchment-foreground/5 px-2.5 py-1 text-left text-xs font-medium text-parchment-foreground transition-colors hover:border-parchment-foreground/40 hover:bg-parchment-foreground/10"
                  >
                    <span className="inline-flex size-3 shrink-0 items-center justify-center">{kindIcon[target.kind]}</span>
                    <span className="truncate">{target.name}</span>
                    <ArrowUpRight className="size-3 shrink-0 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function IconButton({
  action,
  label,
  onClick,
  children,
}: {
  action?: string
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      data-view-action={action}
      aria-label={label}
      title={label}
      onClick={onClick}
      className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-card/75 text-muted-foreground backdrop-blur transition-colors hover:border-primary/50 hover:text-foreground"
    >
      {children}
    </button>
  )
}

function getRelatedGroups(id: string) {
  const relatedIds = new Set<string>()
  graphEdges.forEach((edge) => {
    if (edge.from === id) relatedIds.add(edge.to)
    if (edge.to === id) relatedIds.add(edge.from)
  })

  return (Object.keys(kindLabel) as NodeKind[])
    .map((kind) => ({
      kind,
      nodes: [...relatedIds]
        .map((relatedId) => getNode(relatedId))
        .filter((node): node is GraphNode => !!node && node.kind === kind)
        .sort((a, b) => a.name.localeCompare(b.name, "vi")),
    }))
    .filter((group) => group.nodes.length > 0)
}

function getPrimaryPathForNode(nodeId: string) {
  if (nodeId === "tran-hung-dao") return explorationPaths.find((path) => path.id === "path-bachdang") ?? null
  return explorationPaths.find((path) => path.nodeIds.includes(nodeId)) ?? null
}

function toPoint(node: GraphNode) {
  return {
    x: (node.x / 100) * GRAPH_WIDTH,
    y: (node.y / 100) * GRAPH_HEIGHT,
  }
}

function splitLabel(label: string) {
  const words = label.split(" ")
  if (label.length <= 16 || words.length <= 2) return [label]

  const lines = ["", ""]
  words.forEach((word) => {
    const target = lines[0].length <= lines[1].length ? 0 : 1
    lines[target] = `${lines[target]} ${word}`.trim()
  })
  return lines.filter(Boolean)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

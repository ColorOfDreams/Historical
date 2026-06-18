"use client"

import { useEffect, useMemo, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Html, OrbitControls } from "@react-three/drei"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Info, Layers, MapPin, MousePointerClick, Move3d, Waves, X, ZoomIn } from "lucide-react"
import * as THREE from "three"
import { create } from "zustand"
import { battleHotspots, battleTimeline, type Hotspot } from "@/lib/history-data"

export type StageId = (typeof battleTimeline)[number]["id"]

interface StageVisual {
  id: StageId
  sky: string
  fog: string
  water: string
  ambient: number
  sun: number
  sunColor: string
  waterLevel: number
  stakeReveal: number
  enemyFleet: number
  vietFleet: number
  ambush: number
  focusHotspot: string
}

interface BattleSceneState {
  activeStage: StageId
  activeHotspotId: string | null
  setStage: (stage: StageId) => void
  setHotspot: (hotspotId: string | null) => void
}

const useBattleSceneStore = create<BattleSceneState>((set) => ({
  activeStage: battleTimeline[0].id,
  activeHotspotId: null,
  setStage: (activeStage) => set({ activeStage, activeHotspotId: null }),
  setHotspot: (activeHotspotId) => set({ activeHotspotId }),
}))

const stageVisuals: StageVisual[] = [
  {
    id: "stage-1",
    sky: "#060b18",
    fog: "#091427",
    water: "#0b3341",
    ambient: 0.34,
    sun: 0.78,
    sunColor: "#9eb7ff",
    waterLevel: 0.1,
    stakeReveal: 0.24,
    enemyFleet: 0.08,
    vietFleet: 0.25,
    ambush: 0.05,
    focusHotspot: "hs-stakes",
  },
  {
    id: "stage-2",
    sky: "#15253a",
    fog: "#18334a",
    water: "#0d4650",
    ambient: 0.38,
    sun: 0.85,
    sunColor: "#f2c47d",
    waterLevel: 0.18,
    stakeReveal: 0.12,
    enemyFleet: 0.92,
    vietFleet: 0.58,
    ambush: 0.08,
    focusHotspot: "hs-fleet",
  },
  {
    id: "stage-3",
    sky: "#1b1716",
    fog: "#3b2620",
    water: "#12333a",
    ambient: 0.3,
    sun: 1.2,
    sunColor: "#ff9a56",
    waterLevel: -0.14,
    stakeReveal: 1,
    enemyFleet: 1,
    vietFleet: 1,
    ambush: 0.62,
    focusHotspot: "hs-command",
  },
  {
    id: "stage-4",
    sky: "#111a25",
    fog: "#203246",
    water: "#0e3f4a",
    ambient: 0.44,
    sun: 0.95,
    sunColor: "#f4d28b",
    waterLevel: -0.06,
    stakeReveal: 0.9,
    enemyFleet: 0.35,
    vietFleet: 0.82,
    ambush: 1,
    focusHotspot: "hs-ambush",
  },
]

const hotspotPositions: Record<string, [number, number, number]> = {
  "hs-stakes": [-2.3, 0.72, 2.4],
  "hs-fleet": [1.25, 0.88, -1.6],
  "hs-command": [4.45, 1.48, -4.8],
  "hs-ambush": [-4.65, 1.05, -3.1],
}

const stakePositions = [
  [-2.8, 2.8, -0.15],
  [-2.15, 2.55, 0.12],
  [-1.42, 2.85, -0.28],
  [-0.75, 2.46, 0.08],
  [-0.1, 2.72, -0.18],
  [0.62, 2.42, 0.2],
  [1.32, 2.68, -0.1],
  [2.04, 2.34, 0.16],
  [-2.42, 1.86, 0.2],
  [-1.64, 1.68, -0.16],
  [-0.92, 1.9, 0.04],
  [-0.18, 1.58, -0.22],
  [0.56, 1.78, 0.18],
  [1.25, 1.52, -0.08],
  [2.02, 1.74, 0.12],
] as const

const enemyBoats = [
  [1.1, -2.4, -0.2],
  [2.25, -0.8, 0.08],
  [0.3, -3.7, 0.18],
  [-0.8, -1.45, -0.12],
] as const

const vietBoats = [
  [-3.2, 3.2, -0.15],
  [-3.75, -2.7, 0.18],
  [3.15, 3.4, -0.05],
] as const

interface SpaceSceneProps {
  focusStageId?: StageId
  focusHotspotId?: string | null
  onHotspotChange?: (hotspotId: string | null) => void
  onStageChange?: (stageId: StageId) => void
}

export function SpaceScene({
  focusStageId,
  focusHotspotId,
  onHotspotChange,
  onStageChange,
}: SpaceSceneProps = {}) {
  const prefersReducedMotion = useReducedMotion()
  const activeStage = useBattleSceneStore((state) => state.activeStage)
  const activeHotspotId = useBattleSceneStore((state) => state.activeHotspotId)
  const setStage = useBattleSceneStore((state) => state.setStage)
  const setHotspot = useBattleSceneStore((state) => state.setHotspot)

  useEffect(() => {
    if (focusStageId && focusStageId !== activeStage) setStage(focusStageId)
  }, [activeStage, focusStageId, setStage])

  useEffect(() => {
    if (focusHotspotId !== undefined && focusHotspotId !== activeHotspotId) setHotspot(focusHotspotId)
  }, [activeHotspotId, focusHotspotId, setHotspot])

  const handleStageChange = (stageId: StageId) => {
    setStage(stageId)
    onStageChange?.(stageId)
    onHotspotChange?.(null)
  }

  const handleHotspotChange = (hotspotId: string | null) => {
    setHotspot(hotspotId)
    onHotspotChange?.(hotspotId)
  }

  const stageIndex = Math.max(
    0,
    battleTimeline.findIndex((s) => s.id === activeStage),
  )
  const stage = battleTimeline[stageIndex]
  const visual = stageVisuals[stageIndex]
  const activeHotspot = activeHotspotId
    ? battleHotspots.find((h) => h.id === activeHotspotId) ?? null
    : null

  return (
    <section id="space-scene" className="relative mx-auto max-w-7xl px-6 py-20">
      <SectionHeading
        eyebrow="Không gian lịch sử 3D"
        title="Trận Bạch Đằng — năm 1288"
        description="Khám phá chiến trường mô phỏng ba chiều. Xoay góc nhìn, theo dõi thủy triều, chọn cọc gỗ, thuyền chiến và các điểm chỉ huy để mở bảng thông tin nổi."
      />

      <div className="relative mt-10 overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        <div className="relative aspect-[16/9] w-full bg-[#050914]">
          <Canvas
            shadows
            dpr={[1, 1.65]}
            camera={{ position: [0, 6.6, 11.5], fov: 45 }}
            fallback={<NonWebGLFallback stage={stage} />}
          >
              <BattleSceneCanvas
                activeHotspotId={activeHotspotId}
              onSelectHotspot={handleHotspotChange}
              prefersReducedMotion={!!prefersReducedMotion}
              stageIndex={stageIndex}
              visual={visual}
            />
          </Canvas>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/35 via-transparent to-background/10" />

          <div className="absolute left-4 top-4 flex flex-col gap-2">
            <ControlHint icon={<Move3d className="size-3.5" />} label="Kéo để xoay góc nhìn" />
            <ControlHint icon={<ZoomIn className="size-3.5" />} label="Cuộn để phóng to" />
            <ControlHint icon={<Layers className="size-3.5" />} label="Thủy triều, cọc gỗ, đội thuyền" />
          </div>

          <div className="absolute right-4 top-4 max-w-xs rounded-lg border border-border bg-card/75 p-3 backdrop-blur">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-primary">
              <Waves className="size-3.5" />
              Bối cảnh hiện tại
            </div>
            <p className="mt-1 font-heading text-base font-semibold text-foreground">{stage.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{stage.description}</p>
          </div>

          <AnimatePresence>
            {activeHotspot && (
              <motion.div
                data-active-hotspot-id={activeHotspot.id}
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
                className="parchment-texture absolute bottom-4 right-4 w-72 rounded-2xl border border-primary/40 bg-parchment p-4 text-parchment-foreground shadow-xl"
              >
                <button
                  onClick={() => handleHotspotChange(null)}
                  aria-label="Đóng bảng thông tin"
                  className="absolute right-3 top-3 text-parchment-foreground/60 hover:text-parchment-foreground"
                >
                  <X className="size-4" />
                </button>
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-parchment-foreground/70">
                  <Info className="size-3.5" />
                  Điểm đánh dấu
                </div>
                <h4 className="font-heading mt-1 text-lg font-semibold">{activeHotspot.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-parchment-foreground/80">
                  {activeHotspot.detail}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">
            <MousePointerClick className="size-3.5 text-primary" />
            Chọn một mốc phát sáng trong cảnh 3D
          </div>
        </div>

        <div className="border-t border-border bg-card/80 p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-primary">
                {stage.year}
              </p>
              <h4 className="font-heading text-lg font-semibold text-foreground">{stage.label}</h4>
            </div>
            <p className="hidden max-w-md text-sm leading-relaxed text-muted-foreground md:block">
              {stage.description}
            </p>
          </div>

          <div className="relative flex items-center justify-between gap-2">
            <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-border" />
            {battleTimeline.map((s, index) => {
              const active = s.id === activeStage
              const revealed = index <= stageIndex
              return (
                <button
                  key={s.id}
                  data-stage-id={s.id}
                  onClick={() => handleStageChange(s.id)}
                  className="relative flex flex-1 flex-col items-center gap-2"
                >
                  <span
                    className={`size-4 rounded-full border-2 transition-all ${
                      active
                        ? "scale-125 border-primary bg-primary shadow-[0_0_16px_var(--glow)]"
                        : revealed
                          ? "border-primary/60 bg-card hover:border-primary"
                          : "border-muted-foreground bg-card hover:border-primary"
                    }`}
                  />
                  <span
                    className={`text-center text-xs transition-colors ${
                      active ? "font-medium text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {s.year}
                  </span>
                </button>
              )
            })}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:hidden">
            {stage.description}
          </p>
        </div>
      </div>
    </section>
  )
}

function BattleSceneCanvas({
  activeHotspotId,
  onSelectHotspot,
  prefersReducedMotion,
  stageIndex,
  visual,
}: {
  activeHotspotId: string | null
  onSelectHotspot: (id: string | null) => void
  prefersReducedMotion: boolean
  stageIndex: number
  visual: StageVisual
}) {
  return (
    <>
      <color attach="background" args={[visual.sky]} />
      <fog attach="fog" args={[visual.fog, 9, 28]} />
      <ambientLight intensity={visual.ambient} />
      <hemisphereLight color="#9bb6d6" groundColor="#172014" intensity={0.36} />
      <directionalLight
        castShadow
        color={visual.sunColor}
        intensity={visual.sun}
        position={[-5, 8, 5]}
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight color="#d8b166" intensity={stageIndex === 0 ? 1.8 : 0.55} position={[-2.8, 1.1, 3.1]} />

      <LowPolyBanks />
      <WaterPlane color={visual.water} level={visual.waterLevel} paused={prefersReducedMotion} />
      <Stakes reveal={visual.stakeReveal} waterLevel={visual.waterLevel} />
      <Fleet opacity={visual.enemyFleet} side="enemy" stageIndex={stageIndex} />
      <Fleet opacity={visual.vietFleet} side="viet" stageIndex={stageIndex} />
      <AmbushMarkers opacity={visual.ambush} />
      <BattleHotspots
        activeHotspotId={activeHotspotId}
        focusHotspotId={visual.focusHotspot}
        onSelectHotspot={onSelectHotspot}
        stageIndex={stageIndex}
      />

      <OrbitControls
        enableDamping={!prefersReducedMotion}
        enablePan={false}
        maxDistance={15.5}
        maxPolarAngle={Math.PI / 2.35}
        minDistance={6.8}
        minPolarAngle={Math.PI / 5}
        target={[0, 0.35, 0]}
      />
    </>
  )
}

function LowPolyBanks() {
  return (
    <group>
      <mesh receiveShadow position={[-5.7, -0.24, 0]} rotation={[0, 0.08, 0]}>
        <boxGeometry args={[4.5, 0.7, 24]} />
        <meshStandardMaterial color="#25301f" roughness={0.95} />
      </mesh>
      <mesh receiveShadow position={[5.75, -0.28, 0]} rotation={[0, -0.08, 0]}>
        <boxGeometry args={[4.7, 0.75, 24]} />
        <meshStandardMaterial color="#202d23" roughness={0.95} />
      </mesh>
      <mesh receiveShadow position={[-4.6, 0.14, -4.1]} rotation={[0, 0.28, 0]}>
        <boxGeometry args={[2.2, 0.7, 5.5]} />
        <meshStandardMaterial color="#34402a" roughness={0.9} />
      </mesh>
      <mesh receiveShadow position={[4.55, 0.28, -4.85]} rotation={[0, -0.32, 0]}>
        <boxGeometry args={[2.6, 1, 5]} />
        <meshStandardMaterial color="#3d3c28" roughness={0.9} />
      </mesh>
      {[
        [-6.8, 0.75, -8, 2.8],
        [6.6, 0.8, -8.8, 3.1],
        [-7.1, 0.55, 6.4, 2.2],
        [7.2, 0.62, 5.9, 2.4],
      ].map(([x, y, z, scale]) => (
        <mesh key={`${x}-${z}`} receiveShadow position={[x, y, z]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[scale, scale * 1.2, 4]} />
          <meshStandardMaterial color="#182820" roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  )
}

function WaterPlane({ color, level, paused }: { color: string; level: number; paused: boolean }) {
  const geometryRef = useRef<THREE.PlaneGeometry>(null)

  useFrame(({ clock }) => {
    if (paused || !geometryRef.current) return
    const time = clock.elapsedTime
    const position = geometryRef.current.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < position.count; i += 1) {
      const x = position.getX(i)
      const y = position.getY(i)
      position.setZ(i, Math.sin(x * 1.5 + time * 0.8) * 0.035 + Math.cos(y * 0.9 + time * 0.55) * 0.025)
    }
    position.needsUpdate = true
    geometryRef.current.computeVertexNormals()
  })

  return (
    <group position={[0, level, 0]}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry ref={geometryRef} args={[8.4, 24, 28, 36]} />
        <meshStandardMaterial color={color} metalness={0.08} opacity={0.82} roughness={0.36} transparent />
      </mesh>
      {[-3.2, -1.4, 0.4, 2.4, 4.3].map((z, index) => (
        <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[index % 2 ? 0.6 : -0.5, 0.035, z]}>
          <ringGeometry args={[1.2, 1.24, 36]} />
          <meshBasicMaterial color="#8ac3c0" opacity={0.16} transparent />
        </mesh>
      ))}
    </group>
  )
}

function Stakes({ reveal, waterLevel }: { reveal: number; waterLevel: number }) {
  return (
    <group>
      {stakePositions.map(([x, z, tilt], index) => {
        const height = 1.05 + (index % 3) * 0.18
        const y = waterLevel - 0.34 + reveal * 0.72
        return (
          <group key={`${x}-${z}`} position={[x, y, z]} rotation={[tilt, 0, tilt * 0.6]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.045, 0.075, height, 6]} />
              <meshStandardMaterial color="#5b361d" roughness={0.85} />
            </mesh>
            <mesh castShadow position={[0, height / 2 + 0.09, 0]}>
              <coneGeometry args={[0.08, 0.22, 6]} />
              <meshStandardMaterial color="#332016" roughness={0.9} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

function Fleet({ opacity, side, stageIndex }: { opacity: number; side: "enemy" | "viet"; stageIndex: number }) {
  const boats = side === "enemy" ? enemyBoats : vietBoats
  const color = side === "enemy" ? "#17100d" : "#321710"
  const sailColor = side === "enemy" ? "#211814" : "#70331f"

  return (
    <group visible={opacity > 0.04}>
      {boats.map(([x, z, rotation], index) => {
        const sinking = side === "enemy" && stageIndex === 3 && index > 0
        return (
          <Boat
            key={`${side}-${x}-${z}`}
            color={color}
            opacity={opacity}
            position={[x, 0.18 - (sinking ? 0.16 : 0), z]}
            rotationY={rotation + (side === "enemy" ? -0.15 : 0.32)}
            sailColor={sailColor}
            sinking={sinking}
          />
        )
      })}
    </group>
  )
}

function Boat({
  color,
  opacity,
  position,
  rotationY,
  sailColor,
  sinking,
}: {
  color: string
  opacity: number
  position: [number, number, number]
  rotationY: number
  sailColor: string
  sinking: boolean
}) {
  return (
    <group position={position} rotation={[sinking ? 0.22 : 0, rotationY, sinking ? -0.22 : 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.56, 0.22, 1.55]} />
        <meshStandardMaterial color={color} opacity={opacity} roughness={0.92} transparent />
      </mesh>
      <mesh castShadow position={[0, 0.05, 0.84]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.28, 0.45, 4]} />
        <meshStandardMaterial color={color} opacity={opacity} roughness={0.92} transparent />
      </mesh>
      <mesh castShadow position={[0, 0.05, -0.84]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.28, 0.45, 4]} />
        <meshStandardMaterial color={color} opacity={opacity} roughness={0.92} transparent />
      </mesh>
      <mesh castShadow position={[0, 0.72, -0.1]}>
        <cylinderGeometry args={[0.025, 0.025, 1.2, 6]} />
        <meshStandardMaterial color="#352116" opacity={opacity} transparent />
      </mesh>
      <mesh castShadow position={[0.14, 0.78, -0.08]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.35, 0.75, 3]} />
        <meshStandardMaterial color={sailColor} opacity={opacity * 0.86} roughness={0.94} transparent />
      </mesh>
    </group>
  )
}

function AmbushMarkers({ opacity }: { opacity: number }) {
  return (
    <group visible={opacity > 0.04}>
      {[
        [-4.5, -3.5],
        [-5.05, -2.6],
        [4.55, -3.2],
        [5.15, -2.15],
      ].map(([x, z]) => (
        <group key={`${x}-${z}`} position={[x, 0.48, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.9, 6]} />
            <meshStandardMaterial color="#3a2317" opacity={opacity} transparent />
          </mesh>
          <mesh castShadow position={[0.13, 0.28, 0]}>
            <boxGeometry args={[0.28, 0.18, 0.035]} />
            <meshStandardMaterial color="#8a2f24" opacity={opacity} transparent />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function BattleHotspots({
  activeHotspotId,
  focusHotspotId,
  onSelectHotspot,
  stageIndex,
}: {
  activeHotspotId: string | null
  focusHotspotId: string
  onSelectHotspot: (id: string | null) => void
  stageIndex: number
}) {
  return (
    <group>
      {battleHotspots.map((hotspot) => {
        const hotspotStageIndex = battleTimeline.findIndex((s) => s.id === hotspot.stageId)
        const isActive = activeHotspotId === hotspot.id
        const isCurrent = focusHotspotId === hotspot.id
        const revealed = hotspotStageIndex <= stageIndex
        return (
          <HotspotMarker
            key={hotspot.id}
            hotspot={hotspot}
            isActive={isActive}
            isCurrent={isCurrent}
            onSelect={() => onSelectHotspot(isActive ? null : hotspot.id)}
            position={hotspotPositions[hotspot.id]}
            revealed={revealed}
          />
        )
      })}
    </group>
  )
}

function HotspotMarker({
  hotspot,
  isActive,
  isCurrent,
  onSelect,
  position,
  revealed,
}: {
  hotspot: Hotspot
  isActive: boolean
  isCurrent: boolean
  onSelect: () => void
  position: [number, number, number]
  revealed: boolean
}) {
  const ringRef = useRef<THREE.Mesh>(null)
  const opacity = revealed ? 1 : 0.34

  useFrame(({ clock }) => {
    if (!ringRef.current) return
    ringRef.current.rotation.z = clock.elapsedTime * 1.2
    const pulse = 1 + Math.sin(clock.elapsedTime * 2.6) * 0.08
    ringRef.current.scale.setScalar(isCurrent || isActive ? pulse : 1)
  })

  return (
    <group position={position}>
      <mesh
        castShadow
        onClick={(event) => {
          event.stopPropagation()
          onSelect()
        }}
        onPointerOut={() => {
          document.body.style.cursor = ""
        }}
        onPointerOver={(event) => {
          event.stopPropagation()
          document.body.style.cursor = "pointer"
        }}
      >
        <sphereGeometry args={[isActive ? 0.16 : 0.12, 16, 16]} />
        <meshStandardMaterial
          color={isActive ? "#f1d27a" : isCurrent ? "#d9b65d" : "#8fb7c9"}
          emissive={isActive || isCurrent ? "#d9b65d" : "#29475c"}
          emissiveIntensity={revealed ? 1.2 : 0.35}
          opacity={opacity}
          transparent
        />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.28, 0.012, 8, 32]} />
        <meshBasicMaterial color={isCurrent ? "#f1d27a" : "#8fb7c9"} opacity={revealed ? 0.72 : 0.28} transparent />
      </mesh>
      {(isCurrent || isActive) && (
        <Html center distanceFactor={8} position={[0, 0.42, 0]}>
          <button
            data-hotspot-id={hotspot.id}
            onClick={(event) => {
              event.stopPropagation()
              onSelect()
            }}
            className="inline-flex items-center gap-1 rounded-md border border-primary/50 bg-background/80 px-2 py-1 text-[11px] font-medium text-foreground shadow-lg backdrop-blur"
          >
            <MapPin className="size-3 text-primary" />
            {hotspot.title}
          </button>
        </Html>
      )}
    </group>
  )
}

function NonWebGLFallback({ stage }: { stage: (typeof battleTimeline)[number] }) {
  return (
    <div className="flex h-full min-h-[28rem] items-center justify-center bg-[#08111f] p-6 text-center">
      <div className="max-w-md rounded-2xl border border-border bg-card/80 p-6 text-foreground">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">Chế độ không WebGL</p>
        <h3 className="font-heading mt-2 text-xl font-semibold">{stage.label}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Trình duyệt hiện không thể khởi tạo WebGL. Bạn vẫn có thể theo dõi timeline và đọc các mốc thông tin của trận Bạch Đằng.
        </p>
      </div>
    </div>
  )
}

function ControlHint({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card/70 px-2.5 py-1 text-xs text-muted-foreground backdrop-blur">
      {icon}
      {label}
    </span>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      <h2 className="font-heading mt-2 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}

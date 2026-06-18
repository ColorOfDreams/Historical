"use client"

import { useEffect, useState } from "react"

interface Star {
  left: string
  top: string
  size: number
  delay: string
  duration: string
}

export function Starfield({ count = 60 }: { count?: number }) {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    setStars(
      Array.from({ length: count }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 2 + 1,
        delay: `${Math.random() * 3}s`,
        duration: `${2 + Math.random() * 3}s`,
      })),
    )
  }, [count])

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((s, i) => (
        <span
          key={i}
          className="star-twinkle absolute rounded-full bg-foreground"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        />
      ))}
    </div>
  )
}

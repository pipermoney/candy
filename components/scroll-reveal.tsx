"use client"

import type { ReactNode } from "react"

interface ScrollRevealProps {
  children: ReactNode
  delay?: number
  direction?: "up" | "down" | "left" | "right"
}

export default function ScrollReveal({ children }: ScrollRevealProps) {
  // Simplified version without animations
  return <div className="opacity-100">{children}</div>
}

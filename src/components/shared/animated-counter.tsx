"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useSpring, useTransform } from "framer-motion"

interface AnimatedCounterProps {
  value: number
  className?: string
  prefix?: string
  suffix?: string
  duration?: number
}

export function AnimatedCounter({
  value,
  className,
  prefix = "",
  suffix = "",
  duration = 1,
}: AnimatedCounterProps) {
  const spring = useSpring(0, { duration: duration * 1000 })
  const display = useTransform(spring, (current) =>
    new Intl.NumberFormat("en-US").format(Math.round(current))
  )

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return (
    <span className={className}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  )
}

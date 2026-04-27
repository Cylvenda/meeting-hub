"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "./theme-provider"

interface ThemeToggleProps {
  className?: string
  compact?: boolean
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setMounted(true)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [])

  const isDark = theme === "dark"

  return (
    <Button
      size={"icon-lg"}
      className={cn(
        "shrink-0 rounded-md border-border bg-chart-3 ",
        className
      )}
      onClick={toggleTheme}
      aria-label={
        !mounted
          ? "Toggle theme"
          : isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
      }
      title={
        !mounted
          ? "Toggle theme"
          : isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
      }
    >
      {!mounted ? <Moon /> : isDark ? <Sun /> : <Moon />}
    </Button>
  )
}

"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { gsap } from "gsap"

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const [mounted, setMounted] = React.useState(false)

  // Only show the toggle after mounting to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = React.useCallback(() => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark"
    setTheme(newTheme)

    // Debug log to verify theme change
    console.log(`Theme changed to: ${newTheme}`)
  }, [setTheme, resolvedTheme])

  React.useEffect(() => {
    if (buttonRef.current && mounted) {
      gsap.fromTo(
        buttonRef.current,
        { rotate: 0 },
        {
          rotate: resolvedTheme === "dark" ? 360 : 0,
          duration: 0.5,
          ease: "power2.out",
        },
      )
    }
  }, [resolvedTheme, mounted])

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return <Button variant="outline" size="icon" className="rounded-full w-9 h-9" />
  }

  return (
    <Button
      ref={buttonRef}
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full w-9 h-9"
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
      data-theme-toggle="true"
      data-current-theme={resolvedTheme}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}


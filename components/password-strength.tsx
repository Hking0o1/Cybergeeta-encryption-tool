"use client"

import * as React from "react"
import { gsap } from "gsap"

interface PasswordStrengthProps {
  password: string
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const [strength, setStrength] = React.useState(0)
  const [feedback, setFeedback] = React.useState("")
  const progressRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!password) {
      setStrength(0)
      setFeedback("")
      return
    }

    // Calculate password strength
    let score = 0

    // Length check
    if (password.length >= 8) score += 20
    if (password.length >= 12) score += 10

    // Complexity checks
    if (/[A-Z]/.test(password)) score += 15 // Has uppercase
    if (/[a-z]/.test(password)) score += 15 // Has lowercase
    if (/[0-9]/.test(password)) score += 15 // Has number
    if (/[^A-Za-z0-9]/.test(password)) score += 25 // Has special char

    // Provide feedback
    let feedbackText = ""
    if (score < 30) {
      feedbackText = "Weak: Use a longer password with mixed characters"
    } else if (score < 60) {
      feedbackText = "Moderate: Add special characters and numbers"
    } else if (score < 80) {
      feedbackText = "Strong: Good password!"
    } else {
      feedbackText = "Very Strong: Excellent password!"
    }

    setStrength(score)
    setFeedback(feedbackText)
  }, [password])

  React.useEffect(() => {
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: `${strength}%`,
        duration: 0.5,
        ease: "power2.out",
      })
    }
  }, [strength])

  // Determine color based on strength
  const getColorClass = () => {
    if (strength < 30) return "bg-red-500"
    if (strength < 60) return "bg-yellow-500"
    if (strength < 80) return "bg-blue-500"
    return "bg-green-500"
  }

  if (!password) return null

  return (
    <div className="space-y-2 mt-2">
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div
          ref={progressRef}
          className={`h-full ${getColorClass()} transition-all`}
          style={{ width: `${strength}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">{feedback}</p>
    </div>
  )
}


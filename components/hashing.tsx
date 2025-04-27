"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Copy, Check, FileDigit } from "lucide-react"
import { gsap } from "gsap"

export default function Hashing() {
  const [text, setText] = useState("")
  const [hashType, setHashType] = useState("SHA-256")
  const [hash, setHash] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const hashButtonRef = useRef<HTMLButtonElement>(null)
  const hashResultRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Animate hash result when it appears
    if (hashResultRef.current && hash) {
      gsap.from(hashResultRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      })
    }
  }, [hash])

  async function generateHash() {
    try {
      setError("")

      if (!text) {
        throw new Error("Please enter text to hash")
      }

      // Animate hash button
      if (hashButtonRef.current) {
        gsap.to(hashButtonRef.current, {
          scale: 1.05,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
        })
      }

      const encoder = new TextEncoder()
      const data = encoder.encode(text)

      // Generate hash
      const hashBuffer = await window.crypto.subtle.digest(hashType, data)

      // Convert to hex string
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

      setHash(hashHex)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hashing failed")
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(hash)
    setCopied(true)

    // Animate the copy button
    gsap.to(".copy-hash", {
      scale: 1.2,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
    })

    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="text">Text to Hash</Label>
        <Textarea
          id="text"
          placeholder="Enter text to generate a hash"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[100px] transition-all duration-200 focus:shadow-md"
        />
      </div>

      <div className="space-y-2">
        <Label>Hash Algorithm</Label>
        <RadioGroup value={hashType} onValueChange={setHashType} className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="SHA-256" id="sha256" />
            <Label htmlFor="sha256">SHA-256</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="SHA-512" id="sha512" />
            <Label htmlFor="sha512">SHA-512</Label>
          </div>
        </RadioGroup>
      </div>

      <Button
        ref={hashButtonRef}
        onClick={generateHash}
        className="flex items-center gap-2 transition-transform duration-200 hover:scale-105"
      >
        <FileDigit className="h-4 w-4" />
        Generate Hash
      </Button>

      {error && (
        <Alert variant="destructive" className="animate-shake">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {hash && (
        <div className="space-y-2" ref={hashResultRef}>
          <div className="flex justify-between items-center">
            <Label htmlFor="hash">{hashType} Hash</Label>
            <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 gap-1">
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 copy-hash" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <Textarea id="hash" value={hash} readOnly className="font-mono text-xs bg-muted/50" />
        </div>
      )}
    </div>
  )
}


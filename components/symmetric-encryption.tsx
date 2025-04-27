"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Lock, Unlock, Copy, Check, Eye, EyeOff } from "lucide-react"
import PasswordStrength from "@/components/password-strength"
import { gsap } from "gsap"

export default function SymmetricEncryption() {
  const [text, setText] = useState("")
  const [password, setPassword] = useState("")
  const [result, setResult] = useState("")
  const [isEncrypting, setIsEncrypting] = useState(false)
  const [isDecrypting, setIsDecrypting] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const formRef = useRef<HTMLDivElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Animate form elements on mount
    if (formRef.current) {
      gsap.from(formRef.current.children, {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.out",
      })
    }
  }, [])

  useEffect(() => {
    // Animate result when it appears
    if (resultRef.current && result) {
      gsap.from(resultRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      })
    }
  }, [result])

  // Function to derive key from password using PBKDF2 (as Argon2id is not available in Web Crypto API)
  async function deriveKey(password: string, salt: Uint8Array) {
    const encoder = new TextEncoder()
    const passwordBuffer = encoder.encode(password)

    // Import the password as a key
    const passwordKey = await window.crypto.subtle.importKey("raw", passwordBuffer, { name: "PBKDF2" }, false, [
      "deriveKey",
    ])

    // Derive a key using PBKDF2
    return window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      passwordKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"],
    )
  }

  async function encrypt() {
    try {
      setIsEncrypting(true)
      setError("")

      if (!text) {
        throw new Error("Please provide text to encrypt")
      }

      if (!password) {
        throw new Error("Please provide a password")
      }

      const encoder = new TextEncoder()
      const data = encoder.encode(text)

      // Generate a random salt
      const salt = window.crypto.getRandomValues(new Uint8Array(16))

      // Generate a random IV
      const iv = window.crypto.getRandomValues(new Uint8Array(12))

      // Derive key from password
      const key = await deriveKey(password, salt)

      // Encrypt the data
      const encryptedData = await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv,
        },
        key,
        data,
      )

      // Combine salt + iv + encrypted data
      const result = new Uint8Array(salt.length + iv.length + encryptedData.byteLength)
      result.set(salt, 0)
      result.set(iv, salt.length)
      result.set(new Uint8Array(encryptedData), salt.length + iv.length)

      // Convert to base64 for display
      setResult(btoa(String.fromCharCode(...result)))

      // Animate the lock icon
      gsap.to(".lock-icon", {
        rotate: 360,
        duration: 0.5,
        ease: "back.out",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Encryption failed")
    } finally {
      setIsEncrypting(false)
    }
  }

  async function decrypt() {
    try {
      setIsDecrypting(true)
      setError("")

      if (!result) {
        throw new Error("Please provide encrypted text to decrypt")
      }

      if (!password) {
        throw new Error("Please provide the password")
      }

      // Convert from base64
      const encryptedBytes = Uint8Array.from(atob(result), (c) => c.charCodeAt(0))

      // Extract salt, iv, and encrypted data
      const salt = encryptedBytes.slice(0, 16)
      const iv = encryptedBytes.slice(16, 28)
      const encryptedData = encryptedBytes.slice(28)

      // Derive key from password
      const key = await deriveKey(password, salt)

      // Decrypt the data
      const decryptedData = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv,
        },
        key,
        encryptedData,
      )

      // Decode the decrypted data
      const decoder = new TextDecoder()
      setText(decoder.decode(decryptedData))
      setResult("")

      // Animate the unlock icon
      gsap.to(".unlock-icon", {
        rotate: -360,
        duration: 0.5,
        ease: "back.out",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Decryption failed. Check your password and encrypted text.")
    } finally {
      setIsDecrypting(false)
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(result)
    setCopied(true)

    // Animate the copy button
    gsap.to(".copy-icon", {
      scale: 1.2,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
    })

    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6" ref={formRef}>
      <div className="space-y-2">
        <Label htmlFor="text">Text</Label>
        <Textarea
          id="text"
          placeholder="Enter text to encrypt or view decrypted text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[100px] transition-all duration-200 focus:shadow-md"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pr-10 transition-all duration-200 focus:shadow-md"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="sr-only">Toggle password visibility</span>
          </Button>
        </div>
        <PasswordStrength password={password} />
      </div>

      <div className="flex flex-wrap gap-4">
        <Button
          onClick={encrypt}
          disabled={isEncrypting || isDecrypting}
          className="flex items-center gap-2 transition-transform duration-200 hover:scale-105"
        >
          {isEncrypting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4 lock-icon" />}
          Encrypt
        </Button>

        <Button
          onClick={decrypt}
          disabled={isEncrypting || isDecrypting || !result}
          variant="outline"
          className="flex items-center gap-2 transition-transform duration-200 hover:scale-105"
        >
          {isDecrypting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Unlock className="h-4 w-4 unlock-icon" />}
          Decrypt
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="animate-shake">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <div className="space-y-2" ref={resultRef}>
          <div className="flex justify-between items-center">
            <Label htmlFor="result">Encrypted Result</Label>
            <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 gap-1">
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 copy-icon" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <Textarea id="result" value={result} readOnly className="font-mono text-xs min-h-[100px] bg-muted/50" />
        </div>
      )}
    </div>
  )
}


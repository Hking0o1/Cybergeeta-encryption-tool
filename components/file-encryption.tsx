"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload, Lock, Unlock, Eye, EyeOff } from "lucide-react"
import PasswordStrength from "@/components/password-strength"
import { gsap } from "gsap"

export default function FileEncryption() {
  const [password, setPassword] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isEncrypting, setIsEncrypting] = useState(false)
  const [isDecrypting, setIsDecrypting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Animate progress bar
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: `${progress}%`,
        duration: 0.5,
        ease: "power2.out",
      })
    }
  }, [progress])

  useEffect(() => {
    const dropZone = dropZoneRef.current

    if (!dropZone) return

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      dropZone.classList.add("border-primary")
    }

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      dropZone.classList.remove("border-primary")
    }

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      dropZone.classList.remove("border-primary")

      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        setSelectedFile(e.dataTransfer.files[0])

        // Animate the file name appearance
        gsap.from(".file-name", {
          y: 10,
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        })
      }
    }

    dropZone.addEventListener("dragover", handleDragOver)
    dropZone.addEventListener("dragleave", handleDragLeave)
    dropZone.addEventListener("drop", handleDrop)

    return () => {
      dropZone.removeEventListener("dragover", handleDragOver)
      dropZone.removeEventListener("dragleave", handleDragLeave)
      dropZone.removeEventListener("drop", handleDrop)
    }
  }, [])

  // Function to derive key from password
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
        iterations: 100000,
        hash: "SHA-256",
      },
      passwordKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"],
    )
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])

      // Animate the file name appearance
      gsap.from(".file-name", {
        y: 10,
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      })
    }
  }

  async function encryptFile() {
    try {
      if (!selectedFile) {
        throw new Error("Please select a file")
      }

      if (!password) {
        throw new Error("Please enter a password")
      }

      setIsEncrypting(true)
      setError("")
      setProgress(0)

      // Read the file
      const fileData = await readFileAsArrayBuffer(selectedFile)

      // Generate a random salt
      const salt = window.crypto.getRandomValues(new Uint8Array(16))

      // Generate a random IV
      const iv = window.crypto.getRandomValues(new Uint8Array(12))

      // Derive key from password
      const key = await deriveKey(password, salt)

      // Encrypt the file data
      const encryptedData = await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv,
        },
        key,
        fileData,
      )

      // Combine salt + iv + encrypted data
      const result = new Uint8Array(salt.length + iv.length + encryptedData.byteLength)
      result.set(salt, 0)
      result.set(iv, salt.length)
      result.set(new Uint8Array(encryptedData), salt.length + iv.length)

      // Create a blob and download it
      const blob = new Blob([result], { type: "application/octet-stream" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${selectedFile.name}.encrypted`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setProgress(100)

      // Animate success
      gsap.to(".encrypt-button", {
        backgroundColor: "var(--success)",
        duration: 0.3,
        yoyo: true,
        repeat: 1,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Encryption failed")
    } finally {
      setIsEncrypting(false)
    }
  }

  async function decryptFile() {
    try {
      if (!selectedFile) {
        throw new Error("Please select an encrypted file")
      }

      if (!password) {
        throw new Error("Please enter the password")
      }

      setIsDecrypting(true)
      setError("")
      setProgress(0)

      // Read the file
      const encryptedData = await readFileAsArrayBuffer(selectedFile)
      const encryptedBytes = new Uint8Array(encryptedData)

      // Extract salt, iv, and encrypted data
      const salt = encryptedBytes.slice(0, 16)
      const iv = encryptedBytes.slice(16, 28)
      const data = encryptedBytes.slice(28)

      // Derive key from password
      const key = await deriveKey(password, salt)

      try {
        // Decrypt the data
        const decryptedData = await window.crypto.subtle.decrypt(
          {
            name: "AES-GCM",
            iv,
          },
          key,
          data,
        )

        // Create a blob and download it
        const originalFileName = selectedFile.name.endsWith(".encrypted")
          ? selectedFile.name.slice(0, -10) // Remove .encrypted extension
          : `decrypted_${selectedFile.name}`

        const blob = new Blob([decryptedData], { type: "application/octet-stream" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = originalFileName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        setProgress(100)

        // Animate success
        gsap.to(".decrypt-button", {
          backgroundColor: "var(--success)",
          duration: 0.3,
          yoyo: true,
          repeat: 1,
        })
      } catch (decryptError) {
        throw new Error("Decryption failed. Incorrect password or corrupted file.")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Decryption failed")
    } finally {
      setIsDecrypting(false)
    }
  }

  async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100)
          setProgress(percentComplete)
        }
      }

      reader.onload = () => {
        resolve(reader.result as ArrayBuffer)
      }

      reader.onerror = () => {
        reject(new Error("Failed to read file"))
      }

      reader.readAsArrayBuffer(file)
    })
  }

  return (
    <div className="space-y-6">
      <div
        ref={dropZoneRef}
        className="border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 hover:border-primary"
      >
        <Input ref={fileInputRef} id="file" type="file" onChange={handleFileChange} className="hidden" />
        <div className="flex flex-col items-center gap-4">
          <Upload className="h-12 w-12 text-muted-foreground" />
          <div>
            <Button onClick={() => fileInputRef.current?.click()} variant="secondary" className="mb-2">
              Select File
            </Button>
            <p className="text-sm text-muted-foreground">or drag and drop your file here</p>
          </div>
          {selectedFile && (
            <div className="file-name mt-2 text-sm font-medium">
              Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
            </div>
          )}
        </div>
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
          onClick={encryptFile}
          disabled={isEncrypting || isDecrypting || !selectedFile}
          className="encrypt-button flex items-center gap-2 transition-transform duration-200 hover:scale-105"
        >
          {isEncrypting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
          Encrypt & Download
        </Button>

        <Button
          onClick={decryptFile}
          disabled={isEncrypting || isDecrypting || !selectedFile}
          variant="outline"
          className="decrypt-button flex items-center gap-2 transition-transform duration-200 hover:scale-105"
        >
          {isDecrypting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Unlock className="h-4 w-4" />}
          Decrypt & Download
        </Button>
      </div>

      {(isEncrypting || isDecrypting || progress > 0) && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div ref={progressRef} className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="animate-shake">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}


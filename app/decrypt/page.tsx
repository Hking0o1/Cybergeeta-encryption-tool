"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { gsap } from "gsap"
import Link from "next/link"
import { ArrowLeft, Lock, Unlock, Eye, EyeOff, Loader2, FileText, KeyRound } from "lucide-react"
import PasswordStrength from "@/components/password-strength"

export default function DecryptPage() {
  const headerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Animate header
    if (headerRef.current) {
      gsap.from(headerRef.current.children, {
        y: -50,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out",
      })
    }

    // Animate content
    if (contentRef.current) {
      gsap.from(contentRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: "power3.out",
      })
    }
  }, [])

  return (
    <main className="container mx-auto py-10 px-4 min-h-screen transition-colors duration-300">
      <div className="flex justify-between items-center mb-8">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
        </Link>
        <Link href="/encrypt">
          <Button variant="outline" className="gap-2">
            <Lock className="h-4 w-4" /> Switch to Encryption
          </Button>
        </Link>
      </div>

      <div ref={headerRef} className="mb-10">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Decryption Service
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Securely decrypt your data with our specialized decryption tools. Choose the method that matches your
          encryption type.
        </p>
      </div>

      <div ref={contentRef}>
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="text">Text Decryption</TabsTrigger>
            <TabsTrigger value="file">File Decryption</TabsTrigger>
            <TabsTrigger value="asymmetric">Asymmetric Decryption</TabsTrigger>
          </TabsList>

          <TabsContent value="text">
            <Card className="border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle>Text Decryption</CardTitle>
                <CardDescription>Decrypt text that was encrypted with AES-GCM symmetric encryption</CardDescription>
              </CardHeader>
              <CardContent>
                <TextDecryption />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="file">
            <Card className="border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle>File Decryption</CardTitle>
                <CardDescription>Decrypt files that were encrypted with our file encryption tool</CardDescription>
              </CardHeader>
              <CardContent>
                <FileDecryption />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="asymmetric">
            <Card className="border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle>Asymmetric Decryption</CardTitle>
                <CardDescription>Decrypt data that was encrypted with RSA public key encryption</CardDescription>
              </CardHeader>
              <CardContent>
                <AsymmetricDecryption />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

function TextDecryption() {
  const [encryptedText, setEncryptedText] = useState("")
  const [password, setPassword] = useState("")
  const [decryptedText, setDecryptedText] = useState("")
  const [isDecrypting, setIsDecrypting] = useState(false)
  const [error, setError] = useState("")
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
    if (resultRef.current && decryptedText) {
      gsap.from(resultRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      })
    }
  }, [decryptedText])

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

  async function decrypt() {
    try {
      setIsDecrypting(true)
      setError("")

      if (!encryptedText) {
        throw new Error("Please provide encrypted text to decrypt")
      }

      if (!password) {
        throw new Error("Please provide the password")
      }

      // Convert from base64
      const encryptedBytes = Uint8Array.from(atob(encryptedText), (c) => c.charCodeAt(0))

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
      setDecryptedText(decoder.decode(decryptedData))

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

  return (
    <div className="space-y-6" ref={formRef}>
      <div className="space-y-2">
        <Label htmlFor="encryptedText">Encrypted Text</Label>
        <Textarea
          id="encryptedText"
          placeholder="Paste the encrypted text here"
          value={encryptedText}
          onChange={(e) => setEncryptedText(e.target.value)}
          className="min-h-[100px] transition-all duration-200 focus:shadow-md font-mono text-xs"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter the decryption password"
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

      <Button
        onClick={decrypt}
        disabled={isDecrypting}
        className="flex items-center gap-2 transition-transform duration-200 hover:scale-105 w-full"
      >
        {isDecrypting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Unlock className="h-4 w-4 unlock-icon" />}
        Decrypt
      </Button>

      {error && (
        <Alert variant="destructive" className="animate-shake">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {decryptedText && (
        <div className="space-y-2" ref={resultRef}>
          <Label htmlFor="decryptedText">Decrypted Result</Label>
          <Textarea
            id="decryptedText"
            value={decryptedText}
            readOnly
            className="min-h-[100px] transition-all duration-200 bg-muted/30"
          />
        </div>
      )}
    </div>
  )
}

function FileDecryption() {
  const [password, setPassword] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
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
          <FileText className="h-12 w-12 text-muted-foreground" />
          <div>
            <Button onClick={() => fileInputRef.current?.click()} variant="secondary" className="mb-2">
              Select Encrypted File
            </Button>
            <p className="text-sm text-muted-foreground">or drag and drop your encrypted file here</p>
          </div>
          {selectedFile && (
            <div className="file-name mt-2 text-sm font-medium">
              Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Decryption Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter the password used for encryption"
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
      </div>

      <Button
        onClick={decryptFile}
        disabled={isDecrypting || !selectedFile}
        className="decrypt-button flex items-center gap-2 transition-transform duration-200 hover:scale-105 w-full"
      >
        {isDecrypting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Unlock className="h-4 w-4" />}
        Decrypt & Download File
      </Button>

      {(isDecrypting || progress > 0) && (
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

function AsymmetricDecryption() {
  const [privateKeyString, setPrivateKeyString] = useState("")
  const [encryptedText, setEncryptedText] = useState("")
  const [decryptedText, setDecryptedText] = useState("")
  const [isDecrypting, setIsDecrypting] = useState(false)
  const [error, setError] = useState("")

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
    if (resultRef.current && decryptedText) {
      gsap.from(resultRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      })
    }
  }, [decryptedText])

  async function decrypt() {
    try {
      setIsDecrypting(true)
      setError("")

      if (!encryptedText) {
        throw new Error("Please enter encrypted text to decrypt")
      }

      if (!privateKeyString) {
        throw new Error("Please enter your private key")
      }

      // Parse private key
      let privateKeyJwk
      try {
        privateKeyJwk = JSON.parse(privateKeyString)
      } catch (e) {
        throw new Error("Invalid private key format. Please provide a valid JWK format private key.")
      }

      // Import private key
      const privateKey = await window.crypto.subtle.importKey(
        "jwk",
        privateKeyJwk,
        {
          name: "RSA-OAEP",
          hash: "SHA-256",
        },
        false,
        ["decrypt"],
      )

      // Convert from base64
      const encryptedData = Uint8Array.from(atob(encryptedText), (c) => c.charCodeAt(0))

      // Decrypt the data
      const decryptedData = await window.crypto.subtle.decrypt(
        {
          name: "RSA-OAEP",
        },
        privateKey,
        encryptedData,
      )

      // Decode the decrypted data
      const decoder = new TextDecoder()
      setDecryptedText(decoder.decode(decryptedData))

      // Animate the key icon
      gsap.to(".key-icon", {
        rotate: 360,
        duration: 0.5,
        ease: "back.out",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Decryption failed")
    } finally {
      setIsDecrypting(false)
    }
  }

  return (
    <div className="space-y-6" ref={formRef}>
      <div className="space-y-2">
        <Label htmlFor="privateKey">Private Key (JWK Format)</Label>
        <Textarea
          id="privateKey"
          placeholder="Paste your private key here (in JWK format)"
          value={privateKeyString}
          onChange={(e) => setPrivateKeyString(e.target.value)}
          className="min-h-[150px] transition-all duration-200 focus:shadow-md font-mono text-xs"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="encryptedText">Encrypted Text</Label>
        <Textarea
          id="encryptedText"
          placeholder="Paste the encrypted text here"
          value={encryptedText}
          onChange={(e) => setEncryptedText(e.target.value)}
          className="min-h-[100px] transition-all duration-200 focus:shadow-md font-mono text-xs"
        />
      </div>

      <Button
        onClick={decrypt}
        disabled={isDecrypting}
        className="flex items-center gap-2 transition-transform duration-200 hover:scale-105 w-full"
      >
        {isDecrypting ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4 key-icon" />}
        Decrypt with Private Key
      </Button>

      {error && (
        <Alert variant="destructive" className="animate-shake">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {decryptedText && (
        <div className="space-y-2" ref={resultRef}>
          <Label htmlFor="decryptedText">Decrypted Result</Label>
          <Textarea
            id="decryptedText"
            value={decryptedText}
            readOnly
            className="min-h-[100px] transition-all duration-200 bg-muted/30"
          />
        </div>
      )}
    </div>
  )
}


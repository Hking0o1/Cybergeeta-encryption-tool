"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Copy, Check, KeyRound } from "lucide-react"
import { gsap } from "gsap"

export default function AsymmetricEncryption() {
  const [keyPair, setKeyPair] = useState<{
    publicKey: CryptoKey | null
    privateKey: CryptoKey | null
    publicKeyString: string
    privateKeyString: string
  }>({
    publicKey: null,
    privateKey: null,
    publicKeyString: "",
    privateKeyString: "",
  })

  const [text, setText] = useState("")
  const [encryptedText, setEncryptedText] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isEncrypting, setIsEncrypting] = useState(false)
  const [isDecrypting, setIsDecrypting] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({})

  const keyButtonRef = useRef<HTMLButtonElement>(null)
  const keysContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Animate key generation button on mount
    if (keyButtonRef.current) {
      gsap.from(keyButtonRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      })
    }
  }, [])

  useEffect(() => {
    // Animate keys container when keys are generated
    if (keysContainerRef.current && keyPair.publicKeyString) {
      gsap.from(keysContainerRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      })
    }
  }, [keyPair.publicKeyString])

  async function generateKeyPair() {
    try {
      setIsGenerating(true)
      setError("")

      // Animate button while generating
      if (keyButtonRef.current) {
        gsap.to(keyButtonRef.current, {
          rotate: 360,
          duration: 1,
          ease: "power2.inOut",
        })
      }

      // Generate RSA key pair
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"],
      )

      // Export public key to string
      const publicKeyJwk = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey)

      // Export private key to string
      const privateKeyJwk = await window.crypto.subtle.exportKey("jwk", keyPair.privateKey)

      setKeyPair({
        publicKey: keyPair.publicKey,
        privateKey: keyPair.privateKey,
        publicKeyString: JSON.stringify(publicKeyJwk, null, 2),
        privateKeyString: JSON.stringify(privateKeyJwk, null, 2),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate key pair")
    } finally {
      setIsGenerating(false)
    }
  }

  async function encrypt() {
    try {
      setIsEncrypting(true)
      setError("")

      if (!text) {
        throw new Error("Please enter text to encrypt")
      }

      if (!keyPair.publicKey) {
        throw new Error("Please generate a key pair first")
      }

      const encoder = new TextEncoder()
      const data = encoder.encode(text)

      // Encrypt the data
      const encryptedData = await window.crypto.subtle.encrypt(
        {
          name: "RSA-OAEP",
        },
        keyPair.publicKey,
        data,
      )

      // Convert to base64 for display
      setEncryptedText(btoa(String.fromCharCode(...new Uint8Array(encryptedData))))

      // Animate the encrypted text appearance
      gsap.from(".encrypted-text", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        delay: 0.2,
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

      if (!encryptedText) {
        throw new Error("Please enter encrypted text to decrypt")
      }

      if (!keyPair.privateKey) {
        throw new Error("Please generate a key pair first")
      }

      // Convert from base64
      const encryptedData = Uint8Array.from(atob(encryptedText), (c) => c.charCodeAt(0))

      // Decrypt the data
      const decryptedData = await window.crypto.subtle.decrypt(
        {
          name: "RSA-OAEP",
        },
        keyPair.privateKey,
        encryptedData,
      )

      // Decode the decrypted data
      const decoder = new TextDecoder()
      setText(decoder.decode(decryptedData))
      setEncryptedText("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Decryption failed")
    } finally {
      setIsDecrypting(false)
    }
  }

  function copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text)
    setCopied({ ...copied, [key]: true })

    // Animate the copy button
    gsap.to(`.copy-${key}`, {
      scale: 1.2,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
    })

    setTimeout(() => setCopied({ ...copied, [key]: false }), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <Button
          ref={keyButtonRef}
          onClick={generateKeyPair}
          disabled={isGenerating}
          className="flex items-center gap-2 transition-transform duration-200 hover:scale-105"
        >
          {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
          Generate Key Pair
        </Button>
      </div>

      {keyPair.publicKeyString && (
        <div ref={keysContainerRef}>
          <Tabs defaultValue="keys" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="keys">Keys</TabsTrigger>
              <TabsTrigger value="encrypt">Encrypt/Decrypt</TabsTrigger>
            </TabsList>

            <TabsContent value="keys" className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="publicKey">Public Key (share this)</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(keyPair.publicKeyString, "publicKey")}
                    className="h-8 gap-1"
                  >
                    {copied.publicKey ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className={`h-4 w-4 copy-publicKey`} />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <Textarea
                  id="publicKey"
                  value={keyPair.publicKeyString}
                  readOnly
                  className="font-mono text-xs min-h-[150px] bg-muted/50"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="privateKey">Private Key (keep this secret)</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(keyPair.privateKeyString, "privateKey")}
                    className="h-8 gap-1"
                  >
                    {copied.privateKey ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className={`h-4 w-4 copy-privateKey`} />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <Textarea
                  id="privateKey"
                  value={keyPair.privateKeyString}
                  readOnly
                  className="font-mono text-xs min-h-[150px] bg-muted/50"
                />
              </div>
            </TabsContent>

            <TabsContent value="encrypt" className="space-y-4">
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

              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={encrypt}
                  disabled={isEncrypting || isDecrypting || !keyPair.publicKey}
                  className="flex items-center gap-2 transition-transform duration-200 hover:scale-105"
                >
                  {isEncrypting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Encrypt with Public Key
                </Button>

                <Button
                  onClick={decrypt}
                  disabled={isEncrypting || isDecrypting || !keyPair.privateKey || !encryptedText}
                  variant="outline"
                  className="flex items-center gap-2 transition-transform duration-200 hover:scale-105"
                >
                  {isDecrypting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Decrypt with Private Key
                </Button>
              </div>

              {encryptedText && (
                <div className="space-y-2 encrypted-text">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="encryptedText">Encrypted Text</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(encryptedText, "encryptedText")}
                      className="h-8 gap-1"
                    >
                      {copied.encryptedText ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className={`h-4 w-4 copy-encryptedText`} />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <Textarea
                    id="encryptedText"
                    value={encryptedText}
                    onChange={(e) => setEncryptedText(e.target.value)}
                    className="font-mono text-xs min-h-[100px] bg-muted/50"
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
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


"use client"

import { useEffect, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SymmetricEncryption from "@/components/symmetric-encryption"
import AsymmetricEncryption from "@/components/asymmetric-encryption"
import Hashing from "@/components/hashing"
import FileEncryption from "@/components/file-encryption"
import { gsap } from "gsap"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Unlock } from "lucide-react"

export default function EncryptPage() {
  const headerRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)

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

    // Animate tabs
    if (tabsRef.current) {
      gsap.from(tabsRef.current, {
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
        <Link href="/decrypt">
          <Button variant="outline" className="gap-2">
            <Unlock className="h-4 w-4" /> Switch to Decryption
          </Button>
        </Link>
      </div>

      <div ref={headerRef} className="mb-10">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Encryption Tools
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Secure your sensitive data using industry-standard encryption algorithms. Choose the method that best suits
          your needs.
        </p>
      </div>

      <div ref={tabsRef}>
        <Tabs defaultValue="symmetric" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="symmetric">Symmetric</TabsTrigger>
            <TabsTrigger value="asymmetric">Asymmetric</TabsTrigger>
            <TabsTrigger value="hashing">Hashing</TabsTrigger>
            <TabsTrigger value="file">File Encryption</TabsTrigger>
          </TabsList>

          <TabsContent value="symmetric">
            <Card className="border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle>Symmetric Encryption</CardTitle>
                <CardDescription>AES-GCM encryption with password-based key derivation using Argon2id</CardDescription>
              </CardHeader>
              <CardContent>
                <SymmetricEncryption />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="asymmetric">
            <Card className="border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle>Asymmetric Encryption</CardTitle>
                <CardDescription>RSA encryption for secure key exchange and digital signatures</CardDescription>
              </CardHeader>
              <CardContent>
                <AsymmetricEncryption />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hashing">
            <Card className="border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle>Secure Hashing</CardTitle>
                <CardDescription>Generate SHA-256 and SHA-512 hashes for data integrity verification</CardDescription>
              </CardHeader>
              <CardContent>
                <Hashing />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="file">
            <Card className="border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle>File Encryption</CardTitle>
                <CardDescription>Securely encrypt and decrypt files using AES-GCM</CardDescription>
              </CardHeader>
              <CardContent>
                <FileEncryption />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}


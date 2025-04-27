"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Shield, Lock, Unlock, FileText, ArrowRight, CheckCircle, Database, Key } from "lucide-react"
import Link from "next/link"

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const useCasesRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const heroImageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Hero section animation
    if (heroRef.current) {
      const heroElements = heroRef.current.children
      gsap.from(heroElements, {
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out",
      })
    }

    // Hero image animation
    if (heroImageRef.current) {
      gsap.from(heroImageRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: "power3.out",
      })
    }

    // Features section animation
    if (featuresRef.current) {
      gsap.from(featuresRef.current.children, {
        y: 50,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
        },
      })
    }

    // Use cases section animation
    if (useCasesRef.current) {
      gsap.from(useCasesRef.current.children, {
        x: -50,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        scrollTrigger: {
          trigger: useCasesRef.current,
          start: "top 80%",
        },
      })
    }

    // CTA section animation
    if (ctaRef.current) {
      gsap.from(ctaRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 85%",
        },
      })
    }
  }, [])

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 mt-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background/0 dark:from-primary/10 dark:to-background/0 pointer-events-none"></div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div ref={heroRef} className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm">
                <Shield className="h-4 w-4" />
                <span>Military-grade encryption for everyone</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                SecureVault
              </h1>

              <p className="text-xl text-muted-foreground max-w-xl">
                Enterprise-grade encryption and decryption for your sensitive data, built with modern security standards
                and an intuitive interface.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/encrypt">
                  <Button size="lg" className="gap-2 text-lg group">
                    Start Encrypting
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/decrypt">
                  <Button size="lg" variant="outline" className="gap-2 text-lg">
                    Decrypt Data <Unlock className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div ref={heroImageRef} className="relative">
              {/* Hero illustration */}
              <div className="relative z-10 bg-gradient-to-br from-background to-muted p-6 rounded-2xl shadow-xl border border-border">
                <div className="absolute -top-6 -left-6 p-3 bg-primary text-primary-foreground rounded-xl shadow-lg">
                  <Lock className="h-8 w-8" />
                </div>

                <div className="absolute -bottom-6 -right-6 p-3 bg-background rounded-xl shadow-lg border border-border">
                  <Key className="h-8 w-8 text-primary" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Shield className="h-6 w-6 text-primary" />
                      <span className="font-bold">SecureVault</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-destructive"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-8 bg-muted-foreground/10 rounded-md w-3/4"></div>
                    <div className="h-8 bg-muted-foreground/10 rounded-md"></div>
                    <div className="h-8 bg-muted-foreground/10 rounded-md w-5/6"></div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <div className="h-10 bg-primary/20 rounded-md w-1/3"></div>
                    <div className="h-10 bg-muted-foreground/10 rounded-md w-1/3"></div>
                  </div>

                  <div className="mt-8 p-4 bg-muted-foreground/5 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="h-4 w-4 text-primary" />
                      <div className="h-4 bg-muted-foreground/20 rounded w-1/2"></div>
                    </div>
                    <div className="h-20 bg-muted-foreground/10 rounded-md"></div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10">
                <div className="absolute top-0 left-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-60 h-60 bg-primary/5 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30 dark:bg-muted/10">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Advanced Security Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" ref={featuresRef}>
            <Card className="border-t-4 border-t-primary overflow-hidden group hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6 p-6">
                <div className="mb-4 p-3 rounded-full bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors duration-300">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">AES-256 Encryption</h3>
                <p className="text-muted-foreground">
                  Military-grade encryption algorithm used by governments and security professionals worldwide.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-primary overflow-hidden group hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6 p-6">
                <div className="mb-4 p-3 rounded-full bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors duration-300">
                  <Database className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Secure Key Management</h3>
                <p className="text-muted-foreground">
                  Advanced key derivation using PBKDF2 with 100,000 iterations for maximum security.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-primary overflow-hidden group hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6 p-6">
                <div className="mb-4 p-3 rounded-full bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors duration-300">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">File Encryption</h3>
                <p className="text-muted-foreground">
                  Securely encrypt any file type with password protection and secure key derivation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Who Uses SecureVault?</h2>

          <div className="space-y-16" ref={useCasesRef}>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold mb-4">Business Professionals</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>Protect sensitive client information and contracts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>Secure financial documents and business plans</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>Safely share confidential information with partners</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2 rounded-xl overflow-hidden shadow-lg">
                <div className="relative bg-gradient-to-br from-background to-muted p-8 rounded-xl border border-border h-full">
                  <div className="absolute -top-4 -left-4 p-2 bg-primary text-primary-foreground rounded-lg shadow-md">
                    <Lock className="h-6 w-6" />
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold">Financial Report</h4>
                      <p className="text-sm text-muted-foreground">Encrypted with AES-256</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="h-4 bg-muted-foreground/10 rounded w-full"></div>
                    <div className="h-4 bg-muted-foreground/10 rounded w-5/6"></div>
                    <div className="h-4 bg-muted-foreground/10 rounded w-4/5"></div>
                    <div className="h-4 bg-muted-foreground/10 rounded w-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold mb-4">Healthcare Providers</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>Ensure HIPAA compliance with encrypted patient records</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>Protect medical images and test results</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>Secure communication between healthcare professionals</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2 rounded-xl overflow-hidden shadow-lg">
                <div className="relative bg-gradient-to-br from-background to-muted p-8 rounded-xl border border-border h-full">
                  <div className="absolute -top-4 -right-4 p-2 bg-primary text-primary-foreground rounded-lg shadow-md">
                    <Shield className="h-6 w-6" />
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Database className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold">Patient Records</h4>
                      <p className="text-sm text-muted-foreground">HIPAA Compliant Encryption</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="h-4 bg-muted-foreground/10 rounded w-full"></div>
                      <div className="h-4 bg-muted-foreground/10 rounded w-4/5"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted-foreground/10 rounded w-full"></div>
                      <div className="h-4 bg-muted-foreground/10 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold mb-4">Individual Privacy</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>Protect personal documents like tax returns and IDs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>Secure private photos and videos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>Keep personal journals and notes private</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2 rounded-xl overflow-hidden shadow-lg">
                <div className="relative bg-gradient-to-br from-background to-muted p-8 rounded-xl border border-border h-full">
                  <div className="absolute -bottom-4 -left-4 p-2 bg-primary text-primary-foreground rounded-lg shadow-md">
                    <Key className="h-6 w-6" />
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Lock className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold">Personal Vault</h4>
                      <p className="text-sm text-muted-foreground">End-to-end encryption</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="aspect-square bg-muted-foreground/10 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-muted-foreground/40" />
                    </div>
                    <div className="aspect-square bg-muted-foreground/10 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-muted-foreground/40" />
                    </div>
                    <div className="aspect-square bg-muted-foreground/10 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-muted-foreground/40" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-primary/5 dark:from-background dark:to-primary/10">
        <div className="container mx-auto max-w-4xl text-center" ref={ctaRef}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
            <Shield className="h-4 w-4" />
            <span>Start securing your data today</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Secure Your Data?</h2>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start protecting your sensitive information today with our powerful encryption tools.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/encrypt">
              <Button size="lg" className="gap-2 text-lg group">
                Start Encrypting <Lock className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              </Button>
            </Link>
            <Link href="/decrypt">
              <Button size="lg" variant="outline" className="gap-2 text-lg group">
                Go to Decryption <Unlock className="h-5 w-5 group-hover:-rotate-12 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}


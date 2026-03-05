"use client"

import { Button } from "@/components/ui/button"
import Mail from "@/components/icons/Mail"
import ArrowRight from "@/components/icons/ArrowRight"
import Lock from "@/components/icons/Lock"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/auth-context"
import type React from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { login, user } = useAuth()

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        router.push("/dashboard")
      } else {
        setError("Invalid email or password. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full w-full min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
          <div className="text-center mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-1">Welcome Back</h1>
            <p className="text-foreground/70 text-xs md:text-sm">Log in to your hotel management dashboard</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-lg border-2 border-accent/20 p-5 md:p-6 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-foreground mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-foreground/40" />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-xs font-medium text-foreground mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-foreground/40" />
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link href="#" className="text-xs text-accent hover:text-accent/80 transition-colors">
                  Forgot Password?
                </Link>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground gap-2 py-1.5 text-sm cursor-pointer"
              >
                {isLoading ? "Logging in..." : "Log In"}
                <ArrowRight className="w-3 h-3" />
              </Button>
            </form>

            {/* Divider */}
            <div className="my-3 flex items-center gap-3">
              <div className="flex-1 bg-border h-px" />
              <span className="text-foreground/50 text-xs">or</span>
              <div className="flex-1 bg-border h-px" />
            </div>

            {/* Social Login */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-transparent text-xs py-1 cursor-pointer">
                Google
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent text-xs py-1 cursor-pointer">
                Facebook
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-3 text-center">
              <p className="text-foreground/70 text-xs">
                Don't have an account?{" "}
                <Link href="/signup" className="text-accent font-semibold hover:text-accent/80 transition-colors">
                  Sign Up
                </Link>
              </p>
            </div>
        </div>

        {/* Additional Info */}
          <div className="mt-4 text-center text-foreground/60 text-xs">
            <p>By logging in, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
    </div>
  )
}

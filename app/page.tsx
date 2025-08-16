"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Users, UserPlus, BarChart3, Sparkles, ArrowRight, Eye, Shield, Clock } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background relative overflow-hidden">
      {/* Animated background elements */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(217, 119, 6, 0.1), transparent 40%)`,
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <div
            className={`flex items-center space-x-2 transition-all duration-1000 ${isLoaded ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center animate-pulse-slow">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-serif font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FaceTrack
            </span>
          </div>

          <div
            className={`flex items-center space-x-4 transition-all duration-1000 delay-300 ${isLoaded ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
          >
            <Link href="/login">
              <Button variant="ghost" className="hover:bg-primary/10 transition-all duration-300 hover:scale-105">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <div
            className={`transition-all duration-1000 delay-500 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            <Badge className="mb-4 bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border-primary/30 animate-bounce-slow">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Attendance
            </Badge>
            <h1 className="text-6xl md:text-7xl font-serif font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient">
              Smart Attendance,
              <br />
              Simplified Teaching
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform your classroom with cutting-edge facial recognition technology. Track attendance effortlessly,
              manage student data seamlessly, and focus on what matters most - teaching.
            </p>
          </div>

          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-700 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            <Link href="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 hover:scale-105 hover:shadow-xl group"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                size="lg"
                variant="outline"
                className="border-primary/30 hover:bg-primary/5 transition-all duration-300 hover:scale-105 hover:shadow-lg bg-transparent"
              >
                <Camera className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-32">
          {[
            {
              icon: Camera,
              title: "Facial Recognition",
              description: "Advanced AI technology for accurate student identification",
              delay: "delay-1000",
            },
            {
              icon: Clock,
              title: "Real-time Tracking",
              description: "Instant attendance recording with live updates",
              delay: "delay-1200",
            },
            {
              icon: Shield,
              title: "Secure & Private",
              description: "Enterprise-grade security for student data protection",
              delay: "delay-1500",
            },
          ].map((feature, index) => (
            <Card
              key={index}
              className={`group hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 bg-card/50 backdrop-blur-sm border-primary/20 ${isLoaded ? `translate-y-0 opacity-100 ${feature.delay}` : "translate-y-10 opacity-0"}`}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="font-serif text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-32">
          <h2
            className={`text-4xl font-serif font-bold text-center mb-16 transition-all duration-1000 delay-1000 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            Everything You Need
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: "Take Attendance", href: "/attendance", color: "from-blue-500 to-blue-600" },
              { icon: UserPlus, title: "Add Students", href: "/students", color: "from-green-500 to-green-600" },
              { icon: BarChart3, title: "View Reports", href: "/reports", color: "from-purple-500 to-purple-600" },
              { icon: Camera, title: "Manage Classes", href: "/classes", color: "from-orange-500 to-orange-600" },
            ].map((action, index) => (
              <Link key={index} href={action.href}>
                <Card
                  className={`group cursor-pointer hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 bg-card/50 backdrop-blur-sm border-primary/20 ${isLoaded ? `translate-y-0 opacity-100 delay-[${1200 + index * 200}ms]` : "translate-y-10 opacity-0"}`}
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300`}
                    >
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-serif font-semibold text-lg group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

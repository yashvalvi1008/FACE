"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Users, ArrowLeft, Play, Square, CheckCircle, XCircle, Eye, Scan, UserCheck, Clock } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function AttendancePage() {
  const [isScanning, setIsScanning] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [detectedStudents, setDetectedStudents] = useState<any[]>([])
  const [scanProgress, setScanProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const startScanning = async () => {
    setIsScanning(true)
    setScanProgress(0)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      // Simulate scanning progress
      const interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            simulateDetection()
            return 100
          }
          return prev + 10
        })
      }, 500)
    } catch (error) {
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access to use facial recognition.",
        variant: "destructive",
      })
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    setIsScanning(false)
    setScanProgress(0)
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
  }

  const simulateDetection = () => {
    const mockStudents = [
      { id: 1, name: "Alice Johnson", status: "present", confidence: 98, time: new Date() },
      { id: 2, name: "Bob Smith", status: "present", confidence: 95, time: new Date() },
      { id: 3, name: "Carol Davis", status: "present", confidence: 92, time: new Date() },
      { id: 4, name: "David Wilson", status: "absent", confidence: 0, time: null },
      { id: 5, name: "Eva Brown", status: "present", confidence: 89, time: new Date() },
    ]

    setDetectedStudents(mockStudents)
    toast({
      title: "Scan Complete!",
      description: `Detected ${mockStudents.filter((s) => s.status === "present").length} students present.`,
    })
  }

  const presentCount = detectedStudents.filter((s) => s.status === "present").length
  const totalCount = detectedStudents.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background relative overflow-hidden">
      {/* Animated background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(217, 119, 6, 0.1), transparent 40%)`,
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
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
      <header className="relative z-10 border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="hover:bg-primary/10 p-2 rounded-lg transition-colors group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </Link>
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center animate-pulse-slow">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold">Facial Recognition Attendance</h1>
                <p className="text-muted-foreground">Computer Science 101 - Room 204</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge className="bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border-primary/30">
                <Eye className="w-4 h-4 mr-2" />
                AI Powered
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Camera Section */}
          <div className="lg:col-span-2">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 mb-6">
              <CardHeader>
                <CardTitle className="font-serif text-2xl flex items-center gap-2">
                  <Scan className="w-6 h-6" />
                  Live Camera Feed
                </CardTitle>
                <CardDescription>Position students in front of the camera for automatic recognition</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video mb-4">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

                  {!isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="text-center text-white">
                        <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">Camera Ready</p>
                        <p className="text-sm opacity-75">Click start to begin scanning</p>
                      </div>
                    </div>
                  )}

                  {isScanning && (
                    <div className="absolute inset-0">
                      {/* Scanning overlay */}
                      <div className="absolute inset-4 border-2 border-primary rounded-lg animate-pulse">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />
                      </div>

                      {/* Progress bar */}
                      <div className="absolute bottom-4 left-4 right-4 bg-black/50 rounded-lg p-3">
                        <div className="flex items-center gap-3 text-white">
                          <Scan className="w-5 h-5 animate-spin" />
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Scanning for faces...</span>
                              <span>{scanProgress}%</span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${scanProgress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  {!isScanning ? (
                    <Button
                      onClick={startScanning}
                      className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 hover:scale-105"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Scanning
                    </Button>
                  ) : (
                    <Button
                      onClick={stopScanning}
                      variant="destructive"
                      className="hover:scale-105 transition-transform"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      Stop Scanning
                    </Button>
                  )}

                  <Button variant="outline" className="border-primary/30 hover:bg-primary/5 bg-transparent">
                    <Camera className="w-4 h-4 mr-2" />
                    Switch Camera
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Attendance Summary */}
            {detectedStudents.length > 0 && (
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="font-serif text-xl flex items-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    Attendance Summary
                  </CardTitle>
                  <CardDescription>
                    {presentCount} of {totalCount} students present ({Math.round((presentCount / totalCount) * 100)}%
                    attendance)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div className="text-2xl font-bold text-green-600">{presentCount}</div>
                      <div className="text-sm text-muted-foreground">Present</div>
                    </div>
                    <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                      <div className="text-2xl font-bold text-red-600">{totalCount - presentCount}</div>
                      <div className="text-sm text-muted-foreground">Absent</div>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-primary to-secondary">Save Attendance Record</Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Student List */}
          <div>
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="font-serif text-xl flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Student Recognition
                </CardTitle>
                <CardDescription>Real-time face detection results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {detectedStudents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Start scanning to detect students</p>
                  </div>
                ) : (
                  detectedStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-background/30 hover:bg-background/50 transition-colors"
                    >
                      <Avatar className="w-10 h-10 border-2 border-primary/20">
                        <AvatarImage src={`/abstract-geometric-shapes.png?height=40&width=40&query=${student.name}`} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-sm">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{student.name}</p>
                        {student.status === "present" && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {student.time?.toLocaleTimeString()}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {student.status === "present" ? (
                          <>
                            <Badge className="bg-green-500/20 text-green-700 border-green-500/30 text-xs">
                              {student.confidence}%
                            </Badge>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </>
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

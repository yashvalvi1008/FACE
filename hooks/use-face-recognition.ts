"use client"

import { useState, useEffect, useRef } from "react"
import { AttendanceRecord, RegisteredFace } from "@/types/attendance"

export function useFaceRecognition() {
  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const [isVideoStarted, setIsVideoStarted] = useState(false)
  const [registeredFaces, setRegisteredFaces] = useState<RegisteredFace[]>([])
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord[]>([])
  const [status, setStatus] = useState("Loading face detection models...")
  
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    loadModels()
    loadStoredData()
  }, [])

  const loadModels = async () => {
    try {
      setStatus("Loading face detection models...")
      
      // Simulate model loading for demo
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setIsModelLoaded(true)
      setStatus("Models loaded successfully! Ready to use.")
    } catch (error) {
      console.error("Error loading models:", error)
      setStatus("Error loading models. Please refresh the page.")
    }
  }

  const loadStoredData = () => {
    const storedFaces = localStorage.getItem('registeredFaces')
    const storedAttendance = localStorage.getItem('todayAttendance')
    
    if (storedFaces) {
      setRegisteredFaces(JSON.parse(storedFaces))
    }
    
    if (storedAttendance) {
      setTodayAttendance(JSON.parse(storedAttendance))
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      })
      
      streamRef.current = stream
      
      const video = document.getElementById('video') as HTMLVideoElement
      const canvas = document.getElementById('overlay') as HTMLCanvasElement
      
      if (video && canvas) {
        video.srcObject = stream
        videoRef.current = video
        canvasRef.current = canvas
        
        video.addEventListener('loadedmetadata', () => {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
        })
        
        await video.play()
        setIsVideoStarted(true)
        startFaceDetection()
        setStatus("Camera started. Face detection active.")
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setStatus("Error accessing camera. Please check permissions.")
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current)
      detectionIntervalRef.current = null
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      }
    }
    
    setIsVideoStarted(false)
    setStatus("Camera stopped.")
  }

  const startFaceDetection = () => {
    detectionIntervalRef.current = setInterval(() => {
      detectFaces()
    }, 100)
  }

  const detectFaces = async () => {
    if (!videoRef.current || !canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Simulate face detection for demo
    // In a real implementation, this would use Face-API.js or similar
    const mockDetection = {
      x: 200,
      y: 150,
      width: 200,
      height: 200
    }
    
    // Draw detection box
    ctx.strokeStyle = '#10b981'
    ctx.lineWidth = 3
    ctx.strokeRect(mockDetection.x, mockDetection.y, mockDetection.width, mockDetection.height)
    
    // Draw label if face is recognized
    const recognizedName = "Demo User"
    if (recognizedName) {
      ctx.fillStyle = '#10b981'
      ctx.fillRect(mockDetection.x, mockDetection.y - 25, recognizedName.length * 8 + 16, 25)
      ctx.fillStyle = 'white'
      ctx.font = '12px Arial'
      ctx.fillText(recognizedName, mockDetection.x + 8, mockDetection.y - 8)
    }
  }

  const registerPerson = async (name: string, department?: string, studentId?: string) => {
    if (!isVideoStarted) {
      throw new Error("Camera must be started to register faces")
    }
    
    // Simulate face registration
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newFace: RegisteredFace = {
      id: Date.now().toString(),
      name,
      department,
      studentId,
      descriptor: Array.from({ length: 128 }, () => Math.random()), // Mock descriptor
      registeredAt: new Date().toISOString()
    }
    
    const updatedFaces = [...registeredFaces, newFace]
    setRegisteredFaces(updatedFaces)
    localStorage.setItem('registeredFaces', JSON.stringify(updatedFaces))
  }

  const markAttendance = async () => {
    if (!isVideoStarted) {
      throw new Error("Camera must be started to mark attendance")
    }
    
    // Simulate attendance marking
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const today = new Date().toDateString()
    const recognizedPerson = registeredFaces[0] // Demo: use first registered face
    
    if (!recognizedPerson) {
      throw new Error("No registered faces found")
    }
    
    const existingAttendance = todayAttendance.find(
      att => att.name === recognizedPerson.name && att.date === today
    )
    
    if (existingAttendance) {
      throw new Error("Attendance already marked for this person today")
    }
    
    const newAttendance: AttendanceRecord = {
      id: Date.now().toString(),
      name: recognizedPerson.name,
      date: today,
      time: new Date().toLocaleTimeString(),
      timestamp: new Date().toISOString(),
      confidence: 0.95
    }
    
    const updatedAttendance = [...todayAttendance, newAttendance]
    setTodayAttendance(updatedAttendance)
    localStorage.setItem('todayAttendance', JSON.stringify(updatedAttendance))
  }

  return {
    isModelLoaded,
    isVideoStarted,
    registeredFaces,
    todayAttendance,
    status,
    startCamera,
    stopCamera,
    markAttendance,
    registerPerson
  }
}

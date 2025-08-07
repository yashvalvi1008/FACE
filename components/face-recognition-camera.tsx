'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Camera, Square, Play, UserCheck, AlertCircle } from 'lucide-react'
import { FaceRecognitionService } from '@/lib/face-recognition'

interface RecognitionResult {
  match: boolean
  employee?: {
    id: number
    employeeId: string
    firstName: string
    lastName: string
    department: string
  }
  confidence?: number
  message?: string
}

interface FaceRecognitionCameraProps {
  onAttendanceMarked?: (employee: any) => void
}

export default function FaceRecognitionCamera({ onAttendanceMarked }: FaceRecognitionCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastRecognition, setLastRecognition] = useState<RecognitionResult | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const faceRecognitionService = FaceRecognitionService.getInstance()

  useEffect(() => {
    // Initialize face recognition models
    faceRecognitionService.initialize().catch(console.error)
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      
      setStream(mediaStream)
      setIsRecording(true)
      
      // Start continuous face recognition
      startFaceRecognition()
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera. Please check permissions.')
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    
    setIsRecording(false)
    setIsProcessing(false)
    setLastRecognition(null)
  }

  const startFaceRecognition = useCallback(() => {
    const recognizeInterval = setInterval(async () => {
      if (!isRecording || !videoRef.current || isProcessing) return

      try {
        setIsProcessing(true)
        
        // Extract face descriptor from video
        const faceDescriptor = await faceRecognitionService.extractFaceDescriptor(videoRef.current)
        
        if (faceDescriptor) {
          // Send to backend for recognition
          const response = await fetch('/api/face-recognition', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              faceDescriptor: Array.from(faceDescriptor)
            })
          })

          const result: RecognitionResult = await response.json()
          setLastRecognition(result)

          // If match found, mark attendance
          if (result.match && result.employee) {
            await markAttendance(result.employee, result.confidence || 0)
          }
        }
      } catch (error) {
        console.error('Face recognition error:', error)
      } finally {
        setIsProcessing(false)
      }
    }, 2000) // Check every 2 seconds

    return () => clearInterval(recognizeInterval)
  }, [isRecording, isProcessing])

  const markAttendance = async (employee: any, confidence: number) => {
    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          employeeId: employee.id,
          type: 'check-in',
          confidenceScore: confidence,
          notes: `Facial recognition check-in with ${(confidence * 100).toFixed(1)}% confidence`
        })
      })

      if (response.ok) {
        const attendanceRecord = await response.json()
        onAttendanceMarked?.(attendanceRecord)
      }
    } catch (error) {
      console.error('Error marking attendance:', error)
    }
  }

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const ctx = canvas.getContext('2d')

    if (ctx) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0)
      
      // You can save this image or use it for manual registration
      const imageData = canvas.toDataURL('image/jpeg')
      console.log('Captured image:', imageData)
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Camera className="w-5 h-5 text-green-400" />
          <CardTitle className="text-white">Facial Recognition</CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          {isProcessing && (
            <Badge className="bg-blue-500 text-white">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
              Processing
            </Badge>
          )}
          {isRecording && (
            <Badge className="bg-red-500 text-white">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
              LIVE
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ display: isRecording ? 'block' : 'none' }}
          />
          
          {!isRecording && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Camera className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Camera not active</p>
              </div>
            </div>
          )}

          {/* Recognition overlay */}
          {lastRecognition && isRecording && (
            <div className="absolute top-4 right-4 bg-black/80 rounded-lg p-3 max-w-xs">
              {lastRecognition.match ? (
                <div className="flex items-center space-x-2 text-green-400">
                  <UserCheck className="w-4 h-4" />
                  <div>
                    <p className="text-sm font-medium">
                      {lastRecognition.employee?.firstName} {lastRecognition.employee?.lastName}
                    </p>
                    <p className="text-xs text-gray-300">
                      {lastRecognition.employee?.department}
                    </p>
                    <p className="text-xs text-gray-400">
                      Confidence: {((lastRecognition.confidence || 0) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-yellow-400">
                  <AlertCircle className="w-4 h-4" />
                  <p className="text-sm">No match found</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hidden canvas for image capture */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Control buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={isRecording ? stopCamera : startCamera}
            className={`flex-1 ${
              isRecording 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isRecording ? (
              <>
                <Square className="w-4 h-4 mr-2" />
                Stop Camera
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Camera
              </>
            )}
          </Button>
          
          {isRecording && (
            <Button
              onClick={captureImage}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Camera className="w-4 h-4 mr-2" />
              Capture
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

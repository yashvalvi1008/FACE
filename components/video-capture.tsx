"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, CameraOff, UserCheck, Loader2, Play } from 'lucide-react'

interface VideoCaptureProps {
  isModelLoaded: boolean
  isVideoStarted: boolean
  onStartCamera: () => Promise<void>
  onStopCamera: () => void
  onMarkAttendance: () => Promise<void>
}

export function VideoCapture({
  isModelLoaded,
  isVideoStarted,
  onStartCamera,
  onStopCamera,
  onMarkAttendance
}: VideoCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false)

  const handleStartCamera = async () => {
    setIsLoading(true)
    try {
      await onStartCamera()
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAttendance = async () => {
    setIsMarkingAttendance(true)
    try {
      await onMarkAttendance()
    } finally {
      setIsMarkingAttendance(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Video Container */}
      <Card className="bg-white border-0 shadow-sm overflow-hidden">
        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative">
          {isVideoStarted ? (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                id="video"
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover rounded-t-lg"
              />
              <canvas
                ref={canvasRef}
                id="overlay"
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
              />
              {/* Live indicator */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                LIVE
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-4">
                <Camera className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Camera Ready</h3>
              <p className="text-gray-500 text-sm mb-4">
                Start camera to begin face detection
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Controls */}
      <div className="space-y-3">
        {!isVideoStarted ? (
          <Button
            onClick={handleStartCamera}
            disabled={!isModelLoaded || isLoading}
            className="w-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white border-0 rounded-2xl py-6 text-base font-semibold shadow-lg"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Play className="w-5 h-5 mr-2" />
            )}
            Start Camera
          </Button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={onStopCamera}
              variant="outline"
              className="rounded-2xl py-6 border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              <CameraOff className="w-4 h-4 mr-2" />
              Stop
            </Button>
            <Button
              onClick={handleMarkAttendance}
              disabled={isMarkingAttendance}
              className="bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white border-0 rounded-2xl py-6 shadow-lg"
            >
              {isMarkingAttendance ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <UserCheck className="w-4 h-4 mr-2" />
              )}
              Mark Present
            </Button>
          </div>
        )}
      </div>

      {/* Instructions */}
      <Card className="bg-orange-50 border-orange-100">
        <CardContent className="p-4">
          <div className="text-sm text-orange-800">
            <p className="font-medium mb-2">💡 Tips for best results:</p>
            <ul className="space-y-1 text-xs opacity-90">
              <li>• Ensure good lighting</li>
              <li>• Face the camera directly</li>
              <li>• Keep face within the frame</li>
              <li>• Register faces before marking attendance</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

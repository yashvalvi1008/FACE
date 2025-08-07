"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Users, Clock, UserPlus, Settings, Activity, Search } from 'lucide-react'
import { VideoCapture } from "@/components/video-capture"
import { AttendanceList } from "@/components/attendance-list"
import { RegisteredFaces } from "@/components/registered-faces"
import { RegistrationForm } from "@/components/registration-form"
import { AuthModal } from "@/components/auth-modal"
import { useAuth } from "@/hooks/use-auth"
import { useFaceRecognition } from "@/hooks/use-face-recognition"

export default function AttendanceSystem() {
  const { user, isAuthenticated } = useAuth()
  const {
    isModelLoaded,
    isVideoStarted,
    registeredFaces,
    todayAttendance,
    status,
    startCamera,
    stopCamera,
    markAttendance,
    registerPerson
  } = useFaceRecognition()

  const [showAuthModal, setShowAuthModal] = useState(!isAuthenticated)

  useEffect(() => {
    setShowAuthModal(!isAuthenticated)
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <div className="container mx-auto p-4 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <Camera className="w-4 h-4 text-white" />
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome back!
          </h1>
          <p className="text-gray-600 text-sm">
            {user?.name} • {user?.type}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search attendance records..."
            className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border-0 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
        </div>

        {/* Status Card */}
        <Card className="mb-6 bg-gradient-to-r from-orange-400 to-red-400 border-0 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm mb-1">System Status</p>
                <p className="font-semibold">{status}</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                isModelLoaded ? 'bg-green-300' : 'bg-yellow-300'
              } animate-pulse`} />
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{registeredFaces.length}</p>
              <p className="text-gray-500 text-sm">Registered</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{todayAttendance.length}</p>
              <p className="text-gray-500 text-sm">Present Today</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="camera" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-2xl p-1 mb-6">
            <TabsTrigger 
              value="camera" 
              className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Camera
            </TabsTrigger>
            <TabsTrigger 
              value="register"
              className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Register
            </TabsTrigger>
            <TabsTrigger 
              value="attendance"
              className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Records
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="camera" className="space-y-4">
            <VideoCapture
              isModelLoaded={isModelLoaded}
              isVideoStarted={isVideoStarted}
              onStartCamera={startCamera}
              onStopCamera={stopCamera}
              onMarkAttendance={markAttendance}
            />
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Register New Person
                </CardTitle>
                <CardDescription className="text-gray-500">
                  Add a new face to the recognition system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RegistrationForm
                  onRegister={registerPerson}
                  isVideoStarted={isVideoStarted}
                />
              </CardContent>
            </Card>

            <RegisteredFaces faces={registeredFaces} />
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            <AttendanceList attendance={todayAttendance} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

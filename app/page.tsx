'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Users, Clock, Calendar, Settings, Bell, Moon, User, Home, BarChart3, Building2, FolderOpen, FileText, UserPlus, HelpCircle } from 'lucide-react'
import FaceRecognitionCamera from '@/components/face-recognition-camera'
import EmployeeRegistration from '@/components/employee-registration'
import AttendanceDashboard from '@/components/attendance-dashboard'

export default function AttendanceSystem() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleAttendanceMarked = (attendanceRecord: any) => {
    // Refresh dashboard or show notification
    console.log('Attendance marked:', attendanceRecord)
  }

  const handleEmployeeRegistered = (employee: any) => {
    // Refresh employee list or show notification
    console.log('Employee registered:', employee)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Camera className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-semibold">AttendanceAI</span>
            </div>
            <div className="text-sm text-gray-400">
              <span>attendanceAI</span>
              <span className="mx-2">{'>'}</span>
              <span>dashboard</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400">
              {currentTime.toLocaleString()}
            </div>
            <Bell className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            <Moon className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-800 min-h-screen p-4">
          <nav className="space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">OVERVIEW</h3>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left ${
                    activeTab === 'dashboard' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span className="text-sm">Dashboard</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 text-left">
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-sm">Analytics</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 text-left">
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm">Departments</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 text-left">
                  <FolderOpen className="w-4 h-4" />
                  <span className="text-sm">Reports</span>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">ATTENDANCE</h3>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('camera')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left ${
                    activeTab === 'camera' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span className="text-sm">Face Recognition</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 text-left">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Time Logs</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 text-left">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">Records</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 text-left">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Schedules</span>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">TEAM</h3>
              <div className="space-y-1">
                <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 text-left">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Employees</span>
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left ${
                    activeTab === 'register' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="text-sm">Register Employee</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 text-left">
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm">Organization</span>
                </button>
              </div>
            </div>
          </nav>

          <div className="absolute bottom-4 left-4 right-4 space-y-1">
            <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 text-left">
              <Settings className="w-4 h-4" />
              <span className="text-sm">Settings</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 text-left">
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm">Help</span>
            </button>
          </div>
        
              <span className="text-sm">Help</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && <AttendanceDashboard />}
          
          {activeTab === 'camera' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FaceRecognitionCamera onAttendanceMarked={handleAttendanceMarked} />
              <AttendanceDashboard />
            </div>
          )}
          
          {activeTab === 'register' && (
            <EmployeeRegistration onEmployeeRegistered={handleEmployeeRegistered} />
          )}
        </main>
      </div>
    </div>
  )
}

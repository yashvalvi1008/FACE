"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Shield, UserPlus, Loader2, Camera } from 'lucide-react'
import { useAuth } from "@/hooks/use-auth"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("student")

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>, userType: string) => {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const credentials = Object.fromEntries(formData.entries())
    
    try {
      await login(credentials, userType)
      onClose()
    } catch (error) {
      alert('Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const userData = Object.fromEntries(formData.entries())
    
    try {
      await register(userData)
      alert('Registration successful! You can now login.')
      setActiveTab("student")
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Registration failed.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-gradient-to-br from-orange-50 to-red-50 border-0">
        <DialogHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-800">Welcome!</DialogTitle>
          <DialogDescription className="text-gray-600">
            Access the facial recognition attendance system
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white rounded-2xl p-1 mb-6">
            <TabsTrigger 
              value="student"
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-400 data-[state=active]:to-red-400 data-[state=active]:text-white"
            >
              Student
            </TabsTrigger>
            <TabsTrigger 
              value="admin"
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-400 data-[state=active]:to-red-400 data-[state=active]:text-white"
            >
              Admin
            </TabsTrigger>
            <TabsTrigger 
              value="register"
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-400 data-[state=active]:to-red-400 data-[state=active]:text-white"
            >
              Register
            </TabsTrigger>
          </TabsList>

          <TabsContent value="student">
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <GraduationCap className="w-6 h-6 text-blue-500" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-800">Student Login</CardTitle>
                <CardDescription className="text-gray-500">
                  Access your attendance records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => handleLogin(e, 'student')} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentId" className="text-gray-700 font-medium">Student ID</Label>
                    <Input
                      id="studentId"
                      name="studentId"
                      placeholder="Enter your student ID"
                      className="rounded-2xl border-gray-200 py-3 px-4 focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      className="rounded-2xl border-gray-200 py-3 px-4 focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white border-0 rounded-2xl py-6 text-base font-semibold shadow-lg" 
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Login as Student
                  </Button>
                </form>
                <div className="mt-4 p-3 bg-blue-50 rounded-2xl">
                  <p className="text-sm text-blue-800">
                    <strong>Demo:</strong> ID: student123, Password: password
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-purple-500" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-800">Admin Login</CardTitle>
                <CardDescription className="text-gray-500">
                  Manage the attendance system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => handleLogin(e, 'admin')} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter admin email"
                      className="rounded-2xl border-gray-200 py-3 px-4 focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter admin password"
                      className="rounded-2xl border-gray-200 py-3 px-4 focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accessLevel" className="text-gray-700 font-medium">Access Level</Label>
                    <Select name="accessLevel" required>
                      <SelectTrigger className="rounded-2xl border-gray-200 py-3 px-4 focus:ring-2 focus:ring-orange-200">
                        <SelectValue placeholder="Select access level" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="super" className="rounded-lg">Super Admin</SelectItem>
                        <SelectItem value="department" className="rounded-lg">Department Admin</SelectItem>
                        <SelectItem value="teacher" className="rounded-lg">Teacher</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white border-0 rounded-2xl py-6 text-base font-semibold shadow-lg" 
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Login as Admin
                  </Button>
                </form>
                <div className="mt-4 p-3 bg-purple-50 rounded-2xl">
                  <p className="text-sm text-purple-800">
                    <strong>Demo:</strong> Email: admin@school.edu, Password: admin123
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <UserPlus className="w-6 h-6 text-green-500" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-800">Create Account</CardTitle>
                <CardDescription className="text-gray-500">
                  Join the attendance system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="accountType" className="text-gray-700 font-medium">Account Type</Label>
                    <Select name="accountType" required>
                      <SelectTrigger className="rounded-2xl border-gray-200 py-3 px-4 focus:ring-2 focus:ring-orange-200">
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="student" className="rounded-lg">Student</SelectItem>
                        <SelectItem value="teacher" className="rounded-lg">Teacher</SelectItem>
                        <SelectItem value="admin" className="rounded-lg">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-gray-700 font-medium">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Enter your full name"
                      className="rounded-2xl border-gray-200 py-3 px-4 focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="rounded-2xl border-gray-200 py-3 px-4 focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      className="rounded-2xl border-gray-200 py-3 px-4 focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white border-0 rounded-2xl py-6 text-base font-semibold shadow-lg" 
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Create Account
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

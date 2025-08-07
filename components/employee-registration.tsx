'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Camera, UserPlus, Save } from 'lucide-react'
import { FaceRecognitionService } from '@/lib/face-recognition'

interface EmployeeRegistrationProps {
  onEmployeeRegistered?: (employee: any) => void
}

export default function EmployeeRegistration({ onEmployeeRegistered }: EmployeeRegistrationProps) {
  const [formData, setFormData] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    hireDate: ''
  })
  const [faceDescriptor, setFaceDescriptor] = useState<Float32Array | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const faceRecognitionService = FaceRecognitionService.getInstance()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const startFaceCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCapturing(true)
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera')
    }
  }

  const captureFace = async () => {
    if (!videoRef.current) return

    try {
      // Extract face descriptor
      const descriptor = await faceRecognitionService.extractFaceDescriptor(videoRef.current)
      
      if (descriptor) {
        setFaceDescriptor(descriptor)
        
        // Stop camera
        const stream = videoRef.current.srcObject as MediaStream
        if (stream) {
          stream.getTracks().forEach(track => track.stop())
        }
        setIsCapturing(false)
        
        alert('Face captured successfully!')
      } else {
        alert('No face detected. Please try again.')
      }
    } catch (error) {
      console.error('Error capturing face:', error)
      alert('Error capturing face')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!faceDescriptor) {
      alert('Please capture face data first')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          faceDescriptor: Array.from(faceDescriptor)
        })
      })

      if (response.ok) {
        const employee = await response.json()
        onEmployeeRegistered?.(employee)
        
        // Reset form
        setFormData({
          employeeId: '',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          department: '',
          position: '',
          hireDate: ''
        })
        setFaceDescriptor(null)
        
        alert('Employee registered successfully!')
      } else {
        const error = await response.json()
        alert(error.error || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('Registration failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <UserPlus className="w-5 h-5 mr-2 text-green-400" />
          Register New Employee
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="employeeId" className="text-gray-300">Employee ID</Label>
              <Input
                id="employeeId"
                value={formData.employeeId}
                onChange={(e) => handleInputChange('employeeId', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-gray-300">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="department" className="text-gray-300">Department</Label>
              <Select onValueChange={(value) => handleInputChange('department', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Human Resources">Human Resources</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="position" className="text-gray-300">Position</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="hireDate" className="text-gray-300">Hire Date</Label>
              <Input
                id="hireDate"
                type="date"
                value={formData.hireDate}
                onChange={(e) => handleInputChange('hireDate', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          {/* Face capture section */}
          <div className="space-y-4">
            <Label className="text-gray-300">Face Data</Label>
            
            {isCapturing ? (
              <div className="space-y-4">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full max-w-md mx-auto rounded-lg"
                />
                <div className="flex justify-center space-x-2">
                  <Button type="button" onClick={captureFace} className="bg-green-600 hover:bg-green-700">
                    <Camera className="w-4 h-4 mr-2" />
                    Capture Face
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCapturing(false)}
                    className="border-gray-600 text-gray-300"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                {faceDescriptor ? (
                  <div className="space-y-2">
                    <p className="text-green-400">✓ Face data captured</p>
                    <Button 
                      type="button" 
                      onClick={startFaceCapture}
                      variant="outline"
                      className="border-gray-600 text-gray-300"
                    >
                      Recapture Face
                    </Button>
                  </div>
                ) : (
                  <Button 
                    type="button" 
                    onClick={startFaceCapture}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Capture Face Data
                  </Button>
                )}
              </div>
            )}
          </div>

          <canvas ref={canvasRef} style={{ display: 'none' }} />

          <Button 
            type="submit" 
            disabled={isSubmitting || !faceDescriptor}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Registering...' : 'Register Employee'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

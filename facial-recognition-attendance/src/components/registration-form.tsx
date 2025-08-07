"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, Loader2 } from 'lucide-react'
import { useAuth } from "@/hooks/use-auth"

interface RegistrationFormProps {
  onRegister: (name: string, department?: string, studentId?: string) => Promise<void>
  isVideoStarted: boolean
}

export function RegistrationForm({ onRegister, isVideoStarted }: RegistrationFormProps) {
  const { user } = useAuth()
  const [name, setName] = useState("")
  const [department, setDepartment] = useState("")
  const [studentId, setStudentId] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsRegistering(true)
    try {
      await onRegister(name.trim(), department, studentId)
      setName("")
      setDepartment("")
      setStudentId("")
    } finally {
      setIsRegistering(false)
    }
  }

  const departments = [
    "Computer Science",
    "Electrical Engineering", 
    "Mechanical Engineering",
    "Civil Engineering",
    "Business Administration",
    "Mathematics",
    "Physics",
    "Chemistry"
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter person's full name"
          className="rounded-2xl border-gray-200 py-3 px-4 focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
          required
        />
      </div>

      {user?.type === 'admin' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="studentId" className="text-gray-700 font-medium">Student ID</Label>
            <Input
              id="studentId"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Enter student ID (optional)"
              className="rounded-2xl border-gray-200 py-3 px-4 focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department" className="text-gray-700 font-medium">Department</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="rounded-2xl border-gray-200 py-3 px-4 focus:ring-2 focus:ring-orange-200">
                <SelectValue placeholder="Select department (optional)" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept} className="rounded-lg">
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      <Button
        type="submit"
        disabled={!name.trim() || !isVideoStarted || isRegistering}
        className="w-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white border-0 rounded-2xl py-6 text-base font-semibold shadow-lg"
      >
        {isRegistering ? (
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
        ) : (
          <UserPlus className="w-5 h-5 mr-2" />
        )}
        Register Face
      </Button>

      {!isVideoStarted && (
        <div className="text-center p-4 bg-gray-50 rounded-2xl">
          <p className="text-sm text-gray-500">
            📷 Start the camera first to register faces
          </p>
        </div>
      )}
    </form>
  )
}
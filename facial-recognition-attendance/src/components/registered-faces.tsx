"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Calendar, Trash2, User } from 'lucide-react'
import { RegisteredFace } from "@/types/attendance"

interface RegisteredFacesProps {
  faces: RegisteredFace[]
}

export function RegisteredFaces({ faces }: RegisteredFacesProps) {
  const handleDeleteFace = (faceId: string) => {
    if (confirm('Are you sure you want to delete this registered face?')) {
      const updatedFaces = faces.filter(face => face.id !== faceId)
      localStorage.setItem('registeredFaces', JSON.stringify(updatedFaces))
      window.location.reload()
    }
  }

  return (
    <Card className="bg-white border-0 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-500" />
              Registered Faces
            </CardTitle>
            <CardDescription className="text-gray-500 mt-1">
              People in the system
            </CardDescription>
          </div>
          <Badge 
            variant="secondary" 
            className="bg-orange-100 text-orange-700 border-0 rounded-full px-3 py-1"
          >
            {faces.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {faces.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">No Faces Registered</h3>
            <p className="text-gray-500 text-sm">
              Register faces to enable recognition
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {faces.map((face) => (
              <div
                key={face.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{face.name}</p>
                    {face.department && (
                      <p className="text-sm text-gray-500">{face.department}</p>
                    )}
                    {face.studentId && (
                      <p className="text-xs text-gray-400">ID: {face.studentId}</p>
                    )}
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">
                        {new Date(face.registeredAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => handleDeleteFace(face.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
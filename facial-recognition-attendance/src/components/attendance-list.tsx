"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Download, Trash2, Users, CheckCircle } from 'lucide-react'
import { AttendanceRecord } from "@/types/attendance"

interface AttendanceListProps {
  attendance: AttendanceRecord[]
}

export function AttendanceList({ attendance }: AttendanceListProps) {
  const today = new Date().toDateString()
  const todayRecords = attendance.filter(record => record.date === today)

  const handleExport = () => {
    const csvContent = [
      ['Name', 'Time', 'Date', 'Confidence'],
      ...todayRecords.map(record => [
        record.name,
        record.time,
        record.date,
        record.confidence?.toFixed(2) || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `attendance-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClearRecords = () => {
    if (confirm('Are you sure you want to clear today\'s attendance records?')) {
      localStorage.setItem('todayAttendance', JSON.stringify([]))
      window.location.reload()
    }
  }

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                Today's Attendance
              </CardTitle>
              <CardDescription className="text-gray-500 mt-1">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">{todayRecords.length}</div>
              <div className="text-xs text-gray-500">Present</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Attendance Records */}
      {todayRecords.length === 0 ? (
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">No Records Yet</h3>
            <p className="text-gray-500 text-sm">
              Mark attendance to see records here
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {todayRecords.map((record, index) => (
              <Card key={record.id} className="bg-white border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-400 rounded-2xl flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{record.name}</p>
                        <p className="text-sm text-gray-500">{record.time}</p>
                      </div>
                    </div>
                    {record.confidence && (
                      <Badge 
                        variant="secondary" 
                        className="bg-green-100 text-green-700 border-0 rounded-full px-3 py-1"
                      >
                        {(record.confidence * 100).toFixed(0)}%
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              onClick={handleExport}
              variant="outline"
              className="rounded-2xl py-6 border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={handleClearRecords}
              variant="outline"
              className="rounded-2xl py-6 border-red-200 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
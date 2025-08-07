'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, Clock, Calendar, UserCheck, ArrowRight, Download } from 'lucide-react'
import { format } from 'date-fns'

interface AttendanceRecord {
  id: number
  employee: {
    id: number
    employeeId: string
    firstName: string
    lastName: string
    department: string
  }
  checkInTime: string
  checkOutTime?: string
  status: string
  confidenceScore?: number
}

interface AttendanceStats {
  present: number
  total: number
  late: number
  absent: number
}

export default function AttendanceDashboard() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [stats, setStats] = useState<AttendanceStats>({
    present: 0,
    total: 0,
    late: 0,
    absent: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTodayAttendance()
    fetchStats()
  }, [])

  const fetchTodayAttendance = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const response = await fetch(`/api/attendance?date=${today}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        const records = await response.json()
        setAttendanceRecords(records)
      }
    } catch (error) {
      console.error('Error fetching attendance:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      // Fetch employees count
      const employeesResponse = await fetch('/api/employees', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (employeesResponse.ok) {
        const employees = await employeesResponse.json()
        const totalEmployees = employees.length

        // Fetch today's attendance
        const today = new Date().toISOString().split('T')[0]
        const attendanceResponse = await fetch(`/api/attendance?date=${today}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        if (attendanceResponse.ok) {
          const records = await attendanceResponse.json()
          const presentCount = records.length
          const lateCount = records.filter((record: AttendanceRecord) => {
            const checkInTime = new Date(record.checkInTime)
            const nineAM = new Date()
            nineAM.setHours(9, 0, 0, 0)
            return checkInTime > nineAM
          }).length

          setStats({
            present: presentCount,
            total: totalEmployees,
            late: lateCount,
            absent: totalEmployees - presentCount
          })
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const exportAttendance = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const response = await fetch(`/api/attendance/export?date=${today}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `attendance-${today}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error exporting attendance:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'late': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'absent': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const statsData = [
    { label: 'Present Today', value: stats.present, icon: UserCheck, color: 'text-green-400' },
    { label: 'Total Employees', value: stats.total, icon: Users, color: 'text-blue-400' },
    { label: 'Late Arrivals', value: stats.late, icon: Clock, color: 'text-yellow-400' },
    { label: 'Absent', value: stats.absent, icon: Calendar, color: 'text-red-400' }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading attendance data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <Card key={index} className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Attendance */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <CardTitle className="text-white">Today's Attendance</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={exportAttendance}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <div className="text-sm text-gray-400">
              {format(new Date(), 'MMM dd, yyyy')} ({attendanceRecords.length} check-ins)
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {attendanceRecords.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No attendance records for today
            </div>
          ) : (
            <div className="space-y-3">
              {attendanceRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {record.employee.firstName[0]}{record.employee.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {record.employee.firstName} {record.employee.lastName}
                      </p>
                      <p className="text-sm text-gray-400">
                        {record.employee.department} • ID: {record.employee.employeeId}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm text-white">
                        {format(new Date(record.checkInTime), 'h:mm a')}
                      </p>
                      {record.checkOutTime && (
                        <p className="text-xs text-gray-400">
                          Out: {format(new Date(record.checkOutTime), 'h:mm a')}
                        </p>
                      )}
                      {record.confidenceScore && (
                        <p className="text-xs text-gray-500">
                          {(record.confidenceScore * 100).toFixed(1)}% confidence
                        </p>
                      )}
                    </div>
                    <Badge className={getStatusColor(record.status)}>
                      {record.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <Button 
            variant="outline" 
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 mt-4"
          >
            View All Records
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}


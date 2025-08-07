import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'
import { format } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    if (!date) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 })
    }

    const attendanceRecords = await prisma.attendanceRecord.findMany({
      where: {
        date: new Date(date)
      },
      include: {
        employee: {
          select: {
            employeeId: true,
            firstName: true,
            lastName: true,
            department: true,
            position: true
          }
        }
      },
      orderBy: { checkInTime: 'asc' }
    })

    // Generate CSV content
    const csvHeaders = [
      'Employee ID',
      'Name',
      'Department',
      'Position',
      'Check In',
      'Check Out',
      'Status',
      'Hours Worked',
      'Confidence Score'
    ]

    const csvRows = attendanceRecords.map(record => {
      const checkIn = record.checkInTime ? format(new Date(record.checkInTime), 'HH:mm:ss') : ''
      const checkOut = record.checkOutTime ? format(new Date(record.checkOutTime), 'HH:mm:ss') : ''
      
      let hoursWorked = ''
      if (record.checkInTime && record.checkOutTime) {
        const diff = new Date(record.checkOutTime).getTime() - new Date(record.checkInTime).getTime()
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        hoursWorked = `${hours}:${minutes.toString().padStart(2, '0')}`
      }

      return [
        record.employee.employeeId,
        `${record.employee.firstName} ${record.employee.lastName}`,
        record.employee.department || '',
        record.employee.position || '',
        checkIn,
        checkOut,
        record.status,
        hoursWorked,
        record.confidenceScore ? (record.confidenceScore * 100).toFixed(1) + '%' : ''
      ]
    })

    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="attendance-${date}.csv"`
      }
    })
  } catch (error) {
    console.error('Export attendance error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

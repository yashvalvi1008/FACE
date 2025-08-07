import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const employeeId = searchParams.get('employeeId')

    let whereClause: any = {}

    if (date) {
      whereClause.date = new Date(date)
    }

    if (employeeId) {
      whereClause.employeeId = parseInt(employeeId)
    }

    const attendanceRecords = await prisma.attendanceRecord.findMany({
      where: whereClause,
      include: {
        employee: {
          select: {
            id: true,
            employeeId: true,
            firstName: true,
            lastName: true,
            department: true,
            position: true
          }
        }
      },
      orderBy: { checkInTime: 'desc' }
    })

    return NextResponse.json(attendanceRecords)
  } catch (error) {
    console.error('Get attendance error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { employeeId, type, confidenceScore, notes } = await request.json()

    if (!employeeId || !type) {
      return NextResponse.json(
        { error: 'Employee ID and type are required' },
        { status: 400 }
      )
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check if attendance record exists for today
    let attendanceRecord = await prisma.attendanceRecord.findFirst({
      where: {
        employeeId: parseInt(employeeId),
        date: today
      }
    })

    const now = new Date()

    if (type === 'check-in') {
      if (attendanceRecord) {
        return NextResponse.json(
          { error: 'Employee already checked in today' },
          { status: 400 }
        )
      }

      attendanceRecord = await prisma.attendanceRecord.create({
        data: {
          employeeId: parseInt(employeeId),
          checkInTime: now,
          date: today,
          status: 'present',
          confidenceScore,
          notes
        },
        include: {
          employee: {
            select: {
              id: true,
              employeeId: true,
              firstName: true,
              lastName: true,
              department: true
            }
          }
        }
      })
    } else if (type === 'check-out') {
      if (!attendanceRecord) {
        return NextResponse.json(
          { error: 'No check-in record found for today' },
          { status: 400 }
        )
      }

      if (attendanceRecord.checkOutTime) {
        return NextResponse.json(
          { error: 'Employee already checked out today' },
          { status: 400 }
        )
      }

      attendanceRecord = await prisma.attendanceRecord.update({
        where: { id: attendanceRecord.id },
        data: {
          checkOutTime: now,
          confidenceScore,
          notes
        },
        include: {
          employee: {
            select: {
              id: true,
              employeeId: true,
              firstName: true,
              lastName: true,
              department: true
            }
          }
        }
      })
    }

    return NextResponse.json(attendanceRecord, { status: 201 })
  } catch (error) {
    console.error('Create attendance error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { faceDescriptor } = await request.json()

    if (!faceDescriptor || !Array.isArray(faceDescriptor)) {
      return NextResponse.json(
        { error: 'Valid face descriptor is required' },
        { status: 400 }
      )
    }

    // Get all employees with face descriptors
    const employees = await prisma.employee.findMany({
      where: {
        isActive: true,
        faceDescriptor: { not: null }
      },
      select: {
        id: true,
        employeeId: true,
        firstName: true,
        lastName: true,
        department: true,
        faceDescriptor: true
      }
    })

    // Find the best match
    let bestMatch = null
    let bestDistance = Infinity
    const threshold = 0.6

    for (const employee of employees) {
      if (!employee.faceDescriptor) continue

      try {
        const storedDescriptor = JSON.parse(employee.faceDescriptor)
        
        // Calculate Euclidean distance
        let distance = 0
        for (let i = 0; i < faceDescriptor.length; i++) {
          distance += Math.pow(faceDescriptor[i] - storedDescriptor[i], 2)
        }
        distance = Math.sqrt(distance)

        if (distance < bestDistance && distance < threshold) {
          bestDistance = distance
          bestMatch = {
            employee: {
              id: employee.id,
              employeeId: employee.employeeId,
              firstName: employee.firstName,
              lastName: employee.lastName,
              department: employee.department
            },
            confidence: 1 - distance,
            distance
          }
        }
      } catch (error) {
        console.error('Error parsing face descriptor for employee:', employee.id, error)
      }
    }

    if (bestMatch) {
      return NextResponse.json({
        match: true,
        employee: bestMatch.employee,
        confidence: bestMatch.confidence
      })
    } else {
      return NextResponse.json({
        match: false,
        message: 'No matching employee found'
      })
    }
  } catch (error) {
    console.error('Face recognition error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

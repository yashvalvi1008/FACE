import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

export const prisma = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

// Database connection helper
export async function connectDB() {
  try {
    await prisma.$connect()
    console.log('Database connected successfully')
  } catch (error) {
    console.error('Database connection failed:', error)
    throw error
  }
}

// Database models and types
export interface Employee {
  id: number
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  department?: string
  position?: string
  hireDate?: Date
  isActive: boolean
  faceDescriptor?: string
  profileImageUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface AttendanceRecord {
  id: number
  employeeId: number
  checkInTime?: Date
  checkOutTime?: Date
  date: Date
  status: 'present' | 'absent' | 'late' | 'half_day'
  confidenceScore?: number
  notes?: string
  createdAt: Date
  updatedAt: Date
  employee?: Employee
}

export interface Department {
  id: number
  name: string
  description?: string
  managerId?: number
  createdAt: Date
}

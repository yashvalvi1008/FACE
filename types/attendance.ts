export interface AttendanceRecord {
  id: string
  name: string
  date: string
  time: string
  timestamp: string
  confidence?: number
}

export interface RegisteredFace {
  id: string
  name: string
  department?: string
  studentId?: string
  descriptor: number[]
  registeredAt: string
}

export interface User {
  id: string
  name: string
  email: string
  type: 'student' | 'admin' | 'teacher'
  studentId?: string
  department?: string
  accessLevel?: string
}

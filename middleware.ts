import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function middleware(request: NextRequest) {
  // Check if the request is for API routes that require authentication
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Skip authentication for login route
    if (request.nextUrl.pathname === '/api/auth/login') {
      return NextResponse.next()
    }

    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*']
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Camera,
  Users,
  UserPlus,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Calendar,
  Clock,
  TrendingUp,
  Eye,
  Plus,
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)

    const timer = setInterval(() => setCurrentTime(new Date()), 1000)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      clearInterval(timer)
    }
  }, [])

  const classes = [
    { id: 1, name: "Computer Science 101", students: 45, time: "9:00 AM", room: "Room 204" },
    { id: 2, name: "Data Structures", students: 32, time: "11:00 AM", room: "Room 301" },
    { id: 3, name: "Algorithms", students: 28, time: "2:00 PM", room: "Room 105" },
  ]

  const recentActivity = [
    { action: "Attendance taken", class: "CS 101", time: "2 hours ago", students: 42 },
    { action: "New student added", class: "Data Structures", time: "4 hours ago", students: 1 },
    { action: "Attendance taken", class: "Algorithms", time: "1 day ago", students: 26 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background relative overflow-hidden">
      {/* Animated background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(217, 119, 6, 0.1), transparent 40%)`,
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center animate-pulse-slow">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold">FaceTrack Dashboard</h1>
                <p className="text-muted-foreground">
                  {currentTime.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                <Settings className="w-5 h-5" />
              </Button>
              <Avatar className="w-10 h-10 border-2 border-primary/20">
                <AvatarImage src="/diverse-professor-lecturing.png" />
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">JD</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="sm" className="hover:bg-destructive/10 hover:text-destructive">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-serif font-bold mb-2">Welcome back, Professor!</h2>
          <p className="text-muted-foreground text-lg">Ready to track attendance for your classes today?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Total Classes", value: "3", icon: Calendar, color: "from-blue-500 to-blue-600" },
            { title: "Total Students", value: "105", icon: Users, color: "from-green-500 to-green-600" },
            { title: "Today's Attendance", value: "89%", icon: TrendingUp, color: "from-purple-500 to-purple-600" },
            { title: "Active Sessions", value: "2", icon: Clock, color: "from-orange-500 to-orange-600" },
          ].map((stat, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-500 hover:scale-105 bg-card/50 backdrop-blur-sm border-primary/20"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold font-serif">{stat.value}</p>
                  </div>
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 mb-8">
              <CardHeader>
                <CardTitle className="font-serif text-2xl">Quick Actions</CardTitle>
                <CardDescription>Manage your classes and students efficiently</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      icon: Camera,
                      title: "Take Attendance",
                      href: "/attendance",
                      desc: "Start facial recognition scan",
                    },
                    { icon: UserPlus, title: "Add Student", href: "/students/add", desc: "Register new student" },
                    { icon: Users, title: "Manage Students", href: "/students", desc: "View and edit student data" },
                    { icon: BarChart3, title: "View Reports", href: "/reports", desc: "Attendance analytics" },
                  ].map((action, index) => (
                    <Link key={index} href={action.href}>
                      <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-background/50 border-primary/10">
                        <CardContent className="p-4 text-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:rotate-12 transition-transform duration-300">
                            <action.icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-xs text-muted-foreground">{action.desc}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Today's Classes */}
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-serif text-2xl">Today's Classes</CardTitle>
                  <CardDescription>Your scheduled classes for today</CardDescription>
                </div>
                <Button size="sm" className="bg-gradient-to-r from-primary to-secondary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Class
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {classes.map((classItem) => (
                  <Card
                    key={classItem.id}
                    className="group hover:shadow-md transition-all duration-300 hover:scale-[1.02] bg-background/30 border-primary/10"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                            {classItem.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {classItem.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {classItem.students} students
                            </span>
                            <Badge variant="outline" className="border-primary/30 text-primary">
                              {classItem.room}
                            </Badge>
                          </div>
                        </div>
                        <Link href={`/attendance/${classItem.id}`}>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-transform"
                          >
                            <Camera className="w-4 h-4 mr-2" />
                            Take Attendance
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="font-serif text-xl">Recent Activity</CardTitle>
                <CardDescription>Latest updates from your classes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-background/30 hover:bg-background/50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.class}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                        <Badge variant="secondary" className="text-xs">
                          {activity.students} {activity.students === 1 ? "student" : "students"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

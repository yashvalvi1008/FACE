"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, ArrowLeft, Search, Plus, Edit, Trash2, Camera, Eye, Filter, Download, Upload } from "lucide-react"
import Link from "next/link"

export default function StudentsPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClass, setSelectedClass] = useState("all")

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const students = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice.johnson@university.edu",
      studentId: "CS2024001",
      class: "Computer Science 101",
      faceData: true,
      lastSeen: "2 hours ago",
      attendance: 95,
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob.smith@university.edu",
      studentId: "CS2024002",
      class: "Data Structures",
      faceData: true,
      lastSeen: "1 day ago",
      attendance: 87,
    },
    {
      id: 3,
      name: "Carol Davis",
      email: "carol.davis@university.edu",
      studentId: "CS2024003",
      class: "Computer Science 101",
      faceData: false,
      lastSeen: "Never",
      attendance: 0,
    },
    {
      id: 4,
      name: "David Wilson",
      email: "david.wilson@university.edu",
      studentId: "CS2024004",
      class: "Algorithms",
      faceData: true,
      lastSeen: "3 hours ago",
      attendance: 92,
    },
    {
      id: 5,
      name: "Eva Brown",
      email: "eva.brown@university.edu",
      studentId: "CS2024005",
      class: "Data Structures",
      faceData: true,
      lastSeen: "5 hours ago",
      attendance: 78,
    },
  ]

  const classes = ["All Classes", "Computer Science 101", "Data Structures", "Algorithms"]

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesClass = selectedClass === "all" || student.class === selectedClass
    return matchesSearch && matchesClass
  })

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
              <Link href="/dashboard" className="hover:bg-primary/10 p-2 rounded-lg transition-colors group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </Link>
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center animate-pulse-slow">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold">Student Management</h1>
                <p className="text-muted-foreground">Manage student data and facial recognition profiles</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="outline" className="border-primary/30 hover:bg-primary/5 bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" className="border-primary/30 hover:bg-primary/5 bg-transparent">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Link href="/students/add">
                <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 hover:scale-105">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Filters and Search */}
        <Card className="bg-card/50 backdrop-blur-sm border-primary/20 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search students by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-input/50 border-primary/20 focus:border-primary"
                />
              </div>

              <div className="flex items-center gap-3">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="px-3 py-2 bg-input/50 border border-primary/20 rounded-md focus:border-primary outline-none"
                >
                  <option value="all">All Classes</option>
                  {classes.slice(1).map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Total Students", value: students.length.toString(), color: "from-blue-500 to-blue-600" },
            {
              title: "With Face Data",
              value: students.filter((s) => s.faceData).length.toString(),
              color: "from-green-500 to-green-600",
            },
            {
              title: "Pending Setup",
              value: students.filter((s) => !s.faceData).length.toString(),
              color: "from-orange-500 to-orange-600",
            },
            {
              title: "Avg Attendance",
              value: `${Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / students.length)}%`,
              color: "from-purple-500 to-purple-600",
            },
          ].map((stat, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-500 hover:scale-105 bg-card/50 backdrop-blur-sm border-primary/20"
            >
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold font-serif mb-2">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.title}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Students Grid */}
        <div className="grid gap-6">
          {filteredStudents.map((student) => (
            <Card
              key={student.id}
              className="group hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-card/50 backdrop-blur-sm border-primary/20"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 border-2 border-primary/20">
                      <AvatarImage src={`/abstract-geometric-shapes.png?height=64&width=64&query=${student.name}`} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-lg">
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <h3 className="text-xl font-semibold font-serif group-hover:text-primary transition-colors">
                        {student.name}
                      </h3>
                      <p className="text-muted-foreground">{student.email}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="outline" className="border-primary/30 text-primary">
                          {student.studentId}
                        </Badge>
                        <Badge variant="secondary">{student.class}</Badge>
                        {student.faceData ? (
                          <Badge className="bg-green-500/20 text-green-700 border-green-500/30">
                            <Eye className="w-3 h-3 mr-1" />
                            Face Data Ready
                          </Badge>
                        ) : (
                          <Badge className="bg-orange-500/20 text-orange-700 border-orange-500/30">
                            <Camera className="w-3 h-3 mr-1" />
                            Setup Required
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold font-serif mb-1">{student.attendance}%</div>
                    <div className="text-sm text-muted-foreground mb-2">Attendance</div>
                    <div className="text-xs text-muted-foreground">Last seen: {student.lastSeen}</div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-primary/30 hover:bg-primary/5 bg-transparent"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      {!student.faceData && (
                        <Button size="sm" className="bg-gradient-to-r from-primary to-secondary">
                          <Camera className="w-4 h-4 mr-1" />
                          Setup Face
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-destructive/30 hover:bg-destructive/5 hover:text-destructive bg-transparent"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No students found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm ? "Try adjusting your search criteria" : "Add your first student to get started"}
              </p>
              <Link href="/students/add">
                <Button className="bg-gradient-to-r from-primary to-secondary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

"use client"

import { ProtectedLayout } from "@/components/layout/ProtectedLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, UserPlus } from "lucide-react"

const doctorsData = [
  { id: 1, name: "Dr. Sunil Perera", specialty: "Cardiologist", hospital: "Asiri Hospital Colombo", slmc: "SLMC-4523", experience: "15 years", phone: "0771234567", status: "Active" },
  { id: 2, name: "Dr. Nimali Fernando", specialty: "Pediatrician", hospital: "Lanka Hospitals", slmc: "SLMC-3891", experience: "12 years", phone: "0772345678", status: "Active" },
  { id: 3, name: "Dr. Rohan Wickramasinghe", specialty: "Orthopedic Surgeon", hospital: "Nawaloka Hospital", slmc: "SLMC-5267", experience: "18 years", phone: "0773456789", status: "Active" },
  { id: 4, name: "Dr. Champa Jayawardena", specialty: "Gynecologist", hospital: "Durdans Hospital", slmc: "SLMC-4102", experience: "10 years", phone: "0774567890", status: "Active" },
  { id: 5, name: "Dr. Samantha Silva", specialty: "ENT Specialist", hospital: "Oasis Hospital", slmc: "SLMC-3645", experience: "8 years", phone: "0775678901", status: "Active" },
  { id: 6, name: "Dr. Priyanka Gunawardena", specialty: "Dermatologist", hospital: "Asiri Hospital Kandy", slmc: "SLMC-5891", experience: "14 years", phone: "0776789012", status: "On Leave" },
  { id: 7, name: "Dr. Mahesh Rajapaksa", specialty: "Neurologist", hospital: "Lanka Hospitals", slmc: "SLMC-4738", experience: "20 years", phone: "0777890123", status: "Active" },
  { id: 8, name: "Dr. Sanduni De Silva", specialty: "Ophthalmologist", hospital: "Central Hospital", slmc: "SLMC-3294", experience: "9 years", phone: "0778901234", status: "Active" },
]

export default function DoctorsPage() {
  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Doctor Management</h1>
            <p className="text-gray-600 mt-1">Manage doctor profiles and schedules</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="w-4 h-4 mr-2" />
            Add New Doctor
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Doctors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">763</div>
              <p className="text-xs text-gray-600 mt-1">Across all hospitals</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Active Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">245</div>
              <p className="text-xs text-gray-600 mt-1">Currently available</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Specializations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">42</div>
              <p className="text-xs text-gray-600 mt-1">Medical specialties</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">On Leave</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">18</div>
              <p className="text-xs text-gray-600 mt-1">Temporarily unavailable</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>All Doctors</CardTitle>
                <CardDescription>Registered medical practitioners on the platform</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search doctors..." className="pl-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead>SLMC Number</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctorsData.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell className="font-medium">{doctor.name}</TableCell>
                    <TableCell>{doctor.specialty}</TableCell>
                    <TableCell>{doctor.hospital}</TableCell>
                    <TableCell className="text-sm text-gray-600">{doctor.slmc}</TableCell>
                    <TableCell className="text-sm">{doctor.experience}</TableCell>
                    <TableCell className="text-sm text-gray-600">{doctor.phone}</TableCell>
                    <TableCell>
                      <Badge variant={doctor.status === "Active" ? "default" : "secondary"}>
                        {doctor.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  )
}

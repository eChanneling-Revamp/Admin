"use client"

import { ProtectedLayout } from "@/components/layout/ProtectedLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, UserPlus, MoreVertical } from "lucide-react"

const dummyUsers = [
  { id: 1, name: "Nimal Perera", email: "nimal.perera@echannelling.lk", role: "Admin", phone: "0712345678", status: "Active", location: "Colombo" },
  { id: 2, name: "Kamala Silva", email: "kamala.silva@echannelling.lk", role: "Hospital Manager", phone: "0771234567", status: "Active", location: "Kandy" },
  { id: 3, name: "Sunil Fernando", email: "sunil.fernando@echannelling.lk", role: "Agent Manager", phone: "0778765432", status: "Active", location: "Galle" },
  { id: 4, name: "Dilani Wickramasinghe", email: "dilani.w@echannelling.lk", role: "Support Staff", phone: "0765432109", status: "Active", location: "Colombo" },
  { id: 5, name: "Kasun Rajapaksa", email: "kasun.r@echannelling.lk", role: "Finance Manager", phone: "0754321098", status: "Active", location: "Negombo" },
  { id: 6, name: "Sanduni Jayawardena", email: "sanduni.j@echannelling.lk", role: "Customer Service", phone: "0743210987", status: "Inactive", location: "Matara" },
  { id: 7, name: "Rohan De Silva", email: "rohan.ds@echannelling.lk", role: "IT Administrator", phone: "0732109876", status: "Active", location: "Colombo" },
  { id: 8, name: "Nadeesha Gunasekara", email: "nadeesha.g@echannelling.lk", role: "Marketing Manager", phone: "0721098765", status: "Active", location: "Kurunegala" },
]

export default function UsersPage() {
  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Manage all system users and their permissions</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="w-4 h-4 mr-2" />
            Add New User
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Total {dummyUsers.length} users in the system</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search users..." className="pl-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dummyUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.location}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
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

"use client"

import { ProtectedLayout } from "@/components/layout/ProtectedLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, UserPlus } from "lucide-react"

const agentsData = [
  { id: 1, name: "Dialog Axiata", type: "Telco", code: "DLG-001", bookings: 1250, commission: "5%", revenue: "LKR 2.5M", status: "Active", location: "Colombo" },
  { id: 2, name: "Mobitel (SLT)", type: "Telco", code: "MOB-002", bookings: 980, commission: "5%", revenue: "LKR 1.9M", status: "Active", location: "Colombo" },
  { id: 3, name: "Hutch Sri Lanka", type: "Telco", code: "HUT-003", bookings: 780, commission: "4.5%", revenue: "LKR 1.5M", status: "Active", location: "Colombo" },
  { id: 4, name: "Softlogic Health", type: "Corporate", code: "SLH-004", bookings: 1450, commission: "6%", revenue: "LKR 3.2M", status: "Active", location: "Colombo" },
  { id: 5, name: "Ceylinco Insurance", type: "Corporate", code: "CEY-005", bookings: 890, commission: "5.5%", revenue: "LKR 2.1M", status: "Active", location: "Colombo" },
  { id: 6, name: "Sampath Bank", type: "Corporate", code: "SAM-006", bookings: 670, commission: "4%", revenue: "LKR 1.4M", status: "Active", location: "Colombo" },
  { id: 7, name: "Nimal Perera Agency", type: "Individual", code: "IND-007", bookings: 125, commission: "8%", revenue: "LKR 250K", status: "Active", location: "Kandy" },
  { id: 8, name: "Sunil Fernando Agency", type: "Individual", code: "IND-008", bookings: 98, commission: "8%", revenue: "LKR 198K", status: "Active", location: "Galle" },
]

export default function AgentsPage() {
  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Agent Management</h1>
            <p className="text-gray-600 mt-1">Manage all agents and partnerships</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="w-4 h-4 mr-2" />
            Add New Agent
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{agentsData.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Telco Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{agentsData.filter(a => a.type === "Telco").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Corporate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{agentsData.filter(a => a.type === "Corporate").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Individual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{agentsData.filter(a => a.type === "Individual").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">LKR 13.1M</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>All Agents</CardTitle>
                <CardDescription>Active agents and booking statistics</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search agents..." className="pl-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agentsData.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell className="font-medium">{agent.name}</TableCell>
                    <TableCell>
                      <Badge variant={
                        agent.type === "Telco" ? "default" : 
                        agent.type === "Corporate" ? "secondary" : 
                        "outline"
                      }>
                        {agent.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{agent.code}</TableCell>
                    <TableCell>{agent.bookings}</TableCell>
                    <TableCell>{agent.commission}</TableCell>
                    <TableCell className="font-medium">{agent.revenue}</TableCell>
                    <TableCell>{agent.location}</TableCell>
                    <TableCell>
                      <Badge variant="default">{agent.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Manage</Button>
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

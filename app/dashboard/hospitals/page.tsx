"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, MapPin, Phone, Mail, Building, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

interface Hospital {
  id: string
  name: string
  nameInSinhala?: string
  hospitalCode: string
  address: string
  city: string
  district: string
  province: string
  phone: string
  email?: string
  website?: string
  hospitalType: string
  hospitalGroup?: string
  facilities: string[]
  isActive: boolean
  emergencyAvailable: boolean
}

const provinces = [
  "Western", "Central", "Southern", "Northern", "Eastern",
  "North Western", "North Central", "Uva", "Sabaragamuwa"
]

const hospitalTypes = ["private", "government", "semi-government"]

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterProvince, setFilterProvince] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    nameInSinhala: "",
    hospitalCode: "",
    address: "",
    city: "",
    district: "",
    province: "",
    phone: "",
    email: "",
    website: "",
    hospitalType: "private",
    hospitalGroup: "",
    emergencyAvailable: false,
    isActive: true,
  })

  useEffect(() => {
    fetchHospitals()
  }, [])

  const fetchHospitals = async () => {
    try {
      const response = await fetch("/api/hospitals")
      const data = await response.json()
      setHospitals(data)
    } catch (error) {
      console.error("Error fetching hospitals:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddHospital = async () => {
    try {
      const response = await fetch("/api/hospitals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      
      if (response.ok) {
        await fetchHospitals()
        setIsAddDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error("Error adding hospital:", error)
    }
  }

  const handleEditHospital = async () => {
    if (!selectedHospital) return
    
    try {
      const response = await fetch(`/api/hospitals/${selectedHospital.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      
      if (response.ok) {
        await fetchHospitals()
        setIsEditDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error("Error updating hospital:", error)
    }
  }

  const handleDeleteHospital = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hospital?")) return
    
    try {
      const response = await fetch(`/api/hospitals/${id}`, {
        method: "DELETE",
      })
      
      if (response.ok) {
        await fetchHospitals()
      }
    } catch (error) {
      console.error("Error deleting hospital:", error)
    }
  }

  const openEditDialog = (hospital: Hospital) => {
    setSelectedHospital(hospital)
    setFormData({
      name: hospital.name,
      nameInSinhala: hospital.nameInSinhala || "",
      hospitalCode: hospital.hospitalCode,
      address: hospital.address,
      city: hospital.city,
      district: hospital.district,
      province: hospital.province,
      phone: hospital.phone,
      email: hospital.email || "",
      website: hospital.website || "",
      hospitalType: hospital.hospitalType,
      hospitalGroup: hospital.hospitalGroup || "",
      emergencyAvailable: hospital.emergencyAvailable,
      isActive: hospital.isActive,
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      nameInSinhala: "",
      hospitalCode: "",
      address: "",
      city: "",
      district: "",
      province: "",
      phone: "",
      email: "",
      website: "",
      hospitalType: "private",
      hospitalGroup: "",
      emergencyAvailable: false,
      isActive: true,
    })
    setSelectedHospital(null)
  }

  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hospital.hospitalCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProvince = filterProvince === "all" || hospital.province === filterProvince
    const matchesType = filterType === "all" || hospital.hospitalType === filterType
    return matchesSearch && matchesProvince && matchesType
  })

  const stats = {
    total: hospitals.length,
    active: hospitals.filter(h => h.isActive).length,
    emergency: hospitals.filter(h => h.emergencyAvailable).length,
    private: hospitals.filter(h => h.hospitalType === "private").length,
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hospital Management</h1>
          <p className="text-gray-600 mt-1">Manage hospitals, facilities, and assignments</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-700 hover:via-cyan-700 hover:to-teal-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Hospital
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Hospital</DialogTitle>
              <DialogDescription>Enter hospital details to add to the system</DialogDescription>
            </DialogHeader>
            <HospitalForm formData={formData} setFormData={setFormData} />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddHospital} className="bg-gradient-to-r from-blue-600 to-teal-600">
                Add Hospital
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Hospitals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Emergency Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.emergency}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-cyan-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Private</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-600">{stats.private}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search hospitals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterProvince} onValueChange={setFilterProvince}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Province" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Provinces</SelectItem>
                {provinces.map((province) => (
                  <SelectItem key={province} value={province}>{province}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {hospitalTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="text-center py-10">Loading hospitals...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hospital Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHospitals.map((hospital) => (
                  <TableRow key={hospital.id}>
                    <TableCell className="font-mono text-sm">{hospital.hospitalCode}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-semibold">{hospital.name}</div>
                        {hospital.hospitalGroup && (
                          <div className="text-xs text-gray-500">{hospital.hospitalGroup}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                        {hospital.city}, {hospital.province}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {hospital.hospitalType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center">
                          <Phone className="w-3 h-3 mr-1 text-gray-400" />
                          {hospital.phone}
                        </div>
                        {hospital.emergencyAvailable && (
                          <Badge variant="destructive" className="text-xs">24/7 Emergency</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {hospital.isActive ? (
                        <Badge className="bg-green-100 text-green-700">Active</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-700">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(hospital)}
                          className="hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteHospital(hospital.id)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Hospital</DialogTitle>
            <DialogDescription>Update hospital information</DialogDescription>
          </DialogHeader>
          <HospitalForm formData={formData} setFormData={setFormData} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditHospital} className="bg-gradient-to-r from-blue-600 to-teal-600">
              Update Hospital
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function HospitalForm({ formData, setFormData }: any) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <Label>Hospital Name *</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Lanka Hospital"
        />
      </div>
      <div>
        <Label>Name in Sinhala</Label>
        <Input
          value={formData.nameInSinhala}
          onChange={(e) => setFormData({ ...formData, nameInSinhala: e.target.value })}
          placeholder="ලංකා රෝහල"
        />
      </div>
      <div>
        <Label>Hospital Code *</Label>
        <Input
          value={formData.hospitalCode}
          onChange={(e) => setFormData({ ...formData, hospitalCode: e.target.value })}
          placeholder="LH001"
        />
      </div>
      <div className="col-span-2">
        <Label>Address *</Label>
        <Textarea
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="578, Elvitigala Mawatha, Colombo 05"
          rows={2}
        />
      </div>
      <div>
        <Label>City *</Label>
        <Input
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          placeholder="Colombo"
        />
      </div>
      <div>
        <Label>District *</Label>
        <Input
          value={formData.district}
          onChange={(e) => setFormData({ ...formData, district: e.target.value })}
          placeholder="Colombo"
        />
      </div>
      <div>
        <Label>Province *</Label>
        <Select value={formData.province} onValueChange={(value) => setFormData({ ...formData, province: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select Province" />
          </SelectTrigger>
          <SelectContent>
            {provinces.map((province) => (
              <SelectItem key={province} value={province}>{province}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Hospital Type *</Label>
        <Select value={formData.hospitalType} onValueChange={(value) => setFormData({ ...formData, hospitalType: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {hospitalTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Phone *</Label>
        <Input
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+94112345678"
        />
      </div>
      <div>
        <Label>Email</Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="info@hospital.lk"
        />
      </div>
      <div>
        <Label>Website</Label>
        <Input
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          placeholder="www.hospital.lk"
        />
      </div>
      <div>
        <Label>Hospital Group</Label>
        <Input
          value={formData.hospitalGroup}
          onChange={(e) => setFormData({ ...formData, hospitalGroup: e.target.value })}
          placeholder="Lanka Hospitals Group"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.emergencyAvailable}
          onCheckedChange={(checked) => setFormData({ ...formData, emergencyAvailable: checked })}
        />
        <Label>24/7 Emergency Available</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
        <Label>Active Status</Label>
      </div>
    </div>
  )
}

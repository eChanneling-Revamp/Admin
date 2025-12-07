import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { UpdateBranchDto, Branch } from "@/types/branch"

// Helper to map Prisma Branch to frontend Branch interface
function mapBranchToDTO(branch: any): Branch {
  return {
    id: branch.id,
    branchName: branch.name,
    branchCode: branch.branchCode,
    referenceType: branch.branchType === "main" ? "Hospital" : "Agent",
    referenceId: branch.managerId || "",
    referenceName: branch.name,
    address: branch.address,
    city: branch.city,
    district: branch.district,
    contactNumber: branch.phone,
    email: branch.email || "",
    status: branch.isActive ? "Active" : "Inactive",
    createdAt: branch.createdAt.toISOString(),
    updatedAt: branch.updatedAt.toISOString(),
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const branch = await prisma.branch.findUnique({
      where: { id: params.id },
    })

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 })
    }

    return NextResponse.json(mapBranchToDTO(branch))
  } catch (error) {
    console.error("GET /api/branches/[id] error", error)
    return NextResponse.json({ error: "Failed to fetch branch" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data: UpdateBranchDto = await request.json()

    const existing = await prisma.branch.findUnique({
      where: { id: params.id },
    })

    if (!existing) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 })
    }

    const updateData: any = {}
    if (data.branchName) updateData.name = data.branchName
    if (data.branchCode) updateData.branchCode = data.branchCode
    if (data.address) updateData.address = data.address
    if (data.city) updateData.city = data.city
    if (data.district) {
      updateData.district = data.district
      updateData.province = data.district // Using district as province
    }
    if (data.contactNumber) updateData.phone = data.contactNumber
    if (data.email !== undefined) updateData.email = data.email || null
    if (data.referenceType) updateData.branchType = data.referenceType === "Hospital" ? "main" : "sub-unit"
    if (data.status) updateData.isActive = data.status === "Active"

    const branch = await prisma.branch.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json(mapBranchToDTO(branch))
  } catch (error) {
    console.error("PUT /api/branches/[id] error", error)
    return NextResponse.json({ error: "Failed to update branch" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const existing = await prisma.branch.findUnique({
      where: { id: params.id },
    })

    if (!existing) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 })
    }

    await prisma.branch.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/branches/[id] error", error)
    return NextResponse.json({ error: "Failed to delete branch" }, { status: 500 })
  }
}

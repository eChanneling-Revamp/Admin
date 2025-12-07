import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { Branch, CreateBranchDto } from "@/types/branch"

// Helper to map Prisma Branch to frontend Branch interface
function mapBranchToDTO(branch: any): Branch {
  return {
    id: branch.id,
    branchName: branch.name,
    branchCode: branch.branchCode,
    referenceType: branch.branchType === "main" ? "Hospital" : "Agent", // Map branchType to referenceType
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    let branches
    if (query) {
      const lowerQuery = query.toLowerCase()
      branches = await prisma.branch.findMany({
        where: {
          OR: [
            { name: { contains: lowerQuery, mode: "insensitive" } },
            { branchCode: { contains: lowerQuery, mode: "insensitive" } },
            { city: { contains: lowerQuery, mode: "insensitive" } },
            { email: { contains: lowerQuery, mode: "insensitive" } },
            { phone: { contains: query } },
            { district: { contains: lowerQuery, mode: "insensitive" } },
          ],
        },
        orderBy: { createdAt: "desc" },
      })
    } else {
      branches = await prisma.branch.findMany({
        orderBy: { createdAt: "desc" },
      })
    }

    return NextResponse.json(branches.map(mapBranchToDTO))
  } catch (error) {
    console.error("GET /api/branches error", error)
    return NextResponse.json({ error: "Failed to fetch branches" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data: CreateBranchDto = await request.json()

    if (!data.branchName || !data.branchCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const branch = await prisma.branch.create({
      data: {
        name: data.branchName,
        branchCode: data.branchCode,
        address: data.address,
        city: data.city,
        district: data.district,
        province: data.district, // Using district as province for now
        phone: data.contactNumber,
        email: data.email || null,
        branchType: data.referenceType === "Hospital" ? "main" : "sub-unit",
        isActive: data.status === "Active",
      },
    })

    return NextResponse.json(mapBranchToDTO(branch), { status: 201 })
  } catch (error) {
    console.error("POST /api/branches error", error)
    return NextResponse.json({ error: "Failed to create branch" }, { status: 500 })
  }
}

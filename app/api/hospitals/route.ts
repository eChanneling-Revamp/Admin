import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all hospitals
export async function GET() {
  try {
    const hospitals = await prisma.hospital.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(hospitals);
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hospitals' },
      { status: 500 }
    );
  }
}

// POST create new hospital
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const hospital = await prisma.hospital.create({
      data: {
        name: body.name,
        nameInSinhala: body.nameInSinhala,
        hospitalCode: body.hospitalCode,
        address: body.address,
        city: body.city,
        district: body.district,
        province: body.province,
        phone: body.phone,
        email: body.email,
        website: body.website,
        hospitalType: body.hospitalType,
        hospitalGroup: body.hospitalGroup,
        emergencyAvailable: body.emergencyAvailable || false,
        isActive: body.isActive !== undefined ? body.isActive : true,
        facilities: [],
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'Hospital',
        entityId: hospital.id,
        changes: {
          new: {
            name: hospital.name,
            code: hospital.hospitalCode,
          },
        },
        success: true,
      },
    });

    return NextResponse.json(hospital, { status: 201 });
  } catch (error: any) {
    console.error('Error creating hospital:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create hospital' },
      { status: 500 }
    );
  }
}

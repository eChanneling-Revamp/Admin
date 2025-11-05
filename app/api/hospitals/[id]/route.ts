import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single hospital
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hospital = await prisma.hospital.findUnique({
      where: { id: params.id },
      include: {
        doctors: {
          include: {
            doctor: {
              include: {
                specialization: true,
              },
            },
          },
        },
        fees: true,
        apiIntegrations: true,
      },
    });

    if (!hospital) {
      return NextResponse.json(
        { error: 'Hospital not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(hospital);
  } catch (error) {
    console.error('Error fetching hospital:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hospital' },
      { status: 500 }
    );
  }
}

// PUT update hospital
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const existingHospital = await prisma.hospital.findUnique({
      where: { id: params.id },
    });

    if (!existingHospital) {
      return NextResponse.json(
        { error: 'Hospital not found' },
        { status: 404 }
      );
    }

    const hospital = await prisma.hospital.update({
      where: { id: params.id },
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
        emergencyAvailable: body.emergencyAvailable,
        isActive: body.isActive,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        entity: 'Hospital',
        entityId: hospital.id,
        changes: {
          old: {
            name: existingHospital.name,
            isActive: existingHospital.isActive,
          },
          new: {
            name: hospital.name,
            isActive: hospital.isActive,
          },
        },
        success: true,
      },
    });

    return NextResponse.json(hospital);
  } catch (error: any) {
    console.error('Error updating hospital:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update hospital' },
      { status: 500 }
    );
  }
}

// DELETE hospital
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hospital = await prisma.hospital.findUnique({
      where: { id: params.id },
    });

    if (!hospital) {
      return NextResponse.json(
        { error: 'Hospital not found' },
        { status: 404 }
      );
    }

    await prisma.hospital.delete({
      where: { id: params.id },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'DELETE',
        entity: 'Hospital',
        entityId: params.id,
        changes: {
          old: {
            name: hospital.name,
            code: hospital.hospitalCode,
          },
        },
        success: true,
      },
    });

    return NextResponse.json({ message: 'Hospital deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting hospital:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete hospital' },
      { status: 500 }
    );
  }
}

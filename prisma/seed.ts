import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@echannelling.lk',
      password: adminPassword,
      name: 'Admin User',
      role: 'superadmin',
      phone: '+94771234567',
      isActive: true,
      twoFAEnabled: false
    }
  })
  console.log('✅ Created admin user:', admin.username)

  // Create sample regular user
  const userPassword = await bcrypt.hash('user123', 10)
  const user = await prisma.user.upsert({
    where: { username: 'user' },
    update: {},
    create: {
      username: 'user',
      email: 'user@echannelling.lk',
      password: userPassword,
      name: 'Regular User',
      role: 'user',
      phone: '+94777654321',
      isActive: true,
      twoFAEnabled: false
    }
  })
  console.log('✅ Created regular user:', user.username)

  // Create sample branches
  const branch1 = await prisma.branch.upsert({
    where: { id: 'branch-1' },
    update: {},
    create: {
      id: 'branch-1',
      name: 'Colombo Branch',
      address: '123 Galle Road',
      city: 'Colombo',
      phone: '+94112345678',
      email: 'colombo@echannelling.lk',
      isActive: true,
      managerId: admin.id
    }
  })
  console.log('✅ Created branch:', branch1.name)

  const branch2 = await prisma.branch.upsert({
    where: { id: 'branch-2' },
    update: {},
    create: {
      id: 'branch-2',
      name: 'Kandy Branch',
      address: '456 Peradeniya Road',
      city: 'Kandy',
      phone: '+94812345678',
      email: 'kandy@echannelling.lk',
      isActive: true,
      managerId: user.id
    }
  })
  console.log('✅ Created branch:', branch2.name)

  console.log('🎉 Database seeded successfully!')
  console.log('\n📝 Login credentials:')
  console.log('Admin - Username: admin, Password: admin123, 2FA: 123456')
  console.log('User - Username: user, Password: user123, 2FA: 123456')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

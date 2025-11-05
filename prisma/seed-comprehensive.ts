import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive seed with Sri Lankan data...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.auditLog.deleteMany();
  await prisma.hospitalAPI.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.discount.deleteMany();
  await prisma.hospitalFee.deleteMany();
  await prisma.dependent.deleteMany();
  await prisma.corporateEmployee.deleteMany();
  await prisma.corporateAccount.deleteMany();
  await prisma.agent.deleteMany();
  await prisma.doctorSchedule.deleteMany();
  await prisma.doctorHospital.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.hospital.deleteMany();
  await prisma.specialization.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.passwordReset.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Users with different roles
  console.log('👥 Creating users...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const superAdmin = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@echannelling.lk',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'superadmin',
      privileges: ['all'],
      phone: '+94112345678',
      twoFAEnabled: true,
      twoFASecret: '123456',
      isActive: true,
    },
  });

  const financeUser = await prisma.user.create({
    data: {
      username: 'finance',
      email: 'finance@echannelling.lk',
      password: await bcrypt.hash('finance123', 10),
      name: 'Nimal Perera',
      role: 'finance',
      privileges: ['payments', 'reconciliation', 'reports'],
      phone: '+94112345679',
      isActive: true,
    },
  });

  const reportsUser = await prisma.user.create({
    data: {
      username: 'reports',
      email: 'reports@echannelling.lk',
      password: await bcrypt.hash('reports123', 10),
      name: 'Saman Silva',
      role: 'reports',
      privileges: ['reports', 'view_all'],
      phone: '+94112345680',
      isActive: true,
    },
  });

  // 2. Create Specializations
  console.log('🏥 Creating specializations...');
  const specializations = await Promise.all([
    prisma.specialization.create({
      data: {
        name: 'Cardiology',
        nameInSinhala: 'හෘද රෝග විශේෂඥ',
        nameInTamil: 'இதய நோய்',
        category: 'Medicine',
        description: 'Heart and cardiovascular system',
      },
    }),
    prisma.specialization.create({
      data: {
        name: 'Neurology',
        nameInSinhala: 'ස්නායු රෝග',
        nameInTamil: 'நரம்பியல்',
        category: 'Medicine',
        description: 'Brain and nervous system',
      },
    }),
    prisma.specialization.create({
      data: {
        name: 'Pediatrics',
        nameInSinhala: 'ළමා රෝග',
        nameInTamil: 'குழந்தை மருத்துவம்',
        category: 'Medicine',
        description: 'Child health and diseases',
      },
    }),
    prisma.specialization.create({
      data: {
        name: 'Orthopedics',
        nameInSinhala: 'අස්ථි රෝග',
        nameInTamil: 'எலும்பியல்',
        category: 'Surgery',
        description: 'Bones, joints and muscles',
      },
    }),
    prisma.specialization.create({
      data: {
        name: 'Dermatology',
        nameInSinhala: 'චර්ම රෝග',
        nameInTamil: 'தோல் மருத்துவம்',
        category: 'Medicine',
        description: 'Skin conditions',
      },
    }),
    prisma.specialization.create({
      data: {
        name: 'Gynecology & Obstetrics',
        nameInSinhala: 'ප්‍රසව හා නාරිවේද',
        nameInTamil: 'மகப்பேறு மற்றும் மகளிர் மருத்துவம்',
        category: 'Surgery',
        description: "Women's health and pregnancy",
      },
    }),
    prisma.specialization.create({
      data: {
        name: 'General Surgery',
        nameInSinhala: 'සාමාන්‍ය ශල්‍ය',
        nameInTamil: 'பொது அறுவை சிகிச்சை',
        category: 'Surgery',
        description: 'General surgical procedures',
      },
    }),
    prisma.specialization.create({
      data: {
        name: 'Ophthalmology',
        nameInSinhala: 'අක්ෂි රෝග',
        nameInTamil: 'கண் மருத்துவம்',
        category: 'Surgery',
        description: 'Eye conditions',
      },
    }),
  ]);

  // 3. Create Hospitals (Major Sri Lankan Hospitals)
  console.log('🏨 Creating hospitals...');
  const hospitals = await Promise.all([
    prisma.hospital.create({
      data: {
        name: 'Lanka Hospitals',
        nameInSinhala: 'ලංකා රෝහල්',
        nameInTamil: 'லங்கா மருத்துவமனை',
        hospitalCode: 'LH001',
        address: '578, Elvitigala Mawatha, Colombo 05',
        city: 'Colombo',
        district: 'Colombo',
        province: 'Western',
        phone: '+94112551111',
        email: 'info@lankahospitals.com',
        website: 'www.lankahospitals.com',
        registrationNo: 'MH/COL/001',
        hospitalType: 'private',
        hospitalGroup: 'Lanka Hospitals Group',
        facilities: ['ICU', 'Emergency', 'Laboratory', 'Radiology', 'Pharmacy', 'Operation Theatre'],
        emergencyAvailable: true,
        operatingHours: '24/7',
        latitude: 6.8915,
        longitude: 79.8803,
        createdBy: superAdmin.id,
      },
    }),
    prisma.hospital.create({
      data: {
        name: 'Asiri Central Hospital',
        nameInSinhala: 'අසිරි මධ්‍යම රෝහල',
        nameInTamil: 'அசிரி மத்திய மருத்துவமனை',
        hospitalCode: 'ACH001',
        address: '114, Norris Canal Road, Colombo 10',
        city: 'Colombo',
        district: 'Colombo',
        province: 'Western',
        phone: '+94114665500',
        email: 'info@asirihealth.com',
        website: 'www.asirihealth.com',
        registrationNo: 'MH/COL/002',
        hospitalType: 'private',
        hospitalGroup: 'Asiri Hospital Group',
        facilities: ['ICU', 'Emergency', 'Laboratory', 'CT Scan', 'MRI', 'Pharmacy'],
        emergencyAvailable: true,
        operatingHours: '24/7',
        latitude: 6.9271,
        longitude: 79.8612,
        createdBy: superAdmin.id,
      },
    }),
    prisma.hospital.create({
      data: {
        name: 'Nawaloka Hospital',
        nameInSinhala: 'නාවලෝක රෝහල',
        nameInTamil: 'நவலோக மருத்துவமனை',
        hospitalCode: 'NH001',
        address: '23, Sri Saugathhodaya Mawatha, Colombo 02',
        city: 'Colombo',
        district: 'Colombo',
        province: 'Western',
        phone: '+94115577111',
        email: 'info@nawaloka.com',
        website: 'www.nawaloka.com',
        registrationNo: 'MH/COL/003',
        hospitalType: 'private',
        hospitalGroup: 'Nawaloka Hospitals Group',
        facilities: ['ICU', 'CCU', 'NICU', 'Emergency', 'Laboratory', 'Dialysis'],
        emergencyAvailable: true,
        operatingHours: '24/7',
        latitude: 6.9271,
        longitude: 79.8487,
        createdBy: superAdmin.id,
      },
    }),
    prisma.hospital.create({
      data: {
        name: 'Durdans Hospital',
        nameInSinhala: 'ඩර්ඩන්ස් රෝහල',
        nameInTamil: 'டர்டன்ஸ் மருத்துவமனை',
        hospitalCode: 'DH001',
        address: '3, Alfred Place, Colombo 03',
        city: 'Colombo',
        district: 'Colombo',
        province: 'Western',
        phone: '+94112140000',
        email: 'info@durdans.com',
        website: 'www.durdans.com',
        registrationNo: 'MH/COL/004',
        hospitalType: 'private',
        facilities: ['ICU', 'Emergency', 'Laboratory', 'Cardiology', 'Endoscopy'],
        emergencyAvailable: true,
        operatingHours: '24/7',
        latitude: 6.9042,
        longitude: 79.8551,
        createdBy: superAdmin.id,
      },
    }),
    prisma.hospital.create({
      data: {
        name: 'Asiri Surgical Hospital',
        nameInSinhala: 'අසිරි ශල්‍ය රෝහල',
        nameInTamil: 'அசிரி அறுவை சிகிச்சை மருத்துவமனை',
        hospitalCode: 'ASH001',
        address: '21, Kirimandala Mawatha, Colombo 05',
        city: 'Colombo',
        district: 'Colombo',
        province: 'Western',
        phone: '+94114524400',
        email: 'surgical@asirihealth.com',
        website: 'www.asirihealth.com',
        registrationNo: 'MH/COL/005',
        hospitalType: 'private',
        hospitalGroup: 'Asiri Hospital Group',
        facilities: ['Operation Theatre', 'ICU', 'Laboratory', 'Endoscopy'],
        emergencyAvailable: false,
        operatingHours: '8:00 AM - 8:00 PM',
        latitude: 6.8915,
        longitude: 79.8803,
        createdBy: superAdmin.id,
      },
    }),
    prisma.hospital.create({
      data: {
        name: 'Hemas Hospital Wattala',
        nameInSinhala: 'හේමාස් රෝහල වත්තල',
        nameInTamil: 'ஹெமாஸ் மருத்துவமனை வட்டல',
        hospitalCode: 'HHW001',
        address: '389, Negombo Road, Wattala',
        city: 'Wattala',
        district: 'Gampaha',
        province: 'Western',
        phone: '+94112934934',
        email: 'info@hemashospitals.com',
        website: 'www.hemashospitals.com',
        registrationNo: 'MH/GAM/001',
        hospitalType: 'private',
        hospitalGroup: 'Hemas Hospitals Group',
        facilities: ['ICU', 'Emergency', 'Laboratory', 'Pharmacy', 'Maternity'],
        emergencyAvailable: true,
        operatingHours: '24/7',
        latitude: 6.9892,
        longitude: 79.8909,
        createdBy: superAdmin.id,
      },
    }),
    prisma.hospital.create({
      data: {
        name: 'Ninewells Hospital',
        nameInSinhala: 'නයින්වෙල්ස් රෝහල',
        nameInTamil: 'நைன்வெல்ஸ் மருத்துவமனை',
        hospitalCode: 'NWH001',
        address: '57/1, Lauries Road, Colombo 04',
        city: 'Colombo',
        district: 'Colombo',
        province: 'Western',
        phone: '+94112378888',
        email: 'info@ninewells.lk',
        website: 'www.ninewells.lk',
        registrationNo: 'MH/COL/006',
        hospitalType: 'private',
        facilities: ['ICU', 'Laboratory', 'Radiology', 'Endoscopy'],
        emergencyAvailable: false,
        operatingHours: '8:00 AM - 6:00 PM',
        latitude: 6.8915,
        longitude: 79.8577,
        createdBy: superAdmin.id,
      },
    }),
  ]);

  // 4. Create Doctors
  console.log('👨‍⚕️ Creating doctors...');
  const doctors = await Promise.all([
    prisma.doctor.create({
      data: {
        slmcNumber: 'SLMC/2005/15234',
        name: 'Dr. Arjuna Dissanayake',
        nameWithTitle: 'Dr. Arjuna Dissanayake MBBS, MD',
        nameInSinhala: 'වෛද්‍ය අර්ජුන දිසානායක',
        specializationId: specializations[0].id, // Cardiology
        qualifications: ['MBBS (Colombo)', 'MD (Medicine)', 'MRCP (UK)', 'FRCP (London)'],
        biography: 'Consultant Cardiologist with over 15 years of experience',
        yearsOfExperience: 15,
        phone: '+94771234567',
        email: 'arjuna.dissanayake@echannelling.lk',
        consultationFee: 3500,
        followUpFee: 2500,
        rating: 4.8,
        totalReviews: 256,
        createdBy: superAdmin.id,
      },
    }),
    prisma.doctor.create({
      data: {
        slmcNumber: 'SLMC/2008/18765',
        name: 'Dr. Chaminda Fernando',
        nameWithTitle: 'Prof. Chaminda Fernando MBBS, MS',
        nameInSinhala: 'මහාචාර්ය චමින්ද ප්‍රනාන්දු',
        specializationId: specializations[3].id, // Orthopedics
        qualifications: ['MBBS (Peradeniya)', 'MS (Ortho)', 'FRCS (Edinburgh)'],
        biography: 'Professor in Orthopedic Surgery specializing in joint replacement',
        yearsOfExperience: 20,
        phone: '+94772345678',
        email: 'chaminda.fernando@echannelling.lk',
        consultationFee: 4000,
        followUpFee: 3000,
        rating: 4.9,
        totalReviews: 412,
        createdBy: superAdmin.id,
      },
    }),
    prisma.doctor.create({
      data: {
        slmcNumber: 'SLMC/2010/21456',
        name: 'Dr. Amali Jayasinghe',
        nameWithTitle: 'Dr. Amali Jayasinghe MBBS, DCH, MD',
        nameInSinhala: 'වෛද්‍ය අමාලි ජයසිංහ',
        specializationId: specializations[2].id, // Pediatrics
        qualifications: ['MBBS (Colombo)', 'DCH', 'MD (Pediatrics)'],
        biography: 'Consultant Pediatrician with special interest in neonatology',
        yearsOfExperience: 12,
        phone: '+94773456789',
        email: 'amali.jayasinghe@echannelling.lk',
        consultationFee: 3000,
        followUpFee: 2000,
        rating: 4.7,
        totalReviews: 189,
        createdBy: superAdmin.id,
      },
    }),
    prisma.doctor.create({
      data: {
        slmcNumber: 'SLMC/2007/17234',
        name: 'Dr. Rajitha Perera',
        nameWithTitle: 'Dr. Rajitha Perera MBBS, DFM',
        nameInSinhala: 'වෛද්‍ය රාජිත පෙරේරා',
        specializationId: specializations[4].id, // Dermatology
        qualifications: ['MBBS (Colombo)', 'DFM', 'MD (Dermatology)'],
        biography: 'Consultant Dermatologist specializing in cosmetic dermatology',
        yearsOfExperience: 10,
        phone: '+94774567890',
        email: 'rajitha.perera@echannelling.lk',
        consultationFee: 2800,
        followUpFee: 2000,
        rating: 4.6,
        totalReviews: 145,
        createdBy: superAdmin.id,
      },
    }),
    prisma.doctor.create({
      data: {
        slmcNumber: 'SLMC/2006/16543',
        name: 'Dr. Sanduni Wickramasinghe',
        nameWithTitle: 'Dr. Sanduni Wickramasinghe MBBS, MS, MRCOG',
        nameInSinhala: 'වෛද්‍ය සඳුනි වික්‍රමසිංහ',
        specializationId: specializations[5].id, // Gynecology
        qualifications: ['MBBS (Colombo)', 'MS (Obs & Gynae)', 'MRCOG (UK)'],
        biography: 'Consultant Obstetrician & Gynecologist',
        yearsOfExperience: 14,
        phone: '+94775678901',
        email: 'sanduni.wickramasinghe@echannelling.lk',
        consultationFee: 3200,
        followUpFee: 2400,
        rating: 4.8,
        totalReviews: 298,
        createdBy: superAdmin.id,
      },
    }),
    prisma.doctor.create({
      data: {
        slmcNumber: 'SLMC/2009/19876',
        name: 'Dr. Nuwan Silva',
        nameWithTitle: 'Dr. Nuwan Silva MBBS, MS',
        nameInSinhala: 'වෛද්‍ය නුවන් සිල්වා',
        specializationId: specializations[6].id, // General Surgery
        qualifications: ['MBBS (Peradeniya)', 'MS (General Surgery)', 'FRCS'],
        biography: 'Consultant General Surgeon specializing in laparoscopic surgery',
        yearsOfExperience: 11,
        phone: '+94776789012',
        email: 'nuwan.silva@echannelling.lk',
        consultationFee: 3500,
        followUpFee: 2500,
        rating: 4.7,
        totalReviews: 223,
        createdBy: superAdmin.id,
      },
    }),
  ]);

  // 5. Link Doctors to Hospitals
  console.log('🔗 Linking doctors to hospitals...');
  await Promise.all([
    // Dr. Arjuna - Cardiology at multiple hospitals
    prisma.doctorHospital.create({
      data: {
        doctorId: doctors[0].id,
        hospitalId: hospitals[0].id, // Lanka
        consultationFee: 3500,
        followUpFee: 2500,
      },
    }),
    prisma.doctorHospital.create({
      data: {
        doctorId: doctors[0].id,
        hospitalId: hospitals[2].id, // Nawaloka
        consultationFee: 3700,
        followUpFee: 2700,
      },
    }),
    // Dr. Chaminda - Orthopedics
    prisma.doctorHospital.create({
      data: {
        doctorId: doctors[1].id,
        hospitalId: hospitals[1].id, // Asiri Central
        consultationFee: 4000,
        followUpFee: 3000,
      },
    }),
    prisma.doctorHospital.create({
      data: {
        doctorId: doctors[1].id,
        hospitalId: hospitals[4].id, // Asiri Surgical
        consultationFee: 4200,
        followUpFee: 3200,
      },
    }),
    // Dr. Amali - Pediatrics
    prisma.doctorHospital.create({
      data: {
        doctorId: doctors[2].id,
        hospitalId: hospitals[0].id, // Lanka
        consultationFee: 3000,
        followUpFee: 2000,
      },
    }),
    prisma.doctorHospital.create({
      data: {
        doctorId: doctors[2].id,
        hospitalId: hospitals[5].id, // Hemas
        consultationFee: 2800,
        followUpFee: 1800,
      },
    }),
    // Dr. Rajitha - Dermatology
    prisma.doctorHospital.create({
      data: {
        doctorId: doctors[3].id,
        hospitalId: hospitals[3].id, // Durdans
        consultationFee: 2800,
        followUpFee: 2000,
      },
    }),
    // Dr. Sanduni - Gynecology
    prisma.doctorHospital.create({
      data: {
        doctorId: doctors[4].id,
        hospitalId: hospitals[1].id, // Asiri Central
        consultationFee: 3200,
        followUpFee: 2400,
      },
    }),
    // Dr. Nuwan - Surgery
    prisma.doctorHospital.create({
      data: {
        doctorId: doctors[5].id,
        hospitalId: hospitals[4].id, // Asiri Surgical
        consultationFee: 3500,
        followUpFee: 2500,
      },
    }),
  ]);

  // 6. Create Doctor Schedules
  console.log('📅 Creating doctor schedules...');
  await Promise.all([
    // Dr. Arjuna - Mon, Wed, Fri at Lanka
    prisma.doctorSchedule.create({
      data: {
        doctorId: doctors[0].id,
        dayOfWeek: 1, // Monday
        startTime: '16:00',
        endTime: '19:00',
        maxPatients: 20,
        slotDuration: 15,
      },
    }),
    prisma.doctorSchedule.create({
      data: {
        doctorId: doctors[0].id,
        dayOfWeek: 3, // Wednesday
        startTime: '16:00',
        endTime: '19:00',
        maxPatients: 20,
        slotDuration: 15,
      },
    }),
    // Dr. Chaminda - Tue, Thu
    prisma.doctorSchedule.create({
      data: {
        doctorId: doctors[1].id,
        dayOfWeek: 2, // Tuesday
        startTime: '17:00',
        endTime: '20:00',
        maxPatients: 15,
        slotDuration: 20,
      },
    }),
    prisma.doctorSchedule.create({
      data: {
        doctorId: doctors[1].id,
        dayOfWeek: 4, // Thursday
        startTime: '17:00',
        endTime: '20:00',
        maxPatients: 15,
        slotDuration: 20,
      },
    }),
  ]);

  // 7. Create Branches
  console.log('🏢 Creating branches...');
  const branches = await Promise.all([
    prisma.branch.create({
      data: {
        name: 'Head Office Colombo',
        branchCode: 'HO-COL',
        address: '123, Galle Road, Colombo 03',
        city: 'Colombo',
        district: 'Colombo',
        province: 'Western',
        phone: '+94112345678',
        email: 'headoffice@echannelling.lk',
        branchType: 'main',
        managerId: superAdmin.id,
        latitude: 6.9271,
        longitude: 79.8612,
      },
    }),
    prisma.branch.create({
      data: {
        name: 'Kandy Branch',
        branchCode: 'BR-KDY',
        address: '45, Peradeniya Road, Kandy',
        city: 'Kandy',
        district: 'Kandy',
        province: 'Central',
        phone: '+94812234567',
        email: 'kandy@echannelling.lk',
        branchType: 'main',
        latitude: 7.2906,
        longitude: 80.6337,
      },
    }),
    prisma.branch.create({
      data: {
        name: 'Galle Branch',
        branchCode: 'BR-GAL',
        address: '67, Main Street, Galle',
        city: 'Galle',
        district: 'Galle',
        province: 'Southern',
        phone: '+94912234567',
        email: 'galle@echannelling.lk',
        branchType: 'main',
        latitude: 6.0535,
        longitude: 80.2210,
      },
    }),
  ]);

  // 8. Create Agents
  console.log('👔 Creating agents...');
  const agents = await Promise.all([
    // Telco Agents
    prisma.agent.create({
      data: {
        agentCode: 'TEL-DLG-001',
        agentType: 'telco',
        name: 'Dialog Axiata PLC',
        companyName: 'Dialog Axiata PLC',
        contactPerson: 'Suresh Gunawardena',
        email: 'partnerships@dialog.lk',
        phone: '+94777678678',
        address: '475, Union Place, Colombo 02',
        city: 'Colombo',
        district: 'Colombo',
        businessRegNo: 'PV12345',
        commissionRate: 2.5,
        creditLimit: 5000000,
        branchId: branches[0].id,
      },
    }),
    prisma.agent.create({
      data: {
        agentCode: 'TEL-MOB-001',
        agentType: 'telco',
        name: 'Mobitel (Pvt) Ltd',
        companyName: 'Mobitel (Pvt) Ltd',
        contactPerson: 'Anura Silva',
        email: 'business@mobitel.lk',
        phone: '+94712345678',
        address: 'Lotus Road, Colombo 01',
        city: 'Colombo',
        district: 'Colombo',
        businessRegNo: 'PV12346',
        commissionRate: 2.3,
        creditLimit: 4000000,
        branchId: branches[0].id,
      },
    }),
    // Corporate Agents
    prisma.agent.create({
      data: {
        agentCode: 'CORP-BOC-001',
        agentType: 'corporate',
        name: 'Bank of Ceylon',
        companyName: 'Bank of Ceylon',
        contactPerson: 'Priyantha Jayawardena',
        email: 'corporate@boc.lk',
        phone: '+94112541541',
        address: 'BOC Square, Bank of Ceylon Mawatha, Colombo 01',
        city: 'Colombo',
        district: 'Colombo',
        businessRegNo: 'CR12345',
        commissionRate: 3.0,
        creditLimit: 10000000,
        branchId: branches[0].id,
      },
    }),
    prisma.agent.create({
      data: {
        agentCode: 'CORP-COM-001',
        agentType: 'corporate',
        name: 'Commercial Bank',
        companyName: 'Commercial Bank of Ceylon PLC',
        contactPerson: 'Dilini Fernando',
        email: 'health@combank.lk',
        phone: '+94112332231',
        address: '21, Bristol Street, Colombo 01',
        city: 'Colombo',
        district: 'Colombo',
        businessRegNo: 'CR12346',
        commissionRate: 2.8,
        creditLimit: 8000000,
        branchId: branches[0].id,
      },
    }),
    // Individual Agent
    prisma.agent.create({
      data: {
        agentCode: 'IND-001',
        agentType: 'individual',
        name: 'Kamal Bandara',
        contactPerson: 'Kamal Bandara',
        email: 'kamal.agent@gmail.com',
        phone: '+94771234567',
        address: '45, Temple Road, Nugegoda',
        city: 'Nugegoda',
        district: 'Colombo',
        nic: '751234567V',
        commissionRate: 5.0,
        creditLimit: 500000,
        branchId: branches[0].id,
      },
    }),
  ]);

  // 9. Create Corporate Accounts
  console.log('🏢 Creating corporate accounts...');
  const corporateAccounts = await Promise.all([
    prisma.corporateAccount.create({
      data: {
        accountCode: 'CORP-001',
        companyName: 'WSO2 Lanka (Pvt) Ltd',
        contactPerson: 'Samantha Wijesekara',
        email: 'hr@wso2.com',
        phone: '+94112145000',
        address: '20, Palm Grove, Colombo 03',
        creditLimit: 2000000,
        usedCredit: 125000,
        billingCycle: 'monthly',
        paymentTerms: 30,
        agentId: agents[2].id,
      },
    }),
    prisma.corporateAccount.create({
      data: {
        accountCode: 'CORP-002',
        companyName: 'Virtusa (Pvt) Ltd',
        contactPerson: 'Ruwan Perera',
        email: 'hr@virtusa.com',
        phone: '+94112368000',
        address: 'Maitland Place, Colombo 07',
        creditLimit: 3000000,
        usedCredit: 245000,
        billingCycle: 'monthly',
        paymentTerms: 45,
        agentId: agents[3].id,
      },
    }),
  ]);

  // 10. Create Corporate Employees
  console.log('👥 Creating corporate employees...');
  const employees = await Promise.all([
    prisma.corporateEmployee.create({
      data: {
        corporateId: corporateAccounts[0].id,
        employeeId: 'EMP001',
        name: 'Nishantha Silva',
        email: 'nishantha@wso2.com',
        phone: '+94771234567',
        nic: '891234567V',
        department: 'Engineering',
        designation: 'Senior Engineer',
      },
    }),
    prisma.corporateEmployee.create({
      data: {
        corporateId: corporateAccounts[0].id,
        employeeId: 'EMP002',
        name: 'Sandali Fernando',
        email: 'sandali@wso2.com',
        phone: '+94772345678',
        nic: '921234567V',
        department: 'HR',
        designation: 'HR Manager',
      },
    }),
  ]);

  // 11. Create Dependents
  console.log('👨‍👩‍👧‍👦 Creating dependents...');
  await Promise.all([
    prisma.dependent.create({
      data: {
        employeeId: employees[0].id,
        name: 'Amali Silva',
        relationship: 'spouse',
        nic: '901234567V',
      },
    }),
    prisma.dependent.create({
      data: {
        employeeId: employees[0].id,
        name: 'Dineth Silva',
        relationship: 'child',
        dateOfBirth: new Date('2015-05-15'),
      },
    }),
  ]);

  // 12. Create Hospital Fees
  console.log('💰 Creating hospital fees...');
  for (const hospital of hospitals) {
    await prisma.hospitalFee.create({
      data: {
        hospitalId: hospital.id,
        serviceName: 'channelling_fee',
        baseFee: 500,
        platformFee: 200,
        totalFee: 700,
      },
    });
    await prisma.hospitalFee.create({
      data: {
        hospitalId: hospital.id,
        serviceName: 'registration',
        baseFee: 300,
        platformFee: 100,
        totalFee: 400,
      },
    });
  }

  // 13. Create Discounts
  console.log('🎫 Creating discounts...');
  await Promise.all([
    prisma.discount.create({
      data: {
        discountCode: 'SENIOR20',
        discountName: 'Senior Citizen Discount',
        discountType: 'percentage',
        discountValue: 20,
        applicableFor: ['senior_citizen'],
        minAmount: 1000,
        maxDiscount: 1000,
        startDate: new Date('2025-01-01'),
        usageLimit: 10000,
      },
    }),
    prisma.discount.create({
      data: {
        discountCode: 'EARLY15',
        discountName: 'Early Bird Booking',
        discountType: 'percentage',
        discountValue: 15,
        applicableFor: ['early_booking'],
        minAmount: 500,
        maxDiscount: 500,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        usageLimit: 5000,
      },
    }),
    prisma.discount.create({
      data: {
        discountCode: 'CORP10',
        discountName: 'Corporate Discount',
        discountType: 'percentage',
        discountValue: 10,
        applicableFor: ['corporate'],
        startDate: new Date('2025-01-01'),
      },
    }),
    prisma.discount.create({
      data: {
        discountCode: 'FIRST500',
        discountName: 'First Time User',
        discountType: 'fixed',
        discountValue: 500,
        applicableFor: ['first_time'],
        minAmount: 2000,
        startDate: new Date('2025-01-01'),
        usageLimit: 1000,
      },
    }),
  ]);

  // 14. Create Sample Payments
  console.log('💳 Creating sample payments...');
  await Promise.all([
    prisma.payment.create({
      data: {
        transactionId: 'TXN20250101001',
        referenceNo: 'REF001',
        patientName: 'Kasun Rajapaksa',
        patientPhone: '+94771234567',
        amount: 4200,
        currency: 'LKR',
        paymentMethod: 'card',
        paymentGateway: 'sampath',
        status: 'success',
        reconciled: true,
        reconciledAt: new Date(),
        reconciledBy: financeUser.id,
      },
    }),
    prisma.payment.create({
      data: {
        transactionId: 'TXN20250101002',
        referenceNo: 'REF002',
        patientName: 'Kumari Perera',
        patientPhone: '+94772345678',
        amount: 3700,
        currency: 'LKR',
        paymentMethod: 'card',
        paymentGateway: 'commercial',
        status: 'failed',
        failureReason: 'Insufficient funds',
        reconciled: false,
      },
    }),
    prisma.payment.create({
      data: {
        transactionId: 'TXN20250101003',
        patientName: 'Nimal Silva',
        patientPhone: '+94773456789',
        amount: 5000,
        currency: 'LKR',
        paymentMethod: 'corporate',
        status: 'success',
        reconciled: true,
        reconciledAt: new Date(),
        reconciledBy: financeUser.id,
      },
    }),
  ]);

  // 15. Create Hospital API Integrations
  console.log('🔌 Creating API integrations...');
  await Promise.all([
    prisma.hospitalAPI.create({
      data: {
        hospitalId: hospitals[0].id, // Lanka
        apiName: 'HMS',
        apiType: 'rest',
        baseUrl: 'https://hms.lankahospitals.com/api',
        apiKey: 'lh_api_key_12345',
        isEnabled: true,
        syncFrequency: 'realtime',
        lastSyncAt: new Date(),
      },
    }),
    prisma.hospitalAPI.create({
      data: {
        hospitalId: hospitals[0].id,
        apiName: 'Laboratory',
        apiType: 'rest',
        baseUrl: 'https://lab.lankahospitals.com/api',
        apiKey: 'lab_api_key_12345',
        isEnabled: true,
        syncFrequency: 'hourly',
      },
    }),
    prisma.hospitalAPI.create({
      data: {
        hospitalId: hospitals[1].id, // Asiri
        apiName: 'HMS',
        apiType: 'soap',
        baseUrl: 'https://hms.asirihealth.com/services',
        isEnabled: false,
      },
    }),
  ]);

  // 16. Create Audit Logs
  console.log('📝 Creating audit logs...');
  await Promise.all([
    prisma.auditLog.create({
      data: {
        userId: superAdmin.id,
        userName: superAdmin.name,
        action: 'CREATE',
        entity: 'Hospital',
        entityId: hospitals[0].id,
        changes: {
          new: { name: hospitals[0].name, code: hospitals[0].hospitalCode },
        },
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        success: true,
      },
    }),
    prisma.auditLog.create({
      data: {
        userId: superAdmin.id,
        userName: superAdmin.name,
        action: 'LOGIN',
        entity: 'User',
        entityId: superAdmin.id,
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        success: true,
      },
    }),
    prisma.auditLog.create({
      data: {
        userId: financeUser.id,
        userName: financeUser.name,
        action: 'RECONCILE',
        entity: 'Payment',
        entityId: 'TXN20250101001',
        changes: {
          status: { old: 'pending', new: 'reconciled' },
        },
        ipAddress: '192.168.1.2',
        userAgent: 'Mozilla/5.0',
        success: true,
      },
    }),
  ]);

  console.log('✅ Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- Users: ${await prisma.user.count()}`);
  console.log(`- Specializations: ${await prisma.specialization.count()}`);
  console.log(`- Hospitals: ${await prisma.hospital.count()}`);
  console.log(`- Doctors: ${await prisma.doctor.count()}`);
  console.log(`- Doctor-Hospital Links: ${await prisma.doctorHospital.count()}`);
  console.log(`- Branches: ${await prisma.branch.count()}`);
  console.log(`- Agents: ${await prisma.agent.count()}`);
  console.log(`- Corporate Accounts: ${await prisma.corporateAccount.count()}`);
  console.log(`- Hospital Fees: ${await prisma.hospitalFee.count()}`);
  console.log(`- Discounts: ${await prisma.discount.count()}`);
  console.log(`- Payments: ${await prisma.payment.count()}`);
  console.log(`- API Integrations: ${await prisma.hospitalAPI.count()}`);
  console.log(`- Audit Logs: ${await prisma.auditLog.count()}`);
  
  console.log('\n🔑 Login Credentials:');
  console.log('Super Admin: admin / admin123');
  console.log('Finance User: finance / finance123');
  console.log('Reports User: reports / reports123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

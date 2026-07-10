const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedDownloads() {
  console.log('Seeding Downloads (IQAC, Exam, Academic)...');

  const downloads = [
    // Academic Reports
    { title: 'Annual Report 2021-22', category: 'REPORT', fileUrl: '/uploads/Academic/GPP-Annual-Report-2021-22.pdf' },
    { title: 'Annual Report 2020-21', category: 'REPORT', fileUrl: '/uploads/Academic/GPP-Anual-Report-2020-21.pdf' },
    { title: 'Academic Calendar 2022-23', category: 'CIRCULAR', fileUrl: '/uploads/Academic/Calendar-2022.pdf' },
    { title: 'UG Regulations 2022-23', category: 'CIRCULAR', fileUrl: 'https://drive.google.com/file/d/15wbQR6UmtXMmewx62Fmkd_XH9uqxsjUF/view' },
    
    // IQAC
    { title: 'AQAR Report 2020-21', category: 'REPORT', fileUrl: '/uploads/IQAC/AQAR-2020-21.pdf' },
    { title: 'Student Satisfaction Survey 2021-22', category: 'REPORT', fileUrl: '/uploads/IQAC/SSS-2021-22.pdf' },
    { title: 'IQAC Minutes of Meeting - June 2022', category: 'REPORT', fileUrl: '/uploads/IQAC/MOM-June-2022.pdf' },
    { title: 'Action Taken Report (ATR) 2021-22', category: 'REPORT', fileUrl: '/uploads/DOCS/ATR-GPPVVS.pdf' },
    { title: 'NIRF Report 2022', category: 'REPORT', fileUrl: 'https://drive.google.com/file/d/1wQhqno6yQjQThHFR2GFyB5AgClq0t7_V/view' },

    // Exams
    { title: 'Result Analysis 2022-23', category: 'OTHER', fileUrl: '/uploads/Exam/Result-Analysis/Catagory-Wise-ResultSheet-2022-23.pdf' },
    { title: 'Internal Exam Time Table 2021-22', category: 'CIRCULAR', fileUrl: '/uploads/Exam/GPP-Internal-Examination-2021-22.pdf' },
    
    // Misc
    { title: 'College Organogram', category: 'OTHER', fileUrl: '/uploads/DOCS/GPPVVS-College-Organogram.pdf' },
    { title: 'Human Values & Professional Ethics Hand Book', category: 'OTHER', fileUrl: '/uploads/DOCS/GPP-Human-Values-Professional-Ethics-Hand-Book%201.pdf' },
    { title: 'NAAC Accreditation Certificate', category: 'OTHER', fileUrl: '/uploads/DOCS/NAAC-Accreditation.pdf' },
    { title: 'RTI Document', category: 'OTHER', fileUrl: '/uploads/DOCS/RTI-GPPVVS.pdf' },
    { title: 'Scholarships 2020-21', category: 'OTHER', fileUrl: '/uploads/DOCS/GPP-SCHOLERSHIP-2020-21-ALL-CAT-TOTAL-771.pdf' },
  ];

  for (const d of downloads) {
    const existing = await prisma.download.findFirst({ where: { title: d.title } });
    if (!existing) {
      await prisma.download.create({
        data: d
      });
    }
  }

  console.log('✅ Downloads seeded successfully');
}

seedDownloads()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

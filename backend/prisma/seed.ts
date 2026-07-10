import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database from scraped data...');

  // Read scraped data
  const dataPath = path.join(process.cwd(), '../frontend/scraped_data.json');
  let scrapedData: any = {};
  if (fs.existsSync(dataPath)) {
    scrapedData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log('Successfully loaded scraped_data.json');
  } else {
    console.log('scraped_data.json not found, using empty object.');
  }

  // 1. Admin User
  const hashedPassword = await bcrypt.hash('admin@2026', 10);
  await prisma.user.upsert({
    where: { email: 'admin@gppvvs.ac.in' },
    update: {},
    create: {
      email: 'admin@gppvvs.ac.in',
      password: hashedPassword,
      name: 'Admin User',
      role: 'SUPER_ADMIN',
    },
  });
  console.log('Admin user created/updated.');

  // 2. Settings
  const settings = [
    { key: 'siteName', value: 'G.P. Porwal Arts, Commerce & V.V. Salimath Science College, Sindagi', group: 'general' },
    { key: 'siteTagline', value: 'Moulding the rural youth for the modern world', group: 'general' },
    { key: 'phone', value: '08488-221244', group: 'contact' },
    { key: 'email', value: 'principal@gppvvs.ac.in', group: 'contact' },
    { key: 'address', value: "S.P.V.V.S's G.P. Porwal Arts, Commerce and V.V. Salimath Science College, Sindagi - 586128, Dist: Vijayapura, Karnataka State, India", group: 'contact' },
    { key: 'website', value: 'www.gppvvs.ac.in', group: 'contact' },
    { key: 'university', value: 'Rani Channamma University, Belagavi', group: 'general' },
    { key: 'naacGrade', value: 'B', group: 'general' },
    { key: 'naacCycle', value: '3rd Cycle (2018)', group: 'general' },
    { key: 'established', value: '1972', group: 'general' },
    { key: 'trust', value: 'Sri Padmaraj Vidya Vardhaka Samstha, Sarangamath, Sindagi', group: 'general' },
  ];
  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log('Settings created/updated.');

  // 3. Pages (Combined About Page)
  const aboutTabs = scrapedData.about?.tabs || {};
  const aboutHtml = `
    <div class="history">
      <h2>History</h2>
      ${aboutTabs.history?.html || ''}
    </div>
    <div class="vision">
      <h2>Vision</h2>
      ${aboutTabs.vision?.html || ''}
    </div>
    <div class="mission">
      <h2>Mission</h2>
      ${aboutTabs.mission?.html || ''}
    </div>
    <div class="principal">
      <h2>Principal's Message</h2>
      ${aboutTabs.principal?.html || ''}
    </div>
  `;
  
  const pages = [
    {
      title: 'About the Institution',
      slug: 'about-the-institution',
      content: aboutHtml,
    },
    {
      title: 'Trustees',
      slug: 'trustees',
      content: scrapedData.trustees?.html || '',
    },
    {
      title: 'Best Practices',
      slug: 'best-practices',
      content: scrapedData.bestPractices?.html || '',
    },
    {
      title: 'Library',
      slug: 'library',
      content: scrapedData.library?.html || '',
    },
    {
      title: 'Gym',
      slug: 'gym',
      content: scrapedData.gym?.html || '',
    },
    {
      title: 'Facilities',
      slug: 'facilities',
      content: scrapedData.facilities?.html || '',
    },
  ];

  for (const p of pages) {
    if (p.content) {
      await prisma.page.upsert({
        where: { slug: p.slug },
        update: { content: p.content },
        create: p,
      });
    }
  }
  console.log('Pages created/updated.');

  // 4. Committees & Cells
  await prisma.committee.deleteMany({}); // Clear existing
  const cellsMap = {
    scstCell: 'SC/ST Cell',
    researchCell: 'Research Cell',
    iprCell: 'IPR Cell',
    grievanceCell: 'Grievance Redressal Cell',
    antiRagging: 'Anti-Ragging Cell',
    placementCell: 'Placement Cell',
    entrepreneurship: 'Entrepreneurship Cell',
    wec: 'Women Empowerment Cell',
    studentWelfare: 'Student Welfare Cell',
    ncc: 'NCC',
    nss: 'NSS',
    yrc: 'Youth Red Cross',
    posh: 'Prevention of Sexual Harassment',
  };

  let position = 0;
  for (const [key, name] of Object.entries(cellsMap)) {
    const data = scrapedData[key];
    if (data) {
      // For WEC we have tabs
      let description = data.text || '';
      if (data.tabs) {
         description += '\n' + Object.values(data.tabs).map((t: any) => t.text).join('\n');
      }
      
      await prisma.committee.create({
        data: {
          name,
          description: description,
          position: position++,
        }
      });
    }
  }
  console.log('Committees created.');

  // 5. Departments
  const deptMap = {
    'Kannada': 'BA', 'English': 'BA', 'Hindi': 'BA', 'Urdu': 'BA',
    'Political Science': 'BA', 'History': 'BA', 'Economics': 'BA', 'Sociology': 'BA', 'Physical Education': 'BA',
    'Commerce': 'BCOM',
    'Physics': 'BSC', 'Chemistry': 'BSC', 'Mathematics': 'BSC', 'Botany': 'BSC', 'Zoology': 'BSC',
    'Computer Science': 'BCA',
  };

  const dbDepartments = scrapedData.departmentDetails || {};
  let dpos = 0;
  for (const [name, program] of Object.entries(deptMap)) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const deptData = dbDepartments[name] || {};
    
    let description = deptData.html || `Welcome to the ${name} department.`;
    
    const dept = await prisma.department.upsert({
      where: { slug },
      update: { description },
      create: {
        name,
        slug,
        description,
        program: program as 'BA' | 'BCOM' | 'BSC' | 'BCA',
        position: dpos++
      },
    });

    // Faculty
    if (deptData.faculty && deptData.faculty.length > 0) {
      await prisma.faculty.deleteMany({ where: { departmentId: dept.id }});
      let fpos = 0;
      for (const f of deptData.faculty) {
        await prisma.faculty.create({
          data: {
            name: f.name || 'Unknown',
            designation: f.designation || 'Faculty',
            qualification: f.qualification || '',
            experience: f.experience || '',
            specialization: f.specialization || '',
            departmentId: dept.id,
            position: fpos++
          }
        });
      }
    }
  }
  console.log('Departments and Faculty created/updated.');

  // 6. Downloads (using localUrls if downloaded)
  await prisma.download.deleteMany({});
  if (scrapedData.allPdfs) {
    for (const pdf of scrapedData.allPdfs) {
      await prisma.download.create({
        data: {
          title: pdf.text || 'Document',
          fileUrl: pdf.localUrl || pdf.url, // Fallback to remote if not downloaded
          category: 'OTHER',
        }
      });
    }
    console.log(`Created ${scrapedData.allPdfs.length} download records.`);
  }

  // 7. NAAC Criteria
  const naacCriteria = [
    { number: 1, title: 'Curricular Aspects', description: 'Curricular Aspects' },
    { number: 2, title: 'Teaching-Learning and Evaluation', description: 'Teaching-Learning and Evaluation' },
    { number: 3, title: 'Research Innovations and Extension', description: 'Research Innovations and Extension' },
    { number: 4, title: 'Infrastructure and Learning Resources', description: 'Infrastructure and Learning Resources' },
    { number: 5, title: 'Student Support and Progression', description: 'Student Support and Progression' },
    { number: 6, title: 'Governance Leadership and Management', description: 'Governance Leadership and Management' },
    { number: 7, title: 'Institutional Values and Best Practices', description: 'Institutional Values and Best Practices' },
  ];
  for (const c of naacCriteria) {
    await prisma.naacCriterion.upsert({
      where: { number: c.number },
      update: {},
      create: c,
    });
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

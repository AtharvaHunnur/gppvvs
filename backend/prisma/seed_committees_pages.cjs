const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

async function seedCommitteesAndPages() {
  console.log('Seeding Committees and Static Pages...');

  // 1. Seed Committees
  const committees = [
    { name: 'Anti-Ragging Cell', description: 'Ensures a ragging-free campus environment.' },
    { name: 'Entrepreneurship Cell', description: 'Promotes entrepreneurial thinking among students.' },
    { name: 'Placement Cell', description: 'Facilitates campus recruitment and career guidance.' },
    { name: 'Prevention of Sexual Harassment', description: 'Provides a safe environment for female students and staff.' },
    { name: 'Grievance Redressal Cell', description: 'Addresses student and staff grievances.' },
    { name: 'Women Empowerment Cell', description: 'Focuses on gender equality and women welfare.' },
    { name: 'Student Welfare Cell', description: 'Looks after general student welfare.' },
    { name: 'SC/ST Cell', description: 'Ensures proper implementation of reservation policies.' },
    { name: 'Research Cell', description: 'Promotes research activities among faculty and students.' },
    { name: 'IPR Cell', description: 'Intellectual Property Rights awareness and support.' },
    { name: 'NCC', description: 'National Cadet Corps - building discipline and leadership.' },
    { name: 'NSS', description: 'National Service Scheme - community service and social awareness.' },
    { name: 'YRC', description: 'Youth Red Cross unit.' }
  ];

  for (const c of committees) {
    const existing = await prisma.committee.findFirst({ where: { name: c.name } });
    if (existing) {
      await prisma.committee.update({
        where: { id: existing.id },
        data: { description: c.description }
      });
    } else {
      await prisma.committee.create({
        data: { name: c.name, description: c.description }
      });
    }
  }
  console.log('✅ Committees seeded');

  // 2. Seed Static Pages based on the old website menus
  const pages = [
    {
      title: 'Infrastructure & Library',
      slug: 'infrastructure-library',
      content: `<h2>College Infrastructure</h2>
<p>The college has an imposing building built in 25.9 acres of land and build up area of 16008 sq ft with well furnished laboratories and well equipped Library with rare books, and has set high benchmark in academic standards.</p>
<h3>Library</h3>
<p>Our library is fully computerized and has a vast collection of text books, reference books, journals, and periodicals. It provides a quiet and conducive environment for study and research.</p>`,
      images: []
    },
    {
      title: 'RTI (Right to Information)',
      slug: 'rti',
      content: `<h2>Right to Information Act</h2>
<p>The Right to Information Act, 2005 (22 of 2005) has been enacted by the Parliament and has come into force from 15 June, 2005. This Act provides for right to information for citizens to secure access to information under the control of public authorities in order to promote transparency and accountability in the working of every public authority.</p>`,
      images: []
    },
    {
      title: 'Alumni Association',
      slug: 'alumni',
      content: `<h2>Alumni Association</h2>
<p>The Alumni Association of G.P. Porwal College is a strong network of former students who are now successful professionals in various fields. The association actively participates in the development of the college and provides guidance to current students.</p>`,
      images: []
    },
    {
      title: 'Trustees',
      slug: 'trustees',
      content: `<h2>Board of Trustees</h2>
<p>Under the guidance of the present chairman His Holiness, Dr. Prabhu Sarangadev Shivacharyaji, the institution has grown to greater heights with modern outlook.</p>`,
      images: []
    }
  ];

  for (const p of pages) {
    const existing = await prisma.page.findFirst({ where: { slug: p.slug } });
    if (existing) {
      await prisma.page.update({
        where: { id: existing.id },
        data: { title: p.title, content: p.content, isPublished: true }
      });
    } else {
      await prisma.page.create({
        data: { title: p.title, slug: p.slug, content: p.content, isPublished: true }
      });
    }
  }
  console.log('✅ Static pages seeded');

  // 3. Update Menu links to point to these new pages
  // We need to find the menus and update their hrefs
  const updateMenuHrefs = async (labelMatch, newHref) => {
    await prisma.menu.updateMany({
      where: { label: { contains: labelMatch } },
      data: { href: newHref }
    });
  };

  await updateMenuHrefs('RTI', '/page/rti');
  await updateMenuHrefs('Alumni', '/page/alumni');
  await updateMenuHrefs('Library', '/page/infrastructure-library');
  await updateMenuHrefs('Committees', '/committees');
  await updateMenuHrefs('NCC', '/committees');
  await updateMenuHrefs('NSS', '/committees');
  await updateMenuHrefs('Women Emp', '/committees');

  console.log('✅ Menu links updated');
}

seedCommitteesAndPages()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

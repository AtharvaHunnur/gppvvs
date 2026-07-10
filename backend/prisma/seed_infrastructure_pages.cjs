const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedPages() {
  console.log('Seeding additional static pages...');

  const pages = [
    {
      title: 'Best Practices',
      slug: 'best-practices',
      content: `<h2>Institutional Best Practices</h2>
<p>Our college follows several best practices including:</p>
<ul>
<li><strong>Awarding Eminent Scientists:</strong> Cash prize of Rs 1 Lakh and certificate is given to eminent Scientist in the field of science every year in the memory of Bhaskaracharya-II.</li>
<li><strong>Saranga Sri Award:</strong> A special award for farmers with good track record of achievements in agricultural field, consisting of a cash prize of Rs 11,000 and a memento.</li>
<li><strong>Sadvichar Goshti:</strong> Religious and spiritual programs on full moon day of every month.</li>
</ul>`
    },
    {
      title: 'Library Facilities',
      slug: 'library',
      content: `<h2>Central Library</h2>
<p>The college has a well-equipped Library with rare books, and has set high benchmark in academic standards. Our library is fully computerized and has a vast collection of text books, reference books, journals, and periodicals. It provides a quiet and conducive environment for study and research.</p>`
    },
    {
      title: 'Laboratories',
      slug: 'labs',
      content: `<h2>Science Laboratories</h2>
<p>We provide well-furnished laboratories for Physics, Chemistry, Botany, Zoology, and Computer Science to give students practical exposure to complement their theoretical knowledge.</p>`
    },
    {
      title: 'Function Hall',
      slug: 'function-hall',
      content: `<h2>Function Hall</h2>
<p>The college has a spacious function hall equipped with modern audio-visual facilities to conduct seminars, workshops, cultural events, and guest lectures.</p>`
    },
    {
      title: 'Play Ground',
      slug: 'play-ground',
      content: `<h2>Play Ground</h2>
<p>A vast playground is available for students to participate in various outdoor sports like Cricket, Volleyball, Kabaddi, and Athletics.</p>`
    },
    {
      title: 'Indoor Stadium',
      slug: 'indoor-stadium',
      content: `<h2>Indoor Stadium</h2>
<p>The indoor stadium provides facilities for games such as Badminton, Table Tennis, Chess, and Carrom, encouraging physical fitness alongside academics.</p>`
    },
    {
      title: 'Multi-Gym',
      slug: 'multi-gym',
      content: `<h2>Multi-Gym facility</h2>
<p>To promote health and fitness among students, a fully equipped multi-gym is available on campus under the guidance of a physical education director.</p>`
    },
    {
      title: 'Women\'s Hostel',
      slug: 'womens-hostel',
      content: `<h2>Hostel for Women</h2>
<p>The college provides secure and comfortable accommodation for female students coming from rural areas. The hostel includes facilities like a waste water treatment plant and solar water heaters.</p>`
    },
    {
      title: 'Online Classes',
      slug: 'online-classes',
      content: `<h2>Online Classes & E-Learning</h2>
<p>We have adapted to modern teaching methodologies by providing online classes and e-learning resources through various platforms to ensure uninterrupted education.</p>`
    },
    {
      title: 'Campus Facilities',
      slug: 'facilities',
      content: `<h2>Other Facilities</h2>
<p>The campus is rich home for Flora & Fauna and several birds. The Institution has installed Solar On Grid, Rain water harvesting unit, and RO drinking water facilities to ensure a sustainable and student-friendly environment.</p>`
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
  console.log('✅ Additional static pages seeded');
}

seedPages()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

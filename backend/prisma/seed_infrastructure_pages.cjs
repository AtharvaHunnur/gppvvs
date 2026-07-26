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
      content: `<h2>About Library</h2>
<p>The college library is not a part of college but heart of the institution since 1972 with an initial collection of 4,074 books. At present, the central library of the college has a very rich collection of 33,735 books (volumes) and 20,000 titles on various subjects like commerce, science, and arts. The total area of the library is 3,193 sq.ft.</p>

<h3>Library Timings</h3>
<div class="overflow-x-auto">
<table class="min-w-full">
  <thead>
    <tr>
      <th>On Working Days</th>
      <th>Before Exams</th>
      <th>During Exams</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>07:30 AM - 03:30 PM</td>
      <td>08:00 AM - 08:00 PM</td>
      <td>08:00 AM - 08:00 PM</td>
    </tr>
  </tbody>
</table>
</div>

<h3>Rules & Regulations</h3>
<ul>
  <li>Admission to the library is strictly against identity card; students should submit their identity card whenever staff demand.</li>
  <li>Students, Teachers, and administrative staff are entitled to enroll themselves in the library.</li>
  <li>Silence shall be strictly observed in the library. Please converse in a low voice and politely.</li>
  <li>Tobacco products, smoking, and electronic devices like mobiles, iPads, etc., are strictly prohibited.</li>
  <li>Books, journals, newspapers, and rare books should be used carefully. Do not mark in the library books.</li>
  <li>Any damage to the book or to the furniture of the library has to be made good by the student.</li>
  <li>Each student enrolled as a library member will be issued three books for home use.</li>
</ul>

<hr />

<h2>Vision & Mission</h2>
<h3>Vision</h3>
<ul>
  <li>To work with faculty in integrating information skills, knowledge of information sources, and the use of technology in accessing needed information to strengthen their research.</li>
  <li>To provide instruction and assistance in the effective use of learning resources.</li>
  <li>The Library intends to incorporate the latest technology and adopt a user-friendly approach towards students and faculty.</li>
</ul>

<h3>Mission</h3>
<ul>
  <li>To help rural students enrich their knowledge and create a better world for themselves.</li>
  <li>To encourage students to read beyond the requirements of the curriculum and inculcate a reading habit.</li>
  <li>The Library intends to offer comprehensive services related to the dissemination of knowledge.</li>
  <li>To acquire, organize, and update the library collection to support the teaching-learning process.</li>
</ul>

<hr />

<h2>Library Services</h2>
<ul>
  <li>New arrival display</li>
  <li>Photo copy (Xerox) service</li>
  <li>E-library (To access e-resources)</li>
  <li>Question Bank</li>
  <li>Journal, magazine, and newspaper access</li>
  <li>Faculty publication display</li>
  <li>Internet and Wi-Fi</li>
  <li>Access to N-list database</li>
  <li>Separate reading room for ladies and boys</li>
  <li>Separate reading hall for reference purposes</li>
  <li>UGC Book Bank</li>
  <li>CD and DVDs</li>
</ul>

<hr />

<h2>Best Practices in the Library</h2>
<ul>
  <li>Displaying the newly available books list on the notice board.</li>
  <li>Providing Library information brochures.</li>
  <li>Training to use e-resources like library OPAC, N-list database, and free online journals.</li>
  <li>Best library user award.</li>
  <li>Book bank facility.</li>
  <li>Compilation of bibliography.</li>
</ul>

<hr />

<h2>E-Resources</h2>
<h3>Online Resources</h3>
<ul>
  <li><a href="https://doaj.org/" target="_blank" rel="noopener noreferrer">Directory Open Access Journal (DOAJ)</a></li>
  <li><a href="https://www.doabooks.org/" target="_blank" rel="noopener noreferrer">Directory of Open Access Books (DOAB)</a></li>
  <li><a href="http://www.e-journals.org/" target="_blank" rel="noopener noreferrer">e-journals</a></li>
  <li><a href="https://v2.sherpa.ac.uk/opendoar/" target="_blank" rel="noopener noreferrer">Open Directory of Open Access Repositories (DOAR)</a></li>
  <li><a href="https://egyankosh.ac.in/" target="_blank" rel="noopener noreferrer">EGyanKosh</a></li>
  <li><a href="https://www.pdgroup.in/" target="_blank" rel="noopener noreferrer">Pratyogita Darpan</a></li>
  <li><a href="https://dl.acm.org/doi/abs/10.1145/374308.374361?download=true" target="_blank" rel="noopener noreferrer">Vidyanidhi</a></li>
  <li><a href="https://shodhganga.inflibnet.ac.in/" target="_blank" rel="noopener noreferrer">Shodhganga</a></li>
  <li><a href="https://www.indianjournals.com/ijor.aspx" target="_blank" rel="noopener noreferrer">Indianjournals.com</a></li>
  <li><a href="https://kanaja.in/" target="_blank" rel="noopener noreferrer">Kanaja (Kannada)</a></li>
  <li><a href="http://www.anupamamonthly.com/" target="_blank" rel="noopener noreferrer">Anupama (Kannada)</a></li>
  <li><a href="https://vishvakannada.com/" target="_blank" rel="noopener noreferrer">Vishwa Kannada (Kannada)</a></li>
  <li><a href="https://yakshagana.com/" target="_blank" rel="noopener noreferrer">Yakshagana</a></li>
  <li><a href="https://books.google.co.in/" target="_blank" rel="noopener noreferrer">Google Books</a></li>
  <li><a href="https://nopr.niscair.res.in/handle/123456789/2" target="_blank" rel="noopener noreferrer">NISCAIR Journals</a></li>
</ul>

<h3>Open E-Theses and Dissertations (ETDs)</h3>
<ul>
  <li><a href="http://shodhganga.inflibnet.ac.in/" target="_blank" rel="noopener noreferrer">Shodhganga</a></li>
  <li><a href="https://etheses.lse.ac.uk/view/sets/DEPTS.html" target="_blank" rel="noopener noreferrer">LSE Theses Online</a></li>
  <li><a href="https://www.repository.cam.ac.uk/" target="_blank" rel="noopener noreferrer">DSpace@Cambridge</a></li>
  <li><a href="http://search.ndltd.org/index.php" target="_blank" rel="noopener noreferrer">NDLTD</a></li>
  <li><a href="http://www.openthesis.org/" target="_blank" rel="noopener noreferrer">Open Thesis</a></li>
  <li><a href="https://dyuthi.cusat.ac.in/xmlui/" target="_blank" rel="noopener noreferrer">Dyuthi Digital Repository</a></li>
  <li><a href="https://krishikosh.egranth.ac.in/" target="_blank" rel="noopener noreferrer">KrishiKosh</a></li>
  <li><a href="http://ethos.bl.uk/ProcessSearch.do" target="_blank" rel="noopener noreferrer">EThos: e-theses online service</a></li>
  <li><a href="https://openaccess.leidenuniv.nl/handle/1887/4948" target="_blank" rel="noopener noreferrer">ISIM Dissertations</a></li>
  <li><a href="https://oatd.org/" target="_blank" rel="noopener noreferrer">Open Access Theses and Dissertations</a></li>
  <li><a href="https://shodhgangotri.inflibnet.ac.in/" target="_blank" rel="noopener noreferrer">Shodhgangotri</a></li>
</ul>

<h3>Journals & Magazines Available in the Library</h3>
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  <ul>
    <li>Sanctuary Asia</li>
    <li>Yojana</li>
    <li>Current Science</li>
    <li>Pramana</li>
    <li>Indian Literature (English)</li>
    <li>Indian School of Political Science</li>
    <li>University News</li>
    <li>Third Concept</li>
    <li>Down To Earth</li>
    <li>Kurukshetra</li>
  </ul>
  <ul>
    <li>Financial Management</li>
    <li>Sankranthi</li>
    <li>Spardha Chankya</li>
    <li>Spardha Vijetha</li>
    <li>Spardha Spoorthi</li>
    <li>Sudha</li>
    <li>Taranga</li>
    <li>Employment News</li>
    <li>Pungava</li>
    <li>Arthashtra : Indian Journals of Economics & Research</li>
  </ul>
</div>

<hr />

<h2>Contact Details</h2>
<div class="bg-surface-50 p-6 rounded-xl border border-surface-200 mt-4 not-prose">
  <p class="font-bold text-lg mb-1 text-primary">Dr. Sridevi Sindagi</p>
  <p class="text-text-secondary mb-3">Librarian</p>
  <ul class="space-y-2 list-none p-0 m-0">
    <li class="flex items-center text-text-secondary"><span class="font-medium mr-2 text-text">Email:</span> <a href="mailto:sridevisindagi1991@gmail.com" class="text-secondary hover:text-primary transition-colors">sridevisindagi1991@gmail.com</a></li>
    <li class="flex items-center text-text-secondary"><span class="font-medium mr-2 text-text">Phone:</span> <a href="tel:08488222792" class="text-secondary hover:text-primary transition-colors">08488-222792</a></li>
  </ul>
</div>`
    },
    {
      title: 'Laboratories',
      slug: 'labs',
      content: `<h2>Science Laboratories</h2>
<p>We provide well-furnished laboratories for Physics, Chemistry, Botany, Zoology, and Computer Science to give students practical exposure to complement their theoretical knowledge. Our laboratories are equipped with modern instruments and apparatus to conduct experiments and research activities effectively.</p>`
    },
    {
      title: 'Function Hall',
      slug: 'function-hall',
      content: `<h2>Function Hall</h2>
<p>The college has a spacious function hall equipped with modern audio-visual facilities to conduct seminars, workshops, cultural events, and guest lectures. It serves as a central hub for student activities and institutional gatherings, providing a comfortable and engaging environment for all attendees.</p>`
    },
    {
      title: 'Play Ground',
      slug: 'play-ground',
      content: `<h2>Play Ground</h2>
<p>A vast playground is available for students to participate in various outdoor sports like Cricket, Volleyball, Kabaddi, and Athletics. The college encourages physical fitness and sportsmanship by organizing regular sports events and tournaments, fostering a healthy and active lifestyle among students.</p>`
    },
    {
      title: 'Indoor Stadium',
      slug: 'indoor-stadium',
      content: `<h2>Indoor Stadium</h2>
<p>The indoor stadium provides facilities for games such as Badminton, Table Tennis, Chess, and Carrom, encouraging physical fitness alongside academics. It is a well-maintained facility that allows students to engage in indoor sports regardless of weather conditions, promoting a balanced approach to education and recreation.</p>`
    },
    {
      title: 'Multi-Gym',
      slug: 'multi-gym',
      content: `<h2>Multi-Gym facility</h2>
<p>To promote health and fitness among students, a fully equipped multi-gym is available on campus under the guidance of a physical education director. The gym offers a variety of modern fitness equipment catering to the physical well-being of the students.</p>

<hr />

<h2>Contact Details</h2>
<div class="bg-surface-50 p-6 rounded-xl border border-surface-200 mt-4 not-prose">
  <p class="font-bold text-lg mb-1 text-primary">Ravi V Gola</p>
  <p class="text-text-secondary mb-0">Assistant Professor<br/>GPP & VVS College, Sindagi</p>
</div>`
    },
    {
      title: 'Women\'s Hostel',
      slug: 'womens-hostel',
      content: `<h2>Hostel for Women</h2>
<p>The college provides secure and comfortable accommodation for female students coming from rural areas. The hostel includes facilities like a waste water treatment plant and solar water heaters, ensuring a sustainable and eco-friendly living environment. It is designed to offer a home away from home, with round-the-clock security and necessary amenities.</p>`
    },
    {
      title: 'Online Classes',
      slug: 'online-classes',
      content: `<h2>Online Classes & E-Learning</h2>
<p>We have adapted to modern teaching methodologies by providing online classes and e-learning resources through various platforms to ensure uninterrupted education. Our faculty is equipped to deliver engaging virtual lectures, providing students with the flexibility and resources needed to succeed in a digital learning environment.</p>`
    },
    {
      title: 'Campus Facilities',
      slug: 'facilities',
      content: `<h2>Other Facilities</h2>
<p>The campus is rich home for Flora & Fauna and several birds. The Institution has installed Solar On Grid, Rain water harvesting unit, and RO drinking water facilities to ensure a sustainable and student-friendly environment. We are committed to maintaining an eco-friendly campus that promotes environmental awareness and conservation.</p>`
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
